"use client";

import * as React from "react";
import Link from "next/link";
import { useLiveQuery } from "dexie-react-hooks";
import type { JSONContent } from "@tiptap/core";
import { format } from "date-fns";
import {
  ArrowLeft,
  Check,
  Loader2,
  History,
  Copy,
  Trash2,
  Printer,
  ListPlus,
} from "lucide-react";
import { db } from "@/lib/bugs/db";
import { updateBug, computeChecklist, findSimilarBugs, duplicateBug, deleteBugForever } from "@/lib/bugs/bugs-repo";
import { COMMON_BUG_TITLES } from "@/lib/bugs/common-titles";
import { SEVERITIES, PRIORITIES, CATEGORIES, STATUSES, type Severity, type Priority, type BugCategory, type BugStatus, type BugReport } from "@/lib/bugs/types";
import { RichTextField } from "@/components/bugs/editor/rich-text-field";
import { EnvironmentBuilder } from "@/components/bugs/environment-builder";
import { AttachmentsPanel } from "@/components/bugs/attachments-panel";
import { QaChecklist } from "@/components/bugs/qa-checklist";
import { DuplicateWarning } from "@/components/bugs/duplicate-warning";
import { BugExportMenu } from "@/components/bugs/bug-export-menu";
import { BugVersionHistoryDialog } from "@/components/bugs/bug-version-history";
import { BugComments } from "@/components/bugs/bug-comments";
import { LinkedTestCaseCard } from "@/components/bugs/linked-test-case-card";
import { PrintableBugView } from "@/components/bugs/printable-bug-view";
import { StatusBadge } from "@/components/bugs/status-badges";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const RICH_FIELDS: { key: "description" | "preconditions" | "stepsToReproduce" | "expectedResult" | "actualResult" | "observedBehaviour" | "additionalNotes"; label: string; placeholder: string; minHeight: number }[] = [
  { key: "description", label: "Description", placeholder: "What is the bug, in a sentence or two?", minHeight: 90 },
  { key: "preconditions", label: "Preconditions", placeholder: "What state must the system/data be in before reproducing?", minHeight: 70 },
  { key: "stepsToReproduce", label: "Steps to Reproduce", placeholder: "1. Go to... 2. Click... 3. Observe...", minHeight: 110 },
  { key: "expectedResult", label: "Expected Result", placeholder: "What should happen?", minHeight: 70 },
  { key: "actualResult", label: "Actual Result", placeholder: "What actually happens?", minHeight: 70 },
  { key: "observedBehaviour", label: "Observed Behaviour", placeholder: "Any additional observed behaviour (intermittent, timing-related, etc.)", minHeight: 70 },
  { key: "additionalNotes", label: "Additional Notes", placeholder: "Anything else worth noting.", minHeight: 70 },
];

function ChipSelect<T extends string>({ options, value, onChange, styles }: { options: readonly T[]; value: T | null; onChange: (v: T) => void; styles: Record<T, string> }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => onChange(o)}
          className={cn(
            "rounded-md border px-2 py-1 text-xs font-medium transition-all",
            value === o ? styles[o] : "border-border text-muted-foreground hover:border-primary/40"
          )}
        >
          {o}
        </button>
      ))}
    </div>
  );
}

export function BugDetailPage({ bugId }: { bugId: string }) {
  const bug = useLiveQuery(() => db.bugs.get(bugId), [bugId]);
  const attachments = useLiveQuery(() => db.attachments.where("bugId").equals(bugId).toArray(), [bugId]);
  const projects = useLiveQuery(() => db.projects.toArray(), []);
  const modules = useLiveQuery(() => db.modules.toArray(), []);
  const features = useLiveQuery(() => db.features.toArray(), []);
  const labels = useLiveQuery(() => db.labels.toArray(), []);
  const reusableSteps = useLiveQuery(() => db.reusableSteps.toArray(), []);
  const router = useRouter();

  const [title, setTitle] = React.useState("");
  const [saveState, setSaveState] = React.useState<"idle" | "saving" | "saved">("idle");
  const [versionOpen, setVersionOpen] = React.useState(false);
  const [duplicates, setDuplicates] = React.useState<Awaited<ReturnType<typeof findSimilarBugs>>>([]);
  const pendingPatchRef = React.useRef<Record<string, unknown>>({});
  const saveTimerRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const userEditedTitleRef = React.useRef(false);

  // Navigated to a different bug: reset immediately (synchronously, ahead of
  // the async Dexie query) so stale state from the previous bug never shows.
  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset title synchronously when navigating to a different bug
    setTitle("");
    userEditedTitleRef.current = false;
  }, [bugId]);

  // Sync the loaded title in once — but only if the user hasn't already
  // started typing in the gap between navigating and this query resolving,
  // otherwise the load would race ahead of them and clobber their input.
  React.useEffect(() => {
    if (bug && !userEditedTitleRef.current) {
      setTitle(bug.title);
    }
  }, [bug]);

  const flushSave = React.useCallback(async () => {
    clearTimeout(saveTimerRef.current);
    const toSave = pendingPatchRef.current;
    if (Object.keys(toSave).length === 0) return;
    pendingPatchRef.current = {};
    setSaveState("saving");
    await updateBug(bugId, toSave as Partial<BugReport>);
    setSaveState("saved");
  }, [bugId]);

  const scheduleSave = React.useCallback(
    (patch: Record<string, unknown>) => {
      setSaveState("saving");
      pendingPatchRef.current = { ...pendingPatchRef.current, ...patch };
      clearTimeout(saveTimerRef.current);
      saveTimerRef.current = setTimeout(() => {
        flushSave();
      }, 900);
    },
    [flushSave]
  );

  React.useEffect(() => {
    function onSave() {
      flushSave();
      toast.success("Draft saved");
    }
    window.addEventListener("bugforge:save", onSave);
    return () => window.removeEventListener("bugforge:save", onSave);
  }, [flushSave]);

  function handleTitleChange(v: string) {
    userEditedTitleRef.current = true;
    setTitle(v);
    scheduleSave({ title: v });
  }

  async function handleTitleBlur() {
    if (title.trim().length >= 4) {
      const matches = await findSimilarBugs(title, bugId);
      setDuplicates(matches);
    } else {
      setDuplicates([]);
    }
  }

  function handleField(key: string, value: unknown) {
    scheduleSave({ [key]: value });
  }

  const projectModules = React.useMemo(() => (modules ?? []).filter((m) => m.projectId === bug?.projectId), [modules, bug?.projectId]);
  const moduleFeatures = React.useMemo(() => (features ?? []).filter((f) => f.moduleId === bug?.moduleId), [features, bug?.moduleId]);

  const checklist = bug ? computeChecklist(bug, (attachments ?? []).some((a) => a.kind === "screenshot")) : null;

  function insertReusableStep(stepJson: JSONContent) {
    if (!bug) return;
    const current = bug.stepsToReproduce;
    const merged: JSONContent = {
      type: "doc",
      content: [...(current.content ?? []).filter((n) => !(n.type === "paragraph" && !n.content)), ...(stepJson.content ?? [])],
    };
    handleField("stepsToReproduce", merged);
  }

  if (!bug) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-muted-foreground">Bug report not found.</p>
        <Link href="/bugs" className="mt-3 inline-block text-sm text-primary hover:underline">
          Back to all bug reports
        </Link>
      </div>
    );
  }

  const project = (projects ?? []).find((p) => p.id === bug.projectId);
  const module_ = (modules ?? []).find((m) => m.id === bug.moduleId);
  const feature = (features ?? []).find((f) => f.id === bug.featureId);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="no-print">
        <div className="mb-4 flex items-center justify-between">
          <Link href="/bugs" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-3.5" />
            Back to all bug reports
          </Link>
          <SaveIndicator state={saveState} />
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-muted px-2 py-1 font-mono text-xs text-muted-foreground">{bug.displayId}</span>
          <Select value={bug.status} onValueChange={(v) => v && handleField("status", v as BugStatus)}>
            <SelectTrigger className="h-7 w-fit gap-1.5 border-none bg-transparent px-1 shadow-none">
              <StatusBadge status={bug.status} />
            </SelectTrigger>
            <SelectContent>
              {STATUSES.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="ml-auto flex items-center gap-1.5">
            <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs" onClick={() => window.print()}>
              <Printer className="size-3.5" />
              Print
            </Button>
            <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs" onClick={() => setVersionOpen(true)}>
              <History className="size-3.5" />
              History
            </Button>
            <BugExportMenu bug={bug} onBeforeExport={flushSave} />
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 text-xs"
              onClick={async () => {
                const copy = await duplicateBug(bug.id);
                if (copy) {
                  toast.success("Bug duplicated");
                  router.push(`/bugs/${copy.id}`);
                }
              }}
            >
              <Copy className="size-3.5" />
              Duplicate
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="h-8 gap-1.5 text-xs text-destructive hover:text-destructive"
              onClick={async () => {
                await deleteBugForever(bug.id);
                toast.success("Bug report deleted");
                router.push("/bugs");
              }}
            >
              <Trash2 className="size-3.5" />
              Delete
            </Button>
          </div>
        </div>

        <div className="mb-2 flex flex-col gap-1.5">
          <Input
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            onBlur={handleTitleBlur}
            placeholder="Bug title — e.g. Checkout button not clickable on Safari"
            list="common-titles"
            className="h-11 text-lg font-medium"
          />
          <datalist id="common-titles">
            {COMMON_BUG_TITLES.map((t) => (
              <option key={t} value={t} />
            ))}
          </datalist>
        </div>

        {duplicates.length > 0 && (
          <div className="mb-4">
            <DuplicateWarning matches={duplicates} />
          </div>
        )}

        <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
          <div className="min-w-0">
            <Tabs defaultValue="details">
              <TabsList>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="environment">Basic Info & Environment</TabsTrigger>
                <TabsTrigger value="attachments">Attachments</TabsTrigger>
                <TabsTrigger value="comments">Comments</TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="flex flex-col gap-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs text-muted-foreground">Severity</Label>
                    <ChipSelect options={SEVERITIES} value={bug.severity} onChange={(v: Severity) => handleField("severity", v)} styles={sevStyles} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs text-muted-foreground">Priority</Label>
                    <ChipSelect options={PRIORITIES} value={bug.priority} onChange={(v: Priority) => handleField("priority", v)} styles={priStyles} />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs text-muted-foreground">Category</Label>
                    <Select value={bug.category ?? undefined} onValueChange={(v) => v && handleField("category", v as BugCategory)}>
                      <SelectTrigger className="h-8 w-full">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs text-muted-foreground">Labels</Label>
                  <div className="flex flex-wrap gap-1.5">
                    {(labels ?? []).map((l) => {
                      const active = bug.labels.includes(l.name);
                      return (
                        <button
                          key={l.id}
                          type="button"
                          onClick={() => handleField("labels", active ? bug.labels.filter((x) => x !== l.name) : [...bug.labels, l.name])}
                          className={cn(
                            "rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors",
                            active ? "border-transparent text-white" : "border-border text-muted-foreground hover:border-primary/40"
                          )}
                          style={active ? { backgroundColor: l.color } : undefined}
                        >
                          {l.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {RICH_FIELDS.map((f) => (
                  <div key={f.key} className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs text-muted-foreground">{f.label}</Label>
                      {f.key === "stepsToReproduce" && (
                        <DropdownMenu>
                          <DropdownMenuTrigger className="flex items-center gap-1 text-[11px] text-primary hover:underline">
                            <ListPlus className="size-3" /> Insert reusable steps
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {(reusableSteps ?? []).map((s) => (
                              <DropdownMenuItem key={s.id} onClick={() => insertReusableStep(s.contentJSON)}>
                                {s.name}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </div>
                    <RichTextField
                      content={bug[f.key] as JSONContent}
                      onChange={(json) => handleField(f.key, json)}
                      placeholder={f.placeholder}
                      minHeight={f.minHeight}
                    />
                  </div>
                ))}
              </TabsContent>

              <TabsContent value="environment" className="flex flex-col gap-5">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs text-muted-foreground">Project</Label>
                    <Select value={bug.projectId ?? "none"} onValueChange={(v) => v && handleField("projectId", v === "none" ? null : v)}>
                      <SelectTrigger className="h-8 w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No project</SelectItem>
                        {(projects ?? []).map((p) => (
                          <SelectItem key={p.id} value={p.id}>
                            {p.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs text-muted-foreground">Module</Label>
                    <Select value={bug.moduleId ?? "none"} onValueChange={(v) => v && handleField("moduleId", v === "none" ? null : v)}>
                      <SelectTrigger className="h-8 w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No module</SelectItem>
                        {projectModules.map((m) => (
                          <SelectItem key={m.id} value={m.id}>
                            {m.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label className="text-xs text-muted-foreground">Feature</Label>
                    <Select value={bug.featureId ?? "none"} onValueChange={(v) => v && handleField("featureId", v === "none" ? null : v)}>
                      <SelectTrigger className="h-8 w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No feature</SelectItem>
                        {moduleFeatures.map((f) => (
                          <SelectItem key={f.id} value={f.id}>
                            {f.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label className="text-xs text-muted-foreground">Reporter</Label>
                  <Input value={bug.reporter} onChange={(e) => handleField("reporter", e.target.value)} className="h-8 max-w-xs" />
                </div>

                <EnvironmentBuilder
                  value={{
                    browser: bug.browser,
                    browserVersion: bug.browserVersion,
                    platform: bug.platform,
                    os: bug.os,
                    device: bug.device,
                    environment: bug.environment,
                    buildVersion: bug.buildVersion,
                  }}
                  onChange={(patch) => Object.entries(patch).forEach(([k, v]) => handleField(k, v))}
                />

                <div className="text-xs text-muted-foreground">
                  Created {format(bug.createdAt, "MMM d, yyyy 'at' h:mm a")} &middot; Updated {format(bug.updatedAt, "MMM d, yyyy 'at' h:mm a")}
                </div>
              </TabsContent>

              <TabsContent value="attachments">
                <AttachmentsPanel bugId={bug.id} />
              </TabsContent>

              <TabsContent value="comments">
                <BugComments bugId={bug.id} />
              </TabsContent>
            </Tabs>
          </div>

          <aside className="flex flex-col gap-4">
            <div className="rounded-xl border border-border bg-card p-4">
              {checklist && <QaChecklist checklist={checklist} />}
            </div>
            {bug.linkedTestCaseId && <LinkedTestCaseCard testCaseId={bug.linkedTestCaseId} displayId={bug.linkedTestCaseDisplayId} />}
            <div className="rounded-xl border border-border bg-card p-4 text-xs text-muted-foreground">
              <p className="mb-1 font-medium text-foreground">Context</p>
              <p>Project: {project?.name ?? "—"}</p>
              <p>Module: {module_?.name ?? "—"}</p>
              <p>Feature: {feature?.name ?? "—"}</p>
            </div>
          </aside>
        </div>
      </div>

      <PrintableBugView bug={bug} projectName={project?.name ?? ""} moduleName={module_?.name ?? ""} featureName={feature?.name ?? ""} />

      <BugVersionHistoryDialog bugId={bug.id} open={versionOpen} onOpenChange={setVersionOpen} />
    </div>
  );
}

const sevStyles = {
  Critical: "border-destructive bg-destructive/15 text-destructive",
  High: "border-primary bg-primary/15 text-primary",
  Major: "border-warning bg-warning/15 text-warning",
  Medium: "border-chart-2 bg-chart-2/15 text-chart-2",
  Minor: "border-muted-foreground bg-muted text-muted-foreground",
  Cosmetic: "border-muted-foreground bg-muted text-muted-foreground",
} as const;

const priStyles = {
  P0: "border-destructive bg-destructive/15 text-destructive",
  P1: "border-primary bg-primary/15 text-primary",
  P2: "border-warning bg-warning/15 text-warning",
  P3: "border-chart-3 bg-chart-3/15 text-chart-3",
  P4: "border-muted-foreground bg-muted text-muted-foreground",
} as const;

function SaveIndicator({ state }: { state: "idle" | "saving" | "saved" }) {
  if (state === "idle") return null;
  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
      {state === "saving" ? (
        <>
          <Loader2 className="size-3 animate-spin" /> Saving…
        </>
      ) : (
        <>
          <Check className="size-3 text-success" /> Saved
        </>
      )}
    </div>
  );
}
