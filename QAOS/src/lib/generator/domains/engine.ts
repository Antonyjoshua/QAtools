/** Generic, schema-driven record generator shared by every domain/category. */
import { bool, pick } from "../random";
import { buildPerson } from "../modules/personal";
import { FIELD_GENERATORS, isSpecialCharEligible, specialCharSample } from "./field-generators";
import type { DomainCategoryDef, DomainGenConfig, FieldGenContext } from "./types";

function pickRowScenario(config: DomainGenConfig): "valid" | "invalid" | "boundary" {
  if (config.scenario !== "mixed") return config.scenario;
  const r = Math.random();
  if (r < 0.65) return "valid";
  if (r < 0.85) return "invalid";
  return "boundary";
}

export function generateDomainRecords(category: DomainCategoryDef, config: DomainGenConfig): Record<string, unknown>[] {
  const fields = category.fields.filter((f) => f.required || config.selectedFieldKeys.includes(f.key));
  const count = Math.max(1, Math.min(100000, Math.floor(config.count) || 1));
  const rows: Record<string, unknown>[] = [];

  for (let i = 0; i < count; i++) {
    if (config.includeDuplicates && rows.length > 0 && i % 5 === 4) {
      rows.push({ ...pick(rows) });
      continue;
    }

    const person = buildPerson(config.locale);
    const scenario = pickRowScenario(config);
    const row: Record<string, unknown> = {};

    for (const field of fields) {
      if (config.includeNulls && !field.required && bool(0.12)) {
        row[field.key] = null;
        continue;
      }

      const generator = FIELD_GENERATORS[field.type];
      const ctx: FieldGenContext = { locale: config.locale, index: i, field, person };

      let value: unknown;
      if (scenario === "invalid" && generator.invalid) {
        value = generator.invalid(ctx)[0];
      } else if (scenario === "boundary" && generator.boundary) {
        const cases = generator.boundary(ctx);
        value = cases[i % cases.length].value;
      } else {
        value = generator.valid(ctx);
      }

      if (config.includeSpecialChars && isSpecialCharEligible(field.type) && bool(0.2)) {
        value = specialCharSample();
      }

      row[field.key] = value;
    }

    rows.push(row);
  }

  return rows;
}

export function defaultConfig(category: DomainCategoryDef, locale = "IN"): DomainGenConfig {
  return {
    count: 25,
    selectedFieldKeys: category.fields.filter((f) => !f.required).map((f) => f.key),
    scenario: "valid",
    includeDuplicates: false,
    includeNulls: false,
    includeSpecialChars: false,
    locale,
  };
}
