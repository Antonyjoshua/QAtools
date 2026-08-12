"use client";

import * as React from "react";
import { useQuickTimerStore } from "../store";

/** Elapsed time is always derived from wall-clock timestamps, so it can never drift. */
export function useStopwatch() {
  const stopwatch = useQuickTimerStore((s) => s.stopwatch);
  const start = useQuickTimerStore((s) => s.stopwatchStart);
  const pause = useQuickTimerStore((s) => s.stopwatchPause);
  const stop = useQuickTimerStore((s) => s.stopwatchStop);
  const reset = useQuickTimerStore((s) => s.stopwatchReset);
  const lap = useQuickTimerStore((s) => s.stopwatchLap);
  const clearLaps = useQuickTimerStore((s) => s.stopwatchClearLaps);

  const [now, setNow] = React.useState(() => Date.now());

  React.useEffect(() => {
    if (!stopwatch.running) return;
    let raf = requestAnimationFrame(function loop() {
      setNow(Date.now());
      raf = requestAnimationFrame(loop);
    });
    return () => cancelAnimationFrame(raf);
  }, [stopwatch.running]);

  const elapsedMs = stopwatch.accumulatedMs + (stopwatch.running && stopwatch.startedAt ? now - stopwatch.startedAt : 0);

  return {
    elapsedMs,
    laps: stopwatch.laps,
    isRunning: stopwatch.running,
    start,
    pause,
    stop,
    reset,
    lap,
    clearLaps,
  };
}
