import { diceScore } from "@/lib/playground/text-match";

export function expectedBoundaryValues(min: number, max: number): number[] {
  return [min - 1, min, min + 1, max - 1, max, max + 1];
}

export function scoreBva(submitted: number[], min: number, max: number): number {
  const expected = new Set(expectedBoundaryValues(min, max));
  const submittedSet = new Set(submitted);
  return Math.round(diceScore(submittedSet, expected) * 100);
}
