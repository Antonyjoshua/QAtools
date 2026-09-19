"use client";

import Link from "next/link";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useBugToggleStore } from "@/lib/playground/bug-registry/toggle-store";
import { formatRating } from "@/lib/playground/shop/pricing";
import { useCart } from "@/lib/playground/shop/hooks/use-cart";
import { useWishlist } from "@/lib/playground/shop/hooks/use-wishlist";
import { useCurrentUser } from "@/lib/playground/shop/hooks/use-current-user";
import type { Product } from "@/lib/playground/shop/types";

export function ProductCard({ product }: { product: Product }) {
  const { isLoggedIn } = useCurrentUser();
  const { addToCart, userId } = useCart();
  const { addItem: addToWishlist } = useWishlist();
  const bug008Active = useBugToggleStore((s) => s.isActive("BUG-008"));
  const bug009Active = useBugToggleStore((s) => s.isActive("BUG-009"));

  const outOfStock = product.stock <= 0;
  const addDisabled = outOfStock && !bug008Active;

  async function handleAddToCart() {
    if (!isLoggedIn || !userId) {
      toast.error("Please log in to add items to your cart.");
      return;
    }
    await addToCart(userId, product.id, 1);
    toast.success(`${product.name} added to cart.`);
  }

  return (
    <div className="flex flex-col rounded-lg border border-border bg-card p-3">
      <Link href={`/playground/shop/products/${product.id}`} className="flex flex-col gap-2">
        <div
          className="flex h-32 items-center justify-center rounded-md bg-muted text-5xl"
          role="img"
          // BUG-009: the descriptive label is dropped when active.
          aria-label={bug009Active ? undefined : `${product.name} product photo`}
        >
          {product.emoji}
        </div>
        <div className="text-sm font-medium">{product.name}</div>
      </Link>
      <div className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
        <Star className="size-3 fill-xp text-xp" />
        {formatRating(product.rating)}
      </div>
      <div className="mt-1 flex items-center justify-between">
        <span className="font-semibold">${product.listPrice.toFixed(2)}</span>
        {outOfStock && <span className="text-xs text-status-critical">Out of stock</span>}
      </div>
      <div className="mt-2 flex gap-2">
        <Button size="sm" className="flex-1" disabled={addDisabled} onClick={handleAddToCart}>
          <ShoppingCart /> Add
        </Button>
        <Button
          size="icon"
          variant="outline"
          aria-label="Add to wishlist"
          onClick={() => {
            if (!isLoggedIn) {
              toast.error("Please log in to use your wishlist.");
              return;
            }
            void addToWishlist(product.id);
            toast.success("Added to wishlist.");
          }}
        >
          <Heart className="size-4" />
        </Button>
      </div>
    </div>
  );
}
