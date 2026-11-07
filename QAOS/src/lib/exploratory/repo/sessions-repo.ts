import { db } from "../db";
import { uid } from "../id";
import type { Session } from "../types";

export async function listSessions(charterId: string): Promise<Session[]> {
  return db.sessions.where("charterId").equals(charterId).sortBy("createdAt");
}

export async function getSession(id: string): Promise<Session | undefined> {
  return db.sessions.get(id);
}

export async function createSession(charterId: string, tester: string): Promise<Session> {
  const session: Session = {
    id: uid(),
    charterId,
    tester,
    status: "Planned",
    accumulatedMs: 0,
    startedAt: null,
    completedAt: null,
    createdAt: Date.now(),
  };
  await db.sessions.add(session);
  return session;
}

/** Elapsed time is always derived from wall-clock timestamps (same technique as
 * src/lib/timer/hooks/use-stopwatch.ts), so it can never drift even across a page reload. */
export function getElapsedMs(session: Session): number {
  return session.accumulatedMs + (session.startedAt ? Date.now() - session.startedAt : 0);
}

export async function startSession(id: string): Promise<void> {
  const session = await db.sessions.get(id);
  if (!session || session.startedAt) return;
  await db.sessions.update(id, { status: "In Progress", startedAt: Date.now() });
}

export async function pauseSession(id: string): Promise<void> {
  const session = await db.sessions.get(id);
  if (!session || !session.startedAt) return;
  await db.sessions.update(id, {
    status: "Paused",
    accumulatedMs: session.accumulatedMs + (Date.now() - session.startedAt),
    startedAt: null,
  });
}

export async function completeSession(id: string): Promise<void> {
  const session = await db.sessions.get(id);
  if (!session) return;
  const accumulatedMs = session.startedAt ? session.accumulatedMs + (Date.now() - session.startedAt) : session.accumulatedMs;
  await db.sessions.update(id, { status: "Completed", accumulatedMs, startedAt: null, completedAt: Date.now() });
}

export async function deleteSession(id: string): Promise<void> {
  await db.transaction("rw", [db.sessions, db.notes], async () => {
    await db.sessions.delete(id);
    await db.notes.where("sessionId").equals(id).delete();
  });
}
