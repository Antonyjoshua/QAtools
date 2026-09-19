import type { DomainCategoryDef, DomainId } from "./types";
import { BANKING_FINANCE_CATEGORIES } from "./categories/banking-finance";
import { ECOMMERCE_CATEGORIES } from "./categories/ecommerce";
import { HEALTHCARE_CATEGORIES } from "./categories/healthcare";
import { INSURANCE_CATEGORIES } from "./categories/insurance";
import { TRAVEL_HOSPITALITY_CATEGORIES } from "./categories/travel-hospitality";
import { EDUCATION_CATEGORIES } from "./categories/education";
import { TELECOM_CATEGORIES } from "./categories/telecom";
import { GENERIC_CATEGORIES } from "./categories/generic";

export const ALL_DOMAIN_CATEGORIES: DomainCategoryDef[] = [
  ...BANKING_FINANCE_CATEGORIES,
  ...ECOMMERCE_CATEGORIES,
  ...HEALTHCARE_CATEGORIES,
  ...INSURANCE_CATEGORIES,
  ...TRAVEL_HOSPITALITY_CATEGORIES,
  ...EDUCATION_CATEGORIES,
  ...TELECOM_CATEGORIES,
  ...GENERIC_CATEGORIES,
];

export function getDomainCategories(domainId: string): DomainCategoryDef[] {
  return ALL_DOMAIN_CATEGORIES.filter((c) => c.domainId === (domainId as DomainId));
}

export function getDomainCategory(domainId: string, categoryId: string): DomainCategoryDef | undefined {
  return ALL_DOMAIN_CATEGORIES.find((c) => c.domainId === (domainId as DomainId) && c.id === categoryId);
}
