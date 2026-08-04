import { pick } from "./random";

const LOWER = "abcdefghijklmnopqrstuvwxyz";
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()_+-=[]{}<>?";

export interface PasswordOptions {
  length?: number;
  uppercase?: boolean;
  lowercase?: boolean;
  numbers?: boolean;
  symbols?: boolean;
}

export function generatePassword(opts: PasswordOptions = {}): string {
  const {
    length = 14,
    uppercase = true,
    lowercase = true,
    numbers = true,
    symbols = true,
  } = opts;

  let pool = "";
  const required: string[] = [];
  if (lowercase) {
    pool += LOWER;
    required.push(pick(LOWER.split("")));
  }
  if (uppercase) {
    pool += UPPER;
    required.push(pick(UPPER.split("")));
  }
  if (numbers) {
    pool += NUMBERS;
    required.push(pick(NUMBERS.split("")));
  }
  if (symbols) {
    pool += SYMBOLS;
    required.push(pick(SYMBOLS.split("")));
  }
  if (!pool) pool = LOWER;

  const chars = [...required];
  while (chars.length < length) {
    chars.push(pick(pool.split("")));
  }
  // shuffle
  for (let i = chars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.slice(0, length).join("");
}
