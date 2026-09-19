"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { CartSummary } from "@/components/playground/shop/cart-summary";
import { PaymentForm } from "@/components/playground/shop/payment-form";
import { AddressForm, type AddressFormValues } from "@/components/playground/shop/address-form";
import { useCart } from "@/lib/playground/shop/hooks/use-cart";
import { useAddresses } from "@/lib/playground/shop/hooks/use-addresses";
import { useCurrentUser } from "@/lib/playground/shop/hooks/use-current-user";
import { priceCartItems } from "@/lib/playground/shop/pricing";
import { createOrder } from "@/lib/playground/shop/orders-repo";
import { isBugActive, useBugToggleStore } from "@/lib/playground/bug-registry/toggle-store";

export default function CheckoutPage() {
  const router = useRouter();
  const { user, isLoggedIn } = useCurrentUser();
  const { items, clearCart } = useCart();
  const { addresses, defaultAddress, addAddress } = useAddresses();
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [placing, setPlacing] = useState(false);
  const bug019Active = useBugToggleStore((s) => s.isActive("BUG-019"));

  const totals = priceCartItems(items, 0);
  const effectiveAddressId = selectedAddressId ?? defaultAddress?.id ?? null;

  if (!isLoggedIn || !user) {
    return <p className="text-sm text-muted-foreground">Please log in to checkout.</p>;
  }
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">Your cart is empty.</p>;
  }

  async function handleAddAddress(values: AddressFormValues) {
    const addr = await addAddress({ userId: user!.id, ...values });
    setSelectedAddressId(addr.id);
  }

  async function handlePlaceOrder() {
    // BUG-018: checkout should require a shipping address — skipped when active.
    if (!effectiveAddressId && !isBugActive("BUG-018")) {
      toast.error("Please add a shipping address before placing your order.");
      return;
    }

    // BUG-019: the button should disable immediately on click — skipped when active, so a fast
    // double-click can fire this handler twice before the first order finishes.
    if (!bug019Active) {
      if (placing) return;
      setPlacing(true);
    }

    const order = await createOrder({
      userId: user!.id,
      items: totals.lines.map((l) => ({
        productId: l.productId,
        name: l.name,
        unitPrice: l.unitPrice,
        quantity: l.quantity,
      })),
      subtotal: totals.subtotal,
      discount: totals.discount,
      shipping: totals.shipping,
      total: totals.total,
      addressId: effectiveAddressId ?? "",
    });

    await clearCart(user!.id);
    toast.success("Order placed!");
    router.push(`/playground/shop/orders/${order.id}`);
  }

  return (
    <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-3">
      <div className="space-y-6 md:col-span-2">
        <div className="rounded-lg border border-border bg-card p-4">
          <h2 className="mb-3 font-semibold">Shipping Address</h2>
          {addresses.length > 0 && (
            <div className="mb-3 space-y-2">
              {addresses.map((addr) => (
                <label
                  key={addr.id}
                  className="flex items-start gap-2 rounded-md border border-border p-2 text-sm"
                >
                  <input
                    type="radio"
                    name="address"
                    checked={effectiveAddressId === addr.id}
                    onChange={() => setSelectedAddressId(addr.id)}
                  />
                  <span>
                    {addr.fullName}, {addr.line1}, {addr.city}, {addr.state} {addr.postalCode},{" "}
                    {addr.country}
                  </span>
                </label>
              ))}
            </div>
          )}
          <AddressForm onSubmit={handleAddAddress} submitLabel="Add & Use This Address" />
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <h2 className="mb-3 font-semibold">Payment</h2>
          <PaymentForm />
        </div>
      </div>
      <div className="space-y-3">
        <CartSummary totals={totals} />
        <Button className="w-full" disabled={!bug019Active && placing} onClick={handlePlaceOrder}>
          Place Order
        </Button>
      </div>
    </div>
  );
}
