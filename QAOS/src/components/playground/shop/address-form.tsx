"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { isBugActive } from "@/lib/playground/bug-registry/toggle-store";

export interface AddressFormValues {
  fullName: string;
  line1: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

const EMPTY: AddressFormValues = {
  fullName: "",
  line1: "",
  city: "",
  state: "",
  postalCode: "",
  country: "",
};

export function AddressForm({
  onSubmit,
  submitLabel = "Save Address",
}: {
  onSubmit: (values: AddressFormValues) => void;
  submitLabel?: string;
}) {
  const [values, setValues] = useState<AddressFormValues>(EMPTY);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof AddressFormValues>(key: K, value: string) {
    setValues((v) => ({ ...v, [key]: value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    // BUG-018: required-field validation is skipped entirely when active.
    if (!isBugActive("BUG-018")) {
      const allFilled = Object.values(values).every((v) => v.trim().length > 0);
      if (!allFilled) {
        setError("All address fields are required.");
        return;
      }
    }

    // BUG-020: postal code format isn't validated when active.
    if (
      !isBugActive("BUG-020") &&
      values.postalCode.trim() &&
      !/^[0-9]{4,10}$/.test(values.postalCode.trim())
    ) {
      setError("Postal code must be 4-10 digits.");
      return;
    }

    onSubmit(values);
    setValues(EMPTY);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div className="col-span-2 space-y-1">
          <Label htmlFor="fullName">Full name</Label>
          <Input id="fullName" value={values.fullName} onChange={(e) => update("fullName", e.target.value)} />
        </div>
        <div className="col-span-2 space-y-1">
          <Label htmlFor="line1">Address line</Label>
          <Input id="line1" value={values.line1} onChange={(e) => update("line1", e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="city">City</Label>
          <Input id="city" value={values.city} onChange={(e) => update("city", e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="state">State</Label>
          <Input id="state" value={values.state} onChange={(e) => update("state", e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label htmlFor="postalCode">Postal code</Label>
          <Input
            id="postalCode"
            value={values.postalCode}
            onChange={(e) => update("postalCode", e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="country">Country</Label>
          <Input id="country" value={values.country} onChange={(e) => update("country", e.target.value)} />
        </div>
      </div>
      {error && <p className="text-sm text-status-critical">{error}</p>}
      <Button type="submit">{submitLabel}</Button>
    </form>
  );
}
