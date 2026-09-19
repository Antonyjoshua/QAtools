import type { HelpEntry } from "../types";

export const BUGS_ENTRIES: HelpEntry[] = [
  {
    id: "bug-create",
    module: "Bug Reports",
    question: "How do I create a bug report?",
    keywords: ["create bug", "new bug", "file a bug", "report a bug"],
    steps: [
      "Open Bug Reports from the sidebar.",
      'Click "New Bug" (or "Report Bug" from a failed test step in Test Management).',
      "Fill in the title, steps to reproduce, expected result, and actual result — the Submission Checklist on the right shows what's still missing.",
      "Set Severity, Priority, and Category, and optionally attach a screenshot.",
      "It saves automatically as you fill it in.",
    ],
    link: { href: "/bugs", label: "Open Bug Reports" },
  },
  {
    id: "bug-organize",
    module: "Bug Reports",
    question: "How do I assign a bug to a project or module?",
    keywords: ["assign bug", "bug project", "bug module"],
    steps: [
      'Open the bug and go to the "Basic Info & Environment" tab.',
      "Pick a Project, Module, and Feature from the dropdowns (or leave as \"No project\" if it doesn't apply).",
    ],
  },
  {
    id: "bug-labels-steps",
    module: "Bug Reports",
    question: "How do I use labels or reusable steps on a bug?",
    keywords: ["bug labels", "reusable steps"],
    steps: [
      "Open the bug's Details tab and click a label chip to toggle it on/off (e.g. Regression, Smoke, High Risk).",
      'While filling in "Steps to Reproduce", use "Insert reusable steps" to pull in a saved step sequence instead of retyping it.',
      "Manage the label and reusable-step libraries under Bug Reports > Labels and Bug Reports > Reusable Steps.",
    ],
  },
  {
    id: "bug-status",
    module: "Bug Reports",
    question: "How do I change a bug's status?",
    keywords: ["bug status", "close bug", "reopen bug"],
    steps: ["Open the bug.", "Click the status badge near the top (e.g. Open) and pick a new status from the dropdown."],
  },
  {
    id: "bug-filter",
    module: "Bug Reports",
    question: "How do I filter or search bug reports?",
    keywords: ["filter bugs", "search bugs"],
    steps: [
      "Go to All Bug Reports.",
      "Use the search box for title/ID/description, and the Project, Module, Status, Severity, and Priority dropdowns to narrow the list.",
    ],
  },
  {
    id: "bug-export",
    module: "Bug Reports",
    question: "How do I export a bug report?",
    keywords: ["export bug", "print bug"],
    steps: [
      "Open the bug.",
      'Use the "Export" button (top right) to download it, or "Print" to print it.',
      "Past exports are listed under Bug Reports > Export History.",
    ],
  },
  {
    id: "bug-template",
    module: "Bug Reports",
    question: "How do I use a bug report template?",
    keywords: ["bug template"],
    steps: [
      "Go to Bug Reports > Templates.",
      "Pick a template — it opens a new bug pre-filled with that structure, which you can then edit.",
    ],
    link: { href: "/bugs/templates", label: "Browse templates" },
  },
];
