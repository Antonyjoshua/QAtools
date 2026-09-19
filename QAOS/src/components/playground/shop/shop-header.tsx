"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingCart, Heart, Package, User as UserIcon, LogOut } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCurrentUser } from "@/lib/playground/shop/hooks/use-current-user";
import { useCart } from "@/lib/playground/shop/hooks/use-cart";
import { useSessionStore } from "@/lib/playground/shop/session-store";

function NavLink({
  href,
  label,
  icon,
  badge,
  active,
}: {
  href: string;
  label: string;
  icon: ReactNode;
  badge?: number;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm ${
        active ? "bg-muted font-medium" : "text-muted-foreground hover:bg-muted/60"
      }`}
    >
      {icon}
      {label}
      {typeof badge === "number" && badge > 0 && <Badge variant="secondary">{badge}</Badge>}
    </Link>
  );
}

export function ShopHeader() {
  const { user, isLoggedIn } = useCurrentUser();
  const { count } = useCart();
  const logout = useSessionStore((s) => s.logout);
  const router = useRouter();
  const pathname = usePathname();

  function handleLogout() {
    logout();
    toast.success("Logged out.");
    router.push("/playground/shop");
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border bg-card/40 px-4 py-3 md:px-6">
      <Link href="/playground/shop" className="flex items-center gap-2 text-lg font-bold">
        🧺 Brightbasket
      </Link>
      <nav className="flex flex-wrap items-center gap-1">
        <NavLink
          href="/playground/shop/products"
          label="Products"
          icon={<Package className="size-4" />}
          active={pathname.startsWith("/playground/shop/products")}
        />
        <NavLink
          href="/playground/shop/wishlist"
          label="Wishlist"
          icon={<Heart className="size-4" />}
          active={pathname === "/playground/shop/wishlist"}
        />
        <NavLink
          href="/playground/shop/cart"
          label="Cart"
          icon={<ShoppingCart className="size-4" />}
          badge={count}
          active={pathname === "/playground/shop/cart"}
        />
        <NavLink
          href="/playground/shop/orders"
          label="Orders"
          icon={<Package className="size-4" />}
          active={pathname.startsWith("/playground/shop/orders")}
        />
      </nav>
      <div className="flex items-center gap-2">
        {isLoggedIn ? (
          <>
            <Link
              href="/playground/shop/profile"
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
            >
              <UserIcon className="size-4" /> {user?.name}
            </Link>
            <Button size="sm" variant="outline" onClick={handleLogout}>
              <LogOut className="size-3.5" /> Log out
            </Button>
          </>
        ) : (
          <>
            <Button
              size="sm"
              variant="outline"
              nativeButton={false}
              render={<Link href="/playground/shop/login">Log in</Link>}
            />
            <Button
              size="sm"
              nativeButton={false}
              render={<Link href="/playground/shop/register">Register</Link>}
            />
          </>
        )}
      </div>
    </div>
  );
}
