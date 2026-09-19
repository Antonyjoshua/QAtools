export type DurationUnit = "ms" | "s" | "min" | "hr" | "day" | "week";

export const MS_PER_UNIT: Record<DurationUnit, number> = {
  ms: 1,
  s: 1000,
  min: 60000,
  hr: 3600000,
  day: 86400000,
  week: 604800000,
};

export const UNIT_LABEL: Record<DurationUnit, { singular: string; plural: string }> = {
  ms: { singular: "millisecond", plural: "milliseconds" },
  s: { singular: "second", plural: "seconds" },
  min: { singular: "minute", plural: "minutes" },
  hr: { singular: "hour", plural: "hours" },
  day: { singular: "day", plural: "days" },
  week: { singular: "week", plural: "weeks" },
};

export const DURATION_UNITS: DurationUnit[] = ["ms", "s", "min", "hr", "day", "week"];

export function unitLabel(unit: DurationUnit, value: number): string {
  const l = UNIT_LABEL[unit];
  return value === 1 ? l.singular : l.plural;
}
