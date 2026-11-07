"use client";

import * as React from "react";
import { use } from "react";
import { useRouter } from "next/navigation";
import { useLiveQuery } from "dexie-react-hooks";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { db } from "@/lib/testcases/db";
import { deleteProject } from "@/lib/testcases/repo/projects-repo";
import { FolderTree } from "@/components/testcases/folders/folder-tree";
import { NewFolderDialog } from "@/components/testcases/folders/new-folder-dialog";
import { NewSuiteDialog } from "@/components/testcases/suites/new-suite-dialog";
import { SuiteList } from "@/components/testcases/suites/suite-list";
import { TestCaseViews } from "@/components/testcases/testcases/testcase-views";
import { Button } from "@/components/ui/button";
import { useTestManagementSettings } from "@/lib/testcases/settings-store";
import { useTestManagementShortcuts } from "@/lib/testcases/hooks/use-shortcuts";
import type { Folder, Suite, TestCase } from "@/lib/testcases/types";

const EMPTY_FOLDERS: Folder[] = [];
const EMPTY_SUITES: Suite[] = [];
const EMPTY_TEST_CASES: TestCase[] = [];

export default function ProjectWorkspacePage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = use(params);
  const router = useRouter();
  const setLastProjectId = useTestManagementSettings((s) => s.setLastProjectId);

  const project = useLiveQuery(() => db.projects.get(projectId), [projectId]);
  const folders = useLiveQuery(() => db.folders.where("projectId").equals(projectId).toArray(), [projectId]) ?? EMPTY_FOLDERS;
  const suites = useLiveQuery(() => db.suites.where("projectId").equals(projectId).toArray(), [projectId]) ?? EMPTY_SUITES;
  const testCases = useLiveQuery(() => db.testCases.where("projectId").equals(projectId).toArray(), [projectId]) ?? EMPTY_TEST_CASES;

  const [selectedFolderId, setSelectedFolderId] = React.useState<string | null>(null);
  const [selectedSuiteId, setSelectedSuiteId] = React.useState<string | null>(null);

  React.useEffect(() => {
    setLastProjectId(projectId);
  }, [projectId, setLastProjectId]);

  async function handleDeleteProject() {
    const requirementCount = await db.requirements.where("projectId").equals(projectId).count();
    const testPlanCount = await db.testPlans.where("projectId").equals(projectId).count();
    const parts = [
      `${suites.length} suite${suites.length === 1 ? "" : "s"}`,
      `${testCases.length} test case${testCases.length === 1 ? "" : "s"}`,
      `${requirementCount} requirement${requirementCount === 1 ? "" : "s"}`,
      `${testPlanCount} test plan${testPlanCount === 1 ? "" : "s"}`,
    ];
    if (!window.confirm(`Delete "${project?.name}" and everything under it — ${parts.join(", ")}, plus all execution runs? This cannot be undone.`)) return;
    await deleteProject(projectId);
    toast.success("Project deleted");
    router.push("/testcases/projects");
  }

  const activeFolderId = selectedFolderId ?? folders[0]?.id ?? null;

  const suiteCountByFolder = React.useMemo(() => {
    const map = new Map<string, number>();
    for (const s of suites) map.set(s.folderId, (map.get(s.folderId) ?? 0) + 1);
    return map;
  }, [suites]);

  const caseCountBySuite = React.useMemo(() => {
    const map = new Map<string, number>();
    for (const c of testCases) map.set(c.suiteId, (map.get(c.suiteId) ?? 0) + 1);
    return map;
  }, [testCases]);

  const suitesInFolder = suites.filter((s) => s.folderId === activeFolderId).sort((a, b) => a.order - b.order);
  const selectedSuite = suites.find((s) => s.id === selectedSuiteId) ?? null;
  const casesInSuite = testCases.filter((c) => c.suiteId === selectedSuiteId);

  useTestManagementShortcuts({
    onNew: () => {
      if (selectedSuiteId) router.push(`/testcases/case/new?suiteId=${selectedSuiteId}&projectId=${projectId}`);
    },
  });

  if (!project) return null;

  return (
    <div className="flex min-h-[calc(100vh-56px)] flex-col">
      <div className="flex items-start justify-between gap-4 border-b border-border px-4 py-3 sm:px-6 lg:px-8">
        <div>
          <Link href="/testcases/projects" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-3.5" />
            All projects
          </Link>
          <h1 className="mt-1 text-xl font-semibold tracking-tight">{project.name}</h1>
        </div>
        <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-destructive" onClick={handleDeleteProject}>
          <Trash2 className="size-3.5" />
          Delete project
        </Button>
      </div>

      <div className="grid flex-1 grid-cols-1 md:grid-cols-[240px_1fr]">
        <aside className="border-b border-border p-3 md:border-r md:border-b-0">
          <div className="mb-2">
            <NewFolderDialog projectId={projectId} onCreated={(id) => setSelectedFolderId(id)} />
          </div>
          <FolderTree
            folders={folders}
            selectedFolderId={activeFolderId}
            onSelect={(id) => {
              setSelectedFolderId(id);
              setSelectedSuiteId(null);
            }}
            suiteCountByFolder={suiteCountByFolder}
            projectId={projectId}
          />
        </aside>

        <div className="min-w-0 flex-1 p-4 sm:p-6">
          {!selectedSuite ? (
            <>
              <div className="mb-3 flex items-center justify-between gap-3">
                <h2 className="text-sm font-semibold text-muted-foreground">Suites</h2>
                <NewSuiteDialog projectId={projectId} folderId={activeFolderId} disabled={!activeFolderId} />
              </div>
              <SuiteList
                suites={suitesInFolder}
                selectedSuiteId={selectedSuiteId}
                onSelect={setSelectedSuiteId}
                caseCountBySuite={caseCountBySuite}
                onDeleted={(id) => {
                  if (selectedSuiteId === id) setSelectedSuiteId(null);
                }}
              />
            </>
          ) : (
            <>
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <button
                    type="button"
                    onClick={() => setSelectedSuiteId(null)}
                    className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                  >
                    <ArrowLeft className="size-3.5" />
                    Back to suites
                  </button>
                  <h2 className="mt-1 text-lg font-semibold">{selectedSuite.name}</h2>
                </div>
                <Button
                  size="sm"
                  className="gap-1.5"
                  nativeButton={false}
                  render={
                    <Link href={`/testcases/case/new?suiteId=${selectedSuite.id}&projectId=${projectId}`}>
                      <Plus className="size-4" />
                      New Test Case
                    </Link>
                  }
                />
              </div>
              <TestCaseViews testCases={casesInSuite} projectId={projectId} suiteId={selectedSuite.id} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
