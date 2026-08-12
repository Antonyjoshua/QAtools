// ---------------------------------------------------------------------------
// Core conversion types. The UI never imports adapter code directly — it talks
// to convertFile() (see core/engine.ts) with a request shaped like this, and
// gets a result shaped like this back. Adding a new format/adapter never
// requires touching these types or the UI.
// ---------------------------------------------------------------------------

export type FileCategory = "document" | "spreadsheet" | "presentation" | "pdf" | "image" | "data" | "archive";

export interface FormatDefinition {
  id: string; // "pdf", "docx", "xlsx", "png", ...
  label: string; // "PDF Document"
  category: FileCategory;
  extensions: string[]; // [".pdf"]
  mimeTypes: string[];
  icon: string; // lucide icon name, resolved via DynamicIcon
}

export interface ConversionRequest {
  files: File[]; // more than one only for multi-input jobs (merge PDF, create ZIP)
  inputFormat: string;
  outputFormat: string;
  options: Record<string, unknown>;
}

export interface ConversionOutputFile {
  name: string;
  blob: Blob;
  format: string;
}

export type ConversionErrorCode =
  | "unsupported-format"
  | "unsupported-conversion"
  | "corrupted-file"
  | "password-protected"
  | "file-too-large"
  | "invalid-extension"
  | "requires-backend"
  | "timeout"
  | "unknown";

export interface ConversionError {
  code: ConversionErrorCode;
  message: string; // always user-facing — never a raw stack trace
}

export interface ConversionResult {
  success: boolean;
  outputs: ConversionOutputFile[];
  error?: ConversionError;
  durationMs: number;
}

export type ConversionStage = "uploading" | "processing" | "converting" | "finalizing" | "completed" | "failed";

export interface ConversionProgressEvent {
  stage: ConversionStage;
  percent: number; // 0-100
  message?: string;
}

export type ProgressCallback = (event: ConversionProgressEvent) => void;

/** What an adapter actually implements. Adapters are dynamically imported — see AdapterManifest. */
export interface ConversionAdapter {
  id: string;
  convert(request: ConversionRequest, onProgress: ProgressCallback): Promise<ConversionResult>;
}

export interface ConversionPair {
  from: string;
  to: string;
  /** True for conversions that are listed/discoverable but not yet implemented client-side —
   * they need real server-side tooling (LibreOffice/Pandoc-grade). The UI shows these as
   * "Coming soon" rather than hiding them, so the format matrix stays honest about scope. */
  requiresBackend?: boolean;
}

/** Lightweight, always-loaded metadata about an adapter. The heavy implementation (`load`) is
 * only fetched when a conversion using it actually runs — this is what keeps pdf-lib, mammoth,
 * pdfjs, etc. out of the initial bundle. */
export interface AdapterManifest {
  id: string;
  label: string;
  conversions: ConversionPair[];
  load: () => Promise<ConversionAdapter>;
}
