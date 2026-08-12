import { db } from "../db";
import { uid } from "../id";

export async function getHistoryForTestCase(testCaseId: string) {
  return db.history.where("entityId").equals(testCaseId).reverse().sortBy("changedAt");
}

export async function restoreVersion(historyEntryId: string, changedBy: string): Promise<void> {
  const entry = await db.history.get(historyEntryId);
  if (!entry) return;
  const current = await db.testCases.get(entry.entityId);
  if (!current) return;

  // Restore all fields from the snapshot except identity/audit fields, which stay as-is.
  const restored = { ...entry.snapshot, id: current.id, displayId: current.displayId, createdAt: current.createdAt, updatedAt: Date.now() };

  await db.transaction("rw", [db.testCases, db.history], async () => {
    await db.testCases.put(restored);
    await db.history.add({
      id: uid(),
      entityType: "testcase",
      entityId: entry.entityId,
      action: "restored",
      changedBy,
      changedAt: Date.now(),
      summary: `Restored from version saved ${new Date(entry.changedAt).toLocaleString()}`,
      snapshot: restored,
    });
  });
}
