"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../db";
import { useSessionStore } from "../session-store";
import * as addressesRepo from "../addresses-repo";
import { isBugActive } from "@/lib/playground/bug-registry/toggle-store";

export function useAddresses() {
  const userId = useSessionStore((s) => s.currentUserId);
  const addresses =
    useLiveQuery(
      () => (userId ? db.addresses.where("userId").equals(userId).toArray() : []),
      [userId]
    ) ?? [];

  async function setDefault(addressId: string) {
    if (!userId) return;
    // BUG-021: "Set as default" should work — it's a no-op when active.
    if (isBugActive("BUG-021")) return;
    await addressesRepo.setDefaultAddress(userId, addressId);
  }

  return {
    addresses,
    defaultAddress: addresses.find((a) => a.isDefault) ?? addresses[0],
    setDefault,
    addAddress: addressesRepo.addAddress,
    deleteAddress: addressesRepo.deleteAddress,
  };
}
