import { Ruler, HardDrive, Fingerprint, KeyRound, Binary } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import type { CalculatorDef, CalculatorOutcome } from "../types";
import { formatNumber } from "../format";

function num(v: number, decimals = 6) {
  return formatNumber(round2Dec(v, decimals), decimals);
}
function round2Dec(v: number, decimals: number) {
  const f = 10 ** decimals;
  return Math.round((v + Number.EPSILON) * f) / f;
}

/* ------------------------------ Unit Converter -------------------------------- */

const LENGTH_UNITS: Record<string, number> = {
  mm: 0.001,
  cm: 0.01,
  m: 1,
  km: 1000,
  in: 0.0254,
  ft: 0.3048,
  yd: 0.9144,
  mi: 1609.344,
};

const unitConverter: CalculatorDef = {
  id: "unit-converter",
  slug: "unit-converter",
  name: "Unit Converter (Length)",
  category: "utility",
  description: "Convert between millimetres, metres, kilometres, inches, feet, yards & miles.",
  icon: Ruler,
  keywords: ["unit converter", "length", "distance", "metric", "imperial"],
  formulaExplanation: "Result = Value × (From Unit factor ÷ To Unit factor), where each factor converts the unit to metres.",
  fields: [
    { id: "value", label: "Value", kind: "number", allowDecimal: true, allowZero: true },
    {
      id: "fromUnit",
      label: "From Unit",
      kind: "select",
      defaultValue: "m",
      options: Object.keys(LENGTH_UNITS).map((u) => ({ label: u, value: u })),
    },
    {
      id: "toUnit",
      label: "To Unit",
      kind: "select",
      defaultValue: "ft",
      options: Object.keys(LENGTH_UNITS).map((u) => ({ label: u, value: u })),
    },
  ],
  compute: (v, raw): CalculatorOutcome => {
    const from = LENGTH_UNITS[raw.fromUnit] ?? 1;
    const to = LENGTH_UNITS[raw.toUnit] ?? 1;
    const result = (v.value * from) / to;

    return {
      steps: [
        { label: "Value in Metres", formula: "Value × From Unit factor", value: num(v.value * from) },
        { label: "Result", formula: "Value in Metres ÷ To Unit factor", value: num(result) },
      ],
      summary: [
        { label: "Result", value: `${num(result)} ${raw.toUnit}`, highlight: true },
      ],
    };
  },
};

/* ---------------------------- File Size Converter ------------------------------ */

const SIZE_UNITS: Record<string, number> = {
  B: 1,
  KB: 1024,
  MB: 1024 ** 2,
  GB: 1024 ** 3,
  TB: 1024 ** 4,
};

const fileSizeConverter: CalculatorDef = {
  id: "file-size-converter",
  slug: "file-size-converter",
  name: "File Size Converter",
  category: "utility",
  description: "Convert between Bytes, KB, MB, GB and TB (base 1024).",
  icon: HardDrive,
  keywords: ["file size", "bytes", "kb", "mb", "gb", "tb", "storage"],
  formulaExplanation: "Result = Value × (From Unit factor ÷ To Unit factor), where each factor converts the unit to bytes (1024-based).",
  fields: [
    { id: "value", label: "Value", kind: "number", allowDecimal: true, allowZero: true },
    {
      id: "fromUnit",
      label: "From Unit",
      kind: "select",
      defaultValue: "MB",
      options: Object.keys(SIZE_UNITS).map((u) => ({ label: u, value: u })),
    },
    {
      id: "toUnit",
      label: "To Unit",
      kind: "select",
      defaultValue: "GB",
      options: Object.keys(SIZE_UNITS).map((u) => ({ label: u, value: u })),
    },
  ],
  compute: (v, raw): CalculatorOutcome => {
    const from = SIZE_UNITS[raw.fromUnit] ?? 1;
    const to = SIZE_UNITS[raw.toUnit] ?? 1;
    const result = (v.value * from) / to;

    return {
      steps: [
        { label: "Value in Bytes", formula: "Value × From Unit factor", value: num(v.value * from, 2) },
        { label: "Result", formula: "Value in Bytes ÷ To Unit factor", value: num(result) },
      ],
      summary: [{ label: "Result", value: `${num(result)} ${raw.toUnit}`, highlight: true }],
    };
  },
};

/* ------------------------------- UUID Generator --------------------------------- */

const uuidGenerator: CalculatorDef = {
  id: "uuid-generator",
  slug: "uuid-generator",
  name: "UUID Generator",
  category: "utility",
  description: "Generate one or more random UUID v4 identifiers for test data.",
  icon: Fingerprint,
  keywords: ["uuid", "guid", "identifier", "test data"],
  formulaExplanation: "Each UUID v4 is generated using 122 random bits per RFC 4122.",
  fields: [
    { id: "count", label: "How many?", kind: "number", allowDecimal: false, allowZero: false, defaultValue: "1", max: 50 },
  ],
  compute: (v): CalculatorOutcome => {
    const count = Math.min(Math.max(Math.round(v.count) || 1, 1), 50);
    const ids = Array.from({ length: count }, () => uuidv4());

    return {
      steps: [{ label: "Generated", formula: "crypto-random UUID v4", value: `${count} ID(s)` }],
      summary: ids.map((id, i) => ({ label: `UUID ${i + 1}`, value: id })),
    };
  },
};

/* ---------------------------- Password Generator --------------------------------- */

const UPPER = "ABCDEFGHJKLMNPQRSTUVWXYZ";
const LOWER = "abcdefghijkmnopqrstuvwxyz";
const DIGITS = "23456789";
const SYMBOLS = "!@#$%^&*()-_=+[]{}";

function randomChar(charset: string): string {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return charset[arr[0] % charset.length];
}

const passwordGenerator: CalculatorDef = {
  id: "password-generator",
  slug: "password-generator",
  name: "Password Generator",
  category: "utility",
  description: "Generate strong random passwords for test accounts and fixtures.",
  icon: KeyRound,
  keywords: ["password", "generator", "random", "test account"],
  formulaExplanation: "Each character is chosen uniformly at random from the selected character sets using a cryptographically secure RNG.",
  fields: [
    { id: "length", label: "Length", kind: "number", allowDecimal: false, allowZero: false, defaultValue: "16", min: 4, max: 64 },
    {
      id: "uppercase",
      label: "Include Uppercase (A-Z)",
      kind: "select",
      defaultValue: "yes",
      options: [
        { label: "Yes", value: "yes" },
        { label: "No", value: "no" },
      ],
    },
    {
      id: "lowercase",
      label: "Include Lowercase (a-z)",
      kind: "select",
      defaultValue: "yes",
      options: [
        { label: "Yes", value: "yes" },
        { label: "No", value: "no" },
      ],
    },
    {
      id: "numbers",
      label: "Include Numbers (0-9)",
      kind: "select",
      defaultValue: "yes",
      options: [
        { label: "Yes", value: "yes" },
        { label: "No", value: "no" },
      ],
    },
    {
      id: "symbols",
      label: "Include Symbols (!@#$)",
      kind: "select",
      defaultValue: "no",
      options: [
        { label: "Yes", value: "yes" },
        { label: "No", value: "no" },
      ],
    },
  ],
  compute: (v, raw): CalculatorOutcome => {
    let charset = "";
    if (raw.uppercase === "yes") charset += UPPER;
    if (raw.lowercase === "yes") charset += LOWER;
    if (raw.numbers === "yes") charset += DIGITS;
    if (raw.symbols === "yes") charset += SYMBOLS;

    const notes: string[] = [];
    if (!charset) {
      charset = LOWER + DIGITS;
      notes.push("No character set selected — defaulted to lowercase + numbers.");
    }

    const length = Math.min(Math.max(Math.round(v.length) || 16, 4), 64);
    const password = Array.from({ length }, () => randomChar(charset)).join("");

    let strength: "Weak" | "Medium" | "Strong" = "Weak";
    const variety = [raw.uppercase, raw.lowercase, raw.numbers, raw.symbols].filter((x) => x === "yes").length;
    if (length >= 12 && variety >= 3) strength = "Strong";
    else if (length >= 8 && variety >= 2) strength = "Medium";

    return {
      steps: [
        { label: "Character Set Size", formula: "Sum of selected character ranges", value: `${charset.length} chars` },
        { label: "Length", formula: "Requested length", value: `${length}` },
      ],
      summary: [
        { label: "Password", value: password, highlight: true },
        { label: "Strength", value: strength, tone: strength === "Strong" ? "positive" : strength === "Weak" ? "negative" : "default" },
      ],
      notes,
    };
  },
};

/* ------------------------------ Base64 Encode/Decode ------------------------------- */

const base64Tool: CalculatorDef = {
  id: "base64-tool",
  slug: "base64-encode-decode",
  name: "Base64 Encode / Decode",
  category: "utility",
  description: "Encode plain text to Base64 or decode a Base64 string back to text.",
  icon: Binary,
  keywords: ["base64", "encode", "decode"],
  formulaExplanation: "Encode: UTF-8 bytes → Base64. Decode: Base64 → UTF-8 bytes → text.",
  fields: [
    {
      id: "mode",
      label: "Mode",
      kind: "select",
      defaultValue: "encode",
      options: [
        { label: "Encode", value: "encode" },
        { label: "Decode", value: "decode" },
      ],
    },
    { id: "input", label: "Input Text", kind: "text", multiline: true },
  ],
  compute: (_v, raw): CalculatorOutcome => {
    const notes: string[] = [];
    let result = "";
    try {
      if (raw.mode === "encode") {
        result = btoa(unescape(encodeURIComponent(raw.input ?? "")));
      } else {
        result = decodeURIComponent(escape(atob((raw.input ?? "").trim())));
      }
    } catch {
      notes.push("Input is not valid Base64.");
    }

    return {
      steps: [{ label: raw.mode === "encode" ? "Encoded" : "Decoded", formula: raw.mode === "encode" ? "UTF-8 → Base64" : "Base64 → UTF-8", value: result || "—" }],
      summary: [{ label: "Result", value: result || "—", highlight: true }],
      notes,
    };
  },
};

export const utilityCalculators: CalculatorDef[] = [
  unitConverter,
  fileSizeConverter,
  uuidGenerator,
  passwordGenerator,
  base64Tool,
];
