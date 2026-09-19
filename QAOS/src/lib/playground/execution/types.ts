export type ExecutionResultStatus = "Pending" | "Pass" | "Fail" | "Blocked";

export interface ExecutionRun {
  id: string;
  requirementId: string;
  status: "InProgress" | "Completed";
  startedAt: string;
  completedAt: string | null;
}

export interface ExecutionResult {
  id: string;
  executionId: string;
  testCaseId: string;
  status: ExecutionResultStatus;
  notes: string;
  linkedBugReportId: string | null;
  executedAt: string | null;
}
