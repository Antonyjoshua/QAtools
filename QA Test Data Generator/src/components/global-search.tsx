"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { ALL_GENERATORS } from "@/lib/generators/registry";
import { CATEGORIES, getCategory } from "@/lib/generators/categories";
import { CUSTOM_TOOLS } from "@/lib/generators/custom-tools";
import { CategoryIcon } from "@/components/icon";

export function GlobalSearch() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

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
        <span className="flex-1 text-left">Search generators…</span>
        <kbd className="pointer-events-none hidden select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:inline-flex">
          ⌘K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen} title="Search TestDataHub" description="Search all generators and tools">
        <CommandInput placeholder="Search generators, categories, tools…" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Categories">
            {CATEGORIES.map((c) => (
              <CommandItem key={c.id} value={`category ${c.name}`} onSelect={() => go(`/category/${c.id}`)}>
                <CategoryIcon name={c.icon} className="size-4" />
                {c.name}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Tools">
            {CUSTOM_TOOLS.map((t) => (
              <CommandItem key={t.slug} value={`tool ${t.name}`} onSelect={() => go(t.href)}>
                <CategoryIcon name={t.icon} className="size-4" />
                {t.name}
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandGroup heading="Generators">
            {ALL_GENERATORS.map((g) => (
              <CommandItem key={g.slug} value={`${g.name} ${g.description} ${g.category}`} onSelect={() => go(`/g/${g.slug}`)}>
                <CategoryIcon name={getCategory(g.category)?.icon ?? "FlaskConical"} className="size-4" />
                <span>{g.name}</span>
                <span className="ml-auto text-xs text-muted-foreground">{getCategory(g.category)?.name}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
