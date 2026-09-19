import { BUG_REGISTRY } from "@/lib/playground/bug-registry/registry";
import { isBugActive } from "@/lib/playground/bug-registry/toggle-store";
import { normalizeTokens, jaccardSimilarity } from "@/lib/playground/text-match";
import { db } from "./db";
import type { BugReportInput } from "./types";

export interface MatchResult {
  matchedBugId: string | null;
  matchScore: number;
  severityCorrect: boolean;
  priorityCorrect: boolean;
  qualityPercent: number;
  isDuplicate: boolean;
  xpAwarded: number;
}

export async function matchAndScore(input: BugReportInput): Promise<MatchResult> {
  const activeBugs = BUG_REGISTRY.filter((b) => isBugActive(b.id));

  let best: { id: string; score: number; severity: string; priority: string } | null = null;
  const titleTokens = normalizeTokens(input.title);
  const bodyTokens = normalizeTokens(`${input.stepsToReproduce} ${input.actualResult}`);

  for (const bug of activeBugs) {
    const titleSim = jaccardSimilarity(titleTokens, normalizeTokens(bug.title));
    const bodySim = jaccardSimilarity(bodyTokens, normalizeTokens(`${bug.title} ${bug.keywords.join(" ")}`));
    const moduleBonus = input.module === bug.module ? 0.15 : 0;
    const totalSim = Math.min(1, 0.5 * titleSim + 0.35 * bodySim + moduleBonus);
    if (!best || totalSim > best.score) {
      best = { id: bug.id, score: totalSim, severity: bug.severity, priority: bug.priority };
    }
  }

  const completenessChecks = [
    input.stepsToReproduce.trim().split(/\r?\n/).filter(Boolean).length >= 2,
    input.expectedResult.trim().length > 0,
    input.actualResult.trim().length > 0,
    Boolean(input.reproducibility),
    Boolean(input.category),
  ];
  const qualityPercent = Math.round(
    (completenessChecks.filter(Boolean).length / completenessChecks.length) * 100
  );

  if (!best || best.score < 0.25) {
    return {
      matchedBugId: null,
      matchScore: best ? Math.round(best.score * 100) : 0,
      severityCorrect: false,
      priorityCorrect: false,
      qualityPercent,
      isDuplicate: false,
      xpAwarded: 0,
    };
  }

  const severityCorrect = input.severity === best.severity;
  const priorityCorrect = input.priority === best.priority;
  const priorMatches = await db.bugReports.where("matchedBugId").equals(best.id).count();
  const isDuplicate = priorMatches > 0;
  const xpAwarded = (isDuplicate ? 0 : 20) + (severityCorrect ? 10 : 0) + (priorityCorrect ? 10 : 0);

  return {
    matchedBugId: best.id,
    matchScore: Math.round(best.score * 100),
    severityCorrect,
    priorityCorrect,
    qualityPercent,
    isDuplicate,
    xpAwarded,
  };
}
