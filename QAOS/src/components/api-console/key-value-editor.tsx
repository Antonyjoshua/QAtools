"use client";

import { Plus, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { uid } from "@/lib/api-console/id";
import type { KeyValue } from "@/lib/api-console/types";

export function KeyValueEditor({
  rows,
  onChange,
  keyPlaceholder = "Key",
  valuePlaceholder = "Value",
}: {
  rows: KeyValue[];
  onChange: (rows: KeyValue[]) => void;
  keyPlaceholder?: string;
  valuePlaceholder?: string;
}) {
  function update(id: string, patch: Partial<KeyValue>) {
    onChange(rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  function add() {
    onChange([...rows, { id: uid(), key: "", value: "", enabled: true }]);
  }

  function remove(id: string) {
    onChange(rows.filter((r) => r.id !== id));
  }

  return (
    <div className="flex flex-col gap-1.5">
      {rows.map((row) => (
        <div key={row.id} className="flex items-center gap-2">
          <Checkbox checked={row.enabled} onCheckedChange={(v) => update(row.id, { enabled: Boolean(v) })} />
          <Input value={row.key} onChange={(e) => update(row.id, { key: e.target.value })} placeholder={keyPlaceholder} className="h-8 flex-1" />
          <Input value={row.value} onChange={(e) => update(row.id, { value: e.target.value })} placeholder={valuePlaceholder} className="h-8 flex-1" />
          <button type="button" onClick={() => remove(row.id)} className="text-muted-foreground hover:text-destructive" aria-label="Remove row">
            <X className="size-3.5" />
          </button>
        </div>
      ))}
      <Button type="button" size="sm" variant="ghost" className="w-fit gap-1.5 text-xs" onClick={add}>
        <Plus className="size-3.5" />
        Add
      </Button>
    </div>
  );
}
