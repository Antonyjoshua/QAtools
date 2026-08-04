import { FileJson, GitCompare, FileCode, FileSpreadsheet, FunctionSquare, FileSearch, Fingerprint } from "lucide-react";
import type { CalculatorDef, CalculatorOutcome } from "../types";
import { formatNumber, round2 } from "../format";
import { sha256Hex } from "../hash";

function num(v: number, decimals = 0) {
  return formatNumber(round2(Number.isFinite(v) ? v : 0), decimals);
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${num(bytes / 1024, 2)} KB`;
  return `${num(bytes / 1024 ** 2, 2)} MB`;
}

/* ---------------------------------- JSON Formatter ---------------------------------- */

const jsonFormatterCalculator: CalculatorDef = {
  id: "json-formatter",
  slug: "json-formatter",
  name: "JSON Formatter",
  category: "file-utils",
  description: "Pretty-print and validate JSON with 2-space indentation.",
  icon: FileJson,
  keywords: ["json formatter", "json beautify", "json validate"],
  formulaExplanation: "Parses the input with JSON.parse and re-serializes with 2-space indentation.",
  fields: [{ id: "input", label: "JSON Text", kind: "text", multiline: true }],
  compute: (_v, raw): CalculatorOutcome => {
    try {
      const parsed = JSON.parse(raw.input ?? "");
      const formatted = JSON.stringify(parsed, null, 2);
      return {
        steps: [{ label: "Formatted", formula: "JSON.stringify(parsed, null, 2)", value: formatted }],
        summary: [
          { label: "Valid JSON", value: "Yes", tone: "positive" },
          { label: "Formatted Output", value: formatted, highlight: true },
        ],
      };
    } catch (e) {
      return {
        steps: [],
        summary: [{ label: "Valid JSON", value: "No", tone: "negative" }],
        notes: [e instanceof Error ? e.message : "Invalid JSON"],
      };
    }
  },
};

/* ---------------------------------- JSON Compare ---------------------------------- */

function diffPaths(a: unknown, b: unknown, path = "root", out: string[] = []): string[] {
  if (JSON.stringify(a) === JSON.stringify(b)) return out;
  if (
    typeof a === "object" &&
    typeof b === "object" &&
    a !== null &&
    b !== null &&
    !Array.isArray(a) &&
    !Array.isArray(b)
  ) {
    const keys = new Set([...Object.keys(a as object), ...Object.keys(b as object)]);
    for (const key of keys) {
      diffPaths((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key], `${path}.${key}`, out);
    }
  } else {
    out.push(path);
  }
  return out;
}

const jsonCompareCalculator: CalculatorDef = {
  id: "json-compare",
  slug: "json-compare",
  name: "JSON Compare",
  category: "file-utils",
  description: "Deep-compare two JSON documents and list the paths that differ.",
  icon: GitCompare,
  keywords: ["json compare", "json diff"],
  formulaExplanation: "Recursively compares both objects key by key and collects the dot-paths where values differ.",
  fields: [
    { id: "inputA", label: "JSON A", kind: "text", multiline: true },
    { id: "inputB", label: "JSON B", kind: "text", multiline: true },
  ],
  compute: (_v, raw): CalculatorOutcome => {
    try {
      const a = JSON.parse(raw.inputA ?? "");
      const b = JSON.parse(raw.inputB ?? "");
      const diffs = diffPaths(a, b);

      return {
        steps: diffs.map((d, i) => ({ label: `Difference ${i + 1}`, formula: "Path with differing value", value: d })),
        summary: [
          { label: "Identical", value: diffs.length === 0 ? "Yes" : "No", highlight: true, tone: diffs.length === 0 ? "positive" : "negative" },
          { label: "Differences", value: diffs.length === 0 ? "None" : diffs.join(", ") },
        ],
      };
    } catch (e) {
      return { steps: [], summary: [{ label: "Result", value: "Invalid JSON in A or B" }], notes: [e instanceof Error ? e.message : "Parse error"] };
    }
  },
};

/* ---------------------------------- XML Formatter ---------------------------------- */

function formatXml(xml: string): string {
  const withBreaks = xml.replace(/></g, ">\n<").trim();
  const lines = withBreaks.split("\n");
  let depth = 0;
  const out: string[] = [];
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;
    const isClosing = /^<\//.test(line);
    const isSelfClosing = /\/>$/.test(line);
    const isDeclaration = /^<\?/.test(line);
    if (isClosing) depth = Math.max(0, depth - 1);
    out.push("  ".repeat(depth) + line);
    if (!isClosing && !isSelfClosing && !isDeclaration && /^<[^/!]/.test(line)) depth += 1;
  }
  return out.join("\n");
}

const xmlFormatterCalculator: CalculatorDef = {
  id: "xml-formatter",
  slug: "xml-formatter",
  name: "XML Formatter",
  category: "file-utils",
  description: "Pretty-print XML with indentation based on tag nesting.",
  icon: FileCode,
  keywords: ["xml formatter", "xml beautify"],
  formulaExplanation: "Inserts a line break between tags and indents each line by its nesting depth.",
  fields: [{ id: "input", label: "XML Text", kind: "text", multiline: true }],
  compute: (_v, raw): CalculatorOutcome => {
    const input = raw.input ?? "";
    const openTags = (input.match(/<[^/!?][^>]*(?<!\/)>/g) ?? []).length;
    const closeTags = (input.match(/<\/[^>]+>/g) ?? []).length;
    const formatted = formatXml(input);

    return {
      steps: [{ label: "Formatted", formula: "Indent by nesting depth", value: formatted }],
      summary: [
        { label: "Formatted Output", value: formatted, highlight: true },
        { label: "Tag Balance", value: openTags === closeTags ? "Balanced" : `Mismatched (${openTags} open / ${closeTags} close)`, tone: openTags === closeTags ? "positive" : "negative" },
      ],
    };
  },
};

/* ---------------------------------- XML Compare ---------------------------------- */

function normalizeXml(xml: string): string {
  return xml.replace(/>\s+</g, "><").replace(/\s+/g, " ").trim();
}

const xmlCompareCalculator: CalculatorDef = {
  id: "xml-compare",
  slug: "xml-compare",
  name: "XML Compare",
  category: "file-utils",
  description: "Compare two XML documents after normalizing whitespace.",
  icon: GitCompare,
  keywords: ["xml compare", "xml diff"],
  formulaExplanation: "Both inputs are whitespace-normalized, then compared for exact equality; the first differing index is reported.",
  fields: [
    { id: "inputA", label: "XML A", kind: "text", multiline: true },
    { id: "inputB", label: "XML B", kind: "text", multiline: true },
  ],
  compute: (_v, raw): CalculatorOutcome => {
    const a = normalizeXml(raw.inputA ?? "");
    const b = normalizeXml(raw.inputB ?? "");
    const identical = a === b;
    let firstDiffIndex = -1;
    if (!identical) {
      const len = Math.min(a.length, b.length);
      for (let i = 0; i < len; i++) {
        if (a[i] !== b[i]) {
          firstDiffIndex = i;
          break;
        }
      }
      if (firstDiffIndex === -1) firstDiffIndex = len;
    }

    return {
      steps: [{ label: "Identical", formula: "normalize(A) === normalize(B)", value: identical ? "Yes" : "No" }],
      summary: [
        { label: "Identical", value: identical ? "Yes" : "No", highlight: true, tone: identical ? "positive" : "negative" },
        ...(identical ? [] : [{ label: "First Difference Near", value: a.slice(Math.max(0, firstDiffIndex - 20), firstDiffIndex + 20) || "(end of shorter document)" }]),
      ],
    };
  },
};

/* ---------------------------------- CSV Validator ---------------------------------- */

const csvValidatorCalculator: CalculatorDef = {
  id: "csv-validator",
  slug: "csv-validator",
  name: "CSV Validator",
  category: "file-utils",
  description: "Check that every row in a CSV has the same number of columns as the header.",
  icon: FileSpreadsheet,
  keywords: ["csv validator", "csv check"],
  formulaExplanation: "Splits each line on commas (respecting quoted fields) and compares column counts to the header row.",
  fields: [{ id: "input", label: "CSV Text", kind: "text", multiline: true }],
  compute: (_v, raw): CalculatorOutcome => {
    const lines = (raw.input ?? "").split(/\r?\n/).filter((l) => l.length > 0);
    if (lines.length === 0) {
      return { steps: [], summary: [{ label: "Result", value: "No data" }], notes: ["Paste some CSV text."] };
    }

    const splitCsvLine = (line: string) => line.match(/(?:"[^"]*"|[^,])+/g) ?? [];
    const headerCols = splitCsvLine(lines[0]).length;
    const malformedRows: number[] = [];
    lines.slice(1).forEach((line, i) => {
      if (splitCsvLine(line).length !== headerCols) malformedRows.push(i + 2);
    });

    return {
      steps: [
        { label: "Header Columns", formula: "Count of columns in row 1", value: num(headerCols) },
        { label: "Total Rows", formula: "Non-empty lines", value: num(lines.length) },
      ],
      summary: [
        { label: "Valid", value: malformedRows.length === 0 ? "Yes" : "No", highlight: true, tone: malformedRows.length === 0 ? "positive" : "negative" },
        { label: "Columns", value: num(headerCols) },
        { label: "Data Rows", value: num(lines.length - 1) },
        { label: "Malformed Rows", value: malformedRows.length === 0 ? "None" : malformedRows.join(", ") },
      ],
    };
  },
};

/* ---------------------------------- Excel Formula Checker ---------------------------------- */

const excelFormulaCalculator: CalculatorDef = {
  id: "excel-formula-checker",
  slug: "excel-formula-checker",
  name: "Excel Formula Checker",
  category: "file-utils",
  description: "Basic syntax sanity check for an Excel/Sheets formula — not a full formula engine.",
  icon: FunctionSquare,
  keywords: ["excel formula", "formula checker", "spreadsheet"],
  formulaExplanation: "Checks for a leading '=', balanced parentheses, and a plausible function-name pattern.",
  fields: [{ id: "input", label: "Formula", kind: "text", placeholder: "=SUM(A1:A10)" }],
  compute: (_v, raw): CalculatorOutcome => {
    const formula = (raw.input ?? "").trim();
    const issues: string[] = [];

    if (!formula.startsWith("=")) issues.push("Formula should start with '='.");
    let depth = 0;
    for (const ch of formula) {
      if (ch === "(") depth++;
      if (ch === ")") depth--;
      if (depth < 0) {
        issues.push("Unbalanced parentheses — a ')' appears before its matching '('.");
        break;
      }
    }
    if (depth > 0) issues.push(`${depth} unclosed parenthesis/es.`);
    if (formula.length > 1 && !/^=[A-Za-z0-9_.\s+\-*/^%(),:"'!$<>=&]*$/.test(formula)) {
      issues.push("Contains characters that aren't typically valid in a formula.");
    }

    const isValid = issues.length === 0 && formula.length > 1;

    return {
      steps: [{ label: "Syntax Check", formula: "Leading '=', balanced parens, valid charset", value: isValid ? "Pass" : "Issues found" }],
      summary: [{ label: "Result", value: isValid ? "Looks valid" : "Has issues", highlight: true, tone: isValid ? "positive" : "negative" }],
      notes: issues.length > 0 ? issues : ["This only checks basic syntax — it doesn't verify cell references or function arguments."],
    };
  },
};

/* ---------------------------------- PDF Page Counter ---------------------------------- */

const pdfPageCounterCalculator: CalculatorDef = {
  id: "pdf-page-counter",
  slug: "pdf-page-counter",
  name: "PDF Page Counter",
  category: "file-utils",
  description: "Count pages in a PDF by scanning its internal page-object markers.",
  icon: FileSearch,
  keywords: ["pdf page counter", "pdf pages"],
  formulaExplanation: "Counts occurrences of the '/Type /Page' object marker in the raw PDF bytes.",
  fields: [
    {
      id: "file",
      label: "PDF File",
      kind: "file",
      accept: "application/pdf",
      onFileLoad: async (file) => {
        const buffer = await file.arrayBuffer();
        const bytes = new Uint8Array(buffer);
        let binary = "";
        for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
        const matches = binary.match(/\/Type\s*\/Page(?!s)/g) ?? [];
        return { pageCount: String(matches.length), fileSize: String(file.size) };
      },
    },
  ],
  compute: (_v, raw): CalculatorOutcome => {
    if (!raw.pageCount) {
      return { steps: [], summary: [{ label: "Result", value: "Choose a PDF file" }] };
    }
    const pageCount = parseInt(raw.pageCount, 10);
    const size = parseInt(raw.fileSize ?? "0", 10);

    return {
      steps: [{ label: "Page Count", formula: "Count of '/Type /Page' markers", value: num(pageCount) }],
      summary: [
        { label: "Page Count", value: num(pageCount), highlight: true },
        { label: "File Size", value: formatBytes(size) },
      ],
      notes: ["Estimated by scanning raw PDF structure — unusual PDF encodings (e.g. heavily compressed object streams) may undercount."],
    };
  },
};

/* ---------------------------------- File Hash Generator ---------------------------------- */

const fileHashCalculator: CalculatorDef = {
  id: "file-hash-generator",
  slug: "file-hash-generator",
  name: "File Hash Generator",
  category: "file-utils",
  description: "Compute the SHA-256 checksum of any file, entirely in your browser.",
  icon: Fingerprint,
  keywords: ["file hash", "checksum", "sha256"],
  formulaExplanation: "SHA-256 is computed over the file's raw bytes using the browser's native Web Crypto API.",
  fields: [
    {
      id: "file",
      label: "File",
      kind: "file",
      onFileLoad: async (file) => {
        const buffer = await file.arrayBuffer();
        const hash = await sha256Hex(buffer);
        return { sha256: hash, fileSize: String(file.size) };
      },
    },
  ],
  compute: (_v, raw): CalculatorOutcome => {
    if (!raw.sha256) {
      return { steps: [], summary: [{ label: "Result", value: "Choose a file" }] };
    }
    return {
      steps: [{ label: "SHA-256", formula: "crypto.subtle.digest('SHA-256', file bytes)", value: raw.sha256 }],
      summary: [
        { label: "SHA-256", value: raw.sha256, highlight: true },
        { label: "File Size", value: formatBytes(parseInt(raw.fileSize ?? "0", 10)) },
      ],
    };
  },
};

export const fileUtilsCalculators: CalculatorDef[] = [
  jsonFormatterCalculator,
  jsonCompareCalculator,
  xmlFormatterCalculator,
  xmlCompareCalculator,
  csvValidatorCalculator,
  excelFormulaCalculator,
  pdfPageCounterCalculator,
  fileHashCalculator,
];
