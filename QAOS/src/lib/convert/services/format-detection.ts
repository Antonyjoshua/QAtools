import { getFormat, getFormatByExtension, FORMATS } from "../core/format-registry";
import type { FormatDefinition } from "../core/types";

function extensionOf(fileName: string): string {
  const match = fileName.match(/\.[a-z0-9]+$/i);
  return match ? match[0].toLowerCase() : "";
}

/** Detects a file's format from its extension first (most reliable for desktop-authored files —
 * browsers often report a blank or generic `file.type` for office/document formats), falling
 * back to MIME type. */
export function detectFormat(file: File): FormatDefinition | undefined {
  const byExtension = getFormatByExtension(extensionOf(file.name));
  if (byExtension) return byExtension;
  if (file.type) return FORMATS.find((f) => f.mimeTypes.includes(file.type));
  return undefined;
}

export function detectFormatById(id: string): FormatDefinition | undefined {
  return getFormat(id);
}

export interface DetectedFile {
  file: File;
  format: FormatDefinition | undefined;
  extension: string;
  sizeBytes: number;
}

export function detectFile(file: File): DetectedFile {
  return { file, format: detectFormat(file), extension: extensionOf(file.name), sizeBytes: file.size };
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}
