"use client";

import * as React from "react";
import Link from "next/link";
import { useLiveQuery } from "dexie-react-hooks";
import { ArrowLeft, Bookmark, BookmarkCheck, Building2, Calendar, Clock, ExternalLink, Globe } from "lucide-react";
import { db } from "@/lib/jobs/db";
import { saveJob, unsaveJob } from "@/lib/jobs/repo";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CompanyLogo } from "@/components/jobs/shared/company-logo";
import { LevelBadge, RemoteBadge, QualityScoreBadge } from "@/components/jobs/shared/badges";
import { EMPLOYMENT_TYPE_LABEL } from "@/lib/jobs/badge-styles";
import { formatExperience, formatLocation, formatRelativeTime, formatSalary } from "@/lib/jobs/format";

export function JobDetailPage({ jobId }: { jobId: string }) {
  const job = useLiveQuery(() => db.jobs.get(jobId), [jobId]);
  const company = useLiveQuery(() => (job ? db.companies.get(job.companyId) : undefined), [job?.companyId]);
  const savedJob = useLiveQuery(() => db.savedJobs.where("jobId").equals(jobId).first(), [jobId]);

  if (!job) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <p className="text-sm text-muted-foreground">Loading — or this job couldn&rsquo;t be found and may have been removed.</p>
        <Link href="/jobs" className="mt-2 inline-flex items-center gap-1.5 text-sm text-primary hover:underline">
          <ArrowLeft className="size-3.5" /> Back to Jobs
        </Link>
      </div>
    );
  }

  const salary = formatSalary(job);

  async function handleToggleSave() {
    if (savedJob) await unsaveJob(job!.id);
    else await saveJob(job!.id);
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <Link href="/jobs" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-3.5" /> Back to Jobs
      </Link>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-6">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-start gap-3">
              <CompanyLogo initials={job.companyLogoInitials} color={job.companyLogoColor} className="size-12 text-base" />
              <div className="min-w-0 flex-1">
                <h1 className="text-xl font-semibold tracking-tight">{job.title}</h1>
                <p className="mt-0.5 text-sm text-muted-foreground">{job.companyName}</p>
              </div>
              <QualityScoreBadge score={job.qualityScore} label={job.qualityLabel} className="hidden shrink-0 sm:inline-flex" />
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-1.5 text-xs">
              <RemoteBadge value={job.remoteStatus} />
              <LevelBadge value={job.level} />
              <Badge variant="outline" className="font-medium">
                {EMPLOYMENT_TYPE_LABEL[job.employmentType]}
              </Badge>
              <span className="text-muted-foreground">{formatLocation(job)}</span>
              <span className="text-muted-foreground">·</span>
              <span className="text-muted-foreground">{formatExperience(job)}</span>
              {salary && (
                <>
                  <span className="text-muted-foreground">·</span>
                  <span className="font-medium text-foreground">{salary}</span>
                </>
              )}
            </div>

            {job.skills.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {job.skills.map((s) => (
                  <Badge key={s} variant="secondary">
                    {s}
                  </Badge>
                ))}
              </div>
            )}

            <div className="mt-5 flex items-center gap-2 border-t border-border pt-4">
              <Button className="flex-1 gap-1.5 sm:flex-none" nativeButton={false} render={
                <a href={job.jobUrl} target="_blank" rel="noopener noreferrer">
                  Apply on Company Website <ExternalLink className="size-3.5" />
                </a>
              } />
              <Button variant="outline" onClick={handleToggleSave} className="gap-1.5">
                {savedJob ? <BookmarkCheck className="size-3.5" /> : <Bookmark className="size-3.5" />}
                {savedJob ? "Saved" : "Save"}
              </Button>
            </div>
          </div>

          <section className="rounded-xl border border-border bg-card p-5">
            <h2 className="mb-2 text-sm font-semibold">Description</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">{job.description}</p>
          </section>

          {job.responsibilities.length > 0 && (
            <section className="rounded-xl border border-border bg-card p-5">
              <h2 className="mb-2 text-sm font-semibold">Responsibilities</h2>
              <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                {job.responsibilities.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </section>
          )}

          {job.requirements.length > 0 && (
            <section className="rounded-xl border border-border bg-card p-5">
              <h2 className="mb-2 text-sm font-semibold">Requirements</h2>
              <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                {job.requirements.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            </section>
          )}

          {job.benefits.length > 0 && (
            <section className="rounded-xl border border-border bg-card p-5">
              <h2 className="mb-2 text-sm font-semibold">Benefits</h2>
              <ul className="list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                {job.benefits.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-xl border border-border bg-card p-4 text-sm">
            <h2 className="mb-3 text-sm font-semibold">Listing details</h2>
            <dl className="flex flex-col gap-2.5 text-xs">
              <div className="flex items-center gap-2">
                <Calendar className="size-3.5 shrink-0 text-muted-foreground" />
                <span className="text-muted-foreground">Posted {formatRelativeTime(job.postedDate)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="size-3.5 shrink-0 text-muted-foreground" />
                <span className="text-muted-foreground">Last checked {formatRelativeTime(job.sourceCheckedAt)}</span>
              </div>
              {job.applicationDeadline && (
                <div className="flex items-center gap-2">
                  <Calendar className="size-3.5 shrink-0 text-muted-foreground" />
                  <span className="text-muted-foreground">Apply by {new Date(job.applicationDeadline).toLocaleDateString()}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Globe className="size-3.5 shrink-0 text-muted-foreground" />
                <a href={job.jobUrl} target="_blank" rel="noopener noreferrer" className="truncate text-primary hover:underline">
                  Original listing
                </a>
              </div>
            </dl>
            <p className="mt-3 border-t border-border pt-3 text-xs text-muted-foreground">Source: {job.sourceName}</p>
            <QualityScoreBadge score={job.qualityScore} label={job.qualityLabel} className="mt-2 sm:hidden" />
          </div>

          {company && (
            <div className="rounded-xl border border-border bg-card p-4 text-sm">
              <h2 className="mb-3 flex items-center gap-1.5 text-sm font-semibold">
                <Building2 className="size-4" /> About {company.name}
              </h2>
              {company.description && <p className="text-xs text-muted-foreground">{company.description}</p>}
              {company.headquarters && <p className="mt-2 text-xs text-muted-foreground">HQ: {company.headquarters}</p>}
              {company.website && (
                <a href={company.website} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 text-xs text-primary hover:underline">
                  Company website <ExternalLink className="size-3" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
