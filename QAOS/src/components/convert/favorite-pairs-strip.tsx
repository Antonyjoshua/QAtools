"use client";

import Link from "next/link";
import { Star } from "lucide-react";
import { useConvertSettings } from "@/lib/convert/settings-store";
import { getFormat } from "@/lib/convert/core/format-registry";

export function FavoritePairsStrip() {
  const favoritePairs = useConvertSettings((s) => s.favoritePairs);
  if (favoritePairs.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {favoritePairs.map((pair) => {
        const [from, to] = pair.split(":");
        const fromFmt = getFormat(from);
        const toFmt = getFormat(to);
        if (!fromFmt || !toFmt) return null;
        return (
          <Link
            key={pair}
            href={`/convert?from=${from}&to=${to}`}
            className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium hover:border-primary/40"
          >
            <Star className="size-3 fill-yellow-400 text-yellow-500" />
            {fromFmt.id.toUpperCase()} → {toFmt.id.toUpperCase()}
          </Link>
        );
      })}
    </div>
  );
}
