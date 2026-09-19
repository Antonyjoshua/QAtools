export type DummyFileFormat =
  | "txt"
  | "csv"
  | "json"
  | "xml"
  | "html"
  | "pdf"
  | "docx"
  | "xlsx"
  | "zip"
  | "png"
  | "jpg"
  | "bin";

export type DummyFileGroup = "Text & Data" | "Documents" | "Images" | "Binary";

export interface DummyFileFormatDef {
  format: DummyFileFormat;
  label: string;
  extension: string;
  mimeType: string;
  group: DummyFileGroup;
  /** Smallest size a genuinely valid file of this format can honestly be. */
  minBytes: number;
  /** Whether the final byte size is guaranteed exact vs. a close approximation. */
  exactSize: boolean;
}

export const DUMMY_FILE_FORMATS: DummyFileFormatDef[] = [
  { format: "txt", label: "Plain Text", extension: "txt", mimeType: "text/plain", group: "Text & Data", minBytes: 1, exactSize: true },
  { format: "csv", label: "CSV", extension: "csv", mimeType: "text/csv", group: "Text & Data", minBytes: 40, exactSize: true },
  { format: "json", label: "JSON", extension: "json", mimeType: "application/json", group: "Text & Data", minBytes: 20, exactSize: true },
  { format: "xml", label: "XML", extension: "xml", mimeType: "application/xml", group: "Text & Data", minBytes: 60, exactSize: true },
  { format: "html", label: "HTML", extension: "html", mimeType: "text/html", group: "Text & Data", minBytes: 120, exactSize: true },
  { format: "pdf", label: "PDF", extension: "pdf", mimeType: "application/pdf", group: "Documents", minBytes: 1200, exactSize: false },
  { format: "docx", label: "Word (DOCX)", extension: "docx", mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document", group: "Documents", minBytes: 6000, exactSize: true },
  { format: "xlsx", label: "Excel (XLSX)", extension: "xlsx", mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", group: "Documents", minBytes: 6000, exactSize: true },
  { format: "zip", label: "ZIP Archive", extension: "zip", mimeType: "application/zip", group: "Documents", minBytes: 200, exactSize: true },
  { format: "png", label: "PNG Image", extension: "png", mimeType: "image/png", group: "Images", minBytes: 2000, exactSize: true },
  { format: "jpg", label: "JPEG Image", extension: "jpg", mimeType: "image/jpeg", group: "Images", minBytes: 2000, exactSize: true },
  { format: "bin", label: "Raw Binary", extension: "bin", mimeType: "application/octet-stream", group: "Binary", minBytes: 0, exactSize: true },
];

export function getDummyFileFormatDef(format: DummyFileFormat): DummyFileFormatDef {
  const def = DUMMY_FILE_FORMATS.find((f) => f.format === format);
  if (!def) throw new Error(`Unknown dummy file format: ${format}`);
  return def;
}

export interface GeneratedDummyFile {
  bytes: Uint8Array;
  filename: string;
  mimeType: string;
  requestedBytes: number;
  actualBytes: number;
}
