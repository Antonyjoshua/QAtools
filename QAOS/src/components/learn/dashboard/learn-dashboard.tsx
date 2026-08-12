"use client";

import * as React from "react";
import Link from "next/link";
import { useLiveQuery } from "dexie-react-hooks";
import { Flame, Trophy, BookOpen, ListChecks, Mic, Bookmark, ArrowRight, GraduationCap, Sparkles } from "lucide-react";
import { db } from "@/lib/learn/db";
import { useLearnSettings } from "@/lib/learn/settings-store";
import { useLearnStats } from "@/lib/learn/hooks/use-learn-stats";
import { getLevelInfo } from "@/lib/learn/gamification/levels";
import { ACHIEVEMENTS } from "@/lib/learn/gamification/achievements";
import { ALL_ARTICLES, MODULE_META, INTERVIEW_QUESTIONS, getArticle, getModuleMeta } from "@/lib/learn/content/registry";
import { DynamicIcon } from "@/components/icon";
import { cn } from "@/lib/utils";

function StatTile({ icon: Icon, label, value, sub }: { icon: React.ComponentType<{ className?: string }>; label: string; value: React.ReactNode; sub?: string }) {
  return (
    <div className="flex flex-col gap-1 rounded-xl border border-border bg-card p-4">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Icon className="size-3.5" />
        {label}
      </div>
      <p className="text-2xl font-semibold tabular-nums">{value}</p>
      {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

export function LearnDashboard() {
  const xp = useLearnSettings((s) => s.xp);
  const streak = useLearnSettings((s) => s.streak);
  const unlockedAchievementIds = useLearnSettings((s) => s.unlockedAchievementIds);
  const recentArticleIds = useLearnSettings((s) => s.recentArticleIds);
  const stats = useLearnStats();
  const levelInfo = getLevelInfo(xp);

  const allProgress = useLiveQuery(() => db.progress.toArray(), []);
  const mockSessions = useLiveQuery(() => db.mockSessions.orderBy("startedAt").reverse().limit(3).toArray(), []);

  const progressByArticleId = React.useMemo(() => new Map((allProgress ?? []).map((p) => [p.articleId, p])), [allProgress]);
  const bookmarked = React.useMemo(
    () => (allProgress ?? []).filter((p) => p.bookmarked).map((p) => getArticle(p.articleId)).filter((a): a is NonNullable<typeof a> => Boolean(a)),
    [allProgress]
  );

  const continueLearning = recentArticleIds
    .map((id) => getArticle(id))
    .filter((a): a is NonNullable<typeof a> => a !== undefined && !progressByArticleId.get(a.id)?.completed)
    .slice(0, 4);

  const recommended = ALL_ARTICLES.filter((a) => !progressByArticleId.has(a.id)).slice(0, 3);

  const readinessScore = stats && INTERVIEW_QUESTIONS.length > 0 ? Math.min(100, Math.round((stats.interviewQuestionsAnswered / INTERVIEW_QUESTIONS.length) * 100)) : 0;

  const unlockedAchievements = ACHIEVEMENTS.filter((a) => unlockedAchievementIds.includes(a.id));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
            <GraduationCap className="size-3.5" />
            Learn
          </div>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Level {levelInfo.level} — {levelInfo.title}</h1>
          <div className="mt-2 flex items-center gap-2">
            <div className="h-1.5 w-48 overflow-hidden rounded-full bg-muted">
              <div className="h-full bg-primary transition-[width]" style={{ width: `${Math.round(levelInfo.progress * 100)}%` }} />
            </div>
            <span className="text-xs text-muted-foreground">
              {levelInfo.xpIntoLevel} / {levelInfo.xpForNextLevel} XP to next level
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile icon={Flame} label="Streak" value={streak.current} sub={streak.longest > streak.current ? `Best: ${streak.longest}` : "days"} />
        <StatTile icon={BookOpen} label="Articles Completed" value={stats?.articlesCompleted ?? 0} />
        <StatTile icon={ListChecks} label="Quizzes Taken" value={stats?.quizzesCompleted ?? 0} />
        <StatTile icon={Trophy} label="Achievements" value={`${unlockedAchievements.length} / ${ACHIEVEMENTS.length}`} />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="flex flex-col gap-6 lg:col-span-2">
          {continueLearning.length > 0 && (
            <section>
              <h2 className="mb-3 text-sm font-semibold text-muted-foreground">Continue Learning</h2>
              <div className="flex flex-col gap-2">
                {continueLearning.map((a) => (
                  <Link key={a.id} href={`/learn/${a.moduleId}/${a.slug}`} className="group flex items-center gap-3 rounded-lg border border-border bg-card p-3 transition-colors hover:border-primary/40">
                    <BookOpen className="size-4 shrink-0 text-primary" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium group-hover:text-primary">{a.title}</p>
                      <p className="truncate text-xs text-muted-foreground">{getModuleMeta(a.moduleId)?.title}</p>
                    </div>
                    <ArrowRight className="size-3.5 shrink-0 text-muted-foreground" />
                  </Link>
                ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="mb-3 text-sm font-semibold text-muted-foreground">Recommended Topics</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {recommended.map((a) => (
                <Link key={a.id} href={`/learn/${a.moduleId}/${a.slug}`} className="group flex flex-col gap-1 rounded-lg border border-border bg-card p-3 transition-colors hover:border-primary/40">
                  <p className="text-sm font-medium group-hover:text-primary">{a.title}</p>
                  <p className="line-clamp-2 text-xs text-muted-foreground">{a.summary}</p>
                </Link>
              ))}
              {recommended.length === 0 && <p className="text-sm text-muted-foreground">You&apos;ve started every available article — nice work.</p>}
            </div>
          </section>

          <section>
            <h2 className="mb-3 text-sm font-semibold text-muted-foreground">Knowledge Library</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {MODULE_META.map((m) => (
                <Link key={m.id} href={`/learn/${m.id}`} className="group flex flex-col gap-2 rounded-xl border border-border bg-card p-3 transition-colors hover:border-primary/40">
                  <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <DynamicIcon name={m.icon} className="size-4" />
                  </div>
                  <p className="text-xs font-medium group-hover:text-primary">{m.title}</p>
                </Link>
              ))}
            </div>
          </section>
        </div>

        <div className="flex flex-col gap-6">
          <section className="rounded-xl border border-border bg-card p-4">
            <h2 className="mb-2 flex items-center gap-1.5 text-sm font-semibold">
              <Mic className="size-4 text-primary" />
              Interview Readiness
            </h2>
            <p className="text-3xl font-semibold tabular-nums">{readinessScore}%</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Based on {stats?.interviewQuestionsAnswered ?? 0} of {INTERVIEW_QUESTIONS.length} interview questions practiced.
            </p>
            <Link href="/learn/interview-prep/mock" className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
              Start a mock interview
              <ArrowRight className="size-3" />
            </Link>
            {mockSessions && mockSessions.length > 0 && (
              <div className="mt-3 flex flex-col gap-1.5 border-t border-border pt-3">
                <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">Recent sessions</p>
                {mockSessions.map((s) => (
                  <div key={s.id} className="flex items-center justify-between text-xs">
                    <span className="capitalize text-muted-foreground">{s.level}</span>
                    <span className={cn(s.completedAt ? "text-success" : "text-muted-foreground")}>{s.completedAt ? "Completed" : "In progress"}</span>
                  </div>
                ))}
              </div>
            )}
          </section>

          {bookmarked.length > 0 && (
            <section className="rounded-xl border border-border bg-card p-4">
              <h2 className="mb-2 flex items-center gap-1.5 text-sm font-semibold">
                <Bookmark className="size-4 text-primary" />
                Saved Articles
              </h2>
              <div className="flex flex-col gap-1.5">
                {bookmarked.slice(0, 5).map((a) => (
                  <Link key={a.id} href={`/learn/${a.moduleId}/${a.slug}`} className="truncate text-sm text-muted-foreground hover:text-primary">
                    {a.title}
                  </Link>
                ))}
              </div>
            </section>
          )}

          {unlockedAchievements.length > 0 && (
            <section className="rounded-xl border border-border bg-card p-4">
              <h2 className="mb-2 flex items-center gap-1.5 text-sm font-semibold">
                <Sparkles className="size-4 text-primary" />
                Achievements
              </h2>
              <div className="flex flex-wrap gap-2">
                {unlockedAchievements.map((a) => (
                  <div key={a.id} title={a.description} className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-2.5 py-1 text-xs">
                    <DynamicIcon name={a.icon} className="size-3 text-primary" />
                    {a.title}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
