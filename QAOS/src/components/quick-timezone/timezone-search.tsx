"use client";

import * as React from "react";
import { ChevronsUpDown, Check } from "lucide-react";
import { searchTimezones, resolveTimezone } from "@/lib/timezone/timezone";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { cn } from "@/lib/utils";

export function TimezoneSearch({
  value,
  onChange,
  placeholder = "Select timezone…",
  triggerClassName,
}: {
  value: string | null;
  onChange: (id: string) => void;
  placeholder?: string;
  triggerClassName?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");

  const results = React.useMemo(() => searchTimezones(query), [query]);
  const selected = React.useMemo(() => (value ? resolveTimezone(value) : null), [value]);

  return (
    <Popover
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) setQuery("");
      }}
    >
      <PopoverTrigger
        render={
          <button
            type="button"
            className={cn(
              "flex h-10 w-full items-center justify-between gap-2 rounded-lg border border-input bg-transparent px-3 text-sm transition-colors hover:bg-accent/40",
              triggerClassName
            )}
          >
            {selected ? (
              <span className="flex min-w-0 items-center gap-1.5">
                <span className="truncate font-medium">{selected.city}</span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {selected.abbreviation} · {selected.offsetLabel}
                </span>
              </span>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
            <ChevronsUpDown className="size-3.5 shrink-0 text-muted-foreground" />
          </button>
        }
      />
      {/* z-[110]: above the QuickTimezone popup shell (z-[100]) it's nested inside, so the
          portaled dropdown isn't visually covered and doesn't have its clicks intercepted. */}
      <PopoverContent align="start" className="w-80 p-0" positionerClassName="z-[110]">
        <Command shouldFilter={false}>
          <CommandInput placeholder="Search city, country, offset…" value={query} onValueChange={setQuery} />
          <CommandList>
            <CommandEmpty>No matching timezone.</CommandEmpty>
            <CommandGroup heading={query ? "Results" : "Popular"}>
              {results.map((tz) => (
                <CommandItem
                  key={tz.id}
                  value={tz.id}
                  onSelect={() => {
                    onChange(tz.id);
                    setOpen(false);
                    setQuery("");
                  }}
                >
                  <span className="flex min-w-0 flex-1 flex-col">
                    <span className="truncate">{tz.city}</span>
                    <span className="truncate text-xs text-muted-foreground">{tz.region.replace(/_/g, " ")}</span>
                  </span>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {tz.abbreviation} · {tz.offsetLabel}
                  </span>
                  {tz.id === value && <Check className="size-3.5 shrink-0 text-primary" />}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
