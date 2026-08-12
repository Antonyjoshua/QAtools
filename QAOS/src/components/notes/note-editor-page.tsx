"use client";

import * as React from "react";
import Link from "next/link";
import { useLiveQuery } from "dexie-react-hooks";
import type { Editor, JSONContent } from "@tiptap/react";
import { ArrowLeft, Star, Pin, Archive, RotateCcw, BookOpen, History, Check, Loader2 } from "lucide-react";
import { db } from "@/lib/notes/db";
import { updateNote, touchLastViewed, toggleFavorite, togglePinned, archiveNote, restoreNote, saveVersionSnapshot } from "@/lib/notes/notes-repo";
import { NoteEditor } from "@/components/notes/editor/note-editor";
import { NoteMetaPanel, IconPicker } from "@/components/notes/note-meta-panel";
import { NoteExportMenu } from "@/components/notes/note-export-menu";
import { VersionHistoryDialog } from "@/components/notes/version-history-dialog";
import { ReadingMode } from "@/components/notes/reading-mode";
import { Button } from "@/components/ui/button";
import { useSettingsStore } from "@/lib/notes/settings-store";
import { cn } from "@/lib/utils";

export function NoteEditorPage({ noteId }: { noteId: string }) {
  const note = useLiveQuery(() => db.notes.get(noteId), [noteId]);
  const [title, setTitle] = React.useState("");
  const [readingMode, setReadingMode] = React.useState(false);
  const [versionHistoryOpen, setVersionHistoryOpen] = React.useState(false);
  const [saveState, setSaveState] = React.useState<"idle" | "saving" | "saved">("idle");
  const editorRef = React.useRef<Editor | null>(null);
  const saveTimerRef = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const autoSave = useSettingsStore((s) => s.autoSave);
  const autoSaveIntervalSec = useSettingsStore((s) => s.autoSaveIntervalSec);
  const titleLoadedFor = React.useRef<string | null>(null);
  const pendingPatchRef = React.useRef<Partial<{ title: string; contentJSON: JSONContent }>>({});

  React.useEffect(() => {
    if (note && titleLoadedFor.current !== note.id) {
      setTitle(note.title);
      titleLoadedFor.current = note.id;
    }
  }, [note]);

  React.useEffect(() => {
    touchLastViewed(noteId);
    return () => {
      clearTimeout(saveTimerRef.current);
      pendingPatchRef.current = {};
    };
  }, [noteId]);

  React.useEffect(() => {
    const interval = setInterval(() => saveVersionSnapshot(noteId, "Auto-save"), 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [noteId]);

  const scheduleSave = React.useCallback(
    (patch: Partial<{ title: string; contentJSON: JSONContent }>) => {
      setSaveState("saving");
      pendingPatchRef.current = { ...pendingPatchRef.current, ...patch };
      clearTimeout(saveTimerRef.current);
      const delay = autoSave ? Math.max(0.5, autoSaveIntervalSec) * 1000 : 2000;
      saveTimerRef.current = setTimeout(async () => {
        const toSave = pendingPatchRef.current;
        pendingPatchRef.current = {};
        await updateNote(noteId, toSave);
        setSaveState("saved");
      }, delay);
    },
    [noteId, autoSave, autoSaveIntervalSec]
  );

  function handleTitleChange(v: string) {
    setTitle(v);
    scheduleSave({ title: v });
  }

  function handleContentUpdate(json: JSONContent) {
    scheduleSave({ contentJSON: json });
  }

  if (!note) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 text-center">
        <p className="text-muted-foreground">Note not found.</p>
        <Link href="/notes" className="mt-3 inline-block text-sm text-primary hover:underline">
          Back to notes
        </Link>
      </div>
    );
  }

  if (readingMode) {
    return <ReadingMode note={note} onClose={() => setReadingMode(false)} />;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-4 flex items-center justify-between">
        <Link href="/notes" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-3.5" />
          Back to notes
        </Link>
        <SaveIndicator state={saveState} />
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center gap-3">
            <IconPicker note={note} />
            <input
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Untitled Note"
              className="min-w-0 flex-1 bg-transparent text-2xl font-semibold tracking-tight outline-none sm:text-3xl"
            />
          </div>

          <div className="mb-4 flex flex-wrap items-center gap-1.5">
            <Button
              variant={note.isFavorite ? "default" : "outline"}
              size="sm"
              className="h-8 gap-1.5 text-xs"
              onClick={() => toggleFavorite(note.id)}
            >
              <Star className={cn("size-3.5", note.isFavorite && "fill-current")} />
              {note.isFavorite ? "Favorited" : "Favorite"}
            </Button>
            <Button
              variant={note.isPinned ? "default" : "outline"}
              size="sm"
              className="h-8 gap-1.5 text-xs"
              onClick={() => togglePinned(note.id)}
            >
              <Pin className={cn("size-3.5", note.isPinned && "fill-current")} />
              {note.isPinned ? "Pinned" : "Pin"}
            </Button>
            <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs" onClick={() => setReadingMode(true)}>
              <BookOpen className="size-3.5" />
              Read
            </Button>
            <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs" onClick={() => setVersionHistoryOpen(true)}>
              <History className="size-3.5" />
              History
            </Button>
            <NoteExportMenu note={note} />
            {note.isArchived ? (
              <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs" onClick={() => restoreNote(note.id)}>
                <RotateCcw className="size-3.5" />
                Restore
              </Button>
            ) : (
              <Button variant="outline" size="sm" className="h-8 gap-1.5 text-xs" onClick={() => archiveNote(note.id)}>
                <Archive className="size-3.5" />
                Archive
              </Button>
            )}
          </div>

          <div className="rounded-xl border border-border bg-card">
            <NoteEditor
              noteId={note.id}
              content={note.contentJSON}
              onUpdate={handleContentUpdate}
              onReady={(ed) => {
                editorRef.current = ed ?? null;
              }}
            />
          </div>
        </div>

        <aside className="w-full shrink-0 lg:w-72">
          <div className="rounded-xl border border-border bg-card p-4 lg:sticky lg:top-20">
            <NoteMetaPanel note={note} />
          </div>
        </aside>
      </div>

      <VersionHistoryDialog noteId={note.id} open={versionHistoryOpen} onOpenChange={setVersionHistoryOpen} />
    </div>
  );
}

function SaveIndicator({ state }: { state: "idle" | "saving" | "saved" }) {
  if (state === "idle") return null;
  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
      {state === "saving" ? (
        <>
          <Loader2 className="size-3 animate-spin" /> Saving…
        </>
      ) : (
        <>
          <Check className="size-3 text-success" /> Saved
        </>
      )}
    </div>
  );
}
