"use client";

import * as React from "react";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { DOMAINS, searchDomains } from "@/lib/generator/domains/domains";
import { ALL_DOMAIN_CATEGORIES } from "@/lib/generator/domains/registry";
import { DomainCard } from "@/components/generator/domains/domain-card";

export function DomainList() {
  const [query, setQuery] = React.useState("");

  const counts = React.useMemo(() => {
    const map = new Map<string, number>();
    ALL_DOMAIN_CATEGORIES.forEach((c) => map.set(c.domainId, (map.get(c.domainId) ?? 0) + 1));
    return map;
  }, []);

  const results = React.useMemo(() => searchDomains(query), [query]);

  return (
    <div className="flex flex-col gap-6">
      <div className="relative max-w-xl">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Search ${DOMAINS.length} domains — e.g. "Banking", "Healthcare", "CRM"…`}
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

      <p className="text-sm text-muted-foreground">
        {results.length} domain{results.length === 1 ? "" : "s"}
        {query && <> for &ldquo;{query}&rdquo;</>}
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {results.map((d) => (
          <DomainCard key={d.id} domain={d} count={counts.get(d.id) ?? 0} />
        ))}
      </div>
    </div>
  );
}
