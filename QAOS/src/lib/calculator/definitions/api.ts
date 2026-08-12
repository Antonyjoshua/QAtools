import { FileJson, Layers, Percent, KeyRound as TokenIcon, Clock3 } from "lucide-react";
import type { CalculatorDef, CalculatorOutcome } from "../types";
import { formatNumber, formatPercent, round2 } from "../format";

function pct(v: number) {
  return formatPercent(round2(Number.isFinite(v) ? v : 0));
}
function num(v: number, decimals = 2) {
  return formatNumber(round2(Number.isFinite(v) ? v : 0), decimals);
}

function byteSize(str: string): number {
  return new TextEncoder().encode(str).length;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 ** 2) return `${num(bytes / 1024)} KB`;
  return `${num(bytes / 1024 ** 2)} MB`;
}

/* ---------------------------------- JSON Size ---------------------------------- */

const jsonSizeCalculator: CalculatorDef = {
  id: "json-size-calculator",
  slug: "json-size-calculator",
  name: "JSON Size Calculator",
  category: "api",
  description: "Validate JSON and measure its byte size, minified vs pretty-printed.",
  icon: FileJson,
  keywords: ["json size", "payload size", "api testing"],
  formulaExplanation: "Size (bytes) = UTF-8 byte length of the JSON text. Minified size re-serializes with no whitespace.",
  fields: [{ id: "input", label: "JSON Text", kind: "text", multiline: true }],
  compute: (_v, raw): CalculatorOutcome => {
    const text = raw.input ?? "";
    const notes: string[] = [];
    let keyCount = 0;
    let minifiedSize = byteSize(text);
    let isValid = true;
    try {
      const parsed = JSON.parse(text);
      minifiedSize = byteSize(JSON.stringify(parsed));
      const countKeys = (obj: unknown): number => {
        if (obj && typeof obj === "object") {
          if (Array.isArray(obj)) return obj.reduce((acc: number, item) => acc + countKeys(item), 0);
          return Object.keys(obj).reduce(
            (acc, k) => acc + 1 + countKeys((obj as Record<string, unknown>)[k]),
            0
          );
        }
        return 0;
      };
      keyCount = countKeys(parsed);
    } catch {
      isValid = false;
      notes.push("This isn't valid JSON — size is measured on the raw text.");
    }

    const rawSize = byteSize(text);

    return {
      steps: [
        { label: "Raw Size", formula: "UTF-8 byte length", value: formatBytes(rawSize) },
        { label: "Minified Size", formula: "Re-serialized with no whitespace", value: formatBytes(minifiedSize) },
      ],
      summary: [
        { label: "Raw Size", value: formatBytes(rawSize), highlight: true },
        { label: "Minified Size", value: formatBytes(minifiedSize) },
        { label: "Valid JSON", value: isValid ? "Yes" : "No", tone: isValid ? "positive" : "negative" },
        ...(isValid ? [{ label: "Key Count", value: num(keyCount, 0) }] : []),
      ],
      notes,
    };
  },
};

/* -------------------------------- Payload Size -------------------------------- */

const payloadSizeCalculator: CalculatorDef = {
  id: "payload-size-calculator",
  slug: "payload-size-calculator",
  name: "Payload Size Calculator",
  category: "api",
  description: "Measure the byte size of any request or response payload text.",
  icon: Layers,
  keywords: ["payload size", "request body", "response body"],
  formulaExplanation: "Size = UTF-8 byte length of the payload text.",
  fields: [{ id: "input", label: "Payload Text", kind: "text", multiline: true }],
  compute: (_v, raw): CalculatorOutcome => {
    const size = byteSize(raw.input ?? "");
    return {
      steps: [{ label: "Payload Size", formula: "UTF-8 byte length", value: formatBytes(size) }],
      summary: [
        { label: "Payload Size", value: formatBytes(size), highlight: true },
        { label: "Characters", value: num((raw.input ?? "").length, 0) },
      ],
    };
  },
};

/* ------------------------------- Compression Ratio ------------------------------- */

const compressionRatioCalculator: CalculatorDef = {
  id: "compression-ratio-calculator",
  slug: "compression-ratio-calculator",
  name: "Compression Ratio Calculator",
  category: "api",
  description: "Compression ratio and space saved between an original and compressed payload.",
  icon: Percent,
  keywords: ["compression ratio", "gzip", "space saved"],
  formulaExplanation: "Ratio = Original Size ÷ Compressed Size. Space Saved % = (1 − Compressed ÷ Original) × 100.",
  fields: [
    { id: "originalBytes", label: "Original Size (bytes)", kind: "number", allowDecimal: true, allowZero: false },
    { id: "compressedBytes", label: "Compressed Size (bytes)", kind: "number", allowDecimal: true, allowZero: false },
  ],
  compute: (v): CalculatorOutcome => {
    const ratio = v.originalBytes / v.compressedBytes;
    const spaceSaved = (1 - v.compressedBytes / v.originalBytes) * 100;
    return {
      steps: [
        { label: "Compression Ratio", formula: "Original ÷ Compressed", value: `${num(ratio)} : 1` },
        { label: "Space Saved %", formula: "(1 − Compressed ÷ Original) × 100", value: pct(spaceSaved) },
      ],
      summary: [
        { label: "Compression Ratio", value: `${num(ratio)} : 1`, highlight: true },
        { label: "Space Saved", value: pct(spaceSaved), tone: spaceSaved >= 0 ? "positive" : "negative" },
      ],
    };
  },
};

/* ---------------------------------- JWT Decoder ---------------------------------- */

function base64UrlDecode(input: string): string {
  const padded = input.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(input.length / 4) * 4, "=");
  return decodeURIComponent(escape(atob(padded)));
}

const jwtDecoderCalculator: CalculatorDef = {
  id: "jwt-decoder",
  slug: "jwt-decoder",
  name: "JWT Decoder",
  category: "api",
  description: "Decode a JWT's header and payload — no signature verification.",
  icon: TokenIcon,
  keywords: ["jwt", "jwt decoder", "token decoder", "security"],
  formulaExplanation: "A JWT is base64url-encoded header.payload.signature — this decodes header and payload only; the signature is not verified.",
  fields: [{ id: "input", label: "JWT Token", kind: "text", multiline: true, placeholder: "eyJ...header.eyJ...payload.signature" }],
  compute: (_v, raw): CalculatorOutcome => {
    const token = (raw.input ?? "").trim();
    const parts = token.split(".");
    const notes: string[] = [];

    if (parts.length !== 3) {
      notes.push("This doesn't look like a JWT — expected 3 dot-separated parts (header.payload.signature).");
      return { steps: [], summary: [{ label: "Result", value: "Invalid JWT format" }], notes };
    }

    let header = "";
    let payload = "";
    let expiryNote = "";
    try {
      header = JSON.stringify(JSON.parse(base64UrlDecode(parts[0])), null, 2);
      const payloadObj = JSON.parse(base64UrlDecode(parts[1]));
      payload = JSON.stringify(payloadObj, null, 2);
      if (typeof payloadObj.exp === "number") {
        const expDate = new Date(payloadObj.exp * 1000);
        expiryNote = expDate.getTime() < Date.now() ? `Expired at ${expDate.toLocaleString()}` : `Valid until ${expDate.toLocaleString()}`;
      }
    } catch {
      notes.push("Couldn't decode this token — check it's a valid base64url JWT.");
      return { steps: [], summary: [{ label: "Result", value: "Could not decode" }], notes };
    }

    return {
      steps: [
        { label: "Header", formula: "base64url-decode(part 1)", value: header },
        { label: "Payload", formula: "base64url-decode(part 2)", value: payload },
      ],
      summary: [
        { label: "Header", value: header },
        { label: "Payload", value: payload, highlight: true },
        ...(expiryNote ? [{ label: "Expiry", value: expiryNote, tone: expiryNote.startsWith("Expired") ? ("negative" as const) : ("positive" as const) }] : []),
      ],
      notes: ["Signature is not verified — this only decodes the token contents.", ...notes],
    };
  },
};

/* ------------------------------- Timestamp Converter ------------------------------- */

const timestampConverterCalculator: CalculatorDef = {
  id: "timestamp-converter",
  slug: "timestamp-converter",
  name: "Timestamp Converter",
  category: "api",
  description: "Convert a Unix timestamp to a date, or a date to a Unix timestamp.",
  icon: Clock3,
  keywords: ["timestamp converter", "unix timestamp", "epoch"],
  formulaExplanation: "Date = Epoch + Timestamp (seconds). Timestamp = (Date − Epoch) ÷ 1000, in seconds.",
  fields: [
    { id: "timestamp", label: "Unix Timestamp (seconds, optional)", kind: "number", allowDecimal: false, allowZero: true, allowNegative: true, optional: true, defaultValue: "" },
    { id: "date", label: "Date (optional)", kind: "date", optional: true },
    { id: "time", label: "Time (optional)", kind: "time", optional: true, defaultValue: "00:00" },
  ],
  compute: (v, raw): CalculatorOutcome => {
    const notes: string[] = [];
    const summary: { label: string; value: string; highlight?: boolean }[] = [];
    const steps: { label: string; formula: string; value: string }[] = [];

    if (raw.timestamp && raw.timestamp.trim() !== "") {
      const date = new Date(v.timestamp * 1000);
      steps.push({ label: "Date (UTC)", formula: "new Date(timestamp × 1000)", value: date.toUTCString() });
      summary.push({ label: "Date (Local)", value: date.toLocaleString(), highlight: true });
      summary.push({ label: "Date (ISO)", value: date.toISOString() });
    }

    if (raw.date) {
      const time = raw.time || "00:00";
      const d = new Date(`${raw.date}T${time}:00`);
      const ts = Math.floor(d.getTime() / 1000);
      steps.push({ label: "Unix Timestamp", formula: "(Date − Epoch) ÷ 1000", value: `${ts}` });
      summary.push({ label: "Unix Timestamp", value: `${ts}`, highlight: !raw.timestamp });
    }

    if (summary.length === 0) notes.push("Enter either a timestamp or a date to convert.");

    return { steps, summary, notes };
  },
};

export const apiCalculators: CalculatorDef[] = [
  jsonSizeCalculator,
  payloadSizeCalculator,
  compressionRatioCalculator,
  jwtDecoderCalculator,
  timestampConverterCalculator,
];
