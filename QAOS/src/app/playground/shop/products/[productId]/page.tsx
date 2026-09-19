"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { toast } from "sonner";
import { Star, ShoppingCart, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProductById } from "@/lib/playground/shop/products-seed";
import { formatRating } from "@/lib/playground/shop/pricing";
import { useBugToggleStore } from "@/lib/playground/bug-registry/toggle-store";
import { useCart } from "@/lib/playground/shop/hooks/use-cart";
import { useWishlist } from "@/lib/playground/shop/hooks/use-wishlist";
import { useCurrentUser } from "@/lib/playground/shop/hooks/use-current-user";

export default function ProductDetailPage({ params }: { params: Promise<{ productId: string }> }) {
  const { productId } = use(params);
  const product = getProductById(productId);
  const { isLoggedIn } = useCurrentUser();
  const { addToCart, userId } = useCart();
  const { addItem: addToWishlist } = useWishlist();
  const bug008Active = useBugToggleStore((s) => s.isActive("BUG-008"));
  const bug009Active = useBugToggleStore((s) => s.isActive("BUG-009"));

  if (!product) return notFound();

  const outOfStock = product.stock <= 0;
  const addDisabled = outOfStock && !bug008Active;

  async function handleAdd() {
    if (!isLoggedIn || !userId) {
      toast.error("Please log in to add items to your cart.");
      return;
    }
    await addToCart(userId, product!.id, 1);
    toast.success(`${product!.name} added to cart.`);
  }

  return (
    <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-2">
      <div
        className="flex h-72 items-center justify-center rounded-xl bg-muted text-8xl"
        role="img"
        aria-label={bug009Active ? undefined : `${product.name} product photo`}
      >
        {product.emoji}
      </div>
      <div className="space-y-3">
        <h1 className="text-2xl font-bold">{product.name}</h1>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Star className="size-4 fill-xp text-xp" /> {formatRating(product.rating)} rating
        </div>
        <p className="text-sm text-muted-foreground">{product.description}</p>
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold">${product.listPrice.toFixed(2)}</span>
          {outOfStock ? (
            <span className="text-sm text-status-critical">Out of stock</span>
          ) : (
            <span className="text-sm text-status-good">{product.stock} in stock</span>
          )}
        </div>
        <div className="flex gap-2 pt-2">
          <Button disabled={addDisabled} onClick={handleAdd}>
            <ShoppingCart /> Add to Cart
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              if (!isLoggedIn) {
                toast.error("Please log in to use your wishlist.");
                return;
              }
              void addToWishlist(product.id);
              toast.success("Added to wishlist.");
            }}
          >
            <Heart /> Wishlist
          </Button>
        </div>
      </div>
    </div>
  );
}
