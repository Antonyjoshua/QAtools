"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useLiveQuery } from "dexie-react-hooks";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/notes/db";
import { buildSearchIndex } from "@/lib/notes/search";
import { excerpt } from "@/lib/notes/content-utils";
import { DynamicIcon } from "@/components/icon";

export function GlobalSearch() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const router = useRouter();

  const notes = useLiveQuery(() => db.notes.filter((n) => !n.isArchived).toArray(), []);
  const categories = useLiveQuery(() => db.categories.toArray(), []);

  const categoryNameById = React.useMemo(() => {
    const map = new Map<string, string>();
    (categories ?? []).forEach((c) => map.set(c.id, c.name));
    return map;
  }, [categories]);

  const index = React.useMemo(() => {
    if (!notes) return null;
    return buildSearchIndex(notes, categoryNameById);
  }, [notes, categoryNameById]);

  const results = React.useMemo(() => {
    if (!index || !query.trim()) return [];
    return index.search(query).slice(0, 20);
  }, [index, query]);

  const noteById = React.useMemo(() => {
    const map = new Map<string, NonNullable<typeof notes>[number]>();
    (notes ?? []).forEach((n) => map.set(n.id, n));
    return map;
  }, [notes]);

  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  function go(href: string) {
    setOpen(false);
    setQuery("");
    router.push(href);
  }

  return (
    <>
      <Button
        variant="outline"
        className="h-9 w-full max-w-sm justify-start gap-2 px-3 text-muted-foreground font-normal"
        onClick={() => setOpen(true)}
      >
        <Search className="size-4" />
        <span className="flex-1 text-left">Search notes…</span>
        <kbd className="pointer-events-none hidden select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:inline-flex">
          ⌘K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen} title="Search QA Notes" description="Search notes by title, content, tags, or category">
        <CommandInput placeholder="Search title, content, tags, category…" value={query} onValueChange={setQuery} />
        <CommandList>
          <CommandEmpty>{query ? "No notes found." : "Type to search your notes…"}</CommandEmpty>
          {results.length > 0 && (
            <CommandGroup heading="Notes">
              {results.map((r) => {
                const note = noteById.get(String(r.id));
                return (
                  <CommandItem key={r.id} value={String(r.id)} onSelect={() => go(`/notes/${r.id}`)}>
                    <DynamicIcon name={note?.icon ?? "FileText"} className="size-4" />
                    <div className="flex min-w-0 flex-col">
                      <span className="truncate">{note?.title ?? "Untitled"}</span>
                      {note && <span className="truncate text-xs text-muted-foreground">{excerpt(note.contentText, 60)}</span>}
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
