import * as XLSX from "xlsx";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type { ConversionAdapter, ConversionRequest, ConversionResult, ProgressCallback } from "../core/types";
import type { SpreadsheetConversionOptions } from "./spreadsheet-adapter";

const MIME_BY_FORMAT: Record<string, string> = {
  xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  xls: "application/vnd.ms-excel",
  ods: "application/vnd.oasis.opendocument.spreadsheet",
  csv: "text/csv",
};

const BOOK_TYPE_BY_FORMAT: Record<string, XLSX.BookType> = { xlsx: "xlsx", xls: "biff8", ods: "ods" };

function baseName(fileName: string): string {
  return fileName.replace(/\.[^.]+$/, "");
}

async function readWorkbook(file: File): Promise<XLSX.WorkBook> {
  if (file.name.toLowerCase().endsWith(".csv")) {
    const text = await file.text();
    return XLSX.read(text, { type: "string" });
  }
  const buffer = await file.arrayBuffer();
  return XLSX.read(buffer, { type: "array" });
}

function selectSheetNames(wb: XLSX.WorkBook, options: SpreadsheetConversionOptions): string[] {
  if (!options.sheets || options.sheets === "all") return wb.SheetNames;
  return options.sheets.filter((s) => wb.SheetNames.includes(s));
}

function sheetToPdf(wb: XLSX.WorkBook, sheetNames: string[], options: SpreadsheetConversionOptions): Blob {
  const orientation = options.orientation ?? "landscape";
  const format = options.paperSize ?? "a4";
  const margin = options.margin ?? 10;
  const doc = new jsPDF({ orientation, format });

  sheetNames.forEach((name, i) => {
    if (i > 0) doc.addPage(format, orientation);
    const ws = wb.Sheets[name];
    const rows = XLSX.utils.sheet_to_json<string[]>(ws, { header: 1, blankrows: false }) as unknown as (string | number)[][];
    const [head, ...body] = rows.length > 0 ? rows : [[]];
    doc.setFontSize(11);
    doc.text(name, margin, margin);
    autoTable(doc, {
      startY: margin + 6,
      head: head ? [head.map(String)] : undefined,
      body: body.map((r) => r.map((c) => String(c ?? ""))),
      theme: options.includeGridlines === false ? "plain" : "grid",
      margin: { left: margin, right: margin },
      styles: { fontSize: options.fitToPage ? 6 : 8, cellPadding: 1.5, overflow: "linebreak" },
      headStyles: { fillColor: [37, 99, 235] },
      showHead: options.repeatHeaders === false ? "firstPage" : "everyPage",
      tableWidth: options.fitToPage ? "wrap" : "auto",
    });
  });

  return doc.output("blob");
}

export const spreadsheetAdapter: ConversionAdapter = {
  id: "spreadsheet",
  async convert(request: ConversionRequest, onProgress: ProgressCallback): Promise<ConversionResult> {
    const start = Date.now();
    const file = request.files[0];
    const options = (request.options ?? {}) as SpreadsheetConversionOptions;

    try {
      onProgress({ stage: "processing", percent: 15, message: "Reading spreadsheet…" });
      const wb = await readWorkbook(file);
      const sheetNames = selectSheetNames(wb, options);
      if (sheetNames.length === 0) throw new Error("no-sheets-selected");

      onProgress({ stage: "converting", percent: 50, message: "Converting…" });
      let blob: Blob;

      if (request.outputFormat === "pdf") {
        blob = sheetToPdf(wb, sheetNames, options);
      } else if (request.outputFormat === "csv") {
        const csv = XLSX.utils.sheet_to_csv(wb.Sheets[sheetNames[0]]);
        blob = new Blob([csv], { type: MIME_BY_FORMAT.csv });
      } else {
        const bookType = BOOK_TYPE_BY_FORMAT[request.outputFormat];
        if (!bookType) throw new Error("unsupported-output");
        const outWb = sheetNames.length === wb.SheetNames.length ? wb : XLSX.utils.book_new();
        if (outWb !== wb) {
          for (const name of sheetNames) XLSX.utils.book_append_sheet(outWb, wb.Sheets[name], name);
        }
        const array = XLSX.write(outWb, { type: "array", bookType });
        blob = new Blob([array], { type: MIME_BY_FORMAT[request.outputFormat] });
      }

      onProgress({ stage: "finalizing", percent: 90 });
      onProgress({ stage: "completed", percent: 100 });
      return {
        success: true,
        outputs: [{ name: `${baseName(file.name)}.${request.outputFormat}`, blob, format: request.outputFormat }],
        durationMs: Date.now() - start,
      };
    } catch {
      return {
        success: false,
        outputs: [],
        durationMs: Date.now() - start,
        error: { code: "corrupted-file", message: "This spreadsheet couldn't be read. It may be corrupted, password-protected, or in an unsupported format." },
      };
    }
  },
};
