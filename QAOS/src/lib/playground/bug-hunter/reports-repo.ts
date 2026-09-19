import { db } from "./db";
import { uid, displayId } from "@/lib/playground/id";
import { matchAndScore } from "./scoring";
import { awardXp } from "@/lib/playground/gamification/award-xp";
import type { BugReportInput, BugReportSubmission } from "./types";

export async function submitBugReport(input: BugReportInput): Promise<BugReportSubmission> {
  const scoring = await matchAndScore(input);

  const report: BugReportSubmission = {
    ...input,
    id: uid(),
    displayId: displayId("BUG"),
    ...scoring,
    status: "Open",
    submittedAt: new Date().toISOString(),
  };

  await db.bugReports.add(report);

  if (scoring.xpAwarded > 0) {
    const parts: string[] = [];
    if (!scoring.isDuplicate && scoring.matchedBugId) parts.push("bug found");
    if (scoring.severityCorrect) parts.push("correct severity");
    if (scoring.priorityCorrect) parts.push("correct priority");
    await awardXp(scoring.xpAwarded, parts.join(", "));
  }

  return report;
}

export async function closeBugReport(reportId: string): Promise<void> {
  await db.bugReports.update(reportId, { status: "Closed" });
}

export async function reopenBugReport(reportId: string): Promise<void> {
  await db.bugReports.update(reportId, { status: "Open" });
}
