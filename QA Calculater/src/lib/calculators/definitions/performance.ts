import {
  Users2,
  Repeat,
  Waves,
  Timer,
  ArrowUpRight,
  AlertOctagon,
  CheckCircle2,
} from "lucide-react";
import type { CalculatorDef, CalculatorOutcome } from "../types";
import { formatNumber, formatPercent, round2 } from "../format";

function pct(v: number) {
  return formatPercent(round2(Number.isFinite(v) ? v : 0));
}
function num(v: number, decimals = 2) {
  return formatNumber(round2(Number.isFinite(v) ? v : 0), decimals);
}

/* ------------------------------- Concurrent Users ------------------------------- */

const concurrentUsersCalculator: CalculatorDef = {
  id: "concurrent-users-calculator",
  slug: "concurrent-users-calculator",
  name: "Concurrent Users Calculator",
  category: "performance",
  description: "Estimate concurrent users a system needs to support using Little's Law.",
  icon: Users2,
  keywords: ["concurrent users", "little's law", "load testing"],
  formulaExplanation: "Concurrent Users = Requests per Second × Avg Response Time (seconds). (Little's Law)",
  fields: [
    { id: "rps", label: "Requests per Second", kind: "number", allowDecimal: true, allowZero: false },
    { id: "avgResponseSeconds", label: "Avg Response Time (seconds)", kind: "number", allowDecimal: true, allowZero: false, defaultValue: "1" },
  ],
  compute: (v): CalculatorOutcome => {
    const concurrentUsers = v.rps * v.avgResponseSeconds;
    return {
      steps: [{ label: "Concurrent Users", formula: "RPS × Avg Response Time", value: num(concurrentUsers) }],
      summary: [{ label: "Estimated Concurrent Users", value: num(Math.ceil(concurrentUsers), 0), highlight: true }],
    };
  },
};

/* --------------------------------- RPS / TPS --------------------------------- */

function buildRateCalculator(kind: "rps" | "tps"): CalculatorDef {
  const isRps = kind === "rps";
  return {
    id: `${kind}-calculator`,
    slug: `${kind}-calculator`,
    name: isRps ? "Requests per Second (RPS) Calculator" : "Transactions per Second (TPS) Calculator",
    category: "performance",
    description: `Compute ${isRps ? "request" : "transaction"} throughput from a load test run.`,
    icon: Repeat,
    keywords: [isRps ? "rps" : "tps", "throughput", "load test"],
    formulaExplanation: `${isRps ? "RPS" : "TPS"} = Total ${isRps ? "Requests" : "Transactions"} ÷ Duration (seconds).`,
    fields: [
      { id: "total", label: `Total ${isRps ? "Requests" : "Transactions"}`, kind: "number", allowDecimal: false, allowZero: false },
      { id: "durationSeconds", label: "Duration (seconds)", kind: "number", allowDecimal: true, allowZero: false },
    ],
    compute: (v): CalculatorOutcome => {
      const rate = v.total / v.durationSeconds;
      return {
        steps: [{ label: isRps ? "RPS" : "TPS", formula: `Total ÷ Duration`, value: num(rate) }],
        summary: [{ label: isRps ? "Requests per Second" : "Transactions per Second", value: num(rate), highlight: true }],
      };
    },
  };
}

/* --------------------------------- Throughput --------------------------------- */

const throughputCalculator: CalculatorDef = {
  id: "throughput-calculator",
  slug: "throughput-calculator",
  name: "Throughput Calculator",
  category: "performance",
  description: "Data transfer throughput from total data moved over a duration.",
  icon: Waves,
  keywords: ["throughput", "bandwidth", "mb/s"],
  formulaExplanation: "Throughput (MB/s) = Total Data (MB) ÷ Duration (seconds). Mbps = MB/s × 8.",
  fields: [
    { id: "dataMb", label: "Total Data Transferred (MB)", kind: "number", allowDecimal: true, allowZero: false },
    { id: "durationSeconds", label: "Duration (seconds)", kind: "number", allowDecimal: true, allowZero: false },
  ],
  compute: (v): CalculatorOutcome => {
    const mbps = v.dataMb / v.durationSeconds;
    return {
      steps: [
        { label: "Throughput", formula: "Total Data ÷ Duration", value: `${num(mbps)} MB/s` },
        { label: "Bitrate", formula: "MB/s × 8", value: `${num(mbps * 8)} Mbps` },
      ],
      summary: [
        { label: "Throughput", value: `${num(mbps)} MB/s`, highlight: true },
        { label: "Bitrate", value: `${num(mbps * 8)} Mbps` },
      ],
    };
  },
};

/* --------------------------- Response Time Average --------------------------- */

const responseTimeAverageCalculator: CalculatorDef = {
  id: "response-time-average-calculator",
  slug: "response-time-average-calculator",
  name: "Response Time Average Calculator",
  category: "performance",
  description: "Average response time across all requests in a load test.",
  icon: Timer,
  keywords: ["response time", "average latency"],
  formulaExplanation: "Average Response Time = Total Response Time (ms) ÷ Number of Requests.",
  fields: [
    { id: "totalMs", label: "Total Response Time (ms, summed)", kind: "number", allowDecimal: true, allowZero: false },
    { id: "requestCount", label: "Number of Requests", kind: "number", allowDecimal: false, allowZero: false },
  ],
  compute: (v): CalculatorOutcome => {
    const avg = v.totalMs / v.requestCount;
    return {
      steps: [{ label: "Average Response Time", formula: "Total ÷ Requests", value: `${num(avg)} ms` }],
      summary: [{ label: "Average Response Time", value: `${num(avg)} ms`, highlight: true }],
    };
  },
};

/* ----------------------------- Peak Response Time ----------------------------- */

const peakResponseTimeCalculator: CalculatorDef = {
  id: "peak-response-time-calculator",
  slug: "peak-response-time-calculator",
  name: "Peak Response Time Calculator",
  category: "performance",
  description: "Find the peak (worst-case) response time from a handful of samples.",
  icon: ArrowUpRight,
  keywords: ["peak response time", "worst case latency"],
  formulaExplanation: "Peak = max(samples). Average = mean(samples).",
  fields: [
    { id: "s1", label: "Sample 1 (ms)", kind: "number", allowDecimal: true, allowZero: false },
    { id: "s2", label: "Sample 2 (ms)", kind: "number", allowDecimal: true, allowZero: false },
    { id: "s3", label: "Sample 3 (ms, optional)", kind: "number", allowDecimal: true, allowZero: false, optional: true, defaultValue: "" },
    { id: "s4", label: "Sample 4 (ms, optional)", kind: "number", allowDecimal: true, allowZero: false, optional: true, defaultValue: "" },
    { id: "s5", label: "Sample 5 (ms, optional)", kind: "number", allowDecimal: true, allowZero: false, optional: true, defaultValue: "" },
  ],
  compute: (v, raw): CalculatorOutcome => {
    const samples = [v.s1, v.s2, v.s3, v.s4, v.s5].filter((_, i) => {
      const key = `s${i + 1}`;
      return raw[key] !== undefined && raw[key].trim() !== "";
    });
    const peak = Math.max(...samples);
    const average = samples.reduce((a, b) => a + b, 0) / samples.length;

    return {
      steps: [
        { label: "Peak Response Time", formula: "max(samples)", value: `${num(peak)} ms` },
        { label: "Average", formula: "mean(samples)", value: `${num(average)} ms` },
      ],
      summary: [
        { label: "Peak Response Time", value: `${num(peak)} ms`, highlight: true, tone: "negative" },
        { label: "Average", value: `${num(average)} ms` },
      ],
    };
  },
};

/* ------------------------------- Error / Success Rate ------------------------------- */

function buildRateOfCalculator(kind: "error" | "success"): CalculatorDef {
  const isError = kind === "error";
  return {
    id: `${kind}-rate-calculator`,
    slug: `${kind}-rate-calculator`,
    name: `${isError ? "Error" : "Success"} Rate Calculator`,
    category: "performance",
    description: `Percentage of ${isError ? "failed" : "successful"} requests in a load test.`,
    icon: isError ? AlertOctagon : CheckCircle2,
    keywords: [`${kind} rate`, "load test"],
    formulaExplanation: `${isError ? "Error" : "Success"} Rate % = ${isError ? "Failed" : "Successful"} Requests ÷ Total Requests × 100.`,
    fields: [
      { id: "total", label: "Total Requests", kind: "number", allowDecimal: false, allowZero: false },
      { id: "count", label: `${isError ? "Failed" : "Successful"} Requests`, kind: "number", allowDecimal: false, allowZero: true },
    ],
    compute: (v): CalculatorOutcome => {
      const rate = (Math.min(v.count, v.total) / v.total) * 100;
      return {
        steps: [{ label: `${isError ? "Error" : "Success"} Rate %`, formula: "Count ÷ Total × 100", value: pct(rate) }],
        summary: [
          {
            label: `${isError ? "Error" : "Success"} Rate %`,
            value: pct(rate),
            highlight: true,
            tone: isError ? (rate > 1 ? "negative" : "positive") : rate >= 99 ? "positive" : "default",
          },
        ],
      };
    },
  };
}

export const performanceCalculators: CalculatorDef[] = [
  concurrentUsersCalculator,
  buildRateCalculator("rps"),
  buildRateCalculator("tps"),
  throughputCalculator,
  responseTimeAverageCalculator,
  peakResponseTimeCalculator,
  buildRateOfCalculator("error"),
  buildRateOfCalculator("success"),
];
