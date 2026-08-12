"use client";

import * as React from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../db";

export function useArticleProgress(articleId: string) {
  const progress = useLiveQuery(() => db.progress.get(articleId), [articleId]);

  React.useEffect(() => {
    void db.progress.get(articleId).then((existing) => {
      void db.progress.put({
        articleId,
        completed: existing?.completed ?? false,
        bookmarked: existing?.bookmarked ?? false,
        notes: existing?.notes ?? "",
        timeSpentSec: existing?.timeSpentSec ?? 0,
        lastViewedAt: Date.now(),
      });
    });
  }, [articleId]);

  const toggleBookmark = React.useCallback(async () => {
    const current = await db.progress.get(articleId);
    await db.progress.update(articleId, { bookmarked: !(current?.bookmarked ?? false) });
  }, [articleId]);

  const setNotes = React.useCallback(
    async (notes: string) => {
      await db.progress.update(articleId, { notes });
    },
    [articleId]
  );

  const markComplete = React.useCallback(async () => {
    await db.progress.update(articleId, { completed: true });
  }, [articleId]);

  return { progress, toggleBookmark, setNotes, markComplete };
}
