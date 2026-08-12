"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { Activity, Star, TrendingUp, CalendarClock } from "lucide-react";
import { AnimatedNumber } from "@/components/calculator/animated-number";
import { useHistoryStore } from "@/lib/calculator/store/history-store";
import { useFavoritesStore } from "@/lib/calculator/store/favorites-store";
import { getCalculator } from "@/lib/calculator/registry";
import { Skeleton } from "@/components/ui/skeleton";

function isToday(ts: number) {
  const d = new Date(ts);
  const now = new Date();
  return (
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear()
  );
}

export function DashboardStats() {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time SSR/client hydration flag
    setMounted(true);
  }, []);

  const entries = useHistoryStore((s) => s.entries);
  const favoriteIds = useFavoritesStore((s) => s.favoriteIds);

  const stats = React.useMemo(() => {
    const todayCount = entries.filter((e) => isToday(e.timestamp)).length;
    const counts = new Map<string, number>();
    for (const e of entries) counts.set(e.calculatorId, (counts.get(e.calculatorId) ?? 0) + 1);
    let mostUsedId: string | null = null;
    let mostUsedCount = 0;
    for (const [id, count] of counts) {
      if (count > mostUsedCount) {
        mostUsedId = id;
        mostUsedCount = count;
      }
    }
    const mostUsed = mostUsedId ? getCalculator(entries.find((e) => e.calculatorId === mostUsedId)!.calculatorSlug) : null;

    return {
      total: entries.length,
      today: todayCount,
      favorites: favoriteIds.length,
      mostUsedName: mostUsed?.name ?? "—",
      mostUsedCount,
    };
  }, [entries, favoriteIds]);

  const cards = [
    { label: "Total Calculations", value: stats.total, icon: Activity, isNumber: true },
    { label: "Today", value: stats.today, icon: CalendarClock, isNumber: true },
    { label: "Favorites", value: stats.favorites, icon: Star, isNumber: true },
    { label: "Most Used", value: stats.mostUsedName, icon: TrendingUp, isNumber: false },
  ];

  if (!mounted) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-2xl" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {cards.map((card, i) => (
        <motion.div
          key={card.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: i * 0.05 }}
          className="glass-card rounded-2xl p-4"
        >
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <card.icon className="size-3.5" />
            {card.label}
          </div>
          <p className="mt-2 truncate text-xl font-semibold tabular-nums">
            {card.isNumber ? <AnimatedNumber value={card.value as number} /> : (card.value as string)}
          </p>
        </motion.div>
      ))}
    </div>
  );
}
