"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Star, Copy, ZoomIn, ZoomOut, Sun, Moon, LayoutTemplate, Undo2, Redo2, Download, FileText, FileType, Printer, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { SectionList } from "./section-list";
import { CustomizationPanel } from "./customization-panel";
import { ResumeRenderer, PAGE_SIZE_PX } from "@/components/resume/shared/resume-renderer";
import { useResumePhoto } from "@/lib/resume/hooks/use-resume-photo";
import { useResumeUndo } from "@/lib/resume/hooks/use-resume-undo";
import { useResumeSettings } from "@/lib/resume/settings-store";
import { updateResume, duplicateResume, toggleResumeFavorite, switchTemplate } from "@/lib/resume/repo/resumes-repo";
import { RESUME_TEMPLATES } from "@/lib/resume/templates/registry";
import { exportResumeToPDF, exportResumeToDocx, exportResumeAsJSON } from "@/lib/resume/export";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import type { Resume } from "@/lib/resume/types";

const ZOOM_MIN = 0.4;
const ZOOM_MAX = 1.1;

export function ResumeEditorShell({ resume }: { resume: Resume }) {
  const router = useRouter();
  const [tab, setTab] = React.useState("content");
  const [zoom, setZoom] = React.useState(0.62);
  const [name, setName] = React.useState(resume.name);
  const previewScheme = useResumeSettings((s) => s.previewScheme);
  const setPreviewScheme = useResumeSettings((s) => s.setPreviewScheme);
  const photoUrl = useResumePhoto(resume);
  const { canUndo, canRedo, undo, redo } = useResumeUndo(resume);

  // The renderer's own height can grow past the nominal page height (content overflow, not yet
  // paginated — see Phase 9). CSS `transform: scale` never affects layout size, so the scaled
  // preview needs its wrapper sized from the *unscaled* natural height, measured live, rather
  // than the nominal page height — otherwise overflowing content gets clipped by the wrapper.
  const pageRef = React.useRef<HTMLDivElement>(null);
  const [naturalHeight, setNaturalHeight] = React.useState(PAGE_SIZE_PX[resume.layout.pageSize].height);
  React.useEffect(() => {
    const el = pageRef.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setNaturalHeight(entry.target.scrollHeight || entry.contentRect.height));
    observer.observe(el);
    return () => observer.disconnect();
  }, [resume.id]);

  // Full-scale (unzoomed) render kept permanently mounted off-screen — PDF export captures this
  // node with html2canvas, which needs the element actually laid out (unlike display:none).
  const captureRef = React.useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = React.useState<"pdf" | "docx" | null>(null);

  async function commitName() {
    const trimmed = name.trim() || "Untitled Resume";
    if (trimmed !== resume.name) await updateResume(resume.id, { name: trimmed });
  }

  async function handleDuplicate() {
    const copy = await duplicateResume(resume.id);
    if (copy) {
      toast.success("Resume duplicated");
      router.push(`/resume/${copy.id}`);
    }
  }

  async function handleExportPDF() {
    if (!captureRef.current) return;
    setExporting("pdf");
    try {
      await exportResumeToPDF(captureRef.current, resume);
    } catch {
      toast.error("Couldn't export PDF");
    } finally {
      setExporting(null);
    }
  }

  async function handleExportDocx() {
    setExporting("docx");
    try {
      await exportResumeToDocx(resume);
    } catch {
      toast.error("Couldn't export DOCX");
    } finally {
      setExporting(null);
    }
  }

  return (
    <>
    <div className="flex h-[calc(100vh-3.5rem)] flex-col no-print">
      <div className="flex flex-wrap items-center gap-3 border-b border-border px-4 py-2.5">
        <Link href="/resume" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-3.5" />
          Resumes
        </Link>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={commitName}
          className="h-8 min-w-40 flex-1 rounded-md border border-transparent bg-transparent px-2 text-sm font-semibold outline-none hover:border-input focus-visible:border-ring"
        />
        <button
          type="button"
          title={resume.isDraft ? "Mark as saved" : "Mark as draft"}
          onClick={() => void updateResume(resume.id, { isDraft: !resume.isDraft })}
          className={cn("rounded-full px-2 py-0.5 text-[11px] font-medium", resume.isDraft ? "bg-muted text-muted-foreground" : "bg-success/10 text-success")}
        >
          {resume.isDraft ? "Draft" : "Saved"}
        </button>

        {resume.mode === "template" && (
          <div className="flex items-center gap-1.5">
            <LayoutTemplate className="size-3.5 text-muted-foreground" />
            <Select value={resume.templateId ?? undefined} onValueChange={(v) => v && void switchTemplate(resume.id, v)}>
              <SelectTrigger className="h-8 w-44 text-xs">
                <SelectValue placeholder="Switch template">{(v: string) => RESUME_TEMPLATES.find((t) => t.id === v)?.name ?? v}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {RESUME_TEMPLATES.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="ml-auto flex items-center gap-1.5">
          <Button variant="ghost" size="icon" className="size-8" aria-label="Undo" disabled={!canUndo} onClick={() => void undo()}>
            <Undo2 className="size-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="size-8" aria-label="Redo" disabled={!canRedo} onClick={() => void redo()}>
            <Redo2 className="size-3.5" />
          </Button>
          <div className="mx-1 h-4 w-px bg-border" />
          <Button variant="ghost" size="icon" className="size-8" aria-label="Toggle favorite" onClick={() => void toggleResumeFavorite(resume.id)}>
            <Star className={cn("size-4", resume.favorite && "fill-yellow-400 text-yellow-500")} />
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={handleDuplicate}>
            <Copy className="size-3.5" />
            Duplicate
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button size="sm" className="gap-1.5" disabled={exporting !== null}>
                  {exporting ? <Loader2 className="size-3.5 animate-spin" /> : <Download className="size-3.5" />}
                  Export
                </Button>
              }
            />
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => void handleExportPDF()}>
                <FileText className="size-3.5" />
                Export as PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => void handleExportDocx()}>
                <FileType className="size-3.5" />
                Export as DOCX
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => window.print()}>
                <Printer className="size-3.5" />
                Print
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportResumeAsJSON(resume)}>
                <Download className="size-3.5" />
                Export JSON
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <aside className="flex w-[360px] shrink-0 flex-col border-r border-border">
          <Tabs value={tab} onValueChange={(v) => setTab(String(v))} className="flex flex-1 flex-col overflow-hidden">
            <TabsList className="mx-3 mt-3">
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="design">Design</TabsTrigger>
            </TabsList>
            <div className="flex-1 overflow-y-auto p-3">
              <TabsContent value="content">
                <SectionList resume={resume} />
              </TabsContent>
              <TabsContent value="design">
                <CustomizationPanel resume={resume} />
              </TabsContent>
            </div>
          </Tabs>
        </aside>

        <main className="flex flex-1 flex-col overflow-hidden">
          <div className="flex items-center justify-center gap-3 border-b border-border px-4 py-2">
            <Button variant="ghost" size="icon" className="size-7" aria-label="Zoom out" onClick={() => setZoom((z) => Math.max(ZOOM_MIN, +(z - 0.05).toFixed(2)))}>
              <ZoomOut className="size-3.5" />
            </Button>
            <Slider className="w-32" value={[zoom]} min={ZOOM_MIN} max={ZOOM_MAX} step={0.01} onValueChange={(v) => setZoom(Array.isArray(v) ? v[0] : v)} />
            <Button variant="ghost" size="icon" className="size-7" aria-label="Zoom in" onClick={() => setZoom((z) => Math.min(ZOOM_MAX, +(z + 0.05).toFixed(2)))}>
              <ZoomIn className="size-3.5" />
            </Button>
            <span className="w-10 text-center text-xs tabular-nums text-muted-foreground">{Math.round(zoom * 100)}%</span>
            <div className="mx-2 h-4 w-px bg-border" />
            <Button
              variant="ghost"
              size="icon"
              className="size-7"
              aria-label={previewScheme === "dark" ? "Preview on light canvas" : "Preview on dark canvas"}
              onClick={() => setPreviewScheme(previewScheme === "dark" ? "light" : "dark")}
            >
              {previewScheme === "dark" ? <Sun className="size-3.5" /> : <Moon className="size-3.5" />}
            </Button>
          </div>
          <div className={cn("flex flex-1 justify-center overflow-auto p-10", previewScheme === "dark" ? "bg-neutral-900" : "bg-muted/40")}>
            <div
              style={{
                width: PAGE_SIZE_PX[resume.layout.pageSize].width * zoom,
                height: naturalHeight * zoom,
                overflow: "hidden",
              }}
              className="shrink-0 shadow-xl"
            >
              <ResumeRenderer resume={resume} photoUrl={photoUrl} scale={zoom} pageRef={pageRef} />
            </div>
          </div>
        </main>
      </div>
    </div>

    {/* Off-screen, full-scale, always mounted — the source html2canvas captures for PDF export. */}
    <div style={{ position: "fixed", left: -99999, top: 0 }} aria-hidden>
      <ResumeRenderer resume={resume} photoUrl={photoUrl} pageRef={captureRef} />
    </div>

    {/* Full-scale — hidden normally, shown only for window.print() via the app's .no-print/.print-only convention. */}
    <div className="print-only">
      <ResumeRenderer resume={resume} photoUrl={photoUrl} />
    </div>
    </>
  );
}
