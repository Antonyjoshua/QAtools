import type { ConversionAdapter, ConversionRequest, ConversionResult, ProgressCallback, ConversionStage } from "../core/types";
import type { OcrConversionOptions } from "./ocr-adapter";
import type Tesseract from "tesseract.js";

function baseName(fileName: string): string {
  return fileName.replace(/\.[^.]+$/, "");
}

// A single worker is created once and reused for every OCR job in this tab — re-initializing it
// (which re-loads the ~15MB core+language assets) on every conversion would make each one feel
// like the first. Assets are served locally (public/tesseract/) rather than tesseract.js's default
// CDN, matching how this app self-hosts pdf.worker.min.mjs and sql-wasm.wasm elsewhere.
let workerPromise: Promise<Tesseract.Worker> | undefined;

// Conversions run one at a time (conversion-hub.tsx awaits each job in sequence), so a single
// mutable "who to report progress to" slot is safe — there's never more than one in-flight job.
let activeProgressHandler: ProgressCallback | null = null;

function mapLoggerToProgress(status: string, progress: number): { stage: ConversionStage; percent: number; message: string } {
  if (status.includes("recogniz")) {
    return { stage: "converting", percent: Math.round(45 + progress * 50), message: "Reading text from image…" };
  }
  return { stage: "processing", percent: Math.round(5 + progress * 30), message: "Loading OCR engine…" };
}

async function getWorker(): Promise<Tesseract.Worker> {
  if (!workerPromise) {
    const { createWorker, OEM } = await import("tesseract.js");
    workerPromise = createWorker("eng", OEM.LSTM_ONLY, {
      workerPath: "/tesseract/worker.min.js",
      corePath: "/tesseract/core",
      langPath: "/tesseract/lang-data",
      logger: (m) => activeProgressHandler?.(mapLoggerToProgress(m.status, m.progress)),
    });
  }
  return workerPromise;
}

async function loadImageElement(file: File): Promise<{ img: HTMLImageElement; objectUrl: string }> {
  const objectUrl = URL.createObjectURL(file);
  const img = new Image();
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error("decode-failed"));
    img.src = objectUrl;
  });
  return { img, objectUrl };
}

/** Grayscale + a linear contrast stretch (5th/95th percentile clipped, to ignore paper-shadow and
 * ink-blot outliers) — makes pen/pencil strokes stand out from paper texture and faint ruling
 * without fully binarizing, which would lose lighter strokes entirely. */
function boostHandwritingContrast(ctx: CanvasRenderingContext2D, width: number, height: number): void {
  const imageData = ctx.getImageData(0, 0, width, height);
  const { data } = imageData;
  const pixelCount = width * height;
  const gray = new Uint8ClampedArray(pixelCount);
  const histogram = new Uint32Array(256);

  for (let i = 0; i < pixelCount; i++) {
    const o = i * 4;
    const g = Math.round(0.299 * data[o] + 0.587 * data[o + 1] + 0.114 * data[o + 2]);
    gray[i] = g;
    histogram[g]++;
  }

  const lowCut = pixelCount * 0.05;
  const highCut = pixelCount * 0.95;
  let seen = 0;
  let lo = 0;
  let hi = 255;
  for (let v = 0; v < 256; v++) {
    seen += histogram[v];
    if (seen >= lowCut) {
      lo = v;
      break;
    }
  }
  seen = 0;
  for (let v = 255; v >= 0; v--) {
    seen += histogram[v];
    if (seen >= pixelCount - highCut) {
      hi = v;
      break;
    }
  }
  const range = Math.max(1, hi - lo);

  for (let i = 0; i < pixelCount; i++) {
    const stretched = Math.round(((gray[i] - lo) / range) * 255);
    const o = i * 4;
    data[o] = data[o + 1] = data[o + 2] = stretched;
  }
  ctx.putImageData(imageData, 0, 0);
}

/** Applies rotation and (optionally) handwriting preprocessing. Returns the original file
 * untouched when no preprocessing is requested, to avoid a lossy re-encode on the already-verified
 * printed-text path. */
async function preprocessImage(file: File, options: OcrConversionOptions): Promise<File | Blob> {
  const rotate = options.rotateDegrees ?? 0;
  if (rotate === 0 && !options.handwriting) return file;

  const { img, objectUrl } = await loadImageElement(file);
  try {
    const swapDims = rotate === 90 || rotate === 270;
    const naturalWidth = swapDims ? img.naturalHeight : img.naturalWidth;
    const naturalHeight = swapDims ? img.naturalWidth : img.naturalHeight;

    // Small photos of notebook pages often aren't high-enough resolution for fine strokes —
    // upscale modestly before recognition rather than after (Tesseract itself doesn't upscale).
    const upscale = options.handwriting && Math.max(naturalWidth, naturalHeight) < 1600 ? 1600 / Math.max(naturalWidth, naturalHeight) : 1;
    const width = Math.round(naturalWidth * upscale);
    const height = Math.round(naturalHeight * upscale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("canvas-unavailable");
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.rotate((rotate * Math.PI) / 180);
    const drawWidth = swapDims ? height : width;
    const drawHeight = swapDims ? width : height;
    ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
    ctx.restore();

    if (options.handwriting) boostHandwritingContrast(ctx, width, height);

    return await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error("encode-failed"))), "image/png")
    );
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export const ocrAdapter: ConversionAdapter = {
  id: "ocr",
  async convert(request: ConversionRequest, onProgress: ProgressCallback): Promise<ConversionResult> {
    const start = Date.now();
    const file = request.files[0];
    const options = (request.options ?? {}) as OcrConversionOptions;

    activeProgressHandler = onProgress;
    try {
      onProgress({ stage: "processing", percent: 2, message: "Preparing image…" });
      const image = await preprocessImage(file, options);

      onProgress({ stage: "processing", percent: 4, message: "Loading OCR engine…" });
      const worker = await getWorker();
      const { data } = await worker.recognize(image);
      const text = data.text.trim();

      onProgress({ stage: "completed", percent: 100 });
      return {
        success: true,
        outputs: [{ name: `${baseName(file.name)}.txt`, blob: new Blob([text], { type: "text/plain" }), format: "txt" }],
        durationMs: Date.now() - start,
      };
    } catch {
      return {
        success: false,
        outputs: [],
        durationMs: Date.now() - start,
        error: { code: "corrupted-file", message: "Couldn't extract text from this image. Try a clearer or higher-resolution image." },
      };
    } finally {
      activeProgressHandler = null;
    }
  },
};
