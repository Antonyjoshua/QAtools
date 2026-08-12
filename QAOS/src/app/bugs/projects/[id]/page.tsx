"use client";

import { useParams } from "next/navigation";
import { useLiveQuery } from "dexie-react-hooks";
import { Star, Building2 } from "lucide-react";
import { db } from "@/lib/bugs/db";
import { BugsListPage } from "@/components/bugs/bugs-list-page";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ProjectPage() {
  const params = useParams<{ id: string }>();
  const projectId = params.id;
  const project = useLiveQuery(() => db.projects.get(projectId), [projectId]);
  const moduleCount = useLiveQuery(() => db.modules.where("projectId").equals(projectId).count(), [projectId]);

  if (!project) return null;

  return (
    <div>
      <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        <div className="mb-2 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-accent text-accent-foreground">
            <Building2 className="size-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-semibold tracking-tight">{project.name}</h1>
            <p className="text-sm text-muted-foreground">{project.description || `${moduleCount ?? 0} modules`}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5"
            onClick={() => db.projects.update(project.id, { isFavorite: !project.isFavorite })}
          >
            <Star className={cn("size-3.5", project.isFavorite && "fill-current text-warning")} />
            {project.isFavorite ? "Favorited" : "Favorite"}
          </Button>
        </div>
      </div>
      <BugsListPage
        title=""
        description=""
        emptyMessage="No bug reports for this project yet."
        filter={(b) => b.projectId === projectId}
      />
    </div>
  );
}
