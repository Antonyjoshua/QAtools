"use client";

import { Plus, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function AboutForm({ paragraphs, onChange }: { paragraphs: string[]; onChange: (paragraphs: string[]) => void }) {
  function update(index: number, value: string) {
    onChange(paragraphs.map((p, i) => (i === index ? value : p)));
  }
  function remove(index: number) {
    onChange(paragraphs.filter((_, i) => i !== index));
  }
  return (
    <div className="flex flex-col gap-2">
      {paragraphs.map((p, i) => (
        <div key={i} className="flex gap-1.5">
          <Textarea value={p} onChange={(e) => update(i, e.target.value)} rows={3} className="text-sm" placeholder="A paragraph of your bio…" />
          <Button variant="ghost" size="icon" className="size-7 shrink-0 text-destructive" onClick={() => remove(i)}>
            <X className="size-3.5" />
          </Button>
        </div>
      ))}
      <Button variant="outline" size="sm" className="w-fit gap-1.5" onClick={() => onChange([...paragraphs, ""])}>
        <Plus className="size-3.5" />
        Add paragraph
      </Button>
    </div>
  );
}
