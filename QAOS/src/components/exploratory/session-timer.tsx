"use client";

import { Play, Pause, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatStopwatch } from "@/lib/timer/time-formatter";
import { cn } from "@/lib/utils";
import type { Session } from "@/lib/exploratory/types";

export function SessionTimer({
  session,
  elapsedMs,
  targetMinutes,
  onStart,
  onPause,
  onComplete,
}: {
  session: Session;
  elapsedMs: number;
  targetMinutes: number;
  onStart: () => void;
  onPause: () => void;
  onComplete: () => void;
}) {
  const targetMs = targetMinutes * 60_000;
  const overTarget = elapsedMs > targetMs;
  const isRunning = session.status === "In Progress";
  const isDone = session.status === "Completed";

  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6">
      <div className={cn("font-mono text-5xl font-semibold tabular-nums tracking-tight", isRunning && "text-primary", overTarget && "text-warning")}>
        {formatStopwatch(elapsedMs, false)}
      </div>
      <p className="text-xs text-muted-foreground">
        Target: {targetMinutes}m {overTarget && !isDone && "— over target"}
      </p>
      <div className="flex items-center gap-2">
        {!isRunning && !isDone && (
          <Button size="lg" className="gap-1.5" onClick={onStart}>
            <Play className="size-4" />
            {session.status === "Paused" ? "Resume" : "Start"}
          </Button>
        )}
        {isRunning && (
          <Button size="lg" variant="outline" className="gap-1.5" onClick={onPause}>
            <Pause className="size-4" />
            Pause
          </Button>
        )}
        {!isDone && (
          <Button size="lg" variant="outline" className="gap-1.5" onClick={onComplete} disabled={session.status === "Planned"}>
            <CheckCircle2 className="size-4" />
            Complete
          </Button>
        )}
      </div>
    </div>
  );
}
