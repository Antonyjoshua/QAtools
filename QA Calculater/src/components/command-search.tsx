"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { CALCULATORS } from "@/lib/calculators/registry";
import { CATEGORY_META, type CalculatorCategory } from "@/lib/calculators/types";

export function CommandSearch() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const categories = Object.keys(CATEGORY_META) as CalculatorCategory[];

  return (
    <>
      <Button
        variant="outline"
        className="h-9 w-full max-w-sm justify-start gap-2 rounded-full text-muted-foreground sm:w-64"
        onClick={() => setOpen(true)}
      >
        <Search className="size-4" />
        <span className="hidden sm:inline">Search calculators…</span>
        <span className="sm:hidden">Search…</span>
        <CommandShortcut className="ml-auto hidden sm:inline">Ctrl K</CommandShortcut>
      </Button>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Search calculators"
        description="Jump straight to any calculator"
      >
        <Command>
          <CommandInput placeholder="Search 20+ calculators…" />
          <CommandList>
            <CommandEmpty>No calculators found.</CommandEmpty>
            {categories.map((category, i) => {
              const items = CALCULATORS.filter((c) => c.category === category);
              if (!items.length) return null;
              return (
                <React.Fragment key={category}>
                  {i > 0 && <CommandSeparator />}
                  <CommandGroup heading={CATEGORY_META[category].label}>
                    {items.map((calc) => (
                      <CommandItem
                        key={calc.id}
                        value={`${calc.name} ${calc.keywords?.join(" ") ?? ""}`}
                        onSelect={() => {
                          setOpen(false);
                          router.push(`/calculators/${calc.slug}`);
                        }}
                      >
                        <calc.icon className="size-4 text-muted-foreground" />
                        {calc.name}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </React.Fragment>
              );
            })}
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
}
