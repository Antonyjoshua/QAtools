"use client";

import Link from "next/link";
import { useLiveQuery } from "dexie-react-hooks";
import { format } from "date-fns";
import { Download } from "lucide-react";
import { db } from "@/lib/bugs/db";

const FORMAT_LABEL: Record<string, string> = {
  pdf: "PDF",
  docx: "Word",
  markdown: "Markdown",
  html: "HTML",
  json: "JSON",
  print: "Print",
};

export default function ExportHistoryPage() {
  const history = useLiveQuery(() => db.exportHistory.orderBy("createdAt").reverse().toArray(), []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold tracking-tight">Export History</h1>
      <p className="mt-1 text-muted-foreground">Every bug report you&apos;ve exported, most recent first.</p>

      {(!history || history.length === 0) ? (
        <div className="mt-10 flex flex-col items-center gap-3 rounded-xl border border-dashed border-border py-16 text-center">
          <Download className="size-8 text-muted-foreground" />
          <p className="text-muted-foreground">No exports yet.</p>
        </div>
      ) : (
        <div className="mt-8 flex flex-col gap-2">
          {history.map((e) => (
            <Link
              key={e.id}
              href={`/bugs/${e.bugId}`}
              className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3 text-sm transition-colors hover:border-primary/40"
            >
              <span className="flex items-center gap-2">
                <span className="font-mono text-xs text-muted-foreground">{e.bugDisplayId}</span>
                exported as <span className="font-medium">{FORMAT_LABEL[e.format] ?? e.format}</span>
              </span>
              <span className="text-xs text-muted-foreground">{format(e.createdAt, "MMM d, yyyy h:mm a")}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
