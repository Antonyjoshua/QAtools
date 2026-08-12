"use client";

import Link from "next/link";
import { useLiveQuery } from "dexie-react-hooks";
import { ArrowLeft, CheckCircle2, Circle } from "lucide-react";
import { db } from "@/lib/learn/db";
import { toggleRoadmapMilestone } from "@/lib/learn/repo/roadmap-repo";
import { awardXp } from "@/lib/learn/gamification/award-xp";
import { XP_REWARDS } from "@/lib/learn/gamification/levels";
import { getArticle } from "@/lib/learn/content/registry";
import { cn } from "@/lib/utils";
import type { Roadmap } from "@/lib/learn/content/types";

export function RoadmapView({ roadmap }: { roadmap: Roadmap }) {
  const progress = useLiveQuery(() => db.roadmapProgress.get(roadmap.id), [roadmap.id]);
  const completedIds = progress?.completedMilestoneIds ?? [];

  async function handleToggle(milestoneId: string) {
    const isCompleting = await toggleRoadmapMilestone(roadmap.id, milestoneId);
    if (isCompleting) {
      await awardXp(XP_REWARDS.roadmapMilestoneCompleted, `completed a milestone in "${roadmap.title}"`);
    }
  }

  const doneCount = roadmap.milestones.filter((m) => completedIds.includes(m.id)).length;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/learn/roadmaps" className="mb-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-3.5" />
        Roadmaps
      </Link>
      <h1 className="text-2xl font-semibold tracking-tight">{roadmap.title}</h1>
      <p className="mt-1 text-muted-foreground">{roadmap.description}</p>
      <p className="mt-2 text-sm font-medium text-primary">
        {doneCount} / {roadmap.milestones.length} milestones complete
      </p>

      <div className="relative mt-6 flex flex-col">
        {roadmap.milestones.map((m, i) => {
          const done = completedIds.includes(m.id);
          return (
            <div key={m.id} className="relative flex gap-3 pb-6 last:pb-0">
              {i < roadmap.milestones.length - 1 && <div className={cn("absolute top-6 left-[11px] h-full w-px", done ? "bg-primary" : "bg-border")} />}
              <button type="button" onClick={() => void handleToggle(m.id)} className="z-10 shrink-0" aria-label={done ? "Mark incomplete" : "Mark complete"}>
                {done ? <CheckCircle2 className="size-6 text-primary" /> : <Circle className="size-6 text-muted-foreground/40" />}
              </button>
              <div className="pt-0.5">
                <p className={cn("font-medium", done && "text-muted-foreground line-through")}>{m.title}</p>
                <p className="text-sm text-muted-foreground">{m.description}</p>
                {m.relatedArticleIds && m.relatedArticleIds.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-3">
                    {m.relatedArticleIds.map((articleId) => {
                      const article = getArticle(articleId);
                      return article ? (
                        <Link key={articleId} href={`/learn/${article.moduleId}/${article.slug}`} className="text-xs text-primary hover:underline">
                          Read: {article.title}
                        </Link>
                      ) : null;
                    })}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
