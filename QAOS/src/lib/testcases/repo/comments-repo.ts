import { db } from "../db";
import { uid } from "../id";
import type { Comment } from "../types";

export function extractMentions(text: string, knownNames: string[]): string[] {
  const mentioned = new Set<string>();
  for (const name of knownNames) {
    if (text.includes(`@${name}`)) mentioned.add(name);
  }
  return Array.from(mentioned);
}

export async function addComment(testCaseId: string, author: string, text: string, mentions: string[]): Promise<Comment> {
  const comment: Comment = {
    id: uid(),
    testCaseId,
    author,
    text,
    mentions,
    reactions: {},
    createdAt: Date.now(),
  };
  await db.comments.add(comment);
  return comment;
}

export async function deleteComment(id: string): Promise<void> {
  await db.comments.delete(id);
}

export async function toggleReaction(commentId: string, emoji: string, author: string): Promise<void> {
  const comment = await db.comments.get(commentId);
  if (!comment) return;
  const current = comment.reactions[emoji] ?? [];
  const next = current.includes(author) ? current.filter((a) => a !== author) : [...current, author];
  const reactions = { ...comment.reactions, [emoji]: next };
  if (next.length === 0) delete reactions[emoji];
  await db.comments.update(commentId, { reactions });
}
