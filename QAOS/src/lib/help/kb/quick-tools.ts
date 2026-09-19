import type { HelpEntry } from "../types";

export const QUICK_TOOLS_ENTRIES: HelpEntry[] = [
  {
    id: "qt-what",
    module: "Quick Tools",
    question: "What are the Quick Tools icons in the top toolbar?",
    keywords: ["quick tools", "toolbar icons", "top right icons"],
    steps: [
      "They're floating popups you can open from anywhere without leaving your current page: Timezone Converter (globe), Timer/Pomodoro (stopwatch), Calculator, Duration Converter (hourglass), File Converter (sparkles), and Job Search (briefcase).",
      "Click any icon to open its popup; click the ✕ or press Escape to close it.",
    ],
  },
  {
    id: "qt-duration",
    module: "Quick Tools",
    question: "How do I use the Duration Converter?",
    keywords: ["duration converter", "convert time", "questions to time"],
    steps: [
      "Click the hourglass icon in the top toolbar.",
      'Type a plain expression like "54 sec × 50 questions" or "2 hr + 35 min" in the quick-calculate bar and press Enter, or use the Convert / Calculate tabs for guided conversions (e.g. Questions → Total Time, Time per Question).',
      'Copy any result, or click the pin icon to keep the popup open, and drag it by the header to move it.',
    ],
  },
  {
    id: "qt-timer",
    module: "Quick Tools",
    question: "How do I use the Timer or Pomodoro?",
    keywords: ["timer", "pomodoro", "stopwatch"],
    steps: [
      "Click the stopwatch icon in the top toolbar.",
      "Switch between Stopwatch, Timer (countdown), and Pomodoro tabs.",
      "For Pomodoro, click Start to begin a work session — it automatically cycles through work/break/long-break, with a distinct chime for each so you can tell them apart without looking.",
      "Open Settings (gear icon) to adjust durations, sounds, and desktop notifications.",
    ],
  },
  {
    id: "qt-timezone",
    module: "Quick Tools",
    question: "How do I convert time zones or plan a meeting across time zones?",
    keywords: ["timezone converter", "meeting planner", "world clock"],
    steps: [
      "Click the globe icon in the top toolbar.",
      "Use the Converter tab to convert a specific time between zones, World Clock to see multiple zones at once, or Meeting Planner to find a good overlapping time for 2-3 locations.",
    ],
  },
  {
    id: "qt-calculator",
    module: "Quick Tools",
    question: "How do I use the Quick Calculator popup?",
    keywords: ["quick calculator"],
    steps: ["Click the calculator icon in the top toolbar.", "Type an expression and press Enter, or use it like a normal calculator."],
  },
];
