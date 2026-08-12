import * as XLSX from "xlsx";
import { downloadBlob, downloadExcel, downloadPDF, rowsToCSV, rowsToJSON, type Row } from "@/lib/generator/export";
import type { TestCase } from "../types";
import { PRIORITIES, SEVERITIES, TEST_TYPES, TEST_CASE_STATUSES, AUTOMATION_STATUSES } from "../types";
import type { ReportData } from "./reports";
import { createTestCase, type NewTestCaseInput } from "../repo/testcases-repo";

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

function testCaseToRow(tc: TestCase): Row {
  return {
    "Test Case ID": tc.displayId,
    Title: tc.title,
    Description: tc.description,
    Module: tc.module,
    Feature: tc.feature,
    Priority: tc.priority,
    Severity: tc.severity,
    Type: tc.type,
    Status: tc.status,
    "Requirement ID": tc.requirementId,
    Sprint: tc.sprint,
    Release: tc.releaseVersion,
    Environment: tc.environment,
    Browser: tc.browser,
    Device: tc.device,
    OS: tc.os,
    Tags: tc.tags.join(", "),
    Author: tc.author,
    Reviewer: tc.reviewer,
    "Automation Status": tc.automationStatus,
    Preconditions: tc.preconditions,
    "Expected Result": tc.expectedResult,
  };
}

export type ExportFileFormat = "csv" | "excel" | "json" | "pdf";

export function exportTestCases(testCases: TestCase[], format: ExportFileFormat, baseName = "test-cases") {
  const rows = testCases.map(testCaseToRow);
  const stamp = baseName.replace(/[^a-z0-9-_]+/gi, "-");
  switch (format) {
    case "csv":
      return downloadBlob(rowsToCSV(rows), `${stamp}.csv`, "text/csv");
    case "json":
      return downloadBlob(rowsToJSON(rows), `${stamp}.json`, "application/json");
    case "excel":
      return downloadExcel(rows, `${stamp}.xlsx`);
    case "pdf":
      return downloadPDF(rows, `${stamp}.pdf`, baseName);
  }
}

export function exportReport(report: ReportData, format: ExportFileFormat) {
  const rows: Row[] = report.rows.map((r) => ({
    "Test Case ID": r.displayId,
    Title: r.title,
    Module: r.module,
    Priority: r.priority,
    Status: r.status,
    "Last Result": r.lastResult,
  }));
  const stamp = report.title.replace(/[^a-z0-9-_]+/gi, "-").toLowerCase();
  switch (format) {
    case "csv":
      return downloadBlob(rowsToCSV(rows), `${stamp}.csv`, "text/csv");
    case "json":
      return downloadBlob(rowsToJSON(rows), `${stamp}.json`, "application/json");
    case "excel":
      return downloadExcel(rows, `${stamp}.xlsx`);
    case "pdf":
      return downloadPDF(rows, `${stamp}.pdf`, report.title);
  }
}

// ---------------------------------------------------------------------------
// Import
// ---------------------------------------------------------------------------

export interface ImportRowResult {
  row: number;
  title: string;
  ok: boolean;
  error?: string;
}

function coerce<T extends string>(value: unknown, allowed: readonly T[], fallback: T): T {
  const s = String(value ?? "").trim();
  return (allowed as readonly string[]).includes(s) ? (s as T) : fallback;
}

async function parseFile(file: File): Promise<Record<string, unknown>[]> {
  const name = file.name.toLowerCase();
  if (name.endsWith(".json")) {
    const text = await file.text();
    const parsed = JSON.parse(text);
    return Array.isArray(parsed) ? parsed : [parsed];
  }
  if (name.endsWith(".csv")) {
    const text = await file.text();
    const [headerLine, ...lines] = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
    const headers = splitCsvLine(headerLine);
    return lines.map((line) => {
      const cells = splitCsvLine(line);
      const record: Record<string, unknown> = {};
      headers.forEach((h, i) => (record[h] = cells[i] ?? ""));
      return record;
    });
  }
  // Excel
  const buffer = await file.arrayBuffer();
  const wb = XLSX.read(buffer, { type: "array" });
  const sheet = wb.Sheets[wb.SheetNames[0]];
  return XLSX.utils.sheet_to_json(sheet, { defval: "" });
}

function splitCsvLine(line: string): string[] {
  const cells: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') {
        current += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        current += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      cells.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  cells.push(current);
  return cells;
}

function field(record: Record<string, unknown>, ...keys: string[]): string {
  for (const key of keys) {
    const found = Object.keys(record).find((k) => k.toLowerCase().replace(/[\s_-]/g, "") === key.toLowerCase().replace(/[\s_-]/g, ""));
    if (found && record[found] !== undefined && record[found] !== "") return String(record[found]);
  }
  return "";
}

export async function importTestCasesFromFile(
  file: File,
  projectId: string,
  suiteId: string,
  importedBy: string
): Promise<ImportRowResult[]> {
  const records = await parseFile(file);
  const results: ImportRowResult[] = [];

  for (let i = 0; i < records.length; i++) {
    const record = records[i];
    const title = field(record, "title", "test case", "name");
    if (!title) {
      results.push({ row: i + 2, title: "(untitled)", ok: false, error: "Missing title" });
      continue;
    }
    try {
      const input: NewTestCaseInput = {
        projectId,
        suiteId,
        title,
        description: field(record, "description"),
        objective: field(record, "objective"),
        module: field(record, "module"),
        feature: field(record, "feature"),
        priority: coerce(field(record, "priority"), PRIORITIES, "Medium"),
        severity: coerce(field(record, "severity"), SEVERITIES, "Major"),
        type: coerce(field(record, "type"), TEST_TYPES, "Functional"),
        status: coerce(field(record, "status"), TEST_CASE_STATUSES, "Draft"),
        requirementId: field(record, "requirement id", "requirementid"),
        sprint: field(record, "sprint"),
        releaseVersion: field(record, "release", "release version"),
        environment: field(record, "environment"),
        browser: field(record, "browser"),
        device: field(record, "device"),
        os: field(record, "os"),
        tags: field(record, "tags")
          .split(/[,;]/)
          .map((t) => t.trim())
          .filter(Boolean),
        author: field(record, "author") || importedBy,
        reviewer: field(record, "reviewer"),
        estimatedTimeMinutes: null,
        automationStatus: coerce(field(record, "automation status", "automationstatus"), AUTOMATION_STATUSES, "Not Automated"),
        automationScriptLink: field(record, "automation script link", "script link"),
        preconditions: field(record, "preconditions"),
        testData: field(record, "test data", "testdata"),
        expectedResult: field(record, "expected result", "expectedresult"),
        actualResult: "",
        notes: field(record, "notes"),
      };
      await createTestCase(input, importedBy);
      results.push({ row: i + 2, title, ok: true });
    } catch (err) {
      results.push({ row: i + 2, title, ok: false, error: err instanceof Error ? err.message : "Import failed" });
    }
  }

  return results;
}
