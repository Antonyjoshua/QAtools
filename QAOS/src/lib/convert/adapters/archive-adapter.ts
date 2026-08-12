import type { AdapterManifest, ConversionPair } from "../core/types";

// `from: "*"` means "accepts any file(s) as input" — used for operations like "create a ZIP"
// where there's no single meaningful input format. The engine matches it against any request.
const CONVERSIONS: ConversionPair[] = [
  { from: "*", to: "zip" },
  { from: "zip", to: "extracted" },
  { from: "*", to: "gz" },
  { from: "gz", to: "extracted" },
];

export const archiveManifest: AdapterManifest = {
  id: "archive",
  label: "Archive",
  conversions: CONVERSIONS,
  load: () => import("./archive-adapter-impl").then((m) => m.archiveAdapter),
};
