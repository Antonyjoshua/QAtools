import { ShieldCheck, Hash, Link2, Code2, Database } from "lucide-react";
import type { CalculatorDef, CalculatorOutcome } from "../types";
import { formatNumber, round2 } from "../format";
import { md5, sha256 } from "../hash";

function num(v: number, decimals = 1) {
  return formatNumber(round2(Number.isFinite(v) ? v : 0), decimals);
}

/* ----------------------------- Password Strength Checker ----------------------------- */

const passwordStrengthCalculator: CalculatorDef = {
  id: "password-strength-checker",
  slug: "password-strength-checker",
  name: "Password Strength Checker",
  category: "security",
  description: "Estimate password entropy and strength from length and character variety.",
  icon: ShieldCheck,
  keywords: ["password strength", "entropy", "security testing"],
  formulaExplanation: "Entropy (bits) = Length × log2(Character Set Size). Character set size grows with lowercase, uppercase, digits and symbols used.",
  fields: [{ id: "input", label: "Password", kind: "text" }],
  compute: (_v, raw): CalculatorOutcome => {
    const password = raw.input ?? "";
    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasDigit = /[0-9]/.test(password);
    const hasSymbol = /[^a-zA-Z0-9]/.test(password);

    let charsetSize = 0;
    if (hasLower) charsetSize += 26;
    if (hasUpper) charsetSize += 26;
    if (hasDigit) charsetSize += 10;
    if (hasSymbol) charsetSize += 32;

    const entropy = password.length > 0 && charsetSize > 0 ? password.length * Math.log2(charsetSize) : 0;
    const label = entropy >= 80 ? "Very Strong" : entropy >= 60 ? "Strong" : entropy >= 36 ? "Medium" : "Weak";
    const tone = entropy >= 60 ? "positive" : entropy >= 36 ? "default" : "negative";

    return {
      steps: [
        { label: "Character Set Size", formula: "Sum of character ranges used", value: `${charsetSize} chars` },
        { label: "Entropy", formula: "Length × log2(Charset Size)", value: `${num(entropy)} bits` },
      ],
      summary: [
        { label: "Strength", value: label, highlight: true, tone },
        { label: "Entropy", value: `${num(entropy)} bits` },
        { label: "Length", value: `${password.length} characters` },
      ],
      notes: password.length === 0 ? ["Type a password to analyze."] : [],
    };
  },
};

/* --------------------------------- Hash Generator --------------------------------- */

const hashGeneratorCalculator: CalculatorDef = {
  id: "hash-generator",
  slug: "hash-generator",
  name: "Hash Generator (MD5, SHA-256)",
  category: "security",
  description: "Generate MD5 and SHA-256 hashes of any text — useful for checksums and test fixtures.",
  icon: Hash,
  keywords: ["hash generator", "md5", "sha256", "checksum"],
  formulaExplanation: "MD5 (RFC 1321) and SHA-256 (FIPS 180-4) are computed client-side over the UTF-8 bytes of the input text.",
  fields: [{ id: "input", label: "Text", kind: "text", multiline: true }],
  compute: (_v, raw): CalculatorOutcome => {
    const text = raw.input ?? "";
    const md5Hex = md5(text);
    const sha256Hex = sha256(text);

    return {
      steps: [
        { label: "MD5", formula: "md5(text)", value: md5Hex },
        { label: "SHA-256", formula: "sha256(text)", value: sha256Hex },
      ],
      summary: [
        { label: "MD5", value: md5Hex, highlight: true },
        { label: "SHA-256", value: sha256Hex },
      ],
      notes: ["MD5 is not collision-resistant — use SHA-256 for anything security-sensitive."],
    };
  },
};

/* ------------------------------- URL Encoder/Decoder ------------------------------- */

const urlEncoderCalculator: CalculatorDef = {
  id: "url-encoder-decoder",
  slug: "url-encoder-decoder",
  name: "URL Encoder / Decoder",
  category: "security",
  description: "Percent-encode or decode text for safe use in URLs.",
  icon: Link2,
  keywords: ["url encoder", "url decoder", "percent encoding"],
  formulaExplanation: "Encode: encodeURIComponent(text). Decode: decodeURIComponent(text).",
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
    { id: "input", label: "Text", kind: "text", multiline: true },
  ],
  compute: (_v, raw): CalculatorOutcome => {
    const notes: string[] = [];
    let result = "";
    try {
      result = raw.mode === "encode" ? encodeURIComponent(raw.input ?? "") : decodeURIComponent(raw.input ?? "");
    } catch {
      notes.push("Couldn't decode — this doesn't look like valid percent-encoded text.");
    }
    return {
      steps: [{ label: raw.mode === "encode" ? "Encoded" : "Decoded", formula: raw.mode === "encode" ? "encodeURIComponent(text)" : "decodeURIComponent(text)", value: result || "—" }],
      summary: [{ label: "Result", value: result || "—", highlight: true }],
      notes,
    };
  },
};

/* -------------------------------- HTML Encoder/Decoder -------------------------------- */

const HTML_ESCAPES: [RegExp, string][] = [
  [/&/g, "&amp;"],
  [/</g, "&lt;"],
  [/>/g, "&gt;"],
  [/"/g, "&quot;"],
  [/'/g, "&#39;"],
];
const HTML_UNESCAPES: [RegExp, string][] = [
  [/&amp;/g, "&"],
  [/&lt;/g, "<"],
  [/&gt;/g, ">"],
  [/&quot;/g, '"'],
  [/&#39;/g, "'"],
];

const htmlEncoderCalculator: CalculatorDef = {
  id: "html-encoder-decoder",
  slug: "html-encoder-decoder",
  name: "HTML Encoder / Decoder",
  category: "security",
  description: "Escape or unescape HTML entities — handy for XSS payload testing.",
  icon: Code2,
  keywords: ["html encoder", "html entities", "xss testing"],
  formulaExplanation: "Encode replaces & < > \" ' with their HTML entities. Decode reverses the replacement.",
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
    { id: "input", label: "Text", kind: "text", multiline: true },
  ],
  compute: (_v, raw): CalculatorOutcome => {
    const text = raw.input ?? "";
    const pairs = raw.mode === "encode" ? HTML_ESCAPES : HTML_UNESCAPES;
    const result = pairs.reduce((acc, [pattern, replacement]) => acc.replace(pattern, replacement), text);

    return {
      steps: [{ label: raw.mode === "encode" ? "Encoded" : "Decoded", formula: raw.mode === "encode" ? "Escape & < > \" '" : "Unescape entities", value: result || "—" }],
      summary: [{ label: "Result", value: result || "—", highlight: true }],
    };
  },
};

/* ---------------------------------- SQL Escape Helper ---------------------------------- */

const sqlEscapeCalculator: CalculatorDef = {
  id: "sql-escape-helper",
  slug: "sql-escape-helper",
  name: "SQL Escape Helper",
  category: "security",
  description: "Escape single quotes for quick manual SQL testing — not a substitute for parameterized queries.",
  icon: Database,
  keywords: ["sql escape", "sql injection testing"],
  formulaExplanation: "Doubles every single quote (') and wraps the result in quotes, matching standard SQL string-literal escaping.",
  fields: [{ id: "input", label: "Text", kind: "text", multiline: true }],
  compute: (_v, raw): CalculatorOutcome => {
    const text = raw.input ?? "";
    const escaped = text.replace(/'/g, "''");
    const literal = `'${escaped}'`;

    return {
      steps: [{ label: "Escaped Literal", formula: "Replace ' with ''", value: literal }],
      summary: [{ label: "SQL String Literal", value: literal, highlight: true }],
      notes: ["This is a manual-testing convenience only — always use parameterized queries / prepared statements in real code."],
    };
  },
};

export const securityCalculators: CalculatorDef[] = [
  passwordStrengthCalculator,
  hashGeneratorCalculator,
  urlEncoderCalculator,
  htmlEncoderCalculator,
  sqlEscapeCalculator,
];
