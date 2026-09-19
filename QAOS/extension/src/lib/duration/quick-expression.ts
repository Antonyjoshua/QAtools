import { calculateQuestionDuration, calculateTimePerQuestion } from "./calculations";
import { durationToMs, formatDuration, roundClean } from "./conversions";
import type { DurationUnit } from "./units";

// -----------------------------------------------------------------------------
// Deterministic expression parser for the "What do you want to calculate?"
// quick-calc bar. Intentionally NOT a general expression evaluator (no eval,
// no AI) — it recognizes exactly the handful of shapes the tool is meant to
// answer instantly, tries each in turn, and fails clearly rather than
// guessing when the input doesn't match one of them.
// -----------------------------------------------------------------------------

const UNIT_PATTERN = "(?:ms|milliseconds?|s|sec|secs|second|seconds|min|mins|minute|minutes|hr|hrs|hour|hours|day|days|week|weeks)";
const COUNT_WORD_PATTERN = "(?:questions?|test\\s?cases?|tests?|q)";

function normalize(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .replace(/×/g, "*")
    .replace(/÷/g, "/")
    .replace(/→|->/g, ">>")
    .replace(/\bto\b/g, ">>")
    .replace(/\s+/g, " ");
}

function matchUnit(word: string): DurationUnit | null {
  const w = word.trim();
  if (/^(ms|milliseconds?)$/.test(w)) return "ms";
  if (/^(s|sec|secs|seconds?)$/.test(w)) return "s";
  if (/^(min|mins|minutes?)$/.test(w)) return "min";
  if (/^(hr|hrs|hours?)$/.test(w)) return "hr";
  if (/^(days?)$/.test(w)) return "day";
  if (/^(weeks?)$/.test(w)) return "week";
  return null;
}

export interface QuickCalcSuccess {
  success: true;
  expressionText: string;
  resultText: string;
  detailText?: string;
}

export interface QuickCalcFailure {
  success: false;
  error: string;
}

export type QuickCalcResult = QuickCalcSuccess | QuickCalcFailure;

function num(n: string): number {
  return Number(n);
}

export function parseQuickExpression(rawInput: string): QuickCalcResult {
  const input = normalize(rawInput);
  if (!input) return { success: false, error: "Type an expression, e.g. \"54 sec × 50 questions\"." };

  const durationRe = `(\\d+(?:\\.\\d+)?)\\s*(${UNIT_PATTERN})`;
  const countRe = `(\\d+(?:\\.\\d+)?)\\s*(${COUNT_WORD_PATTERN})`;

  // 1a. duration × count  -> total duration (e.g. "54 sec * 50 questions")
  let m = new RegExp(`^${durationRe}\\s*\\*\\s*${countRe}$`).exec(input);
  if (m) {
    const [, v1, u1, v2] = m;
    const unit = matchUnit(u1);
    if (unit) {
      const r = calculateQuestionDuration(num(v2), num(v1), unit);
      return {
        success: true,
        expressionText: `${v2} questions × ${v1} ${u1}`,
        resultText: r.formatted,
        detailText: `${r.totalSeconds.toLocaleString()} seconds · ${r.timeFormat}`,
      };
    }
  }

  // 1b. count × duration -> total duration (e.g. "50 questions * 54 sec")
  m = new RegExp(`^${countRe}\\s*\\*\\s*${durationRe}$`).exec(input);
  if (m) {
    const [, v1, , v2, u2] = m;
    const unit = matchUnit(u2);
    if (unit) {
      const r = calculateQuestionDuration(num(v1), num(v2), unit);
      return {
        success: true,
        expressionText: `${v1} questions × ${v2} ${u2}`,
        resultText: r.formatted,
        detailText: `${r.totalSeconds.toLocaleString()} seconds · ${r.timeFormat}`,
      };
    }
  }

  // 2. duration ÷ count -> time per question (e.g. "45 min / 50 questions")
  m = new RegExp(`^${durationRe}\\s*\\/\\s*${countRe}$`).exec(input);
  if (m) {
    const [, v1, u1, v2] = m;
    const unit = matchUnit(u1);
    if (unit) {
      const totalMs = durationToMs(num(v1), unit);
      const r = calculateTimePerQuestion(totalMs, num(v2));
      return {
        success: true,
        expressionText: `${v1} ${u1} ÷ ${v2} questions`,
        resultText: `${r.formatted} per question`,
        detailText: `${r.perQuestionSeconds.toLocaleString()} seconds per question`,
      };
    }
  }

  // 3. duration + / - duration -> total duration
  m = new RegExp(`^${durationRe}\\s*([+-])\\s*${durationRe}$`).exec(input);
  if (m) {
    const [, v1, u1, op, v2, u2] = m;
    const unit1 = matchUnit(u1);
    const unit2 = matchUnit(u2);
    if (unit1 && unit2) {
      const ms1 = durationToMs(num(v1), unit1);
      const ms2 = durationToMs(num(v2), unit2);
      const totalMs = op === "+" ? ms1 + ms2 : ms1 - ms2;
      return {
        success: true,
        expressionText: `${v1} ${u1} ${op} ${v2} ${u2}`,
        resultText: formatDuration(Math.max(0, totalMs)),
        detailText: `${roundClean(totalMs / 1000)} seconds`,
      };
    }
  }

  // 4. duration -> unit  (conversion, e.g. "5000 ms -> seconds" / "5000 ms to seconds")
  m = new RegExp(`^${durationRe}\\s*>>\\s*(${UNIT_PATTERN})$`).exec(input);
  if (m) {
    const [, v1, u1, u2] = m;
    const fromUnit = matchUnit(u1);
    const toUnit = matchUnit(u2);
    if (fromUnit && toUnit) {
      const ms = durationToMs(num(v1), fromUnit);
      const converted = roundClean(ms / (toUnit === "ms" ? 1 : { s: 1000, min: 60000, hr: 3600000, day: 86400000, week: 604800000 }[toUnit]));
      return {
        success: true,
        expressionText: `${v1} ${u1} → ${u2}`,
        resultText: `${converted.toLocaleString()} ${u2}`,
        detailText: formatDuration(ms),
      };
    }
  }

  return {
    success: false,
    error: "Couldn't parse that — try a form like \"54 sec × 50 questions\", \"45 min ÷ 50 questions\", \"2 hr + 35 min\", or \"5000 ms → seconds\".",
  };
}
