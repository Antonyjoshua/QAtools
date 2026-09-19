"use client";

import { useBugToggleStore } from "@/lib/playground/bug-registry/toggle-store";
import { cn } from "@/lib/utils";
import { ProductCard } from "./product-card";
import type { Product } from "@/lib/playground/shop/types";

export function ProductGrid({ products }: { products: Product[] }) {
  // BUG-024: no responsive columns — a fixed-width row overflows on narrow screens.
  const bug024Active = useBugToggleStore((s) => s.isActive("BUG-024"));

  if (products.length === 0) {
    return <p className="text-sm text-muted-foreground">No products match your search.</p>;
  }

  return (
    <div
      className={cn(
        bug024Active
          ? "flex gap-4 overflow-visible"
          : "grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      )}
    >
      {products.map((p) => (
        <div key={p.id} className={bug024Active ? "w-48 shrink-0" : undefined}>
          <ProductCard product={p} />
        </div>
      ))}
    </div>
  );
}
