"use client";

import { Plus, Trash2, GripVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export interface FieldSpec<T> {
  key: keyof T;
  label: string;
  placeholder?: string;
  type?: "text" | "month";
  span?: 1 | 2;
}

export function GenericListEditor<T extends { id: string }>({
  items,
  fields,
  onChange,
  addLabel,
  makeBlank,
}: {
  items: T[];
  fields: FieldSpec<T>[];
  onChange: (items: T[]) => void;
  addLabel: string;
  makeBlank: () => T;
}) {
  function updateItem(id: string, key: keyof T, value: string) {
    onChange(items.map((item) => (item.id === id ? { ...item, [key]: value } : item)));
  }

  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => (
        <div key={item.id} className="flex gap-2 rounded-lg border border-border p-3">
          <GripVertical className="mt-2 size-3.5 shrink-0 text-muted-foreground/40" />
          <div className="grid flex-1 grid-cols-2 gap-2">
            {fields.map((f) => (
              <div key={String(f.key)} className={f.span === 2 ? "col-span-2 flex flex-col gap-1" : "flex flex-col gap-1"}>
                <Label className="text-[11px] text-muted-foreground">{f.label}</Label>
                <Input
                  type={f.type === "month" ? "month" : "text"}
                  value={String(item[f.key] ?? "")}
                  placeholder={f.placeholder}
                  onChange={(e) => updateItem(item.id, f.key, e.target.value)}
                  className="h-8 text-sm"
                />
              </div>
            ))}
          </div>
          <Button variant="ghost" size="icon" className="size-7 shrink-0 text-destructive" onClick={() => onChange(items.filter((i) => i.id !== item.id))}>
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      ))}
      <Button variant="outline" size="sm" className="w-fit gap-1.5" onClick={() => onChange([...items, makeBlank()])}>
        <Plus className="size-3.5" />
        {addLabel}
      </Button>
    </div>
  );
}
