import type { AdapterManifest, ConversionPair } from "../core/types";

const CONVERSIONS: ConversionPair[] = [
  { from: "docx", to: "html" },
  { from: "docx", to: "txt" },
  { from: "docx", to: "pdf" },
  { from: "txt", to: "pdf" },
  { from: "html", to: "pdf" },
  { from: "md", to: "pdf" },
];

export const documentManifest: AdapterManifest = {
  id: "document",
  label: "Document",
  conversions: CONVERSIONS,
  load: () => import("./document-adapter-impl").then((m) => m.documentAdapter),
};
