export const MAX_LEVEL = 50;

const LEVEL_TITLES: { minLevel: number; title: string }[] = [
  { minLevel: 1, title: "Test Novice" },
  { minLevel: 5, title: "Junior QA" },
  { minLevel: 10, title: "QA Engineer" },
  { minLevel: 20, title: "Senior QA" },
  { minLevel: 30, title: "SDET" },
  { minLevel: 40, title: "QA Lead" },
  { minLevel: 50, title: "Test Architect" },
];

// Threshold to REACH a given level. Level 1 is where everyone starts, so it must be 0 — not
// shifting by one here caused xpIntoLevel to go negative for anyone below the level-2 threshold.
function xpRequiredForLevel(level: number): number {
  if (level <= 1) return 0;
  const n = level - 1;
  return Math.round(50 * n * n + 50 * n);
}

export interface LevelInfo {
  level: number;
  xpIntoLevel: number;
  xpForNextLevel: number;
  progress: number; // 0-1, 1 at MAX_LEVEL
  title: string;
}

export function getLevelInfo(totalXp: number): LevelInfo {
  let level = 1;
  while (level < MAX_LEVEL && totalXp >= xpRequiredForLevel(level + 1)) level++;
  const currentLevelXp = xpRequiredForLevel(level);
  const nextLevelXp = level < MAX_LEVEL ? xpRequiredForLevel(level + 1) : currentLevelXp;
  const xpIntoLevel = totalXp - currentLevelXp;
  const xpForNextLevel = Math.max(1, nextLevelXp - currentLevelXp);
  const title = [...LEVEL_TITLES].reverse().find((t) => level >= t.minLevel)?.title ?? LEVEL_TITLES[0].title;
  return { level, xpIntoLevel, xpForNextLevel, progress: level >= MAX_LEVEL ? 1 : xpIntoLevel / xpForNextLevel, title };
}

export const XP_REWARDS = {
  articleCompleted: 20,
  quizCompleted: 15,
  quizPerfectBonus: 10,
  flashcardSetReviewed: 10,
  interviewQuestionAnswered: 5,
  roadmapMilestoneCompleted: 25,
} as const;
