"use client";

import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import type { FailureAnalysis } from "@/lib/generator/tools/regex-engine";

export function RegexMatchPanel({
  matches,
  testText,
  hasPattern,
  failure,
}: {
  matches: RegExpMatchArray[];
  testText: string;
  hasPattern: boolean;
  failure: FailureAnalysis | null;
}) {
  if (!hasPattern) return null;

  const matched = matches.length > 0;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <Label className="text-xs text-muted-foreground">Match Details</Label>
        {matched ? (
          <Badge className="gap-1 bg-status-good/15 text-status-good ring-1 ring-status-good/30" variant="secondary">
            <CheckCircle2 className="size-3.5" /> MATCH — {matches.length} match{matches.length === 1 ? "" : "es"} found
          </Badge>
        ) : (
          <Badge className="gap-1 bg-status-critical/15 text-status-critical ring-1 ring-status-critical/30" variant="secondary">
            <XCircle className="size-3.5" /> NO MATCH
          </Badge>
        )}
      </div>

      {matched ? (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {matches.map((m, i) => {
            const start = m.index ?? 0;
            const end = start + m[0].length;
            const numberedGroups = m.slice(1).map((g, gi) => ({ label: `Group ${gi + 1}`, value: g }));
            const namedGroups = m.groups ? Object.entries(m.groups).map(([k, v]) => ({ label: k, value: v })) : [];
            const groups = [...numberedGroups, ...namedGroups];
            return (
              <div key={i} className="rounded-lg border border-border bg-card p-3 text-sm">
                <p className="text-xs font-medium text-muted-foreground">Match #{i + 1}</p>
                <p className="mt-1 truncate font-mono">{m[0] || "(empty match)"}</p>
                <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
                  <span>Start: {start}</span>
                  <span>End: {end}</span>
                </div>
                {groups.length > 0 && (
                  <div className="mt-2 flex flex-col gap-0.5 border-t border-border pt-2 text-xs">
                    {groups.map((g, gi) => (
                      <div key={gi} className="flex gap-1.5">
                        <span className="text-muted-foreground">{g.label}:</span>
                        <span className="font-mono">{g.value ?? "—"}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col gap-3 rounded-lg border border-border bg-card p-3 text-sm">
          <p className="text-muted-foreground">
            {testText ? "The supplied test string does not contain text satisfying this pattern." : "Add some test text above to check for a match."}
          </p>
          {failure && testText && (
            <div className="flex flex-col gap-2 border-t border-border pt-3">
              <p className="flex items-center gap-1.5 text-xs font-medium text-status-warning">
                <AlertTriangle className="size-3.5" /> Why did this fail? — {failure.headline}
              </p>
              <p className="text-xs text-muted-foreground">{failure.detail}</p>
              {failure.expected !== undefined && failure.received !== undefined && (
                <div className="grid grid-cols-1 gap-2 font-mono text-xs sm:grid-cols-2">
                  <div className="rounded-md bg-status-good/10 p-2 text-status-good">
                    <span className="block text-[10px] font-sans uppercase tracking-wide text-muted-foreground">Expected (example)</span>
                    {failure.expected || "(empty)"}
                  </div>
                  <div className="rounded-md bg-status-critical/10 p-2 text-status-critical">
                    <span className="block text-[10px] font-sans uppercase tracking-wide text-muted-foreground">Received</span>
                    {failure.received || "(empty)"}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
