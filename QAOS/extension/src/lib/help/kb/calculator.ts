import type { HelpEntry } from "../types";

export const CALCULATOR_ENTRIES: HelpEntry[] = [
  {
    id: "calc-find",
    module: "Calculator",
    question: "How do I find a calculator for something specific?",
    keywords: ["find calculator", "gst calculator", "story point calculator", "search calculator"],
    steps: [
      "Open Calculator from the sidebar.",
      "Browse by category (Financial, Testing, Agile, Date/Time, Performance, API, Security, Mobile, Web, UI/UX, File & Utilities, Reporting) or use the search box.",
      "Click a calculator card to open it.",
    ],
    link: { href: "/calculator", label: "Open Calculator" },
  },
  {
    id: "calc-use",
    module: "Calculator",
    question: "How do I use a calculator?",
    keywords: ["use calculator", "calculate"],
    steps: [
      "Open a calculator from the dashboard.",
      "Fill in the input fields — the result updates live.",
      'Use "Save to History", "Copy", "Share", "Export CSV", or "Export JSON" on the result as needed.',
    ],
  },
  {
    id: "calc-favorite",
    module: "Calculator",
    question: "How do I favorite a calculator?",
    keywords: ["favorite calculator", "star calculator"],
    steps: ["On the Calculator dashboard, click the star icon on any calculator card.", "Favorited calculators appear in the Favorites section for quick access."],
  },
  {
    id: "calc-history",
    module: "Calculator",
    question: "How do I see or manage my past calculations?",
    keywords: ["calculator history", "past calculations", "redo calculation"],
    steps: [
      "Go to Calculator > History.",
      'Switch between "All" and "Favorites" tabs.',
      "Use the pencil icon to reopen and edit a past calculation, the star to favorite it, or the trash icon to delete it.",
      'Use "Export CSV" or "Clear all" for the whole history.',
    ],
    link: { href: "/calculator/history", label: "Open Calculator history" },
  },
];
