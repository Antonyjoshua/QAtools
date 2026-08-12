"use client";

import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { Globe2 } from "lucide-react";
import { useQuickTimezoneStore } from "@/lib/timezone/store";
import { useTimezone } from "@/lib/timezone/hooks/use-timezone";
import { FavoriteTimezone } from "./favorite-timezone";
import { TimezoneSearch } from "./timezone-search";

export function WorldClock() {
  const { now } = useTimezone();
  const favorites = useQuickTimezoneStore((s) => s.favorites);
  const addFavorite = useQuickTimezoneStore((s) => s.addFavorite);
  const reorderFavorites = useQuickTimezoneStore((s) => s.reorderFavorites);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));
  const sorted = favorites.slice().sort((a, b) => a.order - b.order);

  function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = sorted.findIndex((f) => f.id === active.id);
    const newIndex = sorted.findIndex((f) => f.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    reorderFavorites(arrayMove(sorted, oldIndex, newIndex).map((f) => f.id));
  }

  return (
    <div className="flex flex-col gap-3">
      <TimezoneSearch value={null} onChange={addFavorite} placeholder="Add a city…" />

      {sorted.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-10 text-center">
          <Globe2 className="size-6 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">Pin cities to track their local time here.</p>
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={sorted.map((f) => f.id)} strategy={verticalListSortingStrategy}>
            <div className="flex max-h-80 flex-col gap-2 overflow-y-auto">
              {sorted.map((favorite) => (
                <FavoriteTimezone key={favorite.id} favorite={favorite} now={now} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}
