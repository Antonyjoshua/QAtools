import Dexie, { type EntityTable } from "dexie";
import type { Note, Category, Collection, Attachment, NoteVersion, Bookmark } from "./types";

class QANotesDB extends Dexie {
  notes!: EntityTable<Note, "id">;
  categories!: EntityTable<Category, "id">;
  collections!: EntityTable<Collection, "id">;
  attachments!: EntityTable<Attachment, "id">;
  versions!: EntityTable<NoteVersion, "id">;
  bookmarks!: EntityTable<Bookmark, "id">;

  constructor() {
    super("qanotes-db");
    this.version(1).stores({
      notes: "id, title, categoryId, createdAt, updatedAt, lastViewedAt, *tags, *collectionIds",
      categories: "id, parentId, order",
      collections: "id, createdAt",
      attachments: "id, noteId, createdAt",
      versions: "id, noteId, createdAt",
      bookmarks: "id, noteId, createdAt",
    });
  }
}

export const db = new QANotesDB();
