import {
  CheckCircle2,
  ListChecks,
  Bug,
  Gauge,
  ShieldAlert,
} from "lucide-react";
import type { CalculatorDef, CalculatorOutcome, FormulaStep, SummaryItem } from "../types";
import { formatNumber, formatPercent, round2 } from "../format";

function pct(v: number) {
  return formatPercent(round2(Number.isFinite(v) ? v : 0));
}
function num(v: number) {
  return formatNumber(round2(v));
}

/* ---------------------------- Pass Percentage ------------------------------ */

const passPercentageCalculator: CalculatorDef = {
  id: "pass-percentage-calculator",
  slug: "pass-percentage-calculator",
  name: "Pass Percentage Calculator",
  category: "testing",
  description: "Quick pass/fail ratio for a test run.",
  icon: CheckCircle2,
  keywords: ["pass", "fail", "test result", "qa"],
  formulaExplanation: "Pass % = (Passed ÷ Total) × 100. Fail % = 100 − Pass %.",
  fields: [
    { id: "total", label: "Total Test Cases", kind: "number", allowDecimal: false, allowZero: false },
    { id: "passed", label: "Passed", kind: "number", allowDecimal: false, allowZero: true },
  ],
  compute: (v): CalculatorOutcome => {
    const notes: string[] = [];
    const passed = Math.min(v.passed, v.total);
    if (v.passed > v.total) notes.push("Passed count exceeded Total — clamped to Total.");
    const passPercent = (passed / v.total) * 100;
    const failPercent = 100 - passPercent;

    return {
      steps: [
        { label: "Pass %", formula: "(Passed ÷ Total) × 100", value: pct(passPercent) },
        { label: "Fail %", formula: "100 − Pass %", value: pct(failPercent) },
      ],
      summary: [
        { label: "Pass %", value: pct(passPercent), highlight: true, tone: "positive" },
        { label: "Fail %", value: pct(failPercent), tone: failPercent > 0 ? "negative" : "default" },
      ],
      progress: [
        { label: "Passed", value: passPercent, color: "var(--status-good)" },
      ],
      chart: {
        type: "pie",
        data: [
          { name: "Passed", value: passed, color: "var(--status-good)" },
          { name: "Failed", value: Math.max(v.total - passed, 0), color: "var(--status-critical)" },
        ],
      },
      notes,
    };
  },
};

/* --------------------------- Test Execution -------------------------------- */

const testExecutionCalculator: CalculatorDef = {
  id: "test-execution-calculator",
  slug: "test-execution-progress",
  name: "Test Execution Progress",
  category: "testing",
  description: "Track execution, pass, fail and pending percentages for a test cycle.",
  icon: ListChecks,
  keywords: ["execution", "progress", "test cycle", "blocked", "not run"],
  formulaExplanation:
    "Execution % = (Passed + Failed + Blocked) ÷ Total × 100. Pass/Fail/Pending % are each divided by Total.",
  fields: [
    { id: "total", label: "Total Test Cases", kind: "number", allowDecimal: false, allowZero: false },
    { id: "passed", label: "Passed", kind: "number", allowDecimal: false, allowZero: true },
    { id: "failed", label: "Failed", kind: "number", allowDecimal: false, allowZero: true },
    { id: "blocked", label: "Blocked", kind: "number", allowDecimal: false, allowZero: true, optional: true, defaultValue: "0" },
    { id: "notRun", label: "Not Run", kind: "number", allowDecimal: false, allowZero: true, optional: true, defaultValue: "0" },
  ],
  compute: (v): CalculatorOutcome => {
    const notes: string[] = [];
    const accounted = v.passed + v.failed + v.blocked + v.notRun;
    if (accounted !== v.total) {
      notes.push(
        `Passed + Failed + Blocked + Not Run (${num(accounted)}) doesn't equal Total (${num(v.total)}).`
      );
    }
    const executed = v.passed + v.failed + v.blocked;
    const executionPercent = (executed / v.total) * 100;
    const passPercent = (v.passed / v.total) * 100;
    const failPercent = (v.failed / v.total) * 100;
    const blockedPercent = (v.blocked / v.total) * 100;
    const pendingPercent = (v.notRun / v.total) * 100;

    return {
      steps: [
        { label: "Execution %", formula: "(Passed + Failed + Blocked) ÷ Total × 100", value: pct(executionPercent) },
        { label: "Pass %", formula: "Passed ÷ Total × 100", value: pct(passPercent) },
        { label: "Fail %", formula: "Failed ÷ Total × 100", value: pct(failPercent) },
        { label: "Pending %", formula: "Not Run ÷ Total × 100", value: pct(pendingPercent) },
      ],
      summary: [
        { label: "Execution %", value: pct(executionPercent), highlight: true },
        { label: "Pass %", value: pct(passPercent), tone: "positive" },
        { label: "Fail %", value: pct(failPercent), tone: failPercent > 0 ? "negative" : "default" },
        { label: "Pending %", value: pct(pendingPercent) },
      ],
      progress: [
        { label: "Passed", value: passPercent, color: "var(--status-good)" },
        { label: "Failed", value: failPercent, color: "var(--status-critical)" },
        { label: "Blocked", value: blockedPercent, color: "var(--status-warning)" },
        { label: "Not Run", value: pendingPercent, color: "var(--muted-foreground)" },
      ],
      chart: {
        type: "pie",
        data: [
          { name: "Passed", value: v.passed, color: "var(--status-good)" },
          { name: "Failed", value: v.failed, color: "var(--status-critical)" },
          { name: "Blocked", value: v.blocked, color: "var(--status-warning)" },
          { name: "Not Run", value: v.notRun, color: "var(--muted-foreground)" },
        ],
      },
      notes,
    };
  },
};

/* ------------------------------ Bug Metrics --------------------------------- */

const bugMetricsCalculator: CalculatorDef = {
  id: "bug-metrics-calculator",
  slug: "bug-metrics-calculator",
  name: "Bug Metrics Calculator",
  category: "testing",
  description: "Severity distribution and bug density across Critical, High, Medium and Low bugs.",
  icon: Bug,
  keywords: ["bug", "defect", "severity", "density", "critical", "high", "medium", "low"],
  formulaExplanation:
    "Severity % = (Severity Count ÷ Total Bugs) × 100. Bug Density = Total Bugs ÷ (KLOC or Test Cases ÷ 1000).",
  fields: [
    { id: "critical", label: "Critical", kind: "number", allowDecimal: false, allowZero: true },
    { id: "high", label: "High", kind: "number", allowDecimal: false, allowZero: true },
    { id: "medium", label: "Medium", kind: "number", allowDecimal: false, allowZero: true },
    { id: "low", label: "Low", kind: "number", allowDecimal: false, allowZero: true },
    {
      id: "kloc",
      label: "KLOC (thousands of lines, optional)",
      kind: "number",
      allowDecimal: true,
      allowZero: true,
      optional: true,
      defaultValue: "0",
      helpText: "Leave 0 to skip bug density",
    },
  ],
  compute: (v): CalculatorOutcome => {
    const total = v.critical + v.high + v.medium + v.low;
    const safeTotal = total || 1;
    const criticalPct = (v.critical / safeTotal) * 100;
    const highPct = (v.high / safeTotal) * 100;
    const mediumPct = (v.medium / safeTotal) * 100;
    const lowPct = (v.low / safeTotal) * 100;
    const density = v.kloc > 0 ? total / v.kloc : null;

    const steps: FormulaStep[] = [
      { label: "Total Bugs", formula: "Critical + High + Medium + Low", value: num(total) },
      { label: "Critical %", formula: "Critical ÷ Total × 100", value: pct(criticalPct) },
      { label: "High %", formula: "High ÷ Total × 100", value: pct(highPct) },
      { label: "Medium %", formula: "Medium ÷ Total × 100", value: pct(mediumPct) },
      { label: "Low %", formula: "Low ÷ Total × 100", value: pct(lowPct) },
    ];
    if (density !== null) {
      steps.push({ label: "Bug Density", formula: "Total Bugs ÷ KLOC", value: `${num(density)} / KLOC` });
    }

    const summary: SummaryItem[] = [
      { label: "Total Bugs", value: num(total), highlight: true },
      { label: "Critical", value: `${num(v.critical)} (${pct(criticalPct)})`, tone: "negative" },
      { label: "High", value: `${num(v.high)} (${pct(highPct)})` },
      { label: "Medium", value: `${num(v.medium)} (${pct(mediumPct)})` },
      { label: "Low", value: `${num(v.low)} (${pct(lowPct)})` },
    ];
    if (density !== null) summary.push({ label: "Bug Density", value: `${num(density)} / KLOC` });

    return {
      steps,
      summary,
      chart: {
        type: "pie",
        data: [
          { name: "Critical", value: v.critical, color: "var(--status-critical)" },
          { name: "High", value: v.high, color: "var(--status-serious)" },
          { name: "Medium", value: v.medium, color: "var(--status-warning)" },
          { name: "Low", value: v.low, color: "var(--status-good)" },
        ],
      },
    };
  },
};

/* ---------------------------- Test Coverage --------------------------------- */

const testCoverageCalculator: CalculatorDef = {
  id: "test-coverage-calculator",
  slug: "test-coverage-calculator",
  name: "Test Coverage Calculator",
  category: "testing",
  description: "Coverage % for requirements, modules, features or automated scripts.",
  icon: Gauge,
  keywords: ["coverage", "requirement coverage", "automation coverage"],
  formulaExplanation: "Coverage % = (Covered ÷ Total) × 100. Not Covered = Total − Covered.",
  fields: [
    { id: "total", label: "Total Items", kind: "number", allowDecimal: false, allowZero: false, helpText: "Requirements, modules, or test cases" },
    { id: "covered", label: "Covered Items", kind: "number", allowDecimal: false, allowZero: true },
  ],
  compute: (v): CalculatorOutcome => {
    const covered = Math.min(v.covered, v.total);
    const notes: string[] = [];
    if (v.covered > v.total) notes.push("Covered exceeded Total — clamped to Total.");
    const coveragePercent = (covered / v.total) * 100;
    const notCovered = v.total - covered;
    const notCoveredPercent = 100 - coveragePercent;

    return {
      steps: [
        { label: "Coverage %", formula: "(Covered ÷ Total) × 100", value: pct(coveragePercent) },
        { label: "Not Covered", formula: "Total − Covered", value: num(notCovered) },
      ],
      summary: [
        { label: "Coverage %", value: pct(coveragePercent), highlight: true, tone: "positive" },
        { label: "Not Covered", value: num(notCovered) },
        { label: "Not Covered %", value: pct(notCoveredPercent) },
      ],
      progress: [{ label: "Coverage", value: coveragePercent, color: "var(--status-good)" }],
      notes,
    };
  },
};

/* --------------------------- Defect Leakage --------------------------------- */

const defectLeakageCalculator: CalculatorDef = {
  id: "defect-leakage-calculator",
  slug: "defect-leakage-calculator",
  name: "Defect Leakage Calculator",
  category: "testing",
  description: "Percentage of defects that escaped testing and were found in production.",
  icon: ShieldAlert,
  keywords: ["defect leakage", "escaped defects", "production bugs"],
  formulaExplanation:
    "Defect Leakage % = Production Defects ÷ (Production Defects + Test-phase Defects) × 100.",
  fields: [
    { id: "testDefects", label: "Defects Found in Testing", kind: "number", allowDecimal: false, allowZero: true },
    { id: "prodDefects", label: "Defects Found in Production", kind: "number", allowDecimal: false, allowZero: true },
  ],
  compute: (v): CalculatorOutcome => {
    const totalDefects = v.testDefects + v.prodDefects;
    const leakagePercent = totalDefects > 0 ? (v.prodDefects / totalDefects) * 100 : 0;

    return {
      steps: [
        { label: "Total Defects", formula: "Test Defects + Production Defects", value: num(totalDefects) },
        {
          label: "Defect Leakage %",
          formula: "Production Defects ÷ Total Defects × 100",
          value: pct(leakagePercent),
        },
      ],
      summary: [
        { label: "Defect Leakage %", value: pct(leakagePercent), highlight: true, tone: leakagePercent > 10 ? "negative" : "positive" },
        { label: "Total Defects", value: num(totalDefects) },
      ],
      chart: {
        type: "pie",
        data: [
          { name: "Found in Testing", value: v.testDefects, color: "var(--status-good)" },
          { name: "Found in Production", value: v.prodDefects, color: "var(--status-critical)" },
        ],
      },
    };
  },
};

export const testingCalculators: CalculatorDef[] = [
  passPercentageCalculator,
  testExecutionCalculator,
  bugMetricsCalculator,
  testCoverageCalculator,
  defectLeakageCalculator,
];
