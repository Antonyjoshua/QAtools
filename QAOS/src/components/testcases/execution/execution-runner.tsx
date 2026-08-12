"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Check, X, ShieldAlert, SkipForward, RotateCcw, ChevronLeft, ChevronRight, Play, Square, Timer, Bug } from "lucide-react";
import { recordResult } from "@/lib/testcases/repo/execution-repo";
import { createBugFromTestCase } from "@/lib/testcases/services/bug-link";
import { useTestManagementSettings } from "@/lib/testcases/settings-store";
import { AttachmentsPanel } from "@/components/testcases/testcases/attachments-panel";
import { PriorityBadge, ResultBadge } from "@/components/testcases/shared/badges";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { TestCase, Execution, ExecutionResult, ExecutionResultStatus } from "@/lib/testcases/types";

const STATUS_OPTIONS: {
  status: ExecutionResultStatus;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  activeClass: string;
}[] = [
  { status: "Pass", label: "Pass", icon: Check, activeClass: "bg-success text-white border-success" },
  { status: "Fail", label: "Fail", icon: X, activeClass: "bg-destructive text-white border-destructive" },
  { status: "Blocked", label: "Blocked", icon: ShieldAlert, activeClass: "bg-warning text-white border-warning" },
  { status: "Skipped", label: "Skipped", icon: SkipForward, activeClass: "bg-chart-5 text-white border-chart-5" },
  { status: "Retest", label: "Retest", icon: RotateCcw, activeClass: "bg-chart-2 text-white border-chart-2" },
];

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function ExecutionRunner({ execution, testCases, results }: { execution: Execution; testCases: TestCase[]; results: ExecutionResult[] }) {
  const currentUser = useTestManagementSettings((s) => s.currentUser);
  const router = useRouter();
  const [selectedCaseId, setSelectedCaseId] = React.useState<string | null>(null);
  const [comment, setComment] = React.useState("");
  const [elapsed, setElapsed] = React.useState(0);
  const [timerRunning, setTimerRunning] = React.useState(false);
  const [reportingBug, setReportingBug] = React.useState(false);

  const resultByCase = React.useMemo(() => {
    const map = new Map<string, ExecutionResult>();
    for (const r of results) map.set(r.testCaseId, r);
    return map;
  }, [results]);

  // Falls back to the first case until the tester explicitly picks one.
  const activeCaseId = selectedCaseId ?? testCases[0]?.id ?? null;
  const activeIndex = testCases.findIndex((tc) => tc.id === activeCaseId);
  const activeCase = activeIndex >= 0 ? testCases[activeIndex] : null;
  const activeResult = activeCaseId ? resultByCase.get(activeCaseId) : undefined;

  // Reset the per-case scratch pad (comment/timer) during render when the active case
  // changes, per React's documented "adjusting state when a prop changes" pattern —
  // avoids the extra render a useEffect-based reset would cause.
  const [trackedCaseId, setTrackedCaseId] = React.useState(activeCaseId);
  if (trackedCaseId !== activeCaseId) {
    setTrackedCaseId(activeCaseId);
    setComment(activeResult?.comment ?? "");
    setElapsed(0);
    setTimerRunning(false);
  }

  React.useEffect(() => {
    if (!timerRunning) return;
    const interval = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(interval);
  }, [timerRunning]);

  function goRelative(offset: number) {
    const next = testCases[activeIndex + offset];
    if (next) setSelectedCaseId(next.id);
  }

  async function mark(status: ExecutionResultStatus) {
    if (!activeResult) return;
    await recordResult(activeResult.id, status, currentUser, comment, elapsed);
    const nextIndex = testCases.findIndex((tc, i) => i > activeIndex && resultByCase.get(tc.id)?.status === "Not Executed");
    if (nextIndex !== -1) setSelectedCaseId(testCases[nextIndex].id);
  }

  async function reportBug() {
    if (!activeCase || !activeResult) return;
    setReportingBug(true);
    try {
      const bug = await createBugFromTestCase(activeCase, execution, activeResult, currentUser);
      router.push(`/bugs/${bug.id}`);
    } finally {
      setReportingBug(false);
    }
  }

  if (!activeCase || !activeResult) {
    return <p className="py-10 text-center text-sm text-muted-foreground">No test cases in this run.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-[280px_1fr]">
      <aside className="flex max-h-[70vh] flex-col divide-y divide-border overflow-y-auto rounded-xl border border-border lg:max-h-[calc(100vh-220px)]">
        {testCases.map((tc) => {
          const r = resultByCase.get(tc.id);
          return (
            <button
              key={tc.id}
              type="button"
              onClick={() => setSelectedCaseId(tc.id)}
              className={cn(
                "flex items-center justify-between gap-2 px-3 py-2 text-left text-xs transition-colors hover:bg-accent/50",
                tc.id === activeCaseId && "bg-accent"
              )}
            >
              <span className="min-w-0 flex-1 truncate">
                <span className="font-mono text-muted-foreground">{tc.displayId}</span> {tc.title}
              </span>
              {r && <ResultBadge value={r.status} className="shrink-0 px-1.5 py-0 text-[10px]" />}
            </button>
          );
        })}
      </aside>

      <div className="flex flex-col gap-4">
        <div className="rounded-xl border border-border p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-muted-foreground">{activeCase.displayId}</span>
                <PriorityBadge value={activeCase.priority} />
                <ResultBadge value={activeResult.status} />
              </div>
              <h3 className="mt-1 text-base font-semibold">{activeCase.title}</h3>
            </div>
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon" className="size-7" onClick={() => goRelative(-1)} disabled={activeIndex <= 0} aria-label="Previous case">
                <ChevronLeft className="size-3.5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="size-7"
                onClick={() => goRelative(1)}
                disabled={activeIndex >= testCases.length - 1}
                aria-label="Next case"
              >
                <ChevronRight className="size-3.5" />
              </Button>
            </div>
          </div>

          {activeCase.preconditions && (
            <div className="mt-3">
              <p className="text-xs font-semibold text-muted-foreground">Preconditions</p>
              <p className="whitespace-pre-wrap text-sm">{activeCase.preconditions}</p>
            </div>
          )}
          {activeCase.testData && (
            <div className="mt-3">
              <p className="text-xs font-semibold text-muted-foreground">Test data</p>
              <p className="whitespace-pre-wrap text-sm">{activeCase.testData}</p>
            </div>
          )}
          {activeCase.expectedResult && (
            <div className="mt-3">
              <p className="text-xs font-semibold text-muted-foreground">Expected result</p>
              <p className="whitespace-pre-wrap text-sm">{activeCase.expectedResult}</p>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border p-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setTimerRunning((r) => !r)}>
              {timerRunning ? <Square className="size-3.5" /> : <Play className="size-3.5" />}
              {timerRunning ? "Pause" : "Start"} timer
            </Button>
            <span className="flex items-center gap-1.5 font-mono text-sm text-muted-foreground tabular-nums">
              <Timer className="size-3.5" />
              {formatDuration(elapsed)}
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {STATUS_OPTIONS.map((opt) => (
              <button
                key={opt.status}
                type="button"
                onClick={() => mark(opt.status)}
                className={cn(
                  "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors",
                  activeResult.status === opt.status ? opt.activeClass : "border-border hover:bg-accent"
                )}
              >
                <opt.icon className="size-3.5" />
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {(activeResult.status === "Fail" || activeResult.status === "Blocked") && (
          <div className="flex items-center justify-between gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4">
            <p className="text-sm text-destructive">This case {activeResult.status.toLowerCase()} — file a bug so it doesn&apos;t get lost.</p>
            <Button size="sm" variant="destructive" className="shrink-0 gap-1.5" onClick={reportBug} disabled={reportingBug}>
              <Bug className="size-3.5" />
              {reportingBug ? "Creating…" : "Report Bug"}
            </Button>
          </div>
        )}

        <div className="flex flex-col gap-2 rounded-xl border border-border p-4">
          <p className="text-xs font-semibold text-muted-foreground">Comment</p>
          <Textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={3} placeholder="Notes about this execution…" />
          <p className="text-xs text-muted-foreground">Comment and duration are saved with the next status you record.</p>
        </div>

        <div className="rounded-xl border border-border p-4">
          <p className="mb-2 text-xs font-semibold text-muted-foreground">Attachments</p>
          <AttachmentsPanel parentType="executionResult" parentId={activeResult.id} />
        </div>
      </div>
    </div>
  );
}
