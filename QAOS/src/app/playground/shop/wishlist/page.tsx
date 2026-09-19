"use client";

import { ShoppingCart, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/lib/playground/shop/hooks/use-wishlist";
import { useCart } from "@/lib/playground/shop/hooks/use-cart";
import { useCurrentUser } from "@/lib/playground/shop/hooks/use-current-user";

export default function WishlistPage() {
  const { isLoggedIn } = useCurrentUser();
  const { withProducts, removeItem } = useWishlist();
  const { addToCart, userId } = useCart();

  if (!isLoggedIn) {
    return <p className="text-sm text-muted-foreground">Please log in to view your wishlist.</p>;
  }
  if (withProducts.length === 0) {
    return <p className="text-sm text-muted-foreground">Your wishlist is empty.</p>;
  }

  return (
    <div className="mx-auto max-w-2xl space-y-3">
      <h1 className="text-xl font-bold">Wishlist</h1>
      {withProducts.map(({ item, product }) => (
        <div key={item.id} className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
          <div className="flex size-12 items-center justify-center rounded-md bg-muted text-2xl">
            {product.emoji}
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium">{product.name}</div>
            <div className="text-xs text-muted-foreground">${product.listPrice.toFixed(2)}</div>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={async () => {
              if (!userId) return;
              await addToCart(userId, product.id, 1);
              toast.success("Added to cart.");
            }}
          >
            <ShoppingCart className="size-3.5" /> Add to cart
          </Button>
          <Button size="icon-sm" variant="ghost" aria-label="Remove" onClick={() => removeItem(item)}>
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      ))}
    </div>
  );
}
