export interface StreakState {
  current: number;
  longest: number;
  lastActiveDate: string | null; // "YYYY-MM-DD"
}

export function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function daysBetween(a: string, b: string): number {
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86_400_000);
}

/** Call once per day the user does something learning-related. No-ops if already recorded today. */
export function recordActivity(state: StreakState, date = todayStr()): StreakState {
  if (state.lastActiveDate === date) return state;
  if (!state.lastActiveDate) return { current: 1, longest: Math.max(1, state.longest), lastActiveDate: date };
  const diff = daysBetween(state.lastActiveDate, date);
  if (diff === 1) {
    const current = state.current + 1;
    return { current, longest: Math.max(state.longest, current), lastActiveDate: date };
  }
  if (diff <= 0) return state;
  return { current: 1, longest: state.longest, lastActiveDate: date };
}

export function isStreakAtRisk(state: StreakState, today = todayStr()): boolean {
  if (!state.lastActiveDate || state.current === 0) return false;
  return daysBetween(state.lastActiveDate, today) === 1;
}
