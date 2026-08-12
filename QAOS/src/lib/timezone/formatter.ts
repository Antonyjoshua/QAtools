import { getZoneParts } from "./timezone";
import type { DateFormat } from "./types";

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

export function formatTime(date: Date, timeZoneId: string, use24Hour: boolean): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: timeZoneId,
    hour: "2-digit",
    minute: "2-digit",
    hour12: !use24Hour,
  }).format(date);
}

export function formatDate(date: Date, timeZoneId: string, dateFormat: DateFormat): string {
  const p = getZoneParts(date, timeZoneId);
  const dd = pad(p.day);
  const mm = pad(p.month);
  if (dateFormat === "mdy") return `${mm}/${dd}/${p.year}`;
  if (dateFormat === "ymd") return `${p.year}-${mm}-${dd}`;
  return `${dd}/${mm}/${p.year}`;
}

export function formatDateLong(date: Date, timeZoneId: string): string {
  return new Intl.DateTimeFormat("en-US", { timeZone: timeZoneId, day: "numeric", month: "short", year: "numeric" }).format(date);
}

export function formatWeekday(date: Date, timeZoneId: string): string {
  return getZoneParts(date, timeZoneId).weekday;
}

/** "-9 Hours 30 Minutes" style label for the difference between two offsets. */
export function formatDifferenceLabel(diffMinutes: number): string {
  if (diffMinutes === 0) return "Same time";
  const sign = diffMinutes < 0 ? "-" : "+";
  const abs = Math.abs(diffMinutes);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  const parts: string[] = [];
  if (h) parts.push(`${h} Hour${h === 1 ? "" : "s"}`);
  if (m) parts.push(`${m} Minute${m === 1 ? "" : "s"}`);
  return `${sign}${parts.join(" ")}`;
}
