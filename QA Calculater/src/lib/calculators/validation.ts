import type { CalculatorField } from "./types";

export interface FieldValidation {
  ok: boolean;
  value: number;
  error?: string;
}

const DEFAULT_MAX = 1_000_000_000_000; // 1 trillion ceiling guards against absurd inputs

export function validateNumberField(
  raw: string,
  field: CalculatorField
): FieldValidation {
  const trimmed = (raw ?? "").trim();

  if (trimmed === "") {
    if (field.optional) return { ok: true, value: 0 };
    return { ok: false, value: NaN, error: `${field.label} is required` };
  }

  if (!/^-?\d*\.?\d*$/.test(trimmed) || trimmed === "-" || trimmed === ".") {
    return { ok: false, value: NaN, error: `${field.label} must be a valid number` };
  }

  const value = Number(trimmed);

  if (Number.isNaN(value)) {
    return { ok: false, value: NaN, error: `${field.label} must be a valid number` };
  }

  if (!field.allowNegative && value < 0) {
    return { ok: false, value, error: `${field.label} cannot be negative` };
  }

  if (!field.allowZero && value === 0) {
    return { ok: false, value, error: `${field.label} cannot be zero` };
  }

  if (!field.allowDecimal && !Number.isInteger(value)) {
    return { ok: false, value, error: `${field.label} must be a whole number` };
  }

  const max = field.max ?? DEFAULT_MAX;
  if (value > max) {
    return {
      ok: false,
      value,
      error: `${field.label} is too large (max ${max.toLocaleString("en-IN")})`,
    };
  }

  const min = field.min ?? (field.allowNegative ? -DEFAULT_MAX : 0);
  if (value < min) {
    return { ok: false, value, error: `${field.label} must be at least ${min}` };
  }

  return { ok: true, value };
}

export interface ValidatedFields {
  values: Record<string, number>;
  raw: Record<string, string>;
  errors: Record<string, string>;
  isValid: boolean;
}

export function validateFields(
  fields: CalculatorField[],
  raw: Record<string, string>
): ValidatedFields {
  const values: Record<string, number> = {};
  const errors: Record<string, string> = {};

  for (const field of fields) {
    if (field.kind !== "number") continue;
    const result = validateNumberField(raw[field.id] ?? "", field);
    if (!result.ok) {
      errors[field.id] = result.error ?? "Invalid value";
    }
    values[field.id] = result.value;
  }

  return { values, raw, errors, isValid: Object.keys(errors).length === 0 };
}
