"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NoteLogEntry } from "@/components/exploratory/note-log-entry";
import { NOTE_TYPES } from "@/lib/exploratory/types";
import type { SessionNote, NoteType } from "@/lib/exploratory/types";

export function NoteLog({
  notes,
  onAdd,
  onFileBug,
}: {
  notes: SessionNote[];
  onAdd: (type: NoteType, text: string) => void;
  onFileBug: (note: SessionNote) => void;
}) {
  const [type, setType] = React.useState<NoteType>("Note");
  const [text, setText] = React.useState("");

  function handleAdd() {
    if (!text.trim()) return;
    onAdd(type, text.trim());
    setText("");
  }

  const sorted = notes.slice().sort((a, b) => b.timestamp - a.timestamp);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2 rounded-xl border border-border bg-card p-3">
        <div className="flex items-center gap-2">
          <Select value={type} onValueChange={(v) => v !== null && setType(v as NoteType)}>
            <SelectTrigger className="h-8 w-32 shrink-0">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {NOTE_TYPES.map((t) => (
                <SelectItem key={t} value={t}>
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                handleAdd();
              }
            }}
            placeholder="What did you just observe? (⌘/Ctrl + Enter to log)"
            rows={2}
            className="flex-1"
          />
        </div>
        <Button size="sm" className="w-fit gap-1.5" onClick={handleAdd} disabled={!text.trim()}>
          <Plus className="size-3.5" />
          Log entry
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        {sorted.length === 0 && <p className="py-6 text-center text-sm text-muted-foreground">Nothing logged yet — start exploring.</p>}
        {sorted.map((n) => (
          <NoteLogEntry key={n.id} note={n} onFileBug={onFileBug} />
        ))}
      </div>
    </div>
  );
}
