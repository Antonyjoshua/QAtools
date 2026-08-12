"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useLiveQuery } from "dexie-react-hooks";
import { Plus, Search, X } from "lucide-react";
import { db } from "@/lib/bugs/db";
import { createBug } from "@/lib/bugs/bugs-repo";
import type { BugReport } from "@/lib/bugs/types";
import { SEVERITIES, PRIORITIES, STATUSES } from "@/lib/bugs/types";
import { BugCard } from "@/components/bugs/bug-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function BugsListPage({
  title,
  description,
  emptyMessage,
  filter,
}: {
  title?: string;
  description?: string;
  emptyMessage: string;
  filter: (bug: BugReport) => boolean;
}) {
  const router = useRouter();
  const bugs = useLiveQuery(() => db.bugs.toArray(), []);
  const projects = useLiveQuery(() => db.projects.toArray(), []);
  const modules = useLiveQuery(() => db.modules.toArray(), []);

  const [query, setQuery] = React.useState("");
  const [projectId, setProjectId] = React.useState("all");
  const [moduleId, setModuleId] = React.useState("all");
  const [status, setStatus] = React.useState("all");
  const [severity, setSeverity] = React.useState("all");
  const [priority, setPriority] = React.useState("all");
  const [creating, setCreating] = React.useState(false);

  const filtered = React.useMemo(() => {
    let list = (bugs ?? []).filter(filter);
    const q = query.trim().toLowerCase();
    if (q) list = list.filter((b) => b.title.toLowerCase().includes(q) || b.displayId.toLowerCase().includes(q) || b.descriptionText.toLowerCase().includes(q));
    if (projectId !== "all") list = list.filter((b) => b.projectId === projectId);
    if (moduleId !== "all") list = list.filter((b) => b.moduleId === moduleId);
    if (status !== "all") list = list.filter((b) => b.status === status);
    if (severity !== "all") list = list.filter((b) => b.severity === severity);
    if (priority !== "all") list = list.filter((b) => b.priority === priority);
    return [...list].sort((a, b) => b.updatedAt - a.updatedAt);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bugs, query, projectId, moduleId, status, severity, priority]);

  const modulesForProject = React.useMemo(() => (projectId === "all" ? modules ?? [] : (modules ?? []).filter((m) => m.projectId === projectId)), [modules, projectId]);

  const hasActiveFilters = projectId !== "all" || moduleId !== "all" || status !== "all" || severity !== "all" || priority !== "all";

  function clearFilters() {
    setProjectId("all");
    setModuleId("all");
    setStatus("all");
    setSeverity("all");
    setPriority("all");
  }

  async function handleNewBug() {
    setCreating(true);
    try {
      const bug = await createBug();
      router.push(`/bugs/${bug.id}`);
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          {title && <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>}
          {description && <p className="mt-1 text-muted-foreground">{description}</p>}
        </div>
        <Button onClick={handleNewBug} disabled={creating} className="gap-1.5">
          <Plus className="size-4" />
          New Bug Report
        </Button>
      </div>

      <div className="mb-6 flex flex-col gap-3">
        <div className="relative max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search bug ID, title, description…" className="h-9 pl-9" />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select
            value={projectId}
            onValueChange={(v) => {
              if (!v) return;
              setProjectId(v);
              setModuleId("all");
            }}
          >
            <SelectTrigger className="h-8 w-40 text-xs">
              <SelectValue placeholder="Project" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Projects</SelectItem>
              {(projects ?? []).map((p) => (
                <SelectItem key={p.id} value={p.id}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={moduleId} onValueChange={(v) => v && setModuleId(v)}>
            <SelectTrigger className="h-8 w-36 text-xs">
              <SelectValue placeholder="Module" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Modules</SelectItem>
              {modulesForProject.map((m) => (
                <SelectItem key={m.id} value={m.id}>
                  {m.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={status} onValueChange={(v) => v && setStatus(v)}>
            <SelectTrigger className="h-8 w-32 text-xs">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={severity} onValueChange={(v) => v && setSeverity(v)}>
            <SelectTrigger className="h-8 w-32 text-xs">
              <SelectValue placeholder="Severity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Severities</SelectItem>
              {SEVERITIES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={priority} onValueChange={(v) => v && setPriority(v)}>
            <SelectTrigger className="h-8 w-28 text-xs">
              <SelectValue placeholder="Priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              {PRIORITIES.map((p) => (
                <SelectItem key={p} value={p}>
                  {p}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs" onClick={clearFilters}>
              <X className="size-3" /> Clear filters
            </Button>
          )}
        </div>
      </div>

      <p className="mb-3 text-xs text-muted-foreground">{filtered.length} bug report{filtered.length === 1 ? "" : "s"}</p>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border py-16 text-center">
          <p className="text-muted-foreground">{emptyMessage}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((b) => (
            <BugCard key={b.id} bug={b} />
          ))}
        </div>
      )}
    </div>
  );
}
