import {
  Smartphone,
  Tag,
  LayoutGrid,
  Maximize,
  RectangleHorizontal,
  ScanLine,
  HardDrive,
} from "lucide-react";
import type { CalculatorDef, CalculatorOutcome } from "../types";
import { formatNumber, round2 } from "../format";

function num(v: number, decimals = 2) {
  return formatNumber(round2(Number.isFinite(v) ? v : 0), decimals);
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

/* -------------------------------- APK Size Calculator -------------------------------- */

const apkSizeCalculator: CalculatorDef = {
  id: "apk-size-calculator",
  slug: "apk-size-calculator",
  name: "APK Size Calculator",
  category: "mobile",
  description: "Estimate total and compressed APK size from its component sizes.",
  icon: Smartphone,
  keywords: ["apk size", "android build size"],
  formulaExplanation: "Total Size = Code + Resources + Assets + Native Libraries. Estimated Compressed Size ≈ Total × 0.7 (typical APK compression).",
  fields: [
    { id: "code", label: "Code Size (MB)", kind: "number", allowDecimal: true, allowZero: false },
    { id: "resources", label: "Resources Size (MB)", kind: "number", allowDecimal: true, allowZero: true },
    { id: "assets", label: "Assets Size (MB)", kind: "number", allowDecimal: true, allowZero: true },
    { id: "nativeLibs", label: "Native Libraries Size (MB)", kind: "number", allowDecimal: true, allowZero: true },
  ],
  compute: (v): CalculatorOutcome => {
    const total = v.code + v.resources + v.assets + v.nativeLibs;
    const compressedEstimate = total * 0.7;

    return {
      steps: [
        { label: "Total Size", formula: "Code + Resources + Assets + Native Libs", value: `${num(total)} MB` },
        { label: "Estimated Compressed Size", formula: "Total × 0.7", value: `${num(compressedEstimate)} MB` },
      ],
      summary: [
        { label: "Total (Uncompressed)", value: `${num(total)} MB`, highlight: true },
        { label: "Estimated Compressed Size", value: `${num(compressedEstimate)} MB` },
      ],
      notes: ["Compression ratio varies by build — treat this as a rough estimate, not a guaranteed download size."],
    };
  },
};

/* ---------------------------- iOS Build Number Helper ---------------------------- */

const iosBuildNumberCalculator: CalculatorDef = {
  id: "ios-build-number-helper",
  slug: "ios-build-number-helper",
  name: "iOS Build Number Helper",
  category: "mobile",
  description: "Bump a semantic marketing version and generate a date-based build number.",
  icon: Tag,
  keywords: ["ios build number", "version bump", "semver"],
  formulaExplanation: "Bumps major.minor.patch per semver rules. Build number suggestion uses the current date as YYYYMMDDHHmm.",
  fields: [
    { id: "version", label: "Current Version (e.g. 1.4.2)", kind: "text", placeholder: "1.4.2" },
    {
      id: "bump",
      label: "Bump Type",
      kind: "select",
      defaultValue: "patch",
      options: [
        { label: "Patch", value: "patch" },
        { label: "Minor", value: "minor" },
        { label: "Major", value: "major" },
      ],
    },
  ],
  compute: (_v, raw): CalculatorOutcome => {
    const parts = (raw.version ?? "0.0.0").split(".").map((p) => parseInt(p, 10) || 0);
    let [major, minor, patch] = [parts[0] ?? 0, parts[1] ?? 0, parts[2] ?? 0];
    if (raw.bump === "major") {
      major += 1;
      minor = 0;
      patch = 0;
    } else if (raw.bump === "minor") {
      minor += 1;
      patch = 0;
    } else {
      patch += 1;
    }
    const nextVersion = `${major}.${minor}.${patch}`;

    const now = new Date();
    const buildNumber = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, "0"),
      String(now.getDate()).padStart(2, "0"),
      String(now.getHours()).padStart(2, "0"),
      String(now.getMinutes()).padStart(2, "0"),
    ].join("");

    return {
      steps: [
        { label: "Next Version", formula: `Bump ${raw.bump} on ${raw.version}`, value: nextVersion },
        { label: "Suggested Build Number", formula: "YYYYMMDDHHmm (now)", value: buildNumber },
      ],
      summary: [
        { label: "Next Version", value: nextVersion, highlight: true },
        { label: "Suggested Build Number", value: buildNumber },
      ],
    };
  },
};

/* -------------------------- Android Version Compatibility -------------------------- */

const ANDROID_VERSIONS: { api: number; name: string }[] = [
  { api: 21, name: "5.0 Lollipop" },
  { api: 23, name: "6.0 Marshmallow" },
  { api: 24, name: "7.0 Nougat" },
  { api: 26, name: "8.0 Oreo" },
  { api: 28, name: "9 Pie" },
  { api: 29, name: "10" },
  { api: 30, name: "11" },
  { api: 31, name: "12" },
  { api: 33, name: "13" },
  { api: 34, name: "14" },
  { api: 35, name: "15" },
];

function androidNameForApi(api: number): string {
  let match = ANDROID_VERSIONS[0];
  for (const v of ANDROID_VERSIONS) {
    if (v.api <= api) match = v;
  }
  return `Android ${match.name} (API ${match.api}${api !== match.api ? `, requested ${api}` : ""})`;
}

const androidCompatibilityCalculator: CalculatorDef = {
  id: "android-version-compatibility",
  slug: "android-version-compatibility",
  name: "Android Version Compatibility",
  category: "mobile",
  description: "Translate minSdkVersion / targetSdkVersion into the Android version names they map to.",
  icon: LayoutGrid,
  keywords: ["android sdk", "api level", "minsdkversion", "targetsdkversion"],
  formulaExplanation: "Maps each Android API level to the version name introduced at or below that level.",
  fields: [
    { id: "minSdk", label: "minSdkVersion (API level)", kind: "number", allowDecimal: false, allowZero: false, defaultValue: "24" },
    { id: "targetSdk", label: "targetSdkVersion (API level)", kind: "number", allowDecimal: false, allowZero: false, defaultValue: "34" },
  ],
  compute: (v): CalculatorOutcome => {
    return {
      steps: [
        { label: "Minimum Supported", formula: "Lookup API level", value: androidNameForApi(v.minSdk) },
        { label: "Target", formula: "Lookup API level", value: androidNameForApi(v.targetSdk) },
      ],
      summary: [
        { label: "Minimum Supported Version", value: androidNameForApi(v.minSdk), highlight: true },
        { label: "Target Version", value: androidNameForApi(v.targetSdk) },
      ],
      notes: v.minSdk > v.targetSdk ? ["minSdkVersion is higher than targetSdkVersion — double check these."] : [],
    };
  },
};

/* -------------------------------- Screen Resolution -------------------------------- */

const screenResolutionCalculator: CalculatorDef = {
  id: "screen-resolution-calculator",
  slug: "screen-resolution-calculator",
  name: "Screen Resolution Calculator",
  category: "mobile",
  description: "Total pixels, megapixels and simplified aspect ratio for a screen resolution.",
  icon: Maximize,
  keywords: ["screen resolution", "megapixels"],
  formulaExplanation: "Total Pixels = Width × Height. Aspect Ratio is the width:height fraction reduced by their GCD.",
  fields: [
    { id: "width", label: "Width (px)", kind: "number", allowDecimal: false, allowZero: false },
    { id: "height", label: "Height (px)", kind: "number", allowDecimal: false, allowZero: false },
  ],
  compute: (v): CalculatorOutcome => {
    const totalPixels = v.width * v.height;
    const divisor = gcd(v.width, v.height);
    const ratioW = v.width / divisor;
    const ratioH = v.height / divisor;

    return {
      steps: [
        { label: "Total Pixels", formula: "Width × Height", value: num(totalPixels, 0) },
        { label: "Megapixels", formula: "Total Pixels ÷ 1,000,000", value: `${num(totalPixels / 1_000_000)} MP` },
        { label: "Aspect Ratio", formula: "Reduced by GCD", value: `${ratioW}:${ratioH}` },
      ],
      summary: [
        { label: "Resolution", value: `${v.width} × ${v.height}`, highlight: true },
        { label: "Megapixels", value: `${num(totalPixels / 1_000_000)} MP` },
        { label: "Aspect Ratio", value: `${ratioW}:${ratioH}` },
      ],
    };
  },
};

/* --------------------------------- Aspect Ratio --------------------------------- */

const aspectRatioCalculator: CalculatorDef = {
  id: "aspect-ratio-calculator",
  slug: "aspect-ratio-calculator",
  name: "Aspect Ratio Calculator",
  category: "mobile",
  description: "Simplify any width/height pair into its reduced aspect ratio.",
  icon: RectangleHorizontal,
  keywords: ["aspect ratio", "width height ratio"],
  formulaExplanation: "Ratio = Width : Height, reduced by their greatest common divisor.",
  fields: [
    { id: "width", label: "Width", kind: "number", allowDecimal: true, allowZero: false },
    { id: "height", label: "Height", kind: "number", allowDecimal: true, allowZero: false },
  ],
  compute: (v): CalculatorOutcome => {
    const isInteger = Number.isInteger(v.width) && Number.isInteger(v.height);
    const divisor = isInteger ? gcd(v.width, v.height) : 1;
    const ratioW = isInteger ? v.width / divisor : v.width;
    const ratioH = isInteger ? v.height / divisor : v.height;
    const decimalRatio = v.width / v.height;

    return {
      steps: [
        { label: "Simplified Ratio", formula: "Width:Height ÷ GCD", value: `${num(ratioW, 2)}:${num(ratioH, 2)}` },
        { label: "Decimal Ratio", formula: "Width ÷ Height", value: num(decimalRatio, 4) },
      ],
      summary: [
        { label: "Aspect Ratio", value: `${num(ratioW, 2)}:${num(ratioH, 2)}`, highlight: true },
        { label: "Decimal Ratio", value: num(decimalRatio, 4) },
      ],
    };
  },
};

/* -------------------------------- Pixel Density (PPI) -------------------------------- */

const pixelDensityCalculator: CalculatorDef = {
  id: "pixel-density-calculator",
  slug: "pixel-density-calculator",
  name: "Pixel Density (PPI) Calculator",
  category: "mobile",
  description: "Compute pixels-per-inch from screen resolution and diagonal size.",
  icon: ScanLine,
  keywords: ["ppi", "pixel density", "dpi"],
  formulaExplanation: "PPI = √(Width² + Height²) ÷ Diagonal Size (inches).",
  fields: [
    { id: "width", label: "Width (px)", kind: "number", allowDecimal: false, allowZero: false },
    { id: "height", label: "Height (px)", kind: "number", allowDecimal: false, allowZero: false },
    { id: "diagonalInches", label: "Screen Diagonal (inches)", kind: "number", allowDecimal: true, allowZero: false },
  ],
  compute: (v): CalculatorOutcome => {
    const diagonalPixels = Math.sqrt(v.width ** 2 + v.height ** 2);
    const ppi = diagonalPixels / v.diagonalInches;

    return {
      steps: [
        { label: "Diagonal (pixels)", formula: "√(Width² + Height²)", value: num(diagonalPixels, 0) },
        { label: "PPI", formula: "Diagonal Pixels ÷ Diagonal Inches", value: num(ppi, 0) },
      ],
      summary: [{ label: "Pixel Density", value: `${num(ppi, 0)} PPI`, highlight: true }],
    };
  },
};

/* ------------------------------ Device Storage Estimator ------------------------------ */

const STORAGE_TIERS = [16, 32, 64, 128, 256, 512, 1024];

const deviceStorageCalculator: CalculatorDef = {
  id: "device-storage-estimator",
  slug: "device-storage-estimator",
  name: "Device Storage Estimator",
  category: "mobile",
  description: "Estimate total storage needed and round up to the nearest common device tier.",
  icon: HardDrive,
  keywords: ["device storage", "storage tier"],
  formulaExplanation: "Required = (OS + Pre-installed Apps + Expected Apps + Expected Media) × (1 + Buffer% / 100).",
  fields: [
    { id: "osSize", label: "OS Size (GB)", kind: "number", allowDecimal: true, allowZero: false, defaultValue: "6" },
    { id: "preinstalled", label: "Pre-installed Apps (GB)", kind: "number", allowDecimal: true, allowZero: true, defaultValue: "2" },
    { id: "expectedApps", label: "Expected Apps (GB)", kind: "number", allowDecimal: true, allowZero: true },
    { id: "expectedMedia", label: "Expected Photos/Videos (GB)", kind: "number", allowDecimal: true, allowZero: true },
    { id: "bufferPercent", label: "Buffer %", kind: "number", suffix: "%", allowDecimal: true, allowZero: true, defaultValue: "10" },
  ],
  compute: (v): CalculatorOutcome => {
    const rawTotal = v.osSize + v.preinstalled + v.expectedApps + v.expectedMedia;
    const required = rawTotal * (1 + v.bufferPercent / 100);
    const tier = STORAGE_TIERS.find((t) => t >= required) ?? STORAGE_TIERS[STORAGE_TIERS.length - 1];

    return {
      steps: [
        { label: "Raw Total", formula: "OS + Pre-installed + Apps + Media", value: `${num(rawTotal)} GB` },
        { label: "With Buffer", formula: "Raw Total × (1 + Buffer%)", value: `${num(required)} GB` },
      ],
      summary: [
        { label: "Estimated Required Storage", value: `${num(required)} GB`, highlight: true },
        { label: "Recommended Device Tier", value: `${tier} GB` },
      ],
    };
  },
};

export const mobileCalculators: CalculatorDef[] = [
  apkSizeCalculator,
  iosBuildNumberCalculator,
  androidCompatibilityCalculator,
  screenResolutionCalculator,
  aspectRatioCalculator,
  pixelDensityCalculator,
  deviceStorageCalculator,
];
