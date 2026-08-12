/**
 * Future AI service: suggests what to do next for a project — which suites
 * to run before a release, which stale test cases to review, which
 * automation candidates would have the highest ROI. Not implemented — this
 * file only reserves the contract.
 */
import type { TestCase, Execution } from "@/lib/testcases/types";

export interface RecommendationsInput {
  projectId: string;
  testCases: TestCase[];
  recentExecutions: Execution[];
}

export interface Recommendation {
  id: string;
  kind: "run-suite" | "review-stale-case" | "automate-candidate" | "fix-flaky";
  title: string;
  description: string;
  relatedIds: string[];
}

export async function getRecommendations(_input: RecommendationsInput): Promise<Recommendation[]> {
  throw new Error("AI recommendations are not implemented yet.");
}
