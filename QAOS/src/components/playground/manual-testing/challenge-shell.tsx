"use client";

import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { recordAttempt } from "@/lib/playground/manual-testing/attempts-repo";
import type { Challenge } from "@/lib/playground/manual-testing/types";

interface Props {
  challenge: Challenge;
  children: (args: { onSubmit: (score: number) => void; submitted: boolean }) => ReactNode;
}

const HINT_LABELS = ["Hint 1", "Hint 2", "Expert Hint"];

export function ChallengeShell({ challenge, children }: Props) {
  const [hintsShown, setHintsShown] = useState(0);
  const [result, setResult] = useState<{ score: number; passed: boolean; xpAwarded: number } | null>(
    null
  );

  async function handleSubmit(score: number) {
    const attempt = await recordAttempt(challenge, score);
    setResult({ score: attempt.score, passed: attempt.passed, xpAwarded: attempt.xpAwarded });
  }

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-card p-4">
        <p className="text-sm">{challenge.prompt}</p>
      </div>

      {children({ onSubmit: handleSubmit, submitted: !!result })}

      {!result && (
        <div className="flex flex-wrap items-start gap-2">
          {challenge.hints.slice(0, hintsShown).map((h) => (
            <p key={h} className="w-full rounded-md bg-muted p-2 text-xs text-muted-foreground">
              💡 {h}
            </p>
          ))}
          {hintsShown < 3 && (
            <Button size="sm" variant="outline" onClick={() => setHintsShown((n) => n + 1)}>
              {HINT_LABELS[hintsShown]}
            </Button>
          )}
        </div>
      )}

      {result && (
        <div className="space-y-2 rounded-lg border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <span
              className={`text-lg font-bold ${result.passed ? "text-status-good" : "text-status-critical"}`}
            >
              {result.score}% — {result.passed ? "Passed" : "Not yet"}
            </span>
            {result.xpAwarded > 0 && (
              <span className="text-sm font-medium text-xp">+{result.xpAwarded} XP</span>
            )}
          </div>
          <Progress value={result.score} />
          <div className="space-y-1.5 pt-2 text-sm">
            <p>
              <span className="font-semibold">Explanation: </span>
              {challenge.explanation}
            </p>
            <p>
              <span className="font-semibold">Why it matters: </span>
              {challenge.whyItMatters}
            </p>
            <p>
              <span className="font-semibold">Common mistakes: </span>
              {challenge.commonMistakes}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
