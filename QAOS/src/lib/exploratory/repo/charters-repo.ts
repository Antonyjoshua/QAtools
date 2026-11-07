import { db } from "../db";
import { uid } from "../id";
import type { Charter } from "../types";

export async function listCharters(): Promise<Charter[]> {
  return db.charters.orderBy("createdAt").reverse().toArray();
}

export async function getCharter(id: string): Promise<Charter | undefined> {
  return db.charters.get(id);
}

export interface NewCharterInput {
  title: string;
  mission: string;
  areas: string[];
  targetDurationMinutes: number;
}

export async function createCharter(input: NewCharterInput): Promise<Charter> {
  const charter: Charter = { ...input, id: uid(), createdAt: Date.now() };
  await db.charters.add(charter);
  return charter;
}

export async function updateCharter(id: string, patch: Partial<Charter>): Promise<void> {
  await db.charters.update(id, patch);
}

export async function deleteCharter(id: string): Promise<void> {
  await db.transaction("rw", [db.charters, db.sessions, db.notes], async () => {
    const sessions = await db.sessions.where("charterId").equals(id).toArray();
    const sessionIds = sessions.map((s) => s.id);
    await db.charters.delete(id);
    await db.sessions.where("charterId").equals(id).delete();
    if (sessionIds.length) await db.notes.where("sessionId").anyOf(sessionIds).delete();
  });
}
