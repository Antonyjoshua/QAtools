"use client";

import * as React from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { GitBranch } from "lucide-react";
import { db } from "@/lib/testcases/db";
import { buildTraceability, type TraceabilityData } from "@/lib/testcases/services/traceability";
import { TraceabilityDashboard } from "@/components/testcases/traceability/traceability-dashboard";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Requirement, TestCase } from "@/lib/testcases/types";

export default function TraceabilityPage() {
  const projects = useLiveQuery(() => db.projects.toArray(), []) ?? [];
  const [projectId, setProjectId] = React.useState("");
  const [data, setData] = React.useState<TraceabilityData | null>(null);

  // Re-derive whenever the underlying tables change, not just when projectId changes.
  const requirements = useLiveQuery(
    () => (projectId ? db.requirements.where("projectId").equals(projectId).toArray() : Promise.resolve<Requirement[]>([])),
    [projectId]
  );
  const testCases = useLiveQuery(
    () => (projectId ? db.testCases.where("projectId").equals(projectId).toArray() : Promise.resolve<TestCase[]>([])),
    [projectId]
  );
  const executionResults = useLiveQuery(() => db.executionResults.toArray(), []);

  React.useEffect(() => {
    if (!projectId) return;
    let cancelled = false;
    buildTraceability(projectId).then((result) => {
      if (!cancelled) setData(result);
    });
    return () => {
      cancelled = true;
    };
    // Re-run whenever any of the source tables for this project change.
  }, [projectId, requirements, testCases, executionResults]);

  const loading = Boolean(projectId) && data?.projectId !== projectId;

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Traceability &amp; Coverage</h1>
        <p className="mt-1 text-sm text-muted-foreground">See which requirements, test cases, and bugs aren&rsquo;t connected to each other yet.</p>
      </div>

      <div className="mb-6 flex flex-col gap-1.5 sm:max-w-xs">
        <Label>Project</Label>
        <Select value={projectId} onValueChange={(v) => setProjectId(String(v))}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choose a project">{(v: string) => projects.find((p) => p.id === v)?.name ?? "Choose a project"}</SelectValue>
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

      {!projectId || !data ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
            <GitBranch className="size-8 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">{loading ? "Loading…" : "Choose a project to see its coverage."}</p>
          </CardContent>
        </Card>
      ) : (
        <TraceabilityDashboard data={data} />
      )}
    </div>
  );
}
