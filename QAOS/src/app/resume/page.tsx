"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLiveQuery } from "dexie-react-hooks";
import { FileText, Plus, Upload, FileStack } from "lucide-react";
import { toast } from "sonner";
import { db } from "@/lib/resume/db";
import { importResumeFromJSON } from "@/lib/resume/export";
import { ResumeCard } from "@/components/resume/dashboard/resume-card";
import { Button } from "@/components/ui/button";

export default function ResumeDashboardPage() {
  const router = useRouter();
  const inputRef = React.useRef<HTMLInputElement>(null);
  const resumes = useLiveQuery(() => db.resumes.orderBy("updatedAt").reverse().toArray());

  async function handleImport(file: File | undefined) {
    if (!file) return;
    try {
      const resume = await importResumeFromJSON(file);
      toast.success("Resume imported");
      router.push(`/resume/${resume.id}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Import failed");
    }
  }

  const draftCount = resumes?.filter((r) => r.isDraft).length ?? 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <FileText className="size-3.5" />
            Resume Builder
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Build a resume that gets you shortlisted.</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            {resumes ? `${resumes.length} resume${resumes.length === 1 ? "" : "s"}` : "…"}
            {resumes && resumes.length > 0 && draftCount > 0 ? ` · ${draftCount} in draft` : ""} — 20+ ATS-friendly templates, or design your
            own from a blank canvas.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <input ref={inputRef} type="file" accept="application/json" className="hidden" onChange={(e) => void handleImport(e.target.files?.[0])} />
          <Button variant="outline" className="gap-1.5" onClick={() => inputRef.current?.click()}>
            <Upload className="size-4" />
            Import JSON
          </Button>
          <Button className="gap-1.5" nativeButton={false} render={<Link href="/resume/new" />}>
            <Plus className="size-4" />
            New Resume
          </Button>
        </div>
      </div>

      {resumes && resumes.length === 0 && (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border py-20 text-center">
          <FileStack className="size-8 text-muted-foreground" />
          <p className="font-medium">No resumes yet</p>
          <p className="max-w-sm text-sm text-muted-foreground">Start from a ready-made template or design a custom layout from scratch.</p>
          <Button className="mt-2 gap-1.5" nativeButton={false} render={<Link href="/resume/new" />}>
            <Plus className="size-4" />
            Create your first resume
          </Button>
        </div>
      )}

      {resumes && resumes.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {resumes.map((r) => (
            <ResumeCard key={r.id} resume={r} />
          ))}
        </div>
      )}
    </div>
  );
}
