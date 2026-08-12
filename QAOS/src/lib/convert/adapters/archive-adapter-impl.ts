import JSZip from "jszip";
import * as pako from "pako";
import type { ConversionAdapter, ConversionRequest, ConversionResult, ProgressCallback } from "../core/types";

async function createZip(files: File[], onProgress: ProgressCallback): Promise<ConversionResult> {
  const start = Date.now();
  const zip = new JSZip();
  for (const file of files) {
    zip.file(file.name, file);
  }
  onProgress({ stage: "converting", percent: 50, message: "Compressing…" });
  const blob = await zip.generateAsync({ type: "blob", compression: "DEFLATE" }, (metadata) => {
    onProgress({ stage: "converting", percent: 50 + Math.round(metadata.percent * 0.4), message: "Compressing…" });
  });
  onProgress({ stage: "completed", percent: 100 });
  const name = files.length === 1 ? `${files[0].name.replace(/\.[^.]+$/, "")}.zip` : "archive.zip";
  return { success: true, outputs: [{ name, blob, format: "zip" }], durationMs: Date.now() - start };
}

async function extractZip(file: File, onProgress: ProgressCallback): Promise<ConversionResult> {
  const start = Date.now();
  const zip = await JSZip.loadAsync(file);
  const entries = Object.values(zip.files).filter((f) => !f.dir);
  const outputs = [];
  let i = 0;
  for (const entry of entries) {
    const blob = await entry.async("blob");
    outputs.push({ name: entry.name, blob, format: entry.name.split(".").pop() ?? "bin" });
    i++;
    onProgress({ stage: "converting", percent: Math.round((i / entries.length) * 90), message: `Extracting ${entry.name}…` });
  }
  onProgress({ stage: "completed", percent: 100 });
  return { success: true, outputs, durationMs: Date.now() - start };
}

async function gzipCompress(file: File, onProgress: ProgressCallback): Promise<ConversionResult> {
  const start = Date.now();
  onProgress({ stage: "converting", percent: 40, message: "Compressing…" });
  const bytes = new Uint8Array(await file.arrayBuffer());
  const compressed = pako.gzip(bytes);
  onProgress({ stage: "completed", percent: 100 });
  return {
    success: true,
    outputs: [{ name: `${file.name}.gz`, blob: new Blob([compressed as BlobPart], { type: "application/gzip" }), format: "gz" }],
    durationMs: Date.now() - start,
  };
}

async function gzipDecompress(file: File, onProgress: ProgressCallback): Promise<ConversionResult> {
  const start = Date.now();
  onProgress({ stage: "converting", percent: 40, message: "Decompressing…" });
  const bytes = new Uint8Array(await file.arrayBuffer());
  const decompressed = pako.ungzip(bytes);
  onProgress({ stage: "completed", percent: 100 });
  const name = file.name.replace(/\.gz$/i, "") || "decompressed.bin";
  return {
    success: true,
    outputs: [{ name, blob: new Blob([decompressed as BlobPart]), format: name.split(".").pop() ?? "bin" }],
    durationMs: Date.now() - start,
  };
}

export const archiveAdapter: ConversionAdapter = {
  id: "archive",
  async convert(request: ConversionRequest, onProgress: ProgressCallback): Promise<ConversionResult> {
    const start = Date.now();
    try {
      onProgress({ stage: "processing", percent: 10 });
      if (request.outputFormat === "zip") return await createZip(request.files, onProgress);
      if (request.inputFormat === "zip" && request.outputFormat === "extracted") return await extractZip(request.files[0], onProgress);
      if (request.outputFormat === "gz") return await gzipCompress(request.files[0], onProgress);
      if (request.inputFormat === "gz" && request.outputFormat === "extracted") return await gzipDecompress(request.files[0], onProgress);
      throw new Error("unsupported-conversion");
    } catch {
      return {
        success: false,
        outputs: [],
        durationMs: Date.now() - start,
        error: { code: "corrupted-file", message: "This archive couldn't be read. It may be corrupted, encrypted, or in an unsupported format." },
      };
    }
  },
};
