import type { StreakState } from "./types";

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function daysBetween(a: string, b: string): number {
  const msPerDay = 24 * 60 * 60 * 1000;
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / msPerDay);
}

export function recordActivity(prev: StreakState): StreakState {
  const today = todayStr();
  if (prev.lastActiveDate === today) return prev;

  if (prev.lastActiveDate === null) {
    return { current: 1, longest: Math.max(1, prev.longest), lastActiveDate: today };
  }

  const gap = daysBetween(prev.lastActiveDate, today);
  if (gap === 1) {
    const current = prev.current + 1;
    return { current, longest: Math.max(current, prev.longest), lastActiveDate: today };
  }
  return { current: 1, longest: prev.longest, lastActiveDate: today };
}

export function isStreakAtRisk(streak: StreakState): boolean {
  if (!streak.lastActiveDate) return false;
  return daysBetween(streak.lastActiveDate, todayStr()) >= 1;
}
