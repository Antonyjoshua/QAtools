import type { XpCategory, XpLogEntry } from "@/lib/solo/types";
import { todayKey } from "@/lib/solo/utils/date";

export function createXpLogEntry(
  amount: number,
  reason: string,
  category: XpCategory,
  date: string = todayKey()
): XpLogEntry {
  return {
    id: crypto.randomUUID(),
    date,
    timestamp: Date.now(),
    amount,
    reason,
    category,
  };
}

export function sumXpForDate(log: XpLogEntry[], date: string): number {
  return log.reduce((sum, entry) => (entry.date === date ? sum + entry.amount : sum), 0);
}

export function sumXpForDates(log: XpLogEntry[], dates: string[]): number {
  const set = new Set(dates);
  return log.reduce((sum, entry) => (set.has(entry.date) ? sum + entry.amount : sum), 0);
}
