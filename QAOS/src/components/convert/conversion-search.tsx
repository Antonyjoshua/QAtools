"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Search, ArrowRight } from "lucide-react";
import { getAllConversionPairs } from "@/lib/convert/core/engine";
import { getFormat } from "@/lib/convert/core/format-registry";
import { Input } from "@/components/ui/input";

export function ConversionSearch() {
  const router = useRouter();
  const [query, setQuery] = React.useState("");

  const results = React.useMemo(() => {
    // "to" is a connector in natural phrasing ("excel to pdf") rather than something that needs
    // to literally appear in a format's name — strip it and require every remaining word to
    // appear somewhere in the pair's text, rather than the whole query as one contiguous
    // substring (which "excel to pdf" would never match against "excel workbook ... pdf document").
    const words = query
      .trim()
      .toLowerCase()
      .replace(/\bto\b/g, " ")
      .split(/\s+/)
      .filter(Boolean);
    if (words.length === 0) return [];
    return getAllConversionPairs()
      .map((pair) => ({ pair, fromFmt: getFormat(pair.from), toFmt: getFormat(pair.to) }))
      .filter((r): r is typeof r & { fromFmt: NonNullable<typeof r.fromFmt>; toFmt: NonNullable<typeof r.toFmt> } => Boolean(r.fromFmt && r.toFmt))
      .filter(({ fromFmt, toFmt }) => {
        const haystack = `${fromFmt.label} ${fromFmt.id} ${toFmt.label} ${toFmt.id}`.toLowerCase();
        return words.every((w) => haystack.includes(w));
      })
      .slice(0, 8);
  }, [query]);

  return (
    <div className="relative">
      <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Convert from… e.g. Excel to PDF, PNG to JPG, JSON to CSV"
        className="h-11 pl-10"
      />
      {results.length > 0 && (
        <div className="absolute z-20 mt-1.5 w-full overflow-hidden rounded-lg border border-border bg-popover shadow-lg">
          {results.map(({ pair, fromFmt, toFmt }) => (
            <button
              key={`${pair.from}-${pair.to}`}
              type="button"
              onClick={() => {
                setQuery("");
                router.push(`/convert?from=${pair.from}&to=${pair.to}`);
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-accent"
            >
              <span className="font-medium">{fromFmt.label}</span>
              <ArrowRight className="size-3.5 text-muted-foreground" />
              <span className="font-medium">{toFmt.label}</span>
              {pair.requiresBackend && <span className="ml-auto text-xs text-muted-foreground">Coming soon</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
