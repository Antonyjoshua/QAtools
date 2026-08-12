"use client";

import Link from "next/link";
import { useLiveQuery } from "dexie-react-hooks";
import { Bug } from "lucide-react";
import { getBugsForTestCase } from "@/lib/bugs/bugs-repo";
import { StatusBadge as BugStatusBadge, SeverityBadge as BugSeverityBadge, PriorityBadge as BugPriorityBadge } from "@/components/bugs/status-badges";

export function LinkedBugsPanel({ testCaseId }: { testCaseId: string }) {
  const bugs = useLiveQuery(() => getBugsForTestCase(testCaseId), [testCaseId]) ?? [];

  if (bugs.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-8 text-center">
        <Bug className="size-6 text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">No bugs linked yet — file one from a failed execution to see it here.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col divide-y divide-border rounded-xl border border-border">
      {bugs.map((bug) => (
        <Link key={bug.id} href={`/bugs/${bug.id}`} className="flex items-center justify-between gap-3 px-3 py-2.5 hover:bg-accent/40">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">
              <span className="font-mono text-xs text-muted-foreground">{bug.displayId}</span> {bug.title}
            </p>
            <p className="text-xs text-muted-foreground">{new Date(bug.createdAt).toLocaleString()}</p>
          </div>
          <div className="flex shrink-0 items-center gap-1">
            <BugSeverityBadge severity={bug.severity} />
            <BugPriorityBadge priority={bug.priority} />
            <BugStatusBadge status={bug.status} />
          </div>
        </Link>
      ))}
    </div>
  );
}
