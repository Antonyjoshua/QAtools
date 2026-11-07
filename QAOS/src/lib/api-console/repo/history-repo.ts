import { db } from "../db";
import { uid } from "../id";
import type { RequestHistoryEntry } from "../types";

const HISTORY_LIMIT = 50;

export async function listHistory(): Promise<RequestHistoryEntry[]> {
  return db.history.orderBy("timestamp").reverse().toArray();
}

export async function pushHistory(entry: Omit<RequestHistoryEntry, "id" | "timestamp">): Promise<void> {
  await db.transaction("rw", db.history, async () => {
    await db.history.add({ ...entry, id: uid(), timestamp: Date.now() });
    const all = await db.history.orderBy("timestamp").reverse().toArray();
    const stale = all.slice(HISTORY_LIMIT);
    if (stale.length) await db.history.bulkDelete(stale.map((h) => h.id));
  });
}

export async function clearHistory(): Promise<void> {
  await db.history.clear();
}
