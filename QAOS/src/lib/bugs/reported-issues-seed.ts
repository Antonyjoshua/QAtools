import { db } from "./db";
import { uid } from "./id";
import { createBug, updateBug } from "./bugs-repo";
import { doc, paragraph, orderedList } from "./template-builders";
import type { BugReport, Module, Project } from "./types";

// -----------------------------------------------------------------------------
// One-time insertion of three specific bugs reported directly against
// QuanGrade (as opposed to seed.ts's fictional demo project).
// -----------------------------------------------------------------------------

const QUANGRADE_PROJECT_NAME = "QuanGrade";

const REPORTED_BUGS: {
  title: string;
  // null = not tied to the QuanGrade project (bug reported against a different, external app).
  moduleName: string | null;
  severity: "Critical" | "High" | "Major" | "Medium" | "Minor" | "Cosmetic";
  priority: "P0" | "P1" | "P2" | "P3" | "P4";
  category: "Functional" | "UI" | "UX" | "Performance" | "Security" | "Accessibility" | "API" | "Database" | "Mobile" | "Regression" | "Compatibility" | "Calculation" | "Validation" | "Crash" | "Enhancement";
  description: string;
  preconditions?: string[];
  steps: string[];
  expected: string;
  actual: string;
  notes?: string;
  environment?: string;
}[] = [
  {
    title: "Download shows success tick even when the file isn't actually downloaded",
    moduleName: "File Converter",
    severity: "High",
    priority: "P1",
    category: "Functional",
    description:
      "In the File Converter, after converting a file, clicking Download and then View shows a green checkmark next to the output — but the file isn't actually saved to the device.",
    preconditions: ["A file has been successfully converted in the File Converter (either the active job list or the Conversion History page)."],
    steps: [
      "Go to File Converter and convert a file.",
      "Once conversion completes, click the Download button for the output.",
      "Click the View button to preview the output.",
      "Check the browser's download tray / Downloads folder.",
    ],
    expected: "Clicking Download saves the converted file to the device, and the checkmark reflects a completed download.",
    actual: "A checkmark is shown, but no file appears in the Downloads folder — the tick appears regardless of whether Download was ever clicked.",
    notes:
      "Possible cause (unconfirmed): the checkmark looks like it's tied to conversion-completion state (job.result.success / entry.status === \"completed\"), not to the Download button's click handler — worth checking whether it's ever driven by an actual successful download event. Reproducible on both the active job list and Conversion History.",
  },
  {
    title: "Current rank badge and hunter name not displaying on Dashboard",
    moduleName: "Solo Leveling",
    severity: "Medium",
    priority: "P2",
    category: "UI",
    description: "On the Solo Leveling Dashboard, the Hunter Status card sometimes fails to show the current rank badge and hunter name.",
    preconditions: ["A Solo Leveling profile exists with a hunter name and level/rank set."],
    steps: ["Go to Solo Leveling > Dashboard.", "Observe the Hunter Status card at the top of the page."],
    expected: "The hunter's rank badge and current name/title are clearly visible.",
    actual: "The rank badge and name are missing / not displaying.",
    notes:
      "The Hunter Status card uses a fade-in entrance animation (opacity 0 → 1) that may not be completing, leaving the badge/name invisible. The Profile page's header doesn't use this animation — needs confirmation whether this reproduces on Dashboard only or on Profile too.",
  },
  {
    title: "\"Frontend\" video progress bar jumps to the end during playback",
    moduleName: "Learn",
    severity: "Medium",
    priority: "P2",
    category: "Functional",
    description: "While watching the \"Frontend\" video, the progress bar jumps to / sits at the end shortly after playback starts, instead of tracking the actual position.",
    steps: ["Open the \"Frontend\" video (exact page still to be confirmed by reporter).", "Start playback.", "Watch the progress bar during playback."],
    expected: "The progress bar tracks actual playback position in real time.",
    actual: "The progress bar jumps to / shows the end of the video almost immediately, even though playback hasn't finished.",
    notes:
      "Could not locate a video-playback feature in the current codebase during triage — please confirm exactly which page this video is on so it can be investigated properly. Filed as reported in the meantime.",
  },
  {
    title: "Video not found / fails to play when opened from a recently added topic",
    moduleName: null,
    severity: "High",
    priority: "P1",
    category: "Functional",
    description:
      "In the course video list, opening a video from a recently added topic fails to play — the video shows as not found instead of starting playback.",
    steps: [
      "Open the course/topic list (Overview tab) where recently added topics appear at the top.",
      "Click Play Now on a recently added topic's video.",
      "Observe the player.",
    ],
    expected: "The video loads and plays normally, the same as videos from older/existing topics.",
    actual: "The video is reported as not found and does not play.",
    notes: "Reported by the user with a screenshot of the topic list. Only reproduces in Production — not yet confirmed against QA/Staging.",
    environment: "Production",
  },
];

/**
 * Consolidates any duplicate "QuanGrade" projects/modules/bugs down to one
 * canonical set, reparenting anything that pointed at a duplicate before
 * deleting it. Safe to run every time — a no-op once there's nothing to merge.
 */
async function dedupeExisting(): Promise<{ project: Project; moduleByName: Map<string, Module> }> {
  const quangradeProjects = (await db.projects.toArray())
    .filter((p) => p.name === QUANGRADE_PROJECT_NAME)
    .sort((a, b) => a.createdAt - b.createdAt);

  let project: Project;
  if (quangradeProjects.length === 0) {
    project = { id: uid(), name: QUANGRADE_PROJECT_NAME, description: "The QuanGrade application itself.", isFavorite: true, createdAt: Date.now() };
    await db.projects.add(project);
  } else {
    project = quangradeProjects[0];
    const duplicateProjectIds = quangradeProjects.slice(1).map((p) => p.id);
    for (const pid of duplicateProjectIds) {
      for (const m of await db.modules.where("projectId").equals(pid).toArray()) {
        await db.modules.update(m.id, { projectId: project.id });
      }
      for (const b of await db.bugs.where("projectId").equals(pid).toArray()) {
        await db.bugs.update(b.id, { projectId: project.id });
      }
    }
    if (duplicateProjectIds.length > 0) await db.projects.bulkDelete(duplicateProjectIds);
  }

  const modulesByName = new Map<string, Module[]>();
  for (const m of await db.modules.where("projectId").equals(project.id).toArray()) {
    modulesByName.set(m.name, [...(modulesByName.get(m.name) ?? []), m]);
  }
  const moduleByName = new Map<string, Module>();
  for (const [name, mods] of modulesByName) {
    const [canonical, ...dupes] = mods;
    moduleByName.set(name, canonical);
    for (const dup of dupes) {
      for (const b of await db.bugs.where("moduleId").equals(dup.id).toArray()) {
        await db.bugs.update(b.id, { moduleId: canonical.id });
      }
    }
    if (dupes.length > 0) await db.modules.bulkDelete(dupes.map((d) => d.id));
  }

  const reportedTitles = new Set(REPORTED_BUGS.map((b) => b.title));
  const bugsByTitle = new Map<string, BugReport[]>();
  for (const b of await db.bugs.toArray()) {
    if (!reportedTitles.has(b.title)) continue;
    bugsByTitle.set(b.title, [...(bugsByTitle.get(b.title) ?? []), b]);
  }
  for (const bugs of bugsByTitle.values()) {
    if (bugs.length <= 1) continue;
    const dupIds = bugs
      .sort((a, b) => a.createdAt - b.createdAt)
      .slice(1)
      .map((b) => b.id);
    await db.bugs.bulkDelete(dupIds);
  }

  return { project, moduleByName };
}

async function runSeed(): Promise<void> {
  const { project, moduleByName } = await dedupeExisting();

  for (const b of REPORTED_BUGS) {
    if (b.moduleName === null) continue;
    if (!moduleByName.has(b.moduleName)) {
      const mod: Module = { id: uid(), projectId: project.id, name: b.moduleName, isFavorite: false };
      await db.modules.add(mod);
      moduleByName.set(b.moduleName, mod);
    }
  }

  const existingTitles = new Set((await db.bugs.toArray()).map((b) => b.title));
  for (const b of REPORTED_BUGS) {
    if (existingTitles.has(b.title)) continue;
    const module_ = b.moduleName === null ? undefined : moduleByName.get(b.moduleName);
    const bug = await createBug({
      title: b.title,
      projectId: b.moduleName === null ? null : project.id,
      moduleId: module_?.id ?? null,
      severity: b.severity,
      priority: b.priority,
      category: b.category,
      environment: b.environment,
      preconditions: b.preconditions ? doc(...b.preconditions.map((p) => paragraph(p))) : undefined,
      stepsToReproduce: doc(orderedList(b.steps)),
      expectedResult: doc(paragraph(b.expected)),
      actualResult: doc(paragraph(b.actual)),
    });
    await updateBug(bug.id, {
      description: doc(paragraph(b.description)),
      additionalNotes: b.notes ? doc(paragraph(b.notes)) : undefined,
      status: "Open",
    });
  }
}

// Memoized so React's dev-mode double-invoked effects (and any other
// concurrent caller) all await the same run instead of racing each other
// into creating duplicate projects/modules/bugs.
let seedingPromise: Promise<void> | undefined;

export function ensureReportedIssuesSeeded(): Promise<void> {
  if (!seedingPromise) seedingPromise = runSeed();
  return seedingPromise;
}
