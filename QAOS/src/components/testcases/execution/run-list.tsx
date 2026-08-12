"use client";

import { ClipboardList } from "lucide-react";
import { RunCard } from "./run-card";
import { Card, CardContent } from "@/components/ui/card";
import type { Execution, Project } from "@/lib/testcases/types";

export function RunList({ executions, projects }: { executions: Execution[]; projects: Project[] }) {
  if (executions.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center gap-3 py-14 text-center">
          <ClipboardList className="size-8 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">No test runs yet — create one to start executing.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {executions.map((execution) => (
        <RunCard key={execution.id} execution={execution} projectName={projects.find((p) => p.id === execution.projectId)?.name} />
      ))}
    </div>
  );
}
