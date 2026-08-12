import type { AdapterManifest, ConversionPair } from "../core/types";

const CONVERSIONS: ConversionPair[] = [
  { from: "xlsx", to: "csv" },
  { from: "xlsx", to: "xls" },
  { from: "xlsx", to: "ods" },
  { from: "xlsx", to: "pdf" },
  { from: "xls", to: "csv" },
  { from: "xls", to: "xlsx" },
  { from: "xls", to: "ods" },
  { from: "xls", to: "pdf" },
  { from: "csv", to: "xlsx" },
  { from: "csv", to: "xls" },
  { from: "csv", to: "ods" },
  { from: "csv", to: "pdf" },
  { from: "ods", to: "xlsx" },
  { from: "ods", to: "xls" },
  { from: "ods", to: "csv" },
  { from: "ods", to: "pdf" },
];

export const spreadsheetManifest: AdapterManifest = {
  id: "spreadsheet",
  label: "Spreadsheet",
  conversions: CONVERSIONS,
  load: () => import("./spreadsheet-adapter-impl").then((m) => m.spreadsheetAdapter),
};

export interface SpreadsheetConversionOptions {
  orientation?: "portrait" | "landscape";
  paperSize?: "a4" | "letter";
  margin?: number; // mm
  fitToPage?: boolean;
  repeatHeaders?: boolean;
  includeGridlines?: boolean;
  sheets?: "all" | string[]; // sheet names, or "all"
}
