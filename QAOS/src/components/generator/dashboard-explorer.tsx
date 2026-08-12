"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { CATEGORIES } from "@/lib/generator/categories";
import { ALL_GENERATORS } from "@/lib/generator/registry";
import { CategoryCard } from "@/components/generator/category-card";
import { GeneratorCard } from "@/components/generator/generator-card";

export function DashboardExplorer() {
  const [query, setQuery] = React.useState("");

  const counts = React.useMemo(() => {
    const map = new Map<string, number>();
    ALL_GENERATORS.forEach((g) => map.set(g.category, (map.get(g.category) ?? 0) + 1));
    return map;
  }, []);

  const results = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return ALL_GENERATORS.filter(
      (g) =>
        g.name.toLowerCase().includes(q) ||
        g.description.toLowerCase().includes(q) ||
        g.category.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="flex flex-col gap-8">
      <div className="relative max-w-xl">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search all 120+ generators — e.g. &ldquo;PAN&rdquo;, &ldquo;JWT&rdquo;, &ldquo;SQL insert&rdquo;, &ldquo;XSS&rdquo;…"
          className="h-10 pl-9 pr-9"
          autoComplete="off"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {query ? (
        <div>
          <p className="mb-3 text-sm text-muted-foreground">
            {results.length} result{results.length === 1 ? "" : "s"} for &ldquo;{query}&rdquo;
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {results.map((g) => (
              <GeneratorCard key={g.slug} generator={g} />
            ))}
          </div>
        </div>
      ) : (
        <div>
          <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-muted-foreground">Browse by category</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {CATEGORIES.map((c) => (
              <CategoryCard key={c.id} category={c} count={counts.get(c.id) ?? 0} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
