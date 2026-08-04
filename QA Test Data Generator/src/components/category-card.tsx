import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CategoryIcon } from "@/components/icon";
import type { CategoryDef } from "@/lib/generators/types";

export function CategoryCard({ category, count }: { category: CategoryDef; count: number }) {
  return (
    <Link
      href={`/category/${category.id}`}
      className="group relative flex flex-col gap-3 overflow-hidden rounded-xl border border-border bg-card p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5"
    >
      <div
        className="flex size-10 items-center justify-center rounded-lg"
        style={{ backgroundColor: `color-mix(in oklch, ${category.accent} 16%, transparent)`, color: category.accent }}
      >
        <CategoryIcon name={category.icon} className="size-5" />
      </div>
      <div className="flex-1">
        <h3 className="font-medium tracking-tight">{category.name}</h3>
        <p className="mt-1 text-sm text-muted-foreground line-clamp-2">{category.description}</p>
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{count} generators</span>
        <ArrowRight className="size-3.5 -translate-x-1 opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
      </div>
    </Link>
  );
}
