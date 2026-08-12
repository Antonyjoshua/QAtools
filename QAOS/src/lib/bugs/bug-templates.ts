import type { JSONContent } from "@tiptap/core";
import type { BugCategory, Severity, Priority } from "./types";
import { doc, paragraph, orderedList } from "./template-builders";

export interface BugTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: BugCategory;
  severity: Severity;
  priority: Priority;
  titleHint: string;
  preconditions: () => JSONContent;
  steps: () => JSONContent;
  expected: () => JSONContent;
  actual: () => JSONContent;
}

export const BUG_TEMPLATES: BugTemplate[] = [
  {
    id: "functional",
    name: "Functional Bug",
    description: "A feature doesn't work as intended.",
    icon: "Bug",
    category: "Functional",
    severity: "Major",
    priority: "P2",
    titleHint: "[Module] Feature does not work as expected",
    preconditions: () => doc(paragraph("User is logged in with a valid test account.")),
    steps: () => doc(orderedList(["Navigate to the affected page/feature.", "Perform the intended action.", "Observe the result."])),
    expected: () => doc(paragraph("The feature should behave as described in the requirements/user story.")),
    actual: () => doc(paragraph("The feature fails to behave as expected — describe exactly what happens instead.")),
  },
  {
    id: "ui",
    name: "UI Bug",
    description: "Visual/layout defect — alignment, spacing, overlap, styling.",
    icon: "LayoutTemplate",
    category: "UI",
    severity: "Minor",
    priority: "P3",
    titleHint: "[Module] Alignment/UI issue on [screen]",
    preconditions: () => doc(paragraph("Open the affected screen at standard resolution (1920x1080).")),
    steps: () => doc(orderedList(["Navigate to the affected screen.", "Observe the layout/component in question."])),
    expected: () => doc(paragraph("Elements should be aligned/styled per the design spec (Figma link if available).")),
    actual: () => doc(paragraph("Describe the visual defect — misalignment, overlap, incorrect spacing, wrong color/font, etc.")),
  },
  {
    id: "api",
    name: "API Bug",
    description: "Incorrect API response, status code, or contract violation.",
    icon: "Braces",
    category: "API",
    severity: "High",
    priority: "P1",
    titleHint: "[Endpoint] returns incorrect response",
    preconditions: () => doc(paragraph("Valid auth token / API client configured (e.g. Postman).")),
    steps: () => doc(orderedList(["Send [METHOD] request to [endpoint] with payload: { ... }", "Inspect the response status code and body."])),
    expected: () => doc(paragraph("Expected status code: 200. Expected response body: { ... }")),
    actual: () => doc(paragraph("Actual status code: [code]. Actual response body: { ... }")),
  },
  {
    id: "calculation",
    name: "Calculation Bug",
    description: "Incorrect computed value (totals, tax, discounts, rounding).",
    icon: "Calculator",
    category: "Calculation",
    severity: "Major",
    priority: "P2",
    titleHint: "Incorrect calculation for [field/total]",
    preconditions: () => doc(paragraph("Test data with known/expected inputs is available.")),
    steps: () => doc(orderedList(["Enter input values: [values].", "Trigger the calculation (e.g. proceed to checkout).", "Observe the computed result."])),
    expected: () => doc(paragraph("Expected result: [correct value], based on formula: [formula].")),
    actual: () => doc(paragraph("Actual result: [incorrect value].")),
  },
  {
    id: "regression",
    name: "Regression Bug",
    description: "A previously working feature is now broken.",
    icon: "History",
    category: "Regression",
    severity: "High",
    priority: "P1",
    titleHint: "[Feature] regressed after [build/release]",
    preconditions: () => doc(paragraph("Previously verified working in build [version]. Now failing in build [version].")),
    steps: () => doc(orderedList(["Navigate to [feature].", "Perform the previously-working action.", "Observe the new (broken) behavior."])),
    expected: () => doc(paragraph("Should continue working as it did in build [previous version].")),
    actual: () => doc(paragraph("Now fails — describe the regression.")),
  },
  {
    id: "performance",
    name: "Performance Bug",
    description: "Slow load time, lag, or resource-heavy behavior.",
    icon: "Gauge",
    category: "Performance",
    severity: "Medium",
    priority: "P2",
    titleHint: "[Page/action] is slow to load/respond",
    preconditions: () => doc(paragraph("Measured on [network condition / device spec].")),
    steps: () => doc(orderedList(["Navigate to [page].", "Measure load/response time using [tool].", "Compare against acceptable threshold."])),
    expected: () => doc(paragraph("Should load/respond within [X] seconds.")),
    actual: () => doc(paragraph("Takes [Y] seconds — noticeably slower than expected.")),
  },
  {
    id: "accessibility",
    name: "Accessibility Bug",
    description: "WCAG/a11y violation — contrast, keyboard nav, screen reader.",
    icon: "Accessibility",
    category: "Accessibility",
    severity: "Medium",
    priority: "P2",
    titleHint: "[Component] fails accessibility check ([WCAG criterion])",
    preconditions: () => doc(paragraph("Tested with [screen reader / keyboard-only navigation / contrast checker].")),
    steps: () => doc(orderedList(["Navigate to [component] using [assistive tech].", "Attempt to interact with it."])),
    expected: () => doc(paragraph("Should meet WCAG 2.1 AA — e.g. sufficient contrast ratio, proper focus order, ARIA labels present.")),
    actual: () => doc(paragraph("Describe the violation — e.g. no focus indicator, missing alt text, insufficient contrast ratio.")),
  },
  {
    id: "mobile",
    name: "Mobile Bug",
    description: "Device/OS-specific defect on Android or iOS.",
    icon: "Smartphone",
    category: "Mobile",
    severity: "Major",
    priority: "P2",
    titleHint: "[Screen] issue on [device/OS]",
    preconditions: () => doc(paragraph("Device: [model], OS version: [version], App version: [version].")),
    steps: () => doc(orderedList(["Open the app on the affected device.", "Navigate to [screen].", "Perform [action]."])),
    expected: () => doc(paragraph("Should render/behave correctly on this device/OS combination.")),
    actual: () => doc(paragraph("Describe the device-specific defect.")),
  },
  {
    id: "crash",
    name: "Crash Bug",
    description: "Application crash, freeze, or white screen.",
    icon: "Skull",
    category: "Crash",
    severity: "Critical",
    priority: "P0",
    titleHint: "App crashes when [action]",
    preconditions: () => doc(paragraph("App version: [version]. Reproducible on [device/browser].")),
    steps: () => doc(orderedList(["Open the app.", "Perform [action] that triggers the crash.", "Observe the crash/freeze."])),
    expected: () => doc(paragraph("The app should not crash — the action should complete normally.")),
    actual: () => doc(paragraph("The app crashes/freezes/shows a white screen. Attach crash log if available.")),
  },
  {
    id: "security",
    name: "Security Bug",
    description: "Vulnerability — auth bypass, data exposure, injection risk.",
    icon: "ShieldAlert",
    category: "Security",
    severity: "Critical",
    priority: "P0",
    titleHint: "[Endpoint/screen] exposes [vulnerability type]",
    preconditions: () => doc(paragraph("Tested against [environment] with permission from the security/QA lead.")),
    steps: () => doc(orderedList(["Attempt [action] as [role/unauthenticated user].", "Observe whether access/data is improperly exposed."])),
    expected: () => doc(paragraph("Access should be denied / data should not be exposed to unauthorized users.")),
    actual: () => doc(paragraph("Describe the vulnerability and its potential impact. Avoid including real sensitive data in the report.")),
  },
  {
    id: "compatibility",
    name: "Compatibility Bug",
    description: "Works in one browser/OS combination but not another.",
    icon: "MonitorSmartphone",
    category: "Compatibility",
    severity: "Medium",
    priority: "P2",
    titleHint: "[Feature] broken on [browser/OS]",
    preconditions: () => doc(paragraph("Works correctly on [browser A]. Failing on [browser B / OS].")),
    steps: () => doc(orderedList(["Open the app in [browser/OS combination].", "Navigate to [feature].", "Perform [action]."])),
    expected: () => doc(paragraph("Should behave consistently across supported browsers/OS.")),
    actual: () => doc(paragraph("Describe the browser/OS-specific difference in behavior.")),
  },
];

export function getBugTemplate(id: string): BugTemplate | undefined {
  return BUG_TEMPLATES.find((t) => t.id === id);
}
