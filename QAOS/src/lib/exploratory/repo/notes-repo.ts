import { db } from "../db";
import { uid } from "../id";
import type { SessionNote, NoteType } from "../types";

export async function listNotes(sessionId: string): Promise<SessionNote[]> {
  return db.notes.where("sessionId").equals(sessionId).sortBy("timestamp");
}

export async function addNote(sessionId: string, type: NoteType, text: string): Promise<SessionNote> {
  const note: SessionNote = { id: uid(), sessionId, type, text, timestamp: Date.now(), linkedBugId: null, linkedBugDisplayId: null };
  await db.notes.add(note);
  return note;
}

export async function updateNote(id: string, patch: Partial<SessionNote>): Promise<void> {
  await db.notes.update(id, patch);
}

export async function deleteNote(id: string): Promise<void> {
  await db.notes.delete(id);
}
