"use client";

import * as React from "react";
import { use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useLiveQuery } from "dexie-react-hooks";
import { ArrowLeft, Copy, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { db } from "@/lib/testcases/db";
import { updateTestCase, deleteTestCase, duplicateTestCase } from "@/lib/testcases/repo/testcases-repo";
import { useTestManagementSettings } from "@/lib/testcases/settings-store";
import { useTestManagementShortcuts } from "@/lib/testcases/hooks/use-shortcuts";
import { TestCaseForm } from "@/components/testcases/testcases/testcase-form";
import { StepsEditor } from "@/components/testcases/testcases/steps-editor";
import { AttachmentsPanel } from "@/components/testcases/testcases/attachments-panel";
import { CommentsThread } from "@/components/testcases/testcases/comments-thread";
import { LinkedBugsPanel } from "@/components/testcases/testcases/linked-bugs-panel";
import { VersionHistory } from "@/components/testcases/testcases/version-history";
import { StatusBadge } from "@/components/testcases/shared/badges";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { TestCaseFormValues } from "@/lib/testcases/schema";

export default function TestCaseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const currentUser = useTestManagementSettings((s) => s.currentUser);
  const testCase = useLiveQuery(() => db.testCases.get(id), [id]);
  const [tab, setTab] = React.useState("details");
  const formId = "edit-test-case-form";

  useTestManagementShortcuts({
    onSave: () => document.getElementById(formId)?.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true })),
    onExecute: () => router.push(`/testcases/runs`),
  });

  async function handleSubmit(values: TestCaseFormValues) {
    await updateTestCase(id, values, currentUser, "Edited details");
    toast.success("Saved");
  }

  async function handleDuplicate() {
    const copy = await duplicateTestCase(id, currentUser);
    if (copy) {
      toast.success(`Duplicated as ${copy.displayId}`);
      router.push(`/testcases/case/${copy.id}`);
    }
  }

  async function handleDelete() {
    if (!testCase) return;
    if (!window.confirm(`Delete ${testCase.displayId}? This cannot be undone.`)) return;
    await deleteTestCase(id);
    router.push(`/testcases/projects/${testCase.projectId}`);
  }

  if (!testCase) return null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href={`/testcases/projects/${testCase.projectId}`} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-3.5" />
            Back to project
          </Link>
          <div className="mt-1 flex items-center gap-2">
            <span className="font-mono text-xs text-muted-foreground">{testCase.displayId}</span>
            <StatusBadge value={testCase.status} />
          </div>
          <h1 className="text-xl font-semibold tracking-tight">{testCase.title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={handleDuplicate}>
            <Copy className="size-3.5" />
            Duplicate
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5 text-destructive" onClick={handleDelete}>
            <Trash2 className="size-3.5" />
            Delete
          </Button>
          {tab === "details" && (
            <Button form={formId} type="submit" size="sm">
              Save
            </Button>
          )}
        </div>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(String(v))}>
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="steps">Steps</TabsTrigger>
          <TabsTrigger value="attachments">Attachments</TabsTrigger>
          <TabsTrigger value="comments">Comments</TabsTrigger>
          <TabsTrigger value="bugs">Bugs</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="pt-4">
          <TestCaseForm
            formId={formId}
            defaultValues={{
              title: testCase.title,
              description: testCase.description,
              objective: testCase.objective,
              module: testCase.module,
              feature: testCase.feature,
              priority: testCase.priority,
              severity: testCase.severity,
              type: testCase.type,
              status: testCase.status,
              requirementId: testCase.requirementId,
              sprint: testCase.sprint,
              releaseVersion: testCase.releaseVersion,
              environment: testCase.environment,
              browser: testCase.browser,
              device: testCase.device,
              os: testCase.os,
              tags: testCase.tags,
              reviewer: testCase.reviewer,
              estimatedTimeMinutes: testCase.estimatedTimeMinutes,
              automationStatus: testCase.automationStatus,
              automationScriptLink: testCase.automationScriptLink,
              preconditions: testCase.preconditions,
              testData: testCase.testData,
              expectedResult: testCase.expectedResult,
              notes: testCase.notes,
            }}
            onSubmit={handleSubmit}
          />
        </TabsContent>
        <TabsContent value="steps" className="pt-4">
          <StepsEditor testCaseId={id} />
        </TabsContent>
        <TabsContent value="attachments" className="pt-4">
          <AttachmentsPanel parentType="testcase" parentId={id} />
        </TabsContent>
        <TabsContent value="comments" className="pt-4">
          <CommentsThread testCaseId={id} />
        </TabsContent>
        <TabsContent value="bugs" className="pt-4">
          <LinkedBugsPanel testCaseId={id} />
        </TabsContent>
        <TabsContent value="history" className="pt-4">
          <VersionHistory testCaseId={id} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
