"use client";

import * as React from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { History, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { db } from "@/lib/api-console/db";
import { clearHistory } from "@/lib/api-console/repo/history-repo";
import { cn } from "@/lib/utils";
import type { RequestHistoryEntry } from "@/lib/api-console/types";

function statusClass(status: number): string {
  if (status >= 200 && status < 300) return "text-success";
  if (status >= 400 && status < 500) return "text-warning";
  if (status >= 500) return "text-destructive";
  return "text-muted-foreground";
}

export function HistoryPanel({ onReplay }: { onReplay: (entry: RequestHistoryEntry) => void }) {
  const [open, setOpen] = React.useState(false);
  const history = useLiveQuery(() => db.history.orderBy("timestamp").reverse().toArray(), []) ?? [];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button variant="ghost" size="sm" className="gap-1.5">
            <History className="size-3.5" />
            History
          </Button>
        }
      />
      <SheetContent>
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle>Request history</SheetTitle>
            {history.length > 0 && (
              <Button variant="ghost" size="sm" className="gap-1.5 text-xs" onClick={() => clearHistory()}>
                <Trash2 className="size-3.5" />
                Clear
              </Button>
            )}
          </div>
        </SheetHeader>
        <div className="flex flex-col divide-y divide-border overflow-y-auto px-4">
          {history.length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">No requests sent yet.</p>}
          {history.map((h) => (
            <button
              key={h.id}
              type="button"
              onClick={() => {
                onReplay(h);
                setOpen(false);
              }}
              className="flex flex-col items-start gap-0.5 py-2.5 text-left text-xs hover:bg-accent/50"
            >
              <div className="flex w-full items-center gap-2">
                <span className="w-12 shrink-0 font-mono font-semibold">{h.method}</span>
                <span className="min-w-0 flex-1 truncate">{h.url}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <span className={cn("font-mono", statusClass(h.status ?? 0))}>{h.status ?? "ERR"}</span>
                <span>{h.durationMs}ms</span>
                <span>{new Date(h.timestamp).toLocaleTimeString()}</span>
                {h.assertionResults.length > 0 && (
                  <Badge variant="outline" className="px-1.5 text-[10px]">
                    {h.assertionResults.filter((a) => a.passed).length}/{h.assertionResults.length} passed
                  </Badge>
                )}
              </div>
            </button>
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}
