"use client";

import * as React from "react";
import { ChevronDown, ChevronUp, ListChecks } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CHEAT_SHEET } from "@/lib/generator/tools/regex-reference-data";

export function RegexCheatSheetPanel({ defaultOpen }: { defaultOpen: boolean }) {
  const [open, setOpen] = React.useState(defaultOpen);

  return (
    <Collapsible open={open} onOpenChange={setOpen} className="rounded-lg border border-border bg-card">
      <CollapsibleTrigger className="flex w-full items-center justify-between px-3 py-2.5 text-left">
        <Label className="flex cursor-pointer items-center gap-1.5 text-xs text-muted-foreground">
          <ListChecks className="size-3.5" /> Regex Cheat Sheet
        </Label>
        {open ? <ChevronUp className="size-4 text-muted-foreground" /> : <ChevronDown className="size-4 text-muted-foreground" />}
      </CollapsibleTrigger>
      <CollapsibleContent className="border-t border-border px-3 pt-3">
        <div className="flex flex-col gap-4">
          {CHEAT_SHEET.map((group) => (
            <div key={group.title} className="flex flex-col gap-1.5">
              <p className="text-xs font-medium text-foreground">{group.title}</p>
              <div className="flex flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <Popover key={item.token}>
                    <PopoverTrigger className="rounded-md border border-border bg-background px-2 py-1 font-mono text-xs transition-colors hover:bg-muted">
                      {item.token}
                    </PopoverTrigger>
                    <PopoverContent className="w-72" side="top">
                      <dl className="grid grid-cols-[auto_1fr] gap-x-2 gap-y-1 text-xs">
                        <dt className="font-medium text-muted-foreground">Meaning</dt>
                        <dd>{item.meaning}</dd>
                        <dt className="font-medium text-muted-foreground">Example</dt>
                        <dd className="font-mono">{item.example}</dd>
                        <dt className="font-medium text-muted-foreground">QA use case</dt>
                        <dd>{item.qaUseCase}</dd>
                      </dl>
                    </PopoverContent>
                  </Popover>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
