import type { PlaygroundStats } from "./types";
import { useGamificationStore } from "./store";
import { getLevelInfo } from "./levels";
import { BUG_REGISTRY } from "@/lib/playground/bug-registry/registry";
import { isBugActive } from "@/lib/playground/bug-registry/toggle-store";
import { db as bugHuntDb } from "@/lib/playground/bug-hunter/db";
import { db as caseBankDb } from "@/lib/playground/testcase-lab/db";
import { REQUIREMENTS } from "@/lib/playground/testcase-lab/requirements-seed";
import { scoreCoverage } from "@/lib/playground/testcase-lab/scoring";
import { db as challengeDb } from "@/lib/playground/manual-testing/db";
import { CHALLENGES } from "@/lib/playground/manual-testing/challenges-seed";

export interface DexiePlaygroundCounts {
  bugsFound: number;
  totalActiveBugs: number;
  testCasesCreated: number;
  bestCoveragePercentAny: number;
  challengesPassed: number;
  totalChallenges: number;
}

/** Aggregates across the Bug Hunter, Test Case Lab, and Manual Testing Dexie databases. */
export async function getDexiePlaygroundCounts(): Promise<DexiePlaygroundCounts> {
  const [bugReports, testCases, attempts] = await Promise.all([
    bugHuntDb.bugReports.toArray(),
    caseBankDb.testCases.toArray(),
    challengeDb.attempts.toArray(),
  ]);

  const bugsFound = new Set(
    bugReports.filter((r) => r.matchedBugId && !r.isDuplicate).map((r) => r.matchedBugId as string)
  ).size;
  const totalActiveBugs = BUG_REGISTRY.filter((b) => isBugActive(b.id)).length;

  const testCasesCreated = testCases.length;
  const bestCoveragePercentAny = REQUIREMENTS.reduce((max, req) => {
    const casesForReq = testCases.filter((tc) => tc.requirementId === req.id);
    const { overall } = scoreCoverage(req, casesForReq);
    return Math.max(max, overall);
  }, 0);

  const challengesPassed = new Set(attempts.filter((a) => a.passed).map((a) => a.challengeId)).size;
  const totalChallenges = CHALLENGES.length;

  return { bugsFound, totalActiveBugs, testCasesCreated, bestCoveragePercentAny, challengesPassed, totalChallenges };
}

/** Non-reactive snapshot used by awardXp() to evaluate badge conditions after an XP-earning action. */
export async function getPlaygroundStats(): Promise<PlaygroundStats> {
  const state = useGamificationStore.getState();
  const counts = await getDexiePlaygroundCounts();
  return {
    ...counts,
    streak: state.streak.current,
    level: getLevelInfo(state.xp).level,
  };
}
