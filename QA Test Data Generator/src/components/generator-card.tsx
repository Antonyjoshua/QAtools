"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import type { GeneratorModule } from "@/lib/generators/types";
import { useAppStore } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const KIND_LABEL: Record<string, string> = {
  table: "Table",
  json: "JSON",
  text: "Text",
  sql: "SQL",
  code: "Code",
};

export function GeneratorCard({ generator }: { generator: GeneratorModule }) {
  const isFavorite = useAppStore((s) => s.isFavorite(generator.slug));
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);

  return (
    <div className="group relative flex flex-col gap-2 rounded-xl border border-border bg-card p-4 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5">
      <Link href={`/g/${generator.slug}`} className="flex flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-medium leading-snug tracking-tight pr-6">{generator.name}</h3>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2 flex-1">{generator.description}</p>
        <div className="flex items-center gap-1.5">
          <Badge variant="secondary" className="text-[10px] font-normal">
            {KIND_LABEL[generator.outputKind] ?? generator.outputKind}
          </Badge>
          {generator.note && (
            <Badge variant="outline" className="text-[10px] font-normal text-warning border-warning/40">
              Synthetic
            </Badge>
          )}
        </div>
      </Link>
      <button
        type="button"
        aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        onClick={(e) => {
          e.preventDefault();
          toggleFavorite(generator.slug);
        }}
        className={cn(
          "absolute right-3 top-3 rounded-md p-1 text-muted-foreground/50 transition-colors hover:text-warning",
          isFavorite && "text-warning"
        )}
      >
        <Star className={cn("size-4", isFavorite && "fill-current")} />
      </button>
    </div>
  );
}
