"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, MinusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { setResultStatus, linkBugReport } from "@/lib/playground/execution/execution-repo";
import { closeBugReport, reopenBugReport } from "@/lib/playground/bug-hunter/reports-repo";
import { BugReportForm } from "@/components/playground/bug-hunter/bug-report-form";
import type { ExecutionResult, ExecutionResultStatus } from "@/lib/playground/execution/types";
import type { TestCase } from "@/lib/playground/testcase-lab/types";
import type { ShopModule } from "@/lib/playground/bug-registry/types";

const STATUS_STYLE: Record<ExecutionResultStatus, string> = {
  Pending: "text-muted-foreground",
  Pass: "text-status-good",
  Fail: "text-status-critical",
  Blocked: "text-status-warning",
};

interface Props {
  result: ExecutionResult;
  testCase: TestCase;
  module: ShopModule;
  requirementId: string;
}

export function TestCaseRunRow({ result, testCase, module: shopModule, requirementId }: Props) {
  const [notes, setNotes] = useState(result.notes);
  const [showBugForm, setShowBugForm] = useState(false);

  async function setStatus(status: ExecutionResultStatus) {
    await setResultStatus(result.id, status, notes);
    if (status === "Pass" && result.linkedBugReportId) {
      await closeBugReport(result.linkedBugReportId);
    }
    if (status === "Fail") {
      if (result.linkedBugReportId) {
        await reopenBugReport(result.linkedBugReportId);
      } else {
        setShowBugForm(true);
      }
    }
  }

  return (
    <div className="rounded-lg border border-border bg-card p-3 text-sm">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-medium">
            {testCase.displayId}: {testCase.scenario}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">Expected: {testCase.expectedResult}</p>
        </div>
        <span className={`shrink-0 text-xs font-semibold ${STATUS_STYLE[result.status]}`}>
          {result.status}
        </span>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <Button size="sm" variant="outline" onClick={() => setStatus("Pass")}>
          <CheckCircle2 className="size-3.5" /> Pass
        </Button>
        <Button size="sm" variant="outline" onClick={() => setStatus("Fail")}>
          <XCircle className="size-3.5" /> Fail
        </Button>
        <Button size="sm" variant="outline" onClick={() => setStatus("Blocked")}>
          <MinusCircle className="size-3.5" /> Blocked
        </Button>
        {result.linkedBugReportId && <Badge variant="secondary">Linked bug reported</Badge>}
      </div>
      <Textarea
        className="mt-2"
        placeholder="Execution notes…"
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        onBlur={() => setResultStatus(result.id, result.status, notes)}
      />
      {showBugForm && (
        <div className="mt-3 border-t border-border pt-3">
          <p className="mb-2 text-xs font-medium text-muted-foreground">
            This failure needs a bug report:
          </p>
          <BugReportForm
            missionId={`execution:${requirementId}`}
            defaultValues={{
              title: testCase.scenario,
              module: shopModule,
              expectedResult: testCase.expectedResult,
            }}
            linkedTestCaseId={testCase.id}
            linkedExecutionResultId={result.id}
            onSubmitted={async (report) => {
              await linkBugReport(result.id, report.id);
              setShowBugForm(false);
            }}
          />
        </div>
      )}
    </div>
  );
}
