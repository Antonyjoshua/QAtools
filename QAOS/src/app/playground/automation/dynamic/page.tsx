"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

function randomSuffix(): string {
  return Math.random().toString(36).slice(2, 8);
}

export default function DynamicElementsPage() {
  const [delayedVisible, setDelayedVisible] = useState(false);
  // Generated client-side only, after mount, so the server-rendered id and the client's first
  // render match (avoiding a hydration mismatch) — it still changes on every real page load.
  const [changingId, setChangingId] = useState<string | null>(null);
  const [hiddenRevealed, setHiddenRevealed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDelayedVisible(true), 5000);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only id, must differ from SSR render
    setChangingId(`btn-${randomSuffix()}`);
    return () => clearTimeout(timer);
  }, []);

  function handleLoadData() {
    setLoading(true);
    setLoaded(false);
    setTimeout(() => {
      setLoading(false);
      setLoaded(true);
    }, 2000);
  }

  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-2 font-semibold">1. Appears After a Delay</h2>
        <p className="mb-2 text-sm text-muted-foreground">
          This button doesn&apos;t exist for the first 5 seconds after the page loads.
        </p>
        {delayedVisible ? (
          <Button data-testid="delayed-button">I appeared after 5 seconds</Button>
        ) : (
          <p className="text-sm text-muted-foreground italic">Waiting…</p>
        )}
      </section>

      <section>
        <h2 className="mb-2 font-semibold">2. Changing ID on Every Load</h2>
        <p className="mb-2 text-sm text-muted-foreground">
          This button&apos;s <code className="rounded bg-muted px-1">id</code> is randomized on every
          page load — don&apos;t rely on it. Use the stable{" "}
          <code className="rounded bg-muted px-1">data-testid</code> or its text instead.
        </p>
        <Button id={changingId ?? undefined} data-testid="stable-locator-target">
          Stable text, unstable id
        </Button>
      </section>

      <section>
        <h2 className="mb-2 font-semibold">3. Toggle Visibility</h2>
        <p className="mb-2 text-sm text-muted-foreground">
          The target element doesn&apos;t exist in the DOM until you click this button.
        </p>
        <Button data-testid="reveal-toggle" onClick={() => setHiddenRevealed((v) => !v)}>
          {hiddenRevealed ? "Hide Element" : "Show Hidden Element"}
        </Button>
        {hiddenRevealed && (
          <p data-testid="revealed-element" className="mt-2 text-sm text-status-good">
            You found me!
          </p>
        )}
      </section>

      <section>
        <h2 className="mb-2 font-semibold">4. Loading Spinner Then Content</h2>
        <p className="mb-2 text-sm text-muted-foreground">
          Clicking Load Data shows a spinner for 2 seconds, then swaps in real content.
        </p>
        <Button data-testid="load-data" onClick={handleLoadData} disabled={loading}>
          Load Data
        </Button>
        <div className="mt-2">
          {loading && <p data-testid="loading-spinner" className="text-sm text-muted-foreground">Loading…</p>}
          {loaded && (
            <p data-testid="loaded-content" className="text-sm text-status-good">
              Data loaded successfully.
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
