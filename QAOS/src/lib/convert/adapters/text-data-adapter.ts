import type { AdapterManifest, ConversionPair } from "../core/types";

const CONVERSIONS: ConversionPair[] = [
  { from: "csv", to: "json" },
  { from: "json", to: "csv" },
  { from: "json", to: "xml" },
  { from: "xml", to: "json" },
  { from: "yaml", to: "json" },
  { from: "json", to: "yaml" },
  { from: "json", to: "json" }, // format / minify
];

export const textDataManifest: AdapterManifest = {
  id: "text-data",
  label: "Text & Data",
  conversions: CONVERSIONS,
  load: () => import("./text-data-adapter-impl").then((m) => m.textDataAdapter),
};

export interface TextDataConversionOptions {
  mode?: "format" | "minify"; // for json -> json
}
