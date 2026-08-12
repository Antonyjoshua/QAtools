import { db } from "../db";
import type { TestCase, Execution, ExecutionResult } from "../types";
import { createBug, type CreateBugInput } from "@/lib/bugs/bugs-repo";
import type { BugReport } from "@/lib/bugs/types";
import { doc, paragraph, orderedList } from "@/lib/bugs/template-builders";

// Test Management reaches into Bug Reports (not the other way around) — Bug Reports has no
// knowledge of test cases and works standalone; this is the one intentional cross-module edge.

const SEVERITY_MAP: Record<TestCase["severity"], BugReport["severity"]> = {
  Blocker: "Critical",
  Critical: "Critical",
  Major: "Major",
  Minor: "Minor",
  Trivial: "Cosmetic",
};

const PRIORITY_MAP: Record<TestCase["priority"], NonNullable<BugReport["priority"]>> = {
  Critical: "P0",
  High: "P1",
  Medium: "P2",
  Low: "P3",
};

const CATEGORY_MAP: Partial<Record<TestCase["type"], BugReport["category"]>> = {
  Functional: "Functional",
  UI: "UI",
  Performance: "Performance",
  Security: "Security",
  Accessibility: "Accessibility",
  API: "API",
  Regression: "Regression",
};

export async function createBugFromTestCase(testCase: TestCase, execution: Execution, result: ExecutionResult, reporter: string): Promise<BugReport> {
  const steps = await db.steps.where("testCaseId").equals(testCase.id).sortBy("order");

  const input: CreateBugInput = {
    title: `Failed: ${testCase.title}`,
    category: CATEGORY_MAP[testCase.type] ?? null,
    severity: SEVERITY_MAP[testCase.severity],
    priority: PRIORITY_MAP[testCase.priority],
    preconditions: testCase.preconditions ? doc(paragraph(testCase.preconditions)) : undefined,
    stepsToReproduce: steps.length > 0 ? doc(orderedList(steps.map((s) => s.action).filter(Boolean))) : undefined,
    expectedResult: testCase.expectedResult ? doc(paragraph(testCase.expectedResult)) : undefined,
    actualResult: result.comment ? doc(paragraph(result.comment)) : undefined,
    environment: testCase.environment,
    browser: testCase.browser,
    os: testCase.os,
    device: testCase.device,
    reporter,
    linkedTestCaseId: testCase.id,
    linkedTestCaseDisplayId: testCase.displayId,
    linkedExecutionId: execution.id,
    linkedExecutionResultId: result.id,
  };

  return createBug(input);
}
