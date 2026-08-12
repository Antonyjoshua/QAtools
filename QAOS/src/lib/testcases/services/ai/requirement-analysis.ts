/**
 * Future AI service: analyzes a requirement's text for ambiguity, testability,
 * and completeness, and suggests which existing test cases already cover it.
 * Not implemented — this file only reserves the contract.
 */
import type { Requirement } from "@/lib/testcases/types";

export interface AnalyzeRequirementInput {
  requirement: Requirement;
}

export interface RequirementAnalysisResult {
  testabilityScore: number; // 0-100
  ambiguousPhrases: string[];
  suggestedAcceptanceCriteria: string[];
  coveredByTestCaseIds: string[];
  gaps: string[];
}

export async function analyzeRequirement(_input: AnalyzeRequirementInput): Promise<RequirementAnalysisResult> {
  throw new Error("AI requirement analysis is not implemented yet.");
}
