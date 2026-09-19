"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../db";
import { getEffectiveCartUserId, useSessionStore } from "../session-store";
import { getProductById } from "../products-seed";
import { priceCartItems } from "../pricing";
import * as cartRepo from "../cart-repo";
import type { CartItem, Product } from "../types";

export interface CartLine {
  item: CartItem;
  product: Product;
}

export function useCart() {
  // Subscribing here makes the effective-user-id computation below reactive to login/logout.
  useSessionStore((s) => s.currentUserId);
  useSessionStore((s) => s.lastUserId);
  const userId = getEffectiveCartUserId();

  const items =
    useLiveQuery(
      () => (userId ? db.cart.where("userId").equals(userId).toArray() : []),
      [userId]
    ) ?? [];

  const withProducts: CartLine[] = items.flatMap((item) => {
    const product = getProductById(item.productId);
    return product ? [{ item, product }] : [];
  });

  return {
    userId,
    items,
    withProducts,
    count: items.reduce((sum, i) => sum + i.quantity, 0),
    addToCart: cartRepo.addToCart,
    updateQuantity: cartRepo.updateQuantity,
    removeFromCart: cartRepo.removeFromCart,
    clearCart: cartRepo.clearCart,
  };
}

export function useCartTotals(appliedCouponPercent: number) {
  const { items } = useCart();
  return priceCartItems(items, appliedCouponPercent);
}
