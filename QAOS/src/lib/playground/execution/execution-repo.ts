import { db } from "./db";
import { uid } from "@/lib/playground/id";
import type { ExecutionResultStatus } from "./types";
import type { TestCase } from "@/lib/playground/testcase-lab/types";

export async function startExecution(requirementId: string, testCases: TestCase[]): Promise<string> {
  const executionId = uid();
  await db.executions.add({
    id: executionId,
    requirementId,
    status: "InProgress",
    startedAt: new Date().toISOString(),
    completedAt: null,
  });
  await db.executionResults.bulkAdd(
    testCases.map((tc) => ({
      id: uid(),
      executionId,
      testCaseId: tc.id,
      status: "Pending" as ExecutionResultStatus,
      notes: "",
      linkedBugReportId: null,
      executedAt: null,
    }))
  );
  return executionId;
}

export async function setResultStatus(
  resultId: string,
  status: ExecutionResultStatus,
  notes: string
): Promise<void> {
  await db.executionResults.update(resultId, { status, notes, executedAt: new Date().toISOString() });
}

export async function linkBugReport(resultId: string, bugReportId: string): Promise<void> {
  await db.executionResults.update(resultId, { linkedBugReportId: bugReportId });
}
