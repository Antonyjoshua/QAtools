import {
  type RegexToken,
  analyzeTokens,
  generateValidatedExample,
  splitTopLevelAlternatives,
} from "./regex-engine";
import { COMMON_QA_PATTERNS } from "./regex-reference-data";

export type TestCaseCategory = "positive" | "negative" | "edge";
export type TestResult = "Match" | "No Match";

export interface TestCase {
  id: string;
  data: string;
  expected: TestResult;
  category: TestCaseCategory;
  note?: string;
}

export function runPattern(pattern: string, flags: string, data: string): TestResult {
  try {
    const re = new RegExp(pattern, flags.replace(/g/g, ""));
    return re.test(data) ? "Match" : "No Match";
  } catch {
    return "No Match";
  }
}

function buildNegativeMutators(base: string, pattern: string, tokens: RegexToken[]): string[] {
  const a = analyzeTokens(tokens);
  const candidates: (string | null)[] = [
    base.length > 1 ? base.slice(0, -1) : null,
    base.length > 1 ? base.slice(1) : null,
    pattern.startsWith("^") ? `#${base}` : null,
    pattern.endsWith("$") ? `${base}#` : null,
  ];

  if (tokens.some((t) => t.kind === "class" && (t.label === "\\d" || t.label === "."))) {
    candidates.push(base.replace(/\d/, "X"));
  }
  if (tokens.some((t) => t.kind === "class" && (t.label === "\\w" || t.label === "."))) {
    candidates.push(base.replace(/[a-zA-Z]/, "#"));
  }
  for (const t of tokens) {
    if (t.kind === "literal" && t.charValue && t.charValue !== " " && base.includes(t.charValue)) {
      candidates.push(base.replace(t.charValue, ""));
      break;
    }
  }
  if (a.hasAnchors) candidates.push("");

  const seen = new Set<string>([base]);
  const out: string[] = [];
  for (const c of candidates) {
    if (c === null || seen.has(c)) continue;
    seen.add(c);
    out.push(c);
  }
  return out;
}

interface EdgeCandidate {
  data: string;
  note: string;
}

function buildEdgeCases(pattern: string, flags: string, tokens: RegexToken[], seed: string): EdgeCandidate[] {
  const out: EdgeCandidate[] = [];
  const min = generateValidatedExample(pattern, flags, tokens, `${seed}-edgemin`, { boundary: "min" });
  const max = generateValidatedExample(pattern, flags, tokens, `${seed}-edgemax`, { boundary: "max" });
  if (min !== null) out.push({ data: min, note: "Shortest / minimum-boundary value that should still match" });
  if (max !== null && max !== min) out.push({ data: max, note: "Longer / upper-boundary value that should still match" });
  return out;
}

/**
 * Derives positive, negative, and boundary test cases from the actual
 * pattern — known QA formats (from the Common Patterns library) reuse their
 * hand-curated realistic samples; anything else is generated structurally
 * from the token stream (see regex-engine's generateExampleForTokens) and
 * verified against the real RegExp before being labeled a positive case.
 */
export function generateTestCases(pattern: string, flags: string, tokens: RegexToken[]): TestCase[] {
  if (!pattern.trim()) return [];
  let n = 1;
  const nextId = () => `TC-${String(n++).padStart(2, "0")}`;
  const cases: TestCase[] = [];
  const seen = new Set<string>();

  function add(data: string, expected: TestResult, category: TestCaseCategory, note?: string) {
    if (seen.has(data)) return;
    seen.add(data);
    cases.push({ id: nextId(), data, expected, category, note });
  }

  const knownPattern = COMMON_QA_PATTERNS.find((p) => p.pattern === pattern);
  const seed = `${pattern}::${flags}`;

  if (knownPattern) {
    for (const data of knownPattern.positiveSamples) add(data, "Match", "positive");
    for (const data of knownPattern.negativeSamples) add(data, "No Match", "negative");
  } else {
    const branches = splitTopLevelAlternatives(tokens);
    const branchCount = Math.min(branches.length, 4);
    for (let b = 0; b < branchCount; b++) {
      const ex = generateValidatedExample(pattern, flags, branches[b], `${seed}-branch${b}`);
      if (ex !== null) add(ex, "Match", "positive", branches.length > 1 ? `Alternative ${b + 1} of ${branches.length}` : undefined);
    }
    let attempt = 0;
    while (cases.filter((c) => c.category === "positive").length < 3 && attempt < 10) {
      const ex = generateValidatedExample(pattern, flags, tokens, `${seed}-extra${attempt}`);
      attempt++;
      if (ex !== null) add(ex, "Match", "positive");
    }

    const basePositive = cases.find((c) => c.category === "positive")?.data;
    if (basePositive !== undefined) {
      const negatives = buildNegativeMutators(basePositive, pattern, tokens);
      for (const neg of negatives.slice(0, 4)) add(neg, "No Match", "negative", "Derived by breaking one requirement of the pattern");
    } else {
      add("", "No Match", "negative", "No valid example could be auto-generated for this pattern — add your own test data");
    }
  }

  for (const edge of buildEdgeCases(pattern, flags, tokens, seed)) {
    add(edge.data, "Match", "edge", edge.note);
  }
  if (!seen.has("")) add("", "No Match", "edge", "Empty input");

  return cases;
}

export interface ChecklistItem {
  label: string;
  done: boolean;
}

const SPECIAL_CHAR_RE = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`]/;

/** Every check is derived from the ACTUAL current test case list (generated + user-edited), never assumed. */
export function computeQAChecklist(cases: TestCase[]): ChecklistItem[] {
  const positives = cases.filter((c) => c.category === "positive");
  const negatives = cases.filter((c) => c.category === "negative");
  const edges = cases.filter((c) => c.category === "edge");
  return [
    { label: "Positive scenarios available", done: positives.length > 0 },
    { label: "Negative scenarios available", done: negatives.length > 0 },
    { label: "Boundary cases available", done: edges.length > 0 },
    { label: "Empty input tested", done: cases.some((c) => c.data === "") },
    { label: "Special characters tested", done: cases.some((c) => SPECIAL_CHAR_RE.test(c.data)) },
    { label: "Minimum length tested", done: edges.some((c) => (c.note ?? "").toLowerCase().includes("minimum")) },
    { label: "Maximum length tested", done: edges.some((c) => (c.note ?? "").toLowerCase().includes("upper-boundary")) },
    { label: "Invalid format tested", done: negatives.length > 0 },
  ];
}

function csvEscape(v: string): string {
  if (/[",\n]/.test(v)) return `"${v.replace(/"/g, '""')}"`;
  return v;
}

export function exportTestCasesCSV(cases: TestCase[], actuals: Record<string, TestResult>): string {
  const header = ["Test Case ID", "Test Data", "Expected Result", "Actual Result", "Status", "Reason"];
  const rows = cases.map((c) => {
    const actual = actuals[c.id] ?? "—";
    const status = actual === c.expected ? "PASS" : "FAIL";
    const reason = c.note ?? (c.category === "positive" ? "Should match the pattern" : c.category === "negative" ? "Should NOT match the pattern" : "Boundary condition");
    return [c.id, c.data, c.expected, actual, status, reason].map(csvEscape).join(",");
  });
  return [header.join(","), ...rows].join("\n");
}
