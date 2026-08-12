"use client";

import { Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function BulletListEditor({ bullets, onChange }: { bullets: string[]; onChange: (bullets: string[]) => void }) {
  function updateBullet(index: number, value: string) {
    onChange(bullets.map((b, i) => (i === index ? value : b)));
  }
  function removeBullet(index: number) {
    onChange(bullets.filter((_, i) => i !== index));
  }
  return (
    <div className="col-span-2 flex flex-col gap-1.5">
      <span className="text-[11px] text-muted-foreground">Bullet points</span>
      {bullets.map((b, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <Input value={b} onChange={(e) => updateBullet(i, e.target.value)} className="h-8 text-sm" placeholder="Achievement or responsibility…" />
          <Button variant="ghost" size="icon" className="size-7 shrink-0 text-destructive" onClick={() => removeBullet(i)}>
            <X className="size-3.5" />
          </Button>
        </div>
      ))}
      <Button variant="outline" size="sm" className="w-fit gap-1.5" onClick={() => onChange([...bullets, ""])}>
        <Plus className="size-3.5" />
        Add bullet
      </Button>
    </div>
  );
}
