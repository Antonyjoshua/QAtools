"use client";

import * as React from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { X, Plus, Check } from "lucide-react";
import { db } from "@/lib/notes/db";
import type { Note } from "@/lib/notes/types";
import { TAG_PRESETS } from "@/lib/notes/types";
import { updateNote } from "@/lib/notes/notes-repo";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { DynamicIcon } from "@/components/icon";
import { formatDistanceToNow, format } from "date-fns";
import { cn } from "@/lib/utils";

export function NoteMetaPanel({ note }: { note: Note }) {
  const categories = useLiveQuery(() => db.categories.orderBy("order").toArray(), []);
  const collections = useLiveQuery(() => db.collections.toArray(), []);
  const [tagInput, setTagInput] = React.useState("");

  const tops = (categories ?? []).filter((c) => c.parentId === null);

  function addTag(tag: string) {
    const t = tag.trim();
    if (!t || note.tags.includes(t)) return;
    updateNote(note.id, { tags: [...note.tags, t] });
    setTagInput("");
  }

  function removeTag(tag: string) {
    updateNote(note.id, { tags: note.tags.filter((t) => t !== tag) });
  }

  function toggleCollection(id: string) {
    const has = note.collectionIds.includes(id);
    updateNote(note.id, {
      collectionIds: has ? note.collectionIds.filter((c) => c !== id) : [...note.collectionIds, id],
    });
  }

  return (
    <div className="flex flex-col gap-5 text-sm">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-muted-foreground">Category</label>
        <Select
          value={note.categoryId ?? "none"}
          onValueChange={(v) => v !== null && updateNote(note.id, { categoryId: v === "none" ? null : v })}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No category</SelectItem>
            {tops.map((top) => (
              <React.Fragment key={top.id}>
                <SelectItem value={top.id}>{top.name}</SelectItem>
                {(categories ?? [])
                  .filter((c) => c.parentId === top.id)
                  .map((child) => (
                    <SelectItem key={child.id} value={child.id}>
                      &nbsp;&nbsp;{child.name}
                    </SelectItem>
                  ))}
              </React.Fragment>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-muted-foreground">Tags</label>
        <div className="flex flex-wrap gap-1.5">
          {note.tags.map((t) => (
            <Badge key={t} variant="secondary" className="gap-1 pr-1 text-[11px] font-normal">
              {t}
              <button onClick={() => removeTag(t)} className="rounded-full p-0.5 hover:bg-muted-foreground/20">
                <X className="size-2.5" />
              </button>
            </Badge>
          ))}
        </div>
        <div className="flex gap-1.5">
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTag(tagInput);
              }
            }}
            placeholder="Add tag…"
            className="h-8 text-xs"
          />
        </div>
        <div className="flex flex-wrap gap-1">
          {TAG_PRESETS.filter((p) => !note.tags.includes(p)).map((p) => (
            <button
              key={p}
              onClick={() => addTag(p)}
              className="flex items-center gap-0.5 rounded-full border border-dashed border-border px-2 py-0.5 text-[10px] text-muted-foreground hover:border-primary/50 hover:text-foreground"
            >
              <Plus className="size-2.5" /> {p}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-muted-foreground">Collections</label>
        <DropdownMenu>
          <DropdownMenuTrigger className="flex h-8 w-full items-center justify-between rounded-lg border border-input px-2.5 text-xs text-muted-foreground hover:bg-muted">
            {note.collectionIds.length > 0 ? `${note.collectionIds.length} selected` : "Add to collection…"}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            {(collections ?? []).map((c) => (
              <DropdownMenuCheckboxItem
                key={c.id}
                checked={note.collectionIds.includes(c.id)}
                onCheckedChange={() => toggleCollection(c.id)}
              >
                <DynamicIcon name={c.icon} className="size-3.5" style={{ color: c.color }} />
                {c.name}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex flex-wrap gap-1.5">
          {note.collectionIds.map((id) => {
            const c = (collections ?? []).find((col) => col.id === id);
            if (!c) return null;
            return (
              <Badge key={id} variant="outline" className="gap-1 text-[11px] font-normal">
                <DynamicIcon name={c.icon} className="size-3" style={{ color: c.color }} />
                {c.name}
              </Badge>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-1 border-t border-border pt-3 text-xs text-muted-foreground">
        <p>Created {format(note.createdAt, "MMM d, yyyy 'at' h:mm a")}</p>
        <p>Updated {formatDistanceToNow(note.updatedAt, { addSuffix: true })}</p>
        <p>{note.wordCount.toLocaleString("en-US")} words</p>
      </div>
    </div>
  );
}

export function IconPicker({ note }: { note: Note }) {
  const options = ["FileText", "ClipboardCheck", "Bug", "ClipboardList", "Code2", "CheckSquare", "Target", "ListChecks", "BookOpen"];
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex size-10 items-center justify-center rounded-xl border border-border bg-card text-primary transition-colors hover:bg-muted">
        <DynamicIcon name={note.icon} className="size-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="grid grid-cols-5 gap-1 p-2">
        {options.map((o) => (
          <button
            key={o}
            onClick={() => updateNote(note.id, { icon: o })}
            className={cn(
              "relative flex size-8 items-center justify-center rounded-md hover:bg-muted",
              note.icon === o && "bg-accent text-accent-foreground"
            )}
          >
            <DynamicIcon name={o} className="size-4" />
            {note.icon === o && <Check className="absolute size-2.5" />}
          </button>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
