"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { getRequirementById } from "@/lib/playground/testcase-lab/requirements-seed";
import { useTestCasesForRequirement } from "@/lib/playground/testcase-lab/hooks/use-test-cases";
import { scoreCoverage } from "@/lib/playground/testcase-lab/scoring";
import { TestCaseEditorForm } from "@/components/playground/testcase-lab/testcase-editor-form";
import { TestCaseList } from "@/components/playground/testcase-lab/testcase-list";
import { CoverageScorePanel } from "@/components/playground/testcase-lab/coverage-score-panel";

export default function RequirementWorkspacePage({
  params,
}: {
  params: Promise<{ requirementId: string }>;
}) {
  const { requirementId } = use(params);
  const requirement = getRequirementById(requirementId);
  const testCases = useTestCasesForRequirement(requirementId);

  if (!requirement) return notFound();

  const coverage = scoreCoverage(requirement, testCases);

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <div>
        <h1 className="text-xl font-bold">{requirement.title}</h1>
        <p className="text-sm text-muted-foreground">{requirement.statement}</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-4">
          <h2 className="mb-3 font-semibold">Write a Test Case</h2>
          <TestCaseEditorForm requirementId={requirement.id} />
        </div>
        <div className="space-y-4">
          <CoverageScorePanel result={coverage} />
          <div>
            <h2 className="mb-2 font-semibold">Your Test Cases ({testCases.length})</h2>
            <TestCaseList testCases={testCases} />
          </div>
        </div>
      </div>
    </div>
  );
}
