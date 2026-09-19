"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { scoreDecisionTable } from "@/lib/playground/manual-testing/scoring/decision-table";
import type { DecisionTableChallenge } from "@/lib/playground/manual-testing/types";

interface Props {
  challenge: DecisionTableChallenge;
  onSubmit: (score: number) => void;
  submitted: boolean;
}

export function DecisionTableMechanic({ challenge, onSubmit, submitted }: Props) {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-card p-4">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left text-xs text-muted-foreground">
            {challenge.conditionLabels.map((label) => (
              <th key={label} className="p-2 font-medium">
                {label}
              </th>
            ))}
            <th className="p-2 font-medium">Action</th>
          </tr>
        </thead>
        <tbody>
          {challenge.rules.map((rule) => (
            <tr key={rule.id} className="border-b border-border last:border-0">
              {challenge.conditionLabels.map((label) => (
                <td key={label} className="p-2">
                  {rule.conditions[label] ? "Yes" : "No"}
                </td>
              ))}
              <td className="p-2">
                <Select
                  value={answers[rule.id] ?? ""}
                  onValueChange={(v) => setAnswers((a) => ({ ...a, [rule.id]: v ?? "" }))}
                >
                  <SelectTrigger size="sm" className="w-full" disabled={submitted}>
                    <SelectValue placeholder="Choose action" />
                  </SelectTrigger>
                  <SelectContent>
                    {challenge.actionOptions.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {!submitted && (
        <Button
          className="mt-3"
          onClick={() => onSubmit(scoreDecisionTable(challenge.rules, answers))}
        >
          Submit Decision Table
        </Button>
      )}
    </div>
  );
}
