"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../db";

export function useAttemptsForChallenge(challengeId: string) {
  return (
    useLiveQuery(() => db.attempts.where("challengeId").equals(challengeId).toArray(), [challengeId]) ?? []
  );
}

export function useAllAttempts() {
  return useLiveQuery(() => db.attempts.toArray(), []) ?? [];
}

export function usePassedChallengeIds(): Set<string> {
  const attempts = useAllAttempts();
  return new Set(attempts.filter((a) => a.passed).map((a) => a.challengeId));
}
