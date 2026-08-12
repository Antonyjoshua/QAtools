"use client";

import * as React from "react";
import Link from "next/link";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { useSortable, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { TEST_CASE_STATUSES, type TestCase, type TestCaseStatus } from "@/lib/testcases/types";
import { STATUS_STYLES } from "@/lib/testcases/badge-styles";
import { PriorityBadge } from "@/components/testcases/shared/badges";
import { updateTestCase } from "@/lib/testcases/repo/testcases-repo";
import { useTestManagementSettings } from "@/lib/testcases/settings-store";

export function TestCaseKanban({ testCases }: { testCases: TestCase[] }) {
  const currentUser = useTestManagementSettings((s) => s.currentUser);
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  const byStatus = React.useMemo(() => {
    const map = new Map<TestCaseStatus, TestCase[]>();
    for (const status of TEST_CASE_STATUSES) map.set(status, []);
    for (const tc of testCases) map.get(tc.status)?.push(tc);
    return map;
  }, [testCases]);

  function handleDragStart(e: DragStartEvent) {
    setActiveId(String(e.active.id));
  }

  async function handleDragEnd(e: DragEndEvent) {
    setActiveId(null);
    const { active, over } = e;
    if (!over) return;
    const newStatus = String(over.id) as TestCaseStatus;
    const testCase = testCases.find((tc) => tc.id === active.id);
    if (!testCase || testCase.status === newStatus || !TEST_CASE_STATUSES.includes(newStatus)) return;
    await updateTestCase(testCase.id, { status: newStatus }, currentUser, `Moved to ${newStatus}`);
  }

  const activeCase = testCases.find((tc) => tc.id === activeId) ?? null;

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 gap-3 overflow-x-auto sm:grid-cols-3 lg:grid-cols-5">
        {TEST_CASE_STATUSES.map((status) => (
          <KanbanColumn key={status} status={status} cases={byStatus.get(status) ?? []} />
        ))}
      </div>
      <DragOverlay>{activeCase && <KanbanCard testCase={activeCase} dragging />}</DragOverlay>
    </DndContext>
  );
}

function KanbanColumn({ status, cases }: { status: TestCaseStatus; cases: TestCase[] }) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  return (
    <div ref={setNodeRef} className={cn("flex min-h-[120px] flex-col gap-2 rounded-xl border border-border/60 bg-foreground/[0.02] p-2", isOver && "border-primary/50 bg-primary/5")}>
      <div className="flex items-center justify-between px-1">
        <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold", STATUS_STYLES[status])}>{status}</span>
        <span className="text-xs text-muted-foreground">{cases.length}</span>
      </div>
      <SortableContext items={cases.map((c) => c.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-2">
          {cases.map((tc) => (
            <SortableKanbanCard key={tc.id} testCase={tc} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
}

function SortableKanbanCard({ testCase }: { testCase: TestCase }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: testCase.id });
  return (
    <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }} {...attributes} {...listeners} className={cn(isDragging && "opacity-40")}>
      <KanbanCard testCase={testCase} />
    </div>
  );
}

function KanbanCard({ testCase, dragging }: { testCase: TestCase; dragging?: boolean }) {
  return (
    <Link
      href={`/testcases/case/${testCase.id}`}
      onClick={(e) => dragging && e.preventDefault()}
      className={cn(
        "flex flex-col gap-1.5 rounded-lg border border-border bg-card p-2.5 text-xs shadow-sm transition-colors hover:border-primary/40",
        dragging && "rotate-2 shadow-lg"
      )}
    >
      <span className="font-mono text-[10px] text-muted-foreground">{testCase.displayId}</span>
      <p className="line-clamp-2 text-sm font-medium">{testCase.title}</p>
      <div className="flex items-center justify-between">
        <PriorityBadge value={testCase.priority} className="text-[10px]" />
        {testCase.module && <span className="truncate text-[10px] text-muted-foreground">{testCase.module}</span>}
      </div>
    </Link>
  );
}
