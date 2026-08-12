"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useLiveQuery } from "dexie-react-hooks";
import { Plus, Search } from "lucide-react";
import { db } from "@/lib/notes/db";
import { createNote } from "@/lib/notes/notes-repo";
import type { Note } from "@/lib/notes/types";
import { NoteCard } from "@/components/notes/note-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type SortKey = "updated" | "created" | "title";

export function NotesListPage({
  title,
  description,
  emptyMessage,
  filter,
  icon: Icon,
}: {
  title: string;
  description: string;
  emptyMessage: string;
  filter: (note: Note) => boolean;
  icon: React.ElementType;
}) {
  const router = useRouter();
  const notes = useLiveQuery(() => db.notes.toArray(), []);
  const [query, setQuery] = React.useState("");
  const [sort, setSort] = React.useState<SortKey>("updated");
  const [creating, setCreating] = React.useState(false);

  const filtered = React.useMemo(() => {
    let list = (notes ?? []).filter(filter);
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter((n) => n.title.toLowerCase().includes(q) || n.contentText.toLowerCase().includes(q));
    }
    list = [...list];
    if (sort === "updated") list.sort((a, b) => b.updatedAt - a.updatedAt);
    else if (sort === "created") list.sort((a, b) => b.createdAt - a.createdAt);
    else list.sort((a, b) => a.title.localeCompare(b.title));
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notes, query, sort]);

  async function handleNewNote() {
    setCreating(true);
    try {
      const note = await createNote();
      router.push(`/notes/${note.id}`);
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-1 text-muted-foreground">{description}</p>
        </div>
        <Button onClick={handleNewNote} disabled={creating} className="gap-1.5">
          <Plus className="size-4" />
          New Note
        </Button>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-2">
        <div className="relative max-w-sm flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Filter these notes…" className="h-9 pl-9" />
        </div>
        <div className="flex gap-1">
          {(["updated", "created", "title"] as SortKey[]).map((s) => (
            <Button key={s} variant={sort === s ? "secondary" : "ghost"} size="sm" className="h-8 text-xs capitalize" onClick={() => setSort(s)}>
              {s}
            </Button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border py-16 text-center">
          <Icon className="size-8 text-muted-foreground" />
          <p className="text-muted-foreground">{emptyMessage}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((n) => (
            <NoteCard key={n.id} note={n} />
          ))}
        </div>
      )}
    </div>
  );
}
