import Dexie, { type EntityTable } from "dexie";
import type {
  BugReport,
  Project,
  Module,
  Feature,
  BuildVersion,
  TestEnvironment,
  Label,
  Attachment,
  Comment,
  BugVersion,
  ReusableStep,
  ExportRecord,
} from "./types";

class BugForgeDB extends Dexie {
  bugs!: EntityTable<BugReport, "id">;
  projects!: EntityTable<Project, "id">;
  modules!: EntityTable<Module, "id">;
  features!: EntityTable<Feature, "id">;
  buildVersions!: EntityTable<BuildVersion, "id">;
  environments!: EntityTable<TestEnvironment, "id">;
  labels!: EntityTable<Label, "id">;
  attachments!: EntityTable<Attachment, "id">;
  comments!: EntityTable<Comment, "id">;
  versions!: EntityTable<BugVersion, "id">;
  reusableSteps!: EntityTable<ReusableStep, "id">;
  exportHistory!: EntityTable<ExportRecord, "id">;

  constructor() {
    super("bugforge-db");
    this.version(1).stores({
      bugs: "id, displayId, projectId, moduleId, status, severity, priority, createdAt, updatedAt, *labels",
      projects: "id, createdAt",
      modules: "id, projectId",
      features: "id, moduleId",
      buildVersions: "id, projectId, createdAt",
      environments: "id, projectId",
      labels: "id, name",
      attachments: "id, bugId, kind, createdAt",
      comments: "id, bugId, parentId, createdAt",
      versions: "id, bugId, createdAt",
      reusableSteps: "id, createdAt",
      exportHistory: "id, bugId, createdAt",
    });
    // v2: index linkedTestCaseId so the Test Management module can query "bugs linked to this test case".
    this.version(2).stores({
      bugs: "id, displayId, projectId, moduleId, status, severity, priority, createdAt, updatedAt, *labels, linkedTestCaseId",
    });
  }
}

export const db = new BugForgeDB();
