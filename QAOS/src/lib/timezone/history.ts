import { resolveTimezone } from "./timezone";
import { formatDate, formatTime } from "./formatter";
import type { ConversionHistoryEntry, DateFormat } from "./types";

export interface ConversionHistoryRow {
  id: string;
  sourceLabel: string;
  targetLabel: string;
  date: string;
  sourceTime: string;
  resultTime: string;
}

/** Turns a stored conversion into the {Source, Destination, Date, Time, Converted Result} row the History panel displays. */
export function summarizeConversion(entry: ConversionHistoryEntry, use24Hour: boolean, dateFormat: DateFormat): ConversionHistoryRow {
  const source = resolveTimezone(entry.sourceZoneId);
  const target = resolveTimezone(entry.targetZoneId);
  const resultDate = new Date(entry.resultUtcMs);

  // sourceDateISO is the exact wall-clock the user picked in the source zone (e.g. "2026-07-30T10:30").
  // Treating those numbers as UTC fields is a pure formatting trick to reproduce that text verbatim,
  // without re-deriving it through any real timezone conversion.
  const [datePart, timePart] = entry.sourceDateISO.split("T");
  const [y, m, d] = datePart.split("-").map(Number);
  const [hh, mm] = (timePart ?? "00:00").split(":").map(Number);
  const sourceWallClock = new Date(Date.UTC(y, m - 1, d, hh, mm));

  return {
    id: entry.id,
    sourceLabel: `${source.city} (${source.abbreviation})`,
    targetLabel: `${target.city} (${target.abbreviation})`,
    date: formatDate(sourceWallClock, "UTC", dateFormat),
    sourceTime: formatTime(sourceWallClock, "UTC", use24Hour),
    resultTime: formatTime(resultDate, entry.targetZoneId, use24Hour),
  };
}
