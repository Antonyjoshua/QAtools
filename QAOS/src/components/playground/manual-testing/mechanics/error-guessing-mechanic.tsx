"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { scoreErrorGuessing } from "@/lib/playground/manual-testing/scoring/error-guessing";
import type { ErrorGuessingChallenge } from "@/lib/playground/manual-testing/types";

interface Props {
  challenge: ErrorGuessingChallenge;
  onSubmit: (score: number) => void;
  submitted: boolean;
}

export function ErrorGuessingMechanic({ challenge, onSubmit, submitted }: Props) {
  const [text, setText] = useState("");

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="mb-2 text-sm text-muted-foreground">{challenge.context}</p>
      <Textarea
        rows={6}
        value={text}
        disabled={submitted}
        onChange={(e) => setText(e.target.value)}
        placeholder={"One guess per line…"}
      />
      {!submitted && (
        <Button className="mt-3" onClick={() => onSubmit(scoreErrorGuessing(text, challenge.keywordGroups))}>
          Submit Guesses
        </Button>
      )}
    </div>
  );
}
