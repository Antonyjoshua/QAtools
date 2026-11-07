"use client";

import * as React from "react";
import Link from "next/link";
import { Bug, StickyNote, HelpCircle, Lightbulb, AlertTriangle, Flag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { SessionNote, NoteType } from "@/lib/exploratory/types";

const TYPE_META: Record<NoteType, { icon: React.ComponentType<{ className?: string }>; className: string }> = {
  Note: { icon: StickyNote, className: "border-border text-muted-foreground" },
  Bug: { icon: Bug, className: "border-destructive/40 text-destructive" },
  Question: { icon: HelpCircle, className: "border-chart-2/40 text-chart-2" },
  Idea: { icon: Lightbulb, className: "border-warning/40 text-warning" },
  Risk: { icon: AlertTriangle, className: "border-chart-5/40 text-chart-5" },
};

export function NoteLogEntry({ note, onFileBug }: { note: SessionNote; onFileBug: (note: SessionNote) => void }) {
  const meta = TYPE_META[note.type];
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border p-3">
      <Badge variant="outline" className={cn("mt-0.5 shrink-0 gap-1", meta.className)}>
        <meta.icon className="size-3" />
        {note.type}
      </Badge>
      <div className="min-w-0 flex-1">
        <p className="whitespace-pre-wrap text-sm">{note.text}</p>
        <p className="mt-1 text-[11px] text-muted-foreground">{new Date(note.timestamp).toLocaleTimeString()}</p>
      </div>
      {note.type === "Bug" && (
        <div className="shrink-0">
          {note.linkedBugId ? (
            <Link href={`/bugs/${note.linkedBugId}`} className="flex items-center gap-1 text-xs text-primary hover:underline">
              <Flag className="size-3" />
              {note.linkedBugDisplayId}
            </Link>
          ) : (
            <Button size="sm" variant="outline" className="h-7 gap-1 text-xs" onClick={() => onFileBug(note)}>
              <Bug className="size-3" />
              File Bug
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
