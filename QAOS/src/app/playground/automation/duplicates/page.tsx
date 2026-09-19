"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function DuplicatesPage() {
  const [lastClicked, setLastClicked] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-2 font-semibold">Same id, different buttons</h2>
        <p className="mb-2 text-sm text-muted-foreground">
          All three buttons below share <code className="rounded bg-muted px-1">id=&quot;submit-btn&quot;</code>{" "}
          (invalid HTML, but it happens in real apps).{" "}
          <code className="rounded bg-muted px-1">getElementById</code> only ever finds the first
          one — you&apos;ll need a more specific selector to reach the others.
        </p>
        <div className="flex gap-2">
          <Button id="submit-btn" data-testid="dup-id-a" onClick={() => setLastClicked("Submit A")}>
            Submit A
          </Button>
          <Button id="submit-btn" data-testid="dup-id-b" onClick={() => setLastClicked("Submit B")}>
            Submit B
          </Button>
          <Button id="submit-btn" data-testid="dup-id-c" onClick={() => setLastClicked("Submit C")}>
            Submit C
          </Button>
        </div>
      </section>

      <section>
        <h2 className="mb-2 font-semibold">Same visible text, different buttons</h2>
        <p className="mb-2 text-sm text-muted-foreground">
          These three buttons all say &quot;Click Me&quot;. A text-based locator will match all
          three — use <code className="rounded bg-muted px-1">.nth()</code> or the distinct{" "}
          <code className="rounded bg-muted px-1">data-testid</code> instead.
        </p>
        <div className="flex gap-2">
          <Button variant="outline" data-testid="dup-text-1" onClick={() => setLastClicked("Click Me (1)")}>
            Click Me
          </Button>
          <Button variant="outline" data-testid="dup-text-2" onClick={() => setLastClicked("Click Me (2)")}>
            Click Me
          </Button>
          <Button variant="outline" data-testid="dup-text-3" onClick={() => setLastClicked("Click Me (3)")}>
            Click Me
          </Button>
        </div>
      </section>

      <div className="rounded-lg border border-border bg-card p-4">
        <p className="text-sm font-medium">Last clicked:</p>
        <p data-testid="duplicates-result" className="mt-1 text-sm text-muted-foreground">
          {lastClicked ?? "Nothing clicked yet."}
        </p>
      </div>
    </div>
  );
}
