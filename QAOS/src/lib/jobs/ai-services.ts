import type { Job, JobLevel, QACategory, UserJobProfile } from "./types";

// -----------------------------------------------------------------------------
// Forward-looking service interfaces for future AI features. Intentionally
// unimplemented — no model calls, no API keys, no runtime behavior. Defining
// the contracts now means the UI (profile matching, resume tools, interview
// prep) can be built against a stable shape today and wired to a real
// implementation later without changing call sites.
// -----------------------------------------------------------------------------

export interface JobMatch {
  jobId: string;
  score: number;
  reasons: string[];
}

export interface AIJobMatchService {
  matchJobsToProfile(profile: UserJobProfile, jobs: Job[]): Promise<JobMatch[]>;
}

export interface ResumeMatchResult {
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
}

export interface ResumeMatchService {
  matchResumeToJob(resumeText: string, job: Job): Promise<ResumeMatchResult>;
}

export interface SkillGapAnalysisService {
  analyzeSkillGap(profile: UserJobProfile, job: Job): Promise<{ missingSkills: string[]; suggestions: string[] }>;
}

export interface ResumeOptimizationService {
  suggestOptimizations(resumeText: string, job: Job): Promise<string[]>;
}

export interface JobDescriptionAnalysisService {
  analyzeDescription(description: string): Promise<{ summary: string; redFlags: string[]; niceToHaves: string[] }>;
}

export interface InterviewPrepService {
  generateQuestions(job: Job): Promise<{ question: string; category: string }[]>;
}

export interface CareerRecommendationService {
  recommendNextRoles(profile: UserJobProfile): Promise<QACategory[]>;
}

export interface DuplicateDetectionService {
  findLikelyDuplicates(job: Job, candidates: Job[]): Promise<{ jobId: string; confidence: number }[]>;
}

export interface JobClassificationService {
  classify(job: Job): Promise<{ qaCategories: QACategory[]; level: JobLevel; confidence: number }>;
}
