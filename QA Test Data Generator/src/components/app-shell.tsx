"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Star,
  History as HistoryIcon,
  LayoutTemplate,
  Sparkles,
  QrCode,
  Image as ImageIcon,
  Menu,
  X,
} from "lucide-react";
import { CATEGORIES } from "@/lib/generators/categories";
import { CategoryIcon } from "@/components/icon";
import { ThemeToggle } from "@/components/theme-toggle";
import { GlobalSearch } from "@/components/global-search";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const primaryNav = [
  { href: "/", label: "Dashboard", icon: LayoutGrid },
  { href: "/favorites", label: "Favorites", icon: Star },
  { href: "/history", label: "History", icon: HistoryIcon },
  { href: "/templates", label: "Templates", icon: LayoutTemplate },
];

const toolsNav = [
  { href: "/tools/image-studio", label: "Image Studio", icon: ImageIcon },
  { href: "/tools/qr-barcode-studio", label: "QR / Barcode Studio", icon: QrCode },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <div className="flex h-full flex-col">
      <Link href="/" className="flex items-center gap-2 px-4 py-4" onClick={onNavigate}>
        <div className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Sparkles className="size-4" />
        </div>
        <span className="font-semibold tracking-tight">TestDataHub</span>
      </Link>
      <div className="flex-1 overflow-y-auto scrollbar-thin px-2 pb-4">
        <nav className="flex flex-col gap-0.5">
          {primaryNav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition-colors",
                  active ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                )}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-5 px-2.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Categories</div>
        <nav className="mt-1 flex flex-col gap-0.5">
          {CATEGORIES.map((c) => {
            const href = `/category/${c.id}`;
            const active = pathname === href;
            return (
              <Link
                key={c.id}
                href={href}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition-colors",
                  active ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                )}
              >
                <CategoryIcon name={c.icon} className="size-4" />
                <span className="truncate">{c.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-5 px-2.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Studio Tools</div>
        <nav className="mt-1 flex flex-col gap-0.5">
          {toolsNav.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition-colors",
                  active ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                )}
              >
                <item.icon className="size-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen w-full">
      <aside className="hidden w-60 shrink-0 border-r border-border bg-sidebar md:block">
        <div className="sticky top-0 h-screen">
          <SidebarContent />
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-64 bg-sidebar border-r border-border">
            <div className="flex justify-end p-2">
              <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)}>
                <X className="size-4" />
              </Button>
            </div>
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur supports-backdrop-filter:bg-background/60">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(true)}>
            <Menu className="size-4" />
          </Button>
          <div className="flex-1">
            <GlobalSearch />
          </div>
          <ThemeToggle />
        </header>
        <main className="flex-1 bg-grid">{children}</main>
      </div>
    </div>
  );
}
