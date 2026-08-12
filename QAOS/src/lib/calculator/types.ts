import type { LucideIcon } from "lucide-react";

export type FieldKind = "number" | "select" | "date" | "time" | "text" | "file";

export interface FieldOption {
  label: string;
  value: string;
}

export interface CalculatorField {
  id: string;
  label: string;
  kind: FieldKind;
  placeholder?: string;
  prefix?: string;
  suffix?: string;
  defaultValue?: string;
  options?: FieldOption[];
  helpText?: string;
  /** Number validation rules (kind === "number") */
  allowNegative?: boolean;
  allowZero?: boolean;
  allowDecimal?: boolean;
  min?: number;
  max?: number;
  optional?: boolean;
  /** kind === "file": reads the selected file and returns raw string values to merge in (e.g. size, hash) */
  onFileLoad?: (file: File) => Promise<Record<string, string>>;
  accept?: string;
  /** kind === "text": render as a multi-line textarea instead of a single-line input */
  multiline?: boolean;
}

export interface FormulaStep {
  label: string;
  formula: string;
  value: string;
}

export interface SummaryItem {
  label: string;
  value: string;
  highlight?: boolean;
  tone?: "default" | "positive" | "negative";
}

export interface ChartSeries {
  name: string;
  value: number;
  color: string;
}

export interface CalculatorChart {
  type: "pie" | "bar";
  data: ChartSeries[];
  yLabel?: string;
}

export interface CalculatorOutcome {
  steps: FormulaStep[];
  summary: SummaryItem[];
  chart?: CalculatorChart;
  progress?: { label: string; value: number; color?: string }[];
  notes?: string[];
}

export type CalculatorCategory =
  | "financial"
  | "testing"
  | "datetime"
  | "utility"
  | "agile"
  | "performance"
  | "api"
  | "mobile"
  | "web"
  | "security"
  | "file-utils"
  | "ui-ux"
  | "reporting";

export interface CalculatorDef {
  id: string;
  slug: string;
  name: string;
  shortName?: string;
  category: CalculatorCategory;
  description: string;
  icon: LucideIcon;
  keywords?: string[];
  fields: CalculatorField[];
  formulaExplanation: string;
  /** Auto-recompute on an interval (e.g. countdowns) */
  live?: boolean;
  liveIntervalMs?: number;
  /** `values` = validated numeric fields; `raw` = original string values (for select/text fields) */
  compute: (values: Record<string, number>, raw: Record<string, string>) => CalculatorOutcome;
}

export const CATEGORY_META: Record<
  CalculatorCategory,
  { label: string; description: string }
> = {
  financial: {
    label: "Financial",
    description: "GST, pricing, discounts, margins & commissions",
  },
  testing: {
    label: "Testing",
    description: "QA metrics for coverage, execution & defects",
  },
  datetime: {
    label: "Date & Time",
    description: "Durations, deadlines, working days & countdowns",
  },
  utility: {
    label: "Utility",
    description: "Everyday dev & QA helper tools",
  },
  agile: {
    label: "Agile",
    description: "Sprint capacity, velocity, burndown & team allocation",
  },
  performance: {
    label: "Performance Testing",
    description: "Load, throughput and response time metrics",
  },
  api: {
    label: "API Testing",
    description: "Payloads, tokens and timestamps for API testing",
  },
  mobile: {
    label: "Mobile Testing",
    description: "App size, screen density and device compatibility",
  },
  web: {
    label: "Web Testing",
    description: "Breakpoints, viewports and browser compatibility",
  },
  security: {
    label: "Security Testing",
    description: "Password strength, hashing and encoding helpers",
  },
  "file-utils": {
    label: "File Utilities",
    description: "Formatters, validators and comparisons for structured files",
  },
  "ui-ux": {
    label: "UI/UX Testing",
    description: "Accessibility, contrast and layout helpers",
  },
  reporting: {
    label: "Reporting",
    description: "Charts and generated reports for stand-ups and releases",
  },
};
