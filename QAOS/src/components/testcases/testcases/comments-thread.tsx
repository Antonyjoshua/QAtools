"use client";

import * as React from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { Send, Trash2 } from "lucide-react";
import { db } from "@/lib/testcases/db";
import { addComment, deleteComment, extractMentions, toggleReaction } from "@/lib/testcases/repo/comments-repo";
import { useTestManagementSettings } from "@/lib/testcases/settings-store";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const QUICK_REACTIONS = ["👍", "🎉", "👀", "🚀", "❤️"];

export function CommentsThread({ testCaseId }: { testCaseId: string }) {
  const comments = useLiveQuery(() => db.comments.where("testCaseId").equals(testCaseId).sortBy("createdAt"), [testCaseId]) ?? [];
  const currentUser = useTestManagementSettings((s) => s.currentUser);
  const teamMembers = useTestManagementSettings((s) => s.teamMembers);
  const [text, setText] = React.useState("");

  async function handleSend() {
    if (!text.trim()) return;
    const mentions = extractMentions(text, teamMembers);
    await addComment(testCaseId, currentUser, text.trim(), mentions);
    setText("");
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3">
        {comments.map((comment) => (
          <div key={comment.id} className="flex flex-col gap-1.5 rounded-xl border border-border bg-card p-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <div className="flex size-6 items-center justify-center rounded-full bg-primary/15 text-[11px] font-semibold text-primary">
                  {comment.author.slice(0, 1).toUpperCase()}
                </div>
                <span className="text-sm font-medium">{comment.author}</span>
                <span className="text-xs text-muted-foreground">{new Date(comment.createdAt).toLocaleString()}</span>
              </div>
              {comment.author === currentUser && (
                <Button variant="ghost" size="icon" className="size-6 text-destructive" onClick={() => deleteComment(comment.id)} aria-label="Delete comment">
                  <Trash2 className="size-3.5" />
                </Button>
              )}
            </div>
            <p className="whitespace-pre-wrap text-sm">
              {comment.text.split(/(\s+)/).map((word, i) =>
                word.startsWith("@") && comment.mentions.includes(word.slice(1)) ? (
                  <span key={i} className="font-medium text-primary">
                    {word}
                  </span>
                ) : (
                  word
                )
              )}
            </p>
            <div className="flex flex-wrap items-center gap-1">
              {QUICK_REACTIONS.map((emoji) => {
                const authors = comment.reactions[emoji] ?? [];
                const active = authors.includes(currentUser);
                return (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => toggleReaction(comment.id, emoji, currentUser)}
                    className={cn(
                      "flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-xs transition-colors",
                      active ? "border-primary/40 bg-primary/10" : "border-border/60 hover:bg-accent"
                    )}
                  >
                    <span>{emoji}</span>
                    {authors.length > 0 && <span className="text-[10px] text-muted-foreground">{authors.length}</span>}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
        {comments.length === 0 && <p className="text-sm text-muted-foreground">No comments yet — start the discussion.</p>}
      </div>

      <div className="flex flex-col gap-2 rounded-xl border border-border p-3">
        <Textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a comment… use @name to mention a teammate"
          rows={2}
        />
        <Button size="sm" className="w-fit gap-1.5" onClick={handleSend} disabled={!text.trim()}>
          <Send className="size-3.5" />
          Comment
        </Button>
      </div>
    </div>
  );
}
