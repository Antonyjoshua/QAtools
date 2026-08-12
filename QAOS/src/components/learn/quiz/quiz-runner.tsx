"use client";

import * as React from "react";
import Link from "next/link";
import { CheckCircle2, XCircle, ArrowLeft, RotateCcw } from "lucide-react";
import { submitQuizAttempt } from "@/lib/learn/repo/quiz-repo";
import { awardXp } from "@/lib/learn/gamification/award-xp";
import { XP_REWARDS } from "@/lib/learn/gamification/levels";
import { getModuleMeta } from "@/lib/learn/content/registry";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Quiz } from "@/lib/learn/content/types";

export function QuizRunner({ quiz }: { quiz: Quiz }) {
  const [answers, setAnswers] = React.useState<Record<string, number>>({});
  const [submitted, setSubmitted] = React.useState(false);
  const [score, setScore] = React.useState(0);
  const [submitting, setSubmitting] = React.useState(false);

  const allAnswered = quiz.questions.every((q) => answers[q.id] !== undefined);
  const moduleMeta = getModuleMeta(quiz.moduleId);

  async function handleSubmit() {
    if (!allAnswered || submitting) return;
    setSubmitting(true);
    try {
      const correctCount = quiz.questions.filter((q) => answers[q.id] === q.correctIndex).length;
      await submitQuizAttempt(quiz.id, answers, correctCount, quiz.questions.length);
      const isPerfect = correctCount === quiz.questions.length;
      const xp = XP_REWARDS.quizCompleted + (isPerfect ? XP_REWARDS.quizPerfectBonus : 0);
      await awardXp(xp, isPerfect ? `perfect score on "${quiz.title}"` : `completed "${quiz.title}"`);
      setScore(correctCount);
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  }

  function handleRetake() {
    setAnswers({});
    setSubmitted(false);
    setScore(0);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href={`/learn/${quiz.moduleId}`} className="mb-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-3.5" />
        {moduleMeta?.title ?? quiz.moduleId}
      </Link>
      <h1 className="text-2xl font-semibold tracking-tight">{quiz.title}</h1>
      <p className="mt-1 text-sm text-muted-foreground">{quiz.questions.length} questions</p>

      {submitted && (
        <div className="my-6 rounded-xl border border-primary/30 bg-primary/5 p-5 text-center">
          <p className="text-3xl font-bold tabular-nums">
            {score} / {quiz.questions.length}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">{Math.round((score / quiz.questions.length) * 100)}% correct</p>
          <Button variant="outline" size="sm" className="mt-3 gap-1.5" onClick={handleRetake}>
            <RotateCcw className="size-3.5" />
            Retake quiz
          </Button>
        </div>
      )}

      <div className="mt-6 flex flex-col gap-6">
        {quiz.questions.map((q, qi) => {
          const selected = answers[q.id];
          return (
            <div key={q.id} className="rounded-lg border border-border p-4">
              <p className="mb-3 font-medium">
                {qi + 1}. {q.question}
              </p>
              <div className="flex flex-col gap-2">
                {q.options.map((opt, oi) => {
                  const isSelected = selected === oi;
                  const isCorrect = oi === q.correctIndex;
                  return (
                    <button
                      key={oi}
                      type="button"
                      disabled={submitted}
                      onClick={() => setAnswers((a) => ({ ...a, [q.id]: oi }))}
                      className={cn(
                        "flex items-center gap-2 rounded-md border px-3 py-2 text-left text-sm transition-colors",
                        !submitted && isSelected && "border-primary bg-primary/10",
                        !submitted && !isSelected && "border-border hover:bg-accent/50",
                        submitted && isCorrect && "border-success bg-success/10",
                        submitted && isSelected && !isCorrect && "border-destructive bg-destructive/10",
                        submitted && !isSelected && !isCorrect && "border-border opacity-60"
                      )}
                    >
                      {submitted && isCorrect && <CheckCircle2 className="size-4 shrink-0 text-success" />}
                      {submitted && isSelected && !isCorrect && <XCircle className="size-4 shrink-0 text-destructive" />}
                      {opt}
                    </button>
                  );
                })}
              </div>
              {submitted && <p className="mt-2 text-xs text-muted-foreground">{q.explanation}</p>}
            </div>
          );
        })}
      </div>

      {!submitted && (
        <Button className="mt-6 w-full" disabled={!allAnswered || submitting} onClick={() => void handleSubmit()}>
          Submit Quiz
        </Button>
      )}
    </div>
  );
}
