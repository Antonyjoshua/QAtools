"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { scoreScenarioMultiSelect, scoreScenarioShortAnswer } from "@/lib/playground/manual-testing/scoring/scenario";
import type { ScenarioChallenge } from "@/lib/playground/manual-testing/types";

interface Props {
  challenge: ScenarioChallenge;
  onSubmit: (score: number) => void;
  submitted: boolean;
}

export function ScenarioMechanic({ challenge, onSubmit, submitted }: Props) {
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [text, setText] = useState("");

  if (challenge.mode === "multi-select") {
    return (
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="space-y-2">
          {challenge.options.map((opt) => (
            <label
              key={opt.id}
              className="flex items-center gap-2 rounded-md border border-border p-2 text-sm"
            >
              <Checkbox
                checked={selected.has(opt.id)}
                disabled={submitted}
                onCheckedChange={(checked) =>
                  setSelected((s) => {
                    const next = new Set(s);
                    if (checked) next.add(opt.id);
                    else next.delete(opt.id);
                    return next;
                  })
                }
              />
              {opt.label}
            </label>
          ))}
        </div>
        {!submitted && (
          <Button
            className="mt-3"
            onClick={() => onSubmit(scoreScenarioMultiSelect(challenge.options, selected))}
          >
            Submit Answer
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <Textarea
        rows={5}
        value={text}
        disabled={submitted}
        onChange={(e) => setText(e.target.value)}
        placeholder="Your answer…"
      />
      {!submitted && (
        <Button
          className="mt-3"
          onClick={() => onSubmit(scoreScenarioShortAnswer(text, challenge.keywordGroups))}
        >
          Submit Answer
        </Button>
      )}
    </div>
  );
}
