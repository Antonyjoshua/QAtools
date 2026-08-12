import { PDFDocument, degrees } from "pdf-lib";
import type { ConversionAdapter, ConversionRequest, ConversionResult, ConversionOutputFile, ProgressCallback, ConversionError } from "../core/types";
import type { PdfConversionOptions } from "./pdf-adapter";

function baseName(fileName: string): string {
  return fileName.replace(/\.[^.]+$/, "");
}

function isEncryptionError(err: unknown): boolean {
  const message = err instanceof Error ? err.message.toLowerCase() : "";
  return message.includes("encrypt") || message.includes("password");
}

function friendlyPdfError(err: unknown): ConversionError {
  if (isEncryptionError(err)) {
    return { code: "password-protected", message: "This PDF is password-protected. Remove the password before converting." };
  }
  return { code: "corrupted-file", message: "This PDF couldn't be read. It may be corrupted or in an unsupported PDF variant." };
}

function parseSplitGroups(input: string | undefined, maxPage: number): number[][] {
  if (!input || !input.trim()) return Array.from({ length: maxPage }, (_, i) => [i + 1]);
  return input
    .split(",")
    .map((part) => {
      const trimmed = part.trim();
      const rangeMatch = trimmed.match(/^(\d+)-(\d+)$/);
      if (rangeMatch) {
        const from = parseInt(rangeMatch[1], 10);
        const to = parseInt(rangeMatch[2], 10);
        const pages: number[] = [];
        for (let p = from; p <= to; p++) if (p >= 1 && p <= maxPage) pages.push(p);
        return pages;
      }
      const n = parseInt(trimmed, 10);
      return n >= 1 && n <= maxPage ? [n] : [];
    })
    .filter((g) => g.length > 0);
}

async function mergePdfs(files: File[], onProgress: ProgressCallback): Promise<ConversionOutputFile> {
  const merged = await PDFDocument.create();
  for (let i = 0; i < files.length; i++) {
    const src = await PDFDocument.load(await files[i].arrayBuffer());
    const pages = await merged.copyPages(src, src.getPageIndices());
    pages.forEach((p) => merged.addPage(p));
    onProgress({ stage: "converting", percent: Math.round(((i + 1) / files.length) * 80), message: `Merging ${files[i].name}…` });
  }
  const bytes = await merged.save();
  return { name: "merged.pdf", blob: new Blob([bytes as BlobPart], { type: "application/pdf" }), format: "pdf" };
}

async function splitPdf(file: File, options: PdfConversionOptions, onProgress: ProgressCallback): Promise<ConversionOutputFile[]> {
  const src = await PDFDocument.load(await file.arrayBuffer());
  const groups = parseSplitGroups(options.pageRanges, src.getPageCount());
  const outputs: ConversionOutputFile[] = [];
  for (let i = 0; i < groups.length; i++) {
    const doc = await PDFDocument.create();
    const pages = await doc.copyPages(src, groups[i].map((p) => p - 1));
    pages.forEach((p) => doc.addPage(p));
    const bytes = await doc.save();
    outputs.push({ name: `${baseName(file.name)}-part${i + 1}.pdf`, blob: new Blob([bytes as BlobPart], { type: "application/pdf" }), format: "pdf" });
    onProgress({ stage: "converting", percent: Math.round(((i + 1) / groups.length) * 80), message: `Splitting… (${i + 1}/${groups.length})` });
  }
  return outputs;
}

async function rotatePdf(file: File, options: PdfConversionOptions, onProgress: ProgressCallback): Promise<ConversionOutputFile> {
  const doc = await PDFDocument.load(await file.arrayBuffer());
  const deg = options.rotateDegrees ?? 90;
  const targetPages = options.rotatePages === undefined || options.rotatePages === "all" ? doc.getPageIndices() : options.rotatePages.map((p) => p - 1);
  targetPages.forEach((i) => {
    const page = doc.getPage(i);
    page.setRotation(degrees((page.getRotation().angle + deg) % 360));
  });
  onProgress({ stage: "converting", percent: 70 });
  const bytes = await doc.save();
  return { name: `${baseName(file.name)}-rotated.pdf`, blob: new Blob([bytes as BlobPart], { type: "application/pdf" }), format: "pdf" };
}

async function reorderPdf(file: File, options: PdfConversionOptions, onProgress: ProgressCallback): Promise<ConversionOutputFile> {
  const src = await PDFDocument.load(await file.arrayBuffer());
  const order = options.pageOrder && options.pageOrder.length > 0 ? options.pageOrder : src.getPageIndices().map((i) => i + 1);
  const doc = await PDFDocument.create();
  const pages = await doc.copyPages(src, order.map((p) => p - 1));
  pages.forEach((p) => doc.addPage(p));
  onProgress({ stage: "converting", percent: 70 });
  const bytes = await doc.save();
  return { name: `${baseName(file.name)}-edited.pdf`, blob: new Blob([bytes as BlobPart], { type: "application/pdf" }), format: "pdf" };
}

async function compressPdf(file: File, onProgress: ProgressCallback): Promise<ConversionOutputFile> {
  const doc = await PDFDocument.load(await file.arrayBuffer());
  onProgress({ stage: "converting", percent: 70 });
  // Real recompression (re-encoding embedded images at a lower quality) is out of scope for a
  // client-side library — this re-saves with compact object streams, which reliably shaves size
  // off PDFs with many small objects (forms, annotations) without touching image data.
  const bytes = await doc.save({ useObjectStreams: true });
  return { name: `${baseName(file.name)}-compressed.pdf`, blob: new Blob([bytes as BlobPart], { type: "application/pdf" }), format: "pdf" };
}

async function resolvePageNumbers(pdfjs: typeof import("pdfjs-dist"), file: File, pages: PdfConversionOptions["pages"]) {
  const pdf = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
  const all = Array.from({ length: pdf.numPages }, (_, i) => i + 1);
  const selected = !pages || pages === "all" ? all : pages.filter((p) => p >= 1 && p <= pdf.numPages);
  return { pdf, selected };
}

async function loadPdfjs() {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
  return pdfjs;
}

async function pdfToImages(file: File, outputFormat: "jpg" | "png", options: PdfConversionOptions, onProgress: ProgressCallback): Promise<ConversionOutputFile[]> {
  const pdfjs = await loadPdfjs();
  const { pdf, selected } = await resolvePageNumbers(pdfjs, file, options.pages);
  const scale = (options.resolution ?? 150) / 72;
  const outputs: ConversionOutputFile[] = [];

  for (let i = 0; i < selected.length; i++) {
    const page = await pdf.getPage(selected[i]);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("canvas-unavailable");
    if (outputFormat === "jpg") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    await page.render({ canvasContext: ctx, viewport, canvas }).promise;
    const mime = outputFormat === "jpg" ? "image/jpeg" : "image/png";
    const blob: Blob = await new Promise((resolve, reject) =>
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("encode-failed"))), mime, options.quality ? options.quality / 100 : undefined)
    );
    outputs.push({ name: `${baseName(file.name)}-page${selected[i]}.${outputFormat}`, blob, format: outputFormat });
    onProgress({ stage: "converting", percent: Math.round(((i + 1) / selected.length) * 85), message: `Rendering page ${selected[i]}…` });
  }
  return outputs;
}

async function pdfToText(file: File, options: PdfConversionOptions, onProgress: ProgressCallback): Promise<ConversionOutputFile> {
  const pdfjs = await loadPdfjs();
  const { selected, pdf } = await resolvePageNumbers(pdfjs, file, options.pages);
  const parts: string[] = [];
  for (let i = 0; i < selected.length; i++) {
    const page = await pdf.getPage(selected[i]);
    const content = await page.getTextContent();
    const text = content.items.map((item) => ("str" in item ? item.str : "")).join(" ");
    parts.push(text);
    onProgress({ stage: "converting", percent: Math.round(((i + 1) / selected.length) * 85), message: `Extracting page ${selected[i]}…` });
  }
  return { name: `${baseName(file.name)}.txt`, blob: new Blob([parts.join("\n\n")], { type: "text/plain" }), format: "txt" };
}

export const pdfAdapter: ConversionAdapter = {
  id: "pdf",
  async convert(request: ConversionRequest, onProgress: ProgressCallback): Promise<ConversionResult> {
    const start = Date.now();
    const options = (request.options ?? {}) as PdfConversionOptions;

    try {
      onProgress({ stage: "processing", percent: 10, message: "Reading PDF…" });

      if (request.outputFormat === "pdf") {
        const operation = options.operation ?? "compress";
        let outputs: ConversionOutputFile[];
        if (operation === "merge") outputs = [await mergePdfs(request.files, onProgress)];
        else if (operation === "split") outputs = await splitPdf(request.files[0], options, onProgress);
        else if (operation === "rotate") outputs = [await rotatePdf(request.files[0], options, onProgress)];
        else if (operation === "reorder") outputs = [await reorderPdf(request.files[0], options, onProgress)];
        else outputs = [await compressPdf(request.files[0], onProgress)];
        onProgress({ stage: "completed", percent: 100 });
        return { success: true, outputs, durationMs: Date.now() - start };
      }

      if (request.outputFormat === "jpg" || request.outputFormat === "png") {
        const outputs = await pdfToImages(request.files[0], request.outputFormat, options, onProgress);
        onProgress({ stage: "completed", percent: 100 });
        return { success: true, outputs, durationMs: Date.now() - start };
      }

      if (request.outputFormat === "txt") {
        const output = await pdfToText(request.files[0], options, onProgress);
        onProgress({ stage: "completed", percent: 100 });
        return { success: true, outputs: [output], durationMs: Date.now() - start };
      }

      throw new Error("unsupported-conversion");
    } catch (err) {
      return { success: false, outputs: [], durationMs: Date.now() - start, error: friendlyPdfError(err) };
    }
  },
};
