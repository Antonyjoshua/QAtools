import { db } from "./db";
import { uid } from "./id";
import type { Note, NoteVersion } from "./types";
import { EMPTY_DOC, extractText, wordCount } from "./content-utils";
import type { JSONContent } from "@tiptap/core";

export interface CreateNoteInput {
  title?: string;
  contentJSON?: JSONContent;
  categoryId?: string | null;
  tags?: string[];
  collectionIds?: string[];
  icon?: string;
  templateId?: string | null;
}

export async function createNote(input: CreateNoteInput = {}): Promise<Note> {
  const now = Date.now();
  const contentJSON = input.contentJSON ?? EMPTY_DOC;
  const contentText = extractText(contentJSON);
  const note: Note = {
    id: uid(),
    title: input.title ?? "Untitled Note",
    contentJSON,
    contentText,
    categoryId: input.categoryId ?? null,
    tags: input.tags ?? [],
    collectionIds: input.collectionIds ?? [],
    isFavorite: false,
    isPinned: false,
    isArchived: false,
    icon: input.icon ?? "FileText",
    coverColor: null,
    templateId: input.templateId ?? null,
    readingProgress: 0,
    wordCount: wordCount(contentText),
    createdAt: now,
    updatedAt: now,
    lastViewedAt: null,
  };
  await db.notes.add(note);
  return note;
}

export async function updateNote(id: string, patch: Partial<Note>): Promise<void> {
  const updated: Partial<Note> = { ...patch, updatedAt: Date.now() };
  if (patch.contentJSON) {
    const text = extractText(patch.contentJSON);
    updated.contentText = text;
    updated.wordCount = wordCount(text);
  }
  await db.notes.update(id, updated);
}

export async function touchLastViewed(id: string): Promise<void> {
  await db.notes.update(id, { lastViewedAt: Date.now() });
}

export async function setReadingProgress(id: string, progress: number): Promise<void> {
  await db.notes.update(id, { readingProgress: Math.max(0, Math.min(100, Math.round(progress))) });
}

export async function deleteNoteForever(id: string): Promise<void> {
  await db.transaction("rw", [db.notes, db.attachments, db.versions, db.bookmarks], async () => {
    await db.notes.delete(id);
    await db.attachments.where("noteId").equals(id).delete();
    await db.versions.where("noteId").equals(id).delete();
    await db.bookmarks.where("noteId").equals(id).delete();
  });
}

export async function toggleFavorite(id: string): Promise<void> {
  const note = await db.notes.get(id);
  if (!note) return;
  await db.notes.update(id, { isFavorite: !note.isFavorite });
}

export async function togglePinned(id: string): Promise<void> {
  const note = await db.notes.get(id);
  if (!note) return;
  await db.notes.update(id, { isPinned: !note.isPinned });
}

export async function archiveNote(id: string): Promise<void> {
  await db.notes.update(id, { isArchived: true, isPinned: false });
}

export async function restoreNote(id: string): Promise<void> {
  await db.notes.update(id, { isArchived: false });
}

export async function duplicateNote(id: string): Promise<Note | null> {
  const original = await db.notes.get(id);
  if (!original) return null;
  return createNote({
    title: `${original.title} (Copy)`,
    contentJSON: original.contentJSON,
    categoryId: original.categoryId,
    tags: [...original.tags],
    collectionIds: [...original.collectionIds],
    icon: original.icon,
  });
}

export async function saveVersionSnapshot(id: string, label = "Auto-save"): Promise<void> {
  const note = await db.notes.get(id);
  if (!note) return;
  const version: NoteVersion = {
    id: uid(),
    noteId: id,
    title: note.title,
    contentJSON: note.contentJSON,
    wordCount: note.wordCount,
    createdAt: Date.now(),
    label,
  };
  await db.versions.add(version);
  const all = await db.versions.where("noteId").equals(id).sortBy("createdAt");
  if (all.length > 30) {
    const toDelete = all.slice(0, all.length - 30);
    await db.versions.bulkDelete(toDelete.map((v) => v.id));
  }
}

export async function restoreVersion(noteId: string, versionId: string): Promise<void> {
  const version = await db.versions.get(versionId);
  if (!version) return;
  await updateNote(noteId, { title: version.title, contentJSON: version.contentJSON });
}
