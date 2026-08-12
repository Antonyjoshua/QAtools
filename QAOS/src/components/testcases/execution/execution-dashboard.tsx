"use client";

import { CheckCircle2, XCircle, ShieldAlert, SkipForward, RotateCcw, CircleDashed } from "lucide-react";
import { computeStats } from "@/lib/testcases/repo/execution-repo";
import { StackedProgress } from "@/components/testcases/shared/stacked-progress";
import { ResultBadge } from "@/components/testcases/shared/badges";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ExecutionResult, ExecutionStats, TestCase } from "@/lib/testcases/types";

const STAT_CARDS: { key: keyof ExecutionStats; label: string; icon: React.ComponentType<{ className?: string }>; className: string }[] = [
  { key: "pass", label: "Passed", icon: CheckCircle2, className: "text-success" },
  { key: "fail", label: "Failed", icon: XCircle, className: "text-destructive" },
  { key: "blocked", label: "Blocked", icon: ShieldAlert, className: "text-warning" },
  { key: "skipped", label: "Skipped", icon: SkipForward, className: "text-chart-5" },
  { key: "retest", label: "Retest", icon: RotateCcw, className: "text-chart-2" },
  { key: "notExecuted", label: "Not Executed", icon: CircleDashed, className: "text-muted-foreground" },
];

export function ExecutionDashboard({ results, testCases }: { results: ExecutionResult[]; testCases: TestCase[] }) {
  const stats = computeStats(results);
  const caseById = new Map(testCases.map((tc) => [tc.id, tc]));

  return (
    <div className="flex flex-col gap-5">
      <div className="rounded-xl border border-border p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium">Execution progress</p>
            <p className="text-xs text-muted-foreground">
              {stats.executionRate}% executed · {stats.passRate}% pass rate of executed
            </p>
          </div>
          <p className="text-2xl font-semibold tabular-nums">{stats.executionRate}%</p>
        </div>
        <StackedProgress stats={stats} className="mt-3 h-2.5" />
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {STAT_CARDS.map((card) => (
          <Card key={card.key} size="sm">
            <CardContent className="flex flex-col gap-1">
              <card.icon className={cn("size-4", card.className)} />
              <span className="text-xl font-semibold tabular-nums">{stats[card.key]}</span>
              <span className="text-xs text-muted-foreground">{card.label}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm">
          <thead className="bg-card">
            <tr className="border-b border-border text-left text-xs font-semibold text-muted-foreground">
              <th className="px-3 py-2">Test case</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Executed by</th>
              <th className="px-3 py-2">Duration</th>
              <th className="px-3 py-2">Comment</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => {
              const tc = caseById.get(r.testCaseId);
              return (
                <tr key={r.id} className="border-b border-border last:border-0">
                  <td className="px-3 py-2">
                    <span className="font-mono text-xs text-muted-foreground">{tc?.displayId}</span> {tc?.title}
                  </td>
                  <td className="px-3 py-2">
                    <ResultBadge value={r.status} />
                  </td>
                  <td className="px-3 py-2 text-xs text-muted-foreground">{r.executedBy || "—"}</td>
                  <td className="px-3 py-2 text-xs text-muted-foreground tabular-nums">{r.durationSeconds ? `${r.durationSeconds}s` : "—"}</td>
                  <td className="max-w-64 truncate px-3 py-2 text-xs text-muted-foreground">{r.comment || "—"}</td>
                </tr>
              );
            })}
            {results.length === 0 && (
              <tr>
                <td colSpan={5} className="px-3 py-10 text-center text-sm text-muted-foreground">
                  No results yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
