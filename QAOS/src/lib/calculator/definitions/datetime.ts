import { CalendarDays, Timer, Cake, CalendarClock, Hourglass } from "lucide-react";
import type { CalculatorDef, CalculatorOutcome } from "../types";
import { formatNumber, round2 } from "../format";

function num(v: number) {
  return formatNumber(round2(v), 0);
}

const MS_PER_SEC = 1000;
const MS_PER_MIN = 60 * MS_PER_SEC;
const MS_PER_HOUR = 60 * MS_PER_MIN;
const MS_PER_DAY = 24 * MS_PER_HOUR;

function countWorkingDays(start: Date, end: Date): number {
  let count = 0;
  const cur = new Date(start);
  cur.setHours(0, 0, 0, 0);
  const last = new Date(end);
  last.setHours(0, 0, 0, 0);
  while (cur <= last) {
    const day = cur.getDay();
    if (day !== 0 && day !== 6) count++;
    cur.setDate(cur.getDate() + 1);
  }
  return count;
}

function durationBreakdown(diffMs: number) {
  const totalSeconds = Math.floor(diffMs / 1000);
  const years = Math.floor(totalSeconds / (365.25 * 24 * 3600));
  const afterYears = totalSeconds - Math.floor(years * 365.25 * 24 * 3600);
  const months = Math.floor(afterYears / (30.44 * 24 * 3600));
  const afterMonths = afterYears - Math.floor(months * 30.44 * 24 * 3600);
  const weeks = Math.floor(afterMonths / (7 * 24 * 3600));
  const afterWeeks = afterMonths - weeks * 7 * 24 * 3600;
  const days = Math.floor(afterWeeks / (24 * 3600));
  const hours = Math.floor(diffMs / MS_PER_HOUR) % 24;
  const minutes = Math.floor(diffMs / MS_PER_MIN) % 60;
  const seconds = Math.floor(diffMs / MS_PER_SEC) % 60;
  return { years, months, weeks, days, hours, minutes, seconds, totalDays: Math.floor(diffMs / MS_PER_DAY) };
}

/* ---------------------------- Date Difference ------------------------------- */

const dateDifferenceCalculator: CalculatorDef = {
  id: "date-difference-calculator",
  slug: "date-difference-calculator",
  name: "Date Difference Calculator",
  category: "datetime",
  description: "Full breakdown of the gap between two dates, plus working days.",
  icon: CalendarDays,
  keywords: ["date difference", "duration", "days between"],
  formulaExplanation: "Difference = End Date − Start Date, broken into years, months, weeks, days, hours, minutes and seconds.",
  fields: [
    { id: "startDate", label: "Start Date", kind: "date" },
    { id: "endDate", label: "End Date", kind: "date" },
  ],
  compute: (_v, raw): CalculatorOutcome => {
    const start = new Date(raw.startDate);
    const end = new Date(raw.endDate);
    const diffMs = Math.abs(end.getTime() - start.getTime());
    const b = durationBreakdown(diffMs);
    const workingDays = countWorkingDays(start < end ? start : end, start < end ? end : start);

    return {
      steps: [
        { label: "Years", formula: "Whole years between dates", value: num(b.years) },
        { label: "Months", formula: "Remaining whole months", value: num(b.months) },
        { label: "Weeks", formula: "Remaining whole weeks", value: num(b.weeks) },
        { label: "Days", formula: "Total days", value: num(b.totalDays) },
        { label: "Hours", formula: "Total hours", value: num(diffMs / MS_PER_HOUR) },
        { label: "Minutes", formula: "Total minutes", value: num(diffMs / MS_PER_MIN) },
        { label: "Seconds", formula: "Total seconds", value: num(diffMs / MS_PER_SEC) },
        { label: "Working Days", formula: "Weekdays only (Mon–Fri)", value: num(workingDays) },
      ],
      summary: [
        { label: "Total Days", value: num(b.totalDays), highlight: true },
        { label: "Years / Months / Weeks / Days", value: `${b.years}y ${b.months}m ${b.weeks}w ${b.days}d` },
        { label: "Working Days", value: num(workingDays) },
        { label: "Total Hours", value: num(diffMs / MS_PER_HOUR) },
      ],
    };
  },
};

/* ---------------------------- Time Difference -------------------------------- */

const timeDifferenceCalculator: CalculatorDef = {
  id: "time-difference-calculator",
  slug: "time-difference-calculator",
  name: "Time Difference Calculator",
  category: "datetime",
  description: "Elapsed hours, minutes and seconds between two clock times (handles overnight spans).",
  icon: Timer,
  keywords: ["time difference", "duration", "clock"],
  formulaExplanation: "Difference = End Time − Start Time. If End Time is earlier than Start Time, it's treated as the next day.",
  fields: [
    { id: "startTime", label: "Start Time", kind: "time" },
    { id: "endTime", label: "End Time", kind: "time" },
  ],
  compute: (_v, raw): CalculatorOutcome => {
    const [sh, sm] = raw.startTime.split(":").map(Number);
    const [eh, em] = raw.endTime.split(":").map(Number);
    let diffMin = eh * 60 + em - (sh * 60 + sm);
    const notes: string[] = [];
    if (diffMin < 0) {
      diffMin += 24 * 60;
      notes.push("End Time is earlier than Start Time — treated as the next day.");
    }
    const hours = Math.floor(diffMin / 60);
    const minutes = diffMin % 60;

    return {
      steps: [
        { label: "Hours", formula: "Whole hours in difference", value: num(hours) },
        { label: "Minutes", formula: "Remaining minutes", value: num(minutes) },
        { label: "Total Minutes", formula: "End Time − Start Time (in minutes)", value: num(diffMin) },
      ],
      summary: [
        { label: "Duration", value: `${hours}h ${minutes}m`, highlight: true },
        { label: "Total Minutes", value: num(diffMin) },
        { label: "Total Seconds", value: num(diffMin * 60) },
      ],
      notes,
    };
  },
};

/* -------------------------------- Age -------------------------------------- */

const ageCalculator: CalculatorDef = {
  id: "age-calculator",
  slug: "age-calculator",
  name: "Age Calculator",
  category: "datetime",
  description: "Exact age in years, months and days as of any reference date.",
  icon: Cake,
  keywords: ["age", "birthday", "date of birth"],
  formulaExplanation: "Age = Reference Date − Date of Birth, broken into years, months and days.",
  fields: [
    { id: "dob", label: "Date of Birth", kind: "date" },
    { id: "asOf", label: "As of Date", kind: "date", helpText: "Defaults to today", optional: true },
  ],
  compute: (_v, raw): CalculatorOutcome => {
    const dob = new Date(raw.dob);
    const asOf = raw.asOf ? new Date(raw.asOf) : new Date();

    let years = asOf.getFullYear() - dob.getFullYear();
    let months = asOf.getMonth() - dob.getMonth();
    let days = asOf.getDate() - dob.getDate();
    if (days < 0) {
      months -= 1;
      const prevMonth = new Date(asOf.getFullYear(), asOf.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }
    const totalDays = Math.floor((asOf.getTime() - dob.getTime()) / MS_PER_DAY);

    return {
      steps: [
        { label: "Years", formula: "Whole years since DOB", value: num(years) },
        { label: "Months", formula: "Remaining whole months", value: num(months) },
        { label: "Days", formula: "Remaining days", value: num(days) },
        { label: "Total Days Lived", formula: "As of Date − Date of Birth", value: num(totalDays) },
      ],
      summary: [
        { label: "Age", value: `${years}y ${months}m ${days}d`, highlight: true },
        { label: "Total Days Lived", value: num(totalDays) },
        { label: "Total Weeks", value: num(totalDays / 7) },
      ],
    };
  },
};

/* ---------------------------- Working Days ----------------------------------- */

const workingDaysCalculator: CalculatorDef = {
  id: "working-days-calculator",
  slug: "working-days-calculator",
  name: "Working Days Calculator",
  category: "datetime",
  description: "Count business days (Mon–Fri) between two dates, excluding weekends.",
  icon: CalendarClock,
  keywords: ["working days", "business days", "weekends"],
  formulaExplanation: "Working Days = Total Days − Weekend Days between Start Date and End Date.",
  fields: [
    { id: "startDate", label: "Start Date", kind: "date" },
    { id: "endDate", label: "End Date", kind: "date" },
  ],
  compute: (_v, raw): CalculatorOutcome => {
    const start = new Date(raw.startDate);
    const end = new Date(raw.endDate);
    const [from, to] = start <= end ? [start, end] : [end, start];
    const totalDays = Math.round((to.getTime() - from.getTime()) / MS_PER_DAY) + 1;
    const workingDays = countWorkingDays(from, to);
    const weekendDays = totalDays - workingDays;

    return {
      steps: [
        { label: "Total Days", formula: "End Date − Start Date + 1", value: num(totalDays) },
        { label: "Weekend Days", formula: "Saturdays + Sundays in range", value: num(weekendDays) },
        { label: "Working Days", formula: "Total Days − Weekend Days", value: num(workingDays) },
      ],
      summary: [
        { label: "Working Days", value: num(workingDays), highlight: true },
        { label: "Weekend Days", value: num(weekendDays) },
        { label: "Total Days", value: num(totalDays) },
      ],
    };
  },
};

/* ------------------------------- Countdown ------------------------------------ */

const countdownCalculator: CalculatorDef = {
  id: "countdown-calculator",
  slug: "countdown-calculator",
  name: "Countdown Calculator",
  category: "datetime",
  description: "Live countdown of days, hours, minutes and seconds to a target date & time.",
  icon: Hourglass,
  keywords: ["countdown", "release", "deadline", "timer"],
  formulaExplanation: "Remaining Time = Target Date & Time − Now, refreshed every second.",
  live: true,
  liveIntervalMs: 1000,
  fields: [
    { id: "targetDate", label: "Target Date", kind: "date" },
    { id: "targetTime", label: "Target Time", kind: "time", defaultValue: "00:00", optional: true },
  ],
  compute: (_v, raw): CalculatorOutcome => {
    const time = raw.targetTime || "00:00";
    const target = new Date(`${raw.targetDate}T${time}:00`);
    const diffMs = target.getTime() - Date.now();
    const passed = diffMs <= 0;
    const abs = Math.abs(diffMs);
    const days = Math.floor(abs / MS_PER_DAY);
    const hours = Math.floor(abs / MS_PER_HOUR) % 24;
    const minutes = Math.floor(abs / MS_PER_MIN) % 60;
    const seconds = Math.floor(abs / MS_PER_SEC) % 60;

    return {
      steps: [
        { label: "Days", formula: "Whole days remaining", value: num(days) },
        { label: "Hours", formula: "Remaining hours", value: num(hours) },
        { label: "Minutes", formula: "Remaining minutes", value: num(minutes) },
        { label: "Seconds", formula: "Remaining seconds", value: num(seconds) },
      ],
      summary: [
        {
          label: passed ? "Time Since Target" : "Time Remaining",
          value: `${days}d ${hours}h ${minutes}m ${seconds}s`,
          highlight: true,
          tone: passed ? "negative" : "positive",
        },
      ],
      notes: passed ? ["Target date/time has already passed."] : [],
    };
  },
};

export const datetimeCalculators: CalculatorDef[] = [
  dateDifferenceCalculator,
  timeDifferenceCalculator,
  ageCalculator,
  workingDaysCalculator,
  countdownCalculator,
];
