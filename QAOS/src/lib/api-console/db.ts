import Dexie, { type EntityTable } from "dexie";
import type { Collection, SavedRequest, Environment, RequestHistoryEntry } from "./types";

class ApiConsoleDB extends Dexie {
  collections!: EntityTable<Collection, "id">;
  requests!: EntityTable<SavedRequest, "id">;
  environments!: EntityTable<Environment, "id">;
  history!: EntityTable<RequestHistoryEntry, "id">;

  constructor() {
    super("qaos-api-console-db");
    this.version(1).stores({
      collections: "id, createdAt",
      requests: "id, collectionId, createdAt, updatedAt",
      environments: "id, isActive, createdAt",
      history: "id, requestId, timestamp",
    });
  }
}

export const db = new ApiConsoleDB();
