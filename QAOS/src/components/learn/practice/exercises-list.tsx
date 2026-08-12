"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { EXERCISES } from "@/lib/learn/content/registry";
import { CodeBlock } from "@/components/learn/article/code-block";
import { cn } from "@/lib/utils";
import type { Exercise } from "@/lib/learn/content/types";

const TYPE_LABELS: Record<Exercise["type"], string> = {
  "bug-finding": "Bug Finding",
  "test-case-writing": "Test Case Writing",
  "automation-challenge": "Automation Challenge",
};

function ExerciseRow({ ex }: { ex: Exercise }) {
  const [open, setOpen] = React.useState(false);
  const [revealed, setRevealed] = React.useState(false);

  return (
    <div className="rounded-lg border border-border">
      <button type="button" onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between gap-3 p-3 text-left">
        <div>
          <p className="text-sm font-medium">{ex.title}</p>
          <p className="text-xs text-muted-foreground">{TYPE_LABELS[ex.type]}</p>
        </div>
        <ChevronDown className={cn("size-4 shrink-0 text-muted-foreground transition-transform", open && "rotate-180")} />
      </button>
      {open && (
        <div className="border-t border-border p-3">
          <p className="text-sm leading-relaxed">{ex.prompt}</p>
          {ex.context && <CodeBlock language={ex.context.language} code={ex.context.code} caption={ex.context.caption} />}
          {!revealed ? (
            <button type="button" onClick={() => setRevealed(true)} className="mt-3 text-xs text-primary hover:underline">
              Reveal model solution
            </button>
          ) : (
            <div className="mt-3 rounded-md bg-muted/40 p-3 text-sm whitespace-pre-wrap">{ex.modelSolution}</div>
          )}
        </div>
      )}
    </div>
  );
}

export function ExercisesList() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/learn/practice" className="mb-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-3.5" />
        Practice Zone
      </Link>
      <h1 className="text-2xl font-semibold tracking-tight">Exercises</h1>
      <p className="mt-1 text-muted-foreground">Bug-finding, test-case-writing, and automation challenges — try it yourself before checking the model solution.</p>

      <div className="mt-6 flex flex-col gap-2">
        {EXERCISES.map((ex) => (
          <ExerciseRow key={ex.id} ex={ex} />
        ))}
      </div>
    </div>
  );
}
