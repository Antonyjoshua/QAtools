"use client";

import * as React from "react";
import Link from "next/link";
import { useLiveQuery } from "dexie-react-hooks";
import { FileCode2, GitBranch, ClipboardList, Link2, X } from "lucide-react";
import { db as testcasesDb } from "@/lib/testcases/db";
import { updateBug } from "@/lib/bugs/bugs-repo";
import { StatusBadge as TestCaseStatusBadge } from "@/components/testcases/shared/badges";
import { Button } from "@/components/ui/button";

export function LinkedTestCaseCard({
  bugId,
  testCaseId,
  displayId,
  linkedExecutionId,
  onRequestLink,
}: {
  bugId: string;
  testCaseId: string | null;
  displayId: string | null;
  linkedExecutionId?: string | null;
  onRequestLink: () => void;
}) {
  const testCase = useLiveQuery(() => (testCaseId ? testcasesDb.testCases.get(testCaseId) : undefined), [testCaseId]);
  const requirement = useLiveQuery(
    () => (testCase?.requirementId ? testcasesDb.requirements.get(testCase.requirementId) : undefined),
    [testCase?.requirementId]
  );
  const execution = useLiveQuery(() => (linkedExecutionId ? testcasesDb.executions.get(linkedExecutionId) : undefined), [linkedExecutionId]);
  const testPlan = useLiveQuery(() => (execution?.testPlanId ? testcasesDb.testPlans.get(execution.testPlanId) : undefined), [execution]);

  async function handleUnlink() {
    await updateBug(bugId, { linkedTestCaseId: null, linkedTestCaseDisplayId: null, linkedExecutionId: null, linkedExecutionResultId: null });
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4 text-xs text-muted-foreground">
      <div className="mb-2 flex items-center justify-between">
        <p className="flex items-center gap-1.5 font-medium text-foreground">
          <FileCode2 className="size-3.5" />
          Linked test case
        </p>
        {testCaseId && (
          <button type="button" onClick={handleUnlink} className="text-muted-foreground hover:text-destructive" aria-label="Unlink test case">
            <X className="size-3.5" />
          </button>
        )}
      </div>

      {!testCaseId ? (
        <Button variant="outline" size="sm" className="gap-1.5" onClick={onRequestLink}>
          <Link2 className="size-3.5" />
          Link a test case
        </Button>
      ) : testCase ? (
        <div className="flex flex-col gap-2">
          <Link href={`/testcases/case/${testCase.id}`} className="flex flex-col items-start gap-1 hover:text-foreground">
            <span className="font-mono text-foreground">{testCase.displayId}</span>
            <span className="line-clamp-2 text-foreground">{testCase.title}</span>
            <TestCaseStatusBadge value={testCase.status} className="mt-1" />
          </Link>
          {requirement && (
            <Link href="/testcases/requirements" className="flex items-center gap-1.5 hover:text-foreground">
              <GitBranch className="size-3 shrink-0" />
              <span className="font-mono">{requirement.requirementId}</span>
              <span className="truncate">{requirement.title}</span>
            </Link>
          )}
          {testPlan && (
            <Link href={`/testcases/plans/${testPlan.id}`} className="flex items-center gap-1.5 hover:text-foreground">
              <ClipboardList className="size-3 shrink-0" />
              <span className="truncate">{testPlan.name}</span>
            </Link>
          )}
          <button type="button" onClick={onRequestLink} className="self-start text-xs text-muted-foreground hover:text-foreground">
            Change link
          </button>
        </div>
      ) : (
        <p>{displayId ?? "Unknown test case"} (no longer exists)</p>
      )}
    </div>
  );
}
