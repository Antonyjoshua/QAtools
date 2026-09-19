"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function FrameInnerPage() {
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState<string | null>(null);

  return (
    <div className="min-h-screen space-y-3 bg-background p-4">
      <h2 data-testid="frame-inner-heading" className="text-lg font-semibold">
        Inside the Frame
      </h2>
      <Input
        data-testid="frame-input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type something…"
      />
      <Button data-testid="frame-submit" onClick={() => setSubmitted(text)}>
        Submit
      </Button>
      {submitted !== null && (
        <p data-testid="frame-result" className="text-sm text-muted-foreground">
          You typed: {submitted}
        </p>
      )}
    </div>
  );
}
