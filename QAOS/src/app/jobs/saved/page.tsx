"use client";

import * as React from "react";
import Link from "next/link";
import { useLiveQuery } from "dexie-react-hooks";
import { Bookmark, ExternalLink, Trash2 } from "lucide-react";
import { db } from "@/lib/jobs/db";
import { unsaveJob, updateSavedJobStatus } from "@/lib/jobs/repo";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CompanyLogo } from "@/components/jobs/shared/company-logo";
import { RemoteBadge } from "@/components/jobs/shared/badges";
import { formatExperience, formatLocation, formatRelativeTime } from "@/lib/jobs/format";
import type { Job, SavedJob, SavedJobStatus } from "@/lib/jobs/types";

const EMPTY_SAVED_JOBS: SavedJob[] = [];
const EMPTY_JOBS: Job[] = [];

const STATUS_TABS: { id: SavedJobStatus | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "Saved", label: "Saved" },
  { id: "Applied", label: "Applied" },
  { id: "Interview", label: "Interview" },
  { id: "Rejected", label: "Rejected" },
  { id: "Archived", label: "Archived" },
];

export default function SavedJobsPage() {
  const savedJobs = useLiveQuery(() => db.savedJobs.orderBy("savedAt").reverse().toArray(), []) ?? EMPTY_SAVED_JOBS;
  const jobs = useLiveQuery(() => db.jobs.toArray(), []) ?? EMPTY_JOBS;
  const jobById = React.useMemo(() => new Map(jobs.map((j) => [j.id, j])), [jobs]);

  const [tab, setTab] = React.useState<string>("all");

  const counts = React.useMemo(() => {
    const c: Record<string, number> = { all: savedJobs.length };
    for (const s of savedJobs) c[s.status] = (c[s.status] ?? 0) + 1;
    return c;
  }, [savedJobs]);

  const visible = tab === "all" ? savedJobs : savedJobs.filter((s) => s.status === tab);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Saved Jobs</h1>
        <p className="mt-1 text-sm text-muted-foreground">Track jobs you&rsquo;re interested in through your application pipeline.</p>
      </div>

      <Tabs value={tab} onValueChange={(v) => v !== null && setTab(v)}>
        <TabsList>
          {STATUS_TABS.map((t) => (
            <TabsTrigger key={t.id} value={t.id}>
              {t.label} {counts[t.id] ? <span className="ml-1 text-muted-foreground">({counts[t.id]})</span> : null}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={tab} className="mt-4">
          {visible.length === 0 ? (
            <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border py-16 text-center">
              <Bookmark className="size-8 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">No jobs here yet — save a job from the search page to track it.</p>
              <Link href="/jobs">
                <Button variant="outline" size="sm">
                  Browse jobs
                </Button>
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {visible.map((saved) => {
                const job = jobById.get(saved.jobId);
                if (!job) return null;
                return (
                  <div key={saved.id} className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center">
                    <CompanyLogo initials={job.companyLogoInitials} color={job.companyLogoColor} />
                    <div className="min-w-0 flex-1">
                      <Link href={`/jobs/${job.id}`} className="text-sm font-semibold hover:text-primary">
                        {job.title}
                      </Link>
                      <p className="text-xs text-muted-foreground">{job.companyName}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs">
                        <RemoteBadge value={job.remoteStatus} className="text-[10px]" />
                        <span className="text-muted-foreground">{formatLocation(job)}</span>
                        <span className="text-muted-foreground">·</span>
                        <span className="text-muted-foreground">{formatExperience(job)}</span>
                      </div>
                      <p className="mt-1 text-[11px] text-muted-foreground">Saved {formatRelativeTime(saved.savedAt)}</p>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <Select value={saved.status} onValueChange={(v) => v !== null && updateSavedJobStatus(saved.id, v as SavedJobStatus)}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {(["Saved", "Applied", "Interview", "Rejected", "Archived"] as SavedJobStatus[]).map((s) => (
                            <SelectItem key={s} value={s}>
                              {s}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button variant="ghost" size="icon-sm" nativeButton={false} title="Open original listing" render={
                        <a href={job.jobUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="size-3.5" />
                        </a>
                      } />
                      <Button variant="ghost" size="icon-sm" title="Remove" onClick={() => unsaveJob(job.id)}>
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
