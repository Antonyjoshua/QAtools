import Dexie, { type EntityTable } from "dexie";
import type { TestCase } from "./types";

class CaseBankDB extends Dexie {
  testCases!: EntityTable<TestCase, "id">;

  constructor() {
    super("casebank-db");
    this.version(1).stores({
      testCases: "id, displayId, requirementId, type, priority, createdAt, updatedAt",
    });
  }
}

export const db = new CaseBankDB();
