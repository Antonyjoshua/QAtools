"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function TableOfContents({ items }: { items: { id: string; label: string }[] }) {
  const [activeId, setActiveId] = React.useState<string | null>(items[0]?.id ?? null);

  React.useEffect(() => {
    const elements = items.map((i) => document.getElementById(i.id)).filter((el): el is HTMLElement => Boolean(el));
    if (elements.length === 0) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-15% 0px -70% 0px" }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav className="sticky top-20 flex flex-col gap-0.5 text-sm">
      <p className="mb-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">On this page</p>
      {items.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className={cn(
            "rounded-md px-2 py-1 text-xs transition-colors",
            activeId === item.id ? "bg-primary/10 font-medium text-primary" : "text-muted-foreground hover:text-foreground"
          )}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}
