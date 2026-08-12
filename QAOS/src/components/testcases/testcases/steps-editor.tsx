"use client";

import * as React from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Plus, Copy, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { db } from "@/lib/testcases/db";
import { addStep, updateStep, deleteStep, duplicateStep, reorderSteps } from "@/lib/testcases/repo/steps-repo";
import { cn } from "@/lib/utils";

export function StepsEditor({ testCaseId }: { testCaseId: string }) {
  const steps = useLiveQuery(() => db.steps.where("testCaseId").equals(testCaseId).sortBy("order"), [testCaseId]) ?? [];
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  async function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = steps.findIndex((s) => s.id === active.id);
    const newIndex = steps.findIndex((s) => s.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    const reordered = arrayMove(steps, oldIndex, newIndex);
    await reorderSteps(reordered.map((s) => s.id));
  }

  return (
    <div className="flex flex-col gap-2">
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={steps.map((s) => s.id)} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-2">
            {steps.map((step, index) => (
              <SortableStepRow key={step.id} step={step} index={index} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
      <Button variant="outline" size="sm" className="w-fit gap-1.5" onClick={() => addStep(testCaseId)}>
        <Plus className="size-3.5" />
        Add Step
      </Button>
      {steps.length === 0 && <p className="text-sm text-muted-foreground">No steps yet. Add the first one above.</p>}
    </div>
  );
}

function SortableStepRow({ step, index }: { step: import("@/lib/testcases/types").Step; index: number }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: step.id });
  const [action, setAction] = React.useState(step.action);
  const [expected, setExpected] = React.useState(step.expectedResult);

  // Re-sync local drafts when the underlying step changes externally (e.g. after our
  // own onBlur save round-trips through useLiveQuery), without clobbering in-progress
  // typing — the "adjusting state when a prop changes" pattern, done during render
  // rather than in an effect.
  const [trackedAction, setTrackedAction] = React.useState(step.action);
  if (trackedAction !== step.action) {
    setTrackedAction(step.action);
    setAction(step.action);
  }
  const [trackedExpected, setTrackedExpected] = React.useState(step.expectedResult);
  if (trackedExpected !== step.expectedResult) {
    setTrackedExpected(step.expectedResult);
    setExpected(step.expectedResult);
  }

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn("flex gap-2 rounded-xl border border-border bg-card p-3", isDragging && "opacity-50 shadow-lg")}
    >
      <button type="button" className="mt-1.5 flex size-6 shrink-0 cursor-grab touch-none items-center justify-center text-muted-foreground/50 hover:text-muted-foreground" {...attributes} {...listeners}>
        <GripVertical className="size-4" />
      </button>
      <div className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground mt-1.5">
        {index + 1}
      </div>
      <div className="grid flex-1 gap-2 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-medium text-muted-foreground">Action</label>
          <Textarea
            value={action}
            onChange={(e) => setAction(e.target.value)}
            onBlur={() => updateStep(step.id, { action })}
            rows={2}
            placeholder="What should the tester do?"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[11px] font-medium text-muted-foreground">Expected Result</label>
          <Textarea
            value={expected}
            onChange={(e) => setExpected(e.target.value)}
            onBlur={() => updateStep(step.id, { expectedResult: expected })}
            rows={2}
            placeholder="What should happen?"
          />
        </div>
      </div>
      <div className="flex shrink-0 flex-col gap-1">
        <Button variant="ghost" size="icon" className="size-6.5" aria-label="Duplicate step" onClick={() => duplicateStep(step.id)}>
          <Copy className="size-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="size-6.5 text-destructive" aria-label="Delete step" onClick={() => deleteStep(step.id)}>
          <Trash2 className="size-3.5" />
        </Button>
      </div>
    </div>
  );
}
