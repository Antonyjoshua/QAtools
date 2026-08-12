// ---------------------------------------------------------------------------
// Enums / lookup lists
// ---------------------------------------------------------------------------

export const PRIORITIES = ["Critical", "High", "Medium", "Low"] as const;
export type Priority = (typeof PRIORITIES)[number];

export const SEVERITIES = ["Blocker", "Critical", "Major", "Minor", "Trivial"] as const;
export type Severity = (typeof SEVERITIES)[number];

export const TEST_TYPES = ["Functional", "Regression", "Smoke", "Sanity", "API", "UI", "Performance", "Security", "Accessibility", "Usability"] as const;
export type TestType = (typeof TEST_TYPES)[number];

export const TEST_CASE_STATUSES = ["Draft", "Ready", "In Review", "Approved", "Deprecated"] as const;
export type TestCaseStatus = (typeof TEST_CASE_STATUSES)[number];

export const AUTOMATION_STATUSES = ["Not Automated", "To Be Automated", "Automated", "Cannot Automate"] as const;
export type AutomationStatus = (typeof AUTOMATION_STATUSES)[number];

export const EXECUTION_RESULT_STATUSES = ["Pass", "Fail", "Blocked", "Skipped", "Not Executed", "Retest"] as const;
export type ExecutionResultStatus = (typeof EXECUTION_RESULT_STATUSES)[number];

export const RUN_STATUSES = ["Planned", "In Progress", "Completed", "Aborted"] as const;
export type RunStatus = (typeof RUN_STATUSES)[number];

export const STEP_STATUSES = ["Not Executed", "Pass", "Fail", "Blocked", "Skipped"] as const;
export type StepStatus = (typeof STEP_STATUSES)[number];

export const BROWSERS = ["Chrome", "Edge", "Firefox", "Safari", "Any"] as const;
export const OS_LIST = ["Windows", "macOS", "Linux", "Android", "iOS", "Any"] as const;
export const DEVICE_TYPES = ["Desktop", "Tablet", "Mobile", "Any"] as const;

export const ROLES = ["Admin", "QA Lead", "QA Engineer", "Developer", "Viewer"] as const;
export type UserRole = (typeof ROLES)[number];

// ---------------------------------------------------------------------------
// Core entities
// ---------------------------------------------------------------------------

export interface Project {
  id: string;
  name: string;
  description: string;
  isFavorite: boolean;
  createdAt: number;
  updatedAt: number;
}

/** A folder within a project's tree. Folders can nest via parentId. */
export interface Folder {
  id: string;
  projectId: string;
  parentId: string | null;
  name: string;
  order: number;
  createdAt: number;
}

export interface Suite {
  id: string;
  projectId: string;
  folderId: string;
  name: string;
  description: string;
  order: number;
  isFavorite: boolean;
  createdAt: number;
}

export interface Step {
  id: string;
  testCaseId: string;
  order: number;
  action: string;
  expectedResult: string;
  actualResult: string;
  screenshotAttachmentId: string | null;
  status: StepStatus;
}

export interface TestCase {
  id: string;
  displayId: string; // e.g. "TC-0001"
  projectId: string;
  suiteId: string;

  title: string;
  description: string;
  objective: string;
  module: string;
  feature: string;

  priority: Priority;
  severity: Severity;
  type: TestType;
  status: TestCaseStatus;

  requirementId: string;
  sprint: string;
  releaseVersion: string;
  environment: string;
  browser: string;
  device: string;
  os: string;
  tags: string[];

  author: string;
  reviewer: string;
  createdAt: number;
  updatedAt: number;
  estimatedTimeMinutes: number | null;

  automationStatus: AutomationStatus;
  automationScriptLink: string;

  preconditions: string;
  testData: string;
  expectedResult: string;
  actualResult: string;
  notes: string;
}

export interface Execution {
  id: string;
  projectId: string;
  name: string;
  description: string;
  status: RunStatus;
  environment: string;
  build: string;
  testCaseIds: string[];
  createdAt: number;
  startedAt: number | null;
  completedAt: number | null;
  scheduledFor: number | null;
}

export interface ExecutionResult {
  id: string;
  executionId: string;
  testCaseId: string;
  status: ExecutionResultStatus;
  comment: string;
  executedBy: string;
  executedAt: number | null;
  durationSeconds: number;
}

export interface Attachment {
  id: string;
  parentType: "testcase" | "step" | "executionResult" | "comment";
  parentId: string;
  filename: string;
  mimeType: string;
  size: number;
  blob: Blob;
  createdAt: number;
}

export interface Comment {
  id: string;
  testCaseId: string;
  author: string;
  text: string;
  mentions: string[];
  reactions: Record<string, string[]>; // emoji -> list of author names
  createdAt: number;
}

export interface HistoryEntry {
  id: string;
  entityType: "testcase";
  entityId: string;
  action: "created" | "updated" | "restored";
  changedBy: string;
  changedAt: number;
  summary: string;
  snapshot: TestCase;
}

export interface Requirement {
  id: string;
  projectId: string;
  requirementId: string; // external code, e.g. "REQ-102"
  title: string;
  description: string;
  createdAt: number;
}

export interface Tag {
  id: string;
  projectId: string;
  name: string;
  color: string;
}

// ---------------------------------------------------------------------------
// Derived / view-model types
// ---------------------------------------------------------------------------

export interface TestCaseFilters {
  search: string;
  status: TestCaseStatus[];
  priority: Priority[];
  severity: Severity[];
  type: TestType[];
  module: string[];
  feature: string[];
  sprint: string[];
  author: string[];
  reviewer: string[];
  automationStatus: AutomationStatus[];
  browser: string[];
  os: string[];
  tags: string[];
}

export const EMPTY_FILTERS: TestCaseFilters = {
  search: "",
  status: [],
  priority: [],
  severity: [],
  type: [],
  module: [],
  feature: [],
  sprint: [],
  author: [],
  reviewer: [],
  automationStatus: [],
  browser: [],
  os: [],
  tags: [],
};

export type TestCaseView = "table" | "kanban" | "checklist" | "calendar";

export interface ExecutionStats {
  total: number;
  pass: number;
  fail: number;
  blocked: number;
  skipped: number;
  notExecuted: number;
  retest: number;
  passRate: number; // 0-100, of executed
  executionRate: number; // 0-100, executed / total
}
