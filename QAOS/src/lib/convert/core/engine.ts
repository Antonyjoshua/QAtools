import type { ConversionRequest, ConversionResult, ProgressCallback, AdapterManifest, ConversionPair } from "./types";
import { BACKEND_PENDING_CONVERSIONS } from "./backend-pending";
import { imageManifest } from "../adapters/image-adapter";
import { textDataManifest } from "../adapters/text-data-adapter";
import { archiveManifest } from "../adapters/archive-adapter";
import { spreadsheetManifest } from "../adapters/spreadsheet-adapter";
import { pdfManifest } from "../adapters/pdf-adapter";
import { documentManifest } from "../adapters/document-adapter";

// Manifests are plain data (id + supported pairs + a dynamic `load()`) — importing them here is
// cheap. The heavy libraries (pdf-lib, mammoth, pdfjs, xlsx, jszip, ...) only get pulled into the
// bundle when `manifest.load()` actually runs, i.e. when a matching conversion is requested.
export const ADAPTER_MANIFESTS: AdapterManifest[] = [imageManifest, textDataManifest, archiveManifest, spreadsheetManifest, pdfManifest, documentManifest];

function pairMatches(pair: ConversionPair, from: string, to: string): boolean {
  return (pair.from === from || pair.from === "*") && pair.to === to;
}

/** Every known conversion pair across all adapters, plus the backend-pending ones — this is the
 * full picture the format matrix and format selector render from. */
export function getAllConversionPairs(): (ConversionPair & { adapterId: string })[] {
  const implemented = ADAPTER_MANIFESTS.flatMap((m) => m.conversions.map((c) => ({ ...c, adapterId: m.id })));
  const pending = BACKEND_PENDING_CONVERSIONS.map((c) => ({ ...c, adapterId: "backend-pending" }));
  return [...implemented, ...pending];
}

export function getSupportedOutputs(inputFormat: string): (ConversionPair & { adapterId: string })[] {
  return getAllConversionPairs().filter((p) => p.from === inputFormat || p.from === "*");
}

export interface ConversionAvailability {
  supported: boolean;
  requiresBackend: boolean;
}

export function getConversionAvailability(from: string, to: string): ConversionAvailability {
  const implemented = ADAPTER_MANIFESTS.some((m) => m.conversions.some((c) => pairMatches(c, from, to) && !c.requiresBackend));
  if (implemented) return { supported: true, requiresBackend: false };
  const pending = BACKEND_PENDING_CONVERSIONS.some((c) => c.from === from && c.to === to);
  return { supported: false, requiresBackend: pending };
}

function findManifestFor(inputFormat: string, outputFormat: string): AdapterManifest | undefined {
  return ADAPTER_MANIFESTS.find((m) => m.conversions.some((c) => pairMatches(c, inputFormat, outputFormat) && !c.requiresBackend));
}

const NOOP_PROGRESS: ProgressCallback = () => {};

/** The one function the UI ever calls to run a conversion — it never talks to an adapter
 * directly. Adding a new format/adapter never requires touching this function or the UI, only
 * registering a new manifest above. */
export async function convertFile(request: ConversionRequest, onProgress: ProgressCallback = NOOP_PROGRESS): Promise<ConversionResult> {
  const start = Date.now();
  const manifest = findManifestFor(request.inputFormat, request.outputFormat);

  if (!manifest) {
    const { requiresBackend } = getConversionAvailability(request.inputFormat, request.outputFormat);
    return {
      success: false,
      outputs: [],
      durationMs: Date.now() - start,
      error: requiresBackend
        ? { code: "requires-backend", message: "This conversion needs server-side processing, which isn't available yet — it's on the roadmap." }
        : { code: "unsupported-conversion", message: "This conversion isn't supported." },
    };
  }

  try {
    onProgress({ stage: "uploading", percent: 2 });
    const adapter = await manifest.load();
    return await adapter.convert(request, onProgress);
  } catch {
    return {
      success: false,
      outputs: [],
      durationMs: Date.now() - start,
      error: { code: "unknown", message: "Something went wrong during conversion. Please try again." },
    };
  }
}
