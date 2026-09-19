import type { DecisionTableRule } from "../types";

export function scoreDecisionTable(rules: DecisionTableRule[], answers: Record<string, string>): number {
  if (rules.length === 0) return 0;
  const correct = rules.filter((r) => answers[r.id] === r.action).length;
  return Math.round((correct / rules.length) * 100);
}
