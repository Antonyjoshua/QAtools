import Dexie, { type EntityTable } from "dexie";
import type { Charter, Session, SessionNote } from "./types";

class ExploratoryDB extends Dexie {
  charters!: EntityTable<Charter, "id">;
  sessions!: EntityTable<Session, "id">;
  notes!: EntityTable<SessionNote, "id">;

  constructor() {
    super("qaos-exploratory-db");
    this.version(1).stores({
      charters: "id, createdAt",
      sessions: "id, charterId, status, createdAt",
      notes: "id, sessionId, type, timestamp",
    });
  }
}

export const db = new ExploratoryDB();
