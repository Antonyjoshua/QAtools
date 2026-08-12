"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"] as const;
type Method = (typeof METHODS)[number];

interface ApiResponse {
  status: number;
  statusText: string;
  timeMs: number;
  body: string;
}

export function ApiPlayground() {
  const [method, setMethod] = React.useState<Method>("GET");
  const [url, setUrl] = React.useState("https://jsonplaceholder.typicode.com/todos/1");
  const [headersText, setHeadersText] = React.useState('{\n  "Content-Type": "application/json"\n}');
  const [bodyText, setBodyText] = React.useState("");
  const [sending, setSending] = React.useState(false);
  const [response, setResponse] = React.useState<ApiResponse | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  const bodyDisabled = method === "GET" || method === "DELETE";

  async function handleSend() {
    setSending(true);
    setError(null);
    setResponse(null);
    try {
      let headers: Record<string, string> = {};
      if (headersText.trim()) {
        try {
          headers = JSON.parse(headersText);
        } catch {
          throw new Error("Headers must be valid JSON");
        }
      }
      const start = performance.now();
      const res = await fetch(url, { method, headers, body: bodyDisabled ? undefined : bodyText || undefined });
      const timeMs = Math.round(performance.now() - start);
      const text = await res.text();
      let pretty = text;
      try {
        pretty = JSON.stringify(JSON.parse(text), null, 2);
      } catch {
        // not JSON — show as-is
      }
      setResponse({ status: res.status, statusText: res.statusText, timeMs, body: pretty });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed — this may be a CORS restriction on the target API.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/learn/practice" className="mb-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-3.5" />
        Practice Zone
      </Link>
      <h1 className="text-2xl font-semibold tracking-tight">API Playground</h1>
      <p className="mt-1 text-muted-foreground">
        Send real HTTP requests straight from your browser and inspect the response. Requests are subject to the target
        API&apos;s CORS policy — public test APIs like jsonplaceholder.typicode.com work well here.
      </p>

      <div className="mt-6 flex gap-2">
        <Select value={method} onValueChange={(v) => v && setMethod(v as Method)}>
          <SelectTrigger className="w-28">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {METHODS.map((m) => (
              <SelectItem key={m} value={m}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://api.example.com/resource"
          className="h-9 flex-1 rounded-md border border-input bg-transparent px-3 text-sm outline-none focus-visible:border-ring"
        />
        <Button className="gap-1.5" disabled={sending || !url} onClick={() => void handleSend()}>
          <Send className="size-3.5" />
          {sending ? "Sending…" : "Send"}
        </Button>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <p className="mb-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">Headers (JSON)</p>
          <Textarea value={headersText} onChange={(e) => setHeadersText(e.target.value)} rows={4} className="font-mono text-xs" spellCheck={false} />
        </div>
        <div>
          <p className="mb-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
            Body{bodyDisabled ? ` (disabled for ${method})` : ""}
          </p>
          <Textarea value={bodyText} onChange={(e) => setBodyText(e.target.value)} rows={4} className="font-mono text-xs" spellCheck={false} disabled={bodyDisabled} />
        </div>
      </div>

      {error && <p className="mt-4 rounded-md border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}

      {response && (
        <div className="mt-4 rounded-lg border border-border">
          <div className="flex items-center gap-3 border-b border-border bg-muted/40 px-3 py-2 text-xs">
            <span className={cn("font-semibold", response.status < 300 ? "text-success" : response.status < 400 ? "text-amber-500" : "text-destructive")}>
              {response.status} {response.statusText}
            </span>
            <span className="text-muted-foreground">{response.timeMs}ms</span>
          </div>
          <pre className="max-h-96 overflow-auto p-3 text-xs">{response.body || "(empty response body)"}</pre>
        </div>
      )}
    </div>
  );
}
