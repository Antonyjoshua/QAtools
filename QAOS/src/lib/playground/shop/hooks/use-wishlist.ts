"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { toast } from "sonner";
import { db } from "../db";
import { useSessionStore } from "../session-store";
import { getProductById } from "../products-seed";
import * as wishlistRepo from "../wishlist-repo";
import { isBugActive } from "@/lib/playground/bug-registry/toggle-store";
import type { Product, WishlistItem } from "../types";

export interface WishlistLine {
  item: WishlistItem;
  product: Product;
}

export function useWishlist() {
  const userId = useSessionStore((s) => s.currentUserId);

  const items =
    useLiveQuery(
      () => (userId ? db.wishlist.where("userId").equals(userId).toArray() : []),
      [userId]
    ) ?? [];

  const withProducts: WishlistLine[] = items.flatMap((item) => {
    const product = getProductById(item.productId);
    return product ? [{ item, product }] : [];
  });

  async function addItem(productId: string) {
    if (!userId) return;
    await wishlistRepo.addToWishlist(userId, productId);
  }

  async function removeItem(item: WishlistItem) {
    await wishlistRepo.removeFromWishlist(item.id);
    toast("Removed from wishlist", {
      action: {
        label: "Undo",
        onClick: () => {
          // BUG-014: undo should restore the item — skipped entirely when active.
          if (!isBugActive("BUG-014")) {
            void wishlistRepo.restoreWishlistItem(item);
          }
        },
      },
    });
  }

  return { items, withProducts, addItem, removeItem };
}
