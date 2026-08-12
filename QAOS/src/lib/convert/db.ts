import Dexie, { type EntityTable } from "dexie";
import type { ConversionHistoryEntry } from "./types";

class ConvertDB extends Dexie {
  history!: EntityTable<ConversionHistoryEntry, "id">;

  constructor() {
    super("qaos-convert-db");
    this.version(1).stores({
      history: "id, createdAt, expiresAt, status, inputFormat, outputFormat",
    });
  }
}

export const db = new ConvertDB();
