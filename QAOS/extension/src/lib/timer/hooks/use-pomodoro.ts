"use client";

import * as React from "react";
import { useTimerStore } from "../store";

function phaseDurationMs(phase: "work" | "break" | "longBreak", settings: { workMinutes: number; breakMinutes: number; longBreakMinutes: number }): number {
  const minutes = phase === "work" ? settings.workMinutes : phase === "break" ? settings.breakMinutes : settings.longBreakMinutes;
  return minutes * 60_000;
}

/** Pomodoro is a countdown with phase-cycling (work/break/long break) layered on top. */
export function usePomodoro() {
  const pomodoro = useTimerStore((s) => s.pomodoro);
  const pomodoroSettings = useTimerStore((s) => s.pomodoroSettings);
  const updateSettings = useTimerStore((s) => s.updatePomodoroSettings);
  const start = useTimerStore((s) => s.pomodoroStart);
  const pause = useTimerStore((s) => s.pomodoroPause);
  const skip = useTimerStore((s) => s.pomodoroSkip);
  const resetCycle = useTimerStore((s) => s.pomodoroResetCycle);
  const checkCompletion = useTimerStore((s) => s.checkPomodoroCompletion);

  const [now, setNow] = React.useState(() => Date.now());

  React.useEffect(() => {
    if (!pomodoro.running) return;
    const interval = setInterval(() => {
      checkCompletion();
      setNow(Date.now());
    }, 200);
    return () => clearInterval(interval);
  }, [pomodoro.running, checkCompletion]);

  const totalMs = phaseDurationMs(pomodoro.phase, pomodoroSettings);
  const remainingMs =
    pomodoro.running && pomodoro.startedAt ? Math.max(0, pomodoro.remainingAtStart - (now - pomodoro.startedAt)) : pomodoro.remainingAtStart;

  return {
    phase: pomodoro.phase,
    remainingMs,
    totalMs,
    isRunning: pomodoro.running,
    completedWorkSessions: pomodoro.completedWorkSessions,
    completedToday: pomodoro.completedToday,
    settings: pomodoroSettings,
    updateSettings,
    start,
    pause,
    skip,
    resetCycle,
  };
}
