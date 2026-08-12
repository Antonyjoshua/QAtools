"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Play, Pause, Square, RotateCcw } from "lucide-react";
import { useTimer } from "@/lib/timer/hooks/use-timer";
import { formatCountdown } from "@/lib/timer/time-formatter";
import { COUNTDOWN_PRESETS_SECONDS } from "@/lib/timer/types";
import { CircularProgress } from "./circular-progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

function presetLabel(seconds: number): string {
  if (seconds < 60) return `${seconds}s`;
  return `${seconds / 60}m`;
}

export function CountdownTimer() {
  const { remainingMs, totalMs, isRunning, setDuration, start, pause, stop, reset } = useTimer();
  const isConfiguring = remainingMs === totalMs && !isRunning;
  const isComplete = remainingMs === 0 && totalMs > 0 && !isRunning;
  const isPaused = !isRunning && !isConfiguring && !isComplete;

  const [hours, setHours] = React.useState(0);
  const [minutes, setMinutes] = React.useState(5);
  const [seconds, setSeconds] = React.useState(0);

  const [flash, setFlash] = React.useState(false);
  const prevRemainingRef = React.useRef(remainingMs);
  React.useEffect(() => {
    if (prevRemainingRef.current > 0 && remainingMs === 0) {
      setFlash(true);
      const t = setTimeout(() => setFlash(false), 1800);
      return () => clearTimeout(t);
    }
    prevRemainingRef.current = remainingMs;
  }, [remainingMs]);

  function applyCustomDuration() {
    const ms = (hours * 3600 + minutes * 60 + seconds) * 1000;
    if (ms > 0) setDuration(ms, "Custom timer");
  }

  function applyPreset(sec: number) {
    setDuration(sec * 1000, presetLabel(sec));
  }

  const progress = totalMs > 0 ? 1 - remainingMs / totalMs : 0;

  return (
    <div className="flex flex-col items-center gap-5">
      {isConfiguring ? (
        <>
          <div className="flex items-center gap-2">
            {[
              { value: hours, setValue: setHours, max: 23, label: "h" },
              { value: minutes, setValue: setMinutes, max: 59, label: "m" },
              { value: seconds, setValue: setSeconds, max: 59, label: "s" },
            ].map((field) => (
              <div key={field.label} className="flex flex-col items-center gap-1">
                <Input
                  type="number"
                  min={0}
                  max={field.max}
                  value={field.value}
                  onChange={(e) => field.setValue(Math.min(field.max, Math.max(0, Number(e.target.value) || 0)))}
                  onBlur={applyCustomDuration}
                  className="h-14 w-16 text-center font-mono text-xl"
                />
                <span className="text-[11px] text-muted-foreground">{field.label}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-1.5">
            {COUNTDOWN_PRESETS_SECONDS.map((sec) => (
              <button
                key={sec}
                type="button"
                onClick={() => applyPreset(sec)}
                className="rounded-full border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
              >
                {presetLabel(sec)}
              </button>
            ))}
          </div>

          <Button size="lg" className="h-11 gap-1.5 px-6" onClick={start} disabled={totalMs <= 0}>
            <Play className="size-4" />
            Start
          </Button>
        </>
      ) : (
        <>
          <motion.div animate={flash ? { scale: [1, 1.06, 1] } : {}} transition={{ duration: 0.6, repeat: flash ? 2 : 0 }}>
            <CircularProgress progress={progress} indicatorClassName={cn(isComplete && "stroke-success")}>
              <div className="flex flex-col items-center">
                <span className={cn("font-mono text-3xl font-semibold tabular-nums", isComplete && "text-success")}>
                  {isComplete ? "00:00" : formatCountdown(remainingMs)}
                </span>
                {isComplete && <span className="mt-1 text-xs font-medium text-success">Time&apos;s up!</span>}
              </div>
            </CircularProgress>
          </motion.div>

          <div className="flex items-center gap-2">
            {isRunning && (
              <>
                <Button size="lg" variant="outline" className="h-11 gap-1.5 px-5" onClick={pause}>
                  <Pause className="size-4" />
                  Pause
                </Button>
                <Button size="lg" variant="destructive" className="h-11 gap-1.5 px-5" onClick={stop}>
                  <Square className="size-4" />
                  Stop
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
            {isComplete && (
              <Button size="lg" className="h-11 gap-1.5 px-6" onClick={reset}>
                <RotateCcw className="size-4" />
                New timer
              </Button>
            )}
          </div>
        </>
      )}
    </div>
  );
}
