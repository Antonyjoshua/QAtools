"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, Square, RotateCcw, Flag, Trash2 } from "lucide-react";
import { useStopwatch } from "@/lib/timer/hooks/use-stopwatch";
import { useQuickTimerStore } from "@/lib/timer/store";
import { formatStopwatch } from "@/lib/timer/time-formatter";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Stopwatch() {
  const { elapsedMs, laps, isRunning, start, pause, stop, reset, lap, clearLaps } = useStopwatch();
  const showMilliseconds = useQuickTimerStore((s) => s.settings.showMilliseconds);
  const isPaused = !isRunning && elapsedMs > 0;

  const fastestId = React.useMemo(() => {
    if (laps.length < 2) return null;
    return laps.reduce((min, l) => (l.lapMs < min.lapMs ? l : min), laps[0]).id;
  }, [laps]);
  const slowestId = React.useMemo(() => {
    if (laps.length < 2) return null;
    return laps.reduce((max, l) => (l.lapMs > max.lapMs ? l : max), laps[0]).id;
  }, [laps]);

  return (
    <div className="flex flex-col items-center gap-5">
      <div
        className={cn(
          "font-mono text-4xl font-semibold tabular-nums tracking-tight transition-colors",
          isRunning && "text-primary"
        )}
      >
        {formatStopwatch(elapsedMs, showMilliseconds)}
      </div>

      <div className="flex items-center gap-2">
        {!isRunning && !isPaused && (
          <Button size="lg" className="h-11 gap-1.5 px-6" onClick={start}>
            <Play className="size-4" />
            Start
          </Button>
        )}
        {isRunning && (
          <>
            <Button size="lg" variant="outline" className="h-11 gap-1.5 px-5" onClick={lap}>
              <Flag className="size-4" />
              Lap
            </Button>
            <Button size="lg" className="h-11 gap-1.5 px-6" onClick={pause}>
              <Pause className="size-4" />
              Pause
            </Button>
          </>
        )}
        {isPaused && (
          <>
            <Button size="lg" variant="outline" className="h-11 gap-1.5 px-5" onClick={reset}>
              <RotateCcw className="size-4" />
              Reset
            </Button>
            <Button size="lg" className="h-11 gap-1.5 px-6" onClick={start}>
              <Play className="size-4" />
              Resume
            </Button>
            <Button size="lg" variant="destructive" className="h-11 gap-1.5 px-5" onClick={stop}>
              <Square className="size-4" />
              Stop
            </Button>
          </>
        )}
      </div>

      {laps.length > 0 && (
        <div className="flex w-full flex-col gap-2">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium text-muted-foreground">{laps.length} lap{laps.length === 1 ? "" : "s"}</p>
            <button type="button" onClick={clearLaps} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive">
              <Trash2 className="size-3" />
              Clear laps
            </button>
          </div>
          <div className="flex max-h-40 flex-col divide-y divide-border overflow-y-auto rounded-lg border border-border">
            <AnimatePresence initial={false}>
              {laps.map((l) => (
                <motion.div
                  key={l.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className={cn(
                    "flex items-center justify-between px-3 py-1.5 text-xs font-mono tabular-nums",
                    l.id === fastestId && "text-success",
                    l.id === slowestId && "text-destructive"
                  )}
                >
                  <span className="text-muted-foreground">Lap {l.index}</span>
                  <span>{formatStopwatch(l.lapMs, showMilliseconds)}</span>
                  <span className="text-muted-foreground">{formatStopwatch(l.totalMs, showMilliseconds)}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
