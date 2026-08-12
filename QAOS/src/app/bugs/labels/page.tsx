"use client";

import * as React from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { Plus, Trash2, Tag } from "lucide-react";
import { db } from "@/lib/bugs/db";
import { uid } from "@/lib/bugs/id";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const COLOR_OPTIONS = [
  "oklch(0.577 0.245 27)",
  "oklch(0.64 0.19 42)",
  "oklch(0.75 0.16 75)",
  "oklch(0.6 0.18 280)",
  "oklch(0.58 0.135 168)",
  "oklch(0.6 0.16 45)",
  "oklch(0.6 0.14 320)",
];

export default function LabelsPage() {
  const labels = useLiveQuery(() => db.labels.toArray(), []);
  const [name, setName] = React.useState("");
  const [color, setColor] = React.useState(COLOR_OPTIONS[0]);

  async function handleAdd() {
    if (!name.trim()) return;
    await db.labels.add({ id: uid(), name: name.trim(), color, isCustom: true });
    setName("");
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold tracking-tight">Labels</h1>
      <p className="mt-1 text-muted-foreground">Custom labels for tagging bug reports — e.g. Regression, Smoke, High Risk, Release Blocker.</p>

      <div className="mt-6 rounded-xl border border-border bg-card p-4">
        <div className="flex flex-wrap gap-2">
          {(labels ?? []).map((l) => (
            <span key={l.id} className="group inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-white" style={{ backgroundColor: l.color }}>
              <Tag className="size-3" />
              {l.name}
              <button onClick={() => db.labels.delete(l.id)} className="ml-1 opacity-0 transition-opacity group-hover:opacity-100">
                <Trash2 className="size-3" />
              </button>
            </span>
          ))}
          {(labels ?? []).length === 0 && <p className="text-sm text-muted-foreground">No labels yet.</p>}
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-3 rounded-xl border border-border bg-card p-4">
        <p className="text-xs font-medium text-muted-foreground">Add a custom label</p>
        <div className="flex gap-2">
          <Input value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAdd()} placeholder="Label name" className="h-8" />
          <Button size="sm" className="h-8 gap-1.5" onClick={handleAdd}>
            <Plus className="size-3.5" />
            Add
          </Button>
        </div>
        <div className="flex items-center gap-1.5">
          {COLOR_OPTIONS.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={cn("size-6 rounded-full border-2", color === c ? "border-foreground" : "border-transparent")}
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
