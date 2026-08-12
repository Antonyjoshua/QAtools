"use client";

import { Plus, Trash2, GripVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { BulletListEditor } from "./bullet-list-editor";
import { uid } from "@/lib/resume/id";
import type { ExperienceItem, EducationItem, ProjectItem } from "@/lib/resume/types";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <Label className="text-[11px] text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

export function ExperienceForm({ items, onChange }: { items: ExperienceItem[]; onChange: (items: ExperienceItem[]) => void }) {
  function update(id: string, patch: Partial<ExperienceItem>) {
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
            <Field label="Location">
              <Input value={item.location} onChange={(e) => update(item.id, { location: e.target.value })} className="h-8 text-sm" />
            </Field>
            <div className="flex items-end gap-2 pb-1.5">
              <Checkbox checked={item.current} onCheckedChange={(v) => update(item.id, { current: Boolean(v) })} />
              <span className="text-xs text-muted-foreground">Current role</span>
            </div>
            <Field label="Start date">
              <Input type="month" value={item.startDate} onChange={(e) => update(item.id, { startDate: e.target.value })} className="h-8 text-sm" />
            </Field>
            <Field label="End date">
              <Input type="month" value={item.endDate} disabled={item.current} onChange={(e) => update(item.id, { endDate: e.target.value })} className="h-8 text-sm" />
            </Field>
            <BulletListEditor bullets={item.bullets} onChange={(bullets) => update(item.id, { bullets })} />
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
        onClick={() =>
          onChange([...items, { id: uid(), company: "", role: "", location: "", startDate: "", endDate: "", current: false, bullets: [] }])
        }
      >
        <Plus className="size-3.5" />
        Add experience
      </Button>
    </div>
  );
}

export function EducationForm({ items, onChange }: { items: EducationItem[]; onChange: (items: EducationItem[]) => void }) {
  function update(id: string, patch: Partial<EducationItem>) {
    onChange(items.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  }
  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => (
        <div key={item.id} className="flex gap-2 rounded-lg border border-border p-3">
          <GripVertical className="mt-2 size-3.5 shrink-0 text-muted-foreground/40" />
          <div className="grid flex-1 grid-cols-2 gap-2">
            <Field label="School">
              <Input value={item.school} onChange={(e) => update(item.id, { school: e.target.value })} className="h-8 text-sm" />
            </Field>
            <Field label="Degree">
              <Input value={item.degree} onChange={(e) => update(item.id, { degree: e.target.value })} className="h-8 text-sm" />
            </Field>
            <Field label="Field of study">
              <Input value={item.field} onChange={(e) => update(item.id, { field: e.target.value })} className="h-8 text-sm" />
            </Field>
            <Field label="GPA">
              <Input value={item.gpa} onChange={(e) => update(item.id, { gpa: e.target.value })} className="h-8 text-sm" />
            </Field>
            <Field label="Start date">
              <Input type="month" value={item.startDate} onChange={(e) => update(item.id, { startDate: e.target.value })} className="h-8 text-sm" />
            </Field>
            <Field label="End date">
              <Input type="month" value={item.endDate} onChange={(e) => update(item.id, { endDate: e.target.value })} className="h-8 text-sm" />
            </Field>
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
        onClick={() => onChange([...items, { id: uid(), school: "", degree: "", field: "", startDate: "", endDate: "", gpa: "" }])}
      >
        <Plus className="size-3.5" />
        Add education
      </Button>
    </div>
  );
}

export function ProjectsForm({ items, onChange }: { items: ProjectItem[]; onChange: (items: ProjectItem[]) => void }) {
  function update(id: string, patch: Partial<ProjectItem>) {
    onChange(items.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  }
  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => (
        <div key={item.id} className="flex gap-2 rounded-lg border border-border p-3">
          <GripVertical className="mt-2 size-3.5 shrink-0 text-muted-foreground/40" />
          <div className="grid flex-1 grid-cols-2 gap-2">
            <Field label="Name">
              <Input value={item.name} onChange={(e) => update(item.id, { name: e.target.value })} className="h-8 text-sm" />
            </Field>
            <Field label="Link">
              <Input value={item.link} onChange={(e) => update(item.id, { link: e.target.value })} className="h-8 text-sm" />
            </Field>
            <div className="col-span-2 flex flex-col gap-1">
              <Label className="text-[11px] text-muted-foreground">Description</Label>
              <Input value={item.description} onChange={(e) => update(item.id, { description: e.target.value })} className="h-8 text-sm" />
            </div>
            <BulletListEditor bullets={item.bullets} onChange={(bullets) => update(item.id, { bullets })} />
          </div>
          <Button variant="ghost" size="icon" className="size-7 shrink-0 text-destructive" onClick={() => onChange(items.filter((i) => i.id !== item.id))}>
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      ))}
      <Button variant="outline" size="sm" className="w-fit gap-1.5" onClick={() => onChange([...items, { id: uid(), name: "", description: "", link: "", bullets: [] }])}>
        <Plus className="size-3.5" />
        Add project
      </Button>
    </div>
  );
}
