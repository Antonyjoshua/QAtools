import { convertFile } from "../core/engine";
import { validateFiles } from "./file-validation";
import { recordHistoryEntry } from "./storage";
import { sanitizeFilename } from "./security";
import { useConvertSettings } from "../settings-store";
import type { ConversionResult, ProgressCallback } from "../core/types";

export interface RunConversionParams {
  files: File[];
  inputFormat: string;
  outputFormat: string;
  options?: Record<string, unknown>;
  onProgress?: ProgressCallback;
}

export interface RunConversionOutcome {
  result: ConversionResult;
  historyId: string;
}

/** The one entry point the UI calls to run a conversion — validates the input, delegates to the
 * engine (which picks the right adapter), and records the outcome to history. The UI never talks
 * to convertFile() or an adapter directly. */
export async function runConversion(params: RunConversionParams): Promise<RunConversionOutcome> {
  const validation = validateFiles(params.files);
  const result: ConversionResult = validation.valid
    ? await convertFile({ files: params.files, inputFormat: params.inputFormat, outputFormat: params.outputFormat, options: params.options ?? {} }, params.onProgress)
    : { success: false, outputs: [], durationMs: 0, error: validation.error };

  const historyId = await recordHistoryEntry({
    originalFileName: params.files[0]?.name ?? "file",
    originalSize: params.files.reduce((sum, f) => sum + f.size, 0),
    inputFormat: params.inputFormat,
    outputFormat: params.outputFormat,
    result,
  });

  if (result.success) {
    useConvertSettings.getState().recordRecentPair(`${params.inputFormat}:${params.outputFormat}`);
  }

  return { result, historyId };
}

export function downloadOutput(name: string, blob: Blob): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = sanitizeFilename(name);
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
