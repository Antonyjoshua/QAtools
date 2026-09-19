import { db } from "./db";
import { uid, displayId } from "@/lib/playground/id";
import { awardXp } from "@/lib/playground/gamification/award-xp";
import type { TestCase, TestCasePriority, TestCaseType } from "./types";

export interface NewTestCaseInput {
  requirementId: string;
  scenario: string;
  preconditions: string;
  testData: string;
  steps: string;
  expectedResult: string;
  priority: TestCasePriority;
  type: TestCaseType;
}

export async function createTestCase(input: NewTestCaseInput): Promise<TestCase> {
  const now = new Date().toISOString();
  const testCase: TestCase = {
    id: uid(),
    displayId: displayId("TC"),
    createdAt: now,
    updatedAt: now,
    ...input,
  };
  await db.testCases.add(testCase);
  await awardXp(15, "test case created");
  return testCase;
}

export async function deleteTestCase(id: string): Promise<void> {
  await db.testCases.delete(id);
}
