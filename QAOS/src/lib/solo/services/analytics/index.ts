import type { XpLogEntry } from "@/lib/solo/types";
import { daysBetween } from "@/lib/solo/utils/date";
import { sumXpForDate } from "@/lib/solo/services/xp";

export interface StreakState {
  current: number;
  longest: number;
  lastActiveDate: string | null;
}

/** Pure streak transition — call once per day the user performs any XP-earning activity. */
export function updateStreakOnActivity(state: StreakState, today: string): StreakState {
  if (state.lastActiveDate === today) return state;

  let current = 1;
  if (state.lastActiveDate) {
    const diff = daysBetween(state.lastActiveDate, today);
    if (diff === 1) current = state.current + 1;
    else if (diff <= 0) current = state.current;
  }

  return {
    current,
    longest: Math.max(state.longest, current),
    lastActiveDate: today,
  };
}

export function isStreakAtRisk(state: StreakState, today: string): boolean {
  if (!state.lastActiveDate || state.lastActiveDate === today) return false;
  return daysBetween(state.lastActiveDate, today) === 1;
}

export function isStreakBroken(state: StreakState, today: string): boolean {
  if (!state.lastActiveDate) return false;
  return daysBetween(state.lastActiveDate, today) > 1;
}

export function computeProductivityScore(params: {
  dailyCompletionRate: number;
  weeklyCompletionRate: number;
  streak: number;
}): number {
  const streakFactor = Math.min(params.streak / 30, 1);
  const score =
    params.dailyCompletionRate * 40 + params.weeklyCompletionRate * 30 + streakFactor * 30;
  return Math.round(Math.min(100, Math.max(0, score)));
}

export function aggregateXpByDay(
  log: XpLogEntry[],
  dates: string[]
): { date: string; xp: number }[] {
  return dates.map((date) => ({ date, xp: sumXpForDate(log, date) }));
}

export function aggregateXpByMonth(
  log: XpLogEntry[],
  months: string[]
): { month: string; xp: number }[] {
  return months.map((month) => ({
    month,
    xp: log.reduce((sum, entry) => (entry.date.startsWith(month) ? sum + entry.amount : sum), 0),
  }));
}
