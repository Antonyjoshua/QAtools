import Dexie, { type EntityTable } from "dexie";
import type { Resume, ResumeAttachment, ResumeHistoryEntry } from "./types";

class ResumeBuilderDB extends Dexie {
  resumes!: EntityTable<Resume, "id">;
  attachments!: EntityTable<ResumeAttachment, "id">;
  history!: EntityTable<ResumeHistoryEntry, "id">;

  constructor() {
    super("qaos-resume-db");
    this.version(1).stores({
      resumes: "id, name, mode, templateId, favorite, isDraft, createdAt, updatedAt, lastOpenedAt",
      attachments: "id, resumeId, createdAt",
      history: "id, resumeId, createdAt",
    });
  }
}

export const db = new ResumeBuilderDB();
