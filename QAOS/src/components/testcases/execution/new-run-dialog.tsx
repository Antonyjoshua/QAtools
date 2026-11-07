"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLiveQuery } from "dexie-react-hooks";
import { Plus } from "lucide-react";
import { db } from "@/lib/testcases/db";
import { createExecution } from "@/lib/testcases/repo/execution-repo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { TestCasePicker } from "@/components/testcases/plans/test-case-picker";
import type { Project, Suite, TestCase, TestPlan } from "@/lib/testcases/types";

const EMPTY_TEST_PLANS: TestPlan[] = [];
const EMPTY_SUITES: Suite[] = [];
const EMPTY_TEST_CASES: TestCase[] = [];

export function NewRunDialog({
  projects,
  defaultProjectId,
  defaultTestPlanId,
}: {
  projects: Project[];
  defaultProjectId?: string;
  defaultTestPlanId?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [projectId, setProjectId] = React.useState(defaultProjectId ?? "");
  const [testPlanId, setTestPlanId] = React.useState(defaultTestPlanId ?? "");
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [environment, setEnvironment] = React.useState("");
  const [build, setBuild] = React.useState("");
  const [scheduledFor, setScheduledFor] = React.useState("");
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const [busy, setBusy] = React.useState(false);
  const router = useRouter();
  const planLocked = Boolean(defaultTestPlanId);

  const testPlans =
    useLiveQuery(() => (projectId ? db.testPlans.where("projectId").equals(projectId).toArray() : Promise.resolve<TestPlan[]>([])), [projectId]) ??
    EMPTY_TEST_PLANS;
  const suites =
    useLiveQuery(() => (projectId ? db.suites.where("projectId").equals(projectId).toArray() : Promise.resolve<Suite[]>([])), [projectId]) ?? EMPTY_SUITES;
  const allTestCases =
    useLiveQuery(() => (projectId ? db.testCases.where("projectId").equals(projectId).toArray() : Promise.resolve<TestCase[]>([])), [projectId]) ??
    EMPTY_TEST_CASES;

  const plan = testPlans.find((p) => p.id === testPlanId);
  const planCaseIds = React.useMemo(() => new Set(plan?.testCaseIds ?? []), [plan]);
  const testCases = React.useMemo(() => allTestCases.filter((tc) => planCaseIds.has(tc.id)), [allTestCases, planCaseIds]);

  // Default to every test case in the plan being selected once the plan is known.
  // Depending on plan?.id (not just testPlanId) matters when the dialog opens
  // pre-locked to a plan: testPlanId is already set at mount, but the live-query
  // lookup of `plan` itself resolves a tick later — without this, the effect
  // fires once while `plan` is still undefined and never re-fires once it loads.
  React.useEffect(() => {
    if (plan) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reset the selection whenever the chosen plan changes (or first resolves)
      setSelectedIds(new Set(plan.testCaseIds));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [testPlanId, plan?.id]);

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
    if (!planLocked) setTestPlanId("");
  }

  async function handleCreate() {
    if (!name.trim() || !projectId || !testPlanId || selectedIds.size === 0) return;
    setBusy(true);
    try {
      const execution = await createExecution({
        projectId,
        testPlanId,
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
        if (v) {
          if (!projectId && defaultProjectId) setProjectId(defaultProjectId);
          if (!testPlanId && defaultTestPlanId) setTestPlanId(defaultTestPlanId);
        }
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
              disabled={planLocked}
              onValueChange={(v) => {
                setProjectId(String(v));
                setTestPlanId("");
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

          {projectId && (
            <div className="flex flex-col gap-1.5">
              <Label>Test Plan</Label>
              <Select value={testPlanId} disabled={planLocked} onValueChange={(v) => setTestPlanId(String(v))}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a test plan">{(v: string) => testPlans.find((p) => p.id === v)?.name ?? "Choose a test plan"}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {testPlans.map((p) => (
                    <SelectItem key={p.id} value={p.id}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {testPlans.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  No test plans in this project yet —{" "}
                  <Link href="/testcases/plans" target="_blank" className="underline hover:text-foreground">
                    create one
                  </Link>{" "}
                  (opens in a new tab, so this form isn&rsquo;t lost — it&rsquo;ll show up here once created).
                </p>
              )}
            </div>
          )}

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

          {testPlanId && (
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <Label>Test cases</Label>
                <span className="text-xs text-muted-foreground">{selectedIds.size} selected</span>
              </div>
              <TestCasePicker
                testCases={testCases}
                suites={suites}
                selectedIds={selectedIds}
                onToggleCase={toggleCase}
                onToggleSuite={toggleSuite}
                emptyLabel="This test plan has no test cases yet — add some from the plan's page first."
              />
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!name.trim() || !projectId || !testPlanId || selectedIds.size === 0 || busy}>
            Create run
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
