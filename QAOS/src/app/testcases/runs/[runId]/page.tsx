"use client";

import * as React from "react";
import { use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLiveQuery } from "dexie-react-hooks";
import { ArrowLeft, Play, CheckCircle2, Trash2 } from "lucide-react";
import { db } from "@/lib/testcases/db";
import { startExecution, completeExecution, deleteExecution } from "@/lib/testcases/repo/execution-repo";
import { RunStatusBadge } from "@/components/testcases/shared/badges";
import { ExecutionRunner } from "@/components/testcases/execution/execution-runner";
import { ExecutionDashboard } from "@/components/testcases/execution/execution-dashboard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function RunDetailPage({ params }: { params: Promise<{ runId: string }> }) {
  const { runId } = use(params);
  const router = useRouter();
  const [tab, setTab] = React.useState("execute");

  const execution = useLiveQuery(() => db.executions.get(runId), [runId]);
  const results = useLiveQuery(() => db.executionResults.where("executionId").equals(runId).toArray(), [runId]) ?? [];
  const testCaseIdsKey = execution?.testCaseIds.join(",") ?? "";
  const testCases =
    useLiveQuery(async () => {
      if (!execution) return [];
      const found = await db.testCases.bulkGet(execution.testCaseIds);
      return found.filter((tc): tc is NonNullable<typeof tc> => Boolean(tc));
    }, [testCaseIdsKey]) ?? [];

  async function handleDelete() {
    if (!execution) return;
    if (!window.confirm(`Delete run "${execution.name}"? This cannot be undone.`)) return;
    await deleteExecution(execution.id);
    router.push("/testcases/runs");
  }

  if (!execution) return null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/testcases/runs" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-3.5" />
            All runs
          </Link>
          <div className="mt-1 flex items-center gap-2">
            <RunStatusBadge value={execution.status} />
            {execution.environment && <span className="text-xs text-muted-foreground">{execution.environment}</span>}
            {execution.build && <span className="text-xs text-muted-foreground">· {execution.build}</span>}
          </div>
          <h1 className="text-xl font-semibold tracking-tight">{execution.name}</h1>
        </div>
        <div className="flex items-center gap-2">
          {execution.status === "Planned" && (
            <Button size="sm" className="gap-1.5" onClick={() => void startExecution(execution.id)}>
              <Play className="size-3.5" />
              Start run
            </Button>
          )}
          {execution.status === "In Progress" && (
            <Button size="sm" variant="outline" className="gap-1.5" onClick={() => void completeExecution(execution.id)}>
              <CheckCircle2 className="size-3.5" />
              Mark complete
            </Button>
          )}
          <Button variant="outline" size="sm" className="gap-1.5 text-destructive" onClick={handleDelete}>
            <Trash2 className="size-3.5" />
            Delete
          </Button>
        </div>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(String(v))}>
        <TabsList>
          <TabsTrigger value="execute">Execute</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        </TabsList>
        <TabsContent value="execute" className="pt-4">
          <ExecutionRunner execution={execution} testCases={testCases} results={results} />
        </TabsContent>
        <TabsContent value="dashboard" className="pt-4">
          <ExecutionDashboard results={results} testCases={testCases} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
