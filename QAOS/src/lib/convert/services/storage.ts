import { db } from "../db";
import { uid } from "../id";
import { useConvertSettings } from "../settings-store";
import type { ConversionHistoryEntry } from "../types";
import type { ConversionResult } from "../core/types";

const EXPIRATION_MS = 24 * 60 * 60 * 1000; // 24h — "conversion expiration"

export interface RecordHistoryParams {
  originalFileName: string;
  originalSize: number;
  inputFormat: string;
  outputFormat: string;
  result: ConversionResult;
}

export async function recordHistoryEntry(params: RecordHistoryParams): Promise<string> {
  const privacyMode = useConvertSettings.getState().privacyMode;
  const id = uid();
  const entry: ConversionHistoryEntry = {
    id,
    originalFileName: params.originalFileName,
    originalSize: params.originalSize,
    outputs: params.result.outputs.map((o) => ({
      name: o.name,
      size: o.blob.size,
      format: o.format,
      blob: privacyMode ? undefined : o.blob,
    })),
    inputFormat: params.inputFormat,
    outputFormat: params.outputFormat,
    status: params.result.success ? "completed" : "failed",
    errorMessage: params.result.error?.message,
    durationMs: params.result.durationMs,
    createdAt: Date.now(),
    expiresAt: Date.now() + EXPIRATION_MS,
  };
  await db.history.add(entry);
  return id;
}

export async function deleteHistoryEntry(id: string): Promise<void> {
  await db.history.delete(id);
}

export async function clearHistory(): Promise<void> {
  await db.history.clear();
}

/** Purges history rows past their expiration — called opportunistically (history page mount) since
 * this is a client-only app with no background job runner. */
export async function cleanupExpiredHistory(): Promise<number> {
  const now = Date.now();
  const expired = await db.history.where("expiresAt").below(now).primaryKeys();
  if (expired.length > 0) await db.history.bulkDelete(expired);
  return expired.length;
}
