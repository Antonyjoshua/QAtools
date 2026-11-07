import { db } from "../db";
import { uid } from "../id";
import type { TestPlan } from "../types";

export async function listTestPlans(projectId: string): Promise<TestPlan[]> {
  return db.testPlans.where("projectId").equals(projectId).sortBy("createdAt");
}

export async function getTestPlan(id: string): Promise<TestPlan | undefined> {
  return db.testPlans.get(id);
}

export interface NewTestPlanInput {
  projectId: string;
  name: string;
  objective?: string;
  targetRelease?: string;
  environment?: string;
  owner?: string;
  startDate?: number | null;
  endDate?: number | null;
  status?: TestPlan["status"];
}

export async function createTestPlan(input: NewTestPlanInput): Promise<TestPlan> {
  const now = Date.now();
  const plan: TestPlan = {
    id: uid(),
    projectId: input.projectId,
    name: input.name,
    objective: input.objective ?? "",
    targetRelease: input.targetRelease ?? "",
    environment: input.environment ?? "",
    owner: input.owner ?? "",
    startDate: input.startDate ?? null,
    endDate: input.endDate ?? null,
    status: input.status ?? "Draft",
    testCaseIds: [],
    createdAt: now,
    updatedAt: now,
  };
  await db.testPlans.add(plan);
  return plan;
}

export async function updateTestPlan(id: string, patch: Partial<TestPlan>): Promise<void> {
  await db.testPlans.update(id, { ...patch, updatedAt: Date.now() });
}

export async function setPlanTestCases(id: string, testCaseIds: string[]): Promise<void> {
  await db.testPlans.update(id, { testCaseIds, updatedAt: Date.now() });
}

/** Deletes a Test Plan along with its own Executions and their ExecutionResults.
 * The test cases it referenced are untouched — a plan only ever selects cases, never owns them. */
export async function deleteTestPlan(id: string): Promise<void> {
  await db.transaction("rw", [db.testPlans, db.executions, db.executionResults, db.attachments], async () => {
    const executions = await db.executions.where("testPlanId").equals(id).toArray();
    const executionIds = executions.map((e) => e.id);
    await db.testPlans.delete(id);
    await db.executions.where("testPlanId").equals(id).delete();
    if (executionIds.length) {
      const results = await db.executionResults.where("executionId").anyOf(executionIds).toArray();
      await db.executionResults.where("executionId").anyOf(executionIds).delete();
      const resultIds = results.map((r) => r.id);
      if (resultIds.length) await db.attachments.where("parentId").anyOf(resultIds).delete();
    }
  });
}

export async function countPlanExecutions(id: string): Promise<number> {
  return db.executions.where("testPlanId").equals(id).count();
}

/** Finds or creates a standing "Ad-hoc Executions" plan for a project, used by flows
 * (like the inline test-case checklist) that create a run without going through the
 * full "New Run" dialog and its Test Plan selection step. */
export async function getOrCreateAdHocTestPlan(projectId: string): Promise<TestPlan> {
  const existing = await db.testPlans.where("projectId").equals(projectId).toArray();
  const adHoc = existing.find((p) => p.name === "Ad-hoc Executions");
  if (adHoc) return adHoc;
  return createTestPlan({
    projectId,
    name: "Ad-hoc Executions",
    objective: "Runs created outside a formal test plan (e.g. quick pass/fail checklists).",
    status: "Active",
  });
}
