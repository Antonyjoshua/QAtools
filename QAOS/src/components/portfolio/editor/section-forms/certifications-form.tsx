"use client";

import { Plus, Trash2, GripVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { LabeledBulletList } from "./labeled-bullet-list";
import { uid } from "@/lib/portfolio/id";
import type { PortfolioCertification } from "@/lib/portfolio/types";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <Label className="text-[11px] text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

export function CertificationsForm({ items, onChange }: { items: PortfolioCertification[]; onChange: (items: PortfolioCertification[]) => void }) {
  function update(id: string, patch: Partial<PortfolioCertification>) {
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
            <Field label="Subtitle">
              <Input value={item.subtitle} onChange={(e) => update(item.id, { subtitle: e.target.value })} className="h-8 text-sm" />
            </Field>
            <Field label="Issuer">
              <Input value={item.issuer} onChange={(e) => update(item.id, { issuer: e.target.value })} className="h-8 text-sm" />
            </Field>
            <Field label="Date">
              <Input value={item.date} onChange={(e) => update(item.id, { date: e.target.value })} className="h-8 text-sm" placeholder="e.g. Oct 2024" />
            </Field>
            <Field label="Instructor">
              <Input value={item.instructor} onChange={(e) => update(item.id, { instructor: e.target.value })} className="h-8 text-sm" />
            </Field>
            <Field label="Duration">
              <Input value={item.duration} onChange={(e) => update(item.id, { duration: e.target.value })} className="h-8 text-sm" placeholder="e.g. 5 hrs" />
            </Field>
            <LabeledBulletList label="Skills" addLabel="Add skill" placeholder="e.g. Selenium" items={item.skills} onChange={(skills) => update(item.id, { skills })} />
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
        onClick={() => onChange([...items, { id: uid(), title: "", subtitle: "", issuer: "", date: "", instructor: "", duration: "", skills: [] }])}
      >
        <Plus className="size-3.5" />
        Add certification
      </Button>
    </div>
  );
}
