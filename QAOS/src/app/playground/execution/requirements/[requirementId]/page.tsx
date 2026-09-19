"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { getRequirementById } from "@/lib/playground/testcase-lab/requirements-seed";
import { useTestCasesForRequirement } from "@/lib/playground/testcase-lab/hooks/use-test-cases";
import { useExecutionsForRequirement, useExecutionResults } from "@/lib/playground/execution/hooks/use-execution";
import { startExecution } from "@/lib/playground/execution/execution-repo";
import { moduleForRequirement } from "@/lib/playground/execution/module-map";
import { TestCaseRunRow } from "@/components/playground/execution/testcase-run-row";

export default function ExecutionRunnerPage({
  params,
}: {
  params: Promise<{ requirementId: string }>;
}) {
  const { requirementId } = use(params);
  const requirement = getRequirementById(requirementId);
  const testCases = useTestCasesForRequirement(requirementId);
  const executions = useExecutionsForRequirement(requirementId);
  const activeExecution = executions[executions.length - 1] ?? null;
  const results = useExecutionResults(activeExecution?.id ?? null);
  const shopModule = moduleForRequirement(requirementId);

  if (!requirement) return notFound();

  async function handleStart() {
    await startExecution(requirementId, testCases);
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold">{requirement.title}</h1>
          <p className="text-sm text-muted-foreground">{testCases.length} test case(s) available</p>
        </div>
        <Button onClick={handleStart}>{results.length > 0 ? "Start New Run" : "Start Execution Run"}</Button>
      </div>

      {results.length === 0 && (
        <p className="text-sm text-muted-foreground">Start a run to begin executing test cases.</p>
      )}

      <div className="space-y-2">
        {results.map((result) => {
          const tc = testCases.find((t) => t.id === result.testCaseId);
          if (!tc) return null;
          return (
            <TestCaseRunRow
              key={result.id}
              result={result}
              testCase={tc}
              module={shopModule}
              requirementId={requirementId}
            />
          );
        })}
      </div>
    </div>
  );
}
