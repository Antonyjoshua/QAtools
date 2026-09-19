"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { scoreEp } from "@/lib/playground/manual-testing/scoring/equivalence-partitioning";
import type { EpChallenge } from "@/lib/playground/manual-testing/types";

interface Props {
  challenge: EpChallenge;
  onSubmit: (score: number) => void;
  submitted: boolean;
}

export function EpMechanic({ challenge, onSubmit, submitted }: Props) {
  const [answers, setAnswers] = useState<Record<string, boolean>>({});

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="space-y-2">
        {challenge.items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-md border border-border p-2 text-sm"
          >
            <span>{item.label}</span>
            <div className="flex gap-1.5">
              <Button
                size="sm"
                variant={answers[item.id] === true ? "default" : "outline"}
                disabled={submitted}
                onClick={() => setAnswers((a) => ({ ...a, [item.id]: true }))}
              >
                Valid
              </Button>
              <Button
                size="sm"
                variant={answers[item.id] === false ? "default" : "outline"}
                disabled={submitted}
                onClick={() => setAnswers((a) => ({ ...a, [item.id]: false }))}
              >
                Invalid
              </Button>
            </div>
          </div>
        ))}
      </div>
      {!submitted && (
        <Button className="mt-3" onClick={() => onSubmit(scoreEp(challenge.items, answers))}>
          Submit Classification
        </Button>
      )}
    </div>
  );
}
