// ---------------------------------------------------------------------------
// Static content model — everything here is code-defined data (see
// content/modules/*), not user data. Mirrors the registry pattern already
// used for resume templates / calculators / generators in this app: swapping
// this for a real CMS/DB later means changing the data source behind
// `getArticle`/`getModule`/etc., not the types or the components that render them.
// ---------------------------------------------------------------------------

export const KNOWLEDGE_MODULES = [
  "manual-testing",
  "automation-testing",
  "programming",
  "api-testing",
  "database-testing",
  "performance-testing",
  "security-testing",
  "mobile-testing",
  "devops",
  "ai-testing",
] as const;
export type KnowledgeModuleId = (typeof KNOWLEDGE_MODULES)[number];

export interface KnowledgeModuleMeta {
  id: KnowledgeModuleId;
  title: string;
  description: string;
  icon: string; // lucide icon name, resolved via DynamicIcon
}

export interface CodeExample {
  language: string;
  code: string;
  caption?: string;
}

export interface MermaidDiagram {
  title: string;
  code: string;
}

export interface Reference {
  label: string;
  url: string;
}

/**
 * A single knowledge-library topic. Fixed-shape (not a reorderable section list) because this is
 * fixed reference content authored by us, not something end users customize — unlike e.g. the
 * Resume Builder's section model, which needed flexibility because users edit it directly.
 */
export interface Article {
  id: string;
  moduleId: KnowledgeModuleId;
  slug: string;
  title: string;
  summary: string;
  readingTimeMin: number;
  definition: string;
  explanation: string[]; // paragraphs
  examples: CodeExample[];
  advantages: string[];
  disadvantages: string[];
  diagrams: MermaidDiagram[];
  commonMistakes: string[];
  bestPractices: string[];
  summaryPoints: string[];
  references: Reference[];
  interviewQuestionIds: string[];
  quizId: string | null;
  flashcardSetId: string | null;
}

/** A topic outline registered for modules not yet fully authored — keeps the library's
 * information architecture complete without faking article bodies. */
export interface ArticleOutline {
  moduleId: KnowledgeModuleId;
  title: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation: string;
}

export interface Quiz {
  id: string;
  moduleId: KnowledgeModuleId;
  title: string;
  questions: QuizQuestion[];
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
}

export interface FlashcardSet {
  id: string;
  moduleId: KnowledgeModuleId;
  title: string;
  cards: Flashcard[];
}

export interface CheatSheetSection {
  heading: string;
  items: { term: string; description: string }[];
}

export interface CheatSheet {
  id: string;
  title: string;
  description: string;
  sections: CheatSheetSection[];
}

export const BOOK_CATEGORIES = ["Manual Testing", "Automation", "API", "SQL", "Programming", "DevOps", "AI Testing"] as const;
export type BookCategory = (typeof BOOK_CATEGORIES)[number];

export interface Book {
  id: string;
  title: string;
  author: string;
  publisher: string;
  edition: string;
  category: BookCategory;
  summary: string;
  keyLearnings: string[];
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  accentColor: string; // used for the generated cover, no external image assets
  purchaseLink?: string;
}

export interface RoadmapMilestone {
  id: string;
  title: string;
  description: string;
  relatedArticleIds?: string[];
}

export interface Roadmap {
  id: string;
  title: string;
  description: string;
  milestones: RoadmapMilestone[];
}

export const INTERVIEW_LEVELS = ["fresher", "1-2y", "3-5y", "senior", "lead", "sdet", "architect"] as const;
export type InterviewLevel = (typeof INTERVIEW_LEVELS)[number];

export const INTERVIEW_CATEGORIES = ["technical", "hr", "scenario", "coding", "sql", "api", "playwright", "selenium"] as const;
export type InterviewCategory = (typeof INTERVIEW_CATEGORIES)[number];

export interface InterviewQuestion {
  id: string;
  level: InterviewLevel;
  category: InterviewCategory;
  question: string;
  modelAnswer: string;
  tags: string[];
}

export const EXERCISE_TYPES = ["bug-finding", "test-case-writing", "automation-challenge"] as const;
export type ExerciseType = (typeof EXERCISE_TYPES)[number];

export interface Exercise {
  id: string;
  type: ExerciseType;
  title: string;
  prompt: string;
  context?: CodeExample;
  modelSolution: string;
}
