import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  TimerTab,
  StopwatchEngine,
  CountdownEngine,
  PomodoroEngine,
  PomodoroPhase,
  SessionHistoryEntry,
  SessionType,
  TimerSettings,
  PomodoroSettings,
} from "./types";
import { playChime, showDesktopNotification } from "./notification";

function genId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function todayKey(): string {
  return new Date().toDateString();
}

interface QuickTimerState {
  // Popup chrome
  isOpen: boolean;
  isPinned: boolean;
  activeTab: TimerTab;

  // Engines
  stopwatch: StopwatchEngine;
  countdown: CountdownEngine;
  pomodoro: PomodoroEngine;

  // Config + persistence
  pomodoroSettings: PomodoroSettings;
  settings: TimerSettings;
  history: SessionHistoryEntry[];

  // Popup chrome actions
  open: () => void;
  close: () => void;
  toggleOpen: () => void;
  togglePinned: () => void;
  setActiveTab: (tab: TimerTab) => void;

  // Stopwatch actions
  stopwatchStart: () => void;
  stopwatchPause: () => void;
  stopwatchStop: () => void;
  stopwatchReset: () => void;
  stopwatchLap: () => void;
  stopwatchClearLaps: () => void;

  // Countdown actions
  countdownSetDuration: (ms: number, label?: string) => void;
  countdownStart: () => void;
  countdownPause: () => void;
  countdownStop: () => void;
  countdownReset: () => void;
  checkCountdownCompletion: () => void;

  // Pomodoro actions
  updatePomodoroSettings: (patch: Partial<PomodoroSettings>) => void;
  pomodoroStart: () => void;
  pomodoroPause: () => void;
  pomodoroSkip: () => void;
  pomodoroResetCycle: () => void;
  checkPomodoroCompletion: () => void;

  // Settings + history
  updateSettings: (patch: Partial<TimerSettings>) => void;
  addHistoryEntry: (name: string, durationMs: number, sessionType: SessionType) => void;
  removeHistoryEntry: (id: string) => void;
  clearHistory: () => void;
}

function elapsedFor(startedAt: number | null, running: boolean): number {
  return running && startedAt ? Date.now() - startedAt : 0;
}

function phaseDurationMs(phase: PomodoroPhase, settings: PomodoroSettings): number {
  const minutes = phase === "work" ? settings.workMinutes : phase === "break" ? settings.breakMinutes : settings.longBreakMinutes;
  return minutes * 60_000;
}

function phaseLabel(phase: PomodoroPhase): SessionType {
  return phase === "work" ? "Pomodoro Work" : phase === "break" ? "Pomodoro Break" : "Pomodoro Long Break";
}

export const useQuickTimerStore = create<QuickTimerState>()(
  persist(
    (set, get) => ({
      isOpen: false,
      isPinned: false,
      activeTab: "stopwatch",

      stopwatch: { running: false, startedAt: null, accumulatedMs: 0, laps: [] },
      countdown: { running: false, startedAt: null, totalMs: 5 * 60_000, remainingAtStart: 5 * 60_000, label: "Timer" },
      pomodoro: {
        running: false,
        startedAt: null,
        phase: "work",
        remainingAtStart: 25 * 60_000,
        completedWorkSessions: 0,
        completedToday: 0,
        lastCompletedDateKey: null,
      },

      pomodoroSettings: { workMinutes: 25, breakMinutes: 5, longBreakMinutes: 15, sessionsUntilLongBreak: 4 },
      settings: {
        notificationSoundEnabled: true,
        volume: 0.6,
        autoStart: false,
        autoRepeat: true,
        use24Hour: false,
        showMilliseconds: true,
        keepRunningWhenClosed: true,
        desktopNotifications: false,
      },
      history: [],

      open: () => set({ isOpen: true }),
      close: () => {
        set({ isOpen: false });
        if (!get().settings.keepRunningWhenClosed) {
          get().stopwatchPause();
          get().countdownPause();
          get().pomodoroPause();
        }
      },
      toggleOpen: () => (get().isOpen ? get().close() : get().open()),
      togglePinned: () => set((s) => ({ isPinned: !s.isPinned })),
      setActiveTab: (activeTab) => set({ activeTab }),

      stopwatchStart: () =>
        set((s) => (s.stopwatch.running ? s : { stopwatch: { ...s.stopwatch, running: true, startedAt: Date.now() } })),
      stopwatchPause: () =>
        set((s) => {
          if (!s.stopwatch.running) return s;
          const banked = s.stopwatch.accumulatedMs + elapsedFor(s.stopwatch.startedAt, true);
          return { stopwatch: { ...s.stopwatch, running: false, startedAt: null, accumulatedMs: banked } };
        }),
      stopwatchStop: () => {
        get().stopwatchPause();
        const elapsedMs = get().stopwatch.accumulatedMs;
        if (elapsedMs > 0) get().addHistoryEntry("Stopwatch session", elapsedMs, "Stopwatch");
      },
      stopwatchReset: () => set({ stopwatch: { running: false, startedAt: null, accumulatedMs: 0, laps: [] } }),
      stopwatchLap: () =>
        set((s) => {
          if (!s.stopwatch.running) return s;
          const totalMs = s.stopwatch.accumulatedMs + elapsedFor(s.stopwatch.startedAt, true);
          const previousTotal = s.stopwatch.laps[0]?.totalMs ?? 0;
          const lap = { id: genId(), index: s.stopwatch.laps.length + 1, lapMs: totalMs - previousTotal, totalMs };
          return { stopwatch: { ...s.stopwatch, laps: [lap, ...s.stopwatch.laps] } };
        }),
      stopwatchClearLaps: () => set((s) => ({ stopwatch: { ...s.stopwatch, laps: [] } })),

      countdownSetDuration: (ms, label) =>
        set((s) => ({
          countdown: { running: false, startedAt: null, totalMs: ms, remainingAtStart: ms, label: label ?? s.countdown.label },
        })),
      countdownStart: () =>
        set((s) => (s.countdown.running || s.countdown.remainingAtStart <= 0 ? s : { countdown: { ...s.countdown, running: true, startedAt: Date.now() } })),
      countdownPause: () =>
        set((s) => {
          if (!s.countdown.running) return s;
          const remaining = Math.max(0, s.countdown.remainingAtStart - elapsedFor(s.countdown.startedAt, true));
          return { countdown: { ...s.countdown, running: false, startedAt: null, remainingAtStart: remaining } };
        }),
      countdownStop: () => {
        const s = get();
        const remaining = s.countdown.running ? Math.max(0, s.countdown.remainingAtStart - elapsedFor(s.countdown.startedAt, true)) : s.countdown.remainingAtStart;
        const elapsedMs = s.countdown.totalMs - remaining;
        set({ countdown: { ...s.countdown, running: false, startedAt: null, remainingAtStart: s.countdown.totalMs } });
        if (elapsedMs > 0) get().addHistoryEntry(`${s.countdown.label} (stopped early)`, elapsedMs, "Timer");
      },
      countdownReset: () =>
        set((s) => ({ countdown: { ...s.countdown, running: false, startedAt: null, remainingAtStart: s.countdown.totalMs } })),
      checkCountdownCompletion: () => {
        const s = get();
        if (!s.countdown.running) return;
        const remaining = s.countdown.remainingAtStart - elapsedFor(s.countdown.startedAt, true);
        if (remaining > 0) return;
        set({ countdown: { ...s.countdown, running: false, startedAt: null, remainingAtStart: 0 } });
        get().addHistoryEntry(s.countdown.label, s.countdown.totalMs, "Timer");
        if (s.settings.notificationSoundEnabled) playChime(s.settings.volume);
        if (s.settings.desktopNotifications) showDesktopNotification("Timer complete", `"${s.countdown.label}" has finished.`);
      },

      updatePomodoroSettings: (patch) =>
        set((s) => {
          const pomodoroSettings = { ...s.pomodoroSettings, ...patch };
          const duration = phaseDurationMs(s.pomodoro.phase, pomodoroSettings);
          return {
            pomodoroSettings,
            pomodoro: s.pomodoro.running ? s.pomodoro : { ...s.pomodoro, remainingAtStart: duration },
          };
        }),
      pomodoroStart: () =>
        set((s) => (s.pomodoro.running ? s : { pomodoro: { ...s.pomodoro, running: true, startedAt: Date.now() } })),
      pomodoroPause: () =>
        set((s) => {
          if (!s.pomodoro.running) return s;
          const remaining = Math.max(0, s.pomodoro.remainingAtStart - elapsedFor(s.pomodoro.startedAt, true));
          return { pomodoro: { ...s.pomodoro, running: false, startedAt: null, remainingAtStart: remaining } };
        }),
      pomodoroSkip: () => {
        const s = get();
        const nextPhase: PomodoroPhase =
          s.pomodoro.phase === "work"
            ? (s.pomodoro.completedWorkSessions + 1) % s.pomodoroSettings.sessionsUntilLongBreak === 0
              ? "longBreak"
              : "break"
            : "work";
        const completedWorkSessions = s.pomodoro.phase === "work" ? s.pomodoro.completedWorkSessions + 1 : s.pomodoro.completedWorkSessions;
        set({
          pomodoro: {
            ...s.pomodoro,
            phase: nextPhase,
            completedWorkSessions: nextPhase === "work" ? 0 : completedWorkSessions,
            running: false,
            startedAt: null,
            remainingAtStart: phaseDurationMs(nextPhase, s.pomodoroSettings),
          },
        });
      },
      pomodoroResetCycle: () =>
        set((s) => ({
          pomodoro: {
            ...s.pomodoro,
            phase: "work",
            running: false,
            startedAt: null,
            completedWorkSessions: 0,
            remainingAtStart: phaseDurationMs("work", s.pomodoroSettings),
          },
        })),
      checkPomodoroCompletion: () => {
        const s = get();
        if (!s.pomodoro.running) return;
        const remaining = s.pomodoro.remainingAtStart - elapsedFor(s.pomodoro.startedAt, true);
        if (remaining > 0) return;

        const key = todayKey();
        const resetForNewDay = s.pomodoro.lastCompletedDateKey !== null && s.pomodoro.lastCompletedDateKey !== key;
        const completedWorkSessions = resetForNewDay ? 0 : s.pomodoro.completedWorkSessions;
        const completedToday = resetForNewDay ? 0 : s.pomodoro.completedToday;

        const finishedPhase = s.pomodoro.phase;
        const durationMs = phaseDurationMs(finishedPhase, s.pomodoroSettings);
        get().addHistoryEntry(phaseLabel(finishedPhase), durationMs, phaseLabel(finishedPhase));

        const nextCompletedWork = finishedPhase === "work" ? completedWorkSessions + 1 : completedWorkSessions;
        const nextCompletedToday = finishedPhase === "work" ? completedToday + 1 : completedToday;
        const nextPhase: PomodoroPhase =
          finishedPhase === "work" ? (nextCompletedWork % s.pomodoroSettings.sessionsUntilLongBreak === 0 ? "longBreak" : "break") : "work";
        const cycleWorkSessions = nextPhase === "work" && finishedPhase === "longBreak" ? 0 : nextCompletedWork;

        if (finishedPhase === "longBreak" && !s.settings.autoRepeat) {
          // Auto-repeat disabled: stop the cycle after a full round (ending in a long break) instead of looping.
          set({
            pomodoro: {
              ...s.pomodoro,
              running: false,
              startedAt: null,
              phase: "work",
              completedWorkSessions: 0,
              completedToday: nextCompletedToday,
              lastCompletedDateKey: key,
              remainingAtStart: phaseDurationMs("work", s.pomodoroSettings),
            },
          });
        } else {
          set({
            pomodoro: {
              running: s.settings.autoStart,
              startedAt: s.settings.autoStart ? Date.now() : null,
              phase: nextPhase,
              completedWorkSessions: cycleWorkSessions,
              completedToday: nextCompletedToday,
              lastCompletedDateKey: key,
              remainingAtStart: phaseDurationMs(nextPhase, s.pomodoroSettings),
            },
          });
        }

        if (s.settings.notificationSoundEnabled) playChime(s.settings.volume);
        if (s.settings.desktopNotifications) {
          showDesktopNotification(
            finishedPhase === "work" ? "Pomodoro complete" : "Break complete",
            finishedPhase === "work" ? "Time for a break." : "Back to work."
          );
        }
      },

      updateSettings: (patch) => set((s) => ({ settings: { ...s.settings, ...patch } })),
      addHistoryEntry: (name, durationMs, sessionType) =>
        set((s) => ({
          history: [{ id: genId(), name, durationMs, completedAt: Date.now(), sessionType }, ...s.history].slice(0, 200),
        })),
      removeHistoryEntry: (id) => set((s) => ({ history: s.history.filter((h) => h.id !== id) })),
      clearHistory: () => set({ history: [] }),
    }),
    {
      name: "qaos-quick-timer",
      partialize: (s) => ({
        isPinned: s.isPinned,
        activeTab: s.activeTab,
        stopwatch: s.stopwatch.running ? { ...s.stopwatch, running: false, startedAt: null, accumulatedMs: s.stopwatch.accumulatedMs + elapsedFor(s.stopwatch.startedAt, true) } : s.stopwatch,
        countdown: s.countdown,
        pomodoro: s.pomodoro,
        pomodoroSettings: s.pomodoroSettings,
        settings: s.settings,
        history: s.history,
      }),
    }
  )
);
