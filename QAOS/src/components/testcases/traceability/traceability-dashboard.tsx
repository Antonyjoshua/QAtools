"use client";

import Link from "next/link";
import { GitBranch, ClipboardCheck, Bug, Percent, CheckCircle2 } from "lucide-react";
import type { TraceabilityData, TraceabilityGapRow } from "@/lib/testcases/services/traceability";

const PREVIEW_LIMIT = 8;

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

function Panel({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h2 className="text-sm font-medium">{title}</h2>
      <p className="mb-3 text-xs text-muted-foreground">{description}</p>
      {children}
    </div>
  );
}

function GapList({ rows, emptyLabel }: { rows: TraceabilityGapRow[]; emptyLabel: string }) {
  if (rows.length === 0) {
    return (
      <div className="flex items-center gap-2 py-4 text-sm text-success">
        <CheckCircle2 className="size-4" />
        {emptyLabel}
      </div>
    );
  }
  const visible = rows.slice(0, PREVIEW_LIMIT);
  return (
    <div className="flex flex-col divide-y divide-border">
      {visible.map((row) => (
        <Link key={row.id} href={row.href} className="flex items-center justify-between gap-2 py-2 text-sm hover:text-primary">
          <span className="min-w-0 flex-1 truncate">
            <span className="font-mono text-xs text-muted-foreground">{row.label}</span> {row.sublabel}
          </span>
        </Link>
      ))}
      {rows.length > PREVIEW_LIMIT && <p className="pt-2 text-xs text-muted-foreground">+{rows.length - PREVIEW_LIMIT} more</p>}
    </div>
  );
}

export function TraceabilityDashboard({ data }: { data: TraceabilityData }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatTile label="Requirement coverage" value={`${data.coverage.requirementCoveragePct}%`} icon={GitBranch} />
        <StatTile label="Execution coverage" value={`${data.coverage.executionCoveragePct}%`} icon={Percent} />
        <StatTile label="Bug linkage" value={`${data.coverage.bugLinkagePct}%`} icon={Bug} />
        <StatTile label="Requirements" value={data.totals.requirements} icon={GitBranch} />
        <StatTile label="Test cases" value={data.totals.testCases} icon={ClipboardCheck} />
        <StatTile label="Test cases with a bug" value={data.totals.testCasesLinkedToBug} icon={Bug} />
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Panel title="Requirements with no test cases" description="Nothing verifies these requirements yet.">
          <GapList rows={data.requirementsWithoutTestCases} emptyLabel="Every requirement has at least one test case." />
        </Panel>

        <Panel title="Test cases with no requirement" description="Not traced back to any requirement.">
          <GapList rows={data.testCasesWithoutRequirement} emptyLabel="Every test case is linked to a requirement." />
        </Panel>

        <Panel title="Test cases never executed" description="No execution result has been recorded for these.">
          <GapList rows={data.testCasesNeverExecuted} emptyLabel="Every test case has been executed at least once." />
        </Panel>

        <Panel title="Test cases with no linked bug" description="No bug report references these — could mean they always pass, or nobody's filing bugs from them.">
          <GapList rows={data.testCasesWithoutLinkedBug} emptyLabel="Every test case has at least one linked bug." />
        </Panel>
      </div>

      <Panel
        title="Unlinked bug reports"
        description={`${data.totals.unlinkedBugReportsAllProjects} bug report(s) across all projects aren't linked to any test case (Bug Reports isn't scoped per Test Management project, so this list isn't limited to the project selected above).`}
      >
        <GapList rows={data.unlinkedBugReports} emptyLabel="Every bug report is linked to a test case." />
      </Panel>
    </div>
  );
}
