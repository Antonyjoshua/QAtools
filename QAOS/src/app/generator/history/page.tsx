"use client";

import Link from "next/link";
import { History, Trash2, RotateCcw } from "lucide-react";
import { useAppStore } from "@/lib/generator/store";
import { Button } from "@/components/ui/button";

function formatTime(ts: number): string {
  return new Date(ts).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" });
}

export default function HistoryPage() {
  const history = useAppStore((s) => s.history);
  const clearHistory = useAppStore((s) => s.clearHistory);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">History</h1>
          <p className="mt-1 text-muted-foreground">Your last 50 generation runs, most recent first.</p>
        </div>
        {history.length > 0 && (
          <Button variant="outline" size="sm" className="gap-1.5" onClick={clearHistory}>
            <Trash2 className="size-3.5" />
            Clear history
          </Button>
        )}
      </div>

      {history.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border py-16 text-center">
          <History className="size-8 text-muted-foreground" />
          <p className="text-muted-foreground">No generation history yet.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {history.map((entry) => {
            const tpl = encodeURIComponent(JSON.stringify({ count: entry.count, options: entry.options }));
            return (
              <div key={entry.id} className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card p-3">
                <div className="min-w-0">
                  <p className="truncate font-medium">{entry.generatorName}</p>
                  <p className="text-xs text-muted-foreground">
                    {entry.count.toLocaleString("en-US")} rows &middot; {formatTime(entry.timestamp)}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="shrink-0 gap-1.5"
                  render={
                    <Link href={`/generator/g/${entry.slug}?tpl=${tpl}`}>
                      <RotateCcw className="size-3.5" />
                      Run again
                    </Link>
                  }
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
