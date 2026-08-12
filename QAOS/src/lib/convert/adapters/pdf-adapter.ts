import type { AdapterManifest, ConversionPair } from "../core/types";

const CONVERSIONS: ConversionPair[] = [
  { from: "pdf", to: "pdf" }, // merge / split / rotate / extract / rearrange / compress — see options.operation
  { from: "pdf", to: "jpg" },
  { from: "pdf", to: "png" },
  { from: "pdf", to: "txt" },
];

export const pdfManifest: AdapterManifest = {
  id: "pdf",
  label: "PDF",
  conversions: CONVERSIONS,
  load: () => import("./pdf-adapter-impl").then((m) => m.pdfAdapter),
};

export type PdfOperation = "merge" | "split" | "rotate" | "reorder" | "compress";

export interface PdfConversionOptions {
  operation?: PdfOperation; // pdf -> pdf only; defaults to "compress" (a harmless passthrough)
  pageRanges?: string; // "1-3,5,7-9" — for split
  pageOrder?: number[]; // 1-indexed — for reorder/extract (a subset in a chosen order)
  rotateDegrees?: 90 | 180 | 270;
  rotatePages?: "all" | number[]; // 1-indexed
  pages?: "all" | number[]; // for pdf -> jpg/png/txt
  resolution?: number; // DPI-ish scale factor for rendering, default 150
  quality?: number; // 0-100, for jpg
}
