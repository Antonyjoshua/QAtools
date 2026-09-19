import { db } from "./db";
import { uid } from "@/lib/playground/id";
import { awardXp } from "@/lib/playground/gamification/award-xp";
import type { Challenge, ChallengeAttempt } from "./types";

const PASS_THRESHOLD = 70;

export async function recordAttempt(challenge: Challenge, score: number): Promise<ChallengeAttempt> {
  const passed = score >= PASS_THRESHOLD;
  const attempt: ChallengeAttempt = {
    id: uid(),
    challengeId: challenge.id,
    mechanic: challenge.mechanic,
    technique: challenge.technique,
    score,
    passed,
    xpAwarded: 0,
    attemptedAt: new Date().toISOString(),
  };

  if (passed) {
    const priorPasses = await db.attempts
      .where("challengeId")
      .equals(challenge.id)
      .and((a) => a.passed)
      .count();
    if (priorPasses === 0) {
      attempt.xpAwarded = challenge.xp;
    }
  }

  await db.attempts.add(attempt);

  if (attempt.xpAwarded > 0) {
    await awardXp(attempt.xpAwarded, `passed "${challenge.title}"`);
  }

  return attempt;
}
