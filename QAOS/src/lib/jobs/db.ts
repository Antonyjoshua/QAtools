import Dexie, { type EntityTable } from "dexie";
import type { Company, Job, JobAlert, JobReviewItem, JobSourceConfig, JobSyncRun, SavedJob, UserJobProfile } from "./types";

class QuangradeJobsDB extends Dexie {
  jobs!: EntityTable<Job, "id">;
  companies!: EntityTable<Company, "id">;
  sources!: EntityTable<JobSourceConfig, "id">;
  syncRuns!: EntityTable<JobSyncRun, "id">;
  reviewQueue!: EntityTable<JobReviewItem, "id">;
  savedJobs!: EntityTable<SavedJob, "id">;
  alerts!: EntityTable<JobAlert, "id">;
  profile!: EntityTable<UserJobProfile, "id">;

  constructor() {
    super("quangrade-jobs-db");
    this.version(1).stores({
      jobs: "id, companyId, sourceId, isIndiaLocation, remoteStatus, status, level, postedDate, needsReview, *qaCategories, *technologies",
      companies: "id, name",
      sources: "id, type, enabled",
      syncRuns: "id, sourceId, startedAt",
      reviewQueue: "id, jobId, status",
      savedJobs: "id, jobId, status, savedAt",
      alerts: "id, active, createdAt",
      profile: "id",
    });
  }
}

export const db = new QuangradeJobsDB();
