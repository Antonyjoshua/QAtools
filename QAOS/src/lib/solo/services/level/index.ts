import { MAX_LEVEL, getBreakpointForLevel, xpToNextLevel } from "@/lib/solo/constants/levels";
import { skillXpToNextLevel } from "@/lib/solo/constants/skills";
import type { LevelInfo } from "@/lib/solo/types";

/** Resolves total accumulated XP into a level, title, rank, and in-level progress. */
export function getLevelInfo(totalXp: number): LevelInfo {
  const xp = Math.max(0, totalXp);
  let level = 1;
  let xpConsumed = 0;

  while (level < MAX_LEVEL) {
    const need = xpToNextLevel(level);
    if (xpConsumed + need > xp) break;
    xpConsumed += need;
    level += 1;
  }

  const isMaxLevel = level >= MAX_LEVEL;
  const xpForNextLevel = isMaxLevel ? 0 : xpToNextLevel(level);
  const xpIntoLevel = xp - xpConsumed;
  const breakpoint = getBreakpointForLevel(level);

  return {
    level,
    title: breakpoint.title,
    rank: breakpoint.rank,
    currentLevelXp: xpConsumed,
    xpIntoLevel,
    xpForNextLevel,
    totalXpForCurrentLevel: xpConsumed,
    totalXpForNextLevel: xpConsumed + xpForNextLevel,
    progress: isMaxLevel || xpForNextLevel === 0 ? 1 : xpIntoLevel / xpForNextLevel,
    isMaxLevel,
  };
}

export interface SkillLevelInfo {
  level: number;
  xpIntoLevel: number;
  xpForNextLevel: number;
  progress: number;
}

/** Same curve concept as player levels, scaled down and uncapped for per-skill progression. */
export function getSkillLevelInfo(skillXp: number): SkillLevelInfo {
  const xp = Math.max(0, skillXp);
  let level = 1;
  let xpConsumed = 0;
  // Skills soft-cap around level 40 worth of practice; loop bound keeps this cheap either way.
  while (level < 200) {
    const need = skillXpToNextLevel(level);
    if (xpConsumed + need > xp) break;
    xpConsumed += need;
    level += 1;
  }
  const xpForNextLevel = skillXpToNextLevel(level);
  const xpIntoLevel = xp - xpConsumed;
  return {
    level,
    xpIntoLevel,
    xpForNextLevel,
    progress: xpForNextLevel === 0 ? 1 : xpIntoLevel / xpForNextLevel,
  };
}
