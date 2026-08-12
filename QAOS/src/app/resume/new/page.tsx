"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LayoutTemplate, PenSquare } from "lucide-react";
import { createBlankResume } from "@/lib/resume/repo/resumes-repo";
import { Button } from "@/components/ui/button";

export default function NewResumePage() {
  const router = useRouter();
  const [creating, setCreating] = React.useState(false);

  async function startBlank() {
    setCreating(true);
    try {
      const resume = await createBlankResume();
      router.push(`/resume/${resume.id}`);
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-semibold tracking-tight">New Resume</h1>
        <p className="mt-1 text-sm text-muted-foreground">Start from a ready-made template, or design your own from scratch.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Button
          size="lg"
          className="h-auto flex-col items-start gap-2 p-6 text-left"
          nativeButton={false}
          render={
            <Link href="/resume/templates">
              <LayoutTemplate className="size-6" />
              <span className="text-base font-semibold">Ready-Made Templates</span>
              <span className="text-xs font-normal opacity-90">20+ ATS-friendly designs across every role. One click to start.</span>
            </Link>
          }
        />
        <Button
          size="lg"
          variant="outline"
          className="h-auto flex-col items-start gap-2 p-6 text-left"
          onClick={startBlank}
          disabled={creating}
        >
          <PenSquare className="size-6" />
          <span className="text-base font-semibold">Custom Resume Designer</span>
          <span className="text-xs font-normal text-muted-foreground">Blank canvas — drag sections, pick your own layout and style.</span>
        </Button>
      </div>
    </div>
  );
}
