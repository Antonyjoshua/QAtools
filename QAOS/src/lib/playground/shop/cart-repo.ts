import { db } from "./db";
import { uid } from "@/lib/playground/id";
import { isBugActive } from "@/lib/playground/bug-registry/toggle-store";

export async function addToCart(userId: string, productId: string, quantity = 1): Promise<void> {
  const existing = await db.cart.where("[userId+productId]").equals([userId, productId]).first();
  if (existing) {
    await db.cart.update(existing.id, { quantity: existing.quantity + quantity });
  } else {
    await db.cart.add({ id: uid(), userId, productId, quantity, addedAt: new Date().toISOString() });
  }
}

export async function updateQuantity(cartItemId: string, requestedQuantity: number): Promise<void> {
  // BUG-010: quantity should never go negative — skipped when active.
  const quantity = isBugActive("BUG-010") ? requestedQuantity : Math.max(0, requestedQuantity);

  // BUG-011: a quantity of 0 should remove the line item — skipped when active, leaving a $0 row.
  if (quantity === 0 && !isBugActive("BUG-011")) {
    await db.cart.delete(cartItemId);
    return;
  }
  await db.cart.update(cartItemId, { quantity });
}

export async function removeFromCart(cartItemId: string): Promise<void> {
  await db.cart.delete(cartItemId);
}

export async function clearCart(userId: string): Promise<void> {
  const items = await db.cart.where("userId").equals(userId).toArray();
  await db.cart.bulkDelete(items.map((i) => i.id));
}
