import type { HelpEntry } from "../types";

export const GENERATOR_ENTRIES: HelpEntry[] = [
  {
    id: "gen-generate",
    module: "Test Data Generator",
    question: "How do I generate test data?",
    keywords: ["generate test data", "fake data", "generate fake users", "generate emails"],
    steps: [
      "Open Test Data Generator from the sidebar.",
      "Browse by category or search for what you need (e.g. names, emails, addresses).",
      "Open a generator, set how many rows you want, and click Generate.",
      'Export the result with Copy, CSV, Excel, JSON, XML, YAML, SQL, or PDF from the export bar.',
    ],
    link: { href: "/generator", label: "Open Test Data Generator" },
  },
  {
    id: "gen-qa-design",
    module: "Test Data Generator",
    question: "How do I generate boundary value or negative test data?",
    keywords: ["boundary value", "equivalence partition", "negative test data", "security payload", "qa test design"],
    steps: [
      'Open Test Data Generator and go to the "QA Test Design" category.',
      "Pick a generator for boundary values, equivalence partitions, or negative/security payloads.",
      "Set the count and click Generate, then export as needed.",
    ],
    link: { href: "/generator/category/qa", label: "Open QA Test Design" },
  },
  {
    id: "gen-template",
    module: "Test Data Generator",
    question: "How do I save a generator configuration to reuse later?",
    keywords: ["save generator template", "reuse generator config"],
    steps: [
      "Set up a generator the way you want it (options, count).",
      'Click "Save as template" and give it a name.',
      'Find it later under Test Data Generator > Templates, and click "Use" to rerun it instantly.',
    ],
    link: { href: "/generator/templates", label: "Open templates" },
  },
  {
    id: "gen-favorite-history",
    module: "Test Data Generator",
    question: "How do I favorite a generator or rerun something from history?",
    keywords: ["favorite generator", "generator history", "rerun generator"],
    steps: [
      "Click the star icon on any generator to favorite it — see it later under Favorites.",
      'Every run is logged under Test Data Generator > History (last 50) — click "Run again" on any entry to repeat it.',
    ],
    link: { href: "/generator/history", label: "Open history" },
  },
  {
    id: "gen-qr-image-regex",
    module: "Test Data Generator",
    question: "How do I generate a QR code, a placeholder image, or test a regex?",
    keywords: ["qr code", "barcode", "placeholder image", "image studio", "regex tester", "test regex"],
    steps: [
      "Open Test Data Generator from the sidebar.",
      'For a QR code or barcode, open the "QR/Barcode Studio" tool.',
      'For a placeholder/dummy image, open "Image Studio".',
      'To test or build a regular expression, open the "Regex Tester" — it explains the pattern, shows matches, and helps you build QA test cases from it.',
    ],
  },
];
