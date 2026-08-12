/**
 * Future AI service: generates draft test cases from a requirement, user story,
 * or free-text description. Not implemented — this file only reserves the
 * contract so the UI layer can be wired up ahead of the actual integration.
 */
import type { TestCase } from "@/lib/testcases/types";

export interface GenerateTestCasesInput {
  projectId: string;
  suiteId: string;
  /** Requirement text, user story, or a short feature description. */
  prompt: string;
  count?: number;
}

export type GeneratedTestCaseDraft = Pick<
  TestCase,
  "title" | "description" | "objective" | "preconditions" | "expectedResult" | "priority" | "severity" | "type"
> & {
  steps: { action: string; expectedResult: string }[];
};

export interface GenerateTestCasesResult {
  drafts: GeneratedTestCaseDraft[];
}

export async function generateTestCases(_input: GenerateTestCasesInput): Promise<GenerateTestCasesResult> {
  throw new Error("AI test case generation is not implemented yet.");
}
