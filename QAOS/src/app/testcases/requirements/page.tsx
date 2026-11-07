"use client";

import * as React from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { ListTree } from "lucide-react";
import { db } from "@/lib/testcases/db";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RequirementList } from "@/components/testcases/requirements/requirement-list";
import { NewRequirementDialog } from "@/components/testcases/requirements/new-requirement-dialog";
import type { TestCase, Requirement } from "@/lib/testcases/types";

const EMPTY_TEST_CASES: TestCase[] = [];

export default function RequirementsPage() {
  const projects = useLiveQuery(() => db.projects.toArray(), []) ?? [];
  const [projectId, setProjectId] = React.useState("");

  const requirements =
    useLiveQuery(
      () => (projectId ? db.requirements.where("projectId").equals(projectId).sortBy("requirementId") : Promise.resolve<Requirement[]>([])),
      [projectId]
    ) ?? [];
  const testCases = useLiveQuery(() => (projectId ? db.testCases.where("projectId").equals(projectId).toArray() : Promise.resolve(EMPTY_TEST_CASES)), [projectId]) ?? EMPTY_TEST_CASES;

  const testCaseCountByRequirement = React.useMemo(() => {
    const map = new Map<string, number>();
    for (const tc of testCases) {
      if (!tc.requirementId) continue;
      map.set(tc.requirementId, (map.get(tc.requirementId) ?? 0) + 1);
    }
    return map;
  }, [testCases]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Requirements</h1>
          <p className="mt-1 text-sm text-muted-foreground">Track requirements per project and see which ones have test coverage.</p>
        </div>
        {projectId && <NewRequirementDialog projectId={projectId} />}
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
            <ListTree className="size-8 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">Choose a project to view and manage its requirements.</p>
          </CardContent>
        </Card>
      ) : (
        <RequirementList projectId={projectId} requirements={requirements} testCaseCountByRequirement={testCaseCountByRequirement} />
      )}
    </div>
  );
}
