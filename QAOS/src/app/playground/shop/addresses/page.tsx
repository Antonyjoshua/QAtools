"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AddressForm, type AddressFormValues } from "@/components/playground/shop/address-form";
import { useAddresses } from "@/lib/playground/shop/hooks/use-addresses";
import { useCurrentUser } from "@/lib/playground/shop/hooks/use-current-user";

export default function AddressesPage() {
  const { user, isLoggedIn } = useCurrentUser();
  const { addresses, addAddress, setDefault, deleteAddress } = useAddresses();

  if (!isLoggedIn || !user) {
    return <p className="text-sm text-muted-foreground">Please log in to manage addresses.</p>;
  }

  const currentUser = user;

  async function handleAdd(values: AddressFormValues) {
    await addAddress({ userId: currentUser.id, ...values });
    toast.success("Address added.");
  }

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <h1 className="text-xl font-bold">Addresses</h1>
      <div className="space-y-2">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className="flex items-center justify-between rounded-lg border border-border bg-card p-3 text-sm"
          >
            <div>
              <div>
                {addr.fullName} {addr.isDefault && <span className="text-xs text-primary">(Default)</span>}
              </div>
              <div className="text-muted-foreground">
                {addr.line1}, {addr.city}, {addr.state} {addr.postalCode}
              </div>
            </div>
            <div className="flex gap-2">
              {!addr.isDefault && (
                <Button size="sm" variant="outline" onClick={() => setDefault(addr.id)}>
                  Set default
                </Button>
              )}
              <Button size="sm" variant="ghost" onClick={() => deleteAddress(addr.id)}>
                Delete
              </Button>
            </div>
          </div>
        ))}
        {addresses.length === 0 && (
          <p className="text-sm text-muted-foreground">No saved addresses yet.</p>
        )}
      </div>
      <div className="rounded-lg border border-border bg-card p-4">
        <h2 className="mb-3 font-semibold">Add New Address</h2>
        <AddressForm onSubmit={handleAdd} />
      </div>
    </div>
  );
}
