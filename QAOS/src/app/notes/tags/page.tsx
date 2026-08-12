"use client";

import * as React from "react";
import Link from "next/link";
import { useLiveQuery } from "dexie-react-hooks";
import { Tag } from "lucide-react";
import { db } from "@/lib/notes/db";

export default function TagsPage() {
  const notes = useLiveQuery(() => db.notes.toArray(), []);

  const tagCounts = React.useMemo(() => {
    const counts = new Map<string, number>();
    (notes ?? [])
      .filter((n) => !n.isArchived)
      .forEach((n) => n.tags.forEach((t) => counts.set(t, (counts.get(t) ?? 0) + 1)));
    return Array.from(counts.entries()).sort((a, b) => b[1] - a[1]);
  }, [notes]);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold tracking-tight">Tags</h1>
      <p className="mt-1 text-muted-foreground">Browse notes by tag.</p>

      {tagCounts.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-3 rounded-xl border border-dashed border-border py-16 text-center">
          <Tag className="size-8 text-muted-foreground" />
          <p className="text-muted-foreground">No tags used yet.</p>
        </div>
      ) : (
        <div className="mt-8 flex flex-wrap gap-2.5">
          {tagCounts.map(([tag, count]) => (
            <Link
              key={tag}
              href={`/notes/tags/${encodeURIComponent(tag)}`}
              className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm transition-colors hover:border-primary/40"
            >
              <Tag className="size-3.5 text-primary" />
              <span className="font-medium">{tag}</span>
              <span className="text-xs text-muted-foreground">{count}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
