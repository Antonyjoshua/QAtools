import type { AdapterManifest, ConversionAdapter, ConversionRequest, ConversionResult, ProgressCallback, ConversionPair } from "../core/types";

const CONVERSIONS: ConversionPair[] = [
  { from: "jpg", to: "png" },
  { from: "jpg", to: "webp" },
  { from: "jpg", to: "ico" },
  { from: "jpg", to: "svg" },
  { from: "png", to: "jpg" },
  { from: "png", to: "webp" },
  { from: "png", to: "ico" },
  { from: "png", to: "svg" },
  { from: "webp", to: "jpg" },
  { from: "webp", to: "png" },
  { from: "webp", to: "ico" },
  { from: "webp", to: "svg" },
  { from: "bmp", to: "jpg" },
  { from: "bmp", to: "png" },
  { from: "bmp", to: "webp" },
  { from: "bmp", to: "ico" },
  { from: "bmp", to: "svg" },
  { from: "gif", to: "jpg" },
  { from: "gif", to: "png" },
  { from: "gif", to: "webp" },
  { from: "gif", to: "ico" },
  { from: "gif", to: "svg" },
  { from: "svg", to: "png" },
  { from: "svg", to: "jpg" },
  { from: "svg", to: "webp" },
  { from: "svg", to: "ico" },
];

export const imageManifest: AdapterManifest = {
  id: "image",
  label: "Image",
  conversions: CONVERSIONS,
  load: () => Promise.resolve(imageAdapter),
};

export interface ImageConversionOptions {
  quality?: number; // 0-100, for jpg/webp
  width?: number;
  height?: number;
  maintainAspectRatio?: boolean;
  backgroundColor?: string; // hex — used when flattening transparency (e.g. -> jpg, -> ico)
}

const MIME_BY_FORMAT: Record<string, string> = { jpg: "image/jpeg", png: "image/png", webp: "image/webp" };

async function loadImageElement(file: File): Promise<{ img: HTMLImageElement; objectUrl: string }> {
  const isSvg = file.type === "image/svg+xml" || file.name.toLowerCase().endsWith(".svg");
  let objectUrl: string;

  if (isSvg) {
    let text = await file.text();
    // SVGs without an explicit width/height/viewBox decode with natural size 0x0 — give them a
    // sane intrinsic size so the canvas isn't empty.
    if (!/width\s*=/.test(text) && !/viewBox/.test(text)) {
      text = text.replace("<svg", '<svg width="512" height="512"');
    }
    objectUrl = URL.createObjectURL(new Blob([text], { type: "image/svg+xml" }));
  } else {
    objectUrl = URL.createObjectURL(file);
  }

  const img = new Image();
  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error("decode-failed"));
    img.src = objectUrl;
  });

  return { img, objectUrl };
}

function computeDimensions(naturalWidth: number, naturalHeight: number, options: ImageConversionOptions): { width: number; height: number } {
  const maintainAspect = options.maintainAspectRatio ?? true;
  if (!options.width && !options.height) return { width: naturalWidth, height: naturalHeight };
  if (options.width && options.height && !maintainAspect) return { width: options.width, height: options.height };
  if (options.width) return { width: options.width, height: Math.round((naturalHeight / naturalWidth) * options.width) };
  if (options.height) return { width: Math.round((naturalWidth / naturalHeight) * options.height!), height: options.height! };
  return { width: naturalWidth, height: naturalHeight };
}

function renderToCanvas(img: HTMLImageElement, width: number, height: number, backgroundColor?: string): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("canvas-unavailable");
  if (backgroundColor) {
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, width, height);
  }
  ctx.drawImage(img, 0, 0, width, height);
  return canvas;
}

function canvasToBlob(canvas: HTMLCanvasElement, mime: string, quality?: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("encode-failed"))),
      mime,
      quality !== undefined ? quality / 100 : undefined
    );
  });
}

/** Packs a single canvas-rendered image into a minimal valid ICO container (PNG-in-ICO, supported
 * since Vista) — the same technique used for this app's own favicon.ico. */
async function canvasToIco(canvas: HTMLCanvasElement): Promise<Blob> {
  const size = Math.min(256, Math.max(canvas.width, canvas.height));
  const square = document.createElement("canvas");
  square.width = size;
  square.height = size;
  const ctx = square.getContext("2d");
  if (!ctx) throw new Error("canvas-unavailable");
  ctx.drawImage(canvas, 0, 0, size, size);
  const pngBlob = await canvasToBlob(square, "image/png");
  const pngBytes = new Uint8Array(await pngBlob.arrayBuffer());

  const header = new Uint8Array(6 + 16);
  const view = new DataView(header.buffer);
  view.setUint16(0, 0, true); // reserved
  view.setUint16(2, 1, true); // type: icon
  view.setUint16(4, 1, true); // 1 image
  header[6] = size >= 256 ? 0 : size; // width (0 means 256)
  header[7] = size >= 256 ? 0 : size; // height
  header[8] = 0; // color palette
  header[9] = 0; // reserved
  view.setUint16(10, 1, true); // color planes
  view.setUint16(12, 32, true); // bits per pixel
  view.setUint32(14, pngBytes.length, true); // image data size
  view.setUint32(18, header.length, true); // offset to image data

  return new Blob([header, pngBytes], { type: "image/x-icon" });
}

function canvasToSvgWrapper(canvas: HTMLCanvasElement): Blob {
  const dataUrl = canvas.toDataURL("image/png");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${canvas.width}" height="${canvas.height}" viewBox="0 0 ${canvas.width} ${canvas.height}"><image width="${canvas.width}" height="${canvas.height}" href="${dataUrl}"/></svg>`;
  return new Blob([svg], { type: "image/svg+xml" });
}

export const imageAdapter: ConversionAdapter = {
  id: "image",
  async convert(request: ConversionRequest, onProgress: ProgressCallback): Promise<ConversionResult> {
    const start = Date.now();
    const file = request.files[0];
    const options = request.options as ImageConversionOptions;

    try {
      onProgress({ stage: "processing", percent: 10, message: "Decoding image…" });
      const { img, objectUrl } = await loadImageElement(file);
      const { width, height } = computeDimensions(img.naturalWidth, img.naturalHeight, options);

      onProgress({ stage: "converting", percent: 50, message: "Rendering…" });
      const needsFlatten = request.outputFormat === "jpg" || request.outputFormat === "ico";
      const canvas = renderToCanvas(img, width, height, needsFlatten ? (options.backgroundColor ?? "#ffffff") : undefined);
      URL.revokeObjectURL(objectUrl);

      onProgress({ stage: "finalizing", percent: 85, message: "Encoding…" });
      let blob: Blob;
      if (request.outputFormat === "svg") {
        blob = canvasToSvgWrapper(canvas);
      } else if (request.outputFormat === "ico") {
        blob = await canvasToIco(canvas);
      } else {
        const mime = MIME_BY_FORMAT[request.outputFormat];
        if (!mime) throw new Error("unsupported-output");
        blob = await canvasToBlob(canvas, mime, options.quality);
      }

      const baseName = file.name.replace(/\.[^.]+$/, "");
      onProgress({ stage: "completed", percent: 100 });
      return {
        success: true,
        outputs: [{ name: `${baseName}.${request.outputFormat}`, blob, format: request.outputFormat }],
        durationMs: Date.now() - start,
      };
    } catch {
      return {
        success: false,
        outputs: [],
        durationMs: Date.now() - start,
        error: { code: "corrupted-file", message: "This image couldn't be read. It may be corrupted or in an unsupported variant of this format." },
      };
    }
  },
};
