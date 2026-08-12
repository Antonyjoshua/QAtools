"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useLiveQuery } from "dexie-react-hooks";
import { Plus } from "lucide-react";
import { db } from "@/lib/testcases/db";
import { createExecution } from "@/lib/testcases/repo/execution-repo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import type { Project, Suite, TestCase } from "@/lib/testcases/types";

export function NewRunDialog({ projects, defaultProjectId }: { projects: Project[]; defaultProjectId?: string }) {
  const [open, setOpen] = React.useState(false);
  const [projectId, setProjectId] = React.useState(defaultProjectId ?? "");
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [environment, setEnvironment] = React.useState("");
  const [build, setBuild] = React.useState("");
  const [scheduledFor, setScheduledFor] = React.useState("");
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const [busy, setBusy] = React.useState(false);
  const router = useRouter();

  const suites =
    useLiveQuery(() => (projectId ? db.suites.where("projectId").equals(projectId).toArray() : Promise.resolve<Suite[]>([])), [projectId]) ?? [];
  const testCases =
    useLiveQuery(() => (projectId ? db.testCases.where("projectId").equals(projectId).toArray() : Promise.resolve<TestCase[]>([])), [projectId]) ??
    [];

  function toggleCase(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleSuite(casesInSuite: string[]) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      const allSelected = casesInSuite.every((id) => next.has(id));
      for (const id of casesInSuite) {
        if (allSelected) next.delete(id);
        else next.add(id);
      }
      return next;
    });
  }

  function reset() {
    setName("");
    setDescription("");
    setEnvironment("");
    setBuild("");
    setScheduledFor("");
    setSelectedIds(new Set());
  }

  async function handleCreate() {
    if (!name.trim() || !projectId || selectedIds.size === 0) return;
    setBusy(true);
    try {
      const execution = await createExecution({
        projectId,
        name: name.trim(),
        description: description.trim(),
        environment: environment.trim(),
        build: build.trim(),
        testCaseIds: Array.from(selectedIds),
        scheduledFor: scheduledFor ? new Date(scheduledFor).getTime() : null,
      });
      setOpen(false);
      reset();
      router.push(`/testcases/runs/${execution.id}`);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (v && !projectId && defaultProjectId) setProjectId(defaultProjectId);
        if (!v) reset();
      }}
    >
      <Button size="sm" className="gap-1.5" onClick={() => setOpen(true)}>
        <Plus className="size-4" />
        New Run
      </Button>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>New test run</DialogTitle>
        </DialogHeader>
        <div className="flex max-h-[70vh] flex-col gap-3 overflow-y-auto py-2 pr-1">
          <div className="flex flex-col gap-1.5">
            <Label>Project</Label>
            <Select
              value={projectId}
              onValueChange={(v) => {
                setProjectId(String(v));
                setSelectedIds(new Set());
              }}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a project">
                  {(v: string) => projects.find((p) => p.id === v)?.name ?? "Choose a project"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {projects.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="run-name">Name</Label>
            <Input id="run-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Regression Sprint 15" autoFocus />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="run-description">Description</Label>
            <Textarea id="run-description" value={description} onChange={(e) => setDescription(e.target.value)} rows={2} />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="run-env">Environment</Label>
              <Input id="run-env" value={environment} onChange={(e) => setEnvironment(e.target.value)} placeholder="Staging" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="run-build">Build</Label>
              <Input id="run-build" value={build} onChange={(e) => setBuild(e.target.value)} placeholder="v2.4.0" />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="run-scheduled">Scheduled</Label>
              <Input id="run-scheduled" type="date" value={scheduledFor} onChange={(e) => setScheduledFor(e.target.value)} />
            </div>
          </div>

          {projectId && (
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <Label>Test cases</Label>
                <span className="text-xs text-muted-foreground">{selectedIds.size} selected</span>
              </div>
              <div className="flex max-h-56 flex-col gap-2 overflow-y-auto rounded-lg border border-border p-2">
                {suites.length === 0 && <p className="px-1 py-4 text-center text-xs text-muted-foreground">No suites in this project yet.</p>}
                {suites.map((suite) => {
                  const casesInSuite = testCases.filter((tc) => tc.suiteId === suite.id);
                  if (casesInSuite.length === 0) return null;
                  const allSelected = casesInSuite.every((tc) => selectedIds.has(tc.id));
                  return (
                    <div key={suite.id} className="flex flex-col gap-1">
                      <label className="flex items-center gap-2 rounded px-1.5 py-1 text-sm font-medium hover:bg-accent/50">
                        <Checkbox checked={allSelected} onCheckedChange={() => toggleSuite(casesInSuite.map((c) => c.id))} />
                        {suite.name}
                        <span className="text-xs font-normal text-muted-foreground">({casesInSuite.length})</span>
                      </label>
                      <div className="ml-5 flex flex-col gap-0.5">
                        {casesInSuite.map((tc) => (
                          <label key={tc.id} className="flex items-center gap-2 rounded px-1.5 py-0.5 text-xs hover:bg-accent/50">
                            <Checkbox checked={selectedIds.has(tc.id)} onCheckedChange={() => toggleCase(tc.id)} />
                            <span className="font-mono text-muted-foreground">{tc.displayId}</span>
                            <span className="truncate">{tc.title}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!name.trim() || !projectId || selectedIds.size === 0 || busy}>
            Create run
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
