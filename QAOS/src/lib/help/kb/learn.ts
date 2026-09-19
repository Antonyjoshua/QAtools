import type { HelpEntry } from "../types";

export const LEARN_ENTRIES: HelpEntry[] = [
  {
    id: "learn-read",
    module: "Learn",
    question: "How do I read an article on a QA topic?",
    keywords: ["learn article", "read article", "learn topic"],
    steps: [
      "Open Learn from the sidebar.",
      'Pick a topic from the "Knowledge Library" grid (or "Continue Learning" / "Recommended Topics").',
      'Read the article, then click "Mark as complete" to earn XP — you can also bookmark it for later.',
    ],
    link: { href: "/learn", label: "Open Learn" },
  },
  {
    id: "learn-quiz-flashcards",
    module: "Learn",
    question: "How do I take a quiz or review flashcards?",
    keywords: ["quiz", "flashcards"],
    steps: [
      "Open an article on the topic you want, or go to Learn > Practice Zone for a full list of quizzes.",
      'From an article, use "Take the quiz" or "Review flashcards" in the Practice This Topic section.',
    ],
    link: { href: "/learn/practice", label: "Open Practice Zone" },
  },
  {
    id: "learn-sql-api",
    module: "Learn",
    question: "How do I practice SQL or API testing hands-on?",
    keywords: ["sql playground", "api playground", "practice sql", "practice api"],
    steps: [
      "Go to Learn > Practice Zone.",
      'Open the "SQL Playground" to write and run real SQL queries in the browser, or the "API Playground" to send real HTTP requests and inspect responses.',
    ],
  },
  {
    id: "learn-mock-interview",
    module: "Learn",
    question: "How do I do a mock interview or prep for interviews?",
    keywords: ["mock interview", "interview prep"],
    steps: [
      "Go to Learn > Interview Prep.",
      'Click "Start Mock Interview" and answer the practice questions.',
      "Your Interview Readiness % on the Learn dashboard tracks your progress.",
    ],
    link: { href: "/learn/interview-prep", label: "Open Interview Prep" },
  },
  {
    id: "learn-roadmap",
    module: "Learn",
    question: "How do I follow a QA career roadmap?",
    keywords: ["career roadmap", "learning roadmap"],
    steps: [
      "Go to Learn > Roadmaps.",
      "Pick a career path (e.g. Manual Tester → Test Architect) to see its milestones and track progress through them.",
    ],
    link: { href: "/learn/roadmaps", label: "Open Roadmaps" },
  },
  {
    id: "learn-cheatsheets",
    module: "Learn",
    question: "How do I use cheatsheets?",
    keywords: ["cheatsheet", "quick reference"],
    steps: ["Go to Learn > Cheatsheets.", "Open one to view it, then print it or download it as a PDF."],
    link: { href: "/learn/cheatsheets", label: "Open Cheatsheets" },
  },
];
