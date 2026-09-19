"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORIES } from "@/lib/playground/shop/products-seed";
import type { SortOption } from "@/lib/playground/shop/hooks/use-products";

interface Props {
  query: string;
  setQuery: (q: string) => void;
  category: string | null;
  setCategory: (c: string | null) => void;
  sortBy: SortOption;
  setSortBy: (s: SortOption) => void;
}

export function ProductFilters({ query, setQuery, category, setCategory, sortBy, setSortBy }: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Input
        placeholder="Search products…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="max-w-xs"
      />
      <div className="flex flex-wrap gap-1.5">
        <Button size="sm" variant={category === null ? "default" : "outline"} onClick={() => setCategory(null)}>
          All
        </Button>
        {CATEGORIES.map((c) => (
          <Button
            key={c}
            size="sm"
            variant={category === c ? "default" : "outline"}
            onClick={() => setCategory(c)}
          >
            {c}
          </Button>
        ))}
      </div>
      <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
        <SelectTrigger size="sm" className="ml-auto">
          <SelectValue placeholder="Sort" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="relevance">Relevance</SelectItem>
          <SelectItem value="price-asc">Price: Low to High</SelectItem>
          <SelectItem value="price-desc">Price: High to Low</SelectItem>
          <SelectItem value="rating-desc">Rating</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
