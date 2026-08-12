"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles } from "lucide-react";
import { uid } from "@/lib/learn/id";
import { startMockSession, updateMockSessionAnswers, completeMockSession, recordInterviewAnswer } from "@/lib/learn/repo/interview-repo";
import { awardXp } from "@/lib/learn/gamification/award-xp";
import { XP_REWARDS } from "@/lib/learn/gamification/levels";
import { evaluateAnswer, type AnswerFeedback } from "@/lib/learn/ai/evaluate-answer";
import { INTERVIEW_QUESTIONS, INTERVIEW_LEVELS } from "@/lib/learn/content/registry";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { InterviewLevel, InterviewQuestion } from "@/lib/learn/content/types";

const LEVEL_LABELS: Record<InterviewLevel, string> = {
  fresher: "Fresher",
  "1-2y": "1-2 Years",
  "3-5y": "3-5 Years",
  senior: "Senior",
  lead: "Lead",
  sdet: "SDET",
  architect: "Architect",
};

const SESSION_LENGTH = 5;

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

type Stage = "pick-level" | "in-progress" | "summary";

export function MockInterview() {
  const [stage, setStage] = React.useState<Stage>("pick-level");
  const [level, setLevel] = React.useState<InterviewLevel | null>(null);
  const [questions, setQuestions] = React.useState<InterviewQuestion[]>([]);
  const [index, setIndex] = React.useState(0);
  const [answer, setAnswer] = React.useState("");
  const [revealed, setRevealed] = React.useState(false);
  const [rating, setRating] = React.useState<number | null>(null);
  const [feedback, setFeedback] = React.useState<AnswerFeedback | null>(null);
  const [gettingFeedback, setGettingFeedback] = React.useState(false);
  const [sessionId, setSessionId] = React.useState<string | null>(null);
  const [sessionAnswers, setSessionAnswers] = React.useState<Record<string, { userAnswer: string; selfRating: number | null }>>({});

  function startSession(chosenLevel: InterviewLevel) {
    const pool = INTERVIEW_QUESTIONS.filter((q) => q.level === chosenLevel);
    const picked = shuffle(pool).slice(0, Math.min(SESSION_LENGTH, pool.length));
    if (picked.length === 0) return;
    const id = uid();
    setSessionId(id);
    setLevel(chosenLevel);
    setQuestions(picked);
    setIndex(0);
    setAnswer("");
    setRevealed(false);
    setRating(null);
    setFeedback(null);
    setSessionAnswers({});
    setStage("in-progress");
    void startMockSession(id, chosenLevel, picked.map((q) => q.id));
  }

  const current = questions[index];

  async function handleGetFeedback() {
    if (!current) return;
    setGettingFeedback(true);
    try {
      setFeedback(await evaluateAnswer(current.question, answer));
    } finally {
      setGettingFeedback(false);
    }
  }

  async function handleNext() {
    if (!current || !sessionId) return;
    const nextAnswers = { ...sessionAnswers, [current.id]: { userAnswer: answer, selfRating: rating } };
    setSessionAnswers(nextAnswers);
    // Mirror into the shared interviewAnswers table so mock-interview practice also counts
    // toward the Interview Readiness score and "questions answered" achievements — not just
    // answers given through the standalone Interview Prep browse list.
    await recordInterviewAnswer(current.id, answer, rating as 1 | 2 | 3 | 4 | 5 | null);

    if (index + 1 >= questions.length) {
      await completeMockSession(sessionId, nextAnswers);
      await awardXp(questions.length * XP_REWARDS.interviewQuestionAnswered, "completed a mock interview");
      setStage("summary");
    } else {
      await updateMockSessionAnswers(sessionId, nextAnswers);
      setIndex((i) => i + 1);
      setAnswer("");
      setRevealed(false);
      setRating(null);
      setFeedback(null);
    }
  }

  if (stage === "pick-level") {
    return (
      <div className="mx-auto max-w-xl px-4 py-8 sm:px-6 lg:px-8">
        <Link href="/learn/interview-prep" className="mb-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-3.5" />
          Interview Prep
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">Mock Interview</h1>
        <p className="mt-1 text-muted-foreground">
          Pick a level — you&apos;ll get {SESSION_LENGTH} random questions, one at a time. Write your own answer before revealing the model one.
        </p>
        <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {INTERVIEW_LEVELS.map((l) => {
            const count = INTERVIEW_QUESTIONS.filter((q) => q.level === l).length;
            return (
              <button
                key={l}
                type="button"
                disabled={count === 0}
                onClick={() => startSession(l)}
                className="rounded-lg border border-border p-4 text-left transition-colors hover:border-primary/40 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <p className="font-medium">{LEVEL_LABELS[l]}</p>
                <p className="text-xs text-muted-foreground">
                  {count} question{count === 1 ? "" : "s"} available
                </p>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  if (stage === "summary") {
    const ratings = Object.values(sessionAnswers)
      .map((a) => a.selfRating)
      .filter((r): r is number => r !== null);
    const avg = ratings.length ? (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : "—";
    return (
      <div className="mx-auto max-w-xl px-4 py-8 text-center sm:px-6 lg:px-8">
        <Sparkles className="mx-auto size-8 text-primary" />
        <h1 className="mt-3 text-2xl font-semibold tracking-tight">Session complete!</h1>
        <p className="mt-2 text-muted-foreground">
          You answered {questions.length} {level && LEVEL_LABELS[level]} questions. Average self-rating: {avg} / 5.
        </p>
        <div className="mt-6 flex justify-center gap-2">
          <Button variant="outline" onClick={() => setStage("pick-level")}>
            Practice another level
          </Button>
          <Button nativeButton={false} render={<Link href="/learn/interview-prep" />}>
            Back to Interview Prep
          </Button>
        </div>
      </div>
    );
  }

  if (!current) return null;

  return (
    <div className="mx-auto max-w-xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/learn/interview-prep" className="mb-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-3.5" />
        Exit mock interview
      </Link>
      <p className="text-xs text-muted-foreground">
        Question {index + 1} of {questions.length} · {level && LEVEL_LABELS[level]}
      </p>
      <h1 className="mt-1 text-xl font-semibold tracking-tight">{current.question}</h1>

      <Textarea
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Answer as if you were in the interview…"
        rows={5}
        className="mt-4 text-sm"
        disabled={revealed}
      />

      {!revealed ? (
        <div className="mt-3 flex gap-2">
          <Button onClick={() => setRevealed(true)} disabled={!answer.trim()}>
            Reveal model answer
          </Button>
          <Button variant="outline" onClick={() => void handleGetFeedback()} disabled={!answer.trim() || gettingFeedback}>
            {gettingFeedback ? "Thinking…" : "Get quick feedback"}
          </Button>
        </div>
      ) : (
        <>
          <div className="mt-4 rounded-md bg-muted/40 p-3 text-sm">
            <p className="mb-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">Model answer</p>
            <p className="text-muted-foreground">{current.modelAnswer}</p>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Rate yourself:</span>
            {[1, 2, 3, 4, 5].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRating(r)}
                className={cn(
                  "size-8 rounded-full border text-sm font-medium",
                  rating === r ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-accent/50"
                )}
              >
                {r}
              </button>
            ))}
          </div>
          <Button className="mt-4 w-full" disabled={rating === null} onClick={() => void handleNext()}>
            {index + 1 >= questions.length ? "Finish" : "Next question"}
          </Button>
        </>
      )}

      {feedback && <p className="mt-3 rounded-md border border-primary/30 bg-primary/5 p-3 text-xs text-muted-foreground">{feedback.feedback}</p>}
    </div>
  );
}
