import { evaluateExpression, MathEvalError, type AngleUnit } from "./math";

export interface EngineState {
  /** The raw expression as typed/tapped, e.g. "56×5+90" or "sin(30)+√(16)". */
  expression: string;
  /** Live preview of the result, or null if the expression can't currently be evaluated. */
  preview: number | null;
  /** Set once the user presses "=" (or Enter): the finalized result of that expression. */
  committedResult: number | null;
  error: string | null;
  memory: number;
}

export const INITIAL_ENGINE_STATE: EngineState = {
  expression: "",
  preview: null,
  committedResult: null,
  error: null,
  memory: 0,
};

const OPERATORS = new Set(["+", "-", "×", "÷", "^"]);

function endsWithOperator(expr: string): boolean {
  return expr.length > 0 && OPERATORS.has(expr[expr.length - 1]);
}

function recomputePreview(expr: string, angleUnit: AngleUnit): { preview: number | null; error: string | null } {
  if (!expr.trim()) return { preview: null, error: null };
  try {
    return { preview: evaluateExpression(expr, angleUnit), error: null };
  } catch {
    // Live preview failures (e.g. mid-expression, unbalanced parens) are silent — only
    // surfaced as an error once the user actually commits with "=".
    return { preview: null, error: null };
  }
}

/** Finds the operand (number, constant, or balanced group) at the very end of the expression. */
function findTrailingOperand(expr: string): { before: string; operand: string } {
  if (!expr) return { before: "", operand: "" };
  const end = expr.length;

  if (expr[end - 1] === ")") {
    let depth = 0;
    let j = end;
    while (j > 0) {
      j--;
      if (expr[j] === ")") depth++;
      else if (expr[j] === "(") {
        depth--;
        if (depth === 0) break;
      }
    }
    let k = j;
    while (k > 0 && /[a-zA-Z]/.test(expr[k - 1])) k--;
    return { before: expr.slice(0, k), operand: expr.slice(k, end) };
  }

  if (/[0-9.]/.test(expr[end - 1] ?? "")) {
    let j = end;
    while (j > 0 && /[0-9.]/.test(expr[j - 1])) j--;
    if (j > 0 && expr[j - 1] === "-" && (j - 1 === 0 || /[+\-×÷^(,]/.test(expr[j - 2] ?? " "))) j--;
    return { before: expr.slice(0, j), operand: expr.slice(j, end) };
  }

  if (expr[end - 1] === "π" || expr[end - 1] === "e") {
    return { before: expr.slice(0, end - 1), operand: expr[end - 1] };
  }

  return { before: expr, operand: "" };
}

function withNewExpression(state: EngineState, expression: string, angleUnit: AngleUnit): EngineState {
  const { preview, error } = recomputePreview(expression, angleUnit);
  return { ...state, expression, preview, error, committedResult: null };
}

export function pressDigit(state: EngineState, digit: string, angleUnit: AngleUnit): EngineState {
  const base = state.committedResult !== null ? "" : state.expression;
  return withNewExpression(state, base + digit, angleUnit);
}

export function pressDecimalPoint(state: EngineState, angleUnit: AngleUnit): EngineState {
  const base = state.committedResult !== null ? "" : state.expression;
  const { operand } = findTrailingOperand(base);
  if (operand.includes(".")) return state;
  const needsLeadingZero = operand === "" || operand === "-";
  return withNewExpression(state, base + (needsLeadingZero ? "0." : "."), angleUnit);
}

export function pressOperator(state: EngineState, op: string, angleUnit: AngleUnit): EngineState {
  let base = state.committedResult !== null ? String(state.committedResult) : state.expression;
  if (endsWithOperator(base)) base = base.slice(0, -1);
  if (base === "" && op !== "-") return state;
  return withNewExpression(state, base + op, angleUnit);
}

export function pressConstant(state: EngineState, token: "π" | "e", angleUnit: AngleUnit): EngineState {
  const base = state.committedResult !== null ? "" : state.expression;
  return withNewExpression(state, base + token, angleUnit);
}

export function pressOpenParen(state: EngineState, angleUnit: AngleUnit): EngineState {
  const base = state.committedResult !== null ? "" : state.expression;
  return withNewExpression(state, base + "(", angleUnit);
}

export function pressCloseParen(state: EngineState, angleUnit: AngleUnit): EngineState {
  if (state.committedResult !== null) return state;
  const opens = (state.expression.match(/\(/g) ?? []).length;
  const closes = (state.expression.match(/\)/g) ?? []).length;
  if (closes >= opens) return state;
  return withNewExpression(state, state.expression + ")", angleUnit);
}

/** Wraps the trailing operand in a unary prefix function, e.g. "16" -> "sqrt(16)". */
export function pressUnaryFunction(state: EngineState, prefix: string, angleUnit: AngleUnit): EngineState {
  const base = state.committedResult !== null ? String(state.committedResult) : state.expression;
  const { before, operand } = findTrailingOperand(base);
  const next = operand ? `${before}${prefix}(${operand})` : `${base}${prefix}(`;
  return withNewExpression(state, next, angleUnit);
}

/** Wraps the trailing operand as (operand)^power, e.g. x², x³. */
export function pressPower(state: EngineState, power: 2 | 3, angleUnit: AngleUnit): EngineState {
  const base = state.committedResult !== null ? String(state.committedResult) : state.expression;
  const { before, operand } = findTrailingOperand(base);
  const next = operand ? `${before}(${operand})^${power}` : base;
  return withNewExpression(state, next, angleUnit);
}

export function pressFactorial(state: EngineState, angleUnit: AngleUnit): EngineState {
  const base = state.committedResult !== null ? String(state.committedResult) : state.expression;
  const { before, operand } = findTrailingOperand(base);
  const next = operand ? `${before}(${operand})!` : base;
  return withNewExpression(state, next, angleUnit);
}

/** Starts an nth-root call, wrapping the trailing operand as the radicand: "8" -> "nroot(8, ". */
export function pressNthRoot(state: EngineState, angleUnit: AngleUnit): EngineState {
  const base = state.committedResult !== null ? String(state.committedResult) : state.expression;
  const { before, operand } = findTrailingOperand(base);
  const next = operand ? `${before}nroot(${operand}, ` : `${base}nroot(`;
  return withNewExpression(state, next, angleUnit);
}

export function pressNamedOperator(state: EngineState, op: "mod" | "nPr" | "nCr", angleUnit: AngleUnit): EngineState {
  let base = state.committedResult !== null ? String(state.committedResult) : state.expression;
  if (endsWithOperator(base)) base = base.slice(0, -1);
  if (base === "") return state;
  return withNewExpression(state, `${base}${op}`, angleUnit);
}

export function pressExp(state: EngineState, angleUnit: AngleUnit): EngineState {
  if (state.committedResult !== null) return state;
  const { operand } = findTrailingOperand(state.expression);
  if (!operand || operand.includes("e")) return state;
  return withNewExpression(state, state.expression + "e", angleUnit);
}

export function pressPercent(state: EngineState, angleUnit: AngleUnit): EngineState {
  const base = state.committedResult !== null ? String(state.committedResult) : state.expression;
  const { operand } = findTrailingOperand(base);
  if (!operand) return state;
  return withNewExpression(state, base + "%", angleUnit);
}

export function pressToggleSign(state: EngineState, angleUnit: AngleUnit): EngineState {
  const base = state.committedResult !== null ? String(state.committedResult) : state.expression;
  const { before, operand } = findTrailingOperand(base);
  if (!operand) return state;
  const next = operand.startsWith("-") ? `${before}${operand.slice(1)}` : `${before}-${operand}`;
  return withNewExpression(state, next, angleUnit);
}

export function pressBackspace(state: EngineState, angleUnit: AngleUnit): EngineState {
  if (state.committedResult !== null) return withNewExpression(state, "", angleUnit);
  return withNewExpression(state, state.expression.slice(0, -1), angleUnit);
}

export function pressClearAll(state: EngineState): EngineState {
  return { ...INITIAL_ENGINE_STATE, memory: state.memory };
}

export function pressEquals(state: EngineState, angleUnit: AngleUnit): EngineState {
  if (!state.expression.trim()) return state;
  try {
    const value = evaluateExpression(state.expression, angleUnit);
    return { ...state, committedResult: value, preview: value, error: null };
  } catch (err) {
    return { ...state, error: err instanceof MathEvalError ? err.message : "Error", preview: null };
  }
}

export function pressMemoryClear(state: EngineState): EngineState {
  return { ...state, memory: 0 };
}

export function pressMemoryRecall(state: EngineState, angleUnit: AngleUnit): EngineState {
  const base = state.committedResult !== null ? "" : state.expression;
  return withNewExpression({ ...state }, base + String(state.memory), angleUnit);
}

export function pressMemoryAdd(state: EngineState, angleUnit: AngleUnit): EngineState {
  const current = state.committedResult ?? recomputePreview(state.expression, angleUnit).preview ?? 0;
  return { ...state, memory: state.memory + current };
}

export function pressMemorySubtract(state: EngineState, angleUnit: AngleUnit): EngineState {
  const current = state.committedResult ?? recomputePreview(state.expression, angleUnit).preview ?? 0;
  return { ...state, memory: state.memory - current };
}
