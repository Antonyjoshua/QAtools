"use client";

import * as React from "react";
import Link from "next/link";
import { useLiveQuery } from "dexie-react-hooks";
import { ArrowRight, StickyNote, Calculator, Sparkles, Clock, Bug, Swords } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { LogoMark } from "@/components/logo-mark";
import { cn } from "@/lib/utils";
import { db } from "@/lib/notes/db";
import { CALCULATORS } from "@/lib/calculator/registry";
import { useHistoryStore as useCalculatorHistoryStore } from "@/lib/calculator/store/history-store";
import { ALL_GENERATORS } from "@/lib/generator/registry";
import { useAppStore as useGeneratorStore } from "@/lib/generator/store";
import { db as bugsDb } from "@/lib/bugs/db";
import { useAppStore as useSoloStore } from "@/lib/solo/store/useAppStore";
import { getLevelInfo } from "@/lib/solo/services/level";

function timeAgo(ts: number): string {
  const s = Math.max(0, Math.floor((Date.now() - ts) / 1000));
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function HomePage() {
  const [mounted, setMounted] = React.useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time hydration mount guard
  React.useEffect(() => setMounted(true), []);

  const notes = useLiveQuery(() => db.notes.filter((n) => !n.isArchived).toArray(), []);
  const calculatorHistory = useCalculatorHistoryStore((s) => s.entries);
  const generatorHistory = useGeneratorStore((s) => s.history);
  const bugs = useLiveQuery(() => bugsDb.bugs.toArray(), []);
  const soloXp = useSoloStore((s) => s.xp.total);

  const notesCount = notes?.length ?? 0;
  const bugsCount = bugs?.length ?? 0;
  const soloLevel = React.useMemo(() => getLevelInfo(soloXp).level, [soloXp]);
  const recentNotes = React.useMemo(
    () => (notes ?? []).slice().sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 3),
    [notes]
  );
  const recentBugs = React.useMemo(
    () => (bugs ?? []).slice().sort((a, b) => b.updatedAt - a.updatedAt).slice(0, 3),
    [bugs]
  );

  const tiles = [
    {
      href: "/notes",
      title: "Notes",
      description: "Rich-text QA notes, checklists and templates — organized by category, tag and collection.",
      count: mounted ? `${notesCount} note${notesCount === 1 ? "" : "s"}` : undefined,
      icon: StickyNote,
      accent: "bg-chart-1/15 text-chart-1",
    },
    {
      href: "/calculator",
      title: "Calculator",
      description: "60+ calculators for testing, agile, security, performance, dates and finance.",
      count: `${CALCULATORS.length} calculators`,
      icon: Calculator,
      accent: "bg-chart-2/15 text-chart-2",
    },
    {
      href: "/generator",
      title: "Test Data Generator",
      description: "Faker-powered test data across dozens of categories, plus image and QR/barcode tools.",
      count: `${ALL_GENERATORS.length} generators`,
      icon: Sparkles,
      accent: "bg-chart-3/15 text-chart-3",
    },
    {
      href: "/bugs",
      title: "Bug Reports",
      description: "Structured bug reports with attachments, reusable steps, labels and export history.",
      count: mounted ? `${bugsCount} bug report${bugsCount === 1 ? "" : "s"}` : undefined,
      icon: Bug,
      accent: "bg-chart-4/15 text-chart-4",
    },
    {
      href: "/journey",
      title: "Solo Leveling",
      description: "Gamified QA skill tracking — quests, skills, achievements and XP-based leveling.",
      count: mounted ? `Level ${soloLevel}` : undefined,
      icon: Swords,
      accent: "bg-chart-5/15 text-chart-5",
    },
  ];

  type Activity = { key: string; icon: React.ComponentType<{ className?: string }>; label: string; sub: string; href: string; ts: number };
  const activity: Activity[] = mounted
    ? [
        ...recentNotes.map((n) => ({
          key: `note-${n.id}`,
          icon: StickyNote,
          label: n.title || "Untitled note",
          sub: `Notes · ${timeAgo(n.updatedAt)}`,
          href: `/notes/${n.id}`,
          ts: n.updatedAt,
        })),
        ...calculatorHistory.slice(0, 3).map((e) => ({
          key: `calc-${e.id}`,
          icon: Calculator,
          label: e.calculatorName,
          sub: `Calculator · ${timeAgo(e.timestamp)}`,
          href: `/calculator/${e.calculatorSlug}`,
          ts: e.timestamp,
        })),
        ...generatorHistory.slice(0, 3).map((e) => ({
          key: `gen-${e.id}`,
          icon: Sparkles,
          label: e.generatorName,
          sub: `Generator · ${timeAgo(e.timestamp)}`,
          href: `/generator/g/${e.slug}`,
          ts: e.timestamp,
        })),
        ...recentBugs.map((b) => ({
          key: `bug-${b.id}`,
          icon: Bug,
          label: b.title || "Untitled bug report",
          sub: `Bug Reports · ${timeAgo(b.updatedAt)}`,
          href: `/bugs/${b.id}`,
          ts: b.updatedAt,
        })),
      ]
        .sort((a, b) => b.ts - a.ts)
        .slice(0, 6)
    : [];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex items-center gap-2.5">
          <LogoMark className="size-8" />
          <h1 className="font-[family-name:var(--font-plex-mono)] text-2xl font-bold tracking-tight">QuanGrade</h1>
        </div>
        <p className="mt-3 text-base font-semibold">Every QA tool. One system.</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Notes, calculators, test data generation, bug reports and skill tracking in one place.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tiles.map((tile) => (
          <Link key={tile.href} href={tile.href} className="group">
            <Card className="h-full transition-colors group-hover:border-primary/40">
              <CardHeader>
                <div className={cn("mb-2 flex size-9 items-center justify-center rounded-lg", tile.accent)}>
                  <tile.icon className="size-4.5" />
                </div>
                <CardTitle className="flex items-center justify-between">
                  {tile.title}
                  <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </CardTitle>
                <CardDescription>{tile.description}</CardDescription>
              </CardHeader>
              <CardContent>
                {tile.count ? (
                  <span className="text-xs font-medium text-muted-foreground">{tile.count}</span>
                ) : (
                  <Skeleton className="h-4 w-16" />
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="mb-3 flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
          <Clock className="size-4" />
          Recent activity
        </h2>
        {!mounted ? (
          <div className="space-y-2">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-12 w-full rounded-xl" />
            ))}
          </div>
        ) : activity.length === 0 ? (
          <Card>
            <CardContent className="py-6 text-center text-sm text-muted-foreground">
              Nothing yet — create a note, run a calculator, or generate some test data to see it here.
            </CardContent>
          </Card>
        ) : (
          <div className="divide-y divide-border rounded-xl border border-border bg-card">
            {activity.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="flex items-center gap-3 px-4 py-3 text-sm transition-colors hover:bg-accent/50"
              >
                <item.icon className="size-4 shrink-0 text-muted-foreground" />
                <span className="min-w-0 flex-1 truncate">{item.label}</span>
                <span className="shrink-0 text-xs text-muted-foreground">{item.sub}</span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
