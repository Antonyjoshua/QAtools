"use client";

import { Checkbox } from "@/components/ui/checkbox";
import type { Suite, TestCase } from "@/lib/testcases/types";

/** Suite-grouped checkbox picker over a caller-supplied pool of test cases — used both by
 * the Test Plan detail page (pool = every test case in the project) and by NewRunDialog
 * (pool = the selected Test Plan's test cases only). */
export function TestCasePicker({
  testCases,
  suites,
  selectedIds,
  onToggleCase,
  onToggleSuite,
  emptyLabel = "No test cases available.",
}: {
  testCases: TestCase[];
  suites: Suite[];
  selectedIds: Set<string>;
  onToggleCase: (id: string) => void;
  onToggleSuite: (casesInSuite: string[]) => void;
  emptyLabel?: string;
}) {
  const suitesWithCases = suites.filter((suite) => testCases.some((tc) => tc.suiteId === suite.id));

  if (suitesWithCases.length === 0) {
    return <p className="px-1 py-4 text-center text-xs text-muted-foreground">{emptyLabel}</p>;
  }

  return (
    <div className="flex max-h-56 flex-col gap-2 overflow-y-auto rounded-lg border border-border p-2">
      {suitesWithCases.map((suite) => {
        const casesInSuite = testCases.filter((tc) => tc.suiteId === suite.id);
        const allSelected = casesInSuite.every((tc) => selectedIds.has(tc.id));
        return (
          <div key={suite.id} className="flex flex-col gap-1">
            <label className="flex items-center gap-2 rounded px-1.5 py-1 text-sm font-medium hover:bg-accent/50">
              <Checkbox checked={allSelected} onCheckedChange={() => onToggleSuite(casesInSuite.map((c) => c.id))} />
              {suite.name}
              <span className="text-xs font-normal text-muted-foreground">({casesInSuite.length})</span>
            </label>
            <div className="ml-5 flex flex-col gap-0.5">
              {casesInSuite.map((tc) => (
                <label key={tc.id} className="flex items-center gap-2 rounded px-1.5 py-0.5 text-xs hover:bg-accent/50">
                  <Checkbox checked={selectedIds.has(tc.id)} onCheckedChange={() => onToggleCase(tc.id)} />
                  <span className="font-mono text-muted-foreground">{tc.displayId}</span>
                  <span className="truncate">{tc.title}</span>
                </label>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
