"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { TestCaseForm } from "@/components/testcases/testcases/testcase-form";
import type { TestCaseFormValues } from "@/lib/testcases/schema";
import { createTestCase } from "@/lib/testcases/repo/testcases-repo";
import { useTestManagementSettings } from "@/lib/testcases/settings-store";
import { useTestManagementShortcuts } from "@/lib/testcases/hooks/use-shortcuts";

const DEFAULTS: TestCaseFormValues = {
  title: "",
  description: "",
  objective: "",
  module: "",
  feature: "",
  priority: "Medium",
  severity: "Major",
  type: "Functional",
  status: "Draft",
  requirementId: "",
  sprint: "",
  releaseVersion: "",
  environment: "",
  browser: "Any",
  device: "Any",
  os: "Any",
  tags: [],
  reviewer: "",
  estimatedTimeMinutes: null,
  automationStatus: "Not Automated",
  automationScriptLink: "",
  preconditions: "",
  testData: "",
  expectedResult: "",
  notes: "",
};

export default function NewTestCasePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId") ?? "";
  const suiteId = searchParams.get("suiteId") ?? "";
  const currentUser = useTestManagementSettings((s) => s.currentUser);
  const formId = "new-test-case-form";

  useTestManagementShortcuts({
    onSave: () => document.getElementById(formId)?.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true })),
  });

  async function handleSubmit(values: TestCaseFormValues) {
    if (!projectId || !suiteId) {
      toast.error("Missing project or suite");
      return;
    }
    const testCase = await createTestCase({ ...values, projectId, suiteId, actualResult: "", author: currentUser }, currentUser);
    toast.success(`${testCase.displayId} created`);
    router.push(`/testcases/case/${testCase.id}`);
  }

  if (!projectId || !suiteId) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-sm text-muted-foreground">Choose a suite from a project before creating a test case.</p>
        <Button className="mt-4" render={<Link href="/testcases/projects">Go to projects</Link>} />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <Link href={`/testcases/projects/${projectId}`} className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-3.5" />
            Back
          </Link>
          <h1 className="mt-1 text-xl font-semibold tracking-tight">New test case</h1>
        </div>
        <Button form={formId} type="submit">
          Create test case
        </Button>
      </div>
      <TestCaseForm formId={formId} defaultValues={DEFAULTS} onSubmit={handleSubmit} submitLabel="Create" />
    </div>
  );
}
