"use client";

import Link from "next/link";
import { Calculator, History as HistoryIcon, Star } from "lucide-react";
import { CommandSearch } from "@/components/command-search";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

export function AppTopbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60">
      <div className="glass-panel mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            <Calculator className="size-4.5" />
          </span>
          <span className="hidden text-base sm:inline">
            QA <span className="gradient-text">Calculator</span>
          </span>
        </Link>

        <div className="flex flex-1 justify-center">
          <CommandSearch />
        </div>

        <nav className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            nativeButton={false}
            render={
              <Link href="/history" aria-label="History">
                <HistoryIcon className="size-4" />
              </Link>
            }
          />
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            nativeButton={false}
            render={
              <Link href="/history?filter=favorites" aria-label="Favorites">
                <Star className="size-4" />
              </Link>
            }
          />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
