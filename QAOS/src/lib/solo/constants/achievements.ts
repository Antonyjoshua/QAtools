import type { AchievementDefinition } from "@/lib/solo/types";

export const ACHIEVEMENTS: AchievementDefinition[] = [
  { id: "ach-first-bug", name: "First Bug", description: "Report your very first bug.", icon: "🐞", xp: 10, condition: { type: "stat", statKey: "bugsReported", target: 1 } },
  { id: "ach-bug-hunter", name: "Bug Hunter", description: "Report 25 bugs.", icon: "🎯", xp: 50, condition: { type: "stat", statKey: "bugsReported", target: 25 } },
  { id: "ach-100-bugs", name: "100 Bugs Reported", description: "Report 100 bugs.", icon: "🪲", xp: 150, condition: { type: "stat", statKey: "bugsReported", target: 100 } },
  { id: "ach-500-test-cases", name: "500 Test Cases", description: "Write 500 test cases.", icon: "📋", xp: 300, condition: { type: "stat", statKey: "testCasesWritten", target: 500 } },
  { id: "ach-regression-master", name: "Regression Master", description: "Reach Manual Testing skill level 10.", icon: "🛡️", xp: 150, condition: { type: "skillLevel", skillId: "manual-testing", target: 10 } },
  { id: "ach-sql-expert", name: "SQL Expert", description: "Reach SQL skill level 10.", icon: "🗄️", xp: 150, condition: { type: "skillLevel", skillId: "sql", target: 10 } },
  { id: "ach-api-champion", name: "API Champion", description: "Test 100 APIs.", icon: "🔌", xp: 150, condition: { type: "stat", statKey: "apisTested", target: 100 } },
  { id: "ach-automation-wizard", name: "Automation Wizard", description: "Write 100 automation scripts.", icon: "🧙", xp: 200, condition: { type: "stat", statKey: "automationScripts", target: 100 } },
  { id: "ach-playwright-ninja", name: "Playwright Ninja", description: "Reach Playwright skill level 10.", icon: "🥷", xp: 150, condition: { type: "skillLevel", skillId: "playwright", target: 10 } },
  { id: "ach-night-tester", name: "Night Tester", description: "Complete 20 quests on your grind.", icon: "🌙", xp: 60, condition: { type: "questsCompleted", target: 20 } },
  { id: "ach-perfect-week", name: "Perfect Week", description: "Hold a 7-day streak.", icon: "🔥", xp: 80, condition: { type: "streak", target: 7 } },
  { id: "ach-365-streak", name: "365 Day Streak", description: "Hold a 365-day streak.", icon: "🏆", xp: 1000, condition: { type: "streak", target: 365 } },
  { id: "ach-rising-hunter", name: "Rising Hunter", description: "Reach Level 10.", icon: "⬆️", xp: 40, condition: { type: "level", target: 10 } },
  { id: "ach-veteran-hunter", name: "Veteran Hunter", description: "Reach Level 50.", icon: "🎖️", xp: 200, condition: { type: "level", target: 50 } },
  { id: "ach-legendary-ascension", name: "Legendary Ascension", description: "Reach Level 100.", icon: "👑", xp: 1000, condition: { type: "level", target: 100 } },
  { id: "ach-certified", name: "Certified", description: "Earn your first certification.", icon: "📜", xp: 50, condition: { type: "certifications", target: 1 } },
  { id: "ach-certification-collector", name: "Certification Collector", description: "Earn 5 certifications.", icon: "🎓", xp: 200, condition: { type: "certifications", target: 5 } },
  { id: "ach-journal-keeper", name: "Journal Keeper", description: "Write 30 journal entries.", icon: "📓", xp: 80, condition: { type: "journalEntries", target: 30 } },
];
