import type { HelpEntry } from "./types";
import { HELP_ENTRIES } from "./knowledge-base";

// Deterministic keyword matching — no AI, no network call. Everything here runs instantly and
// entirely client-side.

const STOPWORDS = new Set([
  "a", "an", "the", "is", "are", "do", "does", "did", "i", "me", "my", "to", "for", "in", "on", "of",
  "how", "what", "where", "when", "why", "can", "could", "should", "would", "please", "you", "your",
  "it", "its", "this", "that", "with", "and", "or", "up", "so", "get", "help", "want", "need",
]);

// Small suffix-stripping "stemmer" — not linguistically complete, just enough to fold common
// plural/verb variants (notes/note, adding/add, created/create) onto the same token.
function stem(word: string): string {
  if (word.length > 5 && word.endsWith("ies")) return `${word.slice(0, -3)}y`;
  if (word.length > 4 && word.endsWith("es")) return word.slice(0, -2);
  if (word.length > 4 && word.endsWith("ing")) return word.slice(0, -3);
  if (word.length > 4 && word.endsWith("ed")) return word.slice(0, -2);
  if (word.length > 4 && word.endsWith("s") && !word.endsWith("ss")) return word.slice(0, -1);
  return word;
}

// Hand-curated synonyms for phrasing that wouldn't otherwise share a stem with the KB's wording.
const SYNONYMS: Record<string, string> = {
  make: "create",
  new: "create",
  write: "create",
  build: "create",
  setup: "create",
  delete: "remove",
  erase: "remove",
  locate: "find",
  lookup: "find",
  save: "export",
  download: "export",
  upload: "add",
  attach: "add",
};

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter((w) => w.length > 0 && !STOPWORDS.has(w))
    .map((w) => SYNONYMS[w] ?? w)
    .map(stem);
}

interface EntryIndex {
  entry: HelpEntry;
  tokens: Set<string>;
  questionTokens: Set<string>;
  moduleTokens: Set<string>;
}

let index: EntryIndex[] | null = null;

function getIndex(): EntryIndex[] {
  if (index) return index;
  index = HELP_ENTRIES.map((entry) => {
    const questionTokens = new Set(tokenize(entry.question));
    const moduleTokens = new Set(tokenize(entry.module));
    const keywordTokens = tokenize(entry.keywords.join(" "));
    const tokens = new Set([...questionTokens, ...moduleTokens, ...keywordTokens]);
    return { entry, tokens, questionTokens, moduleTokens };
  });
  return index;
}

export interface HelpMatch {
  entry: HelpEntry;
  score: number;
}

const MIN_SCORE = 1;

export function searchHelp(query: string, limit = 4): HelpMatch[] {
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) return [];

  const normalizedQuery = query.toLowerCase().trim();

  const scored = getIndex().map(({ entry, tokens, questionTokens, moduleTokens }) => {
    let score = 0;
    for (const token of queryTokens) {
      if (questionTokens.has(token)) score += 3;
      else if (tokens.has(token)) score += 2;
      else if (moduleTokens.has(token)) score += 1;
    }
    // Small bonus when the whole question text is a substring of (or contains) the query —
    // catches near-verbatim phrasing even if tokenization split things unusually.
    if (normalizedQuery.length > 3 && entry.question.toLowerCase().includes(normalizedQuery)) score += 2;
    return { entry, score };
  });

  return scored
    .filter((s) => s.score >= MIN_SCORE)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function getStarterQuestions(): HelpEntry[] {
  const ids = ["notes-add", "bug-create", "tc-create", "convert-ocr", "gen-generate", "qt-duration"];
  return ids.map((id) => HELP_ENTRIES.find((e) => e.id === id)).filter((e): e is HelpEntry => e !== undefined);
}
