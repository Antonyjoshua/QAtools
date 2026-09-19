"use client";

import * as React from "react";
import { useTimerStore } from "../store";

/** Elapsed time is always derived from wall-clock timestamps, so it can never drift. */
export function useStopwatch() {
  const stopwatch = useTimerStore((s) => s.stopwatch);
  const start = useTimerStore((s) => s.stopwatchStart);
  const pause = useTimerStore((s) => s.stopwatchPause);
  const stop = useTimerStore((s) => s.stopwatchStop);
  const reset = useTimerStore((s) => s.stopwatchReset);
  const lap = useTimerStore((s) => s.stopwatchLap);
  const clearLaps = useTimerStore((s) => s.stopwatchClearLaps);

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
