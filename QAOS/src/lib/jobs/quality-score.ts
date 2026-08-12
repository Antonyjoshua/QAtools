import type { RemoteStatus, SourceType } from "./types";

export interface QualityScoreInput {
  sourceType: SourceType;
  postedDate: string;
  city: string | null;
  country: string;
  salaryMin?: number;
  description: string;
  requirements: string[];
  remoteStatus: RemoteStatus;
}

export interface QualityScoreResult {
  score: number;
  label: string;
}

function daysSince(iso: string): number {
  const ms = Date.now() - new Date(iso).getTime();
  return Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));
}

/**
 * Job Quality Score — a confidence signal about the *listing data itself*
 * (how fresh, complete, and clearly-sourced it is), never an employer rating.
 * Weights sum to 100: source reliability 25, freshness 20, location clarity 15,
 * salary availability 15, description completeness 15, remote clarity 10.
 */
export function computeQualityScore(input: QualityScoreInput): QualityScoreResult {
  let score = 0;

  score += input.sourceType === "CompanyCareers" ? 25 : ["Greenhouse", "Lever", "Ashby", "Workable"].includes(input.sourceType) ? 20 : 12;

  const age = daysSince(input.postedDate);
  score += age <= 3 ? 20 : age <= 14 ? 14 : age <= 30 ? 8 : 2;

  score += input.city || input.country ? 15 : 0;
  score += input.salaryMin ? 15 : 0;
  score += input.description.length > 400 && input.requirements.length > 0 ? 15 : input.description.length > 150 ? 8 : 0;
  score += input.remoteStatus !== "REMOTE_UNKNOWN" ? 10 : 0;

  score = Math.min(100, Math.round(score));
  const label = score >= 85 ? "High confidence" : score >= 65 ? "Good confidence" : score >= 45 ? "Moderate confidence" : "Low confidence — needs review";
  return { score, label };
}
