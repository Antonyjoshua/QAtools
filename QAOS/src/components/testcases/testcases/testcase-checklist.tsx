"use client";

import * as React from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { Check, X, ShieldAlert, SkipForward } from "lucide-react";
import { db } from "@/lib/testcases/db";
import { createExecution, recordResult } from "@/lib/testcases/repo/execution-repo";
import { useTestManagementSettings } from "@/lib/testcases/settings-store";
import { cn } from "@/lib/utils";
import type { TestCase, ExecutionResult, ExecutionResultStatus } from "@/lib/testcases/types";

const OPTIONS: { status: ExecutionResultStatus; label: string; icon: React.ComponentType<{ className?: string }>; activeClass: string }[] = [
  { status: "Pass", label: "Pass", icon: Check, activeClass: "bg-success text-white border-success" },
  { status: "Fail", label: "Fail", icon: X, activeClass: "bg-destructive text-white border-destructive" },
  { status: "Blocked", label: "Blocked", icon: ShieldAlert, activeClass: "bg-warning text-white border-warning" },
  { status: "Skipped", label: "Skipped", icon: SkipForward, activeClass: "bg-chart-5 text-white border-chart-5" },
];

export function TestCaseChecklist({ testCases, suiteId }: { testCases: TestCase[]; suiteId: string }) {
  const currentUser = useTestManagementSettings((s) => s.currentUser);
  const [executionId, setExecutionId] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    async function ensureExecution() {
      const existing = await db.executions.where("projectId").equals(testCases[0]?.projectId ?? "").toArray();
      const quick = existing.find((e) => e.name === `Quick Checklist — ${suiteId}` && e.status !== "Completed");
      if (quick) {
        if (!cancelled) setExecutionId(quick.id);
        return;
      }
      if (!testCases.length) return;
      const execution = await createExecution({
        projectId: testCases[0].projectId,
        name: `Quick Checklist — ${suiteId}`,
        description: "Ad-hoc quick execution from the checklist view.",
        testCaseIds: testCases.map((tc) => tc.id),
      });
      if (!cancelled) setExecutionId(execution.id);
    }
    void ensureExecution();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [suiteId]);

  const results = useLiveQuery(
    () => (executionId ? db.executionResults.where("executionId").equals(executionId).toArray() : Promise.resolve<ExecutionResult[]>([])),
    [executionId]
  );

  const resultByCase = React.useMemo(() => {
    const map = new Map<string, ExecutionResult>();
    (results ?? []).forEach((r) => map.set(r.testCaseId, r));
    return map;
  }, [results]);

  async function mark(testCaseId: string, status: ExecutionResultStatus) {
    const result = resultByCase.get(testCaseId);
    if (!result) return;
    await recordResult(result.id, status, currentUser);
  }

  if (!executionId) return <p className="py-8 text-center text-sm text-muted-foreground">Preparing checklist…</p>;

  return (
    <div className="flex flex-col divide-y divide-border rounded-xl border border-border">
      {testCases.map((tc) => {
        const result = resultByCase.get(tc.id);
        return (
          <div key={tc.id} className="flex items-center gap-3 px-3 py-2.5">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{tc.title}</p>
              <p className="font-mono text-[11px] text-muted-foreground">{tc.displayId}</p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              {OPTIONS.map((opt) => (
                <button
                  key={opt.status}
                  type="button"
                  onClick={() => mark(tc.id, opt.status)}
                  aria-label={opt.label}
                  title={opt.label}
                  className={cn(
                    "flex size-7 items-center justify-center rounded-md border text-muted-foreground transition-colors",
                    result?.status === opt.status ? opt.activeClass : "border-border/60 hover:bg-accent"
                  )}
                >
                  <opt.icon className="size-3.5" />
                </button>
              ))}
            </div>
          </div>
        );
      })}
      {testCases.length === 0 && <p className="py-8 text-center text-sm text-muted-foreground">No test cases to check off.</p>}
    </div>
  );
}
