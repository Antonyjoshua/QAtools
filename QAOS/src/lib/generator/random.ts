/** Shared randomization helpers built on top of Math.random. */

export function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randFloat(min: number, max: number, decimals = 2): number {
  const val = Math.random() * (max - min) + min;
  return Number(val.toFixed(decimals));
}

export function pick<T>(arr: readonly T[]): T {
  return arr[randInt(0, arr.length - 1)];
}

export function pickMany<T>(arr: readonly T[], n: number): T[] {
  const copy = [...arr];
  const out: T[] = [];
  for (let i = 0; i < n && copy.length > 0; i++) {
    out.push(copy.splice(randInt(0, copy.length - 1), 1)[0]);
  }
  return out;
}

export function bool(trueChance = 0.5): boolean {
  return Math.random() < trueChance;
}

export function digits(n: number): string {
  let out = "";
  for (let i = 0; i < n; i++) out += randInt(0, 9);
  return out;
}

export function digitsNoLeadingZero(n: number): string {
  return String(randInt(1, 9)) + digits(n - 1);
}

export function letters(n: number, upper = true): string {
  const alphabet = upper ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ" : "abcdefghijklmnopqrstuvwxyz";
  let out = "";
  for (let i = 0; i < n; i++) out += pick(alphabet.split(""));
  return out;
}

export function alphaNum(n: number, upper = true): string {
  const alphabet = (upper ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ" : "abcdefghijklmnopqrstuvwxyz") + "0123456789";
  let out = "";
  for (let i = 0; i < n; i++) out += pick(alphabet.split(""));
  return out;
}

export function uuidv4(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export function randomDate(startYear: number, endYear: number): Date {
  const start = new Date(startYear, 0, 1).getTime();
  const end = new Date(endYear, 11, 31).getTime();
  return new Date(start + Math.random() * (end - start));
}

export function formatDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export function pad(n: number, width: number): string {
  return String(n).padStart(width, "0");
}

export function base64Encode(input: string): string {
  if (typeof window !== "undefined" && typeof window.btoa === "function") {
    return window.btoa(unescape(encodeURIComponent(input)));
  }
  return Buffer.from(input, "utf-8").toString("base64");
}

export function base64UrlEncode(input: string): string {
  return base64Encode(input).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function shuffle<T>(arr: readonly T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = randInt(0, i);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
