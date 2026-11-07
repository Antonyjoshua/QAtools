"use client";

import { CheckCircle2, XCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { SendResult } from "@/lib/api-console/send-request";
import type { AssertionResult } from "@/lib/api-console/types";

function statusClass(status: number): string {
  if (status >= 200 && status < 300) return "border-success/40 text-success";
  if (status >= 300 && status < 400) return "border-chart-2/40 text-chart-2";
  if (status >= 400 && status < 500) return "border-warning/40 text-warning";
  if (status >= 500) return "border-destructive/40 text-destructive";
  return "border-border text-muted-foreground";
}

function prettyBody(body: string): string {
  try {
    return JSON.stringify(JSON.parse(body), null, 2);
  } catch {
    return body;
  }
}

export function ResponsePanel({ result, assertionResults }: { result: SendResult | null; assertionResults: AssertionResult[] | null }) {
  if (!result) {
    return <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Send a request to see the response here.</div>;
  }

  if (result.error) {
    return (
      <div className="flex flex-col gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-4">
        <p className="flex items-center gap-1.5 text-sm font-medium text-destructive">
          <XCircle className="size-4" />
          Request failed
        </p>
        <p className="text-xs text-muted-foreground">{result.error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Badge variant="outline" className={cn("font-mono", statusClass(result.status))}>
          {result.status} {result.statusText}
        </Badge>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="size-3" />
          {result.durationMs}ms
        </span>
        <span className="text-xs text-muted-foreground">{new Blob([result.body]).size.toLocaleString("en-US")} bytes</span>
      </div>

      <Tabs defaultValue="body">
        <TabsList>
          <TabsTrigger value="body">Body</TabsTrigger>
          <TabsTrigger value="headers">Headers ({Object.keys(result.headers).length})</TabsTrigger>
          {assertionResults && assertionResults.length > 0 && (
            <TabsTrigger value="assertions">
              Assertions ({assertionResults.filter((a) => a.passed).length}/{assertionResults.length})
            </TabsTrigger>
          )}
        </TabsList>

        <TabsContent value="body" className="pt-3">
          <pre className="max-h-[420px] overflow-auto rounded-lg border border-border bg-card p-3 text-xs">{prettyBody(result.body) || "(empty body)"}</pre>
        </TabsContent>

        <TabsContent value="headers" className="pt-3">
          <div className="flex max-h-[420px] flex-col divide-y divide-border overflow-auto rounded-lg border border-border">
            {Object.entries(result.headers).map(([key, value]) => (
              <div key={key} className="flex gap-2 px-3 py-1.5 text-xs">
                <span className="font-mono text-muted-foreground">{key}:</span>
                <span className="break-all font-mono">{value}</span>
              </div>
            ))}
          </div>
        </TabsContent>

        {assertionResults && (
          <TabsContent value="assertions" className="pt-3">
            <div className="flex flex-col gap-1.5">
              {assertionResults.map((a) => (
                <div key={a.assertionId} className="flex items-start gap-2 rounded-lg border border-border p-2 text-xs">
                  {a.passed ? (
                    <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-success" />
                  ) : (
                    <XCircle className="mt-0.5 size-3.5 shrink-0 text-destructive" />
                  )}
                  <div>
                    <p className="font-medium">{a.description}</p>
                    <p className="text-muted-foreground">{a.message}</p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}
