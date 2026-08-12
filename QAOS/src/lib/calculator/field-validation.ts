import type { CalculatorField } from "./types";

export function validateOtherFields(
  fields: CalculatorField[],
  raw: Record<string, string>
): Record<string, string> {
  const errors: Record<string, string> = {};

  for (const field of fields) {
    if (field.kind === "number") continue;
    const value = (raw[field.id] ?? "").trim();

    if (field.kind === "date") {
      if (!value) {
        if (!field.optional) errors[field.id] = `${field.label} is required`;
        continue;
      }
      if (Number.isNaN(new Date(value).getTime())) {
        errors[field.id] = `${field.label} is not a valid date`;
      }
      continue;
    }

    if (field.kind === "time") {
      if (!value) {
        if (!field.optional) errors[field.id] = `${field.label} is required`;
        continue;
      }
      if (!/^\d{2}:\d{2}$/.test(value)) {
        errors[field.id] = `${field.label} is not a valid time`;
      }
      continue;
    }

    if (field.kind === "text") {
      if (!value && !field.optional) {
        errors[field.id] = `${field.label} is required`;
      }
    }
  }

  return errors;
}
