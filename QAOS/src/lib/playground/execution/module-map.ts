import type { ShopModule } from "@/lib/playground/bug-registry/types";

const REQUIREMENT_MODULE: Record<string, ShopModule> = {
  "req-password-reset": "Auth",
  "req-profile-name": "Profile",
  "req-cart-quantity": "Cart",
  "req-coupon-apply": "Coupons",
  "req-product-search": "Catalog",
  "req-checkout-address": "Checkout",
  "req-order-cancellation": "Orders",
};

export function moduleForRequirement(requirementId: string): ShopModule {
  return REQUIREMENT_MODULE[requirementId] ?? "Catalog";
}
