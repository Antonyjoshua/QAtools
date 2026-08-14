import type { AdapterManifest, ConversionPair } from "../core/types";

// Only formats the browser's <img> element can decode reliably — matches the input side of
// image-adapter.ts, minus svg/ico (vector/icon formats aren't meaningful OCR inputs).
const CONVERSIONS: ConversionPair[] = [
  { from: "jpg", to: "txt" },
  { from: "png", to: "txt" },
  { from: "webp", to: "txt" },
  { from: "bmp", to: "txt" },
  { from: "gif", to: "txt" },
];

export const ocrManifest: AdapterManifest = {
  id: "ocr",
  label: "Text Extraction (OCR)",
  conversions: CONVERSIONS,
  load: () => import("./ocr-adapter-impl").then((m) => m.ocrAdapter),
};

export interface OcrConversionOptions {
  /** Boosts contrast and upscales small images before recognition — helps pen/pencil strokes
   * stand out, but doesn't turn Tesseract into a real handwriting model. Clear block/print
   * handwriting on plain paper can come out reasonably; cursive or messy handwriting still won't
   * be reliable — there's no offline model for that. */
  handwriting?: boolean;
  /** Rotate the image before reading it — Tesseract assumes roughly upright text, so a sideways
   * photo (very common for phone photos of notebook pages) will read as near-garbage otherwise. */
  rotateDegrees?: 0 | 90 | 180 | 270;
}
