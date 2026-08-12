export type AchievementCondition =
  | { type: "articlesCompleted"; count: number }
  | { type: "quizzesCompleted"; count: number }
  | { type: "streak"; days: number }
  | { type: "level"; level: number }
  | { type: "flashcardSetsReviewed"; count: number }
  | { type: "interviewQuestionsAnswered"; count: number }
  | { type: "roadmapCompleted"; roadmapId: string };

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: AchievementCondition;
}

export interface AchievementStats {
  articlesCompleted: number;
  quizzesCompleted: number;
  streakCurrent: number;
  level: number;
  flashcardSetsReviewed: number;
  interviewQuestionsAnswered: number;
  completedRoadmapIds: string[];
}

function conditionMet(c: AchievementCondition, stats: AchievementStats): boolean {
  switch (c.type) {
    case "articlesCompleted":
      return stats.articlesCompleted >= c.count;
    case "quizzesCompleted":
      return stats.quizzesCompleted >= c.count;
    case "streak":
      return stats.streakCurrent >= c.days;
    case "level":
      return stats.level >= c.level;
    case "flashcardSetsReviewed":
      return stats.flashcardSetsReviewed >= c.count;
    case "interviewQuestionsAnswered":
      return stats.interviewQuestionsAnswered >= c.count;
    case "roadmapCompleted":
      return stats.completedRoadmapIds.includes(c.roadmapId);
  }
}

export function evaluateNewAchievements(stats: AchievementStats, unlockedIds: string[]): string[] {
  return ACHIEVEMENTS.filter((a) => !unlockedIds.includes(a.id) && conditionMet(a.condition, stats)).map((a) => a.id);
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: "first-article", title: "First Steps", description: "Complete your first article", icon: "BookOpen", condition: { type: "articlesCompleted", count: 1 } },
  { id: "article-10", title: "Curious Mind", description: "Complete 10 articles", icon: "BookMarked", condition: { type: "articlesCompleted", count: 10 } },
  { id: "article-25", title: "Knowledge Seeker", description: "Complete 25 articles", icon: "Library", condition: { type: "articlesCompleted", count: 25 } },
  { id: "quiz-1", title: "Quiz Taker", description: "Complete your first quiz", icon: "ListChecks", condition: { type: "quizzesCompleted", count: 1 } },
  { id: "quiz-10", title: "Quiz Master", description: "Complete 10 quizzes", icon: "Award", condition: { type: "quizzesCompleted", count: 10 } },
  { id: "streak-3", title: "Getting Consistent", description: "Reach a 3-day streak", icon: "Flame", condition: { type: "streak", days: 3 } },
  { id: "streak-7", title: "Week Warrior", description: "Reach a 7-day streak", icon: "Flame", condition: { type: "streak", days: 7 } },
  { id: "streak-30", title: "Unstoppable", description: "Reach a 30-day streak", icon: "Flame", condition: { type: "streak", days: 30 } },
  { id: "level-5", title: "Junior QA", description: "Reach level 5", icon: "Trophy", condition: { type: "level", level: 5 } },
  { id: "level-10", title: "QA Engineer", description: "Reach level 10", icon: "Trophy", condition: { type: "level", level: 10 } },
  { id: "level-20", title: "Senior QA", description: "Reach level 20", icon: "Crown", condition: { type: "level", level: 20 } },
  { id: "flashcards-1", title: "Card Shark", description: "Review a full flashcard set", icon: "Layers", condition: { type: "flashcardSetsReviewed", count: 1 } },
  { id: "interview-10", title: "Interview Ready", description: "Answer 10 interview questions", icon: "MessageSquare", condition: { type: "interviewQuestionsAnswered", count: 10 } },
  { id: "interview-50", title: "Interview Pro", description: "Answer 50 interview questions", icon: "Mic", condition: { type: "interviewQuestionsAnswered", count: 50 } },
];
