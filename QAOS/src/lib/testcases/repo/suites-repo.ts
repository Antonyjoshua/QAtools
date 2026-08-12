import { db } from "../db";
import { uid } from "../id";
import type { Suite } from "../types";

export async function createSuite(projectId: string, folderId: string, name: string, description = ""): Promise<Suite> {
  const siblings = await db.suites.where("folderId").equals(folderId).toArray();
  const suite: Suite = {
    id: uid(),
    projectId,
    folderId,
    name,
    description,
    order: siblings.length,
    isFavorite: false,
    createdAt: Date.now(),
  };
  await db.suites.add(suite);
  return suite;
}

export async function updateSuite(id: string, patch: Partial<Suite>): Promise<void> {
  await db.suites.update(id, patch);
}

export async function toggleSuiteFavorite(id: string): Promise<void> {
  const suite = await db.suites.get(id);
  if (!suite) return;
  await db.suites.update(id, { isFavorite: !suite.isFavorite });
}

export async function reorderSuites(updates: { id: string; order: number; folderId: string }[]): Promise<void> {
  await db.transaction("rw", db.suites, async () => {
    for (const u of updates) {
      await db.suites.update(u.id, { order: u.order, folderId: u.folderId });
    }
  });
}

export async function deleteSuite(id: string): Promise<void> {
  await db.transaction("rw", [db.suites, db.testCases, db.steps], async () => {
    await db.suites.delete(id);
    const cases = await db.testCases.where("suiteId").equals(id).toArray();
    const caseIds = cases.map((c) => c.id);
    await db.testCases.where("suiteId").equals(id).delete();
    if (caseIds.length) await db.steps.where("testCaseId").anyOf(caseIds).delete();
  });
}
