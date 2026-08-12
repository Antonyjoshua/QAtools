"use client";

import * as React from "react";
import { X, Printer } from "lucide-react";
import type { Note } from "@/lib/notes/types";
import { NoteEditor } from "@/components/notes/editor/note-editor";
import { Button } from "@/components/ui/button";
import { setReadingProgress } from "@/lib/notes/notes-repo";
import { estimateReadingMinutes } from "@/lib/notes/content-utils";

export function ReadingMode({ note, onClose }: { note: Note; onClose: () => void }) {
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [progress, setProgress] = React.useState(note.readingProgress);

  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    let raf = 0;
    function onScroll() {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        if (!el) return;
        const max = el.scrollHeight - el.clientHeight;
        const pct = max <= 0 ? 100 : Math.min(100, Math.round((el.scrollTop / max) * 100));
        setProgress(pct);
      });
    }
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    const t = setTimeout(() => setReadingProgress(note.id, progress), 400);
    return () => clearTimeout(t);
  }, [progress, note.id]);

  React.useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      <div className="fixed top-0 left-0 z-10 h-0.5 bg-primary transition-all" style={{ width: `${progress}%` }} />
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border px-4 print:hidden">
        <div className="text-xs text-muted-foreground">
          Reading mode &middot; ~{estimateReadingMinutes(note.wordCount)} min read &middot; {progress}%
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => window.print()}>
            <Printer className="size-3.5" /> Print
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="size-4" />
          </Button>
        </div>
      </header>
      <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin">
        <div className="mx-auto max-w-3xl px-6 py-12">
          <h1 className="mb-6 text-4xl font-semibold tracking-tight">{note.title}</h1>
          <NoteEditor noteId={note.id} content={note.contentJSON} editable={false} />
        </div>
      </div>
    </div>
  );
}
