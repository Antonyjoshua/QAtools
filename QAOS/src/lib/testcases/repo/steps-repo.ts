import { db } from "../db";
import { uid } from "../id";
import type { Step } from "../types";

export async function addStep(testCaseId: string, action = "", expectedResult = ""): Promise<Step> {
  const existing = await db.steps.where("testCaseId").equals(testCaseId).toArray();
  const step: Step = {
    id: uid(),
    testCaseId,
    order: existing.length,
    action,
    expectedResult,
    actualResult: "",
    screenshotAttachmentId: null,
    status: "Not Executed",
  };
  await db.steps.add(step);
  return step;
}

export async function updateStep(id: string, patch: Partial<Step>): Promise<void> {
  await db.steps.update(id, patch);
}

export async function deleteStep(id: string): Promise<void> {
  await db.steps.delete(id);
}

export async function duplicateStep(id: string): Promise<Step | null> {
  const step = await db.steps.get(id);
  if (!step) return null;
  const siblings = await db.steps.where("testCaseId").equals(step.testCaseId).toArray();
  const copy: Step = { ...step, id: uid(), order: siblings.length };
  await db.steps.add(copy);
  return copy;
}

export async function reorderSteps(orderedIds: string[]): Promise<void> {
  await db.transaction("rw", db.steps, async () => {
    for (let i = 0; i < orderedIds.length; i++) {
      await db.steps.update(orderedIds[i], { order: i });
    }
  });
}
