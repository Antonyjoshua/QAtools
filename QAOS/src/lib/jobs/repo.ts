import { db } from "./db";
import { uid } from "./id";
import { createAdapter } from "./adapters";
import { EXPERIENCE_BANDS, emptyFilterState, type Job, type JobAlert, type JobFilterState, type RemoteStatus, type SavedJobStatus, type SortOption, type UserJobProfile } from "./types";

export function sortJobs(jobs: Job[], sort: SortOption): Job[] {
  const copy = [...jobs];
  switch (sort) {
    case "newest":
      return copy.sort((a, b) => new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
    case "relevance":
      return copy.sort((a, b) => b.qualityScore - a.qualityScore);
    case "salary":
      return copy.sort((a, b) => (b.salaryMax ?? b.salaryMin ?? 0) - (a.salaryMax ?? a.salaryMin ?? 0));
    case "experience":
      return copy.sort((a, b) => a.experienceMinYears - b.experienceMinYears);
    case "company":
      return copy.sort((a, b) => a.companyName.localeCompare(b.companyName));
    case "remote-first": {
      const rank = (s: RemoteStatus) => (s.startsWith("REMOTE") ? 0 : s === "HYBRID" ? 1 : 2);
      return copy.sort((a, b) => rank(a.remoteStatus) - rank(b.remoteStatus) || new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime());
    }
    default:
      return copy;
  }
}

/** Loose "boolean-like" search: every whitespace-separated term (or `+`-joined term) must appear somewhere in the job's searchable text — good enough for queries like "SDET Python" or "Automation + API" without a real query grammar. */
function matchesQuery(job: Job, query: string): boolean {
  const terms = query
    .toLowerCase()
    .split(/[\s+]+/)
    .map((t) => t.trim())
    .filter(Boolean);
  if (terms.length === 0) return true;
  const haystack =
    `${job.title} ${job.companyName} ${job.city ?? ""} ${job.state ?? ""} ${job.country} ${job.remoteEvidence ?? ""} ${job.remoteStatus} ${job.technologies.join(" ")} ${job.qaCategories.join(" ")} ${job.description}`.toLowerCase();
  return terms.every((t) => haystack.includes(t));
}

export function applyFilters(allJobs: Job[], filters: JobFilterState): Job[] {
  let result = allJobs.filter((j) => j.status === "ACTIVE");

  if (filters.location === "india") {
    result = result.filter((j) => j.isIndiaLocation);
  } else if (filters.location === "international") {
    result = result.filter((j) => !j.isIndiaLocation && (j.remoteStatus === "REMOTE_INDIA" || j.remoteStatus === "REMOTE_WORLDWIDE"));
  }

  if (filters.query.trim()) result = result.filter((j) => matchesQuery(j, filters.query));
  if (filters.remoteStatus.length) result = result.filter((j) => filters.remoteStatus.includes(j.remoteStatus));
  if (filters.qaCategories.length) result = result.filter((j) => j.qaCategories.some((c) => filters.qaCategories.includes(c)));
  if (filters.technologies.length) result = result.filter((j) => j.technologies.some((t) => filters.technologies.includes(t)));
  if (filters.levels.length) result = result.filter((j) => filters.levels.includes(j.level));
  if (filters.employmentTypes.length) result = result.filter((j) => filters.employmentTypes.includes(j.employmentType));
  if (filters.cities.length) result = result.filter((j) => j.city !== null && filters.cities.includes(j.city));
  if (filters.companies.length) result = result.filter((j) => filters.companies.includes(j.companyName));
  if (filters.sources.length) result = result.filter((j) => filters.sources.includes(j.sourceName));
  if (filters.experienceBands.length) {
    result = result.filter((j) =>
      filters.experienceBands.some((bandId) => {
        const band = EXPERIENCE_BANDS.find((b) => b.id === bandId);
        if (!band) return false;
        const jobMax = j.experienceMaxYears ?? Infinity;
        const bandMax = band.max ?? Infinity;
        return j.experienceMinYears <= bandMax && jobMax >= band.min;
      })
    );
  }
  if (filters.minSalary) result = result.filter((j) => (j.salaryMax ?? j.salaryMin ?? 0) >= (filters.minSalary ?? 0));
  if (filters.postedWithinHours) {
    const cutoff = Date.now() - filters.postedWithinHours * 60 * 60 * 1000;
    result = result.filter((j) => new Date(j.postedDate).getTime() >= cutoff);
  }

  return sortJobs(result, filters.sort);
}

// --- Saved jobs ---------------------------------------------------------------

export async function saveJob(jobId: string): Promise<void> {
  const existing = await db.savedJobs.where("jobId").equals(jobId).first();
  if (existing) return;
  const now = new Date().toISOString();
  await db.savedJobs.add({ id: uid(), jobId, status: "Saved", savedAt: now, statusUpdatedAt: now });
}

export async function unsaveJob(jobId: string): Promise<void> {
  const existing = await db.savedJobs.where("jobId").equals(jobId).first();
  if (existing) await db.savedJobs.delete(existing.id);
}

export async function updateSavedJobStatus(id: string, status: SavedJobStatus): Promise<void> {
  await db.savedJobs.update(id, { status, statusUpdatedAt: new Date().toISOString() });
}

// --- Alerts --------------------------------------------------------------------

export async function createAlert(input: Pick<JobAlert, "name" | "query" | "filters" | "frequency" | "channels">): Promise<void> {
  await db.alerts.add({ ...input, id: uid(), createdAt: new Date().toISOString(), active: true });
}

export async function deleteAlert(id: string): Promise<void> {
  await db.alerts.delete(id);
}

export async function setAlertActive(id: string, active: boolean): Promise<void> {
  await db.alerts.update(id, { active });
}

export function matchAlertJobs(alert: JobAlert, allJobs: Job[]): Job[] {
  const state = emptyFilterState();
  state.query = alert.query;
  if (alert.filters.location) state.location = alert.filters.location;
  if (alert.filters.remoteStatus) state.remoteStatus = alert.filters.remoteStatus;
  if (alert.filters.qaCategories) state.qaCategories = alert.filters.qaCategories;
  if (alert.filters.technologies) state.technologies = alert.filters.technologies;
  let matches = applyFilters(allJobs, state);
  if (alert.filters.minExperience) matches = matches.filter((j) => j.experienceMinYears >= (alert.filters.minExperience ?? 0));
  return matches;
}

// --- Profile ---------------------------------------------------------------------

const DEFAULT_PROFILE: UserJobProfile = {
  id: "local-user",
  skills: [],
  preferredLocations: [],
  remotePreference: "any",
  preferredRoles: [],
  preferredTechnologies: [],
};

export async function getProfile(): Promise<UserJobProfile> {
  const p = await db.profile.get("local-user");
  return p ?? DEFAULT_PROFILE;
}

export async function updateProfile(patch: Partial<UserJobProfile>): Promise<void> {
  const existing = await db.profile.get("local-user");
  if (existing) await db.profile.update("local-user", patch);
  else await db.profile.add({ ...DEFAULT_PROFILE, ...patch });
}

// --- Admin: sync + review queue ---------------------------------------------------

/** Genuinely attempts a sync via the real adapter — since no source is connected yet, this always fails, and the failure is logged honestly rather than faked as a success. */
export async function triggerSync(sourceId: string): Promise<void> {
  const source = await db.sources.get(sourceId);
  if (!source) return;
  const adapter = createAdapter(source.type, source.id, source.name);
  const runId = uid();
  const startedAt = new Date().toISOString();
  await db.syncRuns.add({ id: runId, sourceId, startedAt, finishedAt: null, status: "running", jobsFetched: 0, jobsNew: 0, jobsUpdated: 0, jobsDuplicate: 0, jobsFailed: 0 });

  try {
    await adapter.fetchJobs();
    await db.syncRuns.update(runId, { finishedAt: new Date().toISOString(), status: "success" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    await db.syncRuns.update(runId, { finishedAt: new Date().toISOString(), status: "error", errorMessage: message });
    await db.sources.update(sourceId, {
      lastSyncAt: new Date().toISOString(),
      lastSyncStatus: "error",
      errors: [{ timestamp: new Date().toISOString(), message }, ...source.errors].slice(0, 10),
    });
  }
}

export async function reviewQueueAction(itemId: string, action: "approved" | "rejected", note?: string): Promise<void> {
  await db.reviewQueue.update(itemId, { status: action, reviewedAt: new Date().toISOString(), note });
}

export async function setSourceEnabled(sourceId: string, enabled: boolean): Promise<void> {
  await db.sources.update(sourceId, { enabled });
}
