import { scoreKeywordCoverage } from "@/lib/playground/text-match";
import type { Requirement, TestCase, TestCaseType } from "./types";

export interface CategoryScore {
  type: TestCaseType;
  percent: number;
  hitGroups: number;
  totalGroups: number;
}

export interface CoverageResult {
  categories: CategoryScore[];
  overall: number;
}

const TYPES: TestCaseType[] = ["Positive", "Negative", "Boundary", "Security", "Usability"];

function isStructurallyComplete(tc: TestCase): boolean {
  return (
    tc.preconditions.trim().length > 0 &&
    tc.steps.trim().split(/\r?\n/).filter(Boolean).length >= 2 &&
    tc.expectedResult.trim().length > 0
  );
}

export function scoreCoverage(requirement: Requirement, testCases: TestCase[]): CoverageResult {
  const categories: CategoryScore[] = TYPES.map((type) => {
    const groups = requirement.coverageChecklist[type] ?? [];
    if (groups.length === 0) {
      return { type, percent: 100, hitGroups: 0, totalGroups: 0 };
    }

    const casesOfType = testCases.filter((tc) => tc.type === type && isStructurallyComplete(tc));
    if (casesOfType.length === 0) {
      return { type, percent: 0, hitGroups: 0, totalGroups: groups.length };
    }

    const combinedText = casesOfType
      .map((tc) => `${tc.scenario}\n${tc.preconditions}\n${tc.testData}\n${tc.steps}\n${tc.expectedResult}`)
      .join("\n");
    const result = scoreKeywordCoverage(combinedText, groups);
    return { type, percent: result.percent, hitGroups: result.hitGroups, totalGroups: result.totalGroups };
  });

  const applicable = categories.filter((c) => c.totalGroups > 0);
  const overall =
    applicable.length === 0
      ? 0
      : Math.round(applicable.reduce((sum, c) => sum + c.percent, 0) / applicable.length);

  return { categories, overall };
}
