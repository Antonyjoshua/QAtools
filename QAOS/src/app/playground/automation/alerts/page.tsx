"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export default function AlertsPage() {
  const [result, setResult] = useState<string>("No dialog triggered yet.");

  function handleAlert() {
    window.alert("This is a simple alert.");
    setResult("You dismissed the alert.");
  }

  function handleConfirm() {
    const ok = window.confirm("Do you confirm this action?");
    setResult(ok ? "You clicked: OK" : "You clicked: Cancel");
  }

  function handlePrompt() {
    const value = window.prompt("Enter your name:");
    setResult(value === null ? "You cancelled the prompt." : `You entered: ${value}`);
  }

  function handleDelayedAlert() {
    setResult("Waiting 3 seconds for the alert to appear…");
    setTimeout(() => {
      window.alert("This alert was delayed by 3 seconds.");
      setResult("You dismissed the delayed alert.");
    }, 3000);
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Each button triggers a native browser dialog. Handle it with your automation tool (e.g.
        Playwright&apos;s <code className="rounded bg-muted px-1">page.on(&quot;dialog&quot;, ...)</code>),
        then assert on the result text below.
      </p>
      <div className="flex flex-wrap gap-2">
        <Button data-testid="trigger-alert" onClick={handleAlert}>
          Trigger Alert
        </Button>
        <Button data-testid="trigger-confirm" onClick={handleConfirm}>
          Trigger Confirm
        </Button>
        <Button data-testid="trigger-prompt" onClick={handlePrompt}>
          Trigger Prompt
        </Button>
        <Button data-testid="trigger-delayed-alert" variant="outline" onClick={handleDelayedAlert}>
          Trigger Delayed Alert (3s)
        </Button>
      </div>
      <div className="rounded-lg border border-border bg-card p-4">
        <p className="text-sm font-medium">Result:</p>
        <p data-testid="alert-result" className="mt-1 text-sm text-muted-foreground">
          {result}
        </p>
      </div>
    </div>
  );
}
