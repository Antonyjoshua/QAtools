"use client";

import Link from "next/link";
import { useLiveQuery } from "dexie-react-hooks";
import { Star, FolderTree, ClipboardList } from "lucide-react";
import { db } from "@/lib/testcases/db";
import { toggleProjectFavorite } from "@/lib/testcases/repo/projects-repo";
import { NewProjectDialog } from "@/components/testcases/projects/new-project-dialog";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ProjectsPage() {
  const projects = useLiveQuery(() => db.projects.orderBy("createdAt").reverse().toArray(), []);
  const suiteCounts = useLiveQuery(async () => {
    const suites = await db.suites.toArray();
    const map = new Map<string, number>();
    for (const s of suites) map.set(s.projectId, (map.get(s.projectId) ?? 0) + 1);
    return map;
  }, []);
  const caseCounts = useLiveQuery(async () => {
    const cases = await db.testCases.toArray();
    const map = new Map<string, number>();
    for (const c of cases) map.set(c.projectId, (map.get(c.projectId) ?? 0) + 1);
    return map;
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Projects</h1>
          <p className="mt-1 text-sm text-muted-foreground">Everything in Test Management is organized under a project.</p>
        </div>
        <NewProjectDialog />
      </div>

      {projects?.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
            <FolderTree className="size-8 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">No projects yet — create one to start organizing test cases.</p>
            <NewProjectDialog />
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {(projects ?? []).map((project) => (
            <Link key={project.id} href={`/testcases/projects/${project.id}`} className="group">
              <Card className="h-full transition-colors group-hover:border-primary/40">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <ClipboardList className="size-4.5" />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7"
                      aria-label={project.isFavorite ? "Remove favorite" : "Add favorite"}
                      onClick={(e) => {
                        e.preventDefault();
                        void toggleProjectFavorite(project.id);
                      }}
                    >
                      <Star className={cn("size-4", project.isFavorite && "fill-yellow-400 text-yellow-500")} />
                    </Button>
                  </div>
                  <CardTitle className="mt-2">{project.name}</CardTitle>
                  <CardDescription className="line-clamp-2">{project.description || "No description yet."}</CardDescription>
                </CardHeader>
                <CardContent className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>{suiteCounts?.get(project.id) ?? 0} suites</span>
                  <span>{caseCounts?.get(project.id) ?? 0} test cases</span>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
