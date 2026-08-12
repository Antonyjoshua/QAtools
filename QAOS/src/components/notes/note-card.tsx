"use client";

import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { Star, Pin, MoreHorizontal, Archive, Copy, Trash2, RotateCcw } from "lucide-react";
import type { Note } from "@/lib/notes/types";
import { DynamicIcon } from "@/components/icon";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { excerpt } from "@/lib/notes/content-utils";
import { toggleFavorite, togglePinned, archiveNote, restoreNote, duplicateNote, deleteNoteForever } from "@/lib/notes/notes-repo";
import { toast } from "sonner";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/notes/db";
import { cn } from "@/lib/utils";

export function NoteCard({ note }: { note: Note }) {
  const category = useLiveQuery(() => (note.categoryId ? db.categories.get(note.categoryId) : undefined), [note.categoryId]);

  return (
    <div className="group relative flex flex-col gap-2 rounded-xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
      <Link href={`/notes/${note.id}`} className="flex flex-1 flex-col gap-2">
        <div className="flex items-start gap-2">
          <DynamicIcon name={note.icon} className="mt-0.5 size-4 shrink-0 text-primary" />
          <h3 className="min-w-0 flex-1 truncate font-medium leading-snug tracking-tight pr-6">{note.title || "Untitled"}</h3>
        </div>
        <p className="line-clamp-2 flex-1 text-sm text-muted-foreground">{excerpt(note.contentText, 130) || "Empty note"}</p>
        <div className="flex flex-wrap items-center gap-1.5">
          {category && (
            <Badge variant="secondary" className="text-[10px] font-normal">
              {category.name}
            </Badge>
          )}
          {note.tags.slice(0, 3).map((t) => (
            <Badge key={t} variant="outline" className="text-[10px] font-normal">
              {t}
            </Badge>
          ))}
        </div>
        <p className="text-[11px] text-muted-foreground">Updated {formatDistanceToNow(note.updatedAt, { addSuffix: true })}</p>
      </Link>

      <div className="absolute right-3 top-3 flex items-center gap-0.5">
        {note.isPinned && <Pin className="size-3.5 fill-current text-primary" />}
        {note.isFavorite && <Star className="size-3.5 fill-current text-warning" />}
        <DropdownMenu>
          <DropdownMenuTrigger
            className={cn(
              "inline-flex size-6 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-opacity hover:bg-muted group-hover:opacity-100",
            )}
          >
            <MoreHorizontal className="size-3.5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => toggleFavorite(note.id)}>
              <Star className="size-4" /> {note.isFavorite ? "Unfavorite" : "Favorite"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => togglePinned(note.id)}>
              <Pin className="size-4" /> {note.isPinned ? "Unpin" : "Pin"}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={async () => { await duplicateNote(note.id); toast.success("Note duplicated"); }}>
              <Copy className="size-4" /> Duplicate
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {note.isArchived ? (
              <DropdownMenuItem onClick={() => restoreNote(note.id)}>
                <RotateCcw className="size-4" /> Restore
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => archiveNote(note.id)}>
                <Archive className="size-4" /> Archive
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              variant="destructive"
              onClick={async () => {
                await deleteNoteForever(note.id);
                toast.success("Note deleted");
              }}
            >
              <Trash2 className="size-4" /> Delete forever
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
