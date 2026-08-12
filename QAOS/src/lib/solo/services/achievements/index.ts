import { ACHIEVEMENTS } from "@/lib/solo/constants/achievements";
import type { AchievementCondition } from "@/lib/solo/types";

export interface AchievementContext {
  stats: Record<string, number>;
  streak: number;
  level: number;
  skillLevels: Record<string, number>;
  questsCompletedTotal: number;
  journalCount: number;
  certificationsCount: number;
}

function conditionMet(condition: AchievementCondition, ctx: AchievementContext): boolean {
  switch (condition.type) {
    case "stat":
      return (ctx.stats[condition.statKey] ?? 0) >= condition.target;
    case "streak":
      return ctx.streak >= condition.target;
    case "level":
      return ctx.level >= condition.target;
    case "questsCompleted":
      return ctx.questsCompletedTotal >= condition.target;
    case "skillLevel":
      return (ctx.skillLevels[condition.skillId] ?? 0) >= condition.target;
    case "journalEntries":
      return ctx.journalCount >= condition.target;
    case "certifications":
      return ctx.certificationsCount >= condition.target;
    default:
      return false;
  }
}

export function getConditionProgress(
  condition: AchievementCondition,
  ctx: AchievementContext
): { current: number; target: number } {
  switch (condition.type) {
    case "stat":
      return { current: ctx.stats[condition.statKey] ?? 0, target: condition.target };
    case "streak":
      return { current: ctx.streak, target: condition.target };
    case "level":
      return { current: ctx.level, target: condition.target };
    case "questsCompleted":
      return { current: ctx.questsCompletedTotal, target: condition.target };
    case "skillLevel":
      return { current: ctx.skillLevels[condition.skillId] ?? 0, target: condition.target };
    case "journalEntries":
      return { current: ctx.journalCount, target: condition.target };
    case "certifications":
      return { current: ctx.certificationsCount, target: condition.target };
    default:
      return { current: 0, target: 1 };
  }
}

/** Returns the ids of achievements whose conditions are now met but weren't already unlocked. */
export function evaluateNewAchievements(ctx: AchievementContext, alreadyUnlocked: string[]): string[] {
  const unlockedSet = new Set(alreadyUnlocked);
  const newlyUnlocked: string[] = [];
  for (const achievement of ACHIEVEMENTS) {
    if (unlockedSet.has(achievement.id)) continue;
    if (conditionMet(achievement.condition, ctx)) newlyUnlocked.push(achievement.id);
  }
  return newlyUnlocked;
}
