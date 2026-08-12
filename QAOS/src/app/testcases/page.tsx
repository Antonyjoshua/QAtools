"use client";

import * as React from "react";
import Link from "next/link";
import { useLiveQuery } from "dexie-react-hooks";
import {
  ClipboardList,
  FolderTree,
  ListChecks,
  CheckCircle2,
  XCircle,
  ShieldAlert,
  CalendarCheck2,
  Percent,
  Star,
  PlayCircle,
  FileBarChart2,
  History as HistoryIcon,
  PlusCircle,
  Pencil,
  RotateCcw,
} from "lucide-react";
import { db } from "@/lib/testcases/db";
import { computeStats } from "@/lib/testcases/repo/execution-repo";
import { NewProjectDialog } from "@/components/testcases/projects/new-project-dialog";
import { NewRunDialog } from "@/components/testcases/execution/new-run-dialog";
import { StackedProgress } from "@/components/testcases/shared/stacked-progress";
import { ResultBadge } from "@/components/testcases/shared/badges";
import { ExecutionTrendChart } from "@/components/testcases/shared/trend-chart";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { Project, TestCase, ExecutionResult } from "@/lib/testcases/types";

const EMPTY_PROJECTS: Project[] = [];
const EMPTY_TEST_CASES: TestCase[] = [];
const EMPTY_RESULTS: ExecutionResult[] = [];

function StatTile({ label, value, icon: Icon, className }: { label: string; value: number | string; icon: React.ElementType; className?: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
      <div className={`flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground ${className ?? ""}`}>
        <Icon className="size-5" />
      </div>
      <div>
        <p className="text-2xl font-semibold tracking-tight tabular-nums">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

function Panel({ title, action, children }: { title: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between gap-2">
        <h2 className="text-sm font-medium">{title}</h2>
        {action}
      </div>
      {children}
    </div>
  );
}

const HISTORY_ICON = { created: PlusCircle, updated: Pencil, restored: RotateCcw } as const;

export default function TestManagementHomePage() {
  const projects = useLiveQuery(() => db.projects.toArray(), []) ?? EMPTY_PROJECTS;
  const suites = useLiveQuery(() => db.suites.toArray(), []) ?? [];
  const testCases = useLiveQuery(() => db.testCases.toArray(), []) ?? EMPTY_TEST_CASES;
  const results = useLiveQuery(() => db.executionResults.toArray(), []) ?? EMPTY_RESULTS;
  const history = useLiveQuery(() => db.history.orderBy("changedAt").reverse().limit(8).toArray(), []) ?? [];

  const projectById = React.useMemo(() => new Map(projects.map((p) => [p.id, p])), [projects]);
  const caseById = React.useMemo(() => new Map(testCases.map((tc) => [tc.id, tc])), [testCases]);
  const caseCountBySuite = React.useMemo(() => {
    const map = new Map<string, number>();
    for (const tc of testCases) map.set(tc.suiteId, (map.get(tc.suiteId) ?? 0) + 1);
    return map;
  }, [testCases]);

  const stats = computeStats(results);
  const todayKey = new Date().toDateString();
  const executedToday = results.filter((r) => r.executedAt && new Date(r.executedAt).toDateString() === todayKey).length;

  const favoriteSuites = suites.filter((s) => s.isFavorite).slice(0, 6);

  const recentlyExecuted = results
    .filter((r) => r.executedAt)
    .sort((a, b) => (b.executedAt ?? 0) - (a.executedAt ?? 0))
    .slice(0, 6);

  const trend = React.useMemo(() => {
    const days: { label: string; value: number }[] = [];
    for (let i = 13; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toDateString();
      const count = results.filter((r) => r.executedAt && new Date(r.executedAt).toDateString() === key).length;
      days.push({ label: d.toLocaleDateString(undefined, { day: "numeric", month: "short" }), value: count });
    }
    return days;
  }, [results]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Test Management</h1>
          <p className="mt-1 text-sm text-muted-foreground">Plan, execute, and report on test coverage across every project.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <NewProjectDialog />
          <NewRunDialog projects={projects} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <StatTile label="Projects" value={projects.length} icon={FolderTree} />
        <StatTile label="Suites" value={suites.length} icon={ListChecks} />
        <StatTile label="Test Cases" value={testCases.length} icon={ClipboardList} />
        <StatTile label="Executed Today" value={executedToday} icon={CalendarCheck2} />
        <StatTile label="Pass Rate" value={`${stats.passRate}%`} icon={Percent} />
        <StatTile label="Passed" value={stats.pass} icon={CheckCircle2} className="text-success" />
        <StatTile label="Failed" value={stats.fail} icon={XCircle} className="text-destructive" />
        <StatTile label="Blocked" value={stats.blocked} icon={ShieldAlert} className="text-warning" />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Panel title="Execution progress (all-time)">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs text-muted-foreground">
              {stats.executionRate}% executed · {stats.pass}/{stats.total} passed
            </p>
            <p className="text-lg font-semibold tabular-nums">{stats.executionRate}%</p>
          </div>
          <StackedProgress stats={stats} className="mt-3 h-2.5" />
        </Panel>

        <Panel title="Quick actions">
          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              className="h-auto justify-start gap-2 py-2.5"
              nativeButton={false}
              render={
                <Link href="/testcases/projects">
                  <FolderTree className="size-4" />
                  Browse Projects
                </Link>
              }
            />
            <Button
              variant="outline"
              className="h-auto justify-start gap-2 py-2.5"
              nativeButton={false}
              render={
                <Link href="/testcases/runs">
                  <PlayCircle className="size-4" />
                  Test Runs
                </Link>
              }
            />
            <Button
              variant="outline"
              className="h-auto justify-start gap-2 py-2.5"
              nativeButton={false}
              render={
                <Link href="/testcases/reports">
                  <FileBarChart2 className="size-4" />
                  Reports
                </Link>
              }
            />
            <Button
              variant="outline"
              className="h-auto justify-start gap-2 py-2.5"
              nativeButton={false}
              render={
                <Link href="/testcases/runs">
                  <CalendarCheck2 className="size-4" />
                  Calendar
                </Link>
              }
            />
          </div>
        </Panel>
      </div>

      <div className="mt-5">
        <Panel title="Execution trend (last 14 days)">
          <ExecutionTrendChart data={trend} />
        </Panel>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Panel title="Recently executed">
          <div className="flex flex-col divide-y divide-border">
            {recentlyExecuted.length === 0 && <p className="text-sm text-muted-foreground">No executions recorded yet.</p>}
            {recentlyExecuted.map((r) => {
              const tc = caseById.get(r.testCaseId);
              return (
                <Link key={r.id} href={`/testcases/runs/${r.executionId}`} className="flex items-center justify-between gap-2 py-2 text-sm hover:text-primary">
                  <span className="min-w-0 flex-1 truncate">
                    <span className="font-mono text-xs text-muted-foreground">{tc?.displayId}</span> {tc?.title ?? "Unknown case"}
                  </span>
                  <ResultBadge value={r.status} className="shrink-0 px-1.5 py-0 text-[10px]" />
                </Link>
              );
            })}
          </div>
        </Panel>

        <Panel title="Favorite suites">
          <div className="flex flex-col divide-y divide-border">
            {favoriteSuites.length === 0 && <p className="text-sm text-muted-foreground">Star a suite to pin it here.</p>}
            {favoriteSuites.map((s) => (
              <Link
                key={s.id}
                href={`/testcases/projects/${s.projectId}`}
                className="flex items-center justify-between gap-2 py-2 text-sm hover:text-primary"
              >
                <span className="flex min-w-0 items-center gap-1.5">
                  <Star className="size-3.5 shrink-0 fill-yellow-400 text-yellow-500" />
                  <span className="truncate">{s.name}</span>
                </span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {projectById.get(s.projectId)?.name} · {caseCountBySuite.get(s.id) ?? 0}
                </span>
              </Link>
            ))}
          </div>
        </Panel>

        <Panel title="Recent activity">
          <div className="flex flex-col divide-y divide-border">
            {history.length === 0 && <p className="text-sm text-muted-foreground">No activity yet.</p>}
            {history.map((entry) => {
              const Icon = HISTORY_ICON[entry.action];
              return (
                <div key={entry.id} className="flex items-start gap-2 py-2 text-xs">
                  <Icon className="mt-0.5 size-3.5 shrink-0 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate">
                      <span className="font-medium">{entry.changedBy}</span> — {entry.summary}
                    </p>
                    <p className="text-muted-foreground">{new Date(entry.changedAt).toLocaleString()}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </Panel>
      </div>

      {projects.length === 0 && (
        <Card className="mt-6">
          <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
            <HistoryIcon className="size-8 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">No projects yet — create one to start planning and executing tests.</p>
            <NewProjectDialog />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
