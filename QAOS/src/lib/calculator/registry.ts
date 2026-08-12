import type { CalculatorDef, CalculatorCategory } from "./types";
import { financialCalculators } from "./definitions/financial";
import { testingCalculators } from "./definitions/testing";
import { testingExtraCalculators } from "./definitions/testing-extras";
import { datetimeCalculators } from "./definitions/datetime";
import { utilityCalculators } from "./definitions/utility";
import { agileCalculators } from "./definitions/agile";
import { performanceCalculators } from "./definitions/performance";
import { apiCalculators } from "./definitions/api";
import { securityCalculators } from "./definitions/security";
import { mobileCalculators } from "./definitions/mobile";
import { webCalculators } from "./definitions/web";
import { uiUxCalculators } from "./definitions/ui-ux";
import { fileUtilsCalculators } from "./definitions/file-utils";
import { reportingCalculators } from "./definitions/reporting";

export const CALCULATORS: CalculatorDef[] = [
  ...financialCalculators,
  ...testingCalculators,
  ...testingExtraCalculators,
  ...datetimeCalculators,
  ...utilityCalculators,
  ...agileCalculators,
  ...performanceCalculators,
  ...apiCalculators,
  ...securityCalculators,
  ...mobileCalculators,
  ...webCalculators,
  ...uiUxCalculators,
  ...fileUtilsCalculators,
  ...reportingCalculators,
];

export const CALCULATORS_BY_SLUG: Record<string, CalculatorDef> = Object.fromEntries(
  CALCULATORS.map((c) => [c.slug, c])
);

export function getCalculator(slug: string): CalculatorDef | undefined {
  return CALCULATORS_BY_SLUG[slug];
}

export function getCalculatorsByCategory(category: CalculatorCategory): CalculatorDef[] {
  return CALCULATORS.filter((c) => c.category === category);
}

export function searchCalculators(query: string): CalculatorDef[] {
  const q = query.trim().toLowerCase();
  if (!q) return CALCULATORS;
  return CALCULATORS.filter((c) => {
    const haystack = [c.name, c.description, ...(c.keywords ?? [])].join(" ").toLowerCase();
    return haystack.includes(q);
  });
}
