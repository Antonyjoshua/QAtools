import type { Coupon } from "./types";

export const COUPONS: Coupon[] = [
  { code: "WELCOME10", percentOff: 10, expiresAt: "2099-12-31" },
  { code: "SAVE20", percentOff: 20, expiresAt: "2099-12-31", minSubtotal: 100 },
  // Deliberately expired — the answer key for BUG-015 (expired coupons should be rejected).
  { code: "EXPIRED5", percentOff: 5, expiresAt: "2020-01-01" },
];

export function findCoupon(code: string): Coupon | undefined {
  return COUPONS.find((c) => c.code.toLowerCase() === code.trim().toLowerCase());
}
