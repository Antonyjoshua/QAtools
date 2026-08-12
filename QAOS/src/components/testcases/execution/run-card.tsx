"use client";

import Link from "next/link";
import { useLiveQuery } from "dexie-react-hooks";
import { CalendarClock, ClipboardCheck } from "lucide-react";
import { db } from "@/lib/testcases/db";
import { computeStats } from "@/lib/testcases/repo/execution-repo";
import { RunStatusBadge } from "@/components/testcases/shared/badges";
import { StackedProgress } from "@/components/testcases/shared/stacked-progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Execution } from "@/lib/testcases/types";

export function RunCard({ execution, projectName }: { execution: Execution; projectName?: string }) {
  const results = useLiveQuery(() => db.executionResults.where("executionId").equals(execution.id).toArray(), [execution.id]) ?? [];
  const stats = computeStats(results);

  return (
    <Link href={`/testcases/runs/${execution.id}`} className="group">
      <Card className="h-full transition-colors group-hover:border-primary/40">
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ClipboardCheck className="size-4.5" />
            </div>
            <RunStatusBadge value={execution.status} />
          </div>
          <CardTitle className="mt-2 line-clamp-1">{execution.name}</CardTitle>
          {projectName && <p className="text-xs text-muted-foreground">{projectName}</p>}
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <StackedProgress stats={stats} />
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>
              {stats.pass}/{stats.total} passed · {stats.executionRate}% executed
            </span>
            {execution.scheduledFor && (
              <span className="flex items-center gap-1">
                <CalendarClock className="size-3" />
                {new Date(execution.scheduledFor).toLocaleDateString()}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
