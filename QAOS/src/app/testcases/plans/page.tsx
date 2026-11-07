"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useLiveQuery } from "dexie-react-hooks";
import { ClipboardList } from "lucide-react";
import { db } from "@/lib/testcases/db";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TestPlanList } from "@/components/testcases/plans/test-plan-list";
import { NewTestPlanDialog } from "@/components/testcases/plans/new-test-plan-dialog";
import type { TestPlan, Execution } from "@/lib/testcases/types";

const EMPTY_PLANS: TestPlan[] = [];
const EMPTY_EXECUTIONS: Execution[] = [];

export default function TestPlansPage() {
  const router = useRouter();
  const projects = useLiveQuery(() => db.projects.toArray(), []) ?? [];
  const [projectId, setProjectId] = React.useState("");

  const plans =
    useLiveQuery(() => (projectId ? db.testPlans.where("projectId").equals(projectId).toArray() : Promise.resolve<TestPlan[]>([])), [projectId]) ??
    EMPTY_PLANS;
  const executions =
    useLiveQuery(() => (projectId ? db.executions.where("projectId").equals(projectId).toArray() : Promise.resolve<Execution[]>([])), [projectId]) ??
    EMPTY_EXECUTIONS;

  const runCountByPlan = React.useMemo(() => {
    const map = new Map<string, number>();
    for (const e of executions) map.set(e.testPlanId, (map.get(e.testPlanId) ?? 0) + 1);
    return map;
  }, [executions]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Test Plans</h1>
          <p className="mt-1 text-sm text-muted-foreground">Group test cases into release/cycle plans, then run them one or more times.</p>
        </div>
        {projectId && <NewTestPlanDialog projectId={projectId} onSaved={(plan) => router.push(`/testcases/plans/${plan.id}`)} />}
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

      {!projectId ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
            <ClipboardList className="size-8 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">Choose a project to view and manage its test plans.</p>
          </CardContent>
        </Card>
      ) : (
        <TestPlanList plans={plans} runCountByPlan={runCountByPlan} />
      )}
    </div>
  );
}
