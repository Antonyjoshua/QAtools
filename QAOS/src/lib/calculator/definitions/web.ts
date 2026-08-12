import { Globe, LayoutTemplate, Monitor, Type } from "lucide-react";
import type { CalculatorDef, CalculatorOutcome } from "../types";
import { formatNumber, round2 } from "../format";

function num(v: number, decimals = 2) {
  return formatNumber(round2(Number.isFinite(v) ? v : 0), decimals);
}

/* ------------------------------ Browser Compatibility Matrix ------------------------------ */

const SUPPORT_TIERS: Record<string, string[]> = {
  modern: [
    "Chrome (latest)",
    "Firefox (latest)",
    "Safari (latest)",
    "Edge (latest)",
  ],
  "modern-plus-one": [
    "Chrome (latest + previous)",
    "Firefox (latest + previous)",
    "Safari (latest + previous)",
    "Edge (latest + previous)",
    "Mobile Safari (iOS, latest)",
    "Chrome for Android (latest)",
  ],
  legacy: [
    "Chrome (latest + previous)",
    "Firefox (latest + previous)",
    "Safari (latest + previous)",
    "Edge (latest + previous)",
    "Mobile Safari (iOS, last 2 major)",
    "Chrome for Android (latest)",
    "Samsung Internet (latest)",
    "IE 11 (if contractually required)",
  ],
};

const browserMatrixCalculator: CalculatorDef = {
  id: "browser-compatibility-matrix",
  slug: "browser-compatibility-matrix",
  name: "Browser Compatibility Matrix",
  category: "web",
  description: "Suggested browser/device test matrix for a given support tier.",
  icon: Globe,
  keywords: ["browser compatibility", "test matrix", "cross-browser testing"],
  formulaExplanation: "Looks up a recommended test matrix for the selected support commitment level.",
  fields: [
    {
      id: "tier",
      label: "Support Commitment",
      kind: "select",
      defaultValue: "modern-plus-one",
      options: [
        { label: "Modern only (latest versions)", value: "modern" },
        { label: "Modern + 1 version back", value: "modern-plus-one" },
        { label: "Broad / legacy support", value: "legacy" },
      ],
    },
  ],
  compute: (_v, raw): CalculatorOutcome => {
    const list = SUPPORT_TIERS[raw.tier] ?? SUPPORT_TIERS["modern-plus-one"];
    return {
      steps: list.map((browser, i) => ({ label: `Target ${i + 1}`, formula: "Recommended for this tier", value: browser })),
      summary: [{ label: "Recommended Test Matrix", value: list.join(", "), highlight: true }],
      notes: ["This is a general starting point — narrow it down using your real analytics data where available."],
    };
  },
};

/* --------------------------- Responsive Breakpoint Helper --------------------------- */

const BREAKPOINTS = [
  { max: 576, name: "Extra small (phones)" },
  { max: 768, name: "Small (large phones / small tablets)" },
  { max: 992, name: "Medium (tablets)" },
  { max: 1200, name: "Large (small desktops)" },
  { max: Infinity, name: "Extra large (desktops)" },
];

const breakpointHelperCalculator: CalculatorDef = {
  id: "responsive-breakpoint-helper",
  slug: "responsive-breakpoint-helper",
  name: "Responsive Breakpoint Helper",
  category: "web",
  description: "Which common responsive breakpoint bucket a given viewport width falls into.",
  icon: LayoutTemplate,
  keywords: ["breakpoints", "responsive design", "media queries"],
  formulaExplanation: "Uses common Bootstrap-style breakpoints: <576, <768, <992, <1200, ≥1200px.",
  fields: [{ id: "width", label: "Viewport Width (px)", kind: "number", allowDecimal: false, allowZero: false }],
  compute: (v): CalculatorOutcome => {
    const bucket = BREAKPOINTS.find((b) => v.width < b.max) ?? BREAKPOINTS[BREAKPOINTS.length - 1];
    return {
      steps: [{ label: "Breakpoint Bucket", formula: "Lookup width against common breakpoints", value: bucket.name }],
      summary: [{ label: "Breakpoint", value: bucket.name, highlight: true }],
    };
  },
};

/* -------------------------------- Viewport Size Calculator -------------------------------- */

const viewportSizeCalculator: CalculatorDef = {
  id: "viewport-size-calculator",
  slug: "viewport-size-calculator",
  name: "Viewport Size Calculator",
  category: "web",
  description: "Convert a device's physical resolution and pixel ratio into CSS viewport pixels.",
  icon: Monitor,
  keywords: ["viewport", "css pixels", "device pixel ratio"],
  formulaExplanation: "CSS Pixels = Physical Pixels ÷ Device Pixel Ratio.",
  fields: [
    { id: "physicalWidth", label: "Physical Width (px)", kind: "number", allowDecimal: false, allowZero: false },
    { id: "physicalHeight", label: "Physical Height (px)", kind: "number", allowDecimal: false, allowZero: false },
    { id: "dpr", label: "Device Pixel Ratio", kind: "number", allowDecimal: true, allowZero: false, defaultValue: "2" },
  ],
  compute: (v): CalculatorOutcome => {
    const cssWidth = v.physicalWidth / v.dpr;
    const cssHeight = v.physicalHeight / v.dpr;

    return {
      steps: [
        { label: "CSS Width", formula: "Physical Width ÷ DPR", value: `${num(cssWidth, 0)} px` },
        { label: "CSS Height", formula: "Physical Height ÷ DPR", value: `${num(cssHeight, 0)} px` },
      ],
      summary: [{ label: "CSS Viewport", value: `${num(cssWidth, 0)} × ${num(cssHeight, 0)}`, highlight: true }],
    };
  },
};

/* ---------------------------- Font Size Accessibility Checker ---------------------------- */

const fontSizeAccessibilityCalculator: CalculatorDef = {
  id: "font-size-accessibility-checker",
  slug: "font-size-accessibility-checker",
  name: "Font Size Accessibility Checker",
  category: "web",
  description: "Check a font size against common minimum-readability recommendations.",
  icon: Type,
  keywords: ["font size accessibility", "readable text", "wcag"],
  formulaExplanation: "Body text is commonly recommended at ≥16px; anything below 12px is flagged as hard to read.",
  fields: [{ id: "fontSize", label: "Font Size (px)", kind: "number", allowDecimal: true, allowZero: false }],
  compute: (v): CalculatorOutcome => {
    const verdict = v.fontSize >= 16 ? "Good for body text" : v.fontSize >= 12 ? "Acceptable for secondary text only" : "Too small — hard to read";
    const tone = v.fontSize >= 16 ? "positive" : v.fontSize >= 12 ? "default" : "negative";

    return {
      steps: [{ label: "Verdict", formula: "Compare against 16px / 12px thresholds", value: verdict }],
      summary: [{ label: "Verdict", value: verdict, highlight: true, tone }],
      notes: ["This is a general guideline, not a strict WCAG success criterion — WCAG itself doesn't mandate a minimum font size."],
    };
  },
};

export const webCalculators: CalculatorDef[] = [
  browserMatrixCalculator,
  breakpointHelperCalculator,
  viewportSizeCalculator,
  fontSizeAccessibilityCalculator,
];
