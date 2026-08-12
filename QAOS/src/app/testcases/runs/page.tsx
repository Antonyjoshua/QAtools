"use client";

import * as React from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { CalendarDays, Rows3 } from "lucide-react";
import { db } from "@/lib/testcases/db";
import { NewRunDialog } from "@/components/testcases/execution/new-run-dialog";
import { RunList } from "@/components/testcases/execution/run-list";
import { RunCalendar } from "@/components/testcases/execution/calendar-view";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export default function RunsPage() {
  const [view, setView] = React.useState<"list" | "calendar">("list");
  const [projectFilter, setProjectFilter] = React.useState<string>("all");

  const projects = useLiveQuery(() => db.projects.toArray(), []) ?? [];
  const executions = useLiveQuery(() => db.executions.orderBy("createdAt").reverse().toArray(), []) ?? [];

  const filtered = projectFilter === "all" ? executions : executions.filter((e) => e.projectId === projectFilter);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Test Runs</h1>
          <p className="mt-1 text-sm text-muted-foreground">Execute test cases, track progress, and review results.</p>
        </div>
        <NewRunDialog projects={projects} />
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1 rounded-lg border border-border/60 bg-foreground/[0.02] p-0.5">
          <button
            type="button"
            onClick={() => setView("list")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
              view === "list" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Rows3 className="size-3.5" />
            List
          </button>
          <button
            type="button"
            onClick={() => setView("calendar")}
            className={cn(
              "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
              view === "calendar" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <CalendarDays className="size-3.5" />
            Calendar
          </button>
        </div>
        {projects.length > 0 && (
          <Select value={projectFilter} onValueChange={(v) => setProjectFilter(String(v))}>
            <SelectTrigger className="w-48">
              <SelectValue>{(v: string) => (v === "all" || !v ? "All projects" : (projects.find((p) => p.id === v)?.name ?? v))}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All projects</SelectItem>
              {projects.map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {view === "list" ? <RunList executions={filtered} projects={projects} /> : <RunCalendar executions={filtered} />}
    </div>
  );
}
