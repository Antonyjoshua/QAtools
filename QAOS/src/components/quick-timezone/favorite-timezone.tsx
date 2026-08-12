"use client";

import * as React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Sun, Moon, Pencil, Trash2, Check, X } from "lucide-react";
import { resolveTimezone, isDaytime } from "@/lib/timezone/timezone";
import { formatTime, formatDate, formatWeekday } from "@/lib/timezone/formatter";
import { useQuickTimezoneStore } from "@/lib/timezone/store";
import type { FavoriteTimezone as FavoriteTimezoneType } from "@/lib/timezone/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export function FavoriteTimezone({ favorite, now }: { favorite: FavoriteTimezoneType; now: Date }) {
  const use24Hour = useQuickTimezoneStore((s) => s.settings.use24Hour);
  const dateFormat = useQuickTimezoneStore((s) => s.settings.dateFormat);
  const renameFavorite = useQuickTimezoneStore((s) => s.renameFavorite);
  const removeFavorite = useQuickTimezoneStore((s) => s.removeFavorite);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: favorite.id });
  const [renaming, setRenaming] = React.useState(false);
  const [draftName, setDraftName] = React.useState(favorite.customName ?? "");

  const info = resolveTimezone(favorite.timezoneId, now);
  const day = isDaytime(now, favorite.timezoneId);
  const weekday = formatWeekday(now, favorite.timezoneId);

  function commitRename() {
    renameFavorite(favorite.id, draftName.trim() || null);
    setRenaming(false);
  }

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn("group flex items-center gap-2 rounded-xl border border-border bg-card p-3", isDragging && "opacity-50 shadow-lg")}
    >
      <button
        type="button"
        className="cursor-grab touch-none text-muted-foreground/50 hover:text-muted-foreground"
        {...attributes}
        {...listeners}
        aria-label="Drag to reorder"
      >
        <GripVertical className="size-4" />
      </button>

      <div className={cn("flex size-8 shrink-0 items-center justify-center rounded-full", day ? "bg-warning/15 text-warning" : "bg-chart-2/15 text-chart-2")}>
        {day ? <Sun className="size-4" /> : <Moon className="size-4" />}
      </div>

      <div className="min-w-0 flex-1">
        {renaming ? (
          <div className="flex items-center gap-1">
            <Input
              autoFocus
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              placeholder={info.city}
              className="h-7 text-sm"
              onKeyDown={(e) => {
                if (e.key === "Enter") commitRename();
                if (e.key === "Escape") setRenaming(false);
              }}
            />
            <Button variant="ghost" size="icon" className="size-6" aria-label="Save name" onClick={commitRename}>
              <Check className="size-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="size-6" aria-label="Cancel" onClick={() => setRenaming(false)}>
              <X className="size-3.5" />
            </Button>
          </div>
        ) : (
          <p className="truncate text-sm font-medium">{favorite.customName || info.city}</p>
        )}
        <p className="truncate text-xs text-muted-foreground">
          {weekday} · {formatDate(now, favorite.timezoneId, dateFormat)} · UTC{info.offsetLabel}
        </p>
      </div>

      <div className="text-right">
        <p className="font-mono text-lg font-semibold tabular-nums">{formatTime(now, favorite.timezoneId, use24Hour)}</p>
        <p className="text-[10px] text-muted-foreground">{info.abbreviation}</p>
      </div>

      {!renaming && (
        <div className="flex shrink-0 flex-col opacity-0 transition-opacity group-hover:opacity-100">
          <Button variant="ghost" size="icon" className="size-6" aria-label="Rename" onClick={() => setRenaming(true)}>
            <Pencil className="size-3" />
          </Button>
          <Button variant="ghost" size="icon" className="size-6 text-destructive" aria-label="Remove" onClick={() => removeFavorite(favorite.id)}>
            <Trash2 className="size-3" />
          </Button>
        </div>
      )}
    </div>
  );
}
