"use client";

import Link from "next/link";
import { useLiveQuery } from "dexie-react-hooks";
import { CheckCircle2, Circle, Clock, ArrowLeft, Lock } from "lucide-react";
import { db } from "@/lib/learn/db";
import { getArticlesByModule, getOutlinesForModule, getModuleMeta } from "@/lib/learn/content/registry";
import { DynamicIcon } from "@/components/icon";
import { cn } from "@/lib/utils";

export function ModuleTopicList({ moduleId }: { moduleId: string }) {
  const meta = getModuleMeta(moduleId);
  const articles = getArticlesByModule(moduleId);
  const outlines = getOutlinesForModule(moduleId);
  const progressByArticleId = useLiveQuery(async () => {
    const rows = await db.progress.toArray();
    return new Map(rows.map((r) => [r.articleId, r]));
  }, []);

  if (!meta) return null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/learn" className="mb-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-3.5" />
        Knowledge Library
      </Link>

      <div className="mb-8 flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <DynamicIcon name={meta.icon} className="size-5" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{meta.title}</h1>
          <p className="mt-1 text-muted-foreground">{meta.description}</p>
        </div>
      </div>

      {articles.length > 0 && (
        <div className="mb-8 flex flex-col gap-2">
          {articles.map((a) => {
            const completed = progressByArticleId?.get(a.id)?.completed ?? false;
            return (
              <Link
                key={a.id}
                href={`/learn/${moduleId}/${a.slug}`}
                className="group flex items-center gap-3 rounded-lg border border-border bg-card p-3 transition-colors hover:border-primary/40"
              >
                {completed ? <CheckCircle2 className="size-4.5 shrink-0 text-success" /> : <Circle className="size-4.5 shrink-0 text-muted-foreground/40" />}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium group-hover:text-primary">{a.title}</p>
                  <p className="truncate text-xs text-muted-foreground">{a.summary}</p>
                </div>
                <span className="flex shrink-0 items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="size-3.5" />
                  {a.readingTimeMin}m
                </span>
              </Link>
            );
          })}
        </div>
      )}

      {outlines.length > 0 && (
        <div>
          <h2 className={cn("mb-3 text-sm font-semibold text-muted-foreground", articles.length === 0 && "sr-only")}>
            {articles.length > 0 ? "Coming soon" : "Topics"}
          </h2>
          <div className="flex flex-col gap-2">
            {outlines.map((o, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg border border-dashed border-border p-3 text-muted-foreground">
                <Lock className="size-4 shrink-0" />
                <span className="text-sm">{o.title}</span>
                <span className="ml-auto text-xs">Coming soon</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
