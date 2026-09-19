import type { BugCategory, BugPriority, BugSeverity, ShopModule } from "@/lib/playground/bug-registry/types";

export type Reproducibility = "Always" | "Sometimes" | "Rarely" | "Could not reproduce";
export type MissionDifficulty = "Beginner" | "Intermediate" | "Advanced" | "Expert";

export interface Mission {
  id: string;
  title: string;
  difficulty: MissionDifficulty;
  scope: ShopModule[];
  timeLimitMinutes: number;
  environment: string;
  browser: string;
  userStory: string;
  acceptanceCriteria: string[];
  testData: { label: string; value: string }[];
  /** Canonical bugs this mission focuses on — used for the mission's completion %, not an exclusivity rule. */
  targetBugIds: string[];
}

export interface BugReportInput {
  missionId: string;
  title: string;
  module: ShopModule;
  environment: string;
  preconditions: string;
  stepsToReproduce: string;
  expectedResult: string;
  actualResult: string;
  severity: BugSeverity;
  priority: BugPriority;
  reproducibility: Reproducibility;
  category: BugCategory;
  evidenceNote: string;
  /** When set, this submission is a retest linked from the Execution playground rather than a fresh Bug Hunter find. */
  linkedTestCaseId?: string;
  linkedExecutionId?: string;
  linkedExecutionResultId?: string;
}

export interface BugReportSubmission extends BugReportInput {
  id: string;
  displayId: string;
  matchedBugId: string | null;
  matchScore: number;
  severityCorrect: boolean;
  priorityCorrect: boolean;
  qualityPercent: number;
  xpAwarded: number;
  isDuplicate: boolean;
  status: "Open" | "Closed";
  submittedAt: string;
}
