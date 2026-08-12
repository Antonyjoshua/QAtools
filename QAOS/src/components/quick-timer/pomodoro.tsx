"use client";

import * as React from "react";
import { Play, Pause, SkipForward, RotateCcw, Briefcase, Coffee, BedDouble } from "lucide-react";
import { usePomodoro } from "@/lib/timer/hooks/use-pomodoro";
import { formatCountdown } from "@/lib/timer/time-formatter";
import { fireConfetti } from "@/lib/timer/confetti";
import { CircularProgress } from "./circular-progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useQuickTimerStore } from "@/lib/timer/store";
import { cn } from "@/lib/utils";
import type { PomodoroPhase } from "@/lib/timer/types";

const PHASE_META: Record<PomodoroPhase, { label: string; icon: React.ComponentType<{ className?: string }>; className: string }> = {
  work: { label: "Focus", icon: Briefcase, className: "text-primary" },
  break: { label: "Short break", icon: Coffee, className: "text-success" },
  longBreak: { label: "Long break", icon: BedDouble, className: "text-chart-2" },
};

export function Pomodoro() {
  const { phase, remainingMs, totalMs, isRunning, completedWorkSessions, completedToday, settings, updateSettings, start, pause, skip, resetCycle } =
    usePomodoro();
  const autoStart = useQuickTimerStore((s) => s.settings.autoStart);
  const autoRepeat = useQuickTimerStore((s) => s.settings.autoRepeat);
  const updateGlobalSettings = useQuickTimerStore((s) => s.updateSettings);
  const [showSettings, setShowSettings] = React.useState(false);
  const ringRef = React.useRef<HTMLDivElement>(null);

  const prevPhaseRef = React.useRef(phase);
  React.useEffect(() => {
    if (prevPhaseRef.current === "work" && phase !== "work" && ringRef.current) {
      fireConfetti(ringRef.current);
    }
    prevPhaseRef.current = phase;
  }, [phase]);

  const meta = PHASE_META[phase];
  const progress = totalMs > 0 ? 1 - remainingMs / totalMs : 0;

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium">
        <meta.icon className={cn("size-3.5", meta.className)} />
        <span className={meta.className}>{meta.label}</span>
      </div>

      <CircularProgress
        ref={ringRef}
        progress={progress}
        indicatorClassName={phase === "work" ? "stroke-primary" : phase === "break" ? "stroke-success" : "stroke-chart-2"}
      >
        <div className="flex flex-col items-center">
          <span className="font-mono text-3xl font-semibold tabular-nums">{formatCountdown(remainingMs)}</span>
          <span className="mt-1 text-[11px] text-muted-foreground">
            Session {completedWorkSessions % settings.sessionsUntilLongBreak || settings.sessionsUntilLongBreak}/{settings.sessionsUntilLongBreak}
          </span>
        </div>
      </CircularProgress>

      <div className="flex items-center gap-2">
        {isRunning ? (
          <Button size="lg" variant="outline" className="h-11 gap-1.5 px-5" onClick={pause}>
            <Pause className="size-4" />
            Pause
          </Button>
        ) : (
          <Button size="lg" className="h-11 gap-1.5 px-6" onClick={start}>
            <Play className="size-4" />
            {remainingMs < totalMs ? "Resume" : "Start"}
          </Button>
        )}
        <Button size="lg" variant="outline" className="h-11 gap-1.5 px-5" onClick={skip}>
          <SkipForward className="size-4" />
          Skip
        </Button>
        <Button size="lg" variant="ghost" className="h-11 gap-1.5 px-3" onClick={resetCycle} aria-label="Reset cycle">
          <RotateCcw className="size-4" />
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">{completedToday} session{completedToday === 1 ? "" : "s"} completed today</p>

      <button
        type="button"
        onClick={() => setShowSettings((v) => !v)}
        className="text-xs font-medium text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
      >
        {showSettings ? "Hide" : "Adjust"} durations
      </button>

      {showSettings && (
        <div className="flex w-full flex-col gap-3 rounded-lg border border-border p-3">
          <div className="grid grid-cols-3 gap-2">
            {[
              { key: "workMinutes" as const, label: "Work" },
              { key: "breakMinutes" as const, label: "Break" },
              { key: "longBreakMinutes" as const, label: "Long break" },
            ].map((f) => (
              <div key={f.key} className="flex flex-col items-center gap-1">
                <Input
                  type="number"
                  min={1}
                  max={180}
                  value={settings[f.key]}
                  onChange={(e) => updateSettings({ [f.key]: Math.max(1, Number(e.target.value) || 1) })}
                  className="h-9 w-full text-center font-mono text-sm"
                />
                <span className="text-[10px] text-muted-foreground">{f.label} (min)</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="pomodoro-auto-start" className="text-xs font-normal text-muted-foreground">
              Auto-start next session
            </Label>
            <Switch id="pomodoro-auto-start" checked={autoStart} onCheckedChange={(v) => updateGlobalSettings({ autoStart: Boolean(v) })} />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="pomodoro-auto-repeat" className="text-xs font-normal text-muted-foreground">
              Auto-repeat after long break
            </Label>
            <Switch id="pomodoro-auto-repeat" checked={autoRepeat} onCheckedChange={(v) => updateGlobalSettings({ autoRepeat: Boolean(v) })} />
          </div>
        </div>
      )}
    </div>
  );
}
