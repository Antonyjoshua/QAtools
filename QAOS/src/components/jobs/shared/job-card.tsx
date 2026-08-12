"use client";

import Link from "next/link";
import { Bookmark, BookmarkCheck, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CompanyLogo } from "./company-logo";
import { RemoteBadge } from "./badges";
import type { Job } from "@/lib/jobs/types";
import { formatExperience, formatLocation, formatRelativeTime, formatSalary } from "@/lib/jobs/format";

export function JobCard({ job, isSaved, onToggleSave, className }: { job: Job; isSaved: boolean; onToggleSave: () => void; className?: string }) {
  const salary = formatSalary(job);

  return (
    <div className={cn("flex flex-col gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40", className)}>
      <div className="flex items-start gap-3">
        <CompanyLogo initials={job.companyLogoInitials} color={job.companyLogoColor} className="mt-0.5" />
        <div className="min-w-0 flex-1">
          <Link href={`/jobs/${job.id}`} className="line-clamp-2 text-sm font-semibold hover:text-primary">
            {job.title}
          </Link>
          <p className="mt-0.5 truncate text-sm text-muted-foreground">{job.companyName}</p>
        </div>
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onToggleSave}
          title={isSaved ? "Remove from saved" : "Save job"}
          className={cn(isSaved && "text-primary")}
        >
          {isSaved ? <BookmarkCheck className="size-4" /> : <Bookmark className="size-4" />}
        </Button>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 text-xs">
        <RemoteBadge value={job.remoteStatus} />
        <span className="text-muted-foreground">{formatLocation(job)}</span>
        <span className="text-muted-foreground">·</span>
        <span className="text-muted-foreground">{formatExperience(job)}</span>
      </div>

      {job.skills.length > 0 && (
        <p className="text-xs text-muted-foreground">{job.skills.slice(0, 5).join(" • ")}</p>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
        <span>
          {salary && <span className="font-medium text-foreground">{salary} · </span>}
          Posted {formatRelativeTime(job.postedDate)}
        </span>
        <span className="truncate">Source: {job.sourceName}</span>
      </div>

      <div className="flex items-center gap-2 border-t border-border pt-3">
        <Button variant="outline" size="sm" onClick={onToggleSave} className="gap-1.5">
          {isSaved ? <BookmarkCheck className="size-3.5" /> : <Bookmark className="size-3.5" />}
          {isSaved ? "Saved" : "Save"}
        </Button>
        <Button size="sm" className="flex-1 gap-1.5" nativeButton={false} render={
          <a href={job.jobUrl} target="_blank" rel="noopener noreferrer">
            Apply <ExternalLink className="size-3.5" />
          </a>
        } />
      </div>
    </div>
  );
}
