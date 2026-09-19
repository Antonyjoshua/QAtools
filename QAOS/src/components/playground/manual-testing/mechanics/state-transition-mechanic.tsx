"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { scoreStateTransition } from "@/lib/playground/manual-testing/scoring/state-transition";
import type { StateTransitionChallenge } from "@/lib/playground/manual-testing/types";

interface Props {
  challenge: StateTransitionChallenge;
  onSubmit: (score: number) => void;
  submitted: boolean;
}

export function StateTransitionMechanic({ challenge, onSubmit, submitted }: Props) {
  const [answers, setAnswers] = useState<Record<string, boolean>>({});

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="mb-3 text-xs text-muted-foreground">{challenge.diagramDescription}</p>
      <div className="space-y-2">
        {challenge.transitions.map((t) => (
          <div
            key={t.id}
            className="flex items-center justify-between rounded-md border border-border p-2 text-sm"
          >
            <span>
              {t.from} → {t.to}
            </span>
            <div className="flex gap-1.5">
              <Button
                size="sm"
                variant={answers[t.id] === true ? "default" : "outline"}
                disabled={submitted}
                onClick={() => setAnswers((a) => ({ ...a, [t.id]: true }))}
              >
                Valid
              </Button>
              <Button
                size="sm"
                variant={answers[t.id] === false ? "default" : "outline"}
                disabled={submitted}
                onClick={() => setAnswers((a) => ({ ...a, [t.id]: false }))}
              >
                Invalid
              </Button>
            </div>
          </div>
        ))}
      </div>
      {!submitted && (
        <Button
          className="mt-3"
          onClick={() => onSubmit(scoreStateTransition(challenge.transitions, answers))}
        >
          Submit Transitions
        </Button>
      )}
    </div>
  );
}
