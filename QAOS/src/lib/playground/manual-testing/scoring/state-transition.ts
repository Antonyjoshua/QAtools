import type { TransitionPair } from "../types";

export function scoreStateTransition(
  transitions: TransitionPair[],
  answers: Record<string, boolean>
): number {
  if (transitions.length === 0) return 0;
  const correct = transitions.filter((t) => answers[t.id] === t.expectedValid).length;
  return Math.round((correct / transitions.length) * 100);
}
