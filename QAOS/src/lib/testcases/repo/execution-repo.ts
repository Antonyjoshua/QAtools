import { db } from "../db";
import { uid } from "../id";
import type { Execution, ExecutionResult, ExecutionResultStatus, ExecutionStats } from "../types";

export async function createExecution(input: {
  projectId: string;
  name: string;
  description?: string;
  environment?: string;
  build?: string;
  testCaseIds: string[];
  scheduledFor?: number | null;
}): Promise<Execution> {
  const execution: Execution = {
    id: uid(),
    projectId: input.projectId,
    name: input.name,
    description: input.description ?? "",
    status: "Planned",
    environment: input.environment ?? "",
    build: input.build ?? "",
    testCaseIds: input.testCaseIds,
    createdAt: Date.now(),
    startedAt: null,
    completedAt: null,
    scheduledFor: input.scheduledFor ?? null,
  };
  await db.transaction("rw", [db.executions, db.executionResults], async () => {
    await db.executions.add(execution);
    for (const testCaseId of input.testCaseIds) {
      const result: ExecutionResult = {
        id: uid(),
        executionId: execution.id,
        testCaseId,
        status: "Not Executed",
        comment: "",
        executedBy: "",
        executedAt: null,
        durationSeconds: 0,
      };
      await db.executionResults.add(result);
    }
  });
  return execution;
}

export async function updateExecution(id: string, patch: Partial<Execution>): Promise<void> {
  await db.executions.update(id, patch);
}

export async function startExecution(id: string): Promise<void> {
  await db.executions.update(id, { status: "In Progress", startedAt: Date.now() });
}

export async function completeExecution(id: string): Promise<void> {
  await db.executions.update(id, { status: "Completed", completedAt: Date.now() });
}

export async function deleteExecution(id: string): Promise<void> {
  await db.transaction("rw", [db.executions, db.executionResults], async () => {
    await db.executions.delete(id);
    await db.executionResults.where("executionId").equals(id).delete();
  });
}

export async function recordResult(
  resultId: string,
  status: ExecutionResultStatus,
  executedBy: string,
  comment = "",
  durationSeconds = 0
): Promise<void> {
  await db.executionResults.update(resultId, {
    status,
    comment,
    executedBy,
    executedAt: Date.now(),
    durationSeconds,
  });
}

export function computeStats(results: ExecutionResult[]): ExecutionStats {
  const total = results.length;
  const pass = results.filter((r) => r.status === "Pass").length;
  const fail = results.filter((r) => r.status === "Fail").length;
  const blocked = results.filter((r) => r.status === "Blocked").length;
  const skipped = results.filter((r) => r.status === "Skipped").length;
  const retest = results.filter((r) => r.status === "Retest").length;
  const notExecuted = results.filter((r) => r.status === "Not Executed").length;
  const executed = total - notExecuted;
  return {
    total,
    pass,
    fail,
    blocked,
    skipped,
    notExecuted,
    retest,
    passRate: executed > 0 ? Math.round((pass / executed) * 100) : 0,
    executionRate: total > 0 ? Math.round((executed / total) * 100) : 0,
  };
}
