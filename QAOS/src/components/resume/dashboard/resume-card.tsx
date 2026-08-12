"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Star, MoreHorizontal, Copy, Trash2, Download } from "lucide-react";
import { toast } from "sonner";
import { ResumeThumbnail } from "@/components/resume/shared/resume-thumbnail";
import { useResumePhoto } from "@/lib/resume/hooks/use-resume-photo";
import { duplicateResume, deleteResume, toggleResumeFavorite } from "@/lib/resume/repo/resumes-repo";
import { exportResumeAsJSON } from "@/lib/resume/export";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { Resume } from "@/lib/resume/types";

export function ResumeCard({ resume }: { resume: Resume }) {
  const photoUrl = useResumePhoto(resume);

  async function handleDuplicate(e: React.MouseEvent) {
    e.preventDefault();
    const copy = await duplicateResume(resume.id);
    if (copy) toast.success("Resume duplicated");
  }

  async function handleDelete(e: React.MouseEvent) {
    e.preventDefault();
    if (!window.confirm(`Delete "${resume.name}"? This cannot be undone.`)) return;
    await deleteResume(resume.id);
    toast.success("Resume deleted");
  }

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-colors hover:border-primary/40">
      <Link href={`/resume/${resume.id}`} className="flex justify-center border-b border-border bg-muted/40 p-3">
        <ResumeThumbnail resume={resume} photoUrl={photoUrl} />
      </Link>
      <div className="flex items-start justify-between gap-2 p-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{resume.name}</p>
          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className={cn("rounded-full px-1.5 py-0.5 text-[10px] font-medium", resume.isDraft ? "bg-muted" : "bg-success/10 text-success")}>
              {resume.isDraft ? "Draft" : "Saved"}
            </span>
            Edited {formatDistanceToNow(resume.updatedAt, { addSuffix: true })}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-0.5">
          <Button
            variant="ghost"
            size="icon"
            className="size-7"
            aria-label={resume.favorite ? "Remove favorite" : "Add favorite"}
            onClick={(e) => {
              e.preventDefault();
              void toggleResumeFavorite(resume.id);
            }}
          >
            <Star className={cn("size-3.5", resume.favorite && "fill-yellow-400 text-yellow-500")} />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button variant="ghost" size="icon" className="size-7" onClick={(e) => e.preventDefault()}>
                  <MoreHorizontal className="size-3.5" />
                </Button>
              }
            />
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleDuplicate}>
                <Copy className="size-3.5" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.preventDefault();
                  exportResumeAsJSON(resume);
                }}
              >
                <Download className="size-3.5" />
                Export JSON
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive" onClick={handleDelete}>
                <Trash2 className="size-3.5" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
