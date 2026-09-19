export type TestCaseType = "Positive" | "Negative" | "Boundary" | "Security" | "Usability";
export type TestCasePriority = "P1" | "P2" | "P3" | "P4";
export type RequirementDifficulty = "Beginner" | "Intermediate" | "Advanced" | "Expert";

export interface Requirement {
  id: string;
  title: string;
  statement: string;
  difficulty: RequirementDifficulty;
  /** Keyword groups per category — each group is one "idea" a test case's text can credit. */
  coverageChecklist: Record<TestCaseType, string[][]>;
}

export interface TestCase {
  id: string;
  displayId: string;
  requirementId: string;
  scenario: string;
  preconditions: string;
  testData: string;
  steps: string;
  expectedResult: string;
  priority: TestCasePriority;
  type: TestCaseType;
  createdAt: string;
  updatedAt: string;
}
