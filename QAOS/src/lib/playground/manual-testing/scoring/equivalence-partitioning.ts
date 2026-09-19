import type { EpItem } from "../types";

export function scoreEp(items: EpItem[], answers: Record<string, boolean>): number {
  if (items.length === 0) return 0;
  const correct = items.filter((item) => answers[item.id] === item.correctValid).length;
  return Math.round((correct / items.length) * 100);
}
