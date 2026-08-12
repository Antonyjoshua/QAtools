"use client";

import * as React from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { FileBarChart2 } from "lucide-react";
import { db } from "@/lib/testcases/db";
import type { Execution } from "@/lib/testcases/types";
import { REPORT_TYPES, getReportDefinition, type ReportData } from "@/lib/testcases/services/reports";
import { ReportView } from "@/components/testcases/reports/report-view";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export default function ReportsPage() {
  const projects = useLiveQuery(() => db.projects.toArray(), []) ?? [];
  const [projectId, setProjectId] = React.useState("");
  const [reportId, setReportId] = React.useState<string>(REPORT_TYPES[0].id);
  const [executionId, setExecutionId] = React.useState("");
  const [sprint, setSprint] = React.useState("");
  const [releaseVersion, setReleaseVersion] = React.useState("");
  const [date, setDate] = React.useState(() => new Date().toISOString().slice(0, 10));
  const [report, setReport] = React.useState<ReportData | null>(null);
  const [busy, setBusy] = React.useState(false);

  const executions =
    useLiveQuery(
      () => (projectId ? db.executions.where("projectId").equals(projectId).toArray() : Promise.resolve<Execution[]>([])),
      [projectId]
    ) ?? [];

  const definition = getReportDefinition(reportId);

  async function handleGenerate() {
    if (!projectId || !definition) return;
    setBusy(true);
    try {
      const data = await definition.build({ projectId, executionId: executionId || undefined, sprint: sprint || undefined, releaseVersion: releaseVersion || undefined, date });
      setReport(data);
    } finally {
      setBusy(false);
    }
  }

  const canGenerate =
    Boolean(projectId) &&
    Boolean(definition) &&
    (definition?.requires !== "execution" || Boolean(executionId)) &&
    (definition?.requires !== "sprint" || Boolean(sprint)) &&
    (definition?.requires !== "release" || Boolean(releaseVersion));

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="no-print mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Reports</h1>
        <p className="mt-1 text-sm text-muted-foreground">Generate execution, regression, sprint, and release reports, then export or print.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        <div className="no-print flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>Project</Label>
            <Select value={projectId} onValueChange={(v) => setProjectId(String(v))}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a project">
                  {(v: string) => projects.find((p) => p.id === v)?.name ?? "Choose a project"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {projects.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Report type</Label>
            <div className="flex flex-col gap-1.5">
              {REPORT_TYPES.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setReportId(r.id)}
                  className={cn(
                    "rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                    reportId === r.id ? "border-primary/40 bg-primary/5" : "border-border hover:bg-accent/50"
                  )}
                >
                  <span className="font-medium">{r.label}</span>
                  <p className="text-xs text-muted-foreground">{r.description}</p>
                </button>
              ))}
            </div>
          </div>

          {definition?.requires === "execution" && (
            <div className="flex flex-col gap-1.5">
              <Label>Test run</Label>
              <Select value={executionId} onValueChange={(v) => setExecutionId(String(v))}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a run">
                    {(v: string) => executions.find((e) => e.id === v)?.name ?? "Choose a run"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {executions.map((e) => (
                    <SelectItem key={e.id} value={e.id}>
                      {e.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          {definition?.requires === "sprint" && (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="report-sprint">Sprint</Label>
              <Input id="report-sprint" value={sprint} onChange={(e) => setSprint(e.target.value)} placeholder="e.g. Sprint 14" />
            </div>
          )}
          {definition?.requires === "release" && (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="report-release">Release version</Label>
              <Input id="report-release" value={releaseVersion} onChange={(e) => setReleaseVersion(e.target.value)} placeholder="e.g. v2.4.0" />
            </div>
          )}
          {definition?.requires === "date" && (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="report-date">Date</Label>
              <Input id="report-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
          )}

          <Button onClick={handleGenerate} disabled={!canGenerate || busy}>
            Generate report
          </Button>
        </div>

        <div>
          {!report ? (
            <Card className="no-print">
              <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
                <FileBarChart2 className="size-8 text-muted-foreground/40" />
                <p className="text-sm text-muted-foreground">Choose a project and report type, then generate to see results here.</p>
              </CardContent>
            </Card>
          ) : (
            <ReportView report={report} />
          )}
        </div>
      </div>
    </div>
  );
}
