import type { JSONContent } from "@tiptap/core";

export const SEVERITIES = ["Critical", "High", "Major", "Medium", "Minor", "Cosmetic"] as const;
export type Severity = (typeof SEVERITIES)[number];

export const PRIORITIES = ["P0", "P1", "P2", "P3", "P4"] as const;
export type Priority = (typeof PRIORITIES)[number];

export const CATEGORIES = [
  "Functional",
  "UI",
  "UX",
  "Performance",
  "Security",
  "Accessibility",
  "API",
  "Database",
  "Mobile",
  "Regression",
  "Compatibility",
  "Calculation",
  "Validation",
  "Crash",
  "Enhancement",
] as const;
export type BugCategory = (typeof CATEGORIES)[number];

export const STATUSES = [
  "Draft",
  "Open",
  "Assigned",
  "In Progress",
  "Fixed",
  "Retest",
  "Reopened",
  "Closed",
  "Rejected",
  "Duplicate",
  "Deferred",
] as const;
export type BugStatus = (typeof STATUSES)[number];

export const BROWSERS = ["Chrome", "Edge", "Firefox", "Safari"] as const;
export const PLATFORMS = ["Web", "Android", "iOS", "Desktop"] as const;
export const OS_LIST = ["Windows", "macOS", "Linux", "Android", "iOS"] as const;
export const DEVICE_TYPES = ["Desktop", "Tablet", "Mobile"] as const;

export const ROLES = ["Admin", "QA Lead", "QA Engineer", "Developer", "Viewer"] as const;
export type UserRole = (typeof ROLES)[number];

export interface Project {
  id: string;
  name: string;
  description: string;
  isFavorite: boolean;
  createdAt: number;
}

export interface Module {
  id: string;
  projectId: string;
  name: string;
  isFavorite: boolean;
}

export interface Feature {
  id: string;
  moduleId: string;
  name: string;
}

export interface BuildVersion {
  id: string;
  projectId: string;
  version: string;
  releaseName: string;
  createdAt: number;
}

export interface TestEnvironment {
  id: string;
  projectId: string;
  name: string;
  url: string;
}

export interface Label {
  id: string;
  name: string;
  color: string;
  isCustom: boolean;
}

export interface Attachment {
  id: string;
  bugId: string;
  kind: "screenshot" | "video" | "file";
  filename: string;
  mimeType: string;
  size: number;
  blob: Blob;
  caption: string;
  createdAt: number;
}

export interface ChecklistState {
  titleEntered: boolean;
  stepsProvided: boolean;
  expectedAdded: boolean;
  actualAdded: boolean;
  severitySelected: boolean;
  prioritySelected: boolean;
  screenshotAttached: boolean;
  environmentSelected: boolean;
}

export interface BugReport {
  id: string;
  displayId: string;
  title: string;
  description: JSONContent;
  descriptionText: string;
  preconditions: JSONContent;
  stepsToReproduce: JSONContent;
  expectedResult: JSONContent;
  actualResult: JSONContent;
  observedBehaviour: JSONContent;
  additionalNotes: JSONContent;

  projectId: string | null;
  moduleId: string | null;
  featureId: string | null;
  buildVersion: string;
  environment: string;
  platform: string;
  browser: string;
  browserVersion: string;
  device: string;
  os: string;
  reporter: string;

  severity: Severity | null;
  priority: Priority | null;
  category: BugCategory | null;
  labels: string[];
  status: BugStatus;

  templateId: string | null;
  createdAt: number;
  updatedAt: number;

  // Soft links into the Test Management module (separate Dexie database — resolved by id
  // lookup at render time, not a real foreign key). displayId is denormalized so the link
  // stays readable even if the source test case is later deleted.
  linkedTestCaseId: string | null;
  linkedTestCaseDisplayId: string | null;
  linkedExecutionId: string | null;
  linkedExecutionResultId: string | null;
}

export interface Comment {
  id: string;
  bugId: string;
  parentId: string | null;
  author: string;
  text: string;
  mentions: string[];
  createdAt: number;
}

export interface BugVersion {
  id: string;
  bugId: string;
  snapshot: Partial<BugReport>;
  editor: string;
  modifiedFields: string[];
  createdAt: number;
}

export interface ReusableStep {
  id: string;
  name: string;
  contentJSON: JSONContent;
  contentText: string;
  createdAt: number;
}

export interface ExportRecord {
  id: string;
  bugId: string;
  bugDisplayId: string;
  format: "pdf" | "docx" | "markdown" | "html" | "json" | "print";
  createdAt: number;
}

export interface AppSettings {
  currentUser: string;
  currentRole: UserRole;
}
