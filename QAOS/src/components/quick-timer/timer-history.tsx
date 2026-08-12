"use client";

import * as React from "react";
import { Search, Trash2, Download, History as HistoryIcon } from "lucide-react";
import { useQuickTimerStore } from "@/lib/timer/store";
import { exportSessionHistoryToCSV } from "@/lib/timer/storage";
import { formatDurationLabel } from "@/lib/timer/time-formatter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function TimerHistory() {
  const history = useQuickTimerStore((s) => s.history);
  const removeEntry = useQuickTimerStore((s) => s.removeHistoryEntry);
  const clearHistory = useQuickTimerStore((s) => s.clearHistory);
  const [query, setQuery] = React.useState("");

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return history;
    return history.filter((h) => h.name.toLowerCase().includes(q) || h.sessionType.toLowerCase().includes(q));
  }, [history, query]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search sessions…" className="h-8 pl-8 text-sm" />
        </div>
        <Button variant="outline" size="icon" className="size-8" aria-label="Export CSV" onClick={() => exportSessionHistoryToCSV(filtered)} disabled={filtered.length === 0}>
          <Download className="size-3.5" />
        </Button>
        <Button variant="outline" size="icon" className="size-8 text-destructive" aria-label="Clear all" onClick={clearHistory} disabled={history.length === 0}>
          <Trash2 className="size-3.5" />
        </Button>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-10 text-center">
          <HistoryIcon className="size-6 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">{history.length === 0 ? "No sessions yet." : "No sessions match your search."}</p>
        </div>
      ) : (
        <div className="flex max-h-72 flex-col divide-y divide-border overflow-y-auto">
          {filtered.map((entry) => {
            const completed = new Date(entry.completedAt);
            return (
              <div key={entry.id} className="group flex items-center justify-between gap-2 py-2">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{entry.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {entry.sessionType} · {formatDurationLabel(entry.durationMs)} · {completed.toLocaleDateString()} {completed.toLocaleTimeString()}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeEntry(entry.id)}
                  aria-label="Delete session"
                  className={cn("shrink-0 rounded p-1 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100")}
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
