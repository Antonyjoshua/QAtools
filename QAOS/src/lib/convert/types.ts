// User data — persisted conversion history. Separate from core/types.ts, which is the
// adapter-facing contract for running a conversion, not for storing its result afterward.

export interface ConversionHistoryOutput {
  name: string;
  size: number;
  format: string;
  /** Present only when Privacy Mode was off at conversion time — see settings-store. When
   * Privacy Mode is on (the default), only metadata is kept; the converted file itself is never
   * written to IndexedDB. */
  blob?: Blob;
}

export interface ConversionHistoryEntry {
  id: string;
  originalFileName: string;
  originalSize: number;
  outputs: ConversionHistoryOutput[];
  inputFormat: string;
  outputFormat: string;
  status: "completed" | "failed";
  errorMessage?: string;
  durationMs: number;
  createdAt: number;
  expiresAt: number;
}
