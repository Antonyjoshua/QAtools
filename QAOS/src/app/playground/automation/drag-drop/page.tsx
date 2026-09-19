"use client";

import { useState, type DragEvent } from "react";
import { cn } from "@/lib/utils";

export default function DragDropPage() {
  const [boxes, setBoxes] = useState<{ id: string; label: string }[]>([
    { id: "a", label: "A" },
    { id: "b", label: "B" },
  ]);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  function handleDragStart(e: DragEvent<HTMLDivElement>, id: string) {
    setDraggingId(id);
    e.dataTransfer.setData("text/plain", id);
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDrop(e: DragEvent<HTMLDivElement>, targetId: string) {
    e.preventDefault();
    const sourceId = e.dataTransfer.getData("text/plain") || draggingId;
    setDragOverId(null);
    setDraggingId(null);
    if (!sourceId || sourceId === targetId) return;
    setBoxes((prev) => {
      const sourceIndex = prev.findIndex((b) => b.id === sourceId);
      const targetIndex = prev.findIndex((b) => b.id === targetId);
      if (sourceIndex === -1 || targetIndex === -1) return prev;
      // Build entirely new box objects rather than mutating prev's in place — a mutating
      // updater breaks under React 18 Strict Mode's double-invocation of state updaters,
      // since the second invocation would see its own first invocation's side effect.
      return prev.map((box, i) => {
        if (i === sourceIndex) return { ...box, label: prev[targetIndex].label };
        if (i === targetIndex) return { ...box, label: prev[sourceIndex].label };
        return box;
      });
    });
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Drag box A onto box B (or vice versa) to swap their labels. Uses the native HTML5
        drag-and-drop API.
      </p>
      <div className="flex gap-6">
        {boxes.map((box) => (
          <div
            key={box.id}
            data-testid={`drag-box-${box.id}`}
            draggable
            onDragStart={(e) => handleDragStart(e, box.id)}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOverId(box.id);
            }}
            onDragLeave={() => setDragOverId((cur) => (cur === box.id ? null : cur))}
            onDrop={(e) => handleDrop(e, box.id)}
            className={cn(
              "flex size-32 cursor-grab items-center justify-center rounded-lg border-2 border-dashed text-2xl font-bold select-none active:cursor-grabbing",
              dragOverId === box.id ? "border-primary bg-primary/10" : "border-border bg-card"
            )}
          >
            {box.label}
          </div>
        ))}
      </div>
    </div>
  );
}
