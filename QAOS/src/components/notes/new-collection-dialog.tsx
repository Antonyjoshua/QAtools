"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { db } from "@/lib/notes/db";
import { uid } from "@/lib/notes/id";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DynamicIcon } from "@/components/icon";
import { cn } from "@/lib/utils";

const ICON_OPTIONS = ["FolderOpen", "BookOpen", "Code2", "Target", "Award", "Building2", "MessagesSquare", "Bot"];
const COLOR_OPTIONS = [
  "oklch(0.58 0.135 168)",
  "oklch(0.6 0.16 45)",
  "oklch(0.6 0.18 280)",
  "oklch(0.65 0.2 25)",
  "oklch(0.6 0.14 320)",
  "oklch(0.75 0.16 75)",
];

export function NewCollectionDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const router = useRouter();
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [icon, setIcon] = React.useState(ICON_OPTIONS[0]);
  const [color, setColor] = React.useState(COLOR_OPTIONS[0]);

  async function handleCreate() {
    if (!name.trim()) return;
    const id = uid();
    await db.collections.add({ id, name: name.trim(), description: description.trim(), icon, color, createdAt: Date.now() });
    setName("");
    setDescription("");
    onOpenChange(false);
    router.push(`/notes/collections/${id}`);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Collection</DialogTitle>
          <DialogDescription>Group related notes together, e.g. &ldquo;Interview Preparation&rdquo;.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Collection name" autoFocus />
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description (optional)" rows={2} />
          <div className="flex items-center gap-1.5">
            {ICON_OPTIONS.map((i) => (
              <button
                key={i}
                onClick={() => setIcon(i)}
                className={cn("flex size-8 items-center justify-center rounded-lg border hover:bg-muted", icon === i ? "border-primary" : "border-border")}
              >
                <DynamicIcon name={i} className="size-4" />
              </button>
            ))}
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
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!name.trim()} className="gap-1.5">
            <Plus className="size-3.5" />
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
