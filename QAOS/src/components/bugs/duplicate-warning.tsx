import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import type { BugReport } from "@/lib/bugs/types";
import { StatusBadge } from "@/components/bugs/status-badges";

export function DuplicateWarning({ matches }: { matches: { bug: BugReport; similarity: number }[] }) {
  if (matches.length === 0) return null;
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-warning/30 bg-warning/10 p-3">
      <div className="flex items-center gap-2 text-sm font-medium text-warning">
        <AlertTriangle className="size-4" />
        Possible duplicate{matches.length > 1 ? "s" : ""} found
      </div>
      <div className="flex flex-col gap-1.5">
        {matches.map(({ bug, similarity }) => (
          <Link
            key={bug.id}
            href={`/bugs/${bug.id}`}
            target="_blank"
            className="flex items-center justify-between gap-2 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs hover:border-primary/40"
          >
            <span className="flex min-w-0 items-center gap-2">
              <span className="font-mono text-muted-foreground">{bug.displayId}</span>
              <span className="truncate">{bug.title}</span>
            </span>
            <span className="flex shrink-0 items-center gap-1.5">
              <StatusBadge status={bug.status} />
              <span className="text-muted-foreground">{Math.round(similarity * 100)}% similar</span>
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
