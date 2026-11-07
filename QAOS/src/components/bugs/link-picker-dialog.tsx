"use client";

import * as React from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { Search } from "lucide-react";
import { db as testcasesDb } from "@/lib/testcases/db";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import type { TestCase, Requirement, Project } from "@/lib/testcases/types";

const EMPTY_TEST_CASES: TestCase[] = [];
const EMPTY_REQUIREMENTS: Requirement[] = [];
const EMPTY_PROJECTS: Project[] = [];

export type LinkPickerMode = "testcase" | "requirement";

/**
 * A single shared Dialog for both "Link a test case" and "Link a requirement" pickers.
 * These used to be two independent Dialog.Root instances (one per card); opening one
 * right after closing the other intermittently left Base UI's dialog stack bookkeeping
 * confused, making the second dialog's results unclickable (a real click reached the
 * DOM but never fired the React handler — a stacking race between separate portals, not
 * a CSS issue). Routing both through one Dialog.Root that just swaps its content by
 * `mode` removes the "two portals mounting back-to-back" pattern that triggered it.
 */
export function LinkPickerDialog({
  mode,
  onOpenChange,
  onSelectTestCase,
  onSelectRequirement,
  scopeProjectId,
}: {
  /** null closes the dialog; otherwise which picker's content to show. */
  mode: LinkPickerMode | null;
  onOpenChange: (open: boolean) => void;
  onSelectTestCase: (testCase: TestCase) => void;
  onSelectRequirement: (requirement: Requirement) => void;
  /** A Test Management project id to default the search to (from the bug's linked project), if any. */
  scopeProjectId?: string | null;
}) {
  const [query, setQuery] = React.useState("");
  const [showAllProjects, setShowAllProjects] = React.useState(!scopeProjectId);
  const testCases = useLiveQuery(() => testcasesDb.testCases.toArray(), []) ?? EMPTY_TEST_CASES;
  const requirements = useLiveQuery(() => testcasesDb.requirements.toArray(), []) ?? EMPTY_REQUIREMENTS;
  const projects = useLiveQuery(() => testcasesDb.projects.toArray(), []) ?? EMPTY_PROJECTS;
  const projectById = React.useMemo(() => new Map(projects.map((p) => [p.id, p])), [projects]);
  const scopedProject = scopeProjectId ? projectById.get(scopeProjectId) : undefined;
  const scoped = Boolean(scopeProjectId) && !showAllProjects;
  const noun = mode === "testcase" ? "test case" : "requirement";

  const testCaseResults = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    let pool = scoped ? testCases.filter((tc) => tc.projectId === scopeProjectId) : testCases;
    if (q) pool = pool.filter((tc) => tc.title.toLowerCase().includes(q) || tc.displayId.toLowerCase().includes(q));
    return pool.slice(0, 50);
  }, [testCases, query, scoped, scopeProjectId]);

  const requirementResults = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    let pool = scoped ? requirements.filter((r) => r.projectId === scopeProjectId) : requirements;
    if (q) pool = pool.filter((r) => r.title.toLowerCase().includes(q) || r.requirementId.toLowerCase().includes(q));
    return pool.slice(0, 50);
  }, [requirements, query, scoped, scopeProjectId]);

  function reset() {
    setQuery("");
    setShowAllProjects(!scopeProjectId);
  }

  return (
    <Dialog
      open={mode !== null}
      onOpenChange={(v) => {
        onOpenChange(v);
        if (!v) reset();
      }}
    >
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Link a {noun}</DialogTitle>
        </DialogHeader>
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={mode === "testcase" ? "Search by title or ID…" : "Search by title or code…"}
            className="pl-9"
            autoFocus
          />
        </div>
        {scopeProjectId && (
          <p className="text-xs text-muted-foreground">
            {scoped ? (
              <>
                Showing {mode === "testcase" ? "test cases" : "requirements"} from{" "}
                <span className="font-medium text-foreground">{scopedProject?.name ?? "the linked project"}</span> ·{" "}
                <button type="button" className="underline hover:text-foreground" onClick={() => setShowAllProjects(true)}>
                  search all projects
                </button>
              </>
            ) : (
              <>
                Showing all projects ·{" "}
                <button type="button" className="underline hover:text-foreground" onClick={() => setShowAllProjects(false)}>
                  scope to {scopedProject?.name ?? "linked project"}
                </button>
              </>
            )}
          </p>
        )}
        <div className="flex max-h-80 flex-col divide-y divide-border overflow-y-auto rounded-lg border border-border">
          {mode === "testcase" &&
            (testCaseResults.length === 0 ? (
              <p className="px-3 py-6 text-center text-sm text-muted-foreground">No test cases found.</p>
            ) : (
              testCaseResults.map((tc) => (
                <button
                  key={tc.id}
                  type="button"
                  onClick={() => {
                    onSelectTestCase(tc);
                    onOpenChange(false);
                  }}
                  className="flex flex-col items-start gap-0.5 px-3 py-2 text-left text-sm hover:bg-accent/50"
                >
                  <span className="flex w-full items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground">{tc.displayId}</span>
                    <span className="font-medium">{tc.title}</span>
                    {!scoped && (
                      <Badge variant="outline" className="ml-auto shrink-0 text-[10px] font-normal">
                        {projectById.get(tc.projectId)?.name ?? "Unknown project"}
                      </Badge>
                    )}
                  </span>
                </button>
              ))
            ))}
          {mode === "requirement" &&
            (requirementResults.length === 0 ? (
              <p className="px-3 py-6 text-center text-sm text-muted-foreground">No requirements found.</p>
            ) : (
              requirementResults.map((r) => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => {
                    onSelectRequirement(r);
                    onOpenChange(false);
                  }}
                  className="flex flex-col items-start gap-0.5 px-3 py-2 text-left text-sm hover:bg-accent/50"
                >
                  <span className="flex w-full items-center gap-2">
                    <span className="font-mono text-xs text-muted-foreground">{r.requirementId}</span>
                    <span className="font-medium">{r.title}</span>
                    {!scoped && (
                      <Badge variant="outline" className="ml-auto shrink-0 text-[10px] font-normal">
                        {projectById.get(r.projectId)?.name ?? "Unknown project"}
                      </Badge>
                    )}
                  </span>
                </button>
              ))
            ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
