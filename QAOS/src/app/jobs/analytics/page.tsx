"use client";

import * as React from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { Briefcase, Building2, Globe2, MapPin, Sparkles, Wrench } from "lucide-react";
import { db } from "@/lib/jobs/db";
import type { Job } from "@/lib/jobs/types";

function StatTile({ label, value, icon: Icon }: { label: string; value: number | string; icon: React.ElementType }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-4">
      <div className="flex size-10 items-center justify-center rounded-lg bg-accent text-accent-foreground">
        <Icon className="size-5" />
      </div>
      <div>
        <p className="text-2xl font-semibold tracking-tight tabular-nums">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

function BarList({ rows }: { rows: { label: string; value: number }[] }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <div className="flex flex-col gap-2">
      {rows.map((r) => (
        <div key={r.label} className="flex items-center gap-3 text-sm">
          <span className="w-32 shrink-0 truncate text-muted-foreground">{r.label}</span>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
            <div className="h-full rounded-full bg-primary" style={{ width: `${(r.value / max) * 100}%` }} />
          </div>
          <span className="w-8 shrink-0 text-right tabular-nums">{r.value}</span>
        </div>
      ))}
      {rows.length === 0 && <p className="text-sm text-muted-foreground">Not enough data yet.</p>}
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

const AUTOMATION_TOOLS = new Set(["Playwright", "Selenium", "Cypress", "Appium"]);
const EMPTY_JOBS: Job[] = [];

export default function JobsAnalyticsPage() {
  const jobs = useLiveQuery(() => db.jobs.toArray(), []) ?? EMPTY_JOBS;
  const active = React.useMemo(() => jobs.filter((j) => j.status === "ACTIVE"), [jobs]);

  const stats = React.useMemo(() => {
    // eslint-disable-next-line react-hooks/purity -- reading "now" to bucket "posted in the last day/week" is a benign use of wall-clock time
    const dayAgo = Date.now() - 24 * 60 * 60 * 1000;
    // eslint-disable-next-line react-hooks/purity -- see above
    const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return {
      total: active.length,
      india: active.filter((j) => j.isIndiaLocation).length,
      remoteIndia: active.filter((j) => j.remoteStatus === "REMOTE_INDIA").length,
      international: active.filter((j) => !j.isIndiaLocation).length,
      newToday: active.filter((j) => new Date(j.postedDate).getTime() >= dayAgo).length,
      newThisWeek: active.filter((j) => new Date(j.postedDate).getTime() >= weekAgo).length,
    };
  }, [active]);

  function topN(counter: Map<string, number>, n: number) {
    return Array.from(counter.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, n)
      .map(([label, value]) => ({ label, value }));
  }

  const topCompanies = React.useMemo(() => {
    const m = new Map<string, number>();
    for (const j of active) m.set(j.companyName, (m.get(j.companyName) ?? 0) + 1);
    return topN(m, 8);
  }, [active]);

  const topSkills = React.useMemo(() => {
    const m = new Map<string, number>();
    for (const j of active) for (const t of j.technologies) m.set(t, (m.get(t) ?? 0) + 1);
    return topN(m, 8);
  }, [active]);

  const topAutomationTools = React.useMemo(() => {
    const m = new Map<string, number>();
    for (const j of active) for (const t of j.technologies) if (AUTOMATION_TOOLS.has(t)) m.set(t, (m.get(t) ?? 0) + 1);
    return topN(m, 8);
  }, [active]);

  const topCities = React.useMemo(() => {
    const m = new Map<string, number>();
    for (const j of active) if (j.city) m.set(j.city, (m.get(j.city) ?? 0) + 1);
    return topN(m, 8);
  }, [active]);

  const salaryByLevel = React.useMemo(() => {
    const buckets = new Map<string, number[]>();
    for (const j of active) {
      if (j.country !== "India" || !j.salaryMin || j.currency !== "INR") continue;
      const mid = j.salaryMax ? (j.salaryMin + j.salaryMax) / 2 : j.salaryMin;
      buckets.set(j.level, [...(buckets.get(j.level) ?? []), mid]);
    }
    const rows = Array.from(buckets.entries()).map(([label, values]) => ({
      label,
      value: Math.round(values.reduce((a, b) => a + b, 0) / values.length / 100000),
    }));
    return rows.sort((a, b) => b.value - a.value);
  }, [active]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Jobs Analytics</h1>
        <p className="mt-1 text-sm text-muted-foreground">A snapshot of QA hiring activity across every job currently in the index.</p>
      </div>

      <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        <StatTile label="Active jobs" value={stats.total} icon={Briefcase} />
        <StatTile label="India jobs" value={stats.india} icon={MapPin} />
        <StatTile label="Remote — India" value={stats.remoteIndia} icon={Globe2} />
        <StatTile label="International" value={stats.international} icon={Globe2} />
        <StatTile label="New today" value={stats.newToday} icon={Sparkles} />
        <StatTile label="New this week" value={stats.newThisWeek} icon={Sparkles} />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Panel title="Top companies hiring">
          <BarList rows={topCompanies} />
        </Panel>
        <Panel title="Top skills / technologies">
          <BarList rows={topSkills} />
        </Panel>
        <Panel title="Most requested automation tools">
          <BarList rows={topAutomationTools} />
        </Panel>
        <Panel title="Most active cities (India)">
          <BarList rows={topCities} />
        </Panel>
      </div>

      <div className="mt-5">
        <Panel title="Salary trends — India, average by level (₹ lakh/year)">
          {salaryByLevel.length >= 2 ? (
            <BarList rows={salaryByLevel} />
          ) : (
            <p className="text-sm text-muted-foreground">Not enough salary data across levels yet to show a trend.</p>
          )}
        </Panel>
      </div>

      <div className="mt-5 flex items-center gap-2 rounded-xl border border-dashed border-border p-3 text-xs text-muted-foreground">
        <Building2 className="size-3.5 shrink-0" />
        <Wrench className="size-3.5 shrink-0" />
        These numbers reflect the jobs currently loaded in this preview (sample data) — they&rsquo;ll track real ingestion once a live source is
        connected.
      </div>
    </div>
  );
}
