import Dexie, { type EntityTable } from "dexie";
import type { ArticleProgress, QuizAttempt, FlashcardReview, InterviewAnswer, MockInterviewSession, RoadmapProgress } from "./types";

class LearnDB extends Dexie {
  progress!: EntityTable<ArticleProgress, "articleId">;
  quizAttempts!: EntityTable<QuizAttempt, "id">;
  flashcardReviews!: EntityTable<FlashcardReview, "cardId">;
  interviewAnswers!: EntityTable<InterviewAnswer, "questionId">;
  mockSessions!: EntityTable<MockInterviewSession, "id">;
  roadmapProgress!: EntityTable<RoadmapProgress, "roadmapId">;

  constructor() {
    super("qaos-learn-db");
    this.version(1).stores({
      progress: "articleId, completed, bookmarked, lastViewedAt",
      quizAttempts: "id, quizId, takenAt",
      flashcardReviews: "cardId, lastReviewedAt",
      interviewAnswers: "questionId, answeredAt",
      mockSessions: "id, level, startedAt, completedAt",
      roadmapProgress: "roadmapId",
    });
  }
}

export const db = new LearnDB();
