"use client";

import { use, useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { getMissionById } from "@/lib/playground/bug-hunter/missions-seed";
import { MissionTimer } from "@/components/playground/bug-hunter/mission-timer";
import { EnvironmentPanel } from "@/components/playground/bug-hunter/environment-panel";
import { TestDataPanel } from "@/components/playground/bug-hunter/test-data-panel";
import { RequirementsPanel } from "@/components/playground/bug-hunter/requirements-panel";
import { BugReportForm } from "@/components/playground/bug-hunter/bug-report-form";
import { BugReportResultCard } from "@/components/playground/bug-hunter/bug-report-result-card";
import { useBugReportsForMission } from "@/lib/playground/bug-hunter/hooks/use-bug-reports";
import { Button } from "@/components/ui/button";
import type { BugReportSubmission } from "@/lib/playground/bug-hunter/types";

export default function MissionWorkspacePage({ params }: { params: Promise<{ missionId: string }> }) {
  const { missionId } = use(params);
  const mission = getMissionById(missionId);
  const reports = useBugReportsForMission(missionId);
  const [latest, setLatest] = useState<BugReportSubmission | null>(null);

  if (!mission) return notFound();

  const foundCount = new Set(
    reports.filter((r) => r.matchedBugId && !r.isDuplicate).map((r) => r.matchedBugId)
  ).size;

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-xl font-bold">{mission.title}</h1>
          <p className="text-sm text-muted-foreground">
            {foundCount} / {mission.targetBugIds.length} target-area bugs found · {reports.length} report
            {reports.length === 1 ? "" : "s"} submitted
          </p>
        </div>
        <div className="flex items-center gap-3">
          <MissionTimer minutes={mission.timeLimitMinutes} />
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            render={
              <Link href="/playground/shop" target="_blank">
                <ExternalLink className="size-3.5" /> Open Brightbasket
              </Link>
            }
          />
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        <RequirementsPanel mission={mission} />
        <EnvironmentPanel mission={mission} />
        <TestDataPanel mission={mission} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-4">
          <h2 className="mb-3 font-semibold">Report Bug</h2>
          <BugReportForm
            missionId={mission.id}
            defaultEnvironment={mission.environment}
            onSubmitted={setLatest}
          />
        </div>
        <div className="space-y-3">
          <h2 className="font-semibold">Your Reports</h2>
          {latest && <BugReportResultCard report={latest} />}
          {reports
            .filter((r) => r.id !== latest?.id)
            .map((r) => (
              <BugReportResultCard key={r.id} report={r} />
            ))}
          {reports.length === 0 && (
            <p className="text-sm text-muted-foreground">No bugs reported yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
