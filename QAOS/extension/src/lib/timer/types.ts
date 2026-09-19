export type TimerTab = "stopwatch" | "timer" | "pomodoro" | "worldclock";

export interface Lap {
  id: string;
  index: number;
  lapMs: number; // time since previous lap
  totalMs: number; // total elapsed at this lap
}

export interface StopwatchEngine {
  running: boolean;
  startedAt: number | null; // epoch ms when last started/resumed
  accumulatedMs: number; // elapsed time banked before the current run
  laps: Lap[];
}

export interface CountdownEngine {
  running: boolean;
  startedAt: number | null; // epoch ms when last started/resumed
  totalMs: number; // full duration of the current countdown
  remainingAtStart: number; // remaining ms as of startedAt (or full duration if never started)
  label: string;
}

export type PomodoroPhase = "work" | "break" | "longBreak";

export interface PomodoroEngine {
  running: boolean;
  startedAt: number | null;
  phase: PomodoroPhase;
  remainingAtStart: number;
  completedWorkSessions: number; // toward the long-break threshold
  completedToday: number;
  lastCompletedDateKey: string | null; // yyyy-mm-dd, for resetting completedToday
}

export type SessionType = "Stopwatch" | "Timer" | "Pomodoro Work" | "Pomodoro Break" | "Pomodoro Long Break";

export interface SessionHistoryEntry {
  id: string;
  name: string;
  durationMs: number;
  completedAt: number; // epoch ms
  sessionType: SessionType;
}

export interface TimerSettings {
  notificationSoundEnabled: boolean;
  volume: number; // 0-1
  autoStart: boolean; // Pomodoro: auto-start the next phase's timer
  autoRepeat: boolean; // Pomodoro: keep cycling after a long break
  use24Hour: boolean;
  showMilliseconds: boolean;
  keepRunningWhenClosed: boolean;
  desktopNotifications: boolean;
}

export interface PomodoroSettings {
  workMinutes: number;
  breakMinutes: number;
  longBreakMinutes: number;
  sessionsUntilLongBreak: number;
}

export const COUNTDOWN_PRESETS_SECONDS = [30, 60, 300, 600, 900, 1500, 1800, 2700, 3600] as const;
