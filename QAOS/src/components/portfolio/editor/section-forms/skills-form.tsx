"use client";

import { Plus, Trash2, GripVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { LabeledBulletList } from "./labeled-bullet-list";
import { uid } from "@/lib/portfolio/id";
import type { PortfolioSkillGroup } from "@/lib/portfolio/types";

export function SkillsForm({ items, onChange }: { items: PortfolioSkillGroup[]; onChange: (items: PortfolioSkillGroup[]) => void }) {
  function update(id: string, patch: Partial<PortfolioSkillGroup>) {
    onChange(items.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  }
  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => (
        <div key={item.id} className="flex gap-2 rounded-lg border border-border p-3">
          <GripVertical className="mt-2 size-3.5 shrink-0 text-muted-foreground/40" />
          <div className="grid flex-1 grid-cols-2 gap-2">
            <div className="flex flex-col gap-1">
              <Label className="text-[11px] text-muted-foreground">Category</Label>
              <Input value={item.category} onChange={(e) => update(item.id, { category: e.target.value })} className="h-8 text-sm" />
            </div>
            <div className="flex flex-col gap-1">
              <Label className="text-[11px] text-muted-foreground">Icon (emoji)</Label>
              <Input value={item.icon} onChange={(e) => update(item.id, { icon: e.target.value })} className="h-8 text-sm" />
            </div>
            <LabeledBulletList label="Skills in this group" addLabel="Add skill" placeholder="e.g. Playwright" items={item.items} onChange={(vals) => update(item.id, { items: vals })} />
          </div>
          <Button variant="ghost" size="icon" className="size-7 shrink-0 text-destructive" onClick={() => onChange(items.filter((i) => i.id !== item.id))}>
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      ))}
      <Button variant="outline" size="sm" className="w-fit gap-1.5" onClick={() => onChange([...items, { id: uid(), category: "", icon: "🔧", items: [] }])}>
        <Plus className="size-3.5" />
        Add skill group
      </Button>
    </div>
  );
}
