"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const BATCH_SIZE = 20;
const MAX_ITEMS = 200;

export default function InfiniteScrollPage() {
  const [count, setCount] = useState(BATCH_SIZE);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const loadMore = useCallback(() => {
    setCount((c) => Math.min(MAX_ITEMS, c + BATCH_SIZE));
  }, []);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: "200px" }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        Scroll down inside the list below — more rows load automatically as you approach the
        bottom, up to {MAX_ITEMS} items total.
      </p>
      <div className="h-96 overflow-y-auto rounded-lg border border-border">
        {Array.from({ length: count }, (_, i) => i + 1).map((n) => (
          <div
            key={n}
            data-testid={`scroll-item-${n}`}
            className="border-b border-border p-3 text-sm last:border-0"
          >
            Item #{n}
          </div>
        ))}
        {count < MAX_ITEMS && (
          <div ref={sentinelRef} data-testid="scroll-sentinel" className="p-3 text-center text-xs text-muted-foreground">
            Loading more…
          </div>
        )}
      </div>
      <p data-testid="scroll-count" className="text-xs text-muted-foreground">
        {count} of {MAX_ITEMS} items loaded
      </p>
    </div>
  );
}
