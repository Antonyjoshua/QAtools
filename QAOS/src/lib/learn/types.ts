// User-generated state — this is what actually lives in Dexie (`db.ts`). Static content
// (articles, quizzes, cheat sheets, ...) lives in `content/types.ts` and is code-defined.

export interface ArticleProgress {
  articleId: string; // primary key
  completed: boolean;
  bookmarked: boolean;
  notes: string;
  timeSpentSec: number;
  lastViewedAt: number;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  score: number;
  total: number;
  answers: Record<string, number>; // questionId -> chosen option index
  takenAt: number;
}

export interface FlashcardReview {
  cardId: string; // primary key
  confidence: "again" | "hard" | "good" | "easy";
  reviewCount: number;
  lastReviewedAt: number;
}

export interface InterviewAnswer {
  questionId: string; // primary key
  userAnswer: string;
  selfRating: 1 | 2 | 3 | 4 | 5 | null;
  answeredAt: number;
}

export interface MockInterviewSession {
  id: string;
  level: string;
  questionIds: string[];
  answers: Record<string, { userAnswer: string; selfRating: number | null }>;
  startedAt: number;
  completedAt: number | null;
}

export interface RoadmapProgress {
  roadmapId: string; // primary key
  completedMilestoneIds: string[];
}
