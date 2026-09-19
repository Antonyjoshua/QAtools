"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { scoreBva } from "@/lib/playground/manual-testing/scoring/bva";
import type { BvaChallenge } from "@/lib/playground/manual-testing/types";

interface Props {
  challenge: BvaChallenge;
  onSubmit: (score: number) => void;
  submitted: boolean;
}

export function BvaMechanic({ challenge, onSubmit, submitted }: Props) {
  const [values, setValues] = useState<string[]>(["", "", "", "", "", ""]);

  function updateValue(i: number, v: string) {
    setValues((arr) => arr.map((x, idx) => (idx === i ? v : x)));
  }

  function handleSubmit() {
    const parsed = values
      .filter((v) => v.trim() !== "")
      .map(Number)
      .filter((n) => !Number.isNaN(n));
    onSubmit(scoreBva(parsed, challenge.min, challenge.max));
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="mb-2 text-sm font-medium">
        {challenge.fieldLabel}: valid range is {challenge.min}–{challenge.max}
      </p>
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
        {values.map((v, i) => (
          <Input
            key={i}
            type="number"
            value={v}
            disabled={submitted}
            onChange={(e) => updateValue(i, e.target.value)}
            placeholder={`Value ${i + 1}`}
          />
        ))}
      </div>
      {!submitted && (
        <Button className="mt-3" onClick={handleSubmit}>
          Submit Boundary Values
        </Button>
      )}
    </div>
  );
}
