import { db } from "./db";
import { uid } from "./id";
import { EMPTY_DOC, extractText, isDocEmpty } from "./content-utils";
import type { BugReport, BugStatus, ChecklistState } from "./types";
import type { JSONContent } from "@tiptap/core";

export interface CreateBugInput {
  title?: string;
  projectId?: string | null;
  moduleId?: string | null;
  templateId?: string | null;
  category?: BugReport["category"];
  severity?: BugReport["severity"];
  priority?: BugReport["priority"];
  preconditions?: JSONContent;
  stepsToReproduce?: JSONContent;
  expectedResult?: JSONContent;
  actualResult?: JSONContent;
  reporter?: string;
  environment?: string;
  browser?: string;
  os?: string;
  device?: string;
  linkedTestCaseId?: string | null;
  linkedTestCaseDisplayId?: string | null;
  linkedExecutionId?: string | null;
  linkedExecutionResultId?: string | null;
}

async function nextDisplayId(): Promise<string> {
  const all = await db.bugs.toArray();
  let max = 0;
  for (const b of all) {
    const match = /BUG-(\d+)/.exec(b.displayId);
    if (match) max = Math.max(max, Number(match[1]));
  }
  return `BUG-${String(max + 1).padStart(4, "0")}`;
}

export async function createBug(input: CreateBugInput = {}): Promise<BugReport> {
  const now = Date.now();
  const bug: BugReport = {
    id: uid(),
    displayId: await nextDisplayId(),
    title: input.title ?? "",
    description: EMPTY_DOC,
    descriptionText: "",
    preconditions: input.preconditions ?? EMPTY_DOC,
    stepsToReproduce: input.stepsToReproduce ?? EMPTY_DOC,
    expectedResult: input.expectedResult ?? EMPTY_DOC,
    actualResult: input.actualResult ?? EMPTY_DOC,
    observedBehaviour: EMPTY_DOC,
    additionalNotes: EMPTY_DOC,

    projectId: input.projectId ?? null,
    moduleId: input.moduleId ?? null,
    featureId: null,
    buildVersion: "",
    environment: input.environment ?? "",
    platform: "",
    browser: input.browser ?? "",
    browserVersion: "",
    device: input.device ?? "",
    os: input.os ?? "",
    reporter: input.reporter ?? "You",

    severity: input.severity ?? null,
    priority: input.priority ?? null,
    category: input.category ?? null,
    labels: [],
    status: "Draft",

    templateId: input.templateId ?? null,
    createdAt: now,
    updatedAt: now,

    linkedTestCaseId: input.linkedTestCaseId ?? null,
    linkedTestCaseDisplayId: input.linkedTestCaseDisplayId ?? null,
    linkedExecutionId: input.linkedExecutionId ?? null,
    linkedExecutionResultId: input.linkedExecutionResultId ?? null,
  };
  await db.bugs.add(bug);
  return bug;
}

export async function getBugsForTestCase(testCaseId: string): Promise<BugReport[]> {
  return db.bugs.where("linkedTestCaseId").equals(testCaseId).sortBy("createdAt");
}

const FIELD_LABELS: Record<string, string> = {
  title: "Title",
  description: "Description",
  preconditions: "Preconditions",
  stepsToReproduce: "Steps to Reproduce",
  expectedResult: "Expected Result",
  actualResult: "Actual Result",
  observedBehaviour: "Observed Behaviour",
  additionalNotes: "Additional Notes",
  severity: "Severity",
  priority: "Priority",
  category: "Category",
  status: "Status",
  labels: "Labels",
  projectId: "Project",
  moduleId: "Module",
  featureId: "Feature",
  buildVersion: "Build Version",
  environment: "Environment",
  platform: "Platform",
  browser: "Browser",
  browserVersion: "Browser Version",
  device: "Device",
  os: "Operating System",
};

export async function updateBug(id: string, patch: Partial<BugReport>, editor = "You"): Promise<void> {
  const existing = await db.bugs.get(id);
  if (!existing) return;

  const modifiedFields: string[] = [];
  for (const key of Object.keys(patch) as (keyof BugReport)[]) {
    if (JSON.stringify(patch[key]) !== JSON.stringify(existing[key])) {
      modifiedFields.push(FIELD_LABELS[key] ?? String(key));
    }
  }

  const updated: Partial<BugReport> = { ...patch, updatedAt: Date.now() };
  if (patch.description) updated.descriptionText = extractText(patch.description);
  await db.bugs.update(id, updated);

  if (modifiedFields.length > 0) {
    await db.versions.add({
      id: uid(),
      bugId: id,
      snapshot: { ...existing, ...patch },
      editor,
      modifiedFields,
      createdAt: Date.now(),
    });
  }
}

export async function deleteBugForever(id: string): Promise<void> {
  await db.transaction("rw", [db.bugs, db.attachments, db.versions, db.comments], async () => {
    await db.bugs.delete(id);
    await db.attachments.where("bugId").equals(id).delete();
    await db.versions.where("bugId").equals(id).delete();
    await db.comments.where("bugId").equals(id).delete();
  });
}

export async function duplicateBug(id: string): Promise<BugReport | null> {
  const original = await db.bugs.get(id);
  if (!original) return null;
  const now = Date.now();
  const copy: BugReport = {
    ...original,
    id: uid(),
    displayId: await nextDisplayId(),
    title: `${original.title} (Copy)`,
    status: "Draft",
    createdAt: now,
    updatedAt: now,
  };
  await db.bugs.add(copy);
  return copy;
}

export async function setStatus(id: string, status: BugStatus): Promise<void> {
  await updateBug(id, { status });
}

export function computeChecklist(bug: BugReport, hasScreenshot: boolean): ChecklistState {
  return {
    titleEntered: bug.title.trim().length > 0,
    stepsProvided: !isDocEmpty(bug.stepsToReproduce),
    expectedAdded: !isDocEmpty(bug.expectedResult),
    actualAdded: !isDocEmpty(bug.actualResult),
    severitySelected: bug.severity !== null,
    prioritySelected: bug.priority !== null,
    screenshotAttached: hasScreenshot,
    environmentSelected: bug.environment.trim().length > 0 || bug.browser.trim().length > 0 || bug.platform.trim().length > 0,
  };
}

function normalizeTitle(title: string): Set<string> {
  return new Set(
    title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .split(/\s+/)
      .filter((w) => w.length > 2)
  );
}

function jaccardSimilarity(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let intersection = 0;
  for (const w of a) if (b.has(w)) intersection++;
  const union = a.size + b.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

export async function findSimilarBugs(title: string, excludeId?: string): Promise<{ bug: BugReport; similarity: number }[]> {
  if (title.trim().length < 4) return [];
  const words = normalizeTitle(title);
  const all = await db.bugs.toArray();
  const results = all
    .filter((b) => b.id !== excludeId && b.title.trim())
    .map((b) => ({ bug: b, similarity: jaccardSimilarity(words, normalizeTitle(b.title)) }))
    .filter((r) => r.similarity >= 0.4)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 5);
  return results;
}
