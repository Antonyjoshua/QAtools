import * as yaml from "js-yaml";
import type { ConversionAdapter, ConversionRequest, ConversionResult, ProgressCallback } from "../core/types";
import type { TextDataConversionOptions } from "./text-data-adapter";

// ---------------------------------------------------------------------------
// CSV
// ---------------------------------------------------------------------------

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else inQuotes = false;
      } else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      field = "";
      if (row.length > 1 || row[0] !== "") rows.push(row);
      row = [];
    } else field += c;
  }
  if (field !== "" || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

function csvCell(value: unknown): string {
  const s = value === null || value === undefined ? "" : typeof value === "object" ? JSON.stringify(value) : String(value);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function csvToJson(text: string): unknown[] {
  const rows = parseCsv(text);
  if (rows.length === 0) return [];
  const [headers, ...body] = rows;
  return body.map((row) => Object.fromEntries(headers.map((h, i) => [h, row[i] ?? ""])));
}

function jsonToCsv(value: unknown): string {
  if (!Array.isArray(value)) throw new Error("json-must-be-array");
  const headers = Array.from(new Set(value.flatMap((row) => (row && typeof row === "object" ? Object.keys(row) : []))));
  const lines = [headers.map(csvCell).join(",")];
  for (const row of value) {
    const record = (row ?? {}) as Record<string, unknown>;
    lines.push(headers.map((h) => csvCell(record[h])).join(","));
  }
  return lines.join("\r\n");
}

// ---------------------------------------------------------------------------
// XML
// ---------------------------------------------------------------------------

function escapeXml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function buildXmlNode(name: string, value: unknown): string {
  if (value === null || value === undefined) return `<${name}/>`;
  if (Array.isArray(value)) return value.map((item) => buildXmlNode(name, item)).join("");
  if (typeof value === "object") {
    const inner = Object.entries(value as Record<string, unknown>)
      .map(([k, v]) => buildXmlNode(k, v))
      .join("");
    return `<${name}>${inner}</${name}>`;
  }
  return `<${name}>${escapeXml(String(value))}</${name}>`;
}

function jsonToXml(value: unknown): string {
  return `<?xml version="1.0" encoding="UTF-8"?>\n${buildXmlNode("root", value)}`;
}

function elementToJson(el: Element): unknown {
  const children = Array.from(el.children);
  if (children.length === 0) return el.textContent?.trim() ?? "";
  const result: Record<string, unknown> = {};
  for (const child of children) {
    const value = elementToJson(child);
    const existing = result[child.tagName];
    if (existing !== undefined) {
      result[child.tagName] = Array.isArray(existing) ? [...existing, value] : [existing, value];
    } else {
      result[child.tagName] = value;
    }
  }
  return result;
}

function xmlToJson(text: string): unknown {
  const doc = new DOMParser().parseFromString(text, "application/xml");
  if (doc.querySelector("parsererror")) throw new Error("invalid-xml");
  return elementToJson(doc.documentElement);
}

// ---------------------------------------------------------------------------
// Adapter
// ---------------------------------------------------------------------------

function baseName(fileName: string): string {
  return fileName.replace(/\.[^.]+$/, "");
}

export const textDataAdapter: ConversionAdapter = {
  id: "text-data",
  async convert(request: ConversionRequest, onProgress: ProgressCallback): Promise<ConversionResult> {
    const start = Date.now();
    const file = request.files[0];
    const options = (request.options ?? {}) as TextDataConversionOptions;

    try {
      onProgress({ stage: "processing", percent: 15, message: "Reading file…" });
      const text = await file.text();

      onProgress({ stage: "converting", percent: 55, message: "Converting…" });
      let outputText: string;
      const pair = `${request.inputFormat}->${request.outputFormat}`;

      switch (pair) {
        case "csv->json":
          outputText = JSON.stringify(csvToJson(text), null, 2);
          break;
        case "json->csv":
          outputText = jsonToCsv(JSON.parse(text));
          break;
        case "json->xml":
          outputText = jsonToXml(JSON.parse(text));
          break;
        case "xml->json":
          outputText = JSON.stringify(xmlToJson(text), null, 2);
          break;
        case "yaml->json":
          outputText = JSON.stringify(yaml.load(text), null, 2);
          break;
        case "json->yaml":
          outputText = yaml.dump(JSON.parse(text));
          break;
        case "json->json":
          outputText = options.mode === "minify" ? JSON.stringify(JSON.parse(text)) : JSON.stringify(JSON.parse(text), null, 2);
          break;
        default:
          throw new Error("unsupported-conversion");
      }

      onProgress({ stage: "finalizing", percent: 90 });
      const mime = request.outputFormat === "json" ? "application/json" : request.outputFormat === "xml" ? "application/xml" : request.outputFormat === "yaml" ? "text/yaml" : "text/csv";
      const blob = new Blob([outputText], { type: mime });
      onProgress({ stage: "completed", percent: 100 });
      return {
        success: true,
        outputs: [{ name: `${baseName(file.name)}.${request.outputFormat}`, blob, format: request.outputFormat }],
        durationMs: Date.now() - start,
      };
    } catch (err) {
      const isParseError = err instanceof SyntaxError || (err instanceof Error && err.message === "invalid-xml");
      return {
        success: false,
        outputs: [],
        durationMs: Date.now() - start,
        error: isParseError
          ? { code: "corrupted-file", message: `This file isn't valid ${request.inputFormat.toUpperCase()} — check the syntax and try again.` }
          : { code: "unknown", message: "Couldn't complete this conversion. Please check the file and try again." },
      };
    }
  },
};
