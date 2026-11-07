"use client";

import * as React from "react";
import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLiveQuery } from "dexie-react-hooks";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { db } from "@/lib/testcases/db";
import { deleteTestPlan, countPlanExecutions, setPlanTestCases } from "@/lib/testcases/repo/test-plans-repo";
import { NewTestPlanDialog } from "@/components/testcases/plans/new-test-plan-dialog";
import { TestCasePicker } from "@/components/testcases/plans/test-case-picker";
import { RunList } from "@/components/testcases/execution/run-list";
import { NewRunDialog } from "@/components/testcases/execution/new-run-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Suite, TestCase, Execution } from "@/lib/testcases/types";

const EMPTY_SUITES: Suite[] = [];
const EMPTY_TEST_CASES: TestCase[] = [];
const EMPTY_EXECUTIONS: Execution[] = [];

export default function TestPlanDetailPage({ params }: { params: Promise<{ planId: string }> }) {
  const { planId } = use(params);
  const router = useRouter();
  const [editOpen, setEditOpen] = React.useState(false);

  const plan = useLiveQuery(() => db.testPlans.get(planId), [planId]);
  const project = useLiveQuery(() => (plan ? db.projects.get(plan.projectId) : undefined), [plan?.projectId]);
  const suites = useLiveQuery(() => (plan ? db.suites.where("projectId").equals(plan.projectId).toArray() : Promise.resolve(EMPTY_SUITES)), [plan?.projectId]) ?? EMPTY_SUITES;
  const testCases =
    useLiveQuery(() => (plan ? db.testCases.where("projectId").equals(plan.projectId).toArray() : Promise.resolve(EMPTY_TEST_CASES)), [plan?.projectId]) ?? EMPTY_TEST_CASES;
  const executions =
    useLiveQuery(() => db.executions.where("testPlanId").equals(planId).toArray(), [planId]) ?? EMPTY_EXECUTIONS;

  const selectedIds = React.useMemo(() => new Set(plan?.testCaseIds ?? []), [plan]);

  async function toggleCase(id: string) {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    await setPlanTestCases(planId, Array.from(next));
  }

  async function toggleSuite(casesInSuite: string[]) {
    const next = new Set(selectedIds);
    const allSelected = casesInSuite.every((id) => next.has(id));
    for (const id of casesInSuite) {
      if (allSelected) next.delete(id);
      else next.add(id);
    }
    await setPlanTestCases(planId, Array.from(next));
  }

  async function handleDelete() {
    const runCount = await countPlanExecutions(planId);
    const message =
      runCount > 0
        ? `Delete "${plan?.name}" and its ${runCount} run${runCount === 1 ? "" : "s"}? Test cases themselves won't be affected.`
        : `Delete "${plan?.name}"?`;
    if (!window.confirm(message)) return;
    await deleteTestPlan(planId);
    router.push("/testcases/plans");
  }

  if (!plan) return null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <Link href="/testcases/plans" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-3.5" />
        Back to Test Plans
      </Link>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-1 flex items-center gap-2">
            <Badge variant="outline">{plan.status}</Badge>
            {project && <span className="text-xs text-muted-foreground">{project.name}</span>}
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">{plan.name}</h1>
          {plan.objective && <p className="mt-1 max-w-2xl text-muted-foreground">{plan.objective}</p>}
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            {plan.targetRelease && <span>Release: {plan.targetRelease}</span>}
            {plan.environment && <span>Environment: {plan.environment}</span>}
            {plan.owner && <span>Owner: {plan.owner}</span>}
            {plan.startDate && <span>Starts: {new Date(plan.startDate).toLocaleDateString()}</span>}
            {plan.endDate && <span>Ends: {new Date(plan.endDate).toLocaleDateString()}</span>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => setEditOpen(true)}>
            <Pencil className="size-3.5" />
            Edit
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5 text-destructive hover:text-destructive" onClick={handleDelete}>
            <Trash2 className="size-3.5" />
            Delete
          </Button>
        </div>
      </div>

      <div className="mb-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-muted-foreground">Test cases in this plan ({plan.testCaseIds.length})</h2>
        </div>
        <TestCasePicker
          testCases={testCases}
          suites={suites}
          selectedIds={selectedIds}
          onToggleCase={toggleCase}
          onToggleSuite={toggleSuite}
          emptyLabel="This project has no test cases yet."
        />
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-muted-foreground">Runs</h2>
          <NewRunDialog projects={project ? [project] : []} defaultProjectId={plan.projectId} defaultTestPlanId={plan.id} />
        </div>
        <RunList executions={executions} projects={project ? [project] : []} />
      </div>

      <NewTestPlanDialog projectId={plan.projectId} plan={plan} open={editOpen} onOpenChange={setEditOpen} hideTrigger />
    </div>
  );
}
