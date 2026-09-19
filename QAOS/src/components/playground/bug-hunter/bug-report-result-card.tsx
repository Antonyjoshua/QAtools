import { CheckCircle2, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { getBugById } from "@/lib/playground/bug-registry/registry";
import type { BugReportSubmission } from "@/lib/playground/bug-hunter/types";

export function BugReportResultCard({ report }: { report: BugReportSubmission }) {
  const matched = report.matchedBugId ? getBugById(report.matchedBugId) : undefined;

  return (
    <div className="rounded-lg border border-border bg-card p-4 text-sm">
      <div className="flex items-center justify-between gap-2">
        <span className="font-medium">
          {report.displayId}: {report.title}
        </span>
        {report.xpAwarded > 0 ? (
          <Badge className="bg-xp text-xp-foreground">+{report.xpAwarded} XP</Badge>
        ) : (
          <Badge variant="outline">+0 XP</Badge>
        )}
      </div>

      {matched ? (
        <div className="mt-2 space-y-1.5">
          <p className="flex flex-wrap items-center gap-1.5 text-status-good">
            <CheckCircle2 className="size-4 shrink-0" />
            {report.isDuplicate ? "Matches a bug you already reported:" : "Matched a known issue:"}
            <span className="font-medium text-foreground">{matched.title}</span>
          </p>
          <p className="text-muted-foreground">Match confidence: {report.matchScore}%</p>
          <div className="flex flex-wrap gap-3 text-xs">
            <span className={report.severityCorrect ? "text-status-good" : "text-status-critical"}>
              Severity {report.severityCorrect ? "correct" : `should be ${matched.severity}`}
            </span>
            <span className={report.priorityCorrect ? "text-status-good" : "text-status-critical"}>
              Priority {report.priorityCorrect ? "correct" : `should be ${matched.priority}`}
            </span>
            <span className="text-muted-foreground">Report completeness: {report.qualityPercent}%</span>
          </div>
        </div>
      ) : (
        <p className="mt-2 flex items-center gap-1.5 text-muted-foreground">
          <XCircle className="size-4" />
          No matching known issue found — check your steps and try again.
        </p>
      )}
    </div>
  );
}
