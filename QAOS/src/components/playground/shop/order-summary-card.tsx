"use client";

import Link from "next/link";
import { useBugToggleStore } from "@/lib/playground/bug-registry/toggle-store";
import { Badge } from "@/components/ui/badge";
import type { Order } from "@/lib/playground/shop/types";

export function OrderSummaryCard({ order }: { order: Order }) {
  // BUG-023: should count total units across all lines — counts distinct line items instead when active.
  const bug023Active = useBugToggleStore((s) => s.isActive("BUG-023"));
  const itemCount = bug023Active
    ? order.items.length
    : order.items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <Link
      href={`/playground/shop/orders/${order.id}`}
      className="block rounded-lg border border-border bg-card p-4 transition-colors hover:border-primary/50"
    >
      <div className="flex items-center justify-between">
        <span className="font-medium">{order.displayId}</span>
        <Badge variant="secondary">{order.status}</Badge>
      </div>
      <div className="mt-1 text-sm text-muted-foreground">
        {itemCount} item{itemCount === 1 ? "" : "s"} · ${order.total.toFixed(2)} ·{" "}
        {new Date(order.createdAt).toLocaleDateString()}
      </div>
    </Link>
  );
}
