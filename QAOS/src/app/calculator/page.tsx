"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Clock } from "lucide-react";
import { DashboardStats } from "@/components/calculator/dashboard/stats";
import { CalculatorCard } from "@/components/calculator/dashboard/calculator-card";
import { CALCULATORS, getCalculatorsByCategory } from "@/lib/calculator/registry";
import { CATEGORY_META, type CalculatorCategory } from "@/lib/calculator/types";
import { useFavoritesStore } from "@/lib/calculator/store/favorites-store";
import { useHistoryStore } from "@/lib/calculator/store/history-store";
import { Badge } from "@/components/ui/badge";

const CATEGORIES: CalculatorCategory[] = [
  "financial",
  "testing",
  "agile",
  "datetime",
  "performance",
  "api",
  "security",
  "mobile",
  "web",
  "ui-ux",
  "file-utils",
  "reporting",
  "utility",
];

export default function DashboardPage() {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time SSR/client hydration flag
    setMounted(true);
  }, []);

  const favoriteIds = useFavoritesStore((s) => s.favoriteIds);
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);
  const entries = useHistoryStore((s) => s.entries);

  const favoriteCalculators = CALCULATORS.filter((c) => favoriteIds.includes(c.id));
  const recent = entries.slice(0, 5);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-10 text-center sm:text-left"
      >
        <Badge variant="secondary" className="mb-3 rounded-full">
          {CALCULATORS.length}+ calculators for QA, BA, PM & Finance teams
        </Badge>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          Every calculation your team needs, <span className="gradient-text">in one place.</span>
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-muted-foreground sm:mx-0 sm:text-base">
          GST, pricing, discounts, QA metrics, dates and dev utilities — with full formula
          breakdowns, validation and calculation history.
        </p>
      </motion.section>

      <section className="mb-10">
        <DashboardStats />
      </section>

      {mounted && (favoriteCalculators.length > 0 || recent.length > 0) && (
        <section className="mb-10 grid gap-6 lg:grid-cols-2">
          {favoriteCalculators.length > 0 && (
            <div>
              <h2 className="mb-3 text-sm font-semibold text-muted-foreground">Favorites</h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {favoriteCalculators.map((c) => (
                  <CalculatorCard
                    key={c.id}
                    calculator={c}
                    favorite
                    onToggleFavorite={() => toggleFavorite(c.id)}
                  />
                ))}
              </div>
            </div>
          )}
          {recent.length > 0 && (
            <div>
              <h2 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-muted-foreground">
                <Clock className="size-3.5" /> Recent Calculations
              </h2>
              <div className="glass-card divide-y divide-border/60 rounded-2xl">
                {recent.map((entry) => (
                  <Link
                    key={entry.id}
                    href={`/calculator/${entry.calculatorSlug}?state=${btoa(
                      encodeURIComponent(JSON.stringify(entry.inputs))
                    )}`}
                    className="flex items-center justify-between gap-3 p-3 text-sm transition-colors hover:bg-accent/60"
                  >
                    <span className="truncate">{entry.calculatorName}</span>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      {new Date(entry.timestamp).toLocaleTimeString(undefined, {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </section>
      )}

      {CATEGORIES.map((category, ci) => {
        const items = getCalculatorsByCategory(category);
        if (!items.length) return null;
        return (
          <motion.section
            key={category}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: ci * 0.05 }}
            className="mb-10"
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">{CATEGORY_META[category].label}</h2>
                <p className="text-sm text-muted-foreground">{CATEGORY_META[category].description}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {items.map((calc) => (
                <CalculatorCard
                  key={calc.id}
                  calculator={calc}
                  favorite={mounted && favoriteIds.includes(calc.id)}
                  onToggleFavorite={() => toggleFavorite(calc.id)}
                />
              ))}
            </div>
          </motion.section>
        );
      })}
    </div>
  );
}
