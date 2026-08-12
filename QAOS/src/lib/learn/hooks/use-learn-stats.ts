"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../db";
import { ALL_FLASHCARD_SETS, ROADMAPS } from "../content/registry";
import type { AchievementStats } from "../gamification/achievements";

type LearnStats = Omit<AchievementStats, "level" | "streakCurrent">;

/** Imperative version — use this right after writing to Dexie (e.g. inside a "mark complete"
 * handler) so achievement checks see fresh data instead of racing the reactive hook below. */
export async function getLearnStats(): Promise<LearnStats> {
  const [articlesCompleted, attempts, reviews, interviewAnswers, roadmapProgress] = await Promise.all([
    db.progress.filter((p) => p.completed).count(),
    db.quizAttempts.toArray(),
    db.flashcardReviews.toArray(),
    db.interviewAnswers.toArray(),
    db.roadmapProgress.toArray(),
  ]);

  // A row exists as soon as the user starts typing (see recordInterviewAnswer); only count it as
  // "answered" once they've actually self-rated, not on an empty in-progress draft.
  const interviewAnswered = interviewAnswers.filter((a) => a.selfRating != null).length;

  const quizzesCompleted = new Set(attempts.map((a) => a.quizId)).size;

  const reviewedCardIds = new Set(reviews.map((r) => r.cardId));
  const flashcardSetsReviewed = ALL_FLASHCARD_SETS.filter((set) => set.cards.every((c) => reviewedCardIds.has(c.id))).length;

  const completedRoadmapIds = roadmapProgress
    .filter((rp) => {
      const roadmap = ROADMAPS.find((r) => r.id === rp.roadmapId);
      return roadmap && roadmap.milestones.length > 0 && rp.completedMilestoneIds.length >= roadmap.milestones.length;
    })
    .map((rp) => rp.roadmapId);

  return { articlesCompleted, quizzesCompleted, flashcardSetsReviewed, interviewQuestionsAnswered: interviewAnswered, completedRoadmapIds };
}

/** Aggregates Dexie-backed progress into the shape the achievement engine needs. Shared across
 * every feature (articles, quizzes, flashcards, interview prep, roadmaps) that can unlock one. */
export function useLearnStats(): LearnStats | undefined {
  return useLiveQuery(getLearnStats);
}
