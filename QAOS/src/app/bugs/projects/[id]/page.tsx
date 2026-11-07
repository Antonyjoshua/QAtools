"use client";

import { useParams } from "next/navigation";
import { useLiveQuery } from "dexie-react-hooks";
import { Star, Building2, GitBranch } from "lucide-react";
import { db } from "@/lib/bugs/db";
import { db as testcasesDb } from "@/lib/testcases/db";
import { BugsListPage } from "@/components/bugs/bugs-list-page";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export default function ProjectPage() {
  const params = useParams<{ id: string }>();
  const projectId = params.id;
  const project = useLiveQuery(() => db.projects.get(projectId), [projectId]);
  const moduleCount = useLiveQuery(() => db.modules.where("projectId").equals(projectId).count(), [projectId]);
  const testProjects = useLiveQuery(() => testcasesDb.projects.toArray(), []) ?? [];

  if (!project) return null;

  return (
    <div>
      <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        <div className="mb-4 flex items-center gap-3">
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

        <div className="mb-6 flex flex-col gap-1.5 sm:max-w-xs">
          <Label className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <GitBranch className="size-3.5" />
            Linked Test Management project
          </Label>
          <Select
            value={project.linkedTestProjectId ?? "none"}
            onValueChange={(v) => v && db.projects.update(project.id, { linkedTestProjectId: v === "none" ? null : v })}
          >
            <SelectTrigger className="h-8 w-full">
              <SelectValue>{(v: string) => (v === "none" ? "Not linked" : (testProjects.find((p) => p.id === v)?.name ?? v))}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Not linked</SelectItem>
              {testProjects.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Bugs in this project default their &ldquo;link a test case / requirement&rdquo; search to this Test Management project.
          </p>
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
