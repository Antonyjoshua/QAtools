import type { PopularZone, ResolvedTimezone } from "./types";

// ---------------------------------------------------------------------------
// Core Intl-based conversion engine — no backend, no timezone-data dependency.
// ---------------------------------------------------------------------------

/** For a UTC instant, the offset (in minutes) between that timezone's wall clock and UTC. */
export function getOffsetMinutes(date: Date, timeZoneId: string): number {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: timeZoneId,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
  const map: Record<string, string> = {};
  for (const part of dtf.formatToParts(date)) {
    if (part.type !== "literal") map[part.type] = part.value;
  }
  const asUTC = Date.UTC(
    Number(map.year),
    Number(map.month) - 1,
    Number(map.day),
    Number(map.hour) % 24,
    Number(map.minute),
    Number(map.second)
  );
  return Math.round((asUTC - date.getTime()) / 60_000);
}

export function getOffsetLabel(minutes: number): string {
  const sign = minutes < 0 ? "-" : "+";
  const abs = Math.abs(minutes);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  return `${sign}${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function getAbbreviation(date: Date, timeZoneId: string): string {
  const dtf = new Intl.DateTimeFormat("en-US", { timeZone: timeZoneId, timeZoneName: "short", hour: "2-digit" });
  const part = dtf.formatToParts(date).find((p) => p.type === "timeZoneName");
  return part?.value ?? timeZoneId;
}

export interface ZoneParts {
  year: number;
  month: number; // 1-12
  day: number;
  hour: number; // 0-23
  minute: number;
  second: number;
  weekday: string; // long form, e.g. "Wednesday"
}

export function getZoneParts(date: Date, timeZoneId: string): ZoneParts {
  const dtf = new Intl.DateTimeFormat("en-US", {
    timeZone: timeZoneId,
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    weekday: "long",
  });
  const map: Record<string, string> = {};
  for (const part of dtf.formatToParts(date)) {
    if (part.type !== "literal") map[part.type] = part.value;
  }
  return {
    year: Number(map.year),
    month: Number(map.month),
    day: Number(map.day),
    hour: Number(map.hour) % 24,
    minute: Number(map.minute),
    second: Number(map.second),
    weekday: map.weekday,
  };
}

/** Resolves a wall-clock date/time picked *in a given timezone* to the UTC instant it represents. */
export function zonedTimeToUtc(year: number, month: number, day: number, hour: number, minute: number, timeZoneId: string): Date {
  const utcGuess = Date.UTC(year, month - 1, day, hour, minute);
  const offset1 = getOffsetMinutes(new Date(utcGuess), timeZoneId);
  let utcMs = utcGuess - offset1 * 60_000;
  // Re-check near DST transitions, where the first guess's offset may no longer apply.
  const offset2 = getOffsetMinutes(new Date(utcMs), timeZoneId);
  if (offset2 !== offset1) utcMs = utcGuess - offset2 * 60_000;
  return new Date(utcMs);
}

export function isDaytime(date: Date, timeZoneId: string): boolean {
  const { hour } = getZoneParts(date, timeZoneId);
  return hour >= 6 && hour < 18;
}

export function getBrowserTimezone(): string {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch {
    return "UTC";
  }
}

function cityFromId(id: string): string {
  const segment = id.split("/").pop() ?? id;
  return segment.replace(/_/g, " ");
}

function regionFromId(id: string): string {
  return id.split("/")[0] ?? "";
}

export function resolveTimezone(id: string, date: Date = new Date()): ResolvedTimezone {
  const offsetMinutes = getOffsetMinutes(date, id);
  return {
    id,
    city: cityFromId(id),
    region: regionFromId(id),
    offsetMinutes,
    offsetLabel: getOffsetLabel(offsetMinutes),
    abbreviation: getAbbreviation(date, id),
  };
}

let cachedAllZoneIds: string[] | null = null;
export function getAllTimezoneIds(): string[] {
  if (cachedAllZoneIds) return cachedAllZoneIds;
  try {
    if (typeof Intl.supportedValuesOf === "function") {
      cachedAllZoneIds = Intl.supportedValuesOf("timeZone");
      return cachedAllZoneIds;
    }
  } catch {
    // fall through to the popular-zone fallback below
  }
  cachedAllZoneIds = Array.from(new Set(POPULAR_ZONES.map((z) => z.id)));
  return cachedAllZoneIds;
}

// ---------------------------------------------------------------------------
// Curated lookups
// ---------------------------------------------------------------------------

export const POPULAR_ZONES: PopularZone[] = [
  { label: "UTC", id: "UTC", country: "—" },
  { label: "GMT", id: "Etc/GMT", country: "United Kingdom" },
  { label: "IST", id: "Asia/Kolkata", country: "India" },
  { label: "PST", id: "America/Los_Angeles", country: "United States" },
  { label: "PDT", id: "America/Los_Angeles", country: "United States" },
  { label: "MST", id: "America/Denver", country: "United States" },
  { label: "CST", id: "America/Chicago", country: "United States" },
  { label: "EST", id: "America/New_York", country: "United States" },
  { label: "EDT", id: "America/New_York", country: "United States" },
  { label: "BST", id: "Europe/London", country: "United Kingdom" },
  { label: "CET", id: "Europe/Paris", country: "France" },
  { label: "EET", id: "Europe/Athens", country: "Greece" },
  { label: "JST", id: "Asia/Tokyo", country: "Japan" },
  { label: "KST", id: "Asia/Seoul", country: "South Korea" },
  { label: "SGT", id: "Asia/Singapore", country: "Singapore" },
  { label: "AEST", id: "Australia/Sydney", country: "Australia" },
  { label: "NZST", id: "Pacific/Auckland", country: "New Zealand" },
  { label: "Dubai", id: "Asia/Dubai", country: "United Arab Emirates" },
  { label: "Qatar", id: "Asia/Qatar", country: "Qatar" },
  { label: "Saudi Arabia", id: "Asia/Riyadh", country: "Saudi Arabia" },
];

const COUNTRY_ALIASES: { country: string; id: string }[] = [
  { country: "India", id: "Asia/Kolkata" },
  { country: "United States", id: "America/New_York" },
  { country: "USA", id: "America/New_York" },
  { country: "United Kingdom", id: "Europe/London" },
  { country: "UK", id: "Europe/London" },
  { country: "Canada", id: "America/Toronto" },
  { country: "Australia", id: "Australia/Sydney" },
  { country: "New Zealand", id: "Pacific/Auckland" },
  { country: "Germany", id: "Europe/Berlin" },
  { country: "France", id: "Europe/Paris" },
  { country: "Spain", id: "Europe/Madrid" },
  { country: "Italy", id: "Europe/Rome" },
  { country: "Netherlands", id: "Europe/Amsterdam" },
  { country: "Ireland", id: "Europe/Dublin" },
  { country: "Portugal", id: "Europe/Lisbon" },
  { country: "Switzerland", id: "Europe/Zurich" },
  { country: "Sweden", id: "Europe/Stockholm" },
  { country: "Norway", id: "Europe/Oslo" },
  { country: "Denmark", id: "Europe/Copenhagen" },
  { country: "Poland", id: "Europe/Warsaw" },
  { country: "Greece", id: "Europe/Athens" },
  { country: "Russia", id: "Europe/Moscow" },
  { country: "Turkey", id: "Europe/Istanbul" },
  { country: "China", id: "Asia/Shanghai" },
  { country: "Japan", id: "Asia/Tokyo" },
  { country: "South Korea", id: "Asia/Seoul" },
  { country: "Singapore", id: "Asia/Singapore" },
  { country: "Hong Kong", id: "Asia/Hong_Kong" },
  { country: "Taiwan", id: "Asia/Taipei" },
  { country: "Thailand", id: "Asia/Bangkok" },
  { country: "Vietnam", id: "Asia/Ho_Chi_Minh" },
  { country: "Indonesia", id: "Asia/Jakarta" },
  { country: "Malaysia", id: "Asia/Kuala_Lumpur" },
  { country: "Philippines", id: "Asia/Manila" },
  { country: "Pakistan", id: "Asia/Karachi" },
  { country: "Bangladesh", id: "Asia/Dhaka" },
  { country: "Sri Lanka", id: "Asia/Colombo" },
  { country: "Nepal", id: "Asia/Kathmandu" },
  { country: "Israel", id: "Asia/Jerusalem" },
  { country: "UAE", id: "Asia/Dubai" },
  { country: "United Arab Emirates", id: "Asia/Dubai" },
  { country: "Qatar", id: "Asia/Qatar" },
  { country: "Saudi Arabia", id: "Asia/Riyadh" },
  { country: "Kuwait", id: "Asia/Kuwait" },
  { country: "Egypt", id: "Africa/Cairo" },
  { country: "South Africa", id: "Africa/Johannesburg" },
  { country: "Nigeria", id: "Africa/Lagos" },
  { country: "Kenya", id: "Africa/Nairobi" },
  { country: "Brazil", id: "America/Sao_Paulo" },
  { country: "Mexico", id: "America/Mexico_City" },
  { country: "Argentina", id: "America/Argentina/Buenos_Aires" },
];

// Cities that don't have their own IANA zone (e.g. India's regional cities all share one
// national zone), plus historical names whose canonical spelling varies by ICU/browser
// (`Intl.supportedValuesOf` may report "Asia/Calcutta" as canonical rather than the modern
// "Asia/Kolkata" alias, depending on the runtime) — searched in addition to the live IANA list
// so these always resolve regardless of which form the local environment prefers.
const CITY_ALIASES: { alias: string; id: string }[] = [
  { alias: "Kolkata", id: "Asia/Kolkata" },
  { alias: "Calcutta", id: "Asia/Kolkata" },
  { alias: "Mumbai", id: "Asia/Kolkata" },
  { alias: "Bombay", id: "Asia/Kolkata" },
  { alias: "Delhi", id: "Asia/Kolkata" },
  { alias: "New Delhi", id: "Asia/Kolkata" },
  { alias: "Bangalore", id: "Asia/Kolkata" },
  { alias: "Bengaluru", id: "Asia/Kolkata" },
  { alias: "Chennai", id: "Asia/Kolkata" },
  { alias: "Madras", id: "Asia/Kolkata" },
  { alias: "Hyderabad", id: "Asia/Kolkata" },
  { alias: "Pune", id: "Asia/Kolkata" },
  { alias: "Yangon", id: "Asia/Yangon" },
  { alias: "Rangoon", id: "Asia/Yangon" },
  { alias: "Saigon", id: "Asia/Ho_Chi_Minh" },
  { alias: "Beijing", id: "Asia/Shanghai" },
];

export function searchTimezones(query: string, date: Date = new Date(), limit = 30): ResolvedTimezone[] {
  const q = query.trim().toLowerCase();
  if (!q) {
    // Several popular labels intentionally share one IANA id (PST/PDT, EST/EDT, GMT/BST) so
    // searching either abbreviation finds it — but the default browse list must show each real
    // zone once, or React sees duplicate keys.
    const seenIds = new Set<string>();
    const deduped: PopularZone[] = [];
    for (const zone of POPULAR_ZONES) {
      if (seenIds.has(zone.id)) continue;
      seenIds.add(zone.id);
      deduped.push(zone);
    }
    return deduped.map((z) => resolveTimezone(z.id, date));
  }

  const seen = new Set<string>();
  const results: ResolvedTimezone[] = [];

  for (const alias of CITY_ALIASES) {
    if (!alias.alias.toLowerCase().includes(q) || seen.has(alias.id)) continue;
    seen.add(alias.id);
    results.push(resolveTimezone(alias.id, date));
  }

  for (const alias of COUNTRY_ALIASES) {
    if (!alias.country.toLowerCase().includes(q) || seen.has(alias.id)) continue;
    seen.add(alias.id);
    results.push(resolveTimezone(alias.id, date));
  }

  for (const zone of POPULAR_ZONES) {
    if (!zone.label.toLowerCase().includes(q) || seen.has(zone.id)) continue;
    seen.add(zone.id);
    results.push(resolveTimezone(zone.id, date));
  }

  for (const id of getAllTimezoneIds()) {
    if (results.length >= limit) break;
    if (seen.has(id)) continue;
    const info = resolveTimezone(id, date);
    const haystack = `${id} ${info.city} ${info.region} ${info.abbreviation} ${info.offsetLabel}`.toLowerCase();
    if (haystack.includes(q)) {
      seen.add(id);
      results.push(info);
    }
  }

  return results.slice(0, limit);
}
