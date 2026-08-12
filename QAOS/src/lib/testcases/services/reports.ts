import { db } from "../db";
import type { TestCase, ExecutionResultStatus } from "../types";

export interface ReportRow {
  displayId: string;
  title: string;
  module: string;
  priority: string;
  status: string;
  lastResult: ExecutionResultStatus | "Not Run";
  lastExecutedAt: number | null;
}

export interface ReportData {
  id: string;
  title: string;
  description: string;
  generatedAt: number;
  stats: { label: string; value: string | number }[];
  rows: ReportRow[];
}

async function rowsFor(testCases: TestCase[]): Promise<ReportRow[]> {
  const results = await db.executionResults.toArray();
  const latestByCase = new Map<string, { status: ExecutionResultStatus; executedAt: number | null }>();
  for (const r of results.slice().sort((a, b) => (a.executedAt ?? 0) - (b.executedAt ?? 0))) {
    if (r.executedAt) latestByCase.set(r.testCaseId, { status: r.status, executedAt: r.executedAt });
  }
  return testCases.map((tc) => {
    const latest = latestByCase.get(tc.id);
    return {
      displayId: tc.displayId,
      title: tc.title,
      module: tc.module,
      priority: tc.priority,
      status: tc.status,
      lastResult: latest?.status ?? "Not Run",
      lastExecutedAt: latest?.executedAt ?? null,
    };
  });
}

function statusStats(rows: ReportRow[]): { label: string; value: string | number }[] {
  const pass = rows.filter((r) => r.lastResult === "Pass").length;
  const fail = rows.filter((r) => r.lastResult === "Fail").length;
  const blocked = rows.filter((r) => r.lastResult === "Blocked").length;
  const notRun = rows.filter((r) => r.lastResult === "Not Run").length;
  const executed = rows.length - notRun;
  return [
    { label: "Total", value: rows.length },
    { label: "Pass", value: pass },
    { label: "Fail", value: fail },
    { label: "Blocked", value: blocked },
    { label: "Not Run", value: notRun },
    { label: "Pass Rate", value: executed > 0 ? `${Math.round((pass / executed) * 100)}%` : "—" },
  ];
}

export interface ReportContext {
  projectId: string;
  executionId?: string;
  sprint?: string;
  releaseVersion?: string;
  date?: string; // yyyy-mm-dd
}

export interface ReportDefinition {
  id: string;
  label: string;
  description: string;
  requires?: "execution" | "sprint" | "release" | "date";
  build: (ctx: ReportContext) => Promise<ReportData>;
}

export const REPORT_TYPES: ReportDefinition[] = [
  {
    id: "summary",
    label: "Summary Report",
    description: "Overall test case status and execution snapshot for the project.",
    build: async (ctx) => {
      const testCases = await db.testCases.where("projectId").equals(ctx.projectId).toArray();
      const rows = await rowsFor(testCases);
      return { id: "summary", title: "Summary Report", description: "All test cases in the project.", generatedAt: Date.now(), stats: statusStats(rows), rows };
    },
  },
  {
    id: "execution",
    label: "Execution Report",
    description: "Results for a specific test run.",
    requires: "execution",
    build: async (ctx) => {
      const execution = ctx.executionId ? await db.executions.get(ctx.executionId) : undefined;
      const testCases = execution ? await db.testCases.bulkGet(execution.testCaseIds) : [];
      const rows = await rowsFor(testCases.filter((t): t is TestCase => Boolean(t)));
      return {
        id: "execution",
        title: execution ? `Execution Report — ${execution.name}` : "Execution Report",
        description: "Results recorded for this test run.",
        generatedAt: Date.now(),
        stats: statusStats(rows),
        rows,
      };
    },
  },
  {
    id: "regression",
    label: "Regression Report",
    description: "All Regression-type test cases and their latest result.",
    build: async (ctx) => {
      const testCases = (await db.testCases.where("projectId").equals(ctx.projectId).toArray()).filter(
        (tc) => tc.type === "Regression" || tc.tags.includes("regression")
      );
      const rows = await rowsFor(testCases);
      return { id: "regression", title: "Regression Report", description: "Regression-tagged test cases.", generatedAt: Date.now(), stats: statusStats(rows), rows };
    },
  },
  {
    id: "smoke",
    label: "Smoke Report",
    description: "All Smoke-type test cases and their latest result.",
    build: async (ctx) => {
      const testCases = (await db.testCases.where("projectId").equals(ctx.projectId).toArray()).filter(
        (tc) => tc.type === "Smoke" || tc.tags.includes("smoke")
      );
      const rows = await rowsFor(testCases);
      return { id: "smoke", title: "Smoke Report", description: "Smoke-tagged test cases.", generatedAt: Date.now(), stats: statusStats(rows), rows };
    },
  },
  {
    id: "sprint",
    label: "Sprint Report",
    description: "Test cases scoped to a sprint.",
    requires: "sprint",
    build: async (ctx) => {
      const testCases = (await db.testCases.where("projectId").equals(ctx.projectId).toArray()).filter((tc) => tc.sprint === ctx.sprint);
      const rows = await rowsFor(testCases);
      return {
        id: "sprint",
        title: `Sprint Report — ${ctx.sprint ?? ""}`,
        description: "Test cases scoped to this sprint.",
        generatedAt: Date.now(),
        stats: statusStats(rows),
        rows,
      };
    },
  },
  {
    id: "release",
    label: "Release Report",
    description: "Test cases scoped to a release version.",
    requires: "release",
    build: async (ctx) => {
      const testCases = (await db.testCases.where("projectId").equals(ctx.projectId).toArray()).filter((tc) => tc.releaseVersion === ctx.releaseVersion);
      const rows = await rowsFor(testCases);
      return {
        id: "release",
        title: `Release Report — ${ctx.releaseVersion ?? ""}`,
        description: "Test cases scoped to this release.",
        generatedAt: Date.now(),
        stats: statusStats(rows),
        rows,
      };
    },
  },
  {
    id: "daily",
    label: "Daily Report",
    description: "Test cases executed on a given day.",
    requires: "date",
    build: async (ctx) => {
      const testCases = await db.testCases.where("projectId").equals(ctx.projectId).toArray();
      const results = await db.executionResults.toArray();
      const target = ctx.date ?? new Date().toISOString().slice(0, 10);
      const executedIds = new Set(
        results.filter((r) => r.executedAt && new Date(r.executedAt).toISOString().slice(0, 10) === target).map((r) => r.testCaseId)
      );
      const rows = await rowsFor(testCases.filter((tc) => executedIds.has(tc.id)));
      return { id: "daily", title: `Daily Report — ${target}`, description: "Test cases executed on this day.", generatedAt: Date.now(), stats: statusStats(rows), rows };
    },
  },
];

export function getReportDefinition(id: string): ReportDefinition | undefined {
  return REPORT_TYPES.find((r) => r.id === id);
}
