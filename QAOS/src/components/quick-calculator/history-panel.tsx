"use client";

import { motion } from "framer-motion";
import { Copy, RotateCcw, Trash2, History as HistoryIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { formatTimestamp } from "@/lib/quick-calculator/formatter";
import type { UseCalculatorReturn } from "@/lib/quick-calculator/use-calculator";

export function HistoryPanel({ calc }: { calc: UseCalculatorReturn }) {
  const { history, removeHistoryEntry, clearHistory, loadHistoryEntry } = calc;

  async function copyEntry(value: string) {
    try {
      await navigator.clipboard.writeText(value);
      toast.success("Copied", { description: value });
    } catch {
      toast.error("Couldn't copy to clipboard");
    }
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-1 pb-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">History</p>
        {history.length > 0 && (
          <Button variant="ghost" size="sm" className="h-6 px-1.5 text-xs text-muted-foreground" onClick={clearHistory}>
            Clear all
          </Button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 py-10 text-center">
          <HistoryIcon className="size-6 text-muted-foreground/40" />
          <p className="text-xs text-muted-foreground">Your last 100 calculations show up here.</p>
        </div>
      ) : (
        <div className="flex-1 space-y-1 overflow-y-auto scrollbar-thin pr-0.5">
          {history.map((entry, index) => {
            const { date, time } = formatTimestamp(entry.timestamp);
            return (
              <motion.div
                key={entry.id}
                initial={index === 0 ? { opacity: 0, x: 16 } : false}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.18 }}
                className="group flex items-center justify-between gap-2 rounded-lg border border-border/50 bg-foreground/[0.02] px-2.5 py-2 hover:bg-foreground/[0.05]"
              >
                <button type="button" className="min-w-0 flex-1 text-left" onClick={() => loadHistoryEntry(entry.expression)}>
                  <p className="truncate font-mono text-[11px] text-muted-foreground">{entry.expression}</p>
                  <p className="truncate font-mono text-sm font-semibold tabular-nums">{entry.result}</p>
                </button>
                <div className="flex shrink-0 flex-col items-end gap-1">
                  <span className="text-[10px] text-muted-foreground/70">
                    {date} · {time}
                  </span>
                  <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-5.5"
                      aria-label="Reuse"
                      onClick={() => loadHistoryEntry(entry.expression)}
                    >
                      <RotateCcw className="size-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-5.5"
                      aria-label="Copy result"
                      onClick={() => copyEntry(entry.result)}
                    >
                      <Copy className="size-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-5.5 text-destructive"
                      aria-label="Delete"
                      onClick={() => removeHistoryEntry(entry.id)}
                    >
                      <Trash2 className="size-3" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
