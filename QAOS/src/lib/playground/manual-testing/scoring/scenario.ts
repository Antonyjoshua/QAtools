import { diceScore, scoreKeywordCoverage } from "@/lib/playground/text-match";
import type { ScenarioOption } from "../types";

export function scoreScenarioMultiSelect(options: ScenarioOption[], selectedIds: Set<string>): number {
  const correctIds = new Set(options.filter((o) => o.correct).map((o) => o.id));
  return Math.round(diceScore(selectedIds, correctIds) * 100);
}

export function scoreScenarioShortAnswer(freeText: string, keywordGroups: string[][]): number {
  return scoreKeywordCoverage(freeText, keywordGroups).percent;
}
