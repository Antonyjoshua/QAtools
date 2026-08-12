import { db } from "../db";
import { uid, formatDisplayId } from "../id";
import type { TestCase } from "../types";

export type NewTestCaseInput = Omit<
  TestCase,
  "id" | "displayId" | "createdAt" | "updatedAt"
>;

export async function createTestCase(input: NewTestCaseInput, changedBy: string): Promise<TestCase> {
  const count = await db.testCases.count();
  const now = Date.now();
  const testCase: TestCase = {
    ...input,
    id: uid(),
    displayId: formatDisplayId("TC", count + 1),
    createdAt: now,
    updatedAt: now,
  };
  await db.transaction("rw", [db.testCases, db.history], async () => {
    await db.testCases.add(testCase);
    await db.history.add({
      id: uid(),
      entityType: "testcase",
      entityId: testCase.id,
      action: "created",
      changedBy,
      changedAt: now,
      summary: "Test case created",
      snapshot: testCase,
    });
  });
  return testCase;
}

export async function updateTestCase(id: string, patch: Partial<TestCase>, changedBy: string, summary = "Updated"): Promise<void> {
  const current = await db.testCases.get(id);
  if (!current) return;
  const updated: TestCase = { ...current, ...patch, updatedAt: Date.now() };
  await db.transaction("rw", [db.testCases, db.history], async () => {
    await db.testCases.put(updated);
    await db.history.add({
      id: uid(),
      entityType: "testcase",
      entityId: id,
      action: "updated",
      changedBy,
      changedAt: Date.now(),
      summary,
      snapshot: updated,
    });
  });
}

export async function duplicateTestCase(id: string, changedBy: string): Promise<TestCase | null> {
  const original = await db.testCases.get(id);
  if (!original) return null;
  const originalSteps = await db.steps.where("testCaseId").equals(id).toArray();

  const count = await db.testCases.count();
  const now = Date.now();
  const copy: TestCase = {
    ...original,
    id: uid(),
    displayId: formatDisplayId("TC", count + 1),
    title: `${original.title} (Copy)`,
    createdAt: now,
    updatedAt: now,
  };

  await db.transaction("rw", [db.testCases, db.steps, db.history], async () => {
    await db.testCases.add(copy);
    for (const step of originalSteps.slice().sort((a, b) => a.order - b.order)) {
      await db.steps.add({ ...step, id: uid(), testCaseId: copy.id, actualResult: "", status: "Not Executed", screenshotAttachmentId: null });
    }
    await db.history.add({
      id: uid(),
      entityType: "testcase",
      entityId: copy.id,
      action: "created",
      changedBy,
      changedAt: now,
      summary: `Duplicated from ${original.displayId}`,
      snapshot: copy,
    });
  });

  return copy;
}

export async function deleteTestCase(id: string): Promise<void> {
  await db.transaction("rw", [db.testCases, db.steps, db.comments, db.history, db.executionResults], async () => {
    await db.testCases.delete(id);
    await db.steps.where("testCaseId").equals(id).delete();
    await db.comments.where("testCaseId").equals(id).delete();
    await db.history.where("entityId").equals(id).delete();
    await db.executionResults.where("testCaseId").equals(id).delete();
  });
}

export async function bulkUpdateTestCases(ids: string[], patch: Partial<TestCase>, changedBy: string): Promise<void> {
  await db.transaction("rw", [db.testCases, db.history], async () => {
    for (const id of ids) {
      const current = await db.testCases.get(id);
      if (!current) continue;
      const updated: TestCase = { ...current, ...patch, updatedAt: Date.now() };
      await db.testCases.put(updated);
      await db.history.add({
        id: uid(),
        entityType: "testcase",
        entityId: id,
        action: "updated",
        changedBy,
        changedAt: Date.now(),
        summary: "Bulk update",
        snapshot: updated,
      });
    }
  });
}

export async function bulkDeleteTestCases(ids: string[]): Promise<void> {
  await db.transaction("rw", [db.testCases, db.steps, db.comments, db.history, db.executionResults], async () => {
    await db.testCases.bulkDelete(ids);
    await db.steps.where("testCaseId").anyOf(ids).delete();
    await db.comments.where("testCaseId").anyOf(ids).delete();
    await db.history.where("entityId").anyOf(ids).delete();
    await db.executionResults.where("testCaseId").anyOf(ids).delete();
  });
}
