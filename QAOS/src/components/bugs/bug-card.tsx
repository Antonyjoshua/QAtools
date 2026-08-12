"use client";

import Link from "next/link";
import { useLiveQuery } from "dexie-react-hooks";
import { formatDistanceToNow } from "date-fns";
import { MoreHorizontal, Copy, Trash2 } from "lucide-react";
import { toast } from "sonner";
import type { BugReport } from "@/lib/bugs/types";
import { db } from "@/lib/bugs/db";
import { duplicateBug, deleteBugForever } from "@/lib/bugs/bugs-repo";
import { excerpt } from "@/lib/bugs/content-utils";
import { SeverityBadge, PriorityBadge, StatusBadge } from "@/components/bugs/status-badges";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function BugCard({ bug }: { bug: BugReport }) {
  const project = useLiveQuery(() => (bug.projectId ? db.projects.get(bug.projectId) : undefined), [bug.projectId]);
  const module_ = useLiveQuery(() => (bug.moduleId ? db.modules.get(bug.moduleId) : undefined), [bug.moduleId]);

  return (
    <div className="group relative flex flex-col gap-2 rounded-xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
      <Link href={`/bugs/${bug.id}`} className="flex flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-2 pr-6">
          <span className="font-mono text-[11px] text-muted-foreground">{bug.displayId}</span>
          <StatusBadge status={bug.status} />
        </div>
        <h3 className="line-clamp-2 font-medium leading-snug tracking-tight">{bug.title || "Untitled"}</h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">{excerpt(bug.descriptionText, 110) || "No description yet"}</p>
        <div className="flex flex-wrap items-center gap-1.5">
          <SeverityBadge severity={bug.severity} />
          <PriorityBadge priority={bug.priority} />
          {module_ && (
            <Badge variant="secondary" className="text-[10px] font-normal">
              {module_.name}
            </Badge>
          )}
        </div>
        <p className="text-[11px] text-muted-foreground">
          {project?.name ?? "No project"} &middot; Updated {formatDistanceToNow(bug.updatedAt, { addSuffix: true })}
        </p>
      </Link>

      <DropdownMenu>
        <DropdownMenuTrigger className="absolute right-3 top-3 inline-flex size-6 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-opacity hover:bg-muted group-hover:opacity-100">
          <MoreHorizontal className="size-3.5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={async () => {
              await duplicateBug(bug.id);
              toast.success("Bug duplicated");
            }}
          >
            <Copy className="size-4" /> Duplicate
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={async () => {
              await deleteBugForever(bug.id);
              toast.success("Bug report deleted");
            }}
          >
            <Trash2 className="size-4" /> Delete forever
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
