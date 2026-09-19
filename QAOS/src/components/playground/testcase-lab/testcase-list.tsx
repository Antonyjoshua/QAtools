"use client";

import { Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { deleteTestCase } from "@/lib/playground/testcase-lab/testcases-repo";
import type { TestCase } from "@/lib/playground/testcase-lab/types";

export function TestCaseList({ testCases }: { testCases: TestCase[] }) {
  if (testCases.length === 0) {
    return <p className="text-sm text-muted-foreground">No test cases written yet.</p>;
  }

  return (
    <div className="space-y-2">
      {testCases.map((tc) => (
        <div key={tc.id} className="rounded-lg border border-border bg-card p-3 text-sm">
          <div className="flex items-center justify-between gap-2">
            <span className="font-medium">
              {tc.displayId}: {tc.scenario}
            </span>
            <div className="flex items-center gap-1.5">
              <Badge variant="secondary">{tc.type}</Badge>
              <Badge variant="outline">{tc.priority}</Badge>
              <Button
                size="icon-sm"
                variant="ghost"
                aria-label="Delete test case"
                onClick={() => deleteTestCase(tc.id)}
              >
                <Trash2 className="size-3.5" />
              </Button>
            </div>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Steps: {tc.steps}</p>
          <p className="text-xs text-muted-foreground">Expected: {tc.expectedResult}</p>
        </div>
      ))}
    </div>
  );
}
