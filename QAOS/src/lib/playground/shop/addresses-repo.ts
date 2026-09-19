import { db } from "./db";
import { uid } from "@/lib/playground/id";
import type { Address } from "./types";

export type NewAddressInput = Omit<Address, "id" | "createdAt" | "isDefault">;

export async function addAddress(input: NewAddressInput): Promise<Address> {
  const existingCount = await db.addresses.where("userId").equals(input.userId).count();
  const address: Address = {
    id: uid(),
    createdAt: new Date().toISOString(),
    isDefault: existingCount === 0,
    ...input,
  };
  await db.addresses.add(address);
  return address;
}

export async function setDefaultAddress(userId: string, addressId: string): Promise<void> {
  const addresses = await db.addresses.where("userId").equals(userId).toArray();
  await db.transaction("rw", db.addresses, async () => {
    for (const addr of addresses) {
      await db.addresses.update(addr.id, { isDefault: addr.id === addressId });
    }
  });
}

export async function deleteAddress(addressId: string): Promise<void> {
  await db.addresses.delete(addressId);
}
