// -----------------------------------------------------------------------------
// Quangrade Jobs — domain types.
//
// This module ships as a frontend-complete, locally-seeded preview: every
// page, filter, and workflow described in the product spec works end to end
// against a local Dexie (IndexedDB) store — the same architecture every other
// QuanGrade module uses — seeded with realistic-but-fictional sample listings.
//
// It does NOT perform any live network aggregation yet. Wiring a JobSourceAdapter
// (see adapters.ts) up to a real source, a real ingestion schedule, and a real
// database is a separate, deliberate infrastructure decision (hosting, API
// credentials, ToS review per source) — the adapter interfaces here are shaped
// so that swap-in is mechanical when that's greenlit, not a rewrite.
// -----------------------------------------------------------------------------

export type RemoteStatus =
  | "ONSITE"
  | "HYBRID"
  | "REMOTE_INDIA"
  | "REMOTE_WORLDWIDE"
  | "REMOTE_REGION"
  | "REMOTE_UNKNOWN";

export type QACategory =
  | "Manual Testing"
  | "Automation Testing"
  | "SDET"
  | "API Testing"
  | "Performance Testing"
  | "Mobile Testing"
  | "Security Testing"
  | "Accessibility Testing"
  | "Test Management"
  | "QA Leadership"
  | "Quality Engineering"
  | "DevOps / QA"
  | "AI Testing";

export type JobLevel = "Intern" | "Fresher" | "Junior" | "Mid-Level" | "Senior" | "Lead" | "Manager" | "Architect";

export type EmploymentType = "Full-time" | "Part-time" | "Contract" | "Internship" | "Freelance";

export type JobStatus = "ACTIVE" | "EXPIRED" | "REMOVED" | "UNKNOWN";

export type SourceType = "CompanyCareers" | "Greenhouse" | "Lever" | "Ashby" | "Workable" | "Wellfound" | "RSS" | "Other";

export type SavedJobStatus = "Saved" | "Applied" | "Interview" | "Rejected" | "Archived";

export type AlertFrequency = "Instant" | "Daily" | "Weekly";

export type ReviewReason =
  | "remote_status_unclear"
  | "india_eligibility_unclear"
  | "qa_relevance_unclear"
  | "duplicate_uncertain";

export interface Company {
  id: string;
  name: string;
  website?: string;
  /** Short uppercase initials used to render a generated logo tile — no external logo fetching. */
  logoInitials: string;
  logoColor: string;
  description?: string;
  headquarters?: string;
}

export interface JobSourceConfig {
  id: string;
  name: string;
  type: SourceType;
  baseUrl?: string;
  enabled: boolean;
  refreshIntervalMinutes: number;
  priority: "high" | "medium" | "low";
  lastSyncAt: string | null;
  lastSyncStatus: "success" | "error" | "never";
  jobsImported: number;
  failedJobs: number;
  duplicatesFound: number;
  errors: { timestamp: string; message: string }[];
  rateLimitStatus?: string;
  connected: boolean;
}

export interface JobSyncRun {
  id: string;
  sourceId: string;
  startedAt: string;
  finishedAt: string | null;
  status: "running" | "success" | "error";
  jobsFetched: number;
  jobsNew: number;
  jobsUpdated: number;
  jobsDuplicate: number;
  jobsFailed: number;
  errorMessage?: string;
}

export interface JobReviewItem {
  id: string;
  jobId: string;
  reasons: ReviewReason[];
  status: "pending" | "approved" | "rejected";
  reviewedAt?: string;
  note?: string;
}

export interface Job {
  id: string;
  title: string;
  companyId: string;
  companyName: string;
  companyLogoInitials: string;
  companyLogoColor: string;
  jobUrl: string;
  sourceId: string;
  sourceName: string;
  sourceType: SourceType;

  city: string | null;
  state: string | null;
  country: string;
  isIndiaLocation: boolean;
  remoteStatus: RemoteStatus;
  remoteEvidence: string | null;

  employmentType: EmploymentType;
  level: JobLevel;
  levelManuallyCorrected: boolean;
  experienceMinYears: number;
  experienceMaxYears: number | null;

  salaryMin?: number;
  salaryMax?: number;
  currency?: string;
  salaryPeriod?: "year" | "month";

  qaCategories: QACategory[];
  technologies: string[];
  skills: string[];

  description: string;
  requirements: string[];
  responsibilities: string[];
  benefits: string[];

  postedDate: string;
  lastUpdated: string;
  applicationDeadline?: string;
  sourceCheckedAt: string;

  status: JobStatus;
  qualityScore: number;
  qualityLabel: string;
  needsReview: boolean;
  reviewReasons: ReviewReason[];
  duplicateOfId?: string;
}

export interface SavedJob {
  id: string;
  jobId: string;
  status: SavedJobStatus;
  savedAt: string;
  statusUpdatedAt: string;
  notes?: string;
}

export interface JobAlertFilters {
  location?: "india" | "international" | "all";
  remoteStatus?: RemoteStatus[];
  qaCategories?: QACategory[];
  technologies?: string[];
  minExperience?: number;
}

export interface JobAlert {
  id: string;
  name: string;
  query: string;
  filters: JobAlertFilters;
  frequency: AlertFrequency;
  channels: ("in-app" | "email")[];
  createdAt: string;
  lastNotifiedAt?: string;
  active: boolean;
}

export interface UserJobProfile {
  id: string;
  experienceYears?: number;
  skills: string[];
  preferredLocations: string[];
  remotePreference: "onsite" | "hybrid" | "remote" | "any";
  expectedSalaryMin?: number;
  expectedSalaryCurrency?: string;
  noticePeriodDays?: number;
  preferredRoles: QACategory[];
  preferredTechnologies: string[];
}

export const EXPERIENCE_BANDS = [
  { id: "0", label: "0 years", min: 0, max: 0 },
  { id: "0-1", label: "0–1 yrs", min: 0, max: 1 },
  { id: "1-3", label: "1–3 yrs", min: 1, max: 3 },
  { id: "3-5", label: "3–5 yrs", min: 3, max: 5 },
  { id: "5-8", label: "5–8 yrs", min: 5, max: 8 },
  { id: "8-12", label: "8–12 yrs", min: 8, max: 12 },
  { id: "12+", label: "12+ yrs", min: 12, max: null },
] as const;

export type ExperienceBandId = (typeof EXPERIENCE_BANDS)[number]["id"];

export const QA_CATEGORIES: QACategory[] = [
  "Manual Testing",
  "Automation Testing",
  "SDET",
  "API Testing",
  "Performance Testing",
  "Mobile Testing",
  "Security Testing",
  "Accessibility Testing",
  "Test Management",
  "QA Leadership",
  "Quality Engineering",
  "DevOps / QA",
  "AI Testing",
];

export const JOB_LEVELS: JobLevel[] = ["Intern", "Fresher", "Junior", "Mid-Level", "Senior", "Lead", "Manager", "Architect"];

export const TARGET_ROLE_TITLES = [
  "QA Engineer",
  "Quality Analyst",
  "Software Tester",
  "Manual Tester",
  "Automation Tester",
  "SDET",
  "QA Automation Engineer",
  "Test Engineer",
  "Quality Engineer",
  "Software Quality Engineer",
  "API Tester",
  "Performance Tester",
  "Mobile Tester",
  "QA Lead",
  "Test Lead",
  "QA Manager",
  "Quality Engineering Manager",
  "Automation Architect",
  "Test Architect",
];

export const INDIA_CITIES = [
  "Chennai",
  "Bangalore",
  "Hyderabad",
  "Pune",
  "Mumbai",
  "Delhi NCR",
  "Noida",
  "Gurgaon",
  "Kolkata",
  "Ahmedabad",
  "Coimbatore",
  "Kochi",
  "Trivandrum",
  "Jaipur",
  "Indore",
];

export type SortOption = "newest" | "relevance" | "salary" | "experience" | "company" | "remote-first";

export interface JobFilterState {
  query: string;
  location: "india" | "international" | "all";
  remoteStatus: RemoteStatus[];
  qaCategories: QACategory[];
  technologies: string[];
  levels: JobLevel[];
  employmentTypes: EmploymentType[];
  experienceBands: ExperienceBandId[];
  cities: string[];
  companies: string[];
  sources: string[];
  minSalary?: number;
  postedWithinHours?: number;
  sort: SortOption;
}

export function emptyFilterState(): JobFilterState {
  return {
    query: "",
    location: "all",
    remoteStatus: [],
    qaCategories: [],
    technologies: [],
    levels: [],
    employmentTypes: [],
    experienceBands: [],
    cities: [],
    companies: [],
    sources: [],
    sort: "newest",
  };
}
