import { DURATION_UNITS, MS_PER_UNIT, unitLabel, type DurationUnit } from "./units";

/** Rounds to `decimals` places and strips trailing zeros (avoids 0.1 + 0.2 === 0.30000000000000004 style artifacts in display). */
export function roundClean(value: number, decimals = 4): number {
  return Number(value.toFixed(decimals));
}

/** Formats an integer with thousands separators, e.g. 54000 -> "54,000". */
export function formatInt(value: number): string {
  return Math.round(value).toLocaleString("en-US");
}

// --- Core unit conversions (all named per spec) -----------------------------

export function durationToMs(value: number, unit: DurationUnit): number {
  return value * MS_PER_UNIT[unit];
}

export function durationToSeconds(value: number, unit: DurationUnit): number {
  return durationToMs(value, unit) / 1000;
}

export function msToUnit(ms: number, unit: DurationUnit): number {
  return ms / MS_PER_UNIT[unit];
}

export function secondsToMinutes(seconds: number): number {
  return seconds / 60;
}

export function secondsToHours(seconds: number): number {
  return seconds / 3600;
}

export function minutesToSeconds(minutes: number): number {
  return minutes * 60;
}

export function hoursToSeconds(hours: number): number {
  return hours * 3600;
}

// --- Breakdown + human-readable formatting -----------------------------------

export interface DurationBreakdown {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  milliseconds: number;
}

/** Splits a millisecond total into day/hour/minute/second/ms components. */
export function secondsToDuration(totalSeconds: number): DurationBreakdown {
  return msToDuration(totalSeconds * 1000);
}

export function msToDuration(totalMs: number): DurationBreakdown {
  let remaining = Math.max(0, Math.round(totalMs));
  const days = Math.floor(remaining / 86400000);
  remaining -= days * 86400000;
  const hours = Math.floor(remaining / 3600000);
  remaining -= hours * 3600000;
  const minutes = Math.floor(remaining / 60000);
  remaining -= minutes * 60000;
  const seconds = Math.floor(remaining / 1000);
  remaining -= seconds * 1000;
  return { days, hours, minutes, seconds, milliseconds: remaining };
}

/**
 * Smart human-readable duration: trims leading zero units (day/hour) and
 * trailing zero units (seconds), keeps zero units in the middle.
 * "2 hours 0 minutes 15 seconds", "1 day 3 hours 20 minutes", "54 seconds".
 */
export function formatDuration(totalMs: number): string {
  const b = msToDuration(totalMs);
  const parts: { n: number; unit: DurationUnit }[] = [
    { n: b.days, unit: "day" },
    { n: b.hours, unit: "hr" },
    { n: b.minutes, unit: "min" },
    { n: b.seconds, unit: "s" },
  ];

  let start = 0;
  while (start < parts.length - 1 && parts[start].n === 0) start++;
  let trimmed = parts.slice(start);

  let end = trimmed.length;
  while (end > 1 && trimmed[end - 1].n === 0) end--;
  trimmed = trimmed.slice(0, end);

  return trimmed.map((p) => `${p.n} ${unitLabel(p.unit, p.n)}`).join(" ");
}

/** "0 minutes 54 seconds" style fixed M:S format (always shows both, even when minutes is 0). */
export function formatMinSec(totalMs: number): string {
  const b = msToDuration(totalMs);
  const totalMinutes = b.days * 1440 + b.hours * 60 + b.minutes;
  return `${totalMinutes} ${unitLabel("min", totalMinutes)} ${b.seconds} ${unitLabel("s", b.seconds)}`;
}

/** "0 hours 0 minutes 54 seconds" style fixed H:M:S format. */
export function formatHourMinSec(totalMs: number): string {
  const b = msToDuration(totalMs);
  const totalHours = b.days * 24 + b.hours;
  return `${totalHours} ${unitLabel("hr", totalHours)} ${b.minutes} ${unitLabel("min", b.minutes)} ${b.seconds} ${unitLabel("s", b.seconds)}`;
}

export interface DurationEquivalent {
  label: string;
  value: string;
}

/**
 * The fixed set of "useful equivalent values" shown for any duration —
 * mirrors the spec's Mode 1 example (54 seconds -> 6 rows).
 */
export function durationEquivalents(totalMs: number): DurationEquivalent[] {
  const seconds = totalMs / 1000;
  return [
    { label: "Seconds", value: `${roundClean(seconds)} ${unitLabel("s", seconds)}` },
    { label: "Minutes : Seconds", value: formatMinSec(totalMs) },
    { label: "Hours : Minutes : Seconds", value: formatHourMinSec(totalMs) },
    { label: "Decimal minutes", value: `${roundClean(msToUnit(totalMs, "min"))} minutes` },
    { label: "Decimal hours", value: `${roundClean(msToUnit(totalMs, "hr"))} hours` },
    { label: "Milliseconds", value: `${formatInt(totalMs)} milliseconds` },
  ];
}

/** "= 5130 seconds / = 85.5 minutes / = 1.425 hours" style exact-total lines. */
export function exactTotals(totalMs: number): DurationEquivalent[] {
  return [
    { label: "Seconds", value: formatInt(totalMs / 1000) },
    { label: "Minutes", value: String(roundClean(msToUnit(totalMs, "min"))) },
    { label: "Hours", value: String(roundClean(msToUnit(totalMs, "hr"))) },
  ];
}

export { DURATION_UNITS };
export type { DurationUnit };
