"use client";

import { ProductFilters } from "@/components/playground/shop/product-filters";
import { ProductGrid } from "@/components/playground/shop/product-grid";
import { useProductCatalog } from "@/lib/playground/shop/hooks/use-products";

export default function ProductsPage() {
  const { products, query, setQuery, category, setCategory, sortBy, setSortBy } = useProductCatalog();

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <h1 className="text-xl font-bold">All Products</h1>
      <ProductFilters
        query={query}
        setQuery={setQuery}
        category={category}
        setCategory={setCategory}
        sortBy={sortBy}
        setSortBy={setSortBy}
      />
      <ProductGrid products={products} />
    </div>
  );
}
