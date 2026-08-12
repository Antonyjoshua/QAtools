"use client";

import * as React from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { Bug, CircleDot, CircleCheck, AlertTriangle } from "lucide-react";
import { db } from "@/lib/bugs/db";
import { SEVERITIES, PRIORITIES } from "@/lib/bugs/types";
import { HorizontalBarChart } from "@/components/bugs/charts/bar-chart";
import { TrendChart } from "@/components/bugs/charts/trend-chart";

function StatTile({ label, value, icon: Icon }: { label: string; value: number; icon: React.ElementType }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
      <div className="flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
        <Icon className="size-5" />
      </div>
      <div>
        <p className="text-2xl font-semibold tabular-nums tracking-tight">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h2 className="mb-4 text-sm font-medium">{title}</h2>
      {children}
    </div>
  );
}

export default function AnalyticsPage() {
  const bugs = useLiveQuery(() => db.bugs.toArray(), []);
  const projects = useLiveQuery(() => db.projects.toArray(), []);
  const modules = useLiveQuery(() => db.modules.toArray(), []);

  const stats = React.useMemo(() => {
    const list = bugs ?? [];
    return {
      total: list.length,
      open: list.filter((b) => !["Closed", "Rejected", "Duplicate"].includes(b.status)).length,
      closed: list.filter((b) => b.status === "Closed").length,
      critical: list.filter((b) => b.severity === "Critical").length,
    };
  }, [bugs]);

  const severityData = React.useMemo(
    () => SEVERITIES.map((s) => ({ label: s, value: (bugs ?? []).filter((b) => b.severity === s).length })).filter((d) => d.value > 0 || true),
    [bugs]
  );
  const priorityData = React.useMemo(
    () => PRIORITIES.map((p) => ({ label: p, value: (bugs ?? []).filter((b) => b.priority === p).length })),
    [bugs]
  );

  const moduleData = React.useMemo(() => {
    const counts = new Map<string, number>();
    (bugs ?? []).forEach((b) => b.moduleId && counts.set(b.moduleId, (counts.get(b.moduleId) ?? 0) + 1));
    return Array.from(counts.entries())
      .map(([id, value]) => ({ label: (modules ?? []).find((m) => m.id === id)?.name ?? "Unknown", value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [bugs, modules]);

  const projectData = React.useMemo(() => {
    const counts = new Map<string, number>();
    (bugs ?? []).forEach((b) => b.projectId && counts.set(b.projectId, (counts.get(b.projectId) ?? 0) + 1));
    return Array.from(counts.entries())
      .map(([id, value]) => ({ label: (projects ?? []).find((p) => p.id === id)?.name ?? "Unknown", value }))
      .sort((a, b) => b.value - a.value);
  }, [bugs, projects]);

  const monthlyTrend = React.useMemo(() => {
    const now = new Date();
    const months: { label: string; value: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const label = d.toLocaleDateString(undefined, { month: "short" });
      const count = (bugs ?? []).filter((b) => {
        const bd = new Date(b.createdAt);
        return bd.getFullYear() === d.getFullYear() && bd.getMonth() === d.getMonth();
      }).length;
      months.push({ label, value: count });
    }
    return months;
  }, [bugs]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
      <p className="mt-1 text-muted-foreground">Bug trends and distribution across your projects.</p>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile label="Total Bugs" value={stats.total} icon={Bug} />
        <StatTile label="Open Bugs" value={stats.open} icon={CircleDot} />
        <StatTile label="Closed Bugs" value={stats.closed} icon={CircleCheck} />
        <StatTile label="Critical" value={stats.critical} icon={AlertTriangle} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Panel title="Severity Distribution">
          <HorizontalBarChart data={severityData} />
        </Panel>
        <Panel title="Priority Distribution">
          <HorizontalBarChart data={priorityData} />
        </Panel>
        <Panel title="Module-wise Bugs">
          <HorizontalBarChart data={moduleData} emptyLabel="No bugs assigned to modules yet" />
        </Panel>
        <Panel title="Project-wise Bugs">
          <HorizontalBarChart data={projectData} emptyLabel="No bugs assigned to projects yet" />
        </Panel>
      </div>

      <div className="mt-5">
        <Panel title="Monthly Trend (last 6 months)">
          <TrendChart data={monthlyTrend} />
        </Panel>
      </div>
    </div>
  );
}
