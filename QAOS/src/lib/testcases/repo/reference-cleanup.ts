import { db } from "../db";

/** Removes the given test case ids from every Test Plan's and Execution's `testCaseIds`
 * array. Call this (inside the same transaction) whenever test cases are deleted, so
 * plan/run selections never silently go stale. */
export async function pruneTestCaseReferences(caseIds: string[]): Promise<void> {
  if (caseIds.length === 0) return;
  const caseIdSet = new Set(caseIds);

  const plans = await db.testPlans.toArray();
  for (const plan of plans) {
    if (plan.testCaseIds.some((id) => caseIdSet.has(id))) {
      await db.testPlans.update(plan.id, { testCaseIds: plan.testCaseIds.filter((id) => !caseIdSet.has(id)) });
    }
  }

  const executions = await db.executions.toArray();
  for (const execution of executions) {
    if (execution.testCaseIds.some((id) => caseIdSet.has(id))) {
      await db.executions.update(execution.id, { testCaseIds: execution.testCaseIds.filter((id) => !caseIdSet.has(id)) });
    }
  }
}

/** Deletes everything a set of test cases own — steps, comments, history, execution
 * results, their attachments, and any dangling Test Plan/Execution references — but not
 * the test case rows themselves (callers delete those, since the exact query differs:
 * a single `.delete(id)`, a `.bulkDelete(ids)`, or an implicit `.where(...).delete()`).
 * Shared by every place that cascades through test cases (test case delete, suite delete,
 * folder delete, project delete) so the cascade list can't drift between them again. */
export async function deleteTestCaseArtifacts(testCaseIds: string[]): Promise<void> {
  if (testCaseIds.length === 0) return;

  const [steps, comments, executionResults] = await Promise.all([
    db.steps.where("testCaseId").anyOf(testCaseIds).toArray(),
    db.comments.where("testCaseId").anyOf(testCaseIds).toArray(),
    db.executionResults.where("testCaseId").anyOf(testCaseIds).toArray(),
  ]);
  const attachmentParentIds = [
    ...testCaseIds,
    ...steps.map((s) => s.id),
    ...comments.map((c) => c.id),
    ...executionResults.map((r) => r.id),
  ];

  await db.steps.where("testCaseId").anyOf(testCaseIds).delete();
  await db.comments.where("testCaseId").anyOf(testCaseIds).delete();
  await db.history.where("entityId").anyOf(testCaseIds).delete();
  await db.executionResults.where("testCaseId").anyOf(testCaseIds).delete();
  if (attachmentParentIds.length) await db.attachments.where("parentId").anyOf(attachmentParentIds).delete();
  await pruneTestCaseReferences(testCaseIds);
}
