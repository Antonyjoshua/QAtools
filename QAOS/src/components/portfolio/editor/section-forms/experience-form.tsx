"use client";

import { Plus, Trash2, GripVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { LabeledBulletList } from "./labeled-bullet-list";
import { uid } from "@/lib/portfolio/id";
import type { PortfolioExperienceItem } from "@/lib/portfolio/types";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <Label className="text-[11px] text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

export function ExperienceForm({ items, onChange }: { items: PortfolioExperienceItem[]; onChange: (items: PortfolioExperienceItem[]) => void }) {
  function update(id: string, patch: Partial<PortfolioExperienceItem>) {
    onChange(items.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  }
  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => (
        <div key={item.id} className="flex gap-2 rounded-lg border border-border p-3">
          <GripVertical className="mt-2 size-3.5 shrink-0 text-muted-foreground/40" />
          <div className="grid flex-1 grid-cols-2 gap-2">
            <Field label="Role">
              <Input value={item.role} onChange={(e) => update(item.id, { role: e.target.value })} className="h-8 text-sm" />
            </Field>
            <Field label="Company">
              <Input value={item.company} onChange={(e) => update(item.id, { company: e.target.value })} className="h-8 text-sm" />
            </Field>
            <Field label="Period">
              <Input value={item.period} onChange={(e) => update(item.id, { period: e.target.value })} className="h-8 text-sm" placeholder="e.g. Jan 2024 – Present" />
            </Field>
            <div className="flex items-end gap-2 pb-1.5">
              <Checkbox checked={item.current} onCheckedChange={(v) => update(item.id, { current: Boolean(v) })} />
              <span className="text-xs text-muted-foreground">Current role</span>
            </div>
            <LabeledBulletList label="Highlights" addLabel="Add highlight" placeholder="Achievement or responsibility…" items={item.highlights} onChange={(highlights) => update(item.id, { highlights })} />
            <LabeledBulletList label="Tech / tags" addLabel="Add tag" placeholder="e.g. Playwright" items={item.tech} onChange={(tech) => update(item.id, { tech })} />
          </div>
          <Button variant="ghost" size="icon" className="size-7 shrink-0 text-destructive" onClick={() => onChange(items.filter((i) => i.id !== item.id))}>
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      ))}
      <Button
        variant="outline"
        size="sm"
        className="w-fit gap-1.5"
        onClick={() => onChange([...items, { id: uid(), company: "", role: "", period: "", current: false, highlights: [], tech: [] }])}
      >
        <Plus className="size-3.5" />
        Add experience
      </Button>
    </div>
  );
}
