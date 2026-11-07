import { NextResponse } from "next/server";

interface ProxyRequestBody {
  method: string;
  url: string;
  headers?: Record<string, string>;
  body?: string;
}

/**
 * Server-side proxy for the API Console. The console runs entirely in the browser, so
 * sending requests directly with `fetch` would be blocked by CORS for most real APIs —
 * this route forwards the request from the server (no browser CORS restrictions apply
 * server-to-server) and returns the response as plain JSON. This is a personal/local
 * dev tool, not a hardened public proxy — no auth, no rate limiting, no allowlist.
 */
export async function POST(request: Request) {
  let payload: ProxyRequestBody;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request payload" }, { status: 400 });
  }

  const { method, url, headers, body } = payload;
  if (!url || !/^https?:\/\//i.test(url)) {
    return NextResponse.json({ error: "URL must start with http:// or https://" }, { status: 400 });
  }

  const startedAt = Date.now();
  try {
    const upstream = await fetch(url, {
      method: method || "GET",
      headers,
      body: method && method !== "GET" && method !== "HEAD" ? body : undefined,
    });
    const durationMs = Date.now() - startedAt;
    const responseHeaders: Record<string, string> = {};
    upstream.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });
    const text = await upstream.text();

    return NextResponse.json({
      status: upstream.status,
      statusText: upstream.statusText,
      headers: responseHeaders,
      body: text,
      durationMs,
      ok: upstream.ok,
    });
  } catch (err) {
    const durationMs = Date.now() - startedAt;
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Request failed", durationMs },
      { status: 502 }
    );
  }
}
