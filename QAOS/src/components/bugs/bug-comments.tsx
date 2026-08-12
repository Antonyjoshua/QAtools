"use client";

import * as React from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, Reply, Trash2, Send } from "lucide-react";
import { db } from "@/lib/bugs/db";
import { uid } from "@/lib/bugs/id";
import { useSettingsStore } from "@/lib/bugs/settings-store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

function extractMentions(text: string): string[] {
  const matches = text.match(/@[a-zA-Z0-9_]+/g) ?? [];
  return matches.map((m) => m.slice(1));
}

function renderWithMentions(text: string): React.ReactNode {
  const parts = text.split(/(@[a-zA-Z0-9_]+)/g);
  return parts.map((part, i) =>
    part.startsWith("@") ? (
      <span key={i} className="font-medium text-primary">
        {part}
      </span>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    )
  );
}

export function BugComments({ bugId }: { bugId: string }) {
  const comments = useLiveQuery(() => db.comments.where("bugId").equals(bugId).sortBy("createdAt"), [bugId]);
  const currentUser = useSettingsStore((s) => s.currentUser);
  const [text, setText] = React.useState("");
  const [replyTo, setReplyTo] = React.useState<string | null>(null);

  async function handlePost() {
    const trimmed = text.trim();
    if (!trimmed) return;
    await db.comments.add({
      id: uid(),
      bugId,
      parentId: replyTo,
      author: currentUser,
      text: trimmed,
      mentions: extractMentions(trimmed),
      createdAt: Date.now(),
    });
    setText("");
    setReplyTo(null);
  }

  const topLevel = (comments ?? []).filter((c) => !c.parentId);
  const repliesOf = (id: string) => (comments ?? []).filter((c) => c.parentId === id);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2 text-sm font-medium">
        <MessageSquare className="size-4" />
        Comments ({(comments ?? []).length})
      </div>

      <div className="flex flex-col gap-2">
        {topLevel.length === 0 && <p className="text-xs text-muted-foreground">No comments yet. Use @name to mention a teammate.</p>}
        {topLevel.map((c) => (
          <div key={c.id} className="flex flex-col gap-1.5">
            <div className="rounded-lg border border-border bg-card p-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">{c.author}</span>
                <span className="text-[11px] text-muted-foreground">{formatDistanceToNow(c.createdAt, { addSuffix: true })}</span>
              </div>
              <p className="mt-1 text-sm">{renderWithMentions(c.text)}</p>
              <div className="mt-1.5 flex items-center gap-2">
                <button
                  onClick={() => setReplyTo(c.id)}
                  className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground"
                >
                  <Reply className="size-3" /> Reply
                </button>
                <button
                  onClick={() => db.comments.delete(c.id)}
                  className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="size-3" /> Delete
                </button>
              </div>
            </div>
            {repliesOf(c.id).length > 0 && (
              <div className="ml-6 flex flex-col gap-1.5 border-l border-border pl-3">
                {repliesOf(c.id).map((r) => (
                  <div key={r.id} className="rounded-lg border border-border bg-card/60 p-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium">{r.author}</span>
                      <span className="text-[11px] text-muted-foreground">{formatDistanceToNow(r.createdAt, { addSuffix: true })}</span>
                    </div>
                    <p className="mt-1 text-sm">{renderWithMentions(r.text)}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-1.5">
        {replyTo && (
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            Replying to a comment
            <button onClick={() => setReplyTo(null)} className="hover:text-foreground">
              Cancel
            </button>
          </div>
        )}
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a comment… use @name to mention someone"
          rows={2}
          className="text-sm"
        />
        <Button size="sm" className="w-fit gap-1.5" onClick={handlePost} disabled={!text.trim()}>
          <Send className="size-3.5" />
          Post
        </Button>
      </div>
    </div>
  );
}
