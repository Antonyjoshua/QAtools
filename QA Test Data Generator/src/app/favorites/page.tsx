"use client";

import { Star } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { getGeneratorBySlug } from "@/lib/generators/registry";
import { GeneratorCard } from "@/components/generator-card";

export default function FavoritesPage() {
  const favorites = useAppStore((s) => s.favorites);
  const generators = favorites.map((slug) => getGeneratorBySlug(slug)).filter((g): g is NonNullable<typeof g> => Boolean(g));

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold tracking-tight">Favorites</h1>
      <p className="mt-1 text-muted-foreground">Generators you&apos;ve starred for quick access.</p>

      {generators.length === 0 ? (
        <div className="mt-10 flex flex-col items-center gap-3 rounded-xl border border-dashed border-border py-16 text-center">
          <Star className="size-8 text-muted-foreground" />
          <p className="text-muted-foreground">No favorites yet. Star a generator to see it here.</p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {generators.map((g) => (
            <GeneratorCard key={g.slug} generator={g} />
          ))}
        </div>
      )}
    </div>
  );
}
