import type { HelpEntry } from "../types";

export const RESUME_ENTRIES: HelpEntry[] = [
  {
    id: "resume-create",
    module: "Resume Builder",
    question: "How do I create a resume?",
    keywords: ["create resume", "new resume", "build resume"],
    steps: [
      "Open Resume Builder from the sidebar and click New Resume.",
      'Choose "Ready-Made Templates" to start from one of 20 ATS-friendly designs, or "Custom Resume Designer" for a blank canvas.',
      "This opens the editor, where autosave keeps your changes as you type.",
    ],
    link: { href: "/resume/new", label: "Create a resume" },
  },
  {
    id: "resume-edit",
    module: "Resume Builder",
    question: "How do I edit resume sections or change its design?",
    keywords: ["edit resume", "resume sections", "resume colors", "resume font"],
    steps: [
      'In the resume editor, use the "Content" tab to add, reorder, or edit sections (experience, education, skills, etc.).',
      'Use the "Design" tab to change colors, fonts, and layout.',
    ],
  },
  {
    id: "resume-export",
    module: "Resume Builder",
    question: "How do I export or print my resume?",
    keywords: ["export resume", "download resume pdf", "print resume", "resume docx"],
    steps: [
      "Open the resume in the editor.",
      'Click "Export" and choose Export as PDF, Export as DOCX, Print, or Export JSON (a re-importable save file).',
    ],
  },
  {
    id: "resume-manage",
    module: "Resume Builder",
    question: "How do I duplicate, favorite, or import a resume?",
    keywords: ["duplicate resume", "favorite resume", "import resume"],
    steps: [
      "In the editor toolbar, use the star icon to favorite a resume, or Duplicate to copy it.",
      'On the Resume Builder dashboard, use "Import JSON" to restore a resume you previously exported as JSON.',
    ],
    link: { href: "/resume", label: "Open Resume Builder" },
  },
];
