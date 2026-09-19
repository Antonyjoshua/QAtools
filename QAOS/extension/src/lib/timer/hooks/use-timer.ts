"use client";

import * as React from "react";
import { useTimerStore } from "../store";

/** Countdown timer — remaining time is derived from wall-clock timestamps, so it survives the popup closing/reopening. */
export function useTimer() {
  const countdown = useTimerStore((s) => s.countdown);
  const setDuration = useTimerStore((s) => s.countdownSetDuration);
  const start = useTimerStore((s) => s.countdownStart);
  const pause = useTimerStore((s) => s.countdownPause);
  const stop = useTimerStore((s) => s.countdownStop);
  const reset = useTimerStore((s) => s.countdownReset);
  const checkCompletion = useTimerStore((s) => s.checkCountdownCompletion);

  const [now, setNow] = React.useState(() => Date.now());

  React.useEffect(() => {
    if (!countdown.running) return;
    const interval = setInterval(() => {
      checkCompletion();
      setNow(Date.now());
    }, 200);
    return () => clearInterval(interval);
  }, [countdown.running, checkCompletion]);

  const remainingMs =
    countdown.running && countdown.startedAt ? Math.max(0, countdown.remainingAtStart - (now - countdown.startedAt)) : countdown.remainingAtStart;

  return {
    remainingMs,
    totalMs: countdown.totalMs,
    label: countdown.label,
    isRunning: countdown.running,
    setDuration,
    start,
    pause,
    stop,
    reset,
  };
}
