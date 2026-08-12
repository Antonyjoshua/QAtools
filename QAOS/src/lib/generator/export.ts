import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { rowsToInsertStatements, type SqlDialect } from "./sql-utils";

export type Row = Record<string, unknown>;

function normalizeRows(rows: Row[]): { columns: string[]; rows: Row[] } {
  const columns = Array.from(rows.reduce((set, r) => {
    Object.keys(r).forEach((k) => set.add(k));
    return set;
  }, new Set<string>()));
  return { columns, rows };
}

function cellToText(value: unknown): string {
  if (value === null) return "null";
  if (value === undefined) return "";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

export function downloadBlob(content: BlobPart, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export async function copyToClipboard(text: string): Promise<void> {
  await navigator.clipboard.writeText(text);
}

// ---------- CSV ----------
export function rowsToCSV(rows: Row[]): string {
  const { columns } = normalizeRows(rows);
  const escape = (v: unknown) => {
    const s = cellToText(v);
    if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };
  const header = columns.map(escape).join(",");
  const body = rows.map((r) => columns.map((c) => escape(r[c])).join(",")).join("\n");
  return `${header}\n${body}`;
}

// ---------- JSON ----------
export function rowsToJSON(rows: Row[]): string {
  return JSON.stringify(rows, null, 2);
}

// ---------- XML ----------
function escapeXml(value: unknown): string {
  return cellToText(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function rowsToXML(rows: Row[], rootTag = "records", rowTag = "record"): string {
  const body = rows
    .map((row) => {
      const fields = Object.entries(row)
        .map(([k, v]) => `    <${k}>${escapeXml(v)}</${k}>`)
        .join("\n");
      return `  <${rowTag}>\n${fields}\n  </${rowTag}>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<${rootTag}>\n${body}\n</${rootTag}>`;
}

// ---------- YAML (simple, dependency-free) ----------
function yamlScalar(value: unknown): string {
  if (value === null || value === undefined) return "null";
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  const s = String(value);
  if (s === "" || /^[\s#\-:@`"'|>{}[\],&*!%]|[:#]\s|\s$/.test(s) || /^\d/.test(s)) {
    return JSON.stringify(s);
  }
  return s;
}

export function rowsToYAML(rows: Row[]): string {
  return rows
    .map((row) => {
      const entries = Object.entries(row).map(([k, v], i) => `${i === 0 ? "- " : "  "}${k}: ${yamlScalar(v)}`);
      return entries.join("\n");
    })
    .join("\n");
}

// ---------- SQL ----------
export function rowsToSQL(rows: Row[], table = "generated_data", dialect: SqlDialect = "mysql"): string {
  return rowsToInsertStatements(rows, table, dialect);
}

// ---------- Excel ----------
export function downloadExcel(rows: Row[], filename: string, sheetName = "Sheet1") {
  const { columns } = normalizeRows(rows);
  const plainRows = rows.map((r) => {
    const out: Row = {};
    columns.forEach((c) => (out[c] = cellToText(r[c])));
    return out;
  });
  const ws = XLSX.utils.json_to_sheet(plainRows, { header: columns });
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, filename);
}

// ---------- PDF ----------
export function downloadPDF(rows: Row[], filename: string, title: string) {
  const { columns } = normalizeRows(rows);
  const doc = new jsPDF({ orientation: columns.length > 6 ? "landscape" : "portrait" });
  doc.setFontSize(14);
  doc.text(title, 14, 15);
  autoTable(doc, {
    startY: 20,
    head: [columns],
    body: rows.map((r) => columns.map((c) => cellToText(r[c]))),
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [99, 91, 255] },
    margin: { left: 14, right: 14 },
  });
  doc.save(filename);
}

export function downloadTextAsPDF(text: string, filename: string, title: string) {
  const doc = new jsPDF();
  doc.setFontSize(14);
  doc.text(title, 14, 15);
  doc.setFontSize(9);
  const lines = doc.splitTextToSize(text, 180);
  doc.text(lines, 14, 24);
  doc.save(filename);
}

// ---------- TXT ----------
export function rowsToTXT(rows: Row[]): string {
  const { columns } = normalizeRows(rows);
  return rows.map((r) => columns.map((c) => `${c}: ${cellToText(r[c])}`).join(" | ")).join("\n");
}

export type ExportFormat = "csv" | "json" | "xml" | "yaml" | "sql" | "excel" | "pdf" | "txt";

export function exportRows(rows: Row[], format: ExportFormat, baseName: string, title: string) {
  const stamp = baseName.replace(/[^a-z0-9-_]+/gi, "-");
  switch (format) {
    case "csv":
      return downloadBlob(rowsToCSV(rows), `${stamp}.csv`, "text/csv");
    case "json":
      return downloadBlob(rowsToJSON(rows), `${stamp}.json`, "application/json");
    case "xml":
      return downloadBlob(rowsToXML(rows), `${stamp}.xml`, "application/xml");
    case "yaml":
      return downloadBlob(rowsToYAML(rows), `${stamp}.yaml`, "application/x-yaml");
    case "sql":
      return downloadBlob(rowsToSQL(rows, stamp), `${stamp}.sql`, "application/sql");
    case "txt":
      return downloadBlob(rowsToTXT(rows), `${stamp}.txt`, "text/plain");
    case "excel":
      return downloadExcel(rows, `${stamp}.xlsx`);
    case "pdf":
      return downloadPDF(rows, `${stamp}.pdf`, title);
  }
}
