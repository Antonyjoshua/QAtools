import { Contrast, Ruler, Hand, Grid3x3, ListChecks } from "lucide-react";
import type { CalculatorDef, CalculatorOutcome } from "../types";
import { formatNumber, round2 } from "../format";

function num(v: number, decimals = 2) {
  return formatNumber(round2(Number.isFinite(v) ? v : 0), decimals);
}

function hexToRgb(hex: string): [number, number, number] | null {
  const clean = hex.trim().replace(/^#/, "");
  const full = clean.length === 3 ? clean.split("").map((c) => c + c).join("") : clean;
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return null;
  return [parseInt(full.slice(0, 2), 16), parseInt(full.slice(2, 4), 16), parseInt(full.slice(4, 6), 16)];
}

function relativeLuminance([r, g, b]: [number, number, number]): number {
  const toLinear = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  };
  const [rl, gl, bl] = [toLinear(r), toLinear(g), toLinear(b)];
  return 0.2126 * rl + 0.7152 * gl + 0.0722 * bl;
}

/* ------------------------------- Contrast Ratio Calculator ------------------------------- */

const contrastRatioCalculator: CalculatorDef = {
  id: "contrast-ratio-calculator",
  slug: "contrast-ratio-calculator",
  name: "Contrast Ratio Calculator",
  category: "ui-ux",
  description: "WCAG contrast ratio between a foreground and background color, with AA/AAA verdicts.",
  icon: Contrast,
  keywords: ["contrast ratio", "wcag", "color contrast", "accessibility"],
  formulaExplanation: "Ratio = (L1 + 0.05) ÷ (L2 + 0.05), where L1 is the lighter color's relative luminance and L2 the darker.",
  fields: [
    { id: "foreground", label: "Foreground Color (hex)", kind: "text", placeholder: "#111111", defaultValue: "#111111" },
    { id: "background", label: "Background Color (hex)", kind: "text", placeholder: "#ffffff", defaultValue: "#ffffff" },
  ],
  compute: (_v, raw): CalculatorOutcome => {
    const fg = hexToRgb(raw.foreground ?? "");
    const bg = hexToRgb(raw.background ?? "");
    if (!fg || !bg) {
      return { steps: [], summary: [{ label: "Result", value: "Enter valid hex colors" }], notes: ["Use hex format like #111111 or #fff."] };
    }

    const lFg = relativeLuminance(fg);
    const lBg = relativeLuminance(bg);
    const lighter = Math.max(lFg, lBg);
    const darker = Math.min(lFg, lBg);
    const ratio = (lighter + 0.05) / (darker + 0.05);

    const passAA = ratio >= 4.5;
    const passAALarge = ratio >= 3;
    const passAAA = ratio >= 7;

    return {
      steps: [{ label: "Contrast Ratio", formula: "(L1 + 0.05) ÷ (L2 + 0.05)", value: `${num(ratio)} : 1` }],
      summary: [
        { label: "Contrast Ratio", value: `${num(ratio)} : 1`, highlight: true },
        { label: "AA (normal text, ≥4.5:1)", value: passAA ? "Pass" : "Fail", tone: passAA ? "positive" : "negative" },
        { label: "AA (large text, ≥3:1)", value: passAALarge ? "Pass" : "Fail", tone: passAALarge ? "positive" : "negative" },
        { label: "AAA (normal text, ≥7:1)", value: passAAA ? "Pass" : "Fail", tone: passAAA ? "positive" : "negative" },
      ],
    };
  },
};

/* -------------------------------- Padding & Margin Calculator -------------------------------- */

const spacingScaleCalculator: CalculatorDef = {
  id: "padding-margin-calculator",
  slug: "padding-margin-calculator",
  name: "Padding & Margin Calculator",
  category: "ui-ux",
  description: "Generate a consistent spacing scale from a base unit for padding/margin values.",
  icon: Ruler,
  keywords: ["padding", "margin", "spacing scale", "design system"],
  formulaExplanation: "Scale step N = Base Unit × N, for N = 1 … Steps.",
  fields: [
    { id: "baseUnit", label: "Base Unit (px)", kind: "number", allowDecimal: false, allowZero: false, defaultValue: "8" },
    { id: "steps", label: "Number of Steps", kind: "number", allowDecimal: false, allowZero: false, defaultValue: "6", max: 12 },
  ],
  compute: (v): CalculatorOutcome => {
    const stepCount = Math.min(Math.round(v.steps), 12);
    const scale = Array.from({ length: stepCount }, (_, i) => v.baseUnit * (i + 1));

    return {
      steps: scale.map((value, i) => ({ label: `Step ${i + 1}`, formula: `${v.baseUnit} × ${i + 1}`, value: `${value}px` })),
      summary: [{ label: "Spacing Scale", value: scale.map((s) => `${s}px`).join(", "), highlight: true }],
    };
  },
};

/* -------------------------------- Touch Target Size Checker -------------------------------- */

const touchTargetCalculator: CalculatorDef = {
  id: "touch-target-size-checker",
  slug: "touch-target-size-checker",
  name: "Touch Target Size Checker",
  category: "ui-ux",
  description: "Check a tappable element's size against WCAG and Material Design minimums.",
  icon: Hand,
  keywords: ["touch target", "tap target", "wcag 2.5.5"],
  formulaExplanation: "WCAG 2.5.5 recommends ≥44×44 CSS px. Material Design recommends ≥48×48dp.",
  fields: [
    { id: "width", label: "Element Width (px)", kind: "number", allowDecimal: true, allowZero: false },
    { id: "height", label: "Element Height (px)", kind: "number", allowDecimal: true, allowZero: false },
  ],
  compute: (v): CalculatorOutcome => {
    const passWcag = v.width >= 44 && v.height >= 44;
    const passMaterial = v.width >= 48 && v.height >= 48;

    return {
      steps: [{ label: "Size", formula: "Width × Height", value: `${v.width} × ${v.height} px` }],
      summary: [
        { label: "WCAG 2.5.5 (≥44×44px)", value: passWcag ? "Pass" : "Fail", highlight: true, tone: passWcag ? "positive" : "negative" },
        { label: "Material Design (≥48×48dp)", value: passMaterial ? "Pass" : "Fail", tone: passMaterial ? "positive" : "negative" },
      ],
    };
  },
};

/* -------------------------------- Responsive Grid Calculator -------------------------------- */

const responsiveGridCalculator: CalculatorDef = {
  id: "responsive-grid-calculator",
  slug: "responsive-grid-calculator",
  name: "Responsive Grid Calculator",
  category: "ui-ux",
  description: "Compute column width for a fixed-column grid given container width and gutter.",
  icon: Grid3x3,
  keywords: ["responsive grid", "column width", "gutter"],
  formulaExplanation: "Column Width = (Container Width − Gutter × (Columns − 1)) ÷ Columns.",
  fields: [
    { id: "containerWidth", label: "Container Width (px)", kind: "number", allowDecimal: true, allowZero: false },
    { id: "columns", label: "Number of Columns", kind: "number", allowDecimal: false, allowZero: false, defaultValue: "12" },
    { id: "gutter", label: "Gutter / Gap (px)", kind: "number", allowDecimal: true, allowZero: true, defaultValue: "16" },
  ],
  compute: (v): CalculatorOutcome => {
    const columnWidth = (v.containerWidth - v.gutter * (v.columns - 1)) / v.columns;

    return {
      steps: [{ label: "Column Width", formula: "(Container − Gutter×(Columns−1)) ÷ Columns", value: `${num(columnWidth)} px` }],
      summary: [{ label: "Column Width", value: `${num(columnWidth)} px`, highlight: true }],
      notes: columnWidth < 0 ? ["Negative column width — gutter × columns exceeds the container width."] : [],
    };
  },
};

/* -------------------------------- Accessibility Score Helper -------------------------------- */

function yesNoField(id: string, label: string) {
  return {
    id,
    label,
    kind: "select" as const,
    defaultValue: "no",
    options: [
      { label: "Yes", value: "yes" },
      { label: "No", value: "no" },
    ],
  };
}

const accessibilityScoreCalculator: CalculatorDef = {
  id: "accessibility-score-helper",
  slug: "accessibility-score-helper",
  name: "Accessibility Score Helper",
  category: "ui-ux",
  description: "A quick 5-point checklist score for common accessibility basics.",
  icon: ListChecks,
  keywords: ["accessibility score", "a11y checklist"],
  formulaExplanation: "Score = (Checklist items passed ÷ 5) × 100.",
  fields: [
    yesNoField("altText", "Images have alt text?"),
    yesNoField("contrast", "Sufficient color contrast?"),
    yesNoField("keyboard", "Fully keyboard navigable?"),
    yesNoField("aria", "ARIA labels present where needed?"),
    yesNoField("focus", "Visible focus indicators?"),
  ],
  compute: (_v, raw): CalculatorOutcome => {
    const checks = ["altText", "contrast", "keyboard", "aria", "focus"];
    const passed = checks.filter((c) => raw[c] === "yes").length;
    const score = (passed / checks.length) * 100;
    const verdict = score === 100 ? "Excellent" : score >= 60 ? "Needs work" : "Poor";

    return {
      steps: [{ label: "Checklist Passed", formula: `${passed} of ${checks.length}`, value: `${passed}/${checks.length}` }],
      summary: [
        { label: "Accessibility Score", value: num(score, 0), highlight: true, tone: score >= 80 ? "positive" : score >= 60 ? "default" : "negative" },
        { label: "Verdict", value: verdict },
      ],
      progress: [{ label: "Score", value: score, color: score >= 80 ? "var(--status-good)" : score >= 60 ? "var(--status-warning)" : "var(--status-critical)" }],
      notes: ["This is a starting checklist, not a substitute for a full audit (e.g. axe DevTools, Lighthouse, or manual screen-reader testing)."],
    };
  },
};

export const uiUxCalculators: CalculatorDef[] = [
  contrastRatioCalculator,
  spacingScaleCalculator,
  touchTargetCalculator,
  responsiveGridCalculator,
  accessibilityScoreCalculator,
];
