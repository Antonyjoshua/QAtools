"use client";

import * as React from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { db } from "@/lib/bugs/db";
import type { BugReport } from "@/lib/bugs/types";
import { downloadBlob, bugToMarkdown, bugToHTMLDocument, bugToJSON, downloadBugAsPDF, downloadBugAsDOCX, sanitizeFilename, recordExport } from "@/lib/bugs/export";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function BugExportMenu({ bug, onBeforeExport }: { bug: BugReport; onBeforeExport?: () => Promise<void> }) {
  const project = useLiveQuery(() => (bug.projectId ? db.projects.get(bug.projectId) : undefined), [bug.projectId]);
  const module_ = useLiveQuery(() => (bug.moduleId ? db.modules.get(bug.moduleId) : undefined), [bug.moduleId]);
  const feature = useLiveQuery(() => (bug.featureId ? db.features.get(bug.featureId) : undefined), [bug.featureId]);

  const ctx = React.useMemo(
    () => ({ projectName: project?.name ?? "", moduleName: module_?.name ?? "", featureName: feature?.name ?? "" }),
    [project, module_, feature]
  );

  async function handleExport(format: "pdf" | "docx" | "markdown" | "html" | "json") {
    try {
      await onBeforeExport?.();
      // Re-read from Dexie: the flush above may not have propagated through
      // React re-renders yet, so the `bug` prop can still be one tick stale.
      const currentBug = (await db.bugs.get(bug.id)) ?? bug;
      const filename = sanitizeFilename(`${currentBug.displayId}-${currentBug.title}`);
      if (format === "markdown") {
        downloadBlob(bugToMarkdown(currentBug, ctx), `${filename}.md`, "text/markdown");
      } else if (format === "html") {
        downloadBlob(await bugToHTMLDocument(currentBug, ctx), `${filename}.html`, "text/html");
      } else if (format === "json") {
        downloadBlob(bugToJSON(currentBug, ctx), `${filename}.json`, "application/json");
      } else if (format === "pdf") {
        downloadBugAsPDF(currentBug, ctx);
      } else {
        await downloadBugAsDOCX(currentBug, ctx);
      }
      await recordExport(currentBug, format);
      toast.success(`Exported as ${format.toUpperCase()}`);
    } catch {
      toast.error("Export failed");
    }
  }

  React.useEffect(() => {
    function onExportPdf() {
      handleExport("pdf");
    }
    window.addEventListener("bugforge:export-pdf", onExportPdf);
    return () => window.removeEventListener("bugforge:export-pdf", onExportPdf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bug, ctx]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-input px-2.5 text-xs transition-colors hover:bg-muted">
        <Download className="size-3.5" />
        Export
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport("pdf")}>PDF (.pdf)</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("docx")}>Word (.docx)</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("markdown")}>Markdown (.md)</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("html")}>HTML (.html)</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("json")}>JSON (.json)</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
