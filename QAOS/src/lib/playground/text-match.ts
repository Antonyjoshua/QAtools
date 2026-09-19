/**
 * Shared scoring kernel used by Bug Hunter matching, Test Case Lab coverage
 * scoring, and every Manual Testing mechanic. Deterministic, keyword/token
 * based heuristics — no AI involved.
 */

export function normalizeTokens(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .split(/\s+/)
      .filter((w) => w.length > 2)
  );
}

/** Intersection-over-union of two token sets. 0 if either set is empty. */
export function jaccardSimilarity(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let intersection = 0;
  for (const w of a) if (b.has(w)) intersection++;
  const union = a.size + b.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

/** F1-style set overlap: rewards both precision and recall in one number. */
export function diceScore<T>(submitted: Set<T>, correct: Set<T>): number {
  if (correct.size === 0) return submitted.size === 0 ? 1 : 0;
  let hit = 0;
  for (const v of submitted) if (correct.has(v)) hit++;
  const denom = submitted.size + correct.size;
  return denom === 0 ? 0 : (2 * hit) / denom;
}

export interface KeywordCoverageResult {
  hitGroups: number;
  totalGroups: number;
  percent: number;
  matchedGroupIndices: number[];
}

/**
 * Greedy bipartite match: each line of free text can credit at most one
 * keyword group, and each keyword group can only be credited once — so
 * padding a single idea across many lines doesn't inflate the score.
 */
export function scoreKeywordCoverage(
  freeText: string,
  keywordGroups: string[][],
  threshold = 0.3
): KeywordCoverageResult {
  if (keywordGroups.length === 0) {
    return { hitGroups: 0, totalGroups: 0, percent: 100, matchedGroupIndices: [] };
  }

  const lines = freeText
    .split(/\r?\n|[.;]/)
    .map((l) => l.trim())
    .filter(Boolean);

  const pairs: { li: number; gi: number; sim: number }[] = [];
  lines.forEach((line, li) => {
    const lineTokens = normalizeTokens(line);
    keywordGroups.forEach((group, gi) => {
      const groupTokens = normalizeTokens(group.join(" "));
      const sim = jaccardSimilarity(lineTokens, groupTokens);
      if (sim >= threshold) pairs.push({ li, gi, sim });
    });
  });

  pairs.sort((a, b) => b.sim - a.sim);
  const usedLines = new Set<number>();
  const usedGroups = new Set<number>();
  for (const p of pairs) {
    if (usedLines.has(p.li) || usedGroups.has(p.gi)) continue;
    usedLines.add(p.li);
    usedGroups.add(p.gi);
  }

  return {
    hitGroups: usedGroups.size,
    totalGroups: keywordGroups.length,
    percent: Math.round((usedGroups.size / keywordGroups.length) * 100),
    matchedGroupIndices: Array.from(usedGroups),
  };
}
