export function uid(): string {
  return crypto.randomUUID();
}

/** Formats a running counter as a display id, e.g. 7 -> "TC-0007". */
export function formatDisplayId(prefix: string, counter: number): string {
  return `${prefix}-${String(counter).padStart(4, "0")}`;
}
