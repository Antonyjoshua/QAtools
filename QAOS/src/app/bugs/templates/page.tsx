"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";
import { BUG_TEMPLATES } from "@/lib/bugs/bug-templates";
import { createBug } from "@/lib/bugs/bugs-repo";
import { useFavoritesStore } from "@/lib/bugs/favorites-store";
import { DynamicIcon } from "@/components/icon";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function TemplatesPage() {
  const router = useRouter();
  const [creatingId, setCreatingId] = React.useState<string | null>(null);
  const favoriteIds = useFavoritesStore((s) => s.favoriteTemplateIds);
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavoriteTemplate);

  const sorted = React.useMemo(() => {
    return [...BUG_TEMPLATES].sort((a, b) => {
      const aFav = favoriteIds.includes(a.id) ? 0 : 1;
      const bFav = favoriteIds.includes(b.id) ? 0 : 1;
      return aFav - bFav;
    });
  }, [favoriteIds]);

  async function applyTemplate(templateId: string) {
    setCreatingId(templateId);
    try {
      const template = BUG_TEMPLATES.find((t) => t.id === templateId);
      if (!template) return;
      const bug = await createBug({
        title: template.titleHint,
        category: template.category,
        severity: template.severity,
        priority: template.priority,
        preconditions: template.preconditions(),
        stepsToReproduce: template.steps(),
        expectedResult: template.expected(),
        actualResult: template.actual(),
      });
      router.push(`/bugs/${bug.id}`);
    } finally {
      setCreatingId(null);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold tracking-tight">Report Templates</h1>
      <p className="mt-1 text-muted-foreground">Start from a bug-type template with pre-filled category, severity, and structure.</p>

      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((t) => {
          const isFav = favoriteIds.includes(t.id);
          return (
            <div
              key={t.id}
              className="group relative flex flex-col gap-2 rounded-xl border border-border bg-card p-4 text-left transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
            >
              <button
                onClick={() => toggleFavorite(t.id)}
                className="absolute right-3 top-3 text-muted-foreground hover:text-warning"
                aria-label="Favorite template"
              >
                <Star className={cn("size-4", isFav && "fill-current text-warning")} />
              </button>
              <button onClick={() => applyTemplate(t.id)} disabled={creatingId !== null} className="flex flex-col gap-2 text-left disabled:opacity-60">
                <div className="flex items-center gap-2.5 pr-6">
                  <div className="flex size-9 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                    <DynamicIcon name={t.icon} className="size-4.5" />
                  </div>
                  <h3 className="font-medium tracking-tight">{t.name}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{t.description}</p>
                <div className="flex flex-wrap gap-1.5">
                  <Badge variant="secondary" className="text-[10px] font-normal">
                    {t.category}
                  </Badge>
                  <Badge variant="outline" className="text-[10px] font-normal">
                    {t.severity}
                  </Badge>
                  <Badge variant="outline" className="text-[10px] font-normal">
                    {t.priority}
                  </Badge>
                </div>
                <span className="w-fit text-xs font-medium text-primary">{creatingId === t.id ? "Creating…" : "Use template →"}</span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
