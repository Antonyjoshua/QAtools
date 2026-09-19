"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { AUTOMATION_MODULES } from "@/lib/playground/automation/modules";

export function AutomationSubnav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-1.5 border-b border-border pb-4">
      <Link
        href="/playground/automation"
        className={cn(
          "rounded-md px-2.5 py-1.5 text-sm font-medium",
          pathname === "/playground/automation"
            ? "bg-muted text-foreground"
            : "text-muted-foreground hover:bg-muted/60"
        )}
      >
        Overview
      </Link>
      {AUTOMATION_MODULES.map((m) => (
        <Link
          key={m.id}
          href={m.href}
          className={cn(
            "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium",
            pathname === m.href
              ? "bg-muted text-foreground"
              : "text-muted-foreground hover:bg-muted/60"
          )}
        >
          <m.icon className="size-3.5" />
          {m.title}
        </Link>
      ))}
    </nav>
  );
}
