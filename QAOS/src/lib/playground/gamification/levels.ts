import type { LevelBreakpoint, LevelInfo } from "./types";

export const MAX_LEVEL = 20;

/** Cumulative XP to reach MAX_LEVEL is ~2,600 — sized to a thorough single playthrough. */
export function xpToNextLevel(level: number): number {
  return 30 + (level - 1) * 12;
}

export const LEVEL_BREAKPOINTS: LevelBreakpoint[] = [
  { level: 1, title: "QA Beginner" },
  { level: 3, title: "QA Explorer" },
  { level: 6, title: "QA Tester" },
  { level: 9, title: "QA Engineer" },
  { level: 12, title: "Senior QA" },
  { level: 15, title: "Automation Engineer" },
  { level: 18, title: "QA Architect" },
  { level: 20, title: "Quality Engineer" },
];

export function titleForLevel(level: number): string {
  let title = LEVEL_BREAKPOINTS[0].title;
  for (const bp of LEVEL_BREAKPOINTS) {
    if (level >= bp.level) title = bp.title;
  }
  return title;
}

export function getLevelInfo(totalXp: number): LevelInfo {
  let level = 1;
  let xpRemaining = totalXp;
  while (level < MAX_LEVEL) {
    const needed = xpToNextLevel(level);
    if (xpRemaining < needed) break;
    xpRemaining -= needed;
    level++;
  }
  const xpForNextLevel = level < MAX_LEVEL ? xpToNextLevel(level) : 0;
  return {
    level,
    title: titleForLevel(level),
    xpIntoLevel: xpRemaining,
    xpForNextLevel,
    totalXp,
    progress: xpForNextLevel > 0 ? xpRemaining / xpForNextLevel : 1,
  };
}
