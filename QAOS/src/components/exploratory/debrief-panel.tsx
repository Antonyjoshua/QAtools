"use client";

import { NOTE_TYPES } from "@/lib/exploratory/types";
import { formatStopwatch } from "@/lib/timer/time-formatter";
import type { SessionNote } from "@/lib/exploratory/types";

export function DebriefPanel({ notes, elapsedMs }: { notes: SessionNote[]; elapsedMs: number }) {
  const countByType = new Map(NOTE_TYPES.map((t) => [t, notes.filter((n) => n.type === t).length]));
  const bugsFiled = notes.filter((n) => n.type === "Bug" && n.linkedBugId).length;

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4">
      <p className="text-sm font-medium">Debrief</p>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Elapsed</span>
          <span className="font-mono tabular-nums">{formatStopwatch(elapsedMs, false)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Total notes</span>
          <span className="tabular-nums">{notes.length}</span>
        </div>
        {NOTE_TYPES.map((t) => (
          <div key={t} className="flex justify-between">
            <span className="text-muted-foreground">{t}</span>
            <span className="tabular-nums">{countByType.get(t) ?? 0}</span>
          </div>
        ))}
        <div className="flex justify-between">
          <span className="text-muted-foreground">Bugs filed</span>
          <span className="tabular-nums">{bugsFiled}</span>
        </div>
      </div>
    </div>
  );
}
