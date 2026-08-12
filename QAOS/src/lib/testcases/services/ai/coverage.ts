/**
 * Future AI service: estimates requirement and feature coverage from the
 * current test case set, and flags modules/features with thin coverage
 * relative to their change frequency or business risk. Not implemented —
 * this file only reserves the contract.
 */
import type { TestCase, Requirement } from "@/lib/testcases/types";

export interface AnalyzeCoverageInput {
  projectId: string;
  testCases: TestCase[];
  requirements: Requirement[];
}

export interface CoverageGap {
  module: string;
  feature: string;
  reason: string;
  riskLevel: "low" | "medium" | "high";
}

export interface CoverageAnalysisResult {
  overallCoveragePercent: number;
  uncoveredRequirementIds: string[];
  gaps: CoverageGap[];
}

export async function analyzeCoverage(_input: AnalyzeCoverageInput): Promise<CoverageAnalysisResult> {
  throw new Error("AI coverage analysis is not implemented yet.");
}
