import { isBugActive } from "@/lib/playground/bug-registry/toggle-store";
import { getProductById } from "./products-seed";
import { findCoupon } from "./coupons-seed";
import { FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING } from "./constants";
import type { CartItem } from "./types";

export interface PricedLine {
  productId: string;
  name: string;
  unitPrice: number;
  quantity: number;
  lineTotal: number;
}

export interface CartTotals {
  lines: PricedLine[];
  subtotal: number;
  discountPercent: number;
  discount: number;
  shipping: number;
  total: number;
}

export function priceCartItems(items: CartItem[], appliedCouponPercent: number): CartTotals {
  const lines: PricedLine[] = items
    .map((item) => {
      const product = getProductById(item.productId);
      if (!product) return null;
      // BUG-012: checkout should use the same price shown in the catalog (`listPrice`).
      // When active, it uses `price` instead — identical for every SKU except one.
      const unitPrice = isBugActive("BUG-012") ? product.price : product.listPrice;
      return {
        productId: product.id,
        name: product.name,
        unitPrice,
        quantity: item.quantity,
        lineTotal: unitPrice * item.quantity,
      };
    })
    .filter((l): l is PricedLine => l !== null);

  const subtotal = lines.reduce((sum, l) => sum + l.lineTotal, 0);
  const discount = subtotal * (appliedCouponPercent / 100);

  // BUG-017: the free-shipping threshold should be checked against what's actually charged for
  // goods (post-discount). When active, it's checked against the pre-discount subtotal instead.
  const shippingBasis = isBugActive("BUG-017") ? subtotal : subtotal - discount;
  const shipping = subtotal > 0 && shippingBasis >= FREE_SHIPPING_THRESHOLD ? 0 : subtotal > 0 ? STANDARD_SHIPPING : 0;

  const total = Math.max(0, subtotal - discount + shipping);

  return { lines, subtotal, discountPercent: appliedCouponPercent, discount, shipping, total };
}

export interface CouponCheckResult {
  ok: boolean;
  percentOff?: number;
  error?: string;
}

export function checkCoupon(code: string, subtotal: number): CouponCheckResult {
  const coupon = findCoupon(code);
  if (!coupon) return { ok: false, error: "That coupon code doesn't exist." };

  // BUG-015: expiry should always be checked — skipped when active.
  const expired = new Date(coupon.expiresAt).getTime() < Date.now();
  if (expired && !isBugActive("BUG-015")) {
    return { ok: false, error: "This coupon has expired." };
  }
  if (coupon.minSubtotal && subtotal < coupon.minSubtotal) {
    return { ok: false, error: `This coupon requires a subtotal of at least $${coupon.minSubtotal}.` };
  }
  return { ok: true, percentOff: coupon.percentOff };
}

/** BUG-016: applying a coupon should replace any existing discount, not stack on top of it. */
export function applyCouponPercent(currentPercent: number, newPercent: number): number {
  return isBugActive("BUG-016") ? currentPercent + newPercent : newPercent;
}

/** BUG-007: rating should round to 1 decimal place — when active, it truncates instead. */
export function formatRating(rating: number): string {
  return isBugActive("BUG-007") ? Math.floor(rating).toFixed(1) : rating.toFixed(1);
}
