import {
  Bot,
  RefreshCw,
  Gauge,
  ShieldCheck,
  RotateCcw,
  XCircle,
  PieChart,
  Timer,
  ActivitySquare,
  ListTree,
  FlaskConical,
  Hourglass,
  Rocket,
  CheckCircle,
} from "lucide-react";
import type { CalculatorDef, CalculatorOutcome } from "../types";
import { formatNumber, formatPercent, round2 } from "../format";

function pct(v: number) {
  return formatPercent(round2(Number.isFinite(v) ? v : 0));
}
function num(v: number, decimals = 2) {
  return formatNumber(round2(Number.isFinite(v) ? v : 0), decimals);
}

/* ------------------------------ Automation Coverage ------------------------------ */

const automationCoverageCalculator: CalculatorDef = {
  id: "automation-coverage-calculator",
  slug: "automation-coverage-calculator",
  name: "Automation Coverage Calculator",
  category: "testing",
  description: "Automation vs manual coverage split across your test suite.",
  icon: Bot,
  keywords: ["automation coverage", "manual coverage"],
  formulaExplanation: "Automation Coverage % = (Automated ÷ Total) × 100. Manual Coverage % = 100 − Automation Coverage %.",
  fields: [
    { id: "total", label: "Total Test Cases", kind: "number", allowDecimal: false, allowZero: false },
    { id: "automated", label: "Automated Test Cases", kind: "number", allowDecimal: false, allowZero: true },
  ],
  compute: (v): CalculatorOutcome => {
    const automated = Math.min(v.automated, v.total);
    const notes: string[] = [];
    if (v.automated > v.total) notes.push("Automated count exceeded Total — clamped to Total.");
    const automationPct = (automated / v.total) * 100;
    const manualPct = 100 - automationPct;

    return {
      steps: [
        { label: "Automation Coverage %", formula: "(Automated ÷ Total) × 100", value: pct(automationPct) },
        { label: "Manual Coverage %", formula: "100 − Automation Coverage %", value: pct(manualPct) },
      ],
      summary: [
        { label: "Automation Coverage %", value: pct(automationPct), highlight: true, tone: "positive" },
        { label: "Manual Coverage %", value: pct(manualPct) },
      ],
      progress: [{ label: "Automated", value: automationPct, color: "var(--status-good)" }],
      notes,
    };
  },
};

/* ------------------------------ Regression Completion ------------------------------ */

const regressionCompletionCalculator: CalculatorDef = {
  id: "regression-completion-calculator",
  slug: "regression-completion-calculator",
  name: "Regression Completion Calculator",
  category: "testing",
  description: "Track how much of the regression suite has been executed.",
  icon: RefreshCw,
  keywords: ["regression completion", "regression suite"],
  formulaExplanation: "Completion % = (Executed ÷ Total Regression Cases) × 100.",
  fields: [
    { id: "total", label: "Total Regression Cases", kind: "number", allowDecimal: false, allowZero: false },
    { id: "executed", label: "Executed", kind: "number", allowDecimal: false, allowZero: true },
  ],
  compute: (v): CalculatorOutcome => {
    const executed = Math.min(v.executed, v.total);
    const completion = (executed / v.total) * 100;
    const remaining = v.total - executed;

    return {
      steps: [
        { label: "Completion %", formula: "(Executed ÷ Total) × 100", value: pct(completion) },
        { label: "Remaining", formula: "Total − Executed", value: num(remaining, 0) },
      ],
      summary: [
        { label: "Regression Completion %", value: pct(completion), highlight: true },
        { label: "Remaining Cases", value: num(remaining, 0) },
      ],
      progress: [{ label: "Executed", value: completion, color: "var(--status-good)" }],
    };
  },
};

/* -------------------------------- Release Readiness -------------------------------- */

const releaseReadinessCalculator: CalculatorDef = {
  id: "release-readiness-calculator",
  slug: "release-readiness-score",
  name: "Release Readiness Score",
  category: "testing",
  description: "A weighted score combining pass rate, automation coverage and open blocker/critical bugs.",
  icon: ShieldCheck,
  keywords: ["release readiness", "go no-go", "ship readiness"],
  formulaExplanation:
    "Score = Pass%×0.4 + Automation%×0.2 + BugPenalty(Critical)×0.2 + BugPenalty(Blocker)×0.2, where each open bug reduces its penalty term. 80+ is Ready, 60–79 At Risk, below 60 Not Ready.",
  fields: [
    { id: "passPercent", label: "Test Pass %", kind: "number", suffix: "%", allowDecimal: true, allowZero: true, max: 100 },
    { id: "automationPercent", label: "Automation Coverage %", kind: "number", suffix: "%", allowDecimal: true, allowZero: true, max: 100 },
    { id: "criticalBugs", label: "Open Critical Bugs", kind: "number", allowDecimal: false, allowZero: true },
    { id: "blockerBugs", label: "Open Blocker Bugs", kind: "number", allowDecimal: false, allowZero: true },
  ],
  compute: (v): CalculatorOutcome => {
    const criticalPenalty = Math.max(0, 100 - v.criticalBugs * 10);
    const blockerPenalty = Math.max(0, 100 - v.blockerBugs * 20);
    const score =
      v.passPercent * 0.4 + v.automationPercent * 0.2 + criticalPenalty * 0.2 + blockerPenalty * 0.2;
    const label = score >= 80 ? "Ready" : score >= 60 ? "At Risk" : "Not Ready";

    return {
      steps: [
        { label: "Pass % contribution", formula: "Pass% × 0.4", value: num(v.passPercent * 0.4) },
        { label: "Automation contribution", formula: "Automation% × 0.2", value: num(v.automationPercent * 0.2) },
        { label: "Critical bug penalty", formula: "max(0, 100 − Critical×10) × 0.2", value: num(criticalPenalty * 0.2) },
        { label: "Blocker bug penalty", formula: "max(0, 100 − Blocker×20) × 0.2", value: num(blockerPenalty * 0.2) },
      ],
      summary: [
        { label: "Release Readiness Score", value: num(score, 1), highlight: true, tone: score >= 80 ? "positive" : score >= 60 ? "default" : "negative" },
        { label: "Verdict", value: label, tone: score >= 80 ? "positive" : score >= 60 ? "default" : "negative" },
      ],
      progress: [{ label: "Readiness", value: Math.min(score, 100), color: score >= 80 ? "var(--status-good)" : score >= 60 ? "var(--status-warning)" : "var(--status-critical)" }],
      notes: ["This is a simple weighted heuristic — tune the weights to match your team's release criteria."],
    };
  },
};

/* ------------------------------ Defect Detection % (DDP/DRE) ------------------------------ */

const ddpCalculator: CalculatorDef = {
  id: "defect-detection-percentage",
  slug: "defect-detection-percentage",
  name: "Defect Detection Percentage (DDP)",
  category: "testing",
  description: "Also known as Defect Removal Efficiency — the share of defects caught before release.",
  icon: Gauge,
  keywords: ["ddp", "dre", "defect removal efficiency", "defect detection percentage"],
  formulaExplanation: "DDP % = Defects Found in Testing ÷ (Defects Found in Testing + Defects Found in Production) × 100.",
  fields: [
    { id: "testDefects", label: "Defects Found in Testing", kind: "number", allowDecimal: false, allowZero: true },
    { id: "prodDefects", label: "Defects Found in Production", kind: "number", allowDecimal: false, allowZero: true },
  ],
  compute: (v): CalculatorOutcome => {
    const totalDefects = v.testDefects + v.prodDefects;
    const ddp = totalDefects > 0 ? (v.testDefects / totalDefects) * 100 : 0;

    return {
      steps: [
        { label: "Total Defects", formula: "Testing + Production", value: num(totalDefects, 0) },
        { label: "DDP %", formula: "Testing ÷ Total × 100", value: pct(ddp) },
      ],
      summary: [{ label: "DDP % (DRE)", value: pct(ddp), highlight: true, tone: ddp >= 90 ? "positive" : ddp >= 70 ? "default" : "negative" }],
    };
  },
};

/* ---------------------------------- Reopen Rate ---------------------------------- */

const reopenRateCalculator: CalculatorDef = {
  id: "reopen-rate-calculator",
  slug: "reopen-rate-calculator",
  name: "Reopen Rate Calculator",
  category: "testing",
  description: "Share of closed bugs that had to be reopened.",
  icon: RotateCcw,
  keywords: ["reopen rate", "bug reopened"],
  formulaExplanation: "Reopen Rate % = Bugs Reopened ÷ Total Bugs Closed × 100.",
  fields: [
    { id: "closed", label: "Total Bugs Closed", kind: "number", allowDecimal: false, allowZero: false },
    { id: "reopened", label: "Bugs Reopened", kind: "number", allowDecimal: false, allowZero: true },
  ],
  compute: (v): CalculatorOutcome => {
    const rate = (Math.min(v.reopened, v.closed) / v.closed) * 100;
    return {
      steps: [{ label: "Reopen Rate %", formula: "Reopened ÷ Closed × 100", value: pct(rate) }],
      summary: [{ label: "Reopen Rate %", value: pct(rate), highlight: true, tone: rate > 15 ? "negative" : "positive" }],
    };
  },
};

/* --------------------------------- Rejection Rate --------------------------------- */

const rejectionRateCalculator: CalculatorDef = {
  id: "rejection-rate-calculator",
  slug: "rejection-rate-calculator",
  name: "Rejection Rate Calculator",
  category: "testing",
  description: "Share of logged bugs rejected as invalid or duplicate.",
  icon: XCircle,
  keywords: ["rejection rate", "invalid bugs", "duplicate bugs"],
  formulaExplanation: "Rejection Rate % = Bugs Rejected ÷ Total Bugs Logged × 100.",
  fields: [
    { id: "logged", label: "Total Bugs Logged", kind: "number", allowDecimal: false, allowZero: false },
    { id: "rejected", label: "Bugs Rejected", kind: "number", allowDecimal: false, allowZero: true },
  ],
  compute: (v): CalculatorOutcome => {
    const rate = (Math.min(v.rejected, v.logged) / v.logged) * 100;
    return {
      steps: [{ label: "Rejection Rate %", formula: "Rejected ÷ Logged × 100", value: pct(rate) }],
      summary: [{ label: "Rejection Rate %", value: pct(rate), highlight: true, tone: rate > 20 ? "negative" : "positive" }],
      notes: rate > 20 ? ["A high rejection rate often points to unclear bug-reporting guidelines."] : [],
    };
  },
};

/* ---------------------------- Bug Priority Distribution ---------------------------- */

const bugPriorityCalculator: CalculatorDef = {
  id: "bug-priority-distribution",
  slug: "bug-priority-distribution",
  name: "Bug Priority Distribution",
  category: "testing",
  description: "Breakdown of open bugs by priority (P1–P4).",
  icon: PieChart,
  keywords: ["priority distribution", "p1", "p2", "p3", "p4"],
  formulaExplanation: "Priority % = (Priority Count ÷ Total Bugs) × 100.",
  fields: [
    { id: "p1", label: "P1 (Urgent)", kind: "number", allowDecimal: false, allowZero: true },
    { id: "p2", label: "P2 (High)", kind: "number", allowDecimal: false, allowZero: true },
    { id: "p3", label: "P3 (Medium)", kind: "number", allowDecimal: false, allowZero: true },
    { id: "p4", label: "P4 (Low)", kind: "number", allowDecimal: false, allowZero: true },
  ],
  compute: (v): CalculatorOutcome => {
    const total = v.p1 + v.p2 + v.p3 + v.p4;
    const safeTotal = total || 1;
    const p1Pct = (v.p1 / safeTotal) * 100;
    const p2Pct = (v.p2 / safeTotal) * 100;
    const p3Pct = (v.p3 / safeTotal) * 100;
    const p4Pct = (v.p4 / safeTotal) * 100;

    return {
      steps: [
        { label: "Total Bugs", formula: "P1 + P2 + P3 + P4", value: num(total, 0) },
        { label: "P1 %", formula: "P1 ÷ Total × 100", value: pct(p1Pct) },
        { label: "P2 %", formula: "P2 ÷ Total × 100", value: pct(p2Pct) },
        { label: "P3 %", formula: "P3 ÷ Total × 100", value: pct(p3Pct) },
        { label: "P4 %", formula: "P4 ÷ Total × 100", value: pct(p4Pct) },
      ],
      summary: [
        { label: "Total Bugs", value: num(total, 0), highlight: true },
        { label: "P1", value: `${num(v.p1, 0)} (${pct(p1Pct)})`, tone: "negative" },
        { label: "P2", value: `${num(v.p2, 0)} (${pct(p2Pct)})` },
        { label: "P3", value: `${num(v.p3, 0)} (${pct(p3Pct)})` },
        { label: "P4", value: `${num(v.p4, 0)} (${pct(p4Pct)})` },
      ],
      chart: {
        type: "pie",
        data: [
          { name: "P1", value: v.p1, color: "var(--status-critical)" },
          { name: "P2", value: v.p2, color: "var(--status-serious)" },
          { name: "P3", value: v.p3, color: "var(--status-warning)" },
          { name: "P4", value: v.p4, color: "var(--status-good)" },
        ],
      },
    };
  },
};

/* ------------------------------------ MTTR ------------------------------------ */

const mttrCalculator: CalculatorDef = {
  id: "mttr-calculator",
  slug: "mttr-calculator",
  name: "Mean Time to Resolution (MTTR)",
  category: "testing",
  description: "Average time taken to resolve a bug, from open to closed.",
  icon: Timer,
  keywords: ["mttr", "mean time to resolution", "mean time to repair"],
  formulaExplanation: "MTTR = Total Resolution Time (hours) ÷ Number of Bugs Resolved.",
  fields: [
    { id: "totalHours", label: "Total Resolution Time (hours)", kind: "number", allowDecimal: true, allowZero: false },
    { id: "bugCount", label: "Bugs Resolved", kind: "number", allowDecimal: false, allowZero: false },
  ],
  compute: (v): CalculatorOutcome => {
    const mttr = v.totalHours / v.bugCount;
    return {
      steps: [
        { label: "MTTR (hours)", formula: "Total Hours ÷ Bugs Resolved", value: `${num(mttr)} h` },
        { label: "MTTR (days)", formula: "MTTR ÷ 24", value: `${num(mttr / 24)} d` },
      ],
      summary: [
        { label: "MTTR", value: `${num(mttr)} hours`, highlight: true },
        { label: "MTTR (days)", value: `${num(mttr / 24)} days` },
      ],
    };
  },
};

/* ------------------------------------ MTBF ------------------------------------ */

const mtbfCalculator: CalculatorDef = {
  id: "mtbf-calculator",
  slug: "mtbf-calculator",
  name: "Mean Time Between Failures (MTBF)",
  category: "testing",
  description: "Average operating time between failures for a system under test.",
  icon: ActivitySquare,
  keywords: ["mtbf", "mean time between failures", "reliability"],
  formulaExplanation: "MTBF = Total Operational Time (hours) ÷ Number of Failures.",
  fields: [
    { id: "totalHours", label: "Total Operational Time (hours)", kind: "number", allowDecimal: true, allowZero: false },
    { id: "failureCount", label: "Number of Failures", kind: "number", allowDecimal: false, allowZero: false },
  ],
  compute: (v): CalculatorOutcome => {
    const mtbf = v.totalHours / v.failureCount;
    return {
      steps: [{ label: "MTBF (hours)", formula: "Total Hours ÷ Failures", value: `${num(mtbf)} h` }],
      summary: [
        { label: "MTBF", value: `${num(mtbf)} hours`, highlight: true },
        { label: "MTBF (days)", value: `${num(mtbf / 24)} days` },
      ],
    };
  },
};

/* ============================ Test Case Estimation ============================ */

const testCaseCountCalculator: CalculatorDef = {
  id: "test-case-count-estimator",
  slug: "test-case-count-estimator",
  name: "Test Case Count Estimator",
  category: "testing",
  description: "Estimate total test cases from requirement count and average cases per requirement.",
  icon: ListTree,
  keywords: ["test case estimation", "requirements"],
  formulaExplanation: "Estimated Test Cases = Requirements × Avg Test Cases per Requirement.",
  fields: [
    { id: "requirements", label: "Number of Requirements / Stories", kind: "number", allowDecimal: false, allowZero: false },
    { id: "avgPerRequirement", label: "Avg Test Cases per Requirement", kind: "number", allowDecimal: true, allowZero: false, defaultValue: "5" },
  ],
  compute: (v): CalculatorOutcome => {
    const estimate = v.requirements * v.avgPerRequirement;
    return {
      steps: [{ label: "Estimated Test Cases", formula: "Requirements × Avg per Requirement", value: num(estimate, 0) }],
      summary: [{ label: "Estimated Test Cases", value: num(Math.ceil(estimate), 0), highlight: true }],
    };
  },
};

const regressionEstimatorCalculator: CalculatorDef = {
  id: "regression-estimator",
  slug: "regression-estimator",
  name: "Regression Estimator",
  category: "testing",
  description: "Estimate regression suite size and execution time from a percentage of the full suite.",
  icon: RefreshCw,
  keywords: ["regression estimator", "regression suite size"],
  formulaExplanation: "Regression Suite Size = Total Test Cases × Regression% / 100. Estimated Time = Suite Size × Avg Time per Case.",
  fields: [
    { id: "total", label: "Total Test Cases", kind: "number", allowDecimal: false, allowZero: false },
    { id: "regressionPercent", label: "Regression %", kind: "number", suffix: "%", allowDecimal: true, allowZero: false, defaultValue: "30", max: 100 },
    { id: "avgMinutes", label: "Avg Time per Case (minutes, optional)", kind: "number", allowDecimal: true, allowZero: true, optional: true, defaultValue: "0" },
  ],
  compute: (v): CalculatorOutcome => {
    const suiteSize = Math.ceil(v.total * (v.regressionPercent / 100));
    const estimatedMinutes = suiteSize * v.avgMinutes;

    const steps: { label: string; formula: string; value: string }[] = [
      { label: "Regression Suite Size", formula: "Total × Regression% / 100", value: num(suiteSize, 0) },
    ];
    const summary: { label: string; value: string; highlight?: boolean }[] = [
      { label: "Regression Suite Size", value: num(suiteSize, 0), highlight: true },
    ];
    if (v.avgMinutes > 0) {
      steps.push({ label: "Estimated Time", formula: "Suite Size × Avg Time per Case", value: `${num(estimatedMinutes)} min` });
      summary.push({ label: "Estimated Time", value: `${num(estimatedMinutes / 60)} hours` });
    }

    return { steps, summary };
  },
};

const automationEffortCalculator: CalculatorDef = {
  id: "automation-effort-calculator",
  slug: "automation-effort-calculator",
  name: "Automation Effort Calculator",
  category: "testing",
  description: "Estimate the effort required to automate a batch of test cases.",
  icon: Bot,
  keywords: ["automation effort", "automation hours"],
  formulaExplanation: "Total Effort (hours) = Test Cases × Avg Hours per Test Case. Person-Days = Total Hours ÷ 8.",
  fields: [
    { id: "caseCount", label: "Test Cases to Automate", kind: "number", allowDecimal: false, allowZero: false },
    { id: "hoursPerCase", label: "Avg Hours per Test Case", kind: "number", allowDecimal: true, allowZero: false, defaultValue: "2" },
  ],
  compute: (v): CalculatorOutcome => {
    const totalHours = v.caseCount * v.hoursPerCase;
    return {
      steps: [
        { label: "Total Effort (hours)", formula: "Test Cases × Hours per Case", value: num(totalHours) },
        { label: "Person-Days", formula: "Total Hours ÷ 8", value: num(totalHours / 8) },
      ],
      summary: [
        { label: "Total Effort", value: `${num(totalHours)} hours`, highlight: true },
        { label: "Person-Days", value: num(totalHours / 8) },
      ],
    };
  },
};

const manualTestingHoursCalculator: CalculatorDef = {
  id: "manual-testing-hours-calculator",
  slug: "manual-testing-hours-calculator",
  name: "Manual Testing Hours Calculator",
  category: "testing",
  description: "Estimate total hours needed to manually execute a set of test cases.",
  icon: Hourglass,
  keywords: ["manual testing hours", "execution time"],
  formulaExplanation: "Total Hours = (Test Cases × Avg Minutes per Case) ÷ 60.",
  fields: [
    { id: "caseCount", label: "Manual Test Cases", kind: "number", allowDecimal: false, allowZero: false },
    { id: "minutesPerCase", label: "Avg Execution Time per Case (minutes)", kind: "number", allowDecimal: true, allowZero: false, defaultValue: "10" },
  ],
  compute: (v): CalculatorOutcome => {
    const totalMinutes = v.caseCount * v.minutesPerCase;
    return {
      steps: [{ label: "Total Hours", formula: "(Test Cases × Minutes per Case) ÷ 60", value: num(totalMinutes / 60) }],
      summary: [
        { label: "Total Manual Hours", value: num(totalMinutes / 60), highlight: true },
        { label: "Person-Days", value: num(totalMinutes / 60 / 8) },
      ],
    };
  },
};

function buildSubsetEstimator(kind: "smoke" | "sanity"): CalculatorDef {
  const isSmoke = kind === "smoke";
  return {
    id: `${kind}-test-estimator`,
    slug: `${kind}-test-estimator`,
    name: `${isSmoke ? "Smoke" : "Sanity"} Test Estimator`,
    category: "testing",
    description: `Estimate ${isSmoke ? "smoke" : "sanity"} suite size as a percentage of the full regression suite.`,
    icon: isSmoke ? FlaskConical : CheckCircle,
    keywords: [`${kind} test`, `${kind} suite`],
    formulaExplanation: `${isSmoke ? "Smoke" : "Sanity"} Suite Size = Total Test Cases × ${isSmoke ? "Smoke" : "Sanity"}% / 100.`,
    fields: [
      { id: "total", label: "Total Test Cases", kind: "number", allowDecimal: false, allowZero: false },
      {
        id: "percent",
        label: `${isSmoke ? "Smoke" : "Sanity"} %`,
        kind: "number",
        suffix: "%",
        allowDecimal: true,
        allowZero: false,
        defaultValue: isSmoke ? "10" : "15",
        max: 100,
      },
    ],
    compute: (v): CalculatorOutcome => {
      const size = Math.ceil(v.total * (v.percent / 100));
      return {
        steps: [{ label: "Suite Size", formula: "Total × % / 100", value: num(size, 0) }],
        summary: [{ label: `${isSmoke ? "Smoke" : "Sanity"} Suite Size`, value: num(size, 0), highlight: true }],
      };
    },
  };
}

const uatEffortCalculator: CalculatorDef = {
  id: "uat-effort-calculator",
  slug: "uat-effort-calculator",
  name: "UAT Effort Calculator",
  category: "testing",
  description: "Estimate total and per-participant effort for User Acceptance Testing.",
  icon: Rocket,
  keywords: ["uat", "user acceptance testing", "uat effort"],
  formulaExplanation: "Total Effort (hours) = Scenarios × Avg Hours per Scenario. Per Participant = Total Effort ÷ Participants.",
  fields: [
    { id: "scenarios", label: "UAT Scenarios", kind: "number", allowDecimal: false, allowZero: false },
    { id: "hoursPerScenario", label: "Avg Hours per Scenario", kind: "number", allowDecimal: true, allowZero: false, defaultValue: "1" },
    { id: "participants", label: "UAT Participants (optional)", kind: "number", allowDecimal: false, allowZero: true, optional: true, defaultValue: "0" },
  ],
  compute: (v): CalculatorOutcome => {
    const totalHours = v.scenarios * v.hoursPerScenario;
    const steps: { label: string; formula: string; value: string }[] = [
      { label: "Total Effort (hours)", formula: "Scenarios × Hours per Scenario", value: num(totalHours) },
    ];
    const summary: { label: string; value: string; highlight?: boolean }[] = [
      { label: "Total Effort", value: `${num(totalHours)} hours`, highlight: true },
    ];
    if (v.participants > 0) {
      const perParticipant = totalHours / v.participants;
      steps.push({ label: "Per Participant", formula: "Total Effort ÷ Participants", value: `${num(perParticipant)} h` });
      summary.push({ label: "Per Participant", value: `${num(perParticipant)} hours` });
    }
    return { steps, summary };
  },
};

export const testingExtraCalculators: CalculatorDef[] = [
  automationCoverageCalculator,
  regressionCompletionCalculator,
  releaseReadinessCalculator,
  ddpCalculator,
  reopenRateCalculator,
  rejectionRateCalculator,
  bugPriorityCalculator,
  mttrCalculator,
  mtbfCalculator,
  testCaseCountCalculator,
  regressionEstimatorCalculator,
  automationEffortCalculator,
  manualTestingHoursCalculator,
  buildSubsetEstimator("smoke"),
  buildSubsetEstimator("sanity"),
  uatEffortCalculator,
];
