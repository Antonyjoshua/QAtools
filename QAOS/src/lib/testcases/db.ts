import Dexie, { type EntityTable } from "dexie";
import type {
  Project,
  Folder,
  Suite,
  TestCase,
  Step,
  Execution,
  ExecutionResult,
  Attachment,
  Comment,
  HistoryEntry,
  Requirement,
  Tag,
} from "./types";

class TestManagementDB extends Dexie {
  projects!: EntityTable<Project, "id">;
  folders!: EntityTable<Folder, "id">;
  suites!: EntityTable<Suite, "id">;
  testCases!: EntityTable<TestCase, "id">;
  steps!: EntityTable<Step, "id">;
  executions!: EntityTable<Execution, "id">;
  executionResults!: EntityTable<ExecutionResult, "id">;
  attachments!: EntityTable<Attachment, "id">;
  comments!: EntityTable<Comment, "id">;
  history!: EntityTable<HistoryEntry, "id">;
  requirements!: EntityTable<Requirement, "id">;
  tags!: EntityTable<Tag, "id">;

  constructor() {
    super("qaos-testcases-db");
    this.version(1).stores({
      projects: "id, createdAt, isFavorite",
      folders: "id, projectId, parentId, order",
      suites: "id, projectId, folderId, order, isFavorite",
      testCases: "id, displayId, projectId, suiteId, status, priority, severity, type, automationStatus, sprint, module, createdAt, updatedAt, *tags",
      steps: "id, testCaseId, order",
      executions: "id, projectId, status, createdAt, scheduledFor",
      executionResults: "id, executionId, testCaseId, status, executedAt",
      attachments: "id, parentType, parentId, createdAt",
      comments: "id, testCaseId, createdAt",
      history: "id, entityType, entityId, changedAt",
      requirements: "id, projectId, requirementId",
      tags: "id, projectId, name",
    });
  }
}

export const db = new TestManagementDB();
