import { MANUAL_TESTING_ARTICLES, MANUAL_TESTING_QUIZ, MANUAL_TESTING_FLASHCARDS } from "./modules/manual-testing";
import { ARTICLE_OUTLINES, getOutlinesForModule } from "./outlines";
import { INTERVIEW_QUESTIONS } from "./interview-questions";
import { CHEAT_SHEETS } from "./cheatsheets";
import { BOOKS, getBooksByCategory } from "./books";
import { ROADMAPS, getRoadmap } from "./roadmaps";
import { EXERCISES } from "./exercises";
import { MODULE_META, getModuleMeta } from "./modules-meta";
import { BOOK_CATEGORIES, INTERVIEW_LEVELS, INTERVIEW_CATEGORIES } from "./types";
import type { Article, Quiz, FlashcardSet, InterviewLevel } from "./types";

export const ALL_ARTICLES: Article[] = [...MANUAL_TESTING_ARTICLES];
export const ALL_QUIZZES: Quiz[] = [MANUAL_TESTING_QUIZ];
export const ALL_FLASHCARD_SETS: FlashcardSet[] = [MANUAL_TESTING_FLASHCARDS];

export {
  ARTICLE_OUTLINES,
  getOutlinesForModule,
  INTERVIEW_QUESTIONS,
  INTERVIEW_LEVELS,
  INTERVIEW_CATEGORIES,
  CHEAT_SHEETS,
  BOOKS,
  BOOK_CATEGORIES,
  getBooksByCategory,
  ROADMAPS,
  getRoadmap,
  EXERCISES,
  MODULE_META,
  getModuleMeta,
};

export function getArticle(id: string): Article | undefined {
  return ALL_ARTICLES.find((a) => a.id === id);
}

export function getArticleBySlug(moduleId: string, slug: string): Article | undefined {
  return ALL_ARTICLES.find((a) => a.moduleId === moduleId && a.slug === slug);
}

export function getArticlesByModule(moduleId: string): Article[] {
  return ALL_ARTICLES.filter((a) => a.moduleId === moduleId);
}

export function getQuiz(id: string): Quiz | undefined {
  return ALL_QUIZZES.find((q) => q.id === id);
}

export function getFlashcardSet(id: string): FlashcardSet | undefined {
  return ALL_FLASHCARD_SETS.find((f) => f.id === id);
}

export function getCheatSheet(id: string): (typeof CHEAT_SHEETS)[number] | undefined {
  return CHEAT_SHEETS.find((c) => c.id === id);
}

export function getBook(id: string): (typeof BOOKS)[number] | undefined {
  return BOOKS.find((b) => b.id === id);
}

export function getInterviewQuestion(id: string): (typeof INTERVIEW_QUESTIONS)[number] | undefined {
  return INTERVIEW_QUESTIONS.find((q) => q.id === id);
}

export function getInterviewQuestionsByLevel(level: InterviewLevel): typeof INTERVIEW_QUESTIONS {
  return INTERVIEW_QUESTIONS.filter((q) => q.level === level);
}

export interface SearchResult {
  type: "article" | "cheatsheet" | "book" | "roadmap";
  id: string;
  title: string;
  subtitle: string;
}

/** Simple substring search across the static content library. */
export function searchContent(query: string, limit = 8): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const results: SearchResult[] = [];

  for (const a of ALL_ARTICLES) {
    if (a.title.toLowerCase().includes(q) || a.summary.toLowerCase().includes(q)) {
      results.push({ type: "article", id: a.id, title: a.title, subtitle: getModuleMeta(a.moduleId)?.title ?? a.moduleId });
    }
  }
  for (const c of CHEAT_SHEETS) {
    if (c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)) {
      results.push({ type: "cheatsheet", id: c.id, title: c.title, subtitle: "Cheat sheet" });
    }
  }
  for (const b of BOOKS) {
    if (b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)) {
      results.push({ type: "book", id: b.id, title: b.title, subtitle: b.author });
    }
  }
  for (const r of ROADMAPS) {
    if (r.title.toLowerCase().includes(q)) {
      results.push({ type: "roadmap", id: r.id, title: r.title, subtitle: "Roadmap" });
    }
  }

  return results.slice(0, limit);
}
