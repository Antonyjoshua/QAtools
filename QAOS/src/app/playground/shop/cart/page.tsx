"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CartLineItem } from "@/components/playground/shop/cart-line-item";
import { CartSummary } from "@/components/playground/shop/cart-summary";
import { CouponField } from "@/components/playground/shop/coupon-field";
import { useCart } from "@/lib/playground/shop/hooks/use-cart";
import { priceCartItems, applyCouponPercent } from "@/lib/playground/shop/pricing";
import { useCurrentUser } from "@/lib/playground/shop/hooks/use-current-user";

export default function CartPage() {
  const { isLoggedIn } = useCurrentUser();
  const { withProducts, items, updateQuantity, removeFromCart } = useCart();
  const [appliedPercent, setAppliedPercent] = useState(0);
  const [appliedCode, setAppliedCode] = useState<string | null>(null);

  const totals = priceCartItems(items, appliedPercent);

  function handleApplyCoupon(code: string, percentOff: number) {
    setAppliedPercent((prev) => applyCouponPercent(prev, percentOff));
    setAppliedCode(code);
  }

  if (!isLoggedIn) {
    return <p className="text-sm text-muted-foreground">Please log in to view your cart.</p>;
  }
  if (withProducts.length === 0) {
    return <p className="text-sm text-muted-foreground">Your cart is empty.</p>;
  }

  return (
    <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-3">
      <div className="rounded-lg border border-border bg-card p-4 md:col-span-2">
        {withProducts.map((line) => {
          const priced = totals.lines.find((l) => l.productId === line.product.id);
          return (
            <CartLineItem
              key={line.item.id}
              line={line}
              unitPrice={priced?.unitPrice ?? line.product.listPrice}
              onUpdateQuantity={updateQuantity}
              onRemove={removeFromCart}
            />
          );
        })}
      </div>
      <div className="space-y-3">
        <CouponField subtotal={totals.subtotal} appliedCode={appliedCode} onApply={handleApplyCoupon} />
        <CartSummary totals={totals} />
        <Button
          className="w-full"
          nativeButton={false}
          render={<Link href="/playground/shop/checkout">Proceed to Checkout</Link>}
        />
      </div>
    </div>
  );
}
