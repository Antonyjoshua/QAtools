"use client";

import * as React from "react";
import Link from "next/link";
import { useLiveQuery } from "dexie-react-hooks";
import { formatDistanceToNow } from "date-fns";
import { CheckCircle2, XCircle, Download, Trash2, RotateCcw, History as HistoryIcon } from "lucide-react";
import { db } from "@/lib/convert/db";
import { deleteHistoryEntry, cleanupExpiredHistory } from "@/lib/convert/services/storage";
import { downloadOutput } from "@/lib/convert/services/conversion-service";
import { formatFileSize } from "@/lib/convert/services/format-detection";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function HistoryList({ limit }: { limit?: number }) {
  React.useEffect(() => {
    void cleanupExpiredHistory();
  }, []);

  const entries = useLiveQuery(async () => {
    const all = await db.history.orderBy("createdAt").reverse().toArray();
    return limit ? all.slice(0, limit) : all;
  }, [limit]);

  if (entries && entries.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-xl border border-dashed border-border py-10 text-center text-muted-foreground">
        <HistoryIcon className="size-6" />
        <p className="text-sm">No conversions yet — your history will show up here.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {(entries ?? []).map((entry) => (
        <div key={entry.id} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
          <div className="shrink-0">{entry.status === "completed" ? <CheckCircle2 className="size-5 text-success" /> : <XCircle className="size-5 text-destructive" />}</div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{entry.originalFileName}</p>
            <p className="truncate text-xs text-muted-foreground">
              <span className="uppercase">{entry.inputFormat}</span> → <span className="uppercase">{entry.outputFormat}</span>
              {" · "}
              {formatFileSize(entry.originalSize)}
              {" · "}
              {formatDistanceToNow(entry.createdAt, { addSuffix: true })}
            </p>
            {entry.status === "failed" && <p className="truncate text-xs text-destructive">{entry.errorMessage}</p>}
          </div>
          <div className="flex shrink-0 items-center gap-1">
            {entry.status === "completed" && entry.outputs.some((o) => o.blob) && (
              <Button
                variant="ghost"
                size="icon"
                className="size-8"
                aria-label="Download"
                onClick={() => entry.outputs.forEach((o) => o.blob && downloadOutput(o.name, o.blob))}
              >
                <Download className="size-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              aria-label="Convert again"
              nativeButton={false}
              render={<Link href={`/convert?from=${entry.inputFormat}&to=${entry.outputFormat}`} />}
            >
              <RotateCcw className="size-4" />
            </Button>
            <Button variant="ghost" size="icon" className={cn("size-8 text-destructive")} aria-label="Delete" onClick={() => void deleteHistoryEntry(entry.id)}>
              <Trash2 className="size-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
