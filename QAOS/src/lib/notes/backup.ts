import { db } from "./db";
import { downloadBlob } from "./export";

interface BackupBundle {
  version: 1;
  exportedAt: number;
  notes: unknown[];
  categories: unknown[];
  collections: unknown[];
  versions: unknown[];
  bookmarks: unknown[];
  attachments: { id: string; noteId: string; filename: string; mimeType: string; size: number; createdAt: number; dataBase64: string }[];
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(",")[1] ?? "");
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

function base64ToBlob(base64: string, mimeType: string): Blob {
  const byteChars = atob(base64);
  const byteNumbers = new Array(byteChars.length);
  for (let i = 0; i < byteChars.length; i++) byteNumbers[i] = byteChars.charCodeAt(i);
  return new Blob([new Uint8Array(byteNumbers)], { type: mimeType });
}

export async function exportBackup(): Promise<void> {
  const [notes, categories, collections, versions, bookmarks, attachments] = await Promise.all([
    db.notes.toArray(),
    db.categories.toArray(),
    db.collections.toArray(),
    db.versions.toArray(),
    db.bookmarks.toArray(),
    db.attachments.toArray(),
  ]);

  const bundle: BackupBundle = {
    version: 1,
    exportedAt: Date.now(),
    notes,
    categories,
    collections,
    versions,
    bookmarks,
    attachments: await Promise.all(
      attachments.map(async (a) => ({
        id: a.id,
        noteId: a.noteId,
        filename: a.filename,
        mimeType: a.mimeType,
        size: a.size,
        createdAt: a.createdAt,
        dataBase64: await blobToBase64(a.blob),
      }))
    ),
  };

  downloadBlob(JSON.stringify(bundle), `qanotes-backup-${new Date().toISOString().slice(0, 10)}.json`, "application/json");
}

export async function importBackup(file: File, mode: "merge" | "replace"): Promise<void> {
  const text = await file.text();
  const bundle = JSON.parse(text) as BackupBundle;
  if (bundle.version !== 1) throw new Error("Unsupported backup version");

  await db.transaction("rw", [db.notes, db.categories, db.collections, db.versions, db.bookmarks, db.attachments], async () => {
    if (mode === "replace") {
      await Promise.all([
        db.notes.clear(),
        db.categories.clear(),
        db.collections.clear(),
        db.versions.clear(),
        db.bookmarks.clear(),
        db.attachments.clear(),
      ]);
    }
    await db.notes.bulkPut(bundle.notes as never[]);
    await db.categories.bulkPut(bundle.categories as never[]);
    await db.collections.bulkPut(bundle.collections as never[]);
    await db.versions.bulkPut(bundle.versions as never[]);
    await db.bookmarks.bulkPut(bundle.bookmarks as never[]);
    await db.attachments.bulkPut(
      bundle.attachments.map((a) => ({
        id: a.id,
        noteId: a.noteId,
        filename: a.filename,
        mimeType: a.mimeType,
        size: a.size,
        createdAt: a.createdAt,
        blob: base64ToBlob(a.dataBase64, a.mimeType),
      })) as never[]
    );
  });
}
