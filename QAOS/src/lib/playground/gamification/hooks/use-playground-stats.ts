"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { useGamificationStore } from "../store";
import { getLevelInfo } from "../levels";
import { getDexiePlaygroundCounts } from "../stats";
import type { PlaygroundStats } from "../types";

export function usePlaygroundStats(): PlaygroundStats {
  const xp = useGamificationStore((s) => s.xp);
  const streak = useGamificationStore((s) => s.streak.current);
  const counts = useLiveQuery(() => getDexiePlaygroundCounts(), []);

  return {
    bugsFound: counts?.bugsFound ?? 0,
    totalActiveBugs: counts?.totalActiveBugs ?? 0,
    testCasesCreated: counts?.testCasesCreated ?? 0,
    bestCoveragePercentAny: counts?.bestCoveragePercentAny ?? 0,
    challengesPassed: counts?.challengesPassed ?? 0,
    totalChallenges: counts?.totalChallenges ?? 0,
    streak,
    level: getLevelInfo(xp).level,
  };
}
