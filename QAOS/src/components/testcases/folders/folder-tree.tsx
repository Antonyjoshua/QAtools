"use client";

import * as React from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ChevronRight, Folder, FolderOpen, GripVertical, MoreHorizontal, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { Folder as FolderType } from "@/lib/testcases/types";
import { buildFolderTree, createFolder, deleteFolder, moveFolder, reorderFolders, renameFolder, type FolderNode } from "@/lib/testcases/repo/folders-repo";

interface FolderTreeProps {
  folders: FolderType[];
  selectedFolderId: string | null;
  onSelect: (folderId: string) => void;
  suiteCountByFolder: Map<string, number>;
  projectId: string;
}

export function FolderTree({ folders, selectedFolderId, onSelect, suiteCountByFolder, projectId }: FolderTreeProps) {
  const tree = React.useMemo(() => buildFolderTree(folders), [folders]);
  const [expanded, setExpanded] = React.useState<Set<string>>(() => new Set(folders.map((f) => f.id)));
  const [renaming, setRenaming] = React.useState<string | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  function toggleExpanded(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function handleDragEnd(e: DragEndEvent, siblings: FolderNode[]) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const oldIndex = siblings.findIndex((f) => f.id === active.id);
    const newIndex = siblings.findIndex((f) => f.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    const reordered = arrayMove(siblings, oldIndex, newIndex);
    await reorderFolders(reordered.map((f, i) => ({ id: f.id, order: i, parentId: f.parentId })));
  }

  async function handleAddSubfolder(parentId: string) {
    const name = window.prompt("Subfolder name");
    if (!name?.trim()) return;
    await createFolder(projectId, name.trim(), parentId);
    setExpanded((prev) => new Set(prev).add(parentId));
  }

  async function handleMoveTo(id: string, newParentId: string | null) {
    await moveFolder(id, newParentId, 9999);
  }

  async function handleDelete(id: string, name: string) {
    if (!window.confirm(`Delete "${name}" and everything inside it? This cannot be undone.`)) return;
    await deleteFolder(id);
    if (selectedFolderId === id) onSelect("");
  }

  function renderLevel(nodes: FolderNode[], depth: number) {
    return (
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e, nodes)}>
        <SortableContext items={nodes.map((n) => n.id)} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-0.5">
            {nodes.map((node) => (
              <FolderRow
                key={node.id}
                node={node}
                depth={depth}
                selected={selectedFolderId === node.id}
                expanded={expanded.has(node.id)}
                suiteCount={suiteCountByFolder.get(node.id) ?? 0}
                renaming={renaming === node.id}
                onToggleExpand={() => toggleExpanded(node.id)}
                onSelect={() => onSelect(node.id)}
                onAddSubfolder={() => handleAddSubfolder(node.id)}
                onStartRename={() => setRenaming(node.id)}
                onRename={async (name) => {
                  if (name.trim()) await renameFolder(node.id, name.trim());
                  setRenaming(null);
                }}
                onMoveToRoot={() => handleMoveTo(node.id, null)}
                onDelete={() => handleDelete(node.id, node.name)}
                allFolders={folders}
              />
            ))}
          </div>
        </SortableContext>
        {nodes.map((node) => expanded.has(node.id) && node.children.length > 0 && (
          <div key={`children-${node.id}`} className="ml-3.5 border-l border-border pl-2">
            {renderLevel(node.children, depth + 1)}
          </div>
        ))}
      </DndContext>
    );
  }

  return <div className="flex flex-col gap-1">{renderLevel(tree, 0)}</div>;
}

function FolderRow({
  node,
  selected,
  expanded,
  suiteCount,
  renaming,
  onToggleExpand,
  onSelect,
  onAddSubfolder,
  onStartRename,
  onRename,
  onMoveToRoot,
  onDelete,
  allFolders,
}: {
  node: FolderNode;
  depth: number;
  selected: boolean;
  expanded: boolean;
  suiteCount: number;
  renaming: boolean;
  onToggleExpand: () => void;
  onSelect: () => void;
  onAddSubfolder: () => void;
  onStartRename: () => void;
  onRename: (name: string) => void;
  onMoveToRoot: () => void;
  onDelete: () => void;
  allFolders: FolderType[];
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: node.id });
  const [draftName, setDraftName] = React.useState(node.name);

  const otherFolders = allFolders.filter((f) => f.id !== node.id);

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={cn(
        "group flex items-center gap-1 rounded-md px-1.5 py-1 text-sm",
        selected ? "bg-accent text-accent-foreground font-medium" : "text-foreground hover:bg-accent/50",
        isDragging && "opacity-50"
      )}
    >
      <button type="button" className="cursor-grab touch-none text-muted-foreground/50 hover:text-muted-foreground" {...attributes} {...listeners}>
        <GripVertical className="size-3.5" />
      </button>
      <button
        type="button"
        onClick={onToggleExpand}
        className={cn("flex size-4 items-center justify-center text-muted-foreground", node.children.length === 0 && "invisible")}
      >
        <ChevronRight className={cn("size-3.5 transition-transform", expanded && "rotate-90")} />
      </button>
      {expanded ? <FolderOpen className="size-3.5 shrink-0 text-muted-foreground" /> : <Folder className="size-3.5 shrink-0 text-muted-foreground" />}
      {renaming ? (
        <input
          autoFocus
          value={draftName}
          onChange={(e) => setDraftName(e.target.value)}
          onBlur={() => onRename(draftName)}
          onKeyDown={(e) => {
            if (e.key === "Enter") onRename(draftName);
            if (e.key === "Escape") onRename(node.name);
          }}
          className="min-w-0 flex-1 rounded border border-primary bg-background px-1 text-sm outline-none"
        />
      ) : (
        <button type="button" onClick={onSelect} className="min-w-0 flex-1 truncate text-left">
          {node.name}
        </button>
      )}
      {suiteCount > 0 && <span className="text-[10px] text-muted-foreground">{suiteCount}</span>}
      <Button variant="ghost" size="icon" className="size-5.5 opacity-0 group-hover:opacity-100" onClick={onAddSubfolder} aria-label="Add subfolder">
        <Plus className="size-3.5" />
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="ghost" size="icon" className="size-5.5 opacity-0 group-hover:opacity-100" aria-label="Folder options">
              <MoreHorizontal className="size-3.5" />
            </Button>
          }
        />
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={onStartRename}>Rename</DropdownMenuItem>
          {node.parentId !== null && <DropdownMenuItem onClick={onMoveToRoot}>Move to root</DropdownMenuItem>}
          {otherFolders.length > 0 && (
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Move to…</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                {otherFolders.map((f) => (
                  <DropdownMenuItem key={f.id} onClick={() => moveFolder(node.id, f.id, 9999)}>
                    {f.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          )}
          <DropdownMenuItem onClick={onDelete} className="text-destructive">
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
