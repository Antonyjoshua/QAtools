import { PieChart as PieChartIcon, TrendingUp, AlertCircle, Flag, LineChart, FileText } from "lucide-react";
import type { CalculatorDef, CalculatorOutcome } from "../types";
import { formatNumber, formatPercent, round2 } from "../format";

function pct(v: number) {
  return formatPercent(round2(Number.isFinite(v) ? v : 0));
}
function num(v: number, decimals = 2) {
  return formatNumber(round2(Number.isFinite(v) ? v : 0), decimals);
}

/* ----------------------------------- Pass/Fail Chart ----------------------------------- */

const passFailChartCalculator: CalculatorDef = {
  id: "pass-fail-chart",
  slug: "pass-fail-chart",
  name: "Pass/Fail Chart",
  category: "reporting",
  description: "Quick pie chart of passed vs failed tests, ready to paste into a report.",
  icon: PieChartIcon,
  keywords: ["pass fail chart", "test results chart"],
  formulaExplanation: "Pass % = Passed ÷ (Passed + Failed) × 100.",
  fields: [
    { id: "passed", label: "Passed", kind: "number", allowDecimal: false, allowZero: true },
    { id: "failed", label: "Failed", kind: "number", allowDecimal: false, allowZero: true },
  ],
  compute: (v): CalculatorOutcome => {
    const total = v.passed + v.failed || 1;
    const passPercent = (v.passed / total) * 100;

    return {
      steps: [{ label: "Pass %", formula: "Passed ÷ (Passed + Failed) × 100", value: pct(passPercent) }],
      summary: [
        { label: "Pass %", value: pct(passPercent), highlight: true, tone: "positive" },
        { label: "Fail %", value: pct(100 - passPercent), tone: v.failed > 0 ? "negative" : "default" },
      ],
      chart: {
        type: "pie",
        data: [
          { name: "Passed", value: v.passed, color: "var(--status-good)" },
          { name: "Failed", value: v.failed, color: "var(--status-critical)" },
        ],
      },
    };
  },
};

/* ------------------------------------ Bug Trend Chart ------------------------------------ */

function buildSequenceCalculator(config: {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: typeof TrendingUp;
  unitLabel: string;
  valueLabel: string;
}): CalculatorDef {
  return {
    id: config.id,
    slug: config.slug,
    name: config.name,
    category: "reporting",
    description: config.description,
    icon: config.icon,
    keywords: [config.name.toLowerCase()],
    formulaExplanation: `Trend = last value − first value across up to 5 sequential ${config.unitLabel}.`,
    fields: [1, 2, 3, 4, 5].map((n) => ({
      id: `c${n}`,
      label: `${config.unitLabel} ${n}${n <= 2 ? "" : " (optional)"}`,
      kind: "number" as const,
      allowDecimal: true,
      allowZero: true,
      optional: n > 2,
      defaultValue: n > 2 ? "" : undefined,
    })),
    compute: (v, raw): CalculatorOutcome => {
      const values = [v.c1, v.c2, v.c3, v.c4, v.c5].filter((_, i) => {
        const key = `c${i + 1}`;
        return raw[key] !== undefined && raw[key].trim() !== "";
      });
      const average = values.reduce((a, b) => a + b, 0) / values.length;
      const trend = values[values.length - 1] - values[0];
      const direction = trend > 0 ? "Increasing" : trend < 0 ? "Decreasing" : "Stable";

      return {
        steps: [
          { label: "Average", formula: "mean(values)", value: num(average) },
          { label: "Trend", formula: "last − first", value: num(trend) },
        ],
        summary: [
          { label: "Trend", value: direction, highlight: true, tone: trend > 0 ? "negative" : trend < 0 ? "positive" : "default" },
          { label: "Average", value: num(average) },
        ],
        chart: {
          type: "bar",
          yLabel: config.valueLabel,
          data: values.map((val, i) => ({ name: `${config.unitLabel} ${i + 1}`, value: val, color: "var(--chart-1)" })),
        },
      };
    },
  };
}

const bugTrendCalculator = buildSequenceCalculator({
  id: "bug-trend-chart",
  slug: "bug-trend-chart",
  name: "Bug Trend Chart",
  description: "Chart bugs logged across up to 5 sequential cycles to spot an upward or downward trend.",
  icon: TrendingUp,
  unitLabel: "Cycle",
  valueLabel: "Bugs Logged",
});

const executionTrendCalculator = buildSequenceCalculator({
  id: "execution-trend",
  slug: "execution-trend",
  name: "Execution Trend",
  description: "Chart pass % across up to 5 sequential test cycles to see if quality is trending up or down.",
  icon: LineChart,
  unitLabel: "Cycle",
  valueLabel: "Pass %",
});

/* --------------------------- Severity / Priority Pie Charts --------------------------- */

function buildDistributionChart(kind: "severity" | "priority"): CalculatorDef {
  const isSeverity = kind === "severity";
  const labels = isSeverity ? ["Critical", "High", "Medium", "Low"] : ["P1", "P2", "P3", "P4"];
  const colors = ["var(--status-critical)", "var(--status-serious)", "var(--status-warning)", "var(--status-good)"];

  return {
    id: `${kind}-pie-chart`,
    slug: `${kind}-pie-chart`,
    name: `${isSeverity ? "Severity" : "Priority"} Pie Chart`,
    category: "reporting",
    description: `Quick pie chart of bug counts by ${kind}, ready to paste into a report.`,
    icon: isSeverity ? AlertCircle : Flag,
    keywords: [`${kind} pie chart`, "bug chart"],
    formulaExplanation: `${isSeverity ? "Severity" : "Priority"} % = (Count ÷ Total) × 100.`,
    fields: labels.map((label) => ({
      id: label.toLowerCase(),
      label,
      kind: "number" as const,
      allowDecimal: false,
      allowZero: true,
    })),
    compute: (v): CalculatorOutcome => {
      const values = labels.map((label) => v[label.toLowerCase()] ?? 0);
      const total = values.reduce((a, b) => a + b, 0) || 1;

      return {
        steps: labels.map((label, i) => ({
          label: `${label} %`,
          formula: `${label} ÷ Total × 100`,
          value: pct((values[i] / total) * 100),
        })),
        summary: labels.map((label, i) => ({
          label,
          value: `${num(values[i], 0)} (${pct((values[i] / total) * 100)})`,
          highlight: i === 0,
        })),
        chart: {
          type: "pie",
          data: labels.map((label, i) => ({ name: label, value: values[i], color: colors[i] })),
        },
      };
    },
  };
}

/* ------------------------------- Daily Testing Report Generator ------------------------------- */

const dailyReportCalculator: CalculatorDef = {
  id: "daily-testing-report-generator",
  slug: "daily-testing-report-generator",
  name: "Daily Testing Report Generator",
  category: "reporting",
  description: "Turn today's numbers into a formatted stand-up or Slack update, ready to copy.",
  icon: FileText,
  keywords: ["daily report", "standup report", "test summary"],
  formulaExplanation: "Formats your inputs into a Markdown-style summary — no calculation beyond Pass % = Passed ÷ Tests Run × 100.",
  fields: [
    { id: "date", label: "Date", kind: "date", optional: true },
    { id: "testsRun", label: "Tests Run", kind: "number", allowDecimal: false, allowZero: false },
    { id: "passed", label: "Passed", kind: "number", allowDecimal: false, allowZero: true },
    { id: "failed", label: "Failed", kind: "number", allowDecimal: false, allowZero: true },
    { id: "blocked", label: "Blocked", kind: "number", allowDecimal: false, allowZero: true, optional: true, defaultValue: "0" },
    { id: "bugsLogged", label: "Bugs Logged", kind: "number", allowDecimal: false, allowZero: true, optional: true, defaultValue: "0" },
    { id: "notes", label: "Notes (optional)", kind: "text", optional: true, multiline: true },
  ],
  compute: (v, raw): CalculatorOutcome => {
    const passPercent = (v.passed / v.testsRun) * 100;
    const dateLabel = raw.date ? new Date(raw.date).toLocaleDateString() : new Date().toLocaleDateString();

    const report = [
      `**Daily Testing Report — ${dateLabel}**`,
      ``,
      `- Tests Run: ${v.testsRun}`,
      `- Passed: ${v.passed} (${num(passPercent, 1)}%)`,
      `- Failed: ${v.failed}`,
      `- Blocked: ${v.blocked}`,
      `- Bugs Logged: ${v.bugsLogged}`,
      ...(raw.notes ? ["", `Notes: ${raw.notes}`] : []),
    ].join("\n");

    return {
      steps: [{ label: "Pass %", formula: "Passed ÷ Tests Run × 100", value: pct(passPercent) }],
      summary: [{ label: "Report", value: report, highlight: true }],
    };
  },
};

export const reportingCalculators: CalculatorDef[] = [
  passFailChartCalculator,
  bugTrendCalculator,
  buildDistributionChart("severity"),
  buildDistributionChart("priority"),
  executionTrendCalculator,
  dailyReportCalculator,
];
