import type { GeneratorModule } from "../types";
import { generatePassword } from "../password";
import { pick, randInt, alphaNum, digits, uuidv4, base64UrlEncode, base64Encode } from "../random";
import { sha256Hex, md5Hex } from "../hash";

function apiKey(): string {
  return `sk_${pick(["live", "test"])}_${alphaNum(32, false)}`;
}

function jwtSample(): { header: object; payload: object; token: string } {
  const header = { alg: "HS256", typ: "JWT" };
  const payload = {
    sub: uuidv4(),
    name: "Test User",
    role: pick(["admin", "user", "editor"]),
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600,
  };
  const token = `${base64UrlEncode(JSON.stringify(header))}.${base64UrlEncode(JSON.stringify(payload))}.${alphaNum(43, false)}`;
  return { header, payload, token };
}

function oauthToken(): Record<string, unknown> {
  return {
    access_token: `ya29.${alphaNum(60, false)}`,
    refresh_token: `1//${alphaNum(40, false)}`,
    token_type: "Bearer",
    expires_in: 3600,
    scope: pick(["read write", "read", "read write admin"]),
  };
}

export const securityGenerators: GeneratorModule[] = [
  {
    slug: "strong-password",
    name: "Strong Password Generator",
    category: "security",
    description: "High-entropy passwords guaranteed to include upper, lower, number, and symbol.",
    outputKind: "table",
    supportsBulk: true,
    defaultCount: 20,
    options: [{ key: "length", label: "Length", type: "number", default: 16, min: 8, max: 128 }],
    columns: ["password"],
    generate: (ctx) => ({ password: generatePassword({ length: Number(ctx.options.length ?? 16) }) }),
  },
  {
    slug: "api-key",
    name: "API Key Generator",
    category: "security",
    description: "Synthetic API keys in a Stripe-like sk_live_/sk_test_ format.",
    note: "Synthetic value — will not authenticate against any real service.",
    outputKind: "table",
    supportsBulk: true,
    defaultCount: 20,
    columns: ["apiKey"],
    generate: () => ({ apiKey: apiKey() }),
  },
  {
    slug: "uuid",
    name: "UUID Generator",
    category: "security",
    description: "RFC-4122 v4 UUIDs.",
    outputKind: "table",
    supportsBulk: true,
    defaultCount: 25,
    columns: ["uuid"],
    generate: () => ({ uuid: uuidv4() }),
  },
  {
    slug: "jwt-sample",
    name: "JWT Payload Sample",
    category: "security",
    description: "Structurally valid JWT (header.payload.signature) with a synthetic signature — for parsing/format tests, not authentication.",
    note: "Signature segment is random and not cryptographically valid.",
    outputKind: "json",
    supportsBulk: true,
    defaultCount: 10,
    generate: () => jwtSample(),
  },
  {
    slug: "base64-encode",
    name: "Base64 Encoder",
    category: "security",
    description: "Base64-encode arbitrary text, or generate random Base64 blobs.",
    outputKind: "table",
    supportsBulk: true,
    defaultCount: 15,
    options: [{ key: "text", label: "Text to encode (optional)", type: "text", placeholder: "Leave blank for random data" }],
    columns: ["input", "base64"],
    generate: (ctx) => {
      const text = String(ctx.options.text ?? "").trim();
      const input = text || `sample-data-${alphaNum(8)}`;
      return { input, base64: base64Encode(input) };
    },
  },
  {
    slug: "sha256-hash",
    name: "SHA-256 Hash Generator",
    category: "security",
    description: "Compute a real SHA-256 hash of provided text, or generate random 64-char hex digests.",
    outputKind: "table",
    supportsBulk: true,
    defaultCount: 15,
    options: [{ key: "text", label: "Text to hash (optional)", type: "text", placeholder: "Leave blank for random input" }],
    columns: ["input", "sha256"],
    generate: (ctx) => {
      const text = String(ctx.options.text ?? "").trim();
      const input = text || `sample-${alphaNum(10)}`;
      return { input, sha256: sha256Hex(input) };
    },
  },
  {
    slug: "md5-hash",
    name: "MD5 Hash Generator",
    category: "security",
    description: "Compute a real MD5 hash of provided text, or generate random 32-char hex digests.",
    note: "MD5 is provided for legacy format/compatibility testing only — not for secure hashing.",
    outputKind: "table",
    supportsBulk: true,
    defaultCount: 15,
    options: [{ key: "text", label: "Text to hash (optional)", type: "text", placeholder: "Leave blank for random input" }],
    columns: ["input", "md5"],
    generate: (ctx) => {
      const text = String(ctx.options.text ?? "").trim();
      const input = text || `sample-${alphaNum(10)}`;
      return { input, md5: md5Hex(input) };
    },
  },
  {
    slug: "oauth-token",
    name: "OAuth Token Sample",
    category: "security",
    description: "Synthetic OAuth2 access/refresh token pair in Google-style format.",
    note: "Synthetic value — will not authenticate against any real service.",
    outputKind: "json",
    supportsBulk: true,
    defaultCount: 10,
    generate: () => oauthToken(),
  },
  {
    slug: "otp-code",
    name: "OTP / Verification Code",
    category: "security",
    description: "Numeric one-time-password codes for 2FA/verification flows.",
    outputKind: "table",
    supportsBulk: true,
    defaultCount: 25,
    options: [{ key: "length", label: "Digits", type: "number", default: 6, min: 4, max: 10 }],
    columns: ["otp"],
    generate: (ctx) => ({ otp: digits(Number(ctx.options.length ?? 6)) }),
  },
  {
    slug: "session-token",
    name: "Session Token Generator",
    category: "security",
    description: "Random session/cookie tokens for auth-flow testing.",
    outputKind: "table",
    supportsBulk: true,
    defaultCount: 20,
    columns: ["sessionToken"],
    generate: () => ({ sessionToken: `sess_${alphaNum(32, false)}` }),
  },
  {
    slug: "cvv-expiry-test",
    name: "Test Card CVV / Expiry (Non-financial)",
    category: "security",
    description: "Random 3-4 digit CVV and future expiry pairs for UI validation testing only — no card numbers.",
    note: "No real card numbers are generated. Pair with a payment gateway's own official test card numbers.",
    outputKind: "table",
    supportsBulk: true,
    defaultCount: 20,
    columns: ["cvv", "expiry"],
    generate: () => ({ cvv: digits(randInt(3, 4) === 4 ? 4 : 3), expiry: `${String(randInt(1, 12)).padStart(2, "0")}/${randInt(26, 31)}` }),
  },
];
