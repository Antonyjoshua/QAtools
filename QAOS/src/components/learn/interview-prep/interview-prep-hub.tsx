"use client";

import * as React from "react";
import Link from "next/link";
import { useLiveQuery } from "dexie-react-hooks";
import { ArrowLeft, Mic, ChevronDown } from "lucide-react";
import { db } from "@/lib/learn/db";
import { recordInterviewAnswer } from "@/lib/learn/repo/interview-repo";
import { awardXp } from "@/lib/learn/gamification/award-xp";
import { XP_REWARDS } from "@/lib/learn/gamification/levels";
import { INTERVIEW_QUESTIONS, INTERVIEW_LEVELS, INTERVIEW_CATEGORIES } from "@/lib/learn/content/registry";
import { PersistedTextarea } from "@/components/learn/shared/persisted-textarea";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { InterviewLevel, InterviewCategory, InterviewQuestion } from "@/lib/learn/content/types";

const LEVEL_LABELS: Record<InterviewLevel, string> = {
  fresher: "Fresher",
  "1-2y": "1-2 Years",
  "3-5y": "3-5 Years",
  senior: "Senior",
  lead: "Lead",
  sdet: "SDET",
  architect: "Architect",
};

function QuestionRow({ q }: { q: InterviewQuestion }) {
  const [open, setOpen] = React.useState(false);
  // undefined = still loading; null = confirmed no answer saved yet — distinct from "loading" so
  // the field can render immediately for never-answered questions instead of waiting forever.
  const answered = useLiveQuery(async () => (await db.interviewAnswers.get(q.id)) ?? null, [q.id]);

  async function handleAnswerChange(value: string) {
    await recordInterviewAnswer(q.id, value, answered?.selfRating ?? null);
  }

  async function handleRate(rating: 1 | 2 | 3 | 4 | 5) {
    const alreadyRated = answered?.selfRating != null;
    await recordInterviewAnswer(q.id, answered?.userAnswer ?? "", rating);
    if (!alreadyRated) {
      await awardXp(XP_REWARDS.interviewQuestionAnswered, "answered an interview question");
    }
  }

  return (
    <div className="rounded-lg border border-border">
      <button type="button" onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between gap-3 p-3 text-left">
        <div className="min-w-0">
          <p className="text-sm font-medium">{q.question}</p>
          <p className="mt-0.5 text-xs text-muted-foreground capitalize">
            {LEVEL_LABELS[q.level]} · {q.category}
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {answered && <span className="text-xs text-success">Answered</span>}
          <ChevronDown className={cn("size-4 text-muted-foreground transition-transform", open && "rotate-180")} />
        </div>
      </button>
      {open && (
        <div className="border-t border-border p-3">
          {answered === undefined ? (
            <Textarea disabled placeholder="Loading…" rows={3} className="text-sm" />
          ) : (
            <PersistedTextarea
              key={q.id}
              initialValue={answered?.userAnswer ?? ""}
              onSave={(v) => void handleAnswerChange(v)}
              placeholder="Write your own answer first…"
              rows={3}
              className="text-sm"
            />
          )}
          <div className="mt-3 rounded-md bg-muted/40 p-3 text-sm">
            <p className="mb-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">Model answer</p>
            <p className="text-muted-foreground">{q.modelAnswer}</p>
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Rate yourself:</span>
            {[1, 2, 3, 4, 5].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => void handleRate(r as 1 | 2 | 3 | 4 | 5)}
                className={cn(
                  "size-7 rounded-full border text-xs font-medium",
                  answered?.selfRating === r ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-accent/50"
                )}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function InterviewPrepHub() {
  const [level, setLevel] = React.useState<InterviewLevel | "all">("all");
  const [category, setCategory] = React.useState<InterviewCategory | "all">("all");

  const filtered = INTERVIEW_QUESTIONS.filter((q) => (level === "all" || q.level === level) && (category === "all" || q.category === category));

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/learn" className="mb-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-3.5" />
        Learn
      </Link>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Interview Prep</h1>
          <p className="mt-1 text-muted-foreground">{INTERVIEW_QUESTIONS.length} questions across every experience level.</p>
        </div>
        <Button className="gap-1.5" nativeButton={false} render={<Link href="/learn/interview-prep/mock" />}>
          <Mic className="size-4" />
          Start Mock Interview
        </Button>
      </div>

      <div className="mb-3 flex flex-wrap gap-1.5">
        {(["all", ...INTERVIEW_LEVELS] as const).map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => setLevel(l)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium",
              level === l ? "border-primary/50 bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-accent/50"
            )}
          >
            {l === "all" ? "All levels" : LEVEL_LABELS[l]}
          </button>
        ))}
      </div>
      <div className="mb-6 flex flex-wrap gap-1.5">
        {(["all", ...INTERVIEW_CATEGORIES] as const).map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium capitalize",
              category === c ? "border-primary/50 bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-accent/50"
            )}
          >
            {c === "all" ? "All categories" : c}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        {filtered.map((q) => (
          <QuestionRow key={q.id} q={q} />
        ))}
        {filtered.length === 0 && <p className="py-10 text-center text-sm text-muted-foreground">No questions match these filters yet.</p>}
      </div>
    </div>
  );
}
