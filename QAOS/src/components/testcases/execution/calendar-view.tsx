"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Execution } from "@/lib/testcases/types";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function RunCalendar({ executions }: { executions: Execution[] }) {
  const today = new Date();
  const [cursor, setCursor] = React.useState(() => new Date(today.getFullYear(), today.getMonth(), 1));

  const byDay = React.useMemo(() => {
    const map = new Map<string, Execution[]>();
    for (const ex of executions) {
      if (!ex.scheduledFor) continue;
      const key = new Date(ex.scheduledFor).toDateString();
      const list = map.get(key) ?? [];
      list.push(ex);
      map.set(key, list);
    }
    return map;
  }, [executions]);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const startOffset = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (Date | null)[] = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">{cursor.toLocaleDateString(undefined, { month: "long", year: "numeric" })}</h3>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" className="size-7" onClick={() => setCursor(new Date(year, month - 1, 1))} aria-label="Previous month">
            <ChevronLeft className="size-3.5" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-7 px-2 text-xs"
            onClick={() => setCursor(new Date(today.getFullYear(), today.getMonth(), 1))}
          >
            Today
          </Button>
          <Button variant="outline" size="icon" className="size-7" onClick={() => setCursor(new Date(year, month + 1, 1))} aria-label="Next month">
            <ChevronRight className="size-3.5" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px overflow-hidden rounded-xl border border-border bg-border text-xs">
        {WEEKDAYS.map((d) => (
          <div key={d} className="bg-card px-2 py-1.5 text-center font-medium text-muted-foreground">
            {d}
          </div>
        ))}
        {cells.map((date, i) => {
          const isToday = Boolean(date && date.toDateString() === today.toDateString());
          const dayExecutions = date ? (byDay.get(date.toDateString()) ?? []) : [];
          return (
            <div key={i} className={cn("min-h-24 bg-card p-1.5", !date && "bg-muted/30")}>
              {date && (
                <>
                  <span
                    className={cn(
                      "inline-flex size-5 items-center justify-center rounded-full text-[11px]",
                      isToday && "bg-primary font-semibold text-primary-foreground"
                    )}
                  >
                    {date.getDate()}
                  </span>
                  <div className="mt-1 flex flex-col gap-1">
                    {dayExecutions.map((ex) => (
                      <Link
                        key={ex.id}
                        href={`/testcases/runs/${ex.id}`}
                        className="block truncate rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-medium text-primary hover:bg-primary/20"
                        title={ex.name}
                      >
                        {ex.name}
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {executions.every((e) => !e.scheduledFor) && (
        <p className="text-center text-xs text-muted-foreground">No runs have a scheduled date yet — set one when creating a run.</p>
      )}
    </div>
  );
}
