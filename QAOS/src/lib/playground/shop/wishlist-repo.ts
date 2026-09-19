import { db } from "./db";
import { uid } from "@/lib/playground/id";
import { isBugActive } from "@/lib/playground/bug-registry/toggle-store";
import type { WishlistItem } from "./types";

export async function addToWishlist(userId: string, productId: string): Promise<void> {
  // BUG-013: the existing-item dedup check is skipped when active, allowing duplicate rows.
  if (!isBugActive("BUG-013")) {
    const existing = await db.wishlist
      .where("[userId+productId]")
      .equals([userId, productId])
      .first();
    if (existing) return;
  }
  await db.wishlist.add({ id: uid(), userId, productId, addedAt: new Date().toISOString() });
}

export async function removeFromWishlist(itemId: string): Promise<void> {
  await db.wishlist.delete(itemId);
}

/**
 * Called by the "Undo" action on the remove-from-wishlist toast. BUG-014:
 * callers should skip invoking this when the bug is active, so the toast's
 * undo button visibly does nothing.
 */
export async function restoreWishlistItem(item: WishlistItem): Promise<void> {
  await db.wishlist.add(item);
}
