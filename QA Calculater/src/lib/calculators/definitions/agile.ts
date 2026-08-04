import {
  Rocket,
  Gauge,
  TrendingDown,
  TrendingUp,
  Users,
  UserCog,
  ClipboardCheck,
  CheckSquare,
} from "lucide-react";
import type { CalculatorDef, CalculatorOutcome } from "../types";
import { formatNumber, formatPercent, round2 } from "../format";

function pct(v: number) {
  return formatPercent(round2(Number.isFinite(v) ? v : 0));
}
function num(v: number, decimals = 2) {
  return formatNumber(round2(Number.isFinite(v) ? v : 0), decimals);
}

/* ------------------------------- Sprint Velocity ------------------------------- */

const sprintVelocityCalculator: CalculatorDef = {
  id: "sprint-velocity-calculator",
  slug: "sprint-velocity-calculator",
  name: "Sprint Velocity Calculator",
  category: "agile",
  description: "Average story points delivered per sprint across a project.",
  icon: Rocket,
  keywords: ["sprint velocity", "story points", "agile", "scrum"],
  formulaExplanation: "Average Velocity = Total Story Points Completed ÷ Number of Sprints.",
  fields: [
    { id: "storyPoints", label: "Total Story Points Completed", kind: "number", allowDecimal: true, allowZero: false },
    { id: "sprintCount", label: "Number of Sprints", kind: "number", allowDecimal: false, allowZero: false },
  ],
  compute: (v): CalculatorOutcome => {
    const velocity = v.storyPoints / v.sprintCount;
    return {
      steps: [{ label: "Average Velocity", formula: "Total Story Points ÷ Number of Sprints", value: `${num(velocity)} pts/sprint` }],
      summary: [{ label: "Average Velocity", value: `${num(velocity)} pts/sprint`, highlight: true }],
    };
  },
};

/* ------------------------------- Sprint Capacity ------------------------------- */

const sprintCapacityCalculator: CalculatorDef = {
  id: "sprint-capacity-calculator",
  slug: "sprint-capacity-calculator",
  name: "Sprint Capacity Calculator",
  category: "agile",
  description: "Estimate available team hours for a sprint, adjusted for focus factor.",
  icon: Gauge,
  keywords: ["sprint capacity", "team capacity", "focus factor"],
  formulaExplanation: "Capacity (hours) = Developers × Hours per Day × Sprint Days × Focus Factor% / 100.",
  fields: [
    { id: "developers", label: "Number of Developers", kind: "number", allowDecimal: false, allowZero: false },
    { id: "hoursPerDay", label: "Available Hours per Day", kind: "number", allowDecimal: true, allowZero: false, defaultValue: "6" },
    { id: "sprintDays", label: "Sprint Length (days)", kind: "number", allowDecimal: false, allowZero: false, defaultValue: "10" },
    { id: "focusFactor", label: "Focus Factor %", kind: "number", suffix: "%", allowDecimal: true, allowZero: false, defaultValue: "80", max: 100 },
  ],
  compute: (v): CalculatorOutcome => {
    const capacity = v.developers * v.hoursPerDay * v.sprintDays * (v.focusFactor / 100);
    return {
      steps: [
        { label: "Raw Hours", formula: "Developers × Hours per Day × Sprint Days", value: num(v.developers * v.hoursPerDay * v.sprintDays) },
        { label: "Sprint Capacity", formula: "Raw Hours × Focus Factor%", value: `${num(capacity)} h` },
      ],
      summary: [{ label: "Sprint Capacity", value: `${num(capacity)} hours`, highlight: true }],
    };
  },
};

/* -------------------------------- Sprint Progress -------------------------------- */

const sprintProgressCalculator: CalculatorDef = {
  id: "sprint-progress-calculator",
  slug: "sprint-progress-calculator",
  name: "Sprint Progress Calculator",
  category: "agile",
  description: "Compare story point completion against time elapsed to see if a sprint is on track.",
  icon: TrendingUp,
  keywords: ["sprint progress", "on track", "scrum"],
  formulaExplanation: "Points Complete % = Completed ÷ Planned × 100. Time Elapsed % = Days Elapsed ÷ Sprint Days × 100.",
  fields: [
    { id: "planned", label: "Story Points Planned", kind: "number", allowDecimal: true, allowZero: false },
    { id: "completed", label: "Story Points Completed", kind: "number", allowDecimal: true, allowZero: true },
    { id: "daysElapsed", label: "Days Elapsed", kind: "number", allowDecimal: true, allowZero: true },
    { id: "sprintDays", label: "Total Sprint Days", kind: "number", allowDecimal: true, allowZero: false },
  ],
  compute: (v): CalculatorOutcome => {
    const pointsPercent = (v.completed / v.planned) * 100;
    const timePercent = (v.daysElapsed / v.sprintDays) * 100;
    const delta = pointsPercent - timePercent;
    const status = delta >= -5 ? "On track" : delta >= -20 ? "Slightly behind" : "At risk";

    return {
      steps: [
        { label: "Points Complete %", formula: "Completed ÷ Planned × 100", value: pct(pointsPercent) },
        { label: "Time Elapsed %", formula: "Days Elapsed ÷ Sprint Days × 100", value: pct(timePercent) },
      ],
      summary: [
        { label: "Points Complete %", value: pct(pointsPercent), highlight: true },
        { label: "Time Elapsed %", value: pct(timePercent) },
        { label: "Status", value: status, tone: delta >= -5 ? "positive" : delta >= -20 ? "default" : "negative" },
      ],
      progress: [
        { label: "Points Complete", value: Math.min(pointsPercent, 100), color: "var(--status-good)" },
        { label: "Time Elapsed", value: Math.min(timePercent, 100), color: "var(--muted-foreground)" },
      ],
    };
  },
};

/* --------------------------------- Burndown --------------------------------- */

const burndownCalculator: CalculatorDef = {
  id: "burndown-calculator",
  slug: "burndown-calculator",
  name: "Burndown Calculator",
  category: "agile",
  description: "Compare ideal vs actual remaining work partway through a sprint.",
  icon: TrendingDown,
  keywords: ["burndown", "sprint tracking", "remaining work"],
  formulaExplanation:
    "Ideal Remaining = Total × (1 − Days Elapsed ÷ Sprint Days). Actual Remaining = Total − Completed.",
  fields: [
    { id: "total", label: "Total Story Points", kind: "number", allowDecimal: true, allowZero: false },
    { id: "completed", label: "Points Completed So Far", kind: "number", allowDecimal: true, allowZero: true },
    { id: "daysElapsed", label: "Days Elapsed", kind: "number", allowDecimal: true, allowZero: true },
    { id: "sprintDays", label: "Total Sprint Days", kind: "number", allowDecimal: true, allowZero: false },
  ],
  compute: (v): CalculatorOutcome => {
    const idealRemaining = v.total * (1 - v.daysElapsed / v.sprintDays);
    const actualRemaining = v.total - v.completed;
    const variance = actualRemaining - idealRemaining;
    const dailyRate = v.daysElapsed > 0 ? v.completed / v.daysElapsed : 0;
    const projectedDaysToFinish = dailyRate > 0 ? actualRemaining / dailyRate : Infinity;

    return {
      steps: [
        { label: "Ideal Remaining", formula: "Total × (1 − Days Elapsed / Sprint Days)", value: num(idealRemaining) },
        { label: "Actual Remaining", formula: "Total − Completed", value: num(actualRemaining) },
        { label: "Variance", formula: "Actual − Ideal", value: num(variance) },
      ],
      summary: [
        { label: "Actual Remaining", value: num(actualRemaining), highlight: true },
        { label: "Ideal Remaining", value: num(idealRemaining) },
        { label: "Variance", value: num(variance), tone: variance <= 0 ? "positive" : "negative" },
        {
          label: "Projected Days to Finish",
          value: Number.isFinite(projectedDaysToFinish) ? num(projectedDaysToFinish, 1) : "—",
        },
      ],
      notes: variance > 0 ? ["Behind the ideal burndown line — remaining work is higher than planned for this point in the sprint."] : [],
    };
  },
};

/* ---------------------------------- Burnup ---------------------------------- */

const burnupCalculator: CalculatorDef = {
  id: "burnup-calculator",
  slug: "burnup-calculator",
  name: "Burnup Calculator",
  category: "agile",
  description: "Track cumulative work completed against total scope, including scope added mid-sprint.",
  icon: TrendingUp,
  keywords: ["burnup", "scope creep", "cumulative flow"],
  formulaExplanation: "Effective Scope = Original Scope + Scope Added. Completion % = Completed ÷ Effective Scope × 100.",
  fields: [
    { id: "originalScope", label: "Original Scope (points)", kind: "number", allowDecimal: true, allowZero: false },
    { id: "scopeAdded", label: "Scope Added Mid-Sprint (optional)", kind: "number", allowDecimal: true, allowZero: true, optional: true, defaultValue: "0" },
    { id: "completed", label: "Points Completed", kind: "number", allowDecimal: true, allowZero: true },
  ],
  compute: (v): CalculatorOutcome => {
    const effectiveScope = v.originalScope + v.scopeAdded;
    const completionPercent = (v.completed / effectiveScope) * 100;
    const remaining = effectiveScope - v.completed;

    return {
      steps: [
        { label: "Effective Scope", formula: "Original Scope + Scope Added", value: num(effectiveScope) },
        { label: "Completion %", formula: "Completed ÷ Effective Scope × 100", value: pct(completionPercent) },
      ],
      summary: [
        { label: "Completion %", value: pct(completionPercent), highlight: true },
        { label: "Effective Scope", value: num(effectiveScope) },
        { label: "Remaining", value: num(remaining) },
      ],
      progress: [{ label: "Completed", value: Math.min(completionPercent, 100), color: "var(--status-good)" }],
      notes: v.scopeAdded > 0 ? [`Scope grew by ${num(v.scopeAdded)} points mid-sprint — this is what a burnup chart makes visible that a burndown chart hides.`] : [],
    };
  },
};

/* -------------------------------- Team Capacity -------------------------------- */

const teamCapacityCalculator: CalculatorDef = {
  id: "team-capacity-calculator",
  slug: "team-capacity-calculator",
  name: "Team Capacity Calculator",
  category: "agile",
  description: "Total available hours for a team over a number of weeks.",
  icon: Users,
  keywords: ["team capacity", "available hours"],
  formulaExplanation: "Total Capacity = Team Members × Avg Hours per Member per Week × Number of Weeks.",
  fields: [
    { id: "members", label: "Team Members", kind: "number", allowDecimal: false, allowZero: false },
    { id: "hoursPerWeek", label: "Avg Available Hours per Member per Week", kind: "number", allowDecimal: true, allowZero: false, defaultValue: "30" },
    { id: "weeks", label: "Number of Weeks", kind: "number", allowDecimal: true, allowZero: false, defaultValue: "2" },
  ],
  compute: (v): CalculatorOutcome => {
    const capacity = v.members * v.hoursPerWeek * v.weeks;
    return {
      steps: [{ label: "Total Capacity", formula: "Members × Hours per Week × Weeks", value: `${num(capacity)} h` }],
      summary: [{ label: "Total Team Capacity", value: `${num(capacity)} hours`, highlight: true }],
    };
  },
};

/* ------------------------------ Allocation (Dev/QA) ------------------------------ */

function buildAllocationCalculator(kind: "developer" | "qa"): CalculatorDef {
  const isDev = kind === "developer";
  return {
    id: `${kind}-allocation-calculator`,
    slug: `${kind}-allocation-calculator`,
    name: `${isDev ? "Developer" : "QA"} Allocation Calculator`,
    category: "agile",
    description: `Split available ${isDev ? "developer" : "QA"} hours between ${
      isDev ? "new features and maintenance" : "new feature testing and regression/automation"
    }.`,
    icon: isDev ? UserCog : Users,
    keywords: [`${kind} allocation`, "capacity split"],
    formulaExplanation: `${isDev ? "Feature" : "New Feature Testing"} Hours = Total Hours × Allocation% / 100. Remainder goes to ${
      isDev ? "maintenance" : "regression/automation"
    }.`,
    fields: [
      { id: "totalHours", label: `Total ${isDev ? "Dev" : "QA"} Hours Available`, kind: "number", allowDecimal: true, allowZero: false },
      {
        id: "allocationPercent",
        label: `% Allocated to ${isDev ? "New Features" : "New Feature Testing"}`,
        kind: "number",
        suffix: "%",
        allowDecimal: true,
        allowZero: true,
        defaultValue: "70",
        max: 100,
      },
    ],
    compute: (v): CalculatorOutcome => {
      const primaryHours = v.totalHours * (v.allocationPercent / 100);
      const secondaryHours = v.totalHours - primaryHours;
      const primaryLabel = isDev ? "Feature Hours" : "New Feature Testing Hours";
      const secondaryLabel = isDev ? "Maintenance Hours" : "Regression/Automation Hours";

      return {
        steps: [
          { label: primaryLabel, formula: "Total Hours × Allocation%", value: num(primaryHours) },
          { label: secondaryLabel, formula: "Total Hours − Primary Hours", value: num(secondaryHours) },
        ],
        summary: [
          { label: primaryLabel, value: `${num(primaryHours)} h`, highlight: true },
          { label: secondaryLabel, value: `${num(secondaryHours)} h` },
        ],
      };
    },
  };
}

/* ------------------------------- Story Completion % ------------------------------- */

const storyCompletionCalculator: CalculatorDef = {
  id: "story-completion-calculator",
  slug: "story-completion-calculator",
  name: "Story Completion % Calculator",
  category: "agile",
  description: "Percentage of planned stories completed in a sprint or release.",
  icon: ClipboardCheck,
  keywords: ["story completion", "stories done"],
  formulaExplanation: "Completion % = Stories Completed ÷ Stories Planned × 100.",
  fields: [
    { id: "planned", label: "Stories Planned", kind: "number", allowDecimal: false, allowZero: false },
    { id: "completed", label: "Stories Completed", kind: "number", allowDecimal: false, allowZero: true },
  ],
  compute: (v): CalculatorOutcome => {
    const completed = Math.min(v.completed, v.planned);
    const completionPercent = (completed / v.planned) * 100;
    return {
      steps: [{ label: "Completion %", formula: "Completed ÷ Planned × 100", value: pct(completionPercent) }],
      summary: [
        { label: "Story Completion %", value: pct(completionPercent), highlight: true, tone: completionPercent >= 90 ? "positive" : "default" },
        { label: "Remaining Stories", value: num(v.planned - completed, 0) },
      ],
      progress: [{ label: "Completed", value: completionPercent, color: "var(--status-good)" }],
    };
  },
};

/* ------------------------------- Story Point Estimator ------------------------------- */

const storyPointEstimatorCalculator: CalculatorDef = {
  id: "story-point-estimator",
  slug: "story-point-estimator",
  name: "Story Point Estimator",
  category: "agile",
  description: "Aggregate up to 5 planning-poker style estimates and flag when the team needs to re-discuss.",
  icon: CheckSquare,
  keywords: ["story points", "planning poker", "estimation"],
  formulaExplanation: "Average = sum of estimates ÷ count. Needs Discussion if (Max − Min) exceeds half the Average.",
  fields: [
    { id: "e1", label: "Estimate 1", kind: "number", allowDecimal: true, allowZero: false },
    { id: "e2", label: "Estimate 2", kind: "number", allowDecimal: true, allowZero: false, optional: true, defaultValue: "" },
    { id: "e3", label: "Estimate 3 (optional)", kind: "number", allowDecimal: true, allowZero: false, optional: true, defaultValue: "" },
    { id: "e4", label: "Estimate 4 (optional)", kind: "number", allowDecimal: true, allowZero: false, optional: true, defaultValue: "" },
    { id: "e5", label: "Estimate 5 (optional)", kind: "number", allowDecimal: true, allowZero: false, optional: true, defaultValue: "" },
  ],
  compute: (v, raw): CalculatorOutcome => {
    const estimates = [v.e1, v.e2, v.e3, v.e4, v.e5].filter((_, i) => {
      const key = `e${i + 1}`;
      return raw[key] !== undefined && raw[key].trim() !== "";
    });
    const sum = estimates.reduce((a, b) => a + b, 0);
    const average = sum / estimates.length;
    const min = Math.min(...estimates);
    const max = Math.max(...estimates);
    const spread = max - min;
    const needsDiscussion = estimates.length > 1 && spread > average * 0.5;

    return {
      steps: [
        { label: "Average", formula: "Sum ÷ Count", value: num(average) },
        { label: "Spread", formula: "Max − Min", value: num(spread) },
      ],
      summary: [
        { label: "Average Estimate", value: num(average), highlight: true },
        { label: "Range", value: `${num(min)} – ${num(max)}` },
        {
          label: "Consensus",
          value: needsDiscussion ? "Needs discussion" : "Good consensus",
          tone: needsDiscussion ? "negative" : "positive",
        },
      ],
    };
  },
};

export const agileCalculators: CalculatorDef[] = [
  sprintVelocityCalculator,
  sprintCapacityCalculator,
  sprintProgressCalculator,
  burndownCalculator,
  burnupCalculator,
  teamCapacityCalculator,
  buildAllocationCalculator("developer"),
  buildAllocationCalculator("qa"),
  storyCompletionCalculator,
  storyPointEstimatorCalculator,
];
