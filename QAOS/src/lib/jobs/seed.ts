import { db } from "./db";
import { uid } from "./id";
import { classifyEmploymentType, classifyJobLevel, classifyQACategories, classifyRemoteStatus, deriveReviewReasons, detectTechnologies } from "./classification";
import { computeQualityScore } from "./quality-score";
import { SEED_COMPANIES, SEED_JOBS, generateJobDescription, generateRequirements, generateResponsibilities } from "./seed-data";
import type { Company, Job, JobReviewItem, JobSourceConfig, JobSyncRun, SourceType, UserJobProfile } from "./types";

function hoursAgoToISO(hours: number): string {
  return new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();
}

function sourceKey(name: string, type: SourceType): string {
  return `${type}::${name}`;
}

// Both the module layout (DbProvider) and the globally-mounted Quick Job
// Search quick-tool call ensureSeeded() on mount, so a page load can trigger
// two near-simultaneous invocations. Memoizing the in-flight promise means
// every caller awaits the same single seeding run instead of each racing to
// bulkAdd the same fixed-id company/source records (which throws BulkError
// on the second write).
let seedingPromise: Promise<void> | undefined;

export function ensureSeeded(): Promise<void> {
  if (!seedingPromise) seedingPromise = runSeed();
  return seedingPromise;
}

async function runSeed(): Promise<void> {
  const jobCount = await db.jobs.count();
  if (jobCount > 0) return;

  const companies: Company[] = SEED_COMPANIES.map((c) => ({
    id: c.id,
    name: c.name,
    website: c.website,
    logoInitials: c.logoInitials,
    logoColor: c.logoColor,
    description: c.description,
    headquarters: c.headquarters,
  }));
  const companyById = new Map(companies.map((c) => [c.id, c]));
  await db.companies.bulkAdd(companies);

  // Build one JobSourceConfig per distinct (type, name) pair referenced by the seed jobs.
  const sourceByKey = new Map<string, JobSourceConfig>();
  for (const j of SEED_JOBS) {
    const key = sourceKey(j.sourceName, j.sourceType);
    if (!sourceByKey.has(key)) {
      sourceByKey.set(key, {
        id: uid(),
        name: j.sourceName,
        type: j.sourceType,
        enabled: true,
        refreshIntervalMinutes: j.sourceType === "CompanyCareers" ? 240 : 15,
        priority: j.sourceType === "CompanyCareers" ? "medium" : "high",
        lastSyncAt: null,
        lastSyncStatus: "never",
        jobsImported: 0,
        failedJobs: 0,
        duplicatesFound: 0,
        errors: [],
        connected: false,
      });
    }
  }

  const jobs: Job[] = [];
  const reviewItems: JobReviewItem[] = [];

  for (const seedJob of SEED_JOBS) {
    const company = companyById.get(seedJob.companyId);
    if (!company) continue;
    const source = sourceByKey.get(sourceKey(seedJob.sourceName, seedJob.sourceType))!;

    const titleAndCompanyText = `${seedJob.title} ${seedJob.qaCategoryHints.join(" ")}`;
    const description = generateJobDescription({
      title: seedJob.title,
      companyName: company.name,
      companyDescription: company.description ?? "",
      city: seedJob.city,
      categories: seedJob.qaCategoryHints,
      technologies: seedJob.technologies,
    });

    const detectedCategories = classifyQACategories(seedJob.title, description);
    const qaCategoriesWereFallback = detectedCategories.length === 1 && detectedCategories[0] === "Manual Testing" && !seedJob.qaCategoryHints.includes("Manual Testing");
    const finalCategories = qaCategoriesWereFallback ? seedJob.qaCategoryHints : detectedCategories;

    const detectedTech = Array.from(new Set([...detectTechnologies(`${seedJob.title} ${description}`), ...seedJob.technologies]));
    const level = classifyJobLevel(seedJob.title, seedJob.minYears);
    const remote = classifyRemoteStatus(seedJob.remoteEvidence, seedJob.country);
    const employmentType = classifyEmploymentType(`${seedJob.title} ${titleAndCompanyText}`);
    const isIndiaLocation = seedJob.country === "India";

    const postedDate = hoursAgoToISO(seedJob.postedHoursAgo);
    const sourceCheckedAt = hoursAgoToISO(Math.max(0, seedJob.postedHoursAgo - 0.25));
    const status = seedJob.postedHoursAgo > 250 ? "EXPIRED" : "ACTIVE";

    const { score, label } = computeQualityScore({
      sourceType: seedJob.sourceType,
      postedDate,
      city: seedJob.city,
      country: seedJob.country,
      salaryMin: seedJob.salaryMin,
      description,
      requirements: generateRequirements(finalCategories, detectedTech),
      remoteStatus: remote.status,
    });

    const reviewReasons = deriveReviewReasons({
      qaCategoriesWereFallback,
      remoteNeedsReview: remote.needsReview,
      isIndiaLocation,
      remoteStatus: remote.status,
    });

    const job: Job = {
      id: uid(),
      title: seedJob.title,
      companyId: company.id,
      companyName: company.name,
      companyLogoInitials: company.logoInitials,
      companyLogoColor: company.logoColor,
      jobUrl: `${company.website}/careers/${seedJob.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
      sourceId: source.id,
      sourceName: source.name,
      sourceType: source.type,
      city: seedJob.city,
      state: seedJob.state,
      country: seedJob.country,
      isIndiaLocation,
      remoteStatus: remote.status,
      remoteEvidence: seedJob.remoteEvidence,
      employmentType,
      level,
      levelManuallyCorrected: false,
      experienceMinYears: seedJob.minYears,
      experienceMaxYears: seedJob.maxYears,
      salaryMin: seedJob.salaryMin,
      salaryMax: seedJob.salaryMax,
      currency: seedJob.currency,
      salaryPeriod: "year",
      qaCategories: finalCategories,
      technologies: detectedTech,
      skills: detectedTech.slice(0, 5),
      description,
      requirements: generateRequirements(finalCategories, detectedTech),
      responsibilities: generateResponsibilities(finalCategories),
      benefits: seedJob.benefits ?? [],
      postedDate,
      lastUpdated: postedDate,
      applicationDeadline: seedJob.applicationDeadlineDaysFromNow ? new Date(Date.now() + seedJob.applicationDeadlineDaysFromNow * 86400000).toISOString() : undefined,
      sourceCheckedAt,
      status,
      qualityScore: score,
      qualityLabel: label,
      needsReview: reviewReasons.length > 0,
      reviewReasons,
    };
    jobs.push(job);

    source.jobsImported += 1;
    if (job.needsReview) {
      reviewItems.push({
        id: uid(),
        jobId: job.id,
        reasons: reviewReasons,
        status: "pending",
      });
    }
  }

  const sources = Array.from(sourceByKey.values()).map((s) => ({
    ...s,
    lastSyncAt: hoursAgoToISO(1),
    lastSyncStatus: "success" as const,
  }));

  await db.sources.bulkAdd(sources);
  await db.jobs.bulkAdd(jobs);
  if (reviewItems.length > 0) await db.reviewQueue.bulkAdd(reviewItems);

  const syncRuns: JobSyncRun[] = sources.map((s) => ({
    id: uid(),
    sourceId: s.id,
    startedAt: hoursAgoToISO(1.1),
    finishedAt: hoursAgoToISO(1),
    status: "success",
    jobsFetched: s.jobsImported,
    jobsNew: s.jobsImported,
    jobsUpdated: 0,
    jobsDuplicate: 0,
    jobsFailed: 0,
  }));
  await db.syncRuns.bulkAdd(syncRuns);

  const defaultProfile: UserJobProfile = {
    id: "local-user",
    skills: [],
    preferredLocations: [],
    remotePreference: "any",
    preferredRoles: [],
    preferredTechnologies: [],
  };
  await db.profile.add(defaultProfile);
}
