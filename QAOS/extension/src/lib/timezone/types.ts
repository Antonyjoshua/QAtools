export type TimezoneTab = "converter" | "worldclock" | "meeting";

export interface PopularZone {
  label: string; // e.g. "IST"
  id: string; // IANA identifier, e.g. "Asia/Kolkata"
  country: string;
}

export interface ResolvedTimezone {
  id: string;
  city: string;
  region: string;
  offsetMinutes: number;
  offsetLabel: string; // "+05:30"
  abbreviation: string; // "IST"
}

export interface FavoriteTimezone {
  id: string;
  timezoneId: string;
  customName: string | null;
  order: number;
}

export interface ConversionHistoryEntry {
  id: string;
  sourceZoneId: string;
  targetZoneId: string;
  sourceDateISO: string; // "yyyy-mm-ddTHH:mm" wall-clock time picked in the source zone
  resultUtcMs: number; // the resolved UTC instant
  createdAt: number;
}

export type DateFormat = "dmy" | "mdy" | "ymd";

export interface TimezoneSettings {
  use24Hour: boolean;
  dateFormat: DateFormat;
  firstDayOfWeek: 0 | 1; // 0 = Sunday, 1 = Monday
  defaultTimezoneId: string | null;
  autoDetectLocation: boolean;
}

export interface MeetingLocation {
  id: string;
  timezoneId: string;
}
