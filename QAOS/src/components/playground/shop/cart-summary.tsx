import type { CartTotals } from "@/lib/playground/shop/pricing";

export function CartSummary({ totals }: { totals: CartTotals }) {
  return (
    <div className="space-y-2 rounded-lg border border-border bg-card p-4 text-sm">
      <div className="flex justify-between">
        <span className="text-muted-foreground">Subtotal</span>
        <span>${totals.subtotal.toFixed(2)}</span>
      </div>
      {totals.discount > 0 && (
        <div className="flex justify-between text-status-good">
          <span>Discount ({totals.discountPercent}%)</span>
          <span>-${totals.discount.toFixed(2)}</span>
        </div>
      )}
      <div className="flex justify-between">
        <span className="text-muted-foreground">Shipping</span>
        <span>{totals.shipping === 0 ? "Free" : `$${totals.shipping.toFixed(2)}`}</span>
      </div>
      <div className="flex justify-between border-t border-border pt-2 text-base font-semibold">
        <span>Total</span>
        <span>${totals.total.toFixed(2)}</span>
      </div>
    </div>
  );
}
