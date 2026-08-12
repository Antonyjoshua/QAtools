import type { GeneratorModule } from "../types";
import { pick, randInt } from "../random";
import { XSS_PAYLOADS, SQLI_PAYLOADS, UNICODE_SAMPLES, EMOJI_SAMPLES, SPECIAL_CHAR_SAMPLES } from "../data";

const INVALID_EMAILS: [string, string][] = [
  ["plainaddress", "Missing @ symbol"],
  ["@missinglocal.com", "Missing local part"],
  ["missingdomain@", "Missing domain"],
  ["missing@dotcom", "Missing TLD"],
  ["two@@at.com", "Double @ symbol"],
  ["spaces in@email.com", "Contains spaces"],
  ["trailing.dot.@email.com", "Trailing dot before @"],
  ["email@[123.123.123.123]", "Bracketed IP domain (often rejected)"],
  ["email@domain..com", "Consecutive dots in domain"],
  ["", "Empty string"],
];

const INVALID_PHONES: [string, string][] = [
  ["123", "Too short"],
  ["12345678901234567", "Too long"],
  ["+91-98-XY-12345", "Contains letters"],
  ["0000000000", "All zeros"],
  ["+", "Only a plus sign"],
  ["98765 4321 0", "Malformed spacing / extra digit"],
  ["(91) 98765-4321-", "Trailing dash"],
  ["١٢٣٤٥٦٧٨٩٠", "Non-Latin digits"],
];

const INVALID_AADHAAR: [string, string][] = [
  ["1234", "Too short (4 digits)"],
  ["12345678901234", "Too long (14 digits)"],
  ["0000 0000 0000", "All-zero sequence (structurally invalid)"],
  ["1234 5678 90AB", "Contains letters"],
  ["123456789012", "No grouping/spacing"],
  ["", "Empty string"],
];

const INVALID_PAN: [string, string][] = [
  ["ABCD12345E", "Only 4 leading letters instead of 5"],
  ["AAAAA12345", "5 digits instead of 4"],
  ["AAAA1234A", "Only 4 leading letters, wrong length"],
  ["aaaaa1234a", "Lowercase letters (PAN must be uppercase)"],
  ["AAAAA1234", "Missing trailing letter"],
  ["1AAAA2345B", "Starts with digit"],
];

const INVALID_GST: [string, string][] = [
  ["27AAAPL1234C", "Missing entity code + checksum (13 chars instead of 15)"],
  ["99AAAPL1234C1Z5", "Invalid state code (99 doesn't exist)"],
  ["27aaapl1234c1z5", "Lowercase letters (GSTIN must be uppercase)"],
  ["27AAAPL1234C1X5", "Invalid 14th fixed character (must be 'Z')"],
  ["GSTIN12345", "Wrong format entirely"],
  ["", "Empty string"],
];

function repeatChar(ch: string, n: number): string {
  return ch.repeat(n);
}

function randomLongString(len: number): string {
  return Array.from({ length: len }, () => pick("abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789".split(""))).join("");
}

const BOUNDARY_FIELDS: Record<string, { min: number; max: number; label: string }> = {
  age: { min: 18, max: 65, label: "Age (18-65)" },
  percentage: { min: 0, max: 100, label: "Percentage (0-100)" },
  quantity: { min: 1, max: 999, label: "Order Quantity (1-999)" },
  passwordLength: { min: 8, max: 64, label: "Password Length (8-64)" },
  rating: { min: 1, max: 5, label: "Rating (1-5)" },
};

const boundaryFieldOptions = Object.entries(BOUNDARY_FIELDS).map(([k, v]) => ({ label: v.label, value: k }));

export const qaGenerators: GeneratorModule[] = [
  {
    slug: "invalid-email",
    name: "Invalid Email Generator",
    category: "qa",
    description: "Malformed email addresses for negative validation testing.",
    outputKind: "table",
    supportsBulk: true,
    defaultCount: INVALID_EMAILS.length,
    maxCount: INVALID_EMAILS.length,
    columns: ["value", "reason"],
    generate: (ctx) => {
      const [value, reason] = INVALID_EMAILS[ctx.index % INVALID_EMAILS.length];
      return { value, reason };
    },
  },
  {
    slug: "invalid-phone",
    name: "Invalid Phone Number Generator",
    category: "qa",
    description: "Malformed phone numbers for negative validation testing.",
    outputKind: "table",
    supportsBulk: true,
    defaultCount: INVALID_PHONES.length,
    maxCount: INVALID_PHONES.length,
    columns: ["value", "reason"],
    generate: (ctx) => {
      const [value, reason] = INVALID_PHONES[ctx.index % INVALID_PHONES.length];
      return { value, reason };
    },
  },
  {
    slug: "invalid-aadhaar",
    name: "Invalid Aadhaar Format Generator",
    category: "qa",
    description: "Structurally invalid Aadhaar-style strings for validation testing.",
    outputKind: "table",
    supportsBulk: true,
    defaultCount: INVALID_AADHAAR.length,
    maxCount: INVALID_AADHAAR.length,
    columns: ["value", "reason"],
    generate: (ctx) => {
      const [value, reason] = INVALID_AADHAAR[ctx.index % INVALID_AADHAAR.length];
      return { value, reason };
    },
  },
  {
    slug: "invalid-pan",
    name: "Invalid PAN Format Generator",
    category: "qa",
    description: "Structurally invalid PAN-style strings for validation testing.",
    outputKind: "table",
    supportsBulk: true,
    defaultCount: INVALID_PAN.length,
    maxCount: INVALID_PAN.length,
    columns: ["value", "reason"],
    generate: (ctx) => {
      const [value, reason] = INVALID_PAN[ctx.index % INVALID_PAN.length];
      return { value, reason };
    },
  },
  {
    slug: "invalid-gst",
    name: "Invalid GST Format Generator",
    category: "qa",
    description: "Structurally invalid GSTIN-style strings for validation testing.",
    outputKind: "table",
    supportsBulk: true,
    defaultCount: INVALID_GST.length,
    maxCount: INVALID_GST.length,
    columns: ["value", "reason"],
    generate: (ctx) => {
      const [value, reason] = INVALID_GST[ctx.index % INVALID_GST.length];
      return { value, reason };
    },
  },
  {
    slug: "sql-injection-payloads",
    name: "SQL Injection Test Payloads",
    category: "qa",
    description: "Common SQL injection strings for input-sanitization testing on your own applications.",
    note: "For authorized security testing of applications you own or are permitted to test. Do not use against systems without explicit authorization.",
    outputKind: "table",
    supportsBulk: true,
    defaultCount: SQLI_PAYLOADS.length,
    maxCount: SQLI_PAYLOADS.length,
    columns: ["payload"],
    generate: (ctx) => ({ payload: SQLI_PAYLOADS[ctx.index % SQLI_PAYLOADS.length] }),
  },
  {
    slug: "xss-payloads",
    name: "XSS Test Payloads",
    category: "qa",
    description: "Common cross-site-scripting strings for input-sanitization testing on your own applications.",
    note: "For authorized security testing of applications you own or are permitted to test. Do not use against systems without explicit authorization.",
    outputKind: "table",
    supportsBulk: true,
    defaultCount: XSS_PAYLOADS.length,
    maxCount: XSS_PAYLOADS.length,
    columns: ["payload"],
    generate: (ctx) => ({ payload: XSS_PAYLOADS[ctx.index % XSS_PAYLOADS.length] }),
  },
  {
    slug: "unicode-characters",
    name: "Unicode Character Samples",
    category: "qa",
    description: "Multi-script Unicode strings for internationalization (i18n) testing.",
    outputKind: "table",
    supportsBulk: true,
    defaultCount: UNICODE_SAMPLES.length,
    maxCount: UNICODE_SAMPLES.length,
    columns: ["value"],
    generate: (ctx) => ({ value: UNICODE_SAMPLES[ctx.index % UNICODE_SAMPLES.length] }),
  },
  {
    slug: "emoji-strings",
    name: "Emoji String Samples",
    category: "qa",
    description: "Emoji and multi-codepoint grapheme clusters for rendering/encoding tests.",
    outputKind: "table",
    supportsBulk: true,
    defaultCount: EMOJI_SAMPLES.length,
    maxCount: EMOJI_SAMPLES.length,
    columns: ["value"],
    generate: (ctx) => ({ value: EMOJI_SAMPLES[ctx.index % EMOJI_SAMPLES.length] }),
  },
  {
    slug: "long-strings",
    name: "Long String Generator",
    category: "qa",
    description: "Very long strings to test field length limits and buffer handling.",
    outputKind: "table",
    supportsBulk: true,
    defaultCount: 10,
    options: [{ key: "length", label: "Character length", type: "number", default: 500, min: 10, max: 100000 }],
    columns: ["length", "value"],
    generate: (ctx) => {
      const len = Number(ctx.options.length ?? 500);
      return { length: len, value: randomLongString(len) };
    },
  },
  {
    slug: "special-characters",
    name: "Special Character Samples",
    category: "qa",
    description: "Punctuation, control-character, and symbol strings for input-sanitization testing.",
    outputKind: "table",
    supportsBulk: true,
    defaultCount: SPECIAL_CHAR_SAMPLES.length,
    maxCount: SPECIAL_CHAR_SAMPLES.length,
    columns: ["value"],
    generate: (ctx) => ({ value: SPECIAL_CHAR_SAMPLES[ctx.index % SPECIAL_CHAR_SAMPLES.length] }),
  },
  {
    slug: "boundary-values",
    name: "Boundary Value Generator",
    category: "qa",
    description: "Classic boundary-value-analysis rows (min-1, min, min+1, max-1, max, max+1) for a chosen numeric field.",
    outputKind: "table",
    supportsBulk: true,
    defaultCount: 6,
    maxCount: 6,
    options: [{ key: "field", label: "Field", type: "select", options: boundaryFieldOptions, default: "age" }],
    columns: ["boundary", "value", "expected"],
    generate: (ctx) => {
      const field = BOUNDARY_FIELDS[String(ctx.options.field ?? "age")] ?? BOUNDARY_FIELDS.age;
      const cases = [
        { boundary: "min - 1", value: field.min - 1, expected: "Invalid" },
        { boundary: "min", value: field.min, expected: "Valid" },
        { boundary: "min + 1", value: field.min + 1, expected: "Valid" },
        { boundary: "max - 1", value: field.max - 1, expected: "Valid" },
        { boundary: "max", value: field.max, expected: "Valid" },
        { boundary: "max + 1", value: field.max + 1, expected: "Invalid" },
      ];
      return cases[ctx.index % cases.length];
    },
  },
  {
    slug: "equivalence-partitions",
    name: "Equivalence Partition Generator",
    category: "qa",
    description: "Representative values for each equivalence class (below range, in range, above range, invalid type).",
    outputKind: "table",
    supportsBulk: true,
    defaultCount: 4,
    maxCount: 4,
    options: [{ key: "field", label: "Field", type: "select", options: boundaryFieldOptions, default: "age" }],
    columns: ["partitionClass", "sampleValue", "expected"],
    generate: (ctx) => {
      const field = BOUNDARY_FIELDS[String(ctx.options.field ?? "age")] ?? BOUNDARY_FIELDS.age;
      const mid = Math.round((field.min + field.max) / 2);
      const cases = [
        { partitionClass: "Below valid range", sampleValue: field.min - randInt(1, 10), expected: "Invalid" },
        { partitionClass: "Within valid range", sampleValue: mid, expected: "Valid" },
        { partitionClass: "Above valid range", sampleValue: field.max + randInt(1, 10), expected: "Invalid" },
        { partitionClass: "Invalid type (non-numeric)", sampleValue: "abc", expected: "Invalid" },
      ];
      return cases[ctx.index % cases.length];
    },
  },
  {
    slug: "negative-test-data",
    name: "Negative Test Data Generator",
    category: "qa",
    description: "Deliberately malformed inputs across common field types (string, number, date, email).",
    outputKind: "table",
    supportsBulk: true,
    defaultCount: 10,
    generate: (ctx) => {
      const cases = [
        { fieldType: "string", value: "", issue: "Empty when required" },
        { fieldType: "string", value: " ", issue: "Whitespace only" },
        { fieldType: "number", value: "NaN", issue: "Non-numeric text in number field" },
        { fieldType: "number", value: -1, issue: "Negative where only positive allowed" },
        { fieldType: "date", value: "31/02/2026", issue: "Impossible calendar date" },
        { fieldType: "date", value: "not-a-date", issue: "Non-date text" },
        { fieldType: "email", value: "user@", issue: "Incomplete email" },
        { fieldType: "enum", value: "INVALID_STATUS", issue: "Value outside allowed enum set" },
        { fieldType: "boolean", value: "maybe", issue: "Non-boolean text" },
        { fieldType: "array", value: "[1,2,", issue: "Malformed/truncated JSON array" },
      ];
      return cases[ctx.index % cases.length];
    },
  },
  {
    slug: "edge-case-values",
    name: "Edge Case Value Generator",
    category: "qa",
    description: "Empty, null, undefined, zero, negative, decimal, min/max integer, large text, mixed unicode, and whitespace variants.",
    outputKind: "table",
    supportsBulk: true,
    defaultCount: 12,
    maxCount: 12,
    columns: ["case", "value"],
    generate: (ctx) => {
      const cases: { case: string; value: unknown }[] = [
        { case: "Empty string", value: "" },
        { case: "Null", value: null },
        { case: "Undefined", value: undefined },
        { case: "Zero", value: 0 },
        { case: "Negative number", value: -randInt(1, 999999) },
        { case: "Decimal number", value: Number((Math.random() * 1000).toFixed(6)) },
        { case: "Max safe integer", value: Number.MAX_SAFE_INTEGER },
        { case: "Min safe integer", value: Number.MIN_SAFE_INTEGER },
        { case: "Very large text (5000 chars)", value: randomLongString(5000) },
        { case: "Mixed unicode", value: `${pick(UNICODE_SAMPLES)}${pick(EMOJI_SAMPLES)}Test123` },
        { case: "Leading/trailing whitespace", value: "   padded value   " },
        { case: "Tabs and newlines", value: "line1\n\tline2\r\nline3" },
      ];
      const c = cases[ctx.index % cases.length];
      return { case: c.case, value: c.value === undefined ? "undefined" : c.value === null ? "null" : c.value };
    },
  },
  {
    slug: "equivalence-invalid-input",
    name: "Invalid Input Generator (Type Confusion)",
    category: "qa",
    description: "Wrong-type values submitted to fields expecting a specific type — useful for schema/type validation tests.",
    outputKind: "table",
    supportsBulk: true,
    defaultCount: 8,
    maxCount: 8,
    columns: ["expectedType", "actualValue", "actualType"],
    generate: (ctx) => {
      const cases = [
        { expectedType: "number", actualValue: '"123"', actualType: "string" },
        { expectedType: "string", actualValue: "12345", actualType: "number" },
        { expectedType: "boolean", actualValue: '"true"', actualType: "string" },
        { expectedType: "array", actualValue: '{"a":1}', actualType: "object" },
        { expectedType: "object", actualValue: "[1,2,3]", actualType: "array" },
        { expectedType: "date", actualValue: "1234567890", actualType: "number (unix ts as string?)" },
        { expectedType: "integer", actualValue: "3.14", actualType: "float" },
        { expectedType: "string", actualValue: "null", actualType: "null" },
      ];
      return cases[ctx.index % cases.length];
    },
  },
  {
    slug: "whitespace-variants",
    name: "Whitespace Variant Generator",
    category: "qa",
    description: "Different whitespace/blank patterns to test trimming and required-field validation.",
    outputKind: "table",
    supportsBulk: true,
    defaultCount: 8,
    maxCount: 8,
    columns: ["label", "value"],
    generate: (ctx) => {
      const cases = [
        { label: "Empty string", value: "" },
        { label: "Single space", value: " " },
        { label: "Multiple spaces", value: repeatChar(" ", 10) },
        { label: "Tab character", value: "\t" },
        { label: "Newline only", value: "\n" },
        { label: "Non-breaking space", value: " " },
        { label: "Zero-width space", value: "​" },
        { label: "Leading + trailing spaces around text", value: "   text   " },
      ];
      return cases[ctx.index % cases.length];
    },
  },
];
