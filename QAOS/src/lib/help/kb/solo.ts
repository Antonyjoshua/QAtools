import type { HelpEntry } from "../types";

export const SOLO_ENTRIES: HelpEntry[] = [
  {
    id: "solo-what",
    module: "Solo Leveling",
    question: "What is the Solo Leveling module?",
    keywords: ["solo leveling", "what is solo leveling"],
    steps: [
      "It's a gamified tracker for your QA skills and career — you log real QA work (bugs reported, test cases written, etc.) and earn XP, level up skills, complete quests, and unlock achievements.",
    ],
    link: { href: "/journey", label: "Open Solo Leveling" },
  },
  {
    id: "solo-xp",
    module: "Solo Leveling",
    question: "How do I log QA work for XP?",
    keywords: ["earn xp", "log work", "bug reported xp", "test case written xp"],
    steps: [
      "Open Solo Leveling's Dashboard.",
      'Use the "Quick Actions" card to log things like "Bug Reported" or "Test Case Written" — each click grants XP and updates your stats.',
    ],
    link: { href: "/journey", label: "Open Dashboard" },
  },
  {
    id: "solo-skills",
    module: "Solo Leveling",
    question: "How do skills and leveling up work?",
    keywords: ["skills", "level up skill"],
    steps: [
      "Go to Solo Leveling > Skills.",
      "Switch between Technical and Soft Skills tabs.",
      'Click "Practice (+XP)" on a skill to raise its level and unlock perks.',
    ],
    link: { href: "/journey/skills", label: "Open Skills" },
  },
  {
    id: "solo-quests",
    module: "Solo Leveling",
    question: "How do I complete or add a quest?",
    keywords: ["quest", "daily quest", "weekly quest", "add quest"],
    steps: [
      "Go to Solo Leveling > Quests.",
      "Switch between Daily, Weekly, and Monthly tabs and check off a quest to complete it and earn XP.",
      'Click "Add Quest" to create your own custom quest with a title and XP value.',
    ],
    link: { href: "/journey/quests", label: "Open Quests" },
  },
  {
    id: "solo-journal-certs",
    module: "Solo Leveling",
    question: "How do I log a journal entry or add a certification?",
    keywords: ["journal entry", "add certification"],
    steps: [
      'Go to Solo Leveling > Journal to write a free-form entry (learnings, mistakes, wins) and click "Save Entry".',
      'Go to Solo Leveling > Certifications and click "Add Certification" to log a certificate you\'ve earned.',
    ],
  },
  {
    id: "solo-backup",
    module: "Solo Leveling",
    question: "How do I back up or reset my Solo Leveling progress?",
    keywords: ["backup progress", "reset progress", "export solo leveling"],
    steps: [
      "Go to Solo Leveling > Settings > Data Management.",
      'Use "Export Backup" / "Import Backup" to save or restore your progress, or "Reset Progress" to start over.',
    ],
    link: { href: "/journey/settings", label: "Open Solo Leveling settings" },
  },
];
