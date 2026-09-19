"use client";

import { Plus, Trash2, GripVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { LabeledBulletList } from "./labeled-bullet-list";
import { uid } from "@/lib/portfolio/id";
import type { PortfolioProjectItem } from "@/lib/portfolio/types";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <Label className="text-[11px] text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

export function ProjectsForm({ items, onChange }: { items: PortfolioProjectItem[]; onChange: (items: PortfolioProjectItem[]) => void }) {
  function update(id: string, patch: Partial<PortfolioProjectItem>) {
    onChange(items.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  }
  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => (
        <div key={item.id} className="flex gap-2 rounded-lg border border-border p-3">
          <GripVertical className="mt-2 size-3.5 shrink-0 text-muted-foreground/40" />
          <div className="grid flex-1 grid-cols-2 gap-2">
            <Field label="Title">
              <Input value={item.title} onChange={(e) => update(item.id, { title: e.target.value })} className="h-8 text-sm" />
            </Field>
            <Field label="Subtitle / domain">
              <Input value={item.subtitle} onChange={(e) => update(item.id, { subtitle: e.target.value })} className="h-8 text-sm" placeholder="e.g. EdTech · Live Streaming" />
            </Field>
            <Field label="Company">
              <Input value={item.company} onChange={(e) => update(item.id, { company: e.target.value })} className="h-8 text-sm" />
            </Field>
            <Field label="Status">
              <Input value={item.status} onChange={(e) => update(item.id, { status: e.target.value })} className="h-8 text-sm" placeholder="e.g. live, enterprise" />
            </Field>
            <Field label="Live URL">
              <Input value={item.liveUrl} onChange={(e) => update(item.id, { liveUrl: e.target.value })} className="h-8 text-sm" />
            </Field>
            <Field label="GitHub URL">
              <Input value={item.githubUrl} onChange={(e) => update(item.id, { githubUrl: e.target.value })} className="h-8 text-sm" />
            </Field>
            <div className="col-span-2 flex flex-col gap-1">
              <Label className="text-[11px] text-muted-foreground">Description</Label>
              <Input value={item.description} onChange={(e) => update(item.id, { description: e.target.value })} className="h-8 text-sm" />
            </div>
            <LabeledBulletList label="Tags" addLabel="Add tag" placeholder="e.g. TypeScript" items={item.tags} onChange={(tags) => update(item.id, { tags })} />
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
        onClick={() => onChange([...items, { id: uid(), title: "", subtitle: "", company: "", description: "", tags: [], liveUrl: "", githubUrl: "", status: "" }])}
      >
        <Plus className="size-3.5" />
        Add project
      </Button>
    </div>
  );
}
