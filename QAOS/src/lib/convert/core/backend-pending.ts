import type { ConversionPair } from "./types";

// Conversions the module knows about — they appear in the format selector and the format
// matrix — but doesn't implement yet, because they need real server-side tooling
// (LibreOffice/Pandoc-grade document rendering) that a fully client-side app can't provide with
// good fidelity. Listed honestly as "Coming soon" rather than silently omitted.
export const BACKEND_PENDING_CONVERSIONS: ConversionPair[] = [
  { from: "pdf", to: "docx", requiresBackend: true },
  { from: "pdf", to: "xlsx", requiresBackend: true },
  { from: "pdf", to: "pptx", requiresBackend: true },
  { from: "rtf", to: "docx", requiresBackend: true },
  { from: "doc", to: "pdf", requiresBackend: true },
  { from: "doc", to: "docx", requiresBackend: true },
  { from: "odt", to: "pdf", requiresBackend: true },
  { from: "odt", to: "docx", requiresBackend: true },
  { from: "pptx", to: "pdf", requiresBackend: true },
  { from: "pptx", to: "jpg", requiresBackend: true },
  { from: "pptx", to: "png", requiresBackend: true },
  { from: "ppt", to: "pdf", requiresBackend: true },
  { from: "odp", to: "pdf", requiresBackend: true },
  { from: "tar", to: "zip", requiresBackend: true },
  { from: "zip", to: "tar", requiresBackend: true },
];
