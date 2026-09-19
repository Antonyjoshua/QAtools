"use client";

import { useMemo, useState } from "react";
import { PRODUCTS } from "../products-seed";
import { useBugToggleStore } from "@/lib/playground/bug-registry/toggle-store";
import type { Product } from "../types";

export type SortOption = "relevance" | "price-asc" | "price-desc" | "rating-desc";

export function useProductCatalog() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("relevance");

  const bug004Active = useBugToggleStore((s) => s.isActive("BUG-004"));
  const bug005Active = useBugToggleStore((s) => s.isActive("BUG-005"));
  const bug006Active = useBugToggleStore((s) => s.isActive("BUG-006"));

  function setCategoryFilter(next: string | null) {
    setCategory(next);
    // BUG-005: selecting a category filter shouldn't touch the search box — it does when active.
    if (bug005Active) setQuery("");
  }

  const products = useMemo(() => {
    let list: Product[] = PRODUCTS;

    if (query.trim()) {
      list = list.filter((p) =>
        // BUG-004: search should be case- and whitespace-insensitive — it isn't when active.
        bug004Active ? p.name.includes(query) : p.name.toLowerCase().includes(query.trim().toLowerCase())
      );
    }

    if (category) {
      list = list.filter((p) => p.category === category);
    }

    // BUG-006: sort should still apply even when a category filter is active — dropped when active.
    if (bug006Active && category) return list;

    const sorted = [...list];
    if (sortBy === "price-asc") sorted.sort((a, b) => a.listPrice - b.listPrice);
    else if (sortBy === "price-desc") sorted.sort((a, b) => b.listPrice - a.listPrice);
    else if (sortBy === "rating-desc") sorted.sort((a, b) => b.rating - a.rating);
    return sorted;
  }, [query, category, sortBy, bug004Active, bug006Active]);

  return {
    products,
    query,
    setQuery,
    category,
    setCategory: setCategoryFilter,
    sortBy,
    setSortBy,
  };
}
