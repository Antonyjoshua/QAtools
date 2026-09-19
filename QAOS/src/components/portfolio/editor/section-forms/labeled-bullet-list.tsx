"use client";

import { Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function LabeledBulletList({
  label,
  addLabel,
  placeholder,
  items,
  onChange,
}: {
  label: string;
  addLabel: string;
  placeholder?: string;
  items: string[];
  onChange: (items: string[]) => void;
}) {
  function update(index: number, value: string) {
    onChange(items.map((b, i) => (i === index ? value : b)));
  }
  function remove(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }
  return (
    <div className="col-span-2 flex flex-col gap-1.5">
      <span className="text-[11px] text-muted-foreground">{label}</span>
      {items.map((b, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <Input value={b} onChange={(e) => update(i, e.target.value)} className="h-8 text-sm" placeholder={placeholder} />
          <Button variant="ghost" size="icon" className="size-7 shrink-0 text-destructive" onClick={() => remove(i)}>
            <X className="size-3.5" />
          </Button>
        </div>
      ))}
      <Button variant="outline" size="sm" className="w-fit gap-1.5" onClick={() => onChange([...items, ""])}>
        <Plus className="size-3.5" />
        {addLabel}
      </Button>
    </div>
  );
}
