"use client";

import { useEffect, type ReactNode } from "react";
import { seedTestAccountsIfNeeded } from "@/lib/playground/shop/auth-repo";
import { ShopHeader } from "@/components/playground/shop/shop-header";

export default function ShopLayout({ children }: { children: ReactNode }) {
  useEffect(() => {
    void seedTestAccountsIfNeeded();
  }, []);

  return (
    <div className="flex min-h-full flex-col">
      <ShopHeader />
      <div className="flex-1">{children}</div>
    </div>
  );
}
