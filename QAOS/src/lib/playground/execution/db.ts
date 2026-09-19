import Dexie, { type EntityTable } from "dexie";
import type { ExecutionResult, ExecutionRun } from "./types";

class TestRunDB extends Dexie {
  executions!: EntityTable<ExecutionRun, "id">;
  executionResults!: EntityTable<ExecutionResult, "id">;

  constructor() {
    super("testrun-db");
    this.version(1).stores({
      executions: "id, requirementId, status, startedAt, completedAt",
      executionResults: "id, executionId, testCaseId, status, linkedBugReportId, executedAt",
    });
  }
}

export const db = new TestRunDB();
