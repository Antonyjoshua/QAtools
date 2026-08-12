import type { GeneratorModule } from "../types";
import { ANDROID_DEVICES, IOS_DEVICES, ANDROID_VERSIONS, IOS_VERSIONS, SCREEN_SIZES } from "../data";
import { pick, randInt, alphaNum, digits, uuidv4 } from "../random";

export const mobileGenerators: GeneratorModule[] = [
  {
    slug: "device-profile",
    name: "Device Profile",
    category: "mobile",
    description: "Full device record: model, OS version, screen size, build/app version, and device ID.",
    outputKind: "table",
    supportsBulk: true,
    defaultCount: 20,
    columns: ["platform", "deviceModel", "osVersion", "screenSize", "buildNumber", "appVersion", "deviceId"],
    generate: () => {
      const platform = pick(["Android", "iOS"]);
      const isAndroid = platform === "Android";
      const device = isAndroid ? pick(ANDROID_DEVICES).model : pick(IOS_DEVICES);
      const osVersion = isAndroid ? pick(ANDROID_VERSIONS) : pick(IOS_VERSIONS);
      const screen = pick(SCREEN_SIZES);
      return {
        platform,
        deviceModel: device,
        osVersion,
        screenSize: `${screen.width}x${screen.height} (${screen.label})`,
        buildNumber: `${randInt(1000, 9999)}.${randInt(0, 99)}`,
        appVersion: `${randInt(1, 6)}.${randInt(0, 20)}.${randInt(0, 20)}`,
        deviceId: isAndroid ? alphaNum(16, false) : uuidv4().toUpperCase(),
      };
    },
  },
  {
    slug: "device-names",
    name: "Device Name Generator",
    category: "mobile",
    description: "Android and iOS device model names.",
    outputKind: "table",
    supportsBulk: true,
    defaultCount: 20,
    columns: ["platform", "deviceModel", "vendor"],
    generate: () => {
      const platform = pick(["Android", "iOS"]);
      if (platform === "Android") {
        const d = pick(ANDROID_DEVICES);
        return { platform, deviceModel: d.model, vendor: d.vendor };
      }
      return { platform, deviceModel: pick(IOS_DEVICES), vendor: "Apple" };
    },
  },
  {
    slug: "android-versions",
    name: "Android Version Generator",
    category: "mobile",
    description: "Android OS version numbers.",
    outputKind: "table",
    supportsBulk: true,
    defaultCount: 15,
    columns: ["androidVersion"],
    generate: () => ({ androidVersion: pick(ANDROID_VERSIONS) }),
  },
  {
    slug: "ios-versions",
    name: "iOS Version Generator",
    category: "mobile",
    description: "iOS version numbers.",
    outputKind: "table",
    supportsBulk: true,
    defaultCount: 15,
    columns: ["iosVersion"],
    generate: () => ({ iosVersion: pick(IOS_VERSIONS) }),
  },
  {
    slug: "screen-sizes",
    name: "Screen Size Generator",
    category: "mobile",
    description: "Common device viewport dimensions for responsive testing.",
    outputKind: "table",
    supportsBulk: true,
    defaultCount: 15,
    columns: ["label", "width", "height", "aspectRatio"],
    generate: () => {
      const s = pick(SCREEN_SIZES);
      return { label: s.label, width: s.width, height: s.height, aspectRatio: (s.width / s.height).toFixed(3) };
    },
  },
  {
    slug: "device-ids",
    name: "Synthetic Device ID Generator",
    category: "mobile",
    description: "Random device identifiers in Android ID / IDFA-style formats.",
    note: "Synthetic value — does not correspond to a real device.",
    outputKind: "table",
    supportsBulk: true,
    defaultCount: 20,
    columns: ["platform", "deviceId"],
    generate: () => {
      const platform = pick(["Android", "iOS"]);
      return { platform, deviceId: platform === "Android" ? alphaNum(16, false) : uuidv4().toUpperCase() };
    },
  },
  {
    slug: "build-numbers",
    name: "Build Number Generator",
    category: "mobile",
    description: "App build numbers.",
    outputKind: "table",
    supportsBulk: true,
    defaultCount: 20,
    columns: ["buildNumber"],
    generate: () => ({ buildNumber: `${digits(4)}.${randInt(0, 99)}` }),
  },
  {
    slug: "app-versions",
    name: "App Version Generator",
    category: "mobile",
    description: "Semantic app version numbers.",
    outputKind: "table",
    supportsBulk: true,
    defaultCount: 20,
    columns: ["appVersion"],
    generate: () => ({ appVersion: `${randInt(1, 6)}.${randInt(0, 20)}.${randInt(0, 20)}` }),
  },
];
