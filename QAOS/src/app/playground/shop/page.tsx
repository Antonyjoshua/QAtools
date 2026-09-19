import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/playground/shop/product-grid";
import { PRODUCTS } from "@/lib/playground/shop/products-seed";

export default function ShopHomePage() {
  const featured = PRODUCTS.slice(0, 8);
  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="rounded-xl border border-border bg-card p-6">
        <h1 className="text-2xl font-bold">Welcome to Brightbasket</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          A fictional e-commerce store built for QA practice. Everything here — including the bugs —
          is real.
        </p>
        <Button
          className="mt-4"
          nativeButton={false}
          render={<Link href="/playground/shop/products">Browse all products</Link>}
        />
      </div>
      <div>
        <h2 className="mb-3 text-lg font-semibold">Featured Products</h2>
        <ProductGrid products={featured} />
      </div>
    </div>
  );
}
