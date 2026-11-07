"use client";

import { Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { uid } from "@/lib/api-console/id";
import { ASSERTION_TYPES } from "@/lib/api-console/types";
import type { Assertion, AssertionType } from "@/lib/api-console/types";

const TYPE_LABEL: Record<AssertionType, string> = {
  status: "Status code",
  header: "Header",
  bodyContains: "Body contains",
  jsonPath: "JSON path",
  responseTime: "Response time",
};

export function AssertionsEditor({ assertions, onChange }: { assertions: Assertion[]; onChange: (assertions: Assertion[]) => void }) {
  function update(id: string, patch: Partial<Assertion>) {
    onChange(assertions.map((a) => (a.id === id ? { ...a, ...patch } : a)));
  }

  function add() {
    onChange([...assertions, { id: uid(), type: "status", expected: "200" }]);
  }

  function remove(id: string) {
    onChange(assertions.filter((a) => a.id !== id));
  }

  return (
    <div className="flex flex-col gap-2">
      {assertions.length === 0 && <p className="text-xs text-muted-foreground">No assertions yet — checked automatically after each send.</p>}
      {assertions.map((a) => (
        <div key={a.id} className="flex items-center gap-2">
          <Select value={a.type} onValueChange={(v) => v !== null && update(a.id, { type: v as AssertionType })}>
            <SelectTrigger className="h-8 w-40 shrink-0">
              <SelectValue>{(v: string) => TYPE_LABEL[v as AssertionType]}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {ASSERTION_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {TYPE_LABEL[t]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {(a.type === "header" || a.type === "jsonPath") && (
            <Input
              value={a.key ?? ""}
              onChange={(e) => update(a.id, { key: e.target.value })}
              placeholder={a.type === "header" ? "Header name" : "e.g. data.id"}
              className="h-8 flex-1"
            />
          )}

          {a.type === "responseTime" ? (
            <Input
              type="number"
              value={a.maxMs ?? 0}
              onChange={(e) => update(a.id, { maxMs: Number(e.target.value) || 0 })}
              placeholder="Max ms"
              className="h-8 flex-1"
            />
          ) : (
            <Input value={a.expected ?? ""} onChange={(e) => update(a.id, { expected: e.target.value })} placeholder="Expected value" className="h-8 flex-1" />
          )}

          <button type="button" onClick={() => remove(a.id)} className="text-muted-foreground hover:text-destructive" aria-label="Remove assertion">
            <X className="size-3.5" />
          </button>
        </div>
      ))}
      <Button type="button" size="sm" variant="ghost" className="w-fit gap-1.5 text-xs" onClick={add}>
        <Plus className="size-3.5" />
        Add assertion
      </Button>
    </div>
  );
}
