import type { HelpEntry } from "../types";

export const CONVERT_ENTRIES: HelpEntry[] = [
  {
    id: "convert-file",
    module: "File Converter",
    question: "How do I convert a file?",
    keywords: ["convert file", "convert document", "convert image", "convert pdf"],
    steps: [
      "Open File Converter from the sidebar (or the Quick File Converter popup in the top toolbar).",
      "Upload or drop a file — it's detected automatically.",
      "Pick the output format from the options shown (only real, supported conversions are offered).",
      'Click "Convert", then use Preview, Copy (for text results), or Download on the result.',
    ],
    link: { href: "/convert", label: "Open File Converter" },
  },
  {
    id: "convert-remove-reupload",
    module: "File Converter",
    question: "How do I remove or replace an uploaded file?",
    keywords: ["remove file", "replace file", "reupload file"],
    steps: [
      "Click the ✕ on the uploaded file's card.",
      "The upload area reappears — drop or choose a different file, no page refresh needed.",
    ],
  },
  {
    id: "convert-ocr",
    module: "File Converter",
    question: "How do I extract text from an image (OCR)?",
    keywords: ["ocr", "extract text from image", "image to text", "read text from photo"],
    steps: [
      "Open File Converter and upload a JPG, PNG, WebP, BMP, or GIF image.",
      'Choose "TXT" as the output format.',
      'If the photo is sideways, use "Rotate 90°" until the live preview looks upright — this matters a lot for accuracy.',
      'For photographed handwriting, turn on "Handwriting mode" to boost contrast — it works best on clear block/print handwriting on plain paper; cursive or messy handwriting still won\'t be reliable.',
      'Click "Convert", then copy or download the extracted text.',
    ],
    tip: "OCR runs fully offline in your browser — the image never leaves your device.",
  },
  {
    id: "convert-history",
    module: "File Converter",
    question: "How do I see past file conversions?",
    keywords: ["conversion history"],
    steps: ["Go to File Converter > History to see past conversions and re-download results."],
    link: { href: "/convert/history", label: "Open Conversion History" },
  },
];
