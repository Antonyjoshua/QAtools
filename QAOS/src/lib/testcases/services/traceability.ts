import { db } from "../db";
import { db as bugsDb } from "@/lib/bugs/db";

export interface TraceabilityGapRow {
  id: string;
  label: string;
  sublabel: string;
  href: string;
}

export interface TraceabilityData {
  projectId: string;
  totals: {
    requirements: number;
    testCases: number;
    testCasesLinkedToBug: number;
    unlinkedBugReportsAllProjects: number;
  };
  coverage: {
    requirementCoveragePct: number; // requirements with >=1 test case / total requirements
    executionCoveragePct: number; // test cases with >=1 result / total test cases
    bugLinkagePct: number; // test cases with >=1 linked bug / total test cases
  };
  requirementsWithoutTestCases: TraceabilityGapRow[];
  testCasesWithoutRequirement: TraceabilityGapRow[];
  testCasesNeverExecuted: TraceabilityGapRow[];
  testCasesWithoutLinkedBug: TraceabilityGapRow[];
  /** Bug Reports has its own separate "projects" concept from Test Management, and bugs
   * auto-filed from a failed execution don't set a projectId at all (see bug-link.ts) — so
   * this list is intentionally global across all bug reports, not scoped to this project. */
  unlinkedBugReports: TraceabilityGapRow[];
}

export async function buildTraceability(projectId: string): Promise<TraceabilityData> {
  const [requirements, testCases, executionResults, allBugs] = await Promise.all([
    db.requirements.where("projectId").equals(projectId).toArray(),
    db.testCases.where("projectId").equals(projectId).toArray(),
    db.executionResults.toArray(),
    bugsDb.bugs.toArray(),
  ]);

  const testCaseIds = new Set(testCases.map((tc) => tc.id));

  const testCaseCountByRequirement = new Map<string, number>();
  for (const tc of testCases) {
    if (!tc.requirementId.trim()) continue;
    testCaseCountByRequirement.set(tc.requirementId, (testCaseCountByRequirement.get(tc.requirementId) ?? 0) + 1);
  }
  const requirementsWithoutTestCases = requirements.filter((r) => (testCaseCountByRequirement.get(r.id) ?? 0) === 0);
  const testCasesWithoutRequirement = testCases.filter((tc) => !tc.requirementId.trim());

  const executedIds = new Set(executionResults.filter((r) => r.executedAt && testCaseIds.has(r.testCaseId)).map((r) => r.testCaseId));
  const testCasesNeverExecuted = testCases.filter((tc) => !executedIds.has(tc.id));

  const linkedTestCaseIds = new Set(allBugs.map((b) => b.linkedTestCaseId).filter((id): id is string => Boolean(id)));
  const testCasesWithoutLinkedBug = testCases.filter((tc) => !linkedTestCaseIds.has(tc.id));
  const testCasesLinkedToBug = testCases.length - testCasesWithoutLinkedBug.length;

  const unlinkedBugReports = allBugs.filter((b) => !b.linkedTestCaseId);

  const pct = (num: number, den: number) => (den === 0 ? 0 : Math.round((num / den) * 100));

  return {
    projectId,
    totals: {
      requirements: requirements.length,
      testCases: testCases.length,
      testCasesLinkedToBug,
      unlinkedBugReportsAllProjects: unlinkedBugReports.length,
    },
    coverage: {
      requirementCoveragePct: pct(requirements.length - requirementsWithoutTestCases.length, requirements.length),
      executionCoveragePct: pct(executedIds.size, testCases.length),
      bugLinkagePct: pct(testCasesLinkedToBug, testCases.length),
    },
    requirementsWithoutTestCases: requirementsWithoutTestCases.map((r) => ({
      id: r.id,
      label: r.requirementId,
      sublabel: r.title,
      href: "/testcases/requirements",
    })),
    testCasesWithoutRequirement: testCasesWithoutRequirement.map((tc) => ({
      id: tc.id,
      label: tc.displayId,
      sublabel: tc.title,
      href: `/testcases/case/${tc.id}`,
    })),
    testCasesNeverExecuted: testCasesNeverExecuted.map((tc) => ({
      id: tc.id,
      label: tc.displayId,
      sublabel: tc.title,
      href: `/testcases/case/${tc.id}`,
    })),
    testCasesWithoutLinkedBug: testCasesWithoutLinkedBug.map((tc) => ({
      id: tc.id,
      label: tc.displayId,
      sublabel: tc.title,
      href: `/testcases/case/${tc.id}`,
    })),
    unlinkedBugReports: unlinkedBugReports.map((b) => ({
      id: b.id,
      label: b.displayId,
      sublabel: b.title,
      href: `/bugs/${b.id}`,
    })),
  };
}
