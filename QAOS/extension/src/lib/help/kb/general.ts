import type { HelpEntry } from "../types";

export const GENERAL_ENTRIES: HelpEntry[] = [
  {
    id: "gen-what-is",
    module: "General",
    question: "What is QuanGrade?",
    keywords: ["what is quangrade", "about quangrade"],
    steps: [
      "QuanGrade is an all-in-one QA operations suite: Notes, Calculator, Test Data Generator, Test Management, Bug Reports, Resume Builder, Learn, File Converter, Jobs, and a gamified Solo Leveling skill tracker — all in one app.",
    ],
  },
  {
    id: "gen-data-storage",
    module: "General",
    question: "Where is my data stored? Is it private?",
    keywords: ["data storage", "privacy", "where is my data", "cloud", "server"],
    steps: [
      "Everything is stored locally in this browser (no backend, no account, nothing uploaded anywhere) — that's true for every module, including File Converter's OCR.",
      "That also means your data is per-browser/per-device: it won't show up if you open the app on a different browser or computer, and clearing your browser data will delete it.",
      "Most modules have a Settings page with Export/Import Backup — use that to move data between devices or keep a safety copy.",
    ],
  },
  {
    id: "gen-search",
    module: "General",
    question: "How do I quickly search the whole app?",
    keywords: ["global search", "command palette", "search everything"],
    steps: ['Click the search bar at the top (or press Ctrl/Cmd+K) to jump to any page, note, bug, test case, or tool by typing.'],
  },
  {
    id: "gen-theme",
    module: "General",
    question: "How do I switch between light and dark mode?",
    keywords: ["dark mode", "light mode", "theme"],
    steps: ["Click the sun/moon icon at the top right of the app to toggle between light and dark mode."],
  },
];
