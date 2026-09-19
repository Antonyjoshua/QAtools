import Dexie, { type EntityTable } from "dexie";
import type { BugReportSubmission } from "./types";

class BugHuntDB extends Dexie {
  bugReports!: EntityTable<BugReportSubmission, "id">;

  constructor() {
    super("bughunt-db");
    this.version(1).stores({
      bugReports:
        "id, displayId, missionId, matchedBugId, status, linkedTestCaseId, linkedExecutionId, linkedExecutionResultId, submittedAt",
    });
  }
}

export const db = new BugHuntDB();
