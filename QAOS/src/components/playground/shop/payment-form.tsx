"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function PaymentForm() {
  const [cardNumber, setCardNumber] = useState("4242 4242 4242 4242");
  const [expiry, setExpiry] = useState("12/29");
  const [cvv, setCvv] = useState("123");

  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="col-span-2 space-y-1">
        <Label htmlFor="cardNumber">Card number</Label>
        <Input id="cardNumber" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} />
      </div>
      <div className="space-y-1">
        <Label htmlFor="expiry">Expiry</Label>
        <Input id="expiry" value={expiry} onChange={(e) => setExpiry(e.target.value)} />
      </div>
      <div className="space-y-1">
        <Label htmlFor="cvv">CVV</Label>
        <Input id="cvv" value={cvv} onChange={(e) => setCvv(e.target.value)} />
      </div>
      <p className="col-span-2 text-xs text-muted-foreground">
        This is a simulated payment step — no real card is charged.
      </p>
    </div>
  );
}
