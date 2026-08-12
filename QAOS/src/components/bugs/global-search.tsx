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
import { db } from "@/lib/bugs/db";
import { buildBugSearchIndex } from "@/lib/bugs/search";
import { StatusBadge } from "@/components/bugs/status-badges";

export function GlobalSearch() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const router = useRouter();

  const bugs = useLiveQuery(() => db.bugs.toArray(), []);
  const projects = useLiveQuery(() => db.projects.toArray(), []);
  const modules = useLiveQuery(() => db.modules.toArray(), []);

  const projectNameById = React.useMemo(() => new Map((projects ?? []).map((p) => [p.id, p.name])), [projects]);
  const moduleNameById = React.useMemo(() => new Map((modules ?? []).map((m) => [m.id, m.name])), [modules]);

  const index = React.useMemo(() => {
    if (!bugs) return null;
    return buildBugSearchIndex(bugs, projectNameById, moduleNameById);
  }, [bugs, projectNameById, moduleNameById]);

  const results = React.useMemo(() => {
    if (!index || !query.trim()) return [];
    return index.search(query).slice(0, 20);
  }, [index, query]);

  const bugById = React.useMemo(() => {
    const map = new Map<string, NonNullable<typeof bugs>[number]>();
    (bugs ?? []).forEach((b) => map.set(b.id, b));
    return map;
  }, [bugs]);

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
        <span className="flex-1 text-left">Search bug reports…</span>
        <kbd className="pointer-events-none hidden select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:inline-flex">
          ⌘K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen} title="Search BugForge" description="Search bugs by ID, title, module, severity, priority, status, reporter">
        <CommandInput placeholder="Search bug ID, title, module, status…" value={query} onValueChange={setQuery} />
        <CommandList>
          <CommandEmpty>{query ? "No bug reports found." : "Type to search…"}</CommandEmpty>
          {results.length > 0 && (
            <CommandGroup heading="Bug Reports">
              {results.map((r) => {
                const bug = bugById.get(String(r.id));
                return (
                  <CommandItem key={r.id} value={String(r.id)} onSelect={() => go(`/bugs/${r.id}`)}>
                    <span className="font-mono text-xs text-muted-foreground">{bug?.displayId}</span>
                    <span className="truncate">{bug?.title || "Untitled"}</span>
                    {bug && (
                      <span className="ml-auto">
                        <StatusBadge status={bug.status} />
                      </span>
                    )}
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
