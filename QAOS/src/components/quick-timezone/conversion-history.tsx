"use client";

import * as React from "react";
import { ArrowRight, Trash2, History as HistoryIcon } from "lucide-react";
import { useQuickTimezoneStore } from "@/lib/timezone/store";
import { summarizeConversion } from "@/lib/timezone/history";
import { Button } from "@/components/ui/button";

export function ConversionHistory() {
  const history = useQuickTimezoneStore((s) => s.history);
  const removeEntry = useQuickTimezoneStore((s) => s.removeHistoryEntry);
  const clearHistory = useQuickTimezoneStore((s) => s.clearHistory);
  const use24Hour = useQuickTimezoneStore((s) => s.settings.use24Hour);
  const dateFormat = useQuickTimezoneStore((s) => s.settings.dateFormat);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">{history.length} conversion{history.length === 1 ? "" : "s"}</p>
        <Button variant="outline" size="icon" className="size-8 text-destructive" aria-label="Clear all" onClick={clearHistory} disabled={history.length === 0}>
          <Trash2 className="size-3.5" />
        </Button>
      </div>

      {history.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-10 text-center">
          <HistoryIcon className="size-6 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">No conversions yet.</p>
        </div>
      ) : (
        <div className="flex max-h-72 flex-col divide-y divide-border overflow-y-auto">
          {history.map((entry) => {
            const row = summarizeConversion(entry, use24Hour, dateFormat);
            return (
              <div key={entry.id} className="group flex items-center justify-between gap-2 py-2">
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1.5 truncate text-sm font-medium">
                    {row.sourceLabel}
                    <ArrowRight className="size-3 shrink-0 text-muted-foreground" />
                    {row.targetLabel}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {row.date} · {row.sourceTime} → {row.resultTime}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeEntry(entry.id)}
                  aria-label="Delete conversion"
                  className="shrink-0 rounded p-1 text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
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
