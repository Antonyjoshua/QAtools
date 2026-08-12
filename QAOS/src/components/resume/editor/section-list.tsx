"use client";

import * as React from "react";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ChevronDown, GripVertical, Eye, EyeOff, Trash2, Plus, Hash } from "lucide-react";
import { SECTION_ICONS } from "@/lib/resume/section-icons";
import { SECTION_LABELS } from "@/lib/resume/section-defaults";
import { SECTION_TYPES } from "@/lib/resume/types";
import { addSection, removeSection, updateSectionData, updateSectionMeta, reorderSectionsInColumn, moveSectionToColumn } from "@/lib/resume/repo/sections-repo";
import { SectionEditor } from "./section-forms/section-editor";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { Resume, ResumeSectionInstance, SectionType } from "@/lib/resume/types";

function SortableSectionRow({
  section,
  expanded,
  onToggleExpand,
  onRemove,
  onToggleVisible,
  onRenameTitle,
  onMoveColumn,
  resumeId,
  showColumnPicker,
}: {
  section: ResumeSectionInstance;
  expanded: boolean;
  onToggleExpand: () => void;
  onRemove: () => void;
  onToggleVisible: () => void;
  onRenameTitle: (title: string) => void;
  onMoveColumn: (column: 0 | 1) => void;
  resumeId: string;
  showColumnPicker: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: section.id });
  const Icon = SECTION_ICONS[section.type];

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn("rounded-lg border border-border bg-card", isDragging && "opacity-50 shadow-lg")}
    >
      <div className="flex items-center gap-1.5 px-2 py-1.5">
        <button type="button" className="cursor-grab touch-none text-muted-foreground/50 hover:text-muted-foreground" {...attributes} {...listeners}>
          <GripVertical className="size-3.5" />
        </button>
        <Icon className="size-3.5 shrink-0 text-muted-foreground" />
        <button type="button" onClick={onToggleExpand} className="flex flex-1 items-center gap-1.5 truncate text-left text-sm font-medium">
          <span className="truncate">{section.title}</span>
        </button>
        {showColumnPicker && (
          <Select value={String(section.column)} onValueChange={(v) => onMoveColumn(Number(v) as 0 | 1)}>
            <SelectTrigger className="h-6 w-16 text-[10px]">
              <SelectValue>{(v: string) => (v === "1" ? "Sidebar" : "Main")}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Main</SelectItem>
              <SelectItem value="1">Sidebar</SelectItem>
            </SelectContent>
          </Select>
        )}
        <Button variant="ghost" size="icon" className="size-6" aria-label={section.visible ? "Hide" : "Show"} onClick={onToggleVisible}>
          {section.visible ? <Eye className="size-3.5" /> : <EyeOff className="size-3.5 text-muted-foreground/50" />}
        </Button>
        <Button variant="ghost" size="icon" className="size-6 text-destructive" aria-label="Remove section" onClick={onRemove}>
          <Trash2 className="size-3.5" />
        </Button>
        <ChevronDown className={cn("size-3.5 shrink-0 text-muted-foreground transition-transform", expanded && "rotate-180")} onClick={onToggleExpand} />
      </div>
      {expanded && (
        <div className="flex flex-col gap-2 border-t border-border p-3">
          <div className="flex items-center gap-1.5">
            <Hash className="size-3 text-muted-foreground" />
            <input
              value={section.title}
              onChange={(e) => onRenameTitle(e.target.value)}
              className="h-7 flex-1 rounded border border-input bg-transparent px-2 text-xs outline-none focus-visible:border-ring"
              placeholder="Section title"
            />
          </div>
          <SectionEditor resumeId={resumeId} section={section} onChange={(data) => updateSectionData(resumeId, section.id, data)} />
        </div>
      )}
    </div>
  );
}

export function SectionList({ resume }: { resume: Resume }) {
  const [expandedId, setExpandedId] = React.useState<string | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));
  const twoColumn = resume.layout.columns === 2;

  const col0 = resume.sections.filter((s) => s.column === 0).sort((a, b) => a.order - b.order);
  const col1 = resume.sections.filter((s) => s.column === 1).sort((a, b) => a.order - b.order);
  const usedTypes = new Set(resume.sections.map((s) => s.type));
  const availableTypes = SECTION_TYPES.filter((t) => t === "custom" || !usedTypes.has(t));

  function handleDragEnd(e: DragEndEvent, column: 0 | 1, siblings: ResumeSectionInstance[]) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = siblings.findIndex((s) => s.id === active.id);
    const newIndex = siblings.findIndex((s) => s.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    const reordered = arrayMove(siblings, oldIndex, newIndex);
    void reorderSectionsInColumn(resume.id, column, reordered.map((s) => s.id));
  }

  function renderColumn(sections: ResumeSectionInstance[], column: 0 | 1) {
    return (
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e, column, sections)}>
        <SortableContext items={sections.map((s) => s.id)} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-2">
            {sections.map((section) => (
              <SortableSectionRow
                key={section.id}
                section={section}
                resumeId={resume.id}
                showColumnPicker={twoColumn}
                expanded={expandedId === section.id}
                onToggleExpand={() => setExpandedId((id) => (id === section.id ? null : section.id))}
                onRemove={() => void removeSection(resume.id, section.id)}
                onToggleVisible={() => void updateSectionMeta(resume.id, section.id, { visible: !section.visible })}
                onRenameTitle={(title) => void updateSectionMeta(resume.id, section.id, { title })}
                onMoveColumn={(col) => void moveSectionToColumn(resume.id, section.id, col)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        {twoColumn && <p className="mb-2 text-xs font-semibold text-muted-foreground">Main column</p>}
        {renderColumn(col0, 0)}
      </div>
      {twoColumn && (
        <div>
          <p className="mb-2 text-xs font-semibold text-muted-foreground">Sidebar</p>
          {renderColumn(col1, 1)}
        </div>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="outline" size="sm" className="w-fit gap-1.5">
              <Plus className="size-3.5" />
              Add Section
            </Button>
          }
        />
        <DropdownMenuContent align="start" className="max-h-72 overflow-y-auto">
          {availableTypes.map((type: SectionType) => (
            <DropdownMenuItem key={type} onClick={() => void addSection(resume.id, type, 0)}>
              {SECTION_LABELS[type]}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
