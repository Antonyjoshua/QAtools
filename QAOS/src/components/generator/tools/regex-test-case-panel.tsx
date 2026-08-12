"use client";

import * as React from "react";
import { toast } from "sonner";
import { Copy, Download, FlaskConical, Play, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { RegexToken } from "@/lib/generator/tools/regex-engine";
import {
  type TestCase,
  type TestResult,
  computeQAChecklist,
  exportTestCasesCSV,
  generateTestCases,
  runPattern,
} from "@/lib/generator/tools/regex-testcases";
import { cn } from "@/lib/utils";

function downloadText(content: string, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function RegexTestCasePanel({ pattern, flags, tokens }: { pattern: string; flags: string; tokens: RegexToken[] }) {
  const [cases, setCases] = React.useState<TestCase[]>([]);

  const actuals = React.useMemo(() => {
    const map: Record<string, TestResult> = {};
    for (const c of cases) map[c.id] = runPattern(pattern, flags, c.data);
    return map;
  }, [cases, pattern, flags]);

  const checklist = React.useMemo(() => computeQAChecklist(cases), [cases]);

  const summary = React.useMemo(() => {
    const positive = cases.filter((c) => c.category === "positive").length;
    const negative = cases.filter((c) => c.category === "negative").length;
    let passed = 0;
    let failed = 0;
    for (const c of cases) {
      if (actuals[c.id] === c.expected) passed++;
      else failed++;
    }
    const coverage = cases.length > 0 ? Math.round((passed / cases.length) * 100) : 0;
    return { positive, negative, passed, failed, coverage };
  }, [cases, actuals]);

  function handleGenerate() {
    if (!pattern.trim()) {
      toast.error("Enter a pattern first");
      return;
    }
    setCases(generateTestCases(pattern, flags, tokens));
  }

  function handleDataChange(id: string, data: string) {
    setCases((prev) => prev.map((c) => (c.id === id ? { ...c, data } : c)));
  }

  function handleDelete(id: string) {
    setCases((prev) => prev.filter((c) => c.id !== id));
  }

  function handleAddRow() {
    const id = `TC-${String(cases.length + 1).padStart(2, "0")}`;
    setCases((prev) => [...prev, { id, data: "", expected: "Match", category: "positive" }]);
  }

  function handleRunAll() {
    const p = cases.filter((c) => runPattern(pattern, flags, c.data) === c.expected).length;
    toast.success(`Ran ${cases.length} test case${cases.length === 1 ? "" : "s"} — ${p} passed, ${cases.length - p} failed`);
  }

  function handleCopyTestCases() {
    const text = cases
      .map((c) => `${c.id} [${c.category}] ${JSON.stringify(c.data)} — Expected: ${c.expected}, Actual: ${actuals[c.id]}, Status: ${actuals[c.id] === c.expected ? "PASS" : "FAIL"}`)
      .join("\n");
    navigator.clipboard.writeText(text);
    toast.success("Copied test cases");
  }

  function handleExport() {
    downloadText(exportTestCasesCSV(cases, actuals), "regex-test-cases.csv", "text/csv;charset=utf-8");
    toast.success("Exported regex-test-cases.csv");
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Label className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <FlaskConical className="size-3.5" /> QA Test Cases
        </Label>
        <div className="flex flex-wrap gap-1.5">
          <Button size="sm" onClick={handleGenerate}>
            Generate Test Cases
          </Button>
          {cases.length > 0 && (
            <>
              <Button size="sm" variant="outline" className="gap-1.5" onClick={handleRunAll}>
                <Play className="size-3.5" /> Run All Tests
              </Button>
              <Button size="sm" variant="outline" className="gap-1.5" onClick={handleAddRow}>
                <Plus className="size-3.5" /> Add Test Case
              </Button>
              <Button size="sm" variant="ghost" className="gap-1.5" onClick={handleCopyTestCases}>
                <Copy className="size-3.5" /> Copy
              </Button>
              <Button size="sm" variant="ghost" className="gap-1.5" onClick={handleExport}>
                <Download className="size-3.5" /> Export CSV
              </Button>
            </>
          )}
        </div>
      </div>

      {cases.length === 0 ? (
        <p className="rounded-lg border border-dashed border-border p-4 text-center text-sm text-muted-foreground">
          Click <strong className="font-medium text-foreground">Generate Test Cases</strong> to create positive, negative, and boundary test cases
          derived from your pattern above.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            {[
              { label: "Positive Cases", value: summary.positive },
              { label: "Negative Cases", value: summary.negative },
              { label: "Passed", value: summary.passed, tone: "text-status-good" },
              { label: "Failed", value: summary.failed, tone: summary.failed > 0 ? "text-status-critical" : undefined },
              { label: "Coverage", value: `${summary.coverage}%` },
            ].map((s) => (
              <div key={s.label} className="rounded-lg border border-border bg-card p-3">
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className={cn("mt-1 text-xl font-semibold tabular-nums", s.tone)}>{s.value}</p>
              </div>
            ))}
          </div>

          {/* Table on sm+ screens; a stacked card list replaces it below the sm breakpoint, since 6 columns of test data don't fit a phone width. */}
          <div className="hidden rounded-lg border border-border sm:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Test Data</TableHead>
                  <TableHead>Expected</TableHead>
                  <TableHead>Actual</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-8" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {cases.map((c) => {
                  const actual = actuals[c.id];
                  const status = actual === c.expected ? "PASS" : "FAIL";
                  return (
                    <TableRow key={c.id}>
                      <TableCell className="font-mono text-xs text-muted-foreground">{c.id}</TableCell>
                      <TableCell className="min-w-48">
                        <Input value={c.data} onChange={(e) => handleDataChange(c.id, e.target.value)} className="h-7 font-mono text-xs" />
                      </TableCell>
                      <TableCell className="text-xs">{c.expected}</TableCell>
                      <TableCell className="text-xs">{actual}</TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={cn(
                            "text-[10px]",
                            status === "PASS" ? "bg-status-good/15 text-status-good ring-1 ring-status-good/30" : "bg-status-critical/15 text-status-critical ring-1 ring-status-critical/30"
                          )}
                        >
                          {status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon-xs" onClick={() => handleDelete(c.id)} title="Delete row">
                          <Trash2 className="size-3.5" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col gap-2 sm:hidden">
            {cases.map((c) => {
              const actual = actuals[c.id];
              const status = actual === c.expected ? "PASS" : "FAIL";
              return (
                <div key={c.id} className="flex flex-col gap-2 rounded-lg border border-border bg-card p-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs text-muted-foreground">{c.id}</span>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="secondary"
                        className={cn(
                          "text-[10px]",
                          status === "PASS" ? "bg-status-good/15 text-status-good ring-1 ring-status-good/30" : "bg-status-critical/15 text-status-critical ring-1 ring-status-critical/30"
                        )}
                      >
                        {status}
                      </Badge>
                      <Button variant="ghost" size="icon-xs" onClick={() => handleDelete(c.id)} title="Delete row">
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                  <Input value={c.data} onChange={(e) => handleDataChange(c.id, e.target.value)} className="h-8 font-mono text-xs" />
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span>Expected: {c.expected}</span>
                    <span>Actual: {actual}</span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col gap-1.5 rounded-lg border border-border bg-card p-3">
            <Label className="text-xs text-muted-foreground">QA Checklist</Label>
            <ul className="grid grid-cols-1 gap-1 text-xs sm:grid-cols-2">
              {checklist.map((item) => (
                <li key={item.label} className={cn("flex items-center gap-1.5", item.done ? "text-foreground" : "text-muted-foreground")}>
                  <span className={item.done ? "text-status-good" : "text-muted-foreground"}>{item.done ? "✓" : "✗"}</span>
                  {item.label}
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
}
