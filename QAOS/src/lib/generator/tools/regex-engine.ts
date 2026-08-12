/**
 * Hand-rolled flat regex tokenizer + plain-English explainer + difficulty
 * classifier + best-effort failure analysis for the QA Regex Analyzer.
 *
 * Deliberately NOT a full regex parser/AST — it walks the pattern once,
 * left to right, emitting a flat sequence of tokens (mirrors how the token
 * breakdown is actually displayed: a left-to-right strip of chips). Nested
 * groups are represented as paired open/close tokens rather than a tree,
 * which is sufficient for explaining and for the linear example generator
 * below (group delimiters are treated as zero-width and skipped).
 */

export type TokenKind =
  | "anchor"
  | "class"
  | "set"
  | "group"
  | "quantifier"
  | "alternation"
  | "literal"
  | "escape";

export type QuantifierKind = "star" | "plus" | "optional" | "exact" | "atLeast" | "between";

export type GroupKind =
  | "capture"
  | "non-capture"
  | "named"
  | "lookahead"
  | "neg-lookahead"
  | "lookbehind"
  | "neg-lookbehind"
  | "close";

export interface RegexToken {
  raw: string;
  start: number;
  end: number;
  kind: TokenKind;
  label: string;
  meaning: string;
  matches: string;
  example: string;
  charValue?: string;
  quantKind?: QuantifierKind;
  min?: number;
  max?: number;
  lazy?: boolean;
  groupKind?: GroupKind;
  groupName?: string;
  isBackreference?: boolean;
}

export const ENGINE_INFO =
  "JavaScript (ECMAScript) RegExp — supports lookahead & lookbehind, named capture groups, and (with the u flag) Unicode property escapes.";

const CLASS_INFO: Record<string, { label: string; meaning: string; matches: string }> = {
  d: { label: "\\d", meaning: "Digit", matches: "0-9" },
  D: { label: "\\D", meaning: "Non-digit", matches: "Any character that is not 0-9" },
  w: { label: "\\w", meaning: "Word character", matches: "Letters, digits, and underscore (A-Z a-z 0-9 _)" },
  W: { label: "\\W", meaning: "Non-word character", matches: "Any character that is not a letter, digit, or underscore" },
  s: { label: "\\s", meaning: "Whitespace", matches: "Space, tab, newline, and other whitespace" },
  S: { label: "\\S", meaning: "Non-whitespace", matches: "Any character that is not whitespace" },
};

const ESCAPE_INFO: Record<string, string> = {
  n: "Newline",
  r: "Carriage return",
  t: "Tab",
  f: "Form feed",
  v: "Vertical tab",
  "0": "Null character",
};

function isDigit(c: string) {
  return c >= "0" && c <= "9";
}

/** Finds the matching `]` for a `[...]` character set starting at `openIndex`, honoring `\]` escapes and a leading `]`/`^]` being treated as a literal member. */
function findSetEnd(pattern: string, openIndex: number): number {
  let i = openIndex + 1;
  if (pattern[i] === "^") i++;
  if (pattern[i] === "]") i++; // a ']' right after '[' or '[^' is a literal member, not the close
  for (; i < pattern.length; i++) {
    if (pattern[i] === "\\") {
      i++;
      continue;
    }
    if (pattern[i] === "]") return i;
  }
  return pattern.length - 1;
}

function describeSet(raw: string): { meaning: string; matches: string } {
  const negated = raw.startsWith("[^");
  const inner = raw.slice(negated ? 2 : 1, -1);
  const summary = inner.length > 24 ? `${inner.slice(0, 24)}…` : inner;
  return {
    meaning: negated ? "Negated character set" : "Character set",
    matches: negated ? `Any character except: ${summary}` : `Any one of: ${summary}`,
  };
}

function quantifierMeta(kind: QuantifierKind, min?: number, max?: number) {
  switch (kind) {
    case "star":
      return { label: "*", meaning: "Zero or more", matches: "0 or more repetitions" };
    case "plus":
      return { label: "+", meaning: "One or more", matches: "1 or more repetitions" };
    case "optional":
      return { label: "?", meaning: "Zero or one (optional)", matches: "0 or 1 repetitions" };
    case "exact":
      return { label: `{${min}}`, meaning: `Exactly ${min} occurrence${min === 1 ? "" : "s"}`, matches: `Exactly ${min}` };
    case "atLeast":
      return { label: `{${min},}`, meaning: `${min} or more occurrences`, matches: `${min} or more` };
    case "between":
      return { label: `{${min},${max}}`, meaning: `Between ${min} and ${max} occurrences`, matches: `${min} to ${max}` };
  }
}

/** Tokenizes a regex pattern into a flat, left-to-right sequence of explainable tokens. Never throws — unparsable trailing fragments fall back to literal tokens. */
export function tokenizeRegex(pattern: string): RegexToken[] {
  const tokens: RegexToken[] = [];
  const groupStack: GroupKind[] = [];
  let i = 0;

  while (i < pattern.length) {
    const c = pattern[i];
    const start = i;

    if (c === "^" || c === "$") {
      tokens.push({
        raw: c,
        start,
        end: i + 1,
        kind: "anchor",
        label: c,
        meaning: c === "^" ? "Start of string" : "End of string",
        matches: c === "^" ? "The position before the first character" : "The position after the last character",
        example: c === "^" ? "^Hi matches 'Hi there' but not 'Say Hi'" : "end$ matches 'the end' but not 'ending now'",
      });
      i++;
      continue;
    }

    if (c === "|") {
      tokens.push({
        raw: c,
        start,
        end: i + 1,
        kind: "alternation",
        label: "|",
        meaning: "OR",
        matches: "Matches the pattern on either side of this symbol",
        example: "cat|dog matches 'cat' or 'dog'",
      });
      i++;
      continue;
    }

    if (c === ".") {
      tokens.push({
        raw: c,
        start,
        end: i + 1,
        kind: "class",
        label: ".",
        meaning: "Any character",
        matches: "Any single character except line breaks (unless the s flag is on)",
        example: "a.c → abc",
      });
      i++;
      continue;
    }

    if (c === "[") {
      const end = findSetEnd(pattern, i);
      const raw = pattern.slice(i, end + 1);
      const { meaning, matches } = describeSet(raw);
      tokens.push({ raw, start, end: end + 1, kind: "set", label: raw, meaning, matches, example: `${raw} → one matching character` });
      i = end + 1;
      continue;
    }

    if (c === "(") {
      let groupKind: GroupKind = "capture";
      let raw = "(";
      let groupName: string | undefined;
      if (pattern.startsWith("(?:", i)) {
        groupKind = "non-capture";
        raw = "(?:";
      } else if (pattern.startsWith("(?=", i)) {
        groupKind = "lookahead";
        raw = "(?=";
      } else if (pattern.startsWith("(?!", i)) {
        groupKind = "neg-lookahead";
        raw = "(?!";
      } else if (pattern.startsWith("(?<=", i)) {
        groupKind = "lookbehind";
        raw = "(?<=";
      } else if (pattern.startsWith("(?<!", i)) {
        groupKind = "neg-lookbehind";
        raw = "(?<!";
      } else if (pattern.startsWith("(?<", i)) {
        const m = /^\(\?<([^>]+)>/.exec(pattern.slice(i));
        if (m) {
          groupKind = "named";
          raw = m[0];
          groupName = m[1];
        }
      }
      groupStack.push(groupKind);
      const labelMap: Record<GroupKind, string> = {
        capture: "Start of capturing group",
        "non-capture": "Start of non-capturing group",
        named: `Start of named group '${groupName}'`,
        lookahead: "Start of positive lookahead",
        "neg-lookahead": "Start of negative lookahead",
        lookbehind: "Start of positive lookbehind",
        "neg-lookbehind": "Start of negative lookbehind",
        close: "",
      };
      const matchesMap: Record<GroupKind, string> = {
        capture: "Groups the enclosed pattern together and remembers what it matched (usable as $1, $2, … in Replace With)",
        "non-capture": "Groups the enclosed pattern together without remembering the match",
        named: `Groups the enclosed pattern and remembers it as '${groupName}' (usable as $<${groupName}> in Replace With)`,
        lookahead: "Asserts that what follows matches this, WITHOUT consuming any characters",
        "neg-lookahead": "Asserts that what follows does NOT match this, WITHOUT consuming any characters",
        lookbehind: "Asserts that what precedes matches this, WITHOUT consuming any characters",
        "neg-lookbehind": "Asserts that what precedes does NOT match this, WITHOUT consuming any characters",
        close: "",
      };
      tokens.push({
        raw,
        start,
        end: i + raw.length,
        kind: "group",
        label: raw,
        meaning: labelMap[groupKind],
        matches: matchesMap[groupKind],
        example: "",
        groupKind,
        groupName,
      });
      i += raw.length;
      continue;
    }

    if (c === ")") {
      const opened = groupStack.pop() ?? "capture";
      const closeLabelMap: Record<GroupKind, string> = {
        capture: "End of capturing group",
        "non-capture": "End of non-capturing group",
        named: "End of named group",
        lookahead: "End of lookahead",
        "neg-lookahead": "End of negative lookahead",
        lookbehind: "End of lookbehind",
        "neg-lookbehind": "End of negative lookbehind",
        close: "End of group",
      };
      tokens.push({
        raw: ")",
        start,
        end: i + 1,
        kind: "group",
        label: ")",
        meaning: closeLabelMap[opened],
        matches: "Marks where the grouped pattern ends",
        example: "",
        groupKind: "close",
      });
      i++;
      continue;
    }

    if (c === "\\") {
      const next = pattern[i + 1];
      if (next === undefined) {
        tokens.push({ raw: "\\", start, end: i + 1, kind: "literal", label: "\\", meaning: "Literal '\\'", matches: "The character '\\'", example: "", charValue: "\\" });
        i++;
        continue;
      }
      if (next in CLASS_INFO) {
        const info = CLASS_INFO[next];
        tokens.push({ raw: `\\${next}`, start, end: i + 2, kind: "class", label: info.label, meaning: info.meaning, matches: info.matches, example: `${info.label} → a matching character` });
        i += 2;
        continue;
      }
      if (next === "b" || next === "B") {
        tokens.push({
          raw: `\\${next}`,
          start,
          end: i + 2,
          kind: "anchor",
          label: `\\${next}`,
          meaning: next === "b" ? "Word boundary" : "Non-word boundary",
          matches: next === "b" ? "The position between a word character and a non-word character" : "A position that is NOT a word boundary",
          example: next === "b" ? "\\bcat\\b matches 'cat' in 'a cat sat' but not in 'category'" : "",
        });
        i += 2;
        continue;
      }
      if (isDigit(next) && next !== "0") {
        const m = /^\\(\d+)/.exec(pattern.slice(i));
        const num = m ? m[1] : next;
        tokens.push({
          raw: `\\${num}`,
          start,
          end: i + 1 + num.length,
          kind: "escape",
          label: `\\${num}`,
          meaning: `Backreference to group ${num}`,
          matches: `Whatever text capturing group ${num} matched earlier in the pattern`,
          example: "(\\w)\\1 matches 'aa' or 'bb' — the same character twice",
          isBackreference: true,
        });
        i += 1 + num.length;
        continue;
      }
      if (next in ESCAPE_INFO) {
        tokens.push({ raw: `\\${next}`, start, end: i + 2, kind: "escape", label: `\\${next}`, meaning: ESCAPE_INFO[next], matches: ESCAPE_INFO[next], example: "" });
        i += 2;
        continue;
      }
      if (next === "u" || next === "x") {
        const hexMatch = next === "u" ? /^\\u\{[0-9a-fA-F]+\}|^\\u[0-9a-fA-F]{4}/.exec(pattern.slice(i)) : /^\\x[0-9a-fA-F]{2}/.exec(pattern.slice(i));
        if (hexMatch) {
          tokens.push({ raw: hexMatch[0], start, end: i + hexMatch[0].length, kind: "escape", label: hexMatch[0], meaning: "Unicode/hex escape", matches: "A specific character by code point", example: "" });
          i += hexMatch[0].length;
          continue;
        }
      }
      if (next === "p" || next === "P") {
        const propMatch = /^\\[pP]\{[^}]+\}/.exec(pattern.slice(i));
        if (propMatch) {
          tokens.push({ raw: propMatch[0], start, end: i + propMatch[0].length, kind: "class", label: propMatch[0], meaning: "Unicode property escape", matches: "Any character with the named Unicode property", example: "" });
          i += propMatch[0].length;
          continue;
        }
      }
      // Escaped literal, e.g. \. \- \/ \(
      tokens.push({ raw: `\\${next}`, start, end: i + 2, kind: "literal", label: next, meaning: `Literal '${next}'`, matches: `The character '${next}' exactly`, example: `\\${next} matches '${next}'`, charValue: next });
      i += 2;
      continue;
    }

    if (c === "{") {
      const m = /^\{(\d+)(,(\d*))?\}/.exec(pattern.slice(i));
      if (m) {
        const min = Number(m[1]);
        const hasComma = m[2] !== undefined;
        const maxStr = m[3];
        let quantKind: QuantifierKind;
        let max: number | undefined;
        if (!hasComma) {
          quantKind = "exact";
        } else if (maxStr === "") {
          quantKind = "atLeast";
        } else {
          quantKind = "between";
          max = Number(maxStr);
        }
        let raw = m[0];
        let lazy = false;
        let end = i + raw.length;
        if (pattern[end] === "?") {
          lazy = true;
          raw += "?";
          end += 1;
        }
        const meta = quantifierMeta(quantKind, min, max);
        tokens.push({ raw, start, end, kind: "quantifier", label: meta.label, meaning: lazy ? `${meta.meaning} (lazy)` : meta.meaning, matches: meta.matches, example: "", quantKind, min, max, lazy });
        i = end;
        continue;
      }
    }

    if (c === "*" || c === "+" || c === "?") {
      const quantKind: QuantifierKind = c === "*" ? "star" : c === "+" ? "plus" : "optional";
      let raw = c;
      let lazy = false;
      let end = i + 1;
      if (pattern[end] === "?") {
        lazy = true;
        raw += "?";
        end += 1;
      }
      const meta = quantifierMeta(quantKind);
      tokens.push({ raw, start, end, kind: "quantifier", label: meta.label, meaning: lazy ? `${meta.meaning} (lazy)` : meta.meaning, matches: meta.matches, example: "", quantKind, lazy });
      i = end;
      continue;
    }

    // Plain literal character
    tokens.push({ raw: c, start, end: i + 1, kind: "literal", label: c, meaning: c === " " ? "Literal space" : `Literal '${c}'`, matches: `The character '${c}' exactly`, example: `matches '${c}'`, charValue: c });
    i++;
  }

  return tokens;
}

export interface TokenAnalysis {
  hasLookaround: boolean;
  hasBackreference: boolean;
  hasNamedGroup: boolean;
  hasNonCaptureGroup: boolean;
  hasCaptureGroup: boolean;
  hasAlternation: boolean;
  hasCharSet: boolean;
  hasRangeQuantifier: boolean;
  hasAnchors: boolean;
  hasBasicQuantifier: boolean;
  maxGroupDepth: number;
  isFlat: boolean;
}

export function analyzeTokens(tokens: RegexToken[]): TokenAnalysis {
  let depth = 0;
  let maxDepth = 0;
  const a: TokenAnalysis = {
    hasLookaround: false,
    hasBackreference: false,
    hasNamedGroup: false,
    hasNonCaptureGroup: false,
    hasCaptureGroup: false,
    hasAlternation: false,
    hasCharSet: false,
    hasRangeQuantifier: false,
    hasAnchors: false,
    hasBasicQuantifier: false,
    maxGroupDepth: 0,
    isFlat: true,
  };
  for (const t of tokens) {
    if (t.kind === "group") {
      a.isFlat = false;
      if (t.groupKind === "close") {
        depth = Math.max(0, depth - 1);
      } else {
        depth++;
        maxDepth = Math.max(maxDepth, depth);
        if (t.groupKind === "lookahead" || t.groupKind === "neg-lookahead" || t.groupKind === "lookbehind" || t.groupKind === "neg-lookbehind") a.hasLookaround = true;
        if (t.groupKind === "named") a.hasNamedGroup = true;
        if (t.groupKind === "non-capture") a.hasNonCaptureGroup = true;
        if (t.groupKind === "capture") a.hasCaptureGroup = true;
      }
    }
    if (t.kind === "alternation") {
      a.hasAlternation = true;
      a.isFlat = false;
    }
    if (t.kind === "set") a.hasCharSet = true;
    if (t.kind === "anchor") a.hasAnchors = true;
    if (t.kind === "escape" && t.isBackreference) {
      a.hasBackreference = true;
      a.isFlat = false;
    }
    if (t.kind === "quantifier") {
      if (t.quantKind === "atLeast" || t.quantKind === "between") a.hasRangeQuantifier = true;
      else a.hasBasicQuantifier = true;
    }
  }
  a.maxGroupDepth = maxDepth;
  return a;
}

export interface DifficultyResult {
  level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  reason: string;
}

/** Rule-based difficulty classification by construct category present — NOT by pattern length. */
export function classifyDifficulty(tokens: RegexToken[]): DifficultyResult {
  if (tokens.length === 0) return { level: "Beginner", reason: "Empty pattern." };
  const a = analyzeTokens(tokens);
  const triggers: string[] = [];

  if (a.hasLookaround) triggers.push("lookahead/lookbehind assertions");
  if (a.hasBackreference) triggers.push("backreferences");
  if (a.hasLookaround || a.hasBackreference) {
    return { level: "Expert", reason: `Expert — uses ${triggers.join(" and ")}, which require understanding how the regex engine backtracks.` };
  }

  const midTriggers: string[] = [];
  if (a.hasAlternation) midTriggers.push("alternation (|)");
  if (a.hasNamedGroup) midTriggers.push("named groups");
  if (a.hasNonCaptureGroup) midTriggers.push("non-capturing groups");
  if (a.hasCharSet) midTriggers.push("character sets");
  if (a.hasRangeQuantifier) midTriggers.push("range quantifiers");
  if (a.maxGroupDepth >= 2) midTriggers.push("nested groups");

  if (a.maxGroupDepth >= 2 || midTriggers.length >= 3) {
    return { level: "Advanced", reason: `Advanced — combines ${midTriggers.slice(0, 3).join(", ")}${midTriggers.length > 3 ? ", and more" : ""}.` };
  }
  if (midTriggers.length > 0) {
    return { level: "Intermediate", reason: `Intermediate — contains ${midTriggers.join(", ")}.` };
  }

  const basicTriggers: string[] = [];
  if (a.hasAnchors) basicTriggers.push("anchors");
  if (a.hasBasicQuantifier) basicTriggers.push("quantifiers");
  if (tokens.some((t) => t.kind === "class")) basicTriggers.push("character classes");
  if (basicTriggers.length > 0) {
    return { level: "Beginner", reason: `Beginner — contains ${basicTriggers.join(", ")} but no groups or alternation.` };
  }
  return { level: "Beginner", reason: "Beginner — a plain literal pattern with no special constructs." };
}

interface Clause {
  text: string;
}

/** Composes a beginner-friendly plain-English description from the token stream. */
export function explainPlainEnglish(tokens: RegexToken[], pattern: string): string {
  if (!pattern.trim()) return "Enter a pattern above to see a plain-English explanation.";

  const a = analyzeTokens(tokens);
  const clauses: Clause[] = [];
  let i = 0;

  function quantWord(kind: QuantifierKind | undefined, min?: number, max?: number): { count: string; plural: boolean } {
    if (!kind) return { count: "a", plural: false };
    switch (kind) {
      case "star":
        return { count: "zero or more", plural: true };
      case "plus":
        return { count: "one or more", plural: true };
      case "optional":
        return { count: "an optional", plural: false };
      case "exact":
        return { count: `exactly ${min}`, plural: (min ?? 0) > 1 };
      case "atLeast":
        return { count: `${min} or more`, plural: true };
      case "between":
        return { count: `between ${min} and ${max}`, plural: true };
    }
  }

  while (i < tokens.length) {
    const t = tokens[i];
    if (t.kind === "anchor" || t.kind === "alternation") {
      i++;
      continue;
    }
    if (t.kind === "group") {
      if (t.groupKind === "close") {
        i++;
        continue;
      }
      const label =
        t.groupKind === "lookahead"
          ? "followed by (but not including)"
          : t.groupKind === "neg-lookahead"
            ? "NOT followed by"
            : t.groupKind === "lookbehind"
              ? "preceded by (but not including)"
              : t.groupKind === "neg-lookbehind"
                ? "NOT preceded by"
                : t.groupKind === "named"
                  ? `a group (captured as '${t.groupName}')`
                  : "a group";
      clauses.push({ text: label });
      i++;
      continue;
    }
    if (t.kind === "literal" || t.kind === "class" || t.kind === "set" || t.kind === "escape") {
      const next = tokens[i + 1];
      let noun: string;
      if (t.kind === "literal") {
        noun = t.charValue === " " ? "space" : `'${t.charValue}'`;
      } else if (t.kind === "class") {
        noun = t.meaning.toLowerCase();
      } else if (t.kind === "set") {
        noun = t.meaning.toLowerCase();
      } else {
        noun = t.meaning.toLowerCase();
      }
      if (next && next.kind === "quantifier") {
        const { count, plural } = quantWord(next.quantKind, next.min, next.max);
        const nounPlural = plural && t.kind !== "literal" ? `${noun}${noun.endsWith("s") ? "" : "s"}` : noun;
        clauses.push({ text: `${count} ${nounPlural}` });
        i += 2;
        continue;
      }
      clauses.push({ text: t.kind === "literal" ? `${noun}` : `a ${noun}` });
      i++;
      continue;
    }
    i++;
  }

  let body = "";
  if (clauses.length === 0) {
    body = "This pattern doesn't require any specific characters.";
  } else if (clauses.length === 1) {
    body = `This pattern matches ${clauses[0].text}.`;
  } else {
    body = `This pattern matches ${clauses[0].text}, followed by ${clauses
      .slice(1)
      .map((c) => c.text)
      .join(", followed by ")}.`;
  }

  const startsAnchored = pattern.startsWith("^");
  const endsAnchored = pattern.endsWith("$");
  let anchorNote: string;
  if (startsAnchored && endsAnchored) {
    anchorNote = "The entire input must match this pattern exactly — nothing extra before or after.";
  } else if (startsAnchored) {
    anchorNote = "The match must start at the very beginning of the input, but may leave extra text after it.";
  } else if (endsAnchored) {
    anchorNote = "The match must reach the very end of the input, but may have extra text before it.";
  } else {
    anchorNote = "This pattern can match anywhere inside a larger string (it doesn't have to use the whole input).";
  }

  const extraNotes: string[] = [];
  if (a.hasAlternation) extraNotes.push("This pattern has multiple '|'-separated alternatives — it matches if ANY one of them matches.");
  if (a.hasCaptureGroup || a.hasNamedGroup) extraNotes.push("Parts of the match are captured into groups, which can be reused in the Replace With field (as $1, $2, or $<name>).");
  if (a.hasLookaround) extraNotes.push("It also uses lookahead/lookbehind — assertions that check nearby text without including it in the match.");

  return [body, anchorNote, ...extraNotes].join(" ");
}

export interface FailureAnalysis {
  headline: string;
  detail: string;
  expected?: string;
  received?: string;
}

const PRESET_FAILURE_CHECKS: { test: (pattern: string) => boolean; analyze: (input: string) => FailureAnalysis | null }[] = [
  {
    test: (p) => p.includes("@"),
    analyze: (input) => {
      const at = (input.match(/@/g) ?? []).length;
      if (at === 0) return { headline: "Missing '@'", detail: "An email address needs exactly one '@' separating the local part from the domain, and this input has none." };
      if (at > 1) return { headline: "Too many '@' characters", detail: `An email address needs exactly one '@', but this input has ${at}.` };
      const [local, domain] = input.split("@");
      if (!local) return { headline: "Missing text before '@'", detail: "The part before '@' (the local part / mailbox name) is empty." };
      if (!domain) return { headline: "Missing domain after '@'", detail: "There's nothing after '@' — a domain like 'example.com' is required." };
      if (!domain.includes(".")) return { headline: "Domain has no dot", detail: `'${domain}' doesn't contain a '.', so there's no top-level domain (like .com or .dev).` };
      const tld = domain.split(".").pop() ?? "";
      if (tld.length < 2) return { headline: "Top-level domain too short", detail: `'.${tld}' is shorter than the minimum 2 letters required after the last dot.` };
      return null;
    },
  },
  {
    test: (p) => p.includes("https?") || (p.includes("http") && p.includes("://")),
    analyze: (input) => {
      if (!/^https?:\/\//i.test(input)) return { headline: "Missing scheme", detail: "A URL must start with 'http://' or 'https://', and this input doesn't." };
      return null;
    },
  },
  {
    test: (p) => p.includes("\\d{1,3}"),
    analyze: (input) => {
      const parts = input.split(".");
      if (parts.length !== 4) return { headline: "Wrong number of octets", detail: `An IPv4 address needs exactly 4 dot-separated numbers, but this input has ${parts.length}.` };
      for (let idx = 0; idx < parts.length; idx++) {
        const p = parts[idx];
        if (!/^\d{1,3}$/.test(p)) return { headline: `Octet ${idx + 1} isn't 1-3 digits`, detail: `'${p}' at position ${idx + 1} must be 1 to 3 digits (0-255).` };
        if (Number(p) > 255) return { headline: `Octet ${idx + 1} out of range`, detail: `'${p}' is greater than 255 — each IPv4 octet must be 0-255.` };
      }
      return null;
    },
  },
];

/** Best-effort explanation of why a pattern failed to match. Returns null (caller falls back to a generic message) rather than guessing when it can't safely determine the cause. */
export function analyzeFailure(pattern: string, flags: string, input: string, tokens: RegexToken[]): FailureAnalysis | null {
  if (!input) {
    return { headline: "Empty input", detail: "The test string is empty, so there's nothing for the pattern to match against." };
  }

  const a = analyzeTokens(tokens);

  // Known, well-scoped formats get a tailored, safe explanation even though they contain groups.
  for (const check of PRESET_FAILURE_CHECKS) {
    if (check.test(pattern)) {
      const result = check.analyze(input);
      if (result) return result;
    }
  }

  if (!a.isFlat || !pattern.startsWith("^") || a.hasBackreference) {
    return { headline: "Pattern mismatch detected", detail: "Review the highlighted regex requirements below." };
  }

  // Flat, ^-anchored pattern: walk token-by-token, growing an anchored prefix
  // regex, to find exactly where the input stops satisfying the pattern.
  const flagsNoGlobal = flags.replace(/g/g, "");
  const units: { tokens: RegexToken[]; raw: string }[] = [];
  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (t.kind === "quantifier") continue; // consumed by the preceding content token below
    const next = tokens[i + 1];
    if (next && next.kind === "quantifier") {
      units.push({ tokens: [t, next], raw: t.raw + next.raw });
    } else {
      units.push({ tokens: [t], raw: t.raw });
    }
  }

  let cursor = 0;
  let builtRaw = "";
  let failingUnitIndex = -1;
  for (let i = 0; i < units.length; i++) {
    const testRaw = "^" + builtRaw + units[i].raw;
    let re: RegExp;
    try {
      re = new RegExp(testRaw, flagsNoGlobal);
    } catch {
      return { headline: "Pattern mismatch detected", detail: "Review the highlighted regex requirements below." };
    }
    const m = re.exec(input);
    if (!m) {
      failingUnitIndex = i;
      break;
    }
    cursor = m[0].length;
    builtRaw += units[i].raw;
  }

  if (failingUnitIndex === -1) {
    // Every unit matched a growing prefix, but the whole pattern still failed —
    // the input must have unexpected trailing content the pattern doesn't allow for.
    const trailing = input.slice(cursor);
    return {
      headline: "Unexpected extra characters",
      detail: `The pattern is satisfied up through position ${cursor}, but the input has ${trailing.length} extra character${trailing.length === 1 ? "" : "s"} after that, which the pattern doesn't account for.`,
      received: input,
      expected: input.slice(0, cursor),
    };
  }

  const failingUnit = units[failingUnitIndex];
  const contentToken = failingUnit.tokens[0];
  const quantToken = failingUnit.tokens[1];
  const remaining = input.slice(cursor);

  if (quantToken?.quantKind === "exact") {
    const needed = quantToken.min ?? 1;
    let actualRun = 0;
    let re: RegExp | null = null;
    try {
      re = new RegExp(contentToken.raw, "u");
    } catch {
      re = null;
    }
    if (re) {
      while (actualRun < remaining.length && re.test(remaining[actualRun])) actualRun++;
    }
    if (actualRun !== needed) {
      const expectedCompletion = generateExampleForTokens(tokens.slice(tokens.indexOf(contentToken)), createRng(pattern + "fail"));
      return {
        headline: `${contentToken.meaning} count doesn't match`,
        detail: `This part of the pattern requires exactly ${needed} ${contentToken.meaning.toLowerCase()}${needed === 1 ? "" : "s"} here, but the input has ${actualRun}.`,
        expected: input.slice(0, cursor) + (expectedCompletion ?? ""),
        received: input,
      };
    }
  }

  return {
    headline: `Doesn't satisfy: ${contentToken.meaning}${quantToken ? ` (${quantToken.meaning.toLowerCase()})` : ""}`,
    detail: `At position ${cursor}, the pattern expects ${contentToken.meaning.toLowerCase()}, but found ${remaining ? `'${remaining[0]}'` : "the end of the input"}.`,
    received: input,
    expected: input.slice(0, cursor) + (generateExampleForTokens(tokens.slice(tokens.indexOf(contentToken)), createRng(pattern + "fail2")) ?? ""),
  };
}

// ---------------------------------------------------------------------------
// Deterministic example generation (shared by failure analysis "Expected"
// reconstruction and by the QA test-case generator's positive examples).
// ---------------------------------------------------------------------------

/** Small deterministic PRNG (mulberry32) seeded from a string, so regenerating examples for the same pattern is stable across re-renders. */
export function createRng(seed: string): () => number {
  let h = 1779033703 ^ seed.length;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(h ^ seed.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  let a = h;
  return function rng() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const SAMPLE_POOL = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ !@#_-.";

function sampleForToken(token: RegexToken, rng: () => number): string {
  if (token.kind === "literal") return token.charValue ?? "x";
  try {
    const re = new RegExp(token.raw, "u");
    const matches: string[] = [];
    for (const ch of SAMPLE_POOL) if (re.test(ch)) matches.push(ch);
    if (matches.length === 0) return "x";
    return matches[Math.floor(rng() * matches.length)];
  } catch {
    return "x";
  }
}

function resolveCount(q: RegexToken, opts?: GenerateOptions): number {
  const forceMax = opts?.boundary === "max";
  const min = q.min ?? 0;
  const max = q.max ?? min;
  switch (q.quantKind) {
    case "star":
      return forceMax ? 4 : 0;
    case "plus":
      return forceMax ? 5 : 1;
    case "optional":
      return forceMax || opts?.preferOptionalPresent ? 1 : 0;
    case "exact":
      return min;
    case "atLeast":
      return forceMax ? min + 4 : min;
    case "between":
      return forceMax ? max : min;
    default:
      return 1;
  }
}

export interface GenerateOptions {
  boundary?: "min" | "max";
  preferOptionalPresent?: boolean;
}

/**
 * Generates a plausible matching string from a token slice. Anchors are
 * zero-width and skipped. Groups are handled recursively so a quantifier
 * attached to a whole group (e.g. `(?:\d{1,3}\.){3}`) correctly repeats the
 * group's *contents*, not just the token right before it; alternation inside
 * a group picks one branch per repetition. Lookaround groups are zero-width
 * (their content is never consumed, so it's skipped rather than emitted).
 */
export function generateExampleForTokens(tokens: RegexToken[], rng: () => number, opts?: GenerateOptions): string {
  // Alternation is handled once, uniformly, right here — whether this call is
  // the top-level entry point or a recursive call for a group's contents —
  // rather than only inside the group-recursion branch below.
  const branches = splitTopLevelAlternatives(tokens);
  const chosen = branches.length > 1 ? branches[Math.floor(rng() * branches.length)] : tokens;

  let out = "";
  let i = 0;
  while (i < chosen.length) {
    const t = chosen[i];

    if (t.kind === "anchor" || t.kind === "alternation") {
      i++;
      continue;
    }
    if (t.kind === "quantifier") {
      i++; // orphaned quantifier (defensive — shouldn't normally happen)
      continue;
    }
    if (t.kind === "escape" && t.isBackreference) {
      i++; // can't safely regenerate a backreference's captured text
      continue;
    }

    if (t.kind === "group" && t.groupKind !== "close") {
      let depth = 1;
      let j = i + 1;
      while (j < chosen.length && depth > 0) {
        if (chosen[j].kind === "group" && chosen[j].groupKind !== "close") depth++;
        else if (chosen[j].kind === "group" && chosen[j].groupKind === "close") depth--;
        if (depth > 0) j++;
      }
      const closeIdx = j; // index of matching ')' (or chosen.length if unterminated)
      const innerTokens = chosen.slice(i + 1, closeIdx);
      const afterClose = chosen[closeIdx + 1];
      const isLookaround = t.groupKind === "lookahead" || t.groupKind === "neg-lookahead" || t.groupKind === "lookbehind" || t.groupKind === "neg-lookbehind";

      let repeatCount = 1;
      let consumedQuantifier = false;
      if (afterClose && afterClose.kind === "quantifier") {
        repeatCount = resolveCount(afterClose, opts);
        consumedQuantifier = true;
      }

      if (!isLookaround) {
        for (let r = 0; r < repeatCount; r++) out += generateExampleForTokens(innerTokens, rng, opts);
      }
      i = consumedQuantifier ? closeIdx + 2 : closeIdx + 1;
      continue;
    }
    if (t.kind === "group" && t.groupKind === "close") {
      i++; // unmatched close at this level — defensive, ignore
      continue;
    }

    const next = chosen[i + 1];
    let count = 1;
    let consumed = 1;
    if (next && next.kind === "quantifier") {
      count = resolveCount(next, opts);
      consumed = 2;
    }
    for (let k = 0; k < count; k++) out += sampleForToken(t, rng);
    i += consumed;
  }
  return out;
}

/** Splits a flat token stream into top-level alternation branches (depth-tracked, so `|` inside a nested group doesn't split the outer sequence). */
export function splitTopLevelAlternatives(tokens: RegexToken[]): RegexToken[][] {
  const branches: RegexToken[][] = [[]];
  let depth = 0;
  for (const t of tokens) {
    if (t.kind === "group" && t.groupKind !== "close") depth++;
    if (t.kind === "group" && t.groupKind === "close") depth = Math.max(0, depth - 1);
    if (t.kind === "alternation" && depth === 0) {
      branches.push([]);
      continue;
    }
    branches[branches.length - 1].push(t);
  }
  return branches;
}

/** Generates a validated matching example for the full pattern, retrying with fresh randomness a few times before giving up (patterns with lookaround/complex alternation aren't always satisfiable by the linear generator). */
export function generateValidatedExample(pattern: string, flags: string, tokens: RegexToken[], seed: string, opts?: GenerateOptions): string | null {
  let re: RegExp;
  try {
    re = new RegExp(pattern, flags.replace(/g/g, ""));
  } catch {
    return null;
  }
  for (let attempt = 0; attempt < 12; attempt++) {
    const rng = createRng(`${seed}-${attempt}`);
    const candidate = generateExampleForTokens(tokens, rng, opts);
    if (re.test(candidate)) return candidate;
  }
  return null;
}

/** A short, position-aware note for the breakdown popover's "What it does in the current regex" line — describes the token's structural role, not a guess at semantic intent. */
export function describeTokenInContext(token: RegexToken, index: number, tokens: RegexToken[]): string {
  if (token.kind === "anchor" && token.raw === "^") {
    return index === 0 ? "Anchors this pattern to the very start of the input." : "Requires a position at the start of a line here (multiline matching).";
  }
  if (token.kind === "anchor" && token.raw === "$") {
    return index === tokens.length - 1 ? "Anchors this pattern to the very end of the input." : "Requires a position at the end of a line here (multiline matching).";
  }
  if (token.kind === "quantifier") {
    const prev = tokens[index - 1];
    return prev ? `Controls how many times '${prev.label}' (just before it) must repeat.` : "Quantifier with nothing before it to repeat — likely a typo.";
  }
  if (token.kind === "group") {
    return token.groupKind === "close" ? "Closes the group opened earlier in the pattern." : "Opens a group — everything up to its matching ')' is treated as one unit.";
  }
  if (token.kind === "alternation") {
    return "Splits the pattern into alternatives — everything before vs. after this symbol (within the current group).";
  }
  const next = tokens[index + 1];
  const posLabel = `character${next && next.kind === "quantifier" ? "s" : ""} ${token.start + 1}–${(next && next.kind === "quantifier" ? next.end : token.end)} of the pattern`;
  if (token.kind === "literal") {
    return `Must appear literally at this exact position in the input (defined by ${posLabel}).`;
  }
  return `Matches one qualifying character at this position in the input (defined by ${posLabel}).`;
}
