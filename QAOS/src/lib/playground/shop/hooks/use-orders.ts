"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../db";
import { useSessionStore } from "../session-store";

export function useOrders() {
  const userId = useSessionStore((s) => s.currentUserId);
  const orders =
    useLiveQuery(async () => {
      if (!userId) return [];
      const list = await db.orders.where("userId").equals(userId).toArray();
      return list.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
    }, [userId]) ?? [];
  return { orders };
}

export function useOrder(orderId: string) {
  return useLiveQuery(() => db.orders.get(orderId), [orderId]);
}
