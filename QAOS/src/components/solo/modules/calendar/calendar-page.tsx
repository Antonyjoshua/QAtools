"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/solo/ui/card";
import { Button } from "@/components/solo/ui/button";
import { useAppStore } from "@/lib/solo/store/useAppStore";
import { toDateKey, todayKey } from "@/lib/solo/utils/date";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function CalendarPage() {
  const [cursor, setCursor] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const log = useAppStore((s) => s.xp.log);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDay = new Date(year, month, 1);
  const startOffset = firstDay.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const xpByDate: Record<string, number> = {};
  for (const entry of log) {
    xpByDate[entry.date] = (xpByDate[entry.date] ?? 0) + entry.amount;
  }
  const maxXp = Math.max(1, ...Object.values(xpByDate));

  function intensityClass(xp: number) {
    if (xp <= 0) return "bg-white/[0.03]";
    const ratio = xp / maxXp;
    if (ratio > 0.66) return "bg-[var(--accent)]";
    if (ratio > 0.33) return "bg-[var(--accent)]/50";
    return "bg-[var(--accent)]/25";
  }

  const cells: (string | null)[] = [
    ...Array(startOffset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => toDateKey(new Date(year, month, i + 1))),
  ];

  const today = todayKey();
  const selectedEntries = selectedDate ? log.filter((e) => e.date === selectedDate) : [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold">Calendar</h1>
          <p className="text-sm text-muted-foreground">Your activity, day by day.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="icon" onClick={() => setCursor(new Date(year, month - 1, 1))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-sm font-medium w-32 text-center">
            {cursor.toLocaleDateString(undefined, { month: "long", year: "numeric" })}
          </div>
          <Button variant="secondary" size="icon" onClick={() => setCursor(new Date(year, month + 1, 1))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card className="p-4">
        <div className="grid grid-cols-7 gap-1.5 mb-2">
          {WEEKDAYS.map((d) => (
            <div key={d} className="text-center text-[10px] uppercase tracking-wide text-muted-foreground">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1.5">
          {cells.map((date, i) =>
            date ? (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                className={cn(
                  "aspect-square rounded-md text-xs flex items-center justify-center transition-transform hover:scale-105 border",
                  intensityClass(xpByDate[date] ?? 0),
                  date === today ? "border-[var(--accent)]" : "border-white/5",
                  selectedDate === date && "ring-2 ring-[var(--accent)]"
                )}
              >
                {Number(date.split("-")[2])}
              </button>
            ) : (
              <div key={`empty-${i}`} />
            )
          )}
        </div>
      </Card>

      {selectedDate && (
        <Card className="p-4 space-y-2">
          <div className="text-sm font-semibold">{selectedDate}</div>
          {selectedEntries.length === 0 ? (
            <p className="text-sm text-muted-foreground">No activity logged this day.</p>
          ) : (
            <div className="space-y-1">
              {selectedEntries.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between text-sm">
                  <span className="text-foreground/80">{entry.reason}</span>
                  <span className="text-[var(--accent)] font-medium">+{entry.amount} XP</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
