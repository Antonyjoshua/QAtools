import { db } from "./db";
import { uid, displayId } from "@/lib/playground/id";
import type { Order, OrderItem } from "./types";

export interface CreateOrderInput {
  userId: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  couponCode?: string;
  addressId: string;
}

/**
 * Unconditionally creates an order — it's the caller's job (the checkout
 * submit handler) to guard against calling this twice for one click. That's
 * intentional: BUG-019 (duplicate orders on double-click) lives entirely in
 * whether the UI debounces the submit, not in this function.
 */
export async function createOrder(input: CreateOrderInput): Promise<Order> {
  const order: Order = {
    id: uid(),
    displayId: displayId("ORD"),
    status: "Placed",
    createdAt: new Date().toISOString(),
    ...input,
  };
  await db.orders.add(order);
  return order;
}
