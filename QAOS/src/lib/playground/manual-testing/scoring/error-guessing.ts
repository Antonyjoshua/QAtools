import { scoreKeywordCoverage } from "@/lib/playground/text-match";

export function scoreErrorGuessing(freeText: string, keywordGroups: string[][]): number {
  return scoreKeywordCoverage(freeText, keywordGroups).percent;
}
