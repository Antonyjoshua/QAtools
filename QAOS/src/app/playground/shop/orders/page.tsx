"use client";

import { OrderSummaryCard } from "@/components/playground/shop/order-summary-card";
import { useOrders } from "@/lib/playground/shop/hooks/use-orders";
import { useCurrentUser } from "@/lib/playground/shop/hooks/use-current-user";

export default function OrdersPage() {
  const { isLoggedIn } = useCurrentUser();
  const { orders } = useOrders();

  if (!isLoggedIn) {
    return <p className="text-sm text-muted-foreground">Please log in to view your orders.</p>;
  }
  if (orders.length === 0) {
    return <p className="text-sm text-muted-foreground">You haven&apos;t placed any orders yet.</p>;
  }

  return (
    <div className="mx-auto max-w-2xl space-y-3">
      <h1 className="text-xl font-bold">Order History</h1>
      {orders.map((o) => (
        <OrderSummaryCard key={o.id} order={o} />
      ))}
    </div>
  );
}
