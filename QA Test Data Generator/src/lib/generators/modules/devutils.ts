import type { GeneratorModule } from "../types";
import { pick, randInt, randomDate, alphaNum } from "../random";
import { COMPANY_ROOTS } from "../data";

const HTTP_STATUSES: [number, string][] = [
  [200, "OK"], [201, "Created"], [204, "No Content"], [301, "Moved Permanently"],
  [302, "Found"], [304, "Not Modified"], [400, "Bad Request"], [401, "Unauthorized"],
  [403, "Forbidden"], [404, "Not Found"], [409, "Conflict"], [422, "Unprocessable Entity"],
  [429, "Too Many Requests"], [500, "Internal Server Error"], [502, "Bad Gateway"], [503, "Service Unavailable"],
];

const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148",
  "Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Mobile Safari/537.36",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
];

function ipv4(): string {
  return `${randInt(1, 255)}.${randInt(0, 255)}.${randInt(0, 255)}.${randInt(1, 254)}`;
}

function ipv6(): string {
  return Array.from({ length: 8 }, () => randInt(0, 65535).toString(16)).join(":");
}

function macAddress(): string {
  return Array.from({ length: 6 }, () => randInt(0, 255).toString(16).padStart(2, "0")).join(":").toUpperCase();
}

function hexColor(): string {
  return `#${randInt(0, 0xffffff).toString(16).padStart(6, "0")}`;
}

function cronExpression(): string {
  const patterns = [
    "* * * * *",
    "*/5 * * * *",
    "0 * * * *",
    "0 0 * * *",
    "0 9 * * 1-5",
    "0 0 1 * *",
    "0 0 * * 0",
    "30 2 * * *",
  ];
  return pick(patterns);
}

function semver(): string {
  return `${randInt(0, 9)}.${randInt(0, 20)}.${randInt(0, 20)}`;
}

function slug(): string {
  const words = [pick(COMPANY_ROOTS), pick(["guide", "overview", "release-notes", "getting-started", "api-reference", "changelog"])];
  return words.join("-").toLowerCase();
}

export const devUtilsGenerators: GeneratorModule[] = [
  {
    slug: "timestamp",
    name: "Timestamp Generator",
    category: "devutils",
    description: "Unix epoch and ISO-8601 timestamps within a chosen year range.",
    outputKind: "table",
    supportsBulk: true,
    defaultCount: 20,
    options: [
      { key: "startYear", label: "Start year", type: "number", default: 2020, min: 1990, max: 2035 },
      { key: "endYear", label: "End year", type: "number", default: 2026, min: 1990, max: 2035 },
    ],
    columns: ["iso8601", "unixSeconds", "unixMillis"],
    generate: (ctx) => {
      const d = randomDate(Number(ctx.options.startYear ?? 2020), Number(ctx.options.endYear ?? 2026));
      return { iso8601: d.toISOString(), unixSeconds: Math.floor(d.getTime() / 1000), unixMillis: d.getTime() };
    },
  },
  {
    slug: "slug-generator",
    name: "URL Slug Generator",
    category: "devutils",
    description: "SEO-friendly URL slugs.",
    outputKind: "table",
    supportsBulk: true,
    defaultCount: 20,
    columns: ["slug"],
    generate: () => ({ slug: slug() }),
  },
  {
    slug: "hex-color",
    name: "Color Generator",
    category: "devutils",
    description: "Random colors in HEX and RGB formats.",
    outputKind: "table",
    supportsBulk: true,
    defaultCount: 25,
    columns: ["hex", "rgb"],
    generate: () => {
      const hex = hexColor();
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);
      return { hex, rgb: `rgb(${r}, ${g}, ${b})` };
    },
  },
  {
    slug: "ip-address",
    name: "IP Address Generator",
    category: "devutils",
    description: "Random IPv4 and IPv6 addresses.",
    outputKind: "table",
    supportsBulk: true,
    defaultCount: 25,
    columns: ["ipv4", "ipv6"],
    generate: () => ({ ipv4: ipv4(), ipv6: ipv6() }),
  },
  {
    slug: "mac-address",
    name: "MAC Address Generator",
    category: "devutils",
    description: "Random MAC addresses.",
    outputKind: "table",
    supportsBulk: true,
    defaultCount: 25,
    columns: ["macAddress"],
    generate: () => ({ macAddress: macAddress() }),
  },
  {
    slug: "user-agent",
    name: "User-Agent String Generator",
    category: "devutils",
    description: "Realistic browser User-Agent header values.",
    outputKind: "table",
    supportsBulk: true,
    defaultCount: 15,
    columns: ["userAgent"],
    generate: () => ({ userAgent: pick(USER_AGENTS) }),
  },
  {
    slug: "http-status",
    name: "HTTP Status Code Generator",
    category: "devutils",
    description: "Random HTTP status codes with their reason phrase.",
    outputKind: "table",
    supportsBulk: true,
    defaultCount: 16,
    columns: ["code", "reason", "category"],
    generate: () => {
      const [code, reason] = pick(HTTP_STATUSES);
      const category = code < 300 ? "2xx Success" : code < 400 ? "3xx Redirection" : code < 500 ? "4xx Client Error" : "5xx Server Error";
      return { code, reason, category };
    },
  },
  {
    slug: "cron-expression",
    name: "Cron Expression Generator",
    category: "devutils",
    description: "Common cron schedule expressions.",
    outputKind: "table",
    supportsBulk: true,
    defaultCount: 10,
    columns: ["cronExpression"],
    generate: () => ({ cronExpression: cronExpression() }),
  },
  {
    slug: "semver",
    name: "Semantic Version Generator",
    category: "devutils",
    description: "Semantic version numbers (major.minor.patch).",
    outputKind: "table",
    supportsBulk: true,
    defaultCount: 20,
    columns: ["version"],
    generate: () => ({ version: semver() }),
  },
  {
    slug: "environment-variables",
    name: ".env Variable Block",
    category: "devutils",
    description: "Sample environment-variable block for local/staging config testing.",
    outputKind: "code",
    language: "bash",
    supportsBulk: false,
    defaultCount: 1,
    generate: () =>
      [
        `NODE_ENV=development`,
        `PORT=${pick([3000, 4000, 5000, 8080])}`,
        `DATABASE_URL=postgresql://user:pass@localhost:5432/appdb`,
        `API_BASE_URL=https://api.staging.example.test`,
        `JWT_SECRET=${alphaNum(32, false)}`,
        `LOG_LEVEL=debug`,
        `FEATURE_FLAG_NEW_CHECKOUT=${pick(["true", "false"])}`,
      ].join("\n"),
  },
  {
    slug: "random-hex-id",
    name: "Hex / Short ID Generator",
    category: "devutils",
    description: "Short random hex identifiers (e.g. for git-style commit-like IDs).",
    outputKind: "table",
    supportsBulk: true,
    defaultCount: 25,
    options: [{ key: "length", label: "Length", type: "number", default: 8, min: 4, max: 40 }],
    columns: ["hexId"],
    generate: (ctx) => {
      const len = Number(ctx.options.length ?? 8);
      let out = "";
      for (let i = 0; i < len; i++) out += randInt(0, 15).toString(16);
      return { hexId: out };
    },
  },
];
