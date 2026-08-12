export type AngleUnit = "deg" | "rad";

export class MathEvalError extends Error {}

type TokenType = "number" | "operator" | "namedop" | "func" | "lparen" | "rparen" | "comma" | "const" | "factorial";

interface Token {
  type: TokenType;
  value: string;
}

const FUNCTION_NAMES = [
  "asin",
  "acos",
  "atan",
  "sin",
  "cos",
  "tan",
  "log",
  "ln",
  "sqrt",
  "cbrt",
  "nroot",
  "abs",
  "round",
  "floor",
  "ceil",
] as const;

const NAMED_OPERATORS = ["mod", "nPr", "nCr"] as const;

/** Turns a raw expression string (as built by button presses) into a token stream. */
function tokenize(expr: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < expr.length) {
    const ch = expr[i];

    if (/\s/.test(ch)) {
      i++;
      continue;
    }

    // Number: digits, optional decimal point, optional e/E exponent suffix.
    if (/[0-9.]/.test(ch)) {
      const match = /^\d*\.?\d+([eE][+-]?\d+)?|^\d+\.(?!\d)/.exec(expr.slice(i));
      if (match) {
        tokens.push({ type: "number", value: match[0] });
        i += match[0].length;
        continue;
      }
    }

    // Named binary operators: mod, nPr, nCr (case sensitive as authored by the engine).
    const namedOp = NAMED_OPERATORS.find((op) => expr.startsWith(op, i));
    if (namedOp) {
      tokens.push({ type: "namedop", value: namedOp });
      i += namedOp.length;
      continue;
    }

    // Function names, always immediately followed by '('.
    const fn = FUNCTION_NAMES.find((name) => expr.startsWith(name + "(", i));
    if (fn) {
      tokens.push({ type: "func", value: fn });
      i += fn.length;
      continue;
    }

    if (ch === "π") {
      tokens.push({ type: "const", value: "pi" });
      i++;
      continue;
    }
    if (ch === "e") {
      tokens.push({ type: "const", value: "e" });
      i++;
      continue;
    }
    if (ch === "(") {
      tokens.push({ type: "lparen", value: ch });
      i++;
      continue;
    }
    if (ch === ")") {
      tokens.push({ type: "rparen", value: ch });
      i++;
      continue;
    }
    if (ch === ",") {
      tokens.push({ type: "comma", value: ch });
      i++;
      continue;
    }
    if (ch === "!") {
      tokens.push({ type: "factorial", value: ch });
      i++;
      continue;
    }
    if ("+-×÷^%".includes(ch)) {
      tokens.push({ type: "operator", value: ch });
      i++;
      continue;
    }

    throw new MathEvalError(`Unexpected character "${ch}"`);
  }

  return tokens;
}

class Parser {
  private tokens: Token[];
  private pos = 0;
  private angleUnit: AngleUnit;

  constructor(tokens: Token[], angleUnit: AngleUnit) {
    this.tokens = tokens;
    this.angleUnit = angleUnit;
  }

  private peek(): Token | undefined {
    return this.tokens[this.pos];
  }

  private next(): Token {
    const t = this.tokens[this.pos];
    if (!t) throw new MathEvalError("Unexpected end of expression");
    this.pos++;
    return t;
  }

  parse(): number {
    if (this.tokens.length === 0) throw new MathEvalError("Empty expression");
    const value = this.parseAddSub();
    if (this.pos < this.tokens.length) {
      throw new MathEvalError(`Unexpected token "${this.peek()?.value}"`);
    }
    return value;
  }

  private parseAddSub(): number {
    let left = this.parseMulDiv();
    while (this.peek()?.type === "operator" && (this.peek()?.value === "+" || this.peek()?.value === "-")) {
      const op = this.next().value;
      const right = this.parseMulDiv();
      left = op === "+" ? left + right : left - right;
    }
    return left;
  }

  private parseMulDiv(): number {
    let left = this.parseNamedOp();
    while (this.peek()?.type === "operator" && (this.peek()?.value === "×" || this.peek()?.value === "÷")) {
      const op = this.next().value;
      const right = this.parseNamedOp();
      if (op === "÷") {
        if (right === 0) throw new MathEvalError("Division by zero");
        left = left / right;
      } else {
        left = left * right;
      }
    }
    return left;
  }

  private parseNamedOp(): number {
    let left = this.parsePow();
    while (this.peek()?.type === "namedop") {
      const op = this.next().value;
      const right = this.parsePow();
      left = applyNamedOperator(op, left, right);
    }
    return left;
  }

  private parsePow(): number {
    const base = this.parseUnary();
    if (this.peek()?.type === "operator" && this.peek()?.value === "^") {
      this.next();
      const exponent = this.parsePow(); // right-associative
      return Math.pow(base, exponent);
    }
    return base;
  }

  private parseUnary(): number {
    if (this.peek()?.type === "operator" && this.peek()?.value === "-") {
      this.next();
      return -this.parseUnary();
    }
    if (this.peek()?.type === "operator" && this.peek()?.value === "+") {
      this.next();
      return this.parseUnary();
    }
    return this.parsePostfix();
  }

  private parsePostfix(): number {
    let value = this.parsePrimary();
    while (this.peek()?.type === "factorial" || (this.peek()?.type === "operator" && this.peek()?.value === "%")) {
      const t = this.next();
      if (t.type === "factorial") {
        value = factorial(value);
      } else {
        value = value / 100;
      }
    }
    return value;
  }

  private parsePrimary(): number {
    const t = this.peek();
    if (!t) throw new MathEvalError("Unexpected end of expression");

    if (t.type === "number") {
      this.next();
      return parseFloat(t.value);
    }

    if (t.type === "const") {
      this.next();
      return t.value === "pi" ? Math.PI : Math.E;
    }

    if (t.type === "lparen") {
      this.next();
      const value = this.parseAddSub();
      this.expect("rparen");
      return value;
    }

    if (t.type === "func") {
      const name = this.next().value;
      this.expect("lparen");
      const arg1 = this.parseAddSub();
      let arg2: number | undefined;
      if (this.peek()?.type === "comma") {
        this.next();
        arg2 = this.parseAddSub();
      }
      this.expect("rparen");
      return applyFunction(name, arg1, arg2, this.angleUnit);
    }

    throw new MathEvalError(`Unexpected token "${t.value}"`);
  }

  private expect(type: TokenType) {
    const t = this.peek();
    if (!t || t.type !== type) {
      throw new MathEvalError(`Expected "${type === "rparen" ? ")" : "("}"`);
    }
    this.next();
  }
}

function toRadians(value: number, unit: AngleUnit): number {
  return unit === "deg" ? (value * Math.PI) / 180 : value;
}

function fromRadians(value: number, unit: AngleUnit): number {
  return unit === "deg" ? (value * 180) / Math.PI : value;
}

function factorial(n: number): number {
  if (n < 0 || !Number.isInteger(n)) throw new MathEvalError("Factorial requires a non-negative integer");
  if (n > 170) return Infinity;
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}

function applyNamedOperator(op: string, a: number, b: number): number {
  switch (op) {
    case "mod":
      if (b === 0) throw new MathEvalError("Division by zero");
      return a % b;
    case "nPr":
      return factorial(a) / factorial(a - b);
    case "nCr":
      return factorial(a) / (factorial(b) * factorial(a - b));
    default:
      throw new MathEvalError(`Unknown operator "${op}"`);
  }
}

function applyFunction(name: string, a: number, b: number | undefined, angleUnit: AngleUnit): number {
  switch (name) {
    case "sin":
      return Math.sin(toRadians(a, angleUnit));
    case "cos":
      return Math.cos(toRadians(a, angleUnit));
    case "tan":
      return Math.tan(toRadians(a, angleUnit));
    case "asin":
      return fromRadians(Math.asin(a), angleUnit);
    case "acos":
      return fromRadians(Math.acos(a), angleUnit);
    case "atan":
      return fromRadians(Math.atan(a), angleUnit);
    case "log":
      return Math.log10(a);
    case "ln":
      return Math.log(a);
    case "sqrt":
      if (a < 0) throw new MathEvalError("Invalid input for √");
      return Math.sqrt(a);
    case "cbrt":
      return Math.cbrt(a);
    case "nroot":
      if (b === undefined) throw new MathEvalError("nth root requires two values");
      if (a < 0 && b % 2 === 0) throw new MathEvalError("Invalid input for nth root");
      return Math.sign(a) * Math.pow(Math.abs(a), 1 / b);
    case "abs":
      return Math.abs(a);
    case "round":
      return Math.round(a);
    case "floor":
      return Math.floor(a);
    case "ceil":
      return Math.ceil(a);
    default:
      throw new MathEvalError(`Unknown function "${name}"`);
  }
}

/** Appends any parentheses needed to balance an in-progress expression. */
export function autoCloseParens(expr: string): string {
  let depth = 0;
  for (const ch of expr) {
    if (ch === "(") depth++;
    else if (ch === ")") depth--;
  }
  return depth > 0 ? expr + ")".repeat(depth) : expr;
}

/** Evaluates a calculator expression string, returning a finite number or throwing MathEvalError. */
export function evaluateExpression(expr: string, angleUnit: AngleUnit): number {
  const trimmed = expr.trim();
  if (!trimmed) throw new MathEvalError("Empty expression");
  const tokens = tokenize(autoCloseParens(trimmed));
  const value = new Parser(tokens, angleUnit).parse();
  if (!Number.isFinite(value)) throw new MathEvalError(Number.isNaN(value) ? "Invalid calculation" : "Result is too large");
  return value;
}
