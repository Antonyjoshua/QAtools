"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { checkCoupon } from "@/lib/playground/shop/pricing";

interface Props {
  subtotal: number;
  appliedCode: string | null;
  onApply: (code: string, percentOff: number) => void;
}

export function CouponField({ subtotal, appliedCode, onApply }: Props) {
  const [code, setCode] = useState("");

  function handleApply() {
    if (!code.trim()) return;
    const result = checkCoupon(code, subtotal);
    if (!result.ok) {
      toast.error(result.error ?? "Invalid coupon.");
      return;
    }
    onApply(code.trim().toUpperCase(), result.percentOff ?? 0);
    toast.success(`Coupon applied: ${result.percentOff}% off.`);
  }

  return (
    <div className="flex items-center gap-2">
      <Input placeholder="Coupon code" value={code} onChange={(e) => setCode(e.target.value)} />
      <Button variant="outline" onClick={handleApply}>
        Apply
      </Button>
      {appliedCode && (
        <span className="text-xs text-muted-foreground">Applied: {appliedCode}</span>
      )}
    </div>
  );
}
