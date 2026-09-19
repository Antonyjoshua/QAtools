import type { HelpEntry } from "../types";

export const TESTCASES_ENTRIES: HelpEntry[] = [
  {
    id: "tc-project",
    module: "Test Management",
    question: "How do I create a project for my test cases?",
    keywords: ["create project", "new project", "test project"],
    steps: [
      "Open Test Management from the sidebar.",
      'Click "New Project" (also available under Projects), give it a name and description, then click Create.',
      "Star a project to favorite it for quick access.",
    ],
    link: { href: "/testcases/projects", label: "Open Projects" },
  },
  {
    id: "tc-create",
    module: "Test Management",
    question: "How do I create a test case?",
    keywords: ["create test case", "new test case", "write test case"],
    steps: [
      "Open a project's workspace and pick a folder in the left sidebar.",
      'Select (or create) a Suite inside it, then click "New Test Case".',
      "Fill in the title, priority, severity, type, steps, and expected result, then click Create test case.",
    ],
  },
  {
    id: "tc-organize",
    module: "Test Management",
    question: "How do I organize test cases into folders and suites?",
    keywords: ["folder", "suite", "organize test cases"],
    steps: [
      "Open a project's workspace.",
      "Use the left-hand folder tree to structure your test cases by feature/module.",
      'Inside a folder, click "New Suite" to group related test cases together.',
    ],
  },
  {
    id: "tc-run",
    module: "Test Management",
    question: "How do I run/execute test cases?",
    keywords: ["test run", "execute test cases", "new run", "mark pass fail"],
    steps: [
      'Go to Test Management > Test Runs and click "New test run".',
      "Pick a project, select which test cases to include, and give the run a name, environment, and build.",
      'Open the run and click "Start run", then go through the Execute tab marking each case Pass / Fail / Blocked / Skipped, with an optional comment.',
      'If a case fails, use "Report Bug" right from that step to file it in Bug Reports.',
      'When finished, click "Mark complete".',
    ],
    link: { href: "/testcases/runs", label: "Open Test Runs" },
  },
  {
    id: "tc-report",
    module: "Test Management",
    question: "How do I generate a test report?",
    keywords: ["test report", "execution report", "regression report", "sprint report", "release report"],
    steps: [
      "Go to Test Management > Reports.",
      "Choose a Project and a report type (execution, regression, sprint, or release).",
      "Fill in the required field (e.g. which run/sprint/release/date range).",
      'Click "Generate report", then print or export it from the result view.',
    ],
    link: { href: "/testcases/reports", label: "Open Reports" },
  },
];
