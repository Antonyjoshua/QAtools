"use client";

import Link from "next/link";
import { useLiveQuery } from "dexie-react-hooks";
import { FileCode2 } from "lucide-react";
import { db as testcasesDb } from "@/lib/testcases/db";
import { StatusBadge as TestCaseStatusBadge } from "@/components/testcases/shared/badges";

export function LinkedTestCaseCard({ testCaseId, displayId }: { testCaseId: string; displayId: string | null }) {
  const testCase = useLiveQuery(() => testcasesDb.testCases.get(testCaseId), [testCaseId]);

  return (
    <div className="rounded-xl border border-border bg-card p-4 text-xs text-muted-foreground">
      <p className="mb-2 flex items-center gap-1.5 font-medium text-foreground">
        <FileCode2 className="size-3.5" />
        Linked test case
      </p>
      {testCase ? (
        <Link href={`/testcases/case/${testCase.id}`} className="flex flex-col items-start gap-1 hover:text-foreground">
          <span className="font-mono text-foreground">{testCase.displayId}</span>
          <span className="line-clamp-2 text-foreground">{testCase.title}</span>
          <TestCaseStatusBadge value={testCase.status} className="mt-1" />
        </Link>
      ) : (
        <p>{displayId ?? "Unknown test case"} (no longer exists)</p>
      )}
    </div>
  );
}
