import type { KeyValue, HttpMethod, BodyType, Assertion, AssertionResult, Environment } from "./types";

/** Replaces {{key}} with the matching enabled variable's value. Unknown/disabled keys are left as-is. */
export function resolveVariables(text: string, variables: KeyValue[]): string {
  const active = new Map(variables.filter((v) => v.enabled && v.key.trim()).map((v) => [v.key.trim(), v.value]));
  return text.replace(/\{\{\s*([\w.-]+)\s*\}\}/g, (match, key) => active.get(key) ?? match);
}

export function buildUrl(url: string, params: KeyValue[]): string {
  const enabled = params.filter((p) => p.enabled && p.key.trim());
  if (enabled.length === 0) return url;
  const [base, existingQuery = ""] = url.split("?");
  const search = new URLSearchParams(existingQuery);
  for (const p of enabled) search.set(p.key.trim(), p.value);
  const qs = search.toString();
  return qs ? `${base}?${qs}` : base;
}

export interface SendResult {
  status: number;
  statusText: string;
  headers: Record<string, string>;
  body: string;
  durationMs: number;
  ok: boolean;
  error?: string;
}

export interface SendRequestInput {
  method: HttpMethod;
  url: string;
  params: KeyValue[];
  headers: KeyValue[];
  bodyType: BodyType;
  body: string;
}

export async function sendRequest(input: SendRequestInput, environment?: Environment | null): Promise<SendResult> {
  const vars = environment?.variables ?? [];
  const resolvedUrl = buildUrl(resolveVariables(input.url, vars), input.params.map((p) => ({ ...p, value: resolveVariables(p.value, vars) })));

  const headerEntries = input.headers
    .filter((h) => h.enabled && h.key.trim())
    .map((h) => [h.key.trim(), resolveVariables(h.value, vars)] as const);
  const headers: Record<string, string> = Object.fromEntries(headerEntries);
  if (input.bodyType === "json" && !headers["Content-Type"] && !headers["content-type"]) {
    headers["Content-Type"] = "application/json";
  }

  const canHaveBody = input.method !== "GET" && input.method !== "HEAD" && input.bodyType !== "none";
  const body = canHaveBody ? resolveVariables(input.body, vars) : undefined;

  try {
    const res = await fetch("/api/proxy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ method: input.method, url: resolvedUrl, headers, body }),
    });
    const data = await res.json();
    if (!res.ok && data.error) {
      return { status: 0, statusText: "", headers: {}, body: "", durationMs: data.durationMs ?? 0, ok: false, error: data.error };
    }
    return data as SendResult;
  } catch (err) {
    return {
      status: 0,
      statusText: "",
      headers: {},
      body: "",
      durationMs: 0,
      ok: false,
      error: err instanceof Error ? err.message : "Request failed",
    };
  }
}

function getJsonPath(value: unknown, path: string): unknown {
  return path
    .split(".")
    .filter(Boolean)
    .reduce<unknown>((acc, key) => {
      if (acc && typeof acc === "object" && key in (acc as Record<string, unknown>)) {
        return (acc as Record<string, unknown>)[key];
      }
      return undefined;
    }, value);
}

export function runAssertions(assertions: Assertion[], result: SendResult): AssertionResult[] {
  return assertions.map((a): AssertionResult => {
    switch (a.type) {
      case "status": {
        const expected = Number(a.expected);
        const passed = result.status === expected;
        return {
          assertionId: a.id,
          description: `Status equals ${a.expected ?? "?"}`,
          passed,
          message: passed ? `Status was ${result.status}` : `Expected status ${a.expected}, got ${result.status}`,
        };
      }
      case "header": {
        const key = (a.key ?? "").toLowerCase();
        const actual = Object.entries(result.headers).find(([k]) => k.toLowerCase() === key)?.[1];
        const passed = actual === a.expected;
        return {
          assertionId: a.id,
          description: `Header "${a.key}" equals "${a.expected}"`,
          passed,
          message: passed ? `Header matched` : `Expected "${a.expected}", got "${actual ?? "(missing)"}"`,
        };
      }
      case "bodyContains": {
        const passed = result.body.includes(a.expected ?? "");
        return {
          assertionId: a.id,
          description: `Body contains "${a.expected}"`,
          passed,
          message: passed ? "Found in response body" : "Not found in response body",
        };
      }
      case "jsonPath": {
        try {
          const parsed = JSON.parse(result.body);
          const actual = getJsonPath(parsed, a.key ?? "");
          const passed = String(actual) === a.expected;
          return {
            assertionId: a.id,
            description: `JSON path "${a.key}" equals "${a.expected}"`,
            passed,
            message: passed ? "Matched" : `Expected "${a.expected}", got "${actual === undefined ? "(missing)" : String(actual)}"`,
          };
        } catch {
          return { assertionId: a.id, description: `JSON path "${a.key}"`, passed: false, message: "Response body is not valid JSON" };
        }
      }
      case "responseTime": {
        const passed = result.durationMs <= (a.maxMs ?? 0);
        return {
          assertionId: a.id,
          description: `Response time ≤ ${a.maxMs}ms`,
          passed,
          message: `Took ${result.durationMs}ms`,
        };
      }
    }
  });
}
