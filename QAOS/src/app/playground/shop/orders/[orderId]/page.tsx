"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { useOrder } from "@/lib/playground/shop/hooks/use-orders";

export default function OrderDetailPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = use(params);
  const order = useOrder(orderId);

  if (order === undefined) {
    return <p className="text-sm text-muted-foreground">Loading…</p>;
  }
  if (!order) return notFound();

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">{order.displayId}</h1>
        <Badge variant="secondary">{order.status}</Badge>
      </div>
      <div className="rounded-lg border border-border bg-card p-4">
        {order.items.map((item) => (
          <div
            key={item.productId}
            className="flex justify-between border-b border-border py-2 text-sm last:border-0"
          >
            <span>
              {item.name} × {item.quantity}
            </span>
            <span>${(item.unitPrice * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="mt-3 space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span>${order.subtotal.toFixed(2)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-status-good">
              <span>Discount</span>
              <span>-${order.discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-muted-foreground">Shipping</span>
            <span>{order.shipping === 0 ? "Free" : `$${order.shipping.toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between border-t border-border pt-1 font-semibold">
            <span>Total</span>
            <span>${order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
