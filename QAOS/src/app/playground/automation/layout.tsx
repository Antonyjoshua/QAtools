import type { ReactNode } from "react";
import { AutomationSubnav } from "@/components/playground/automation/automation-subnav";

export default function AutomationLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <div>
        <h1 className="text-2xl font-bold">🎯 Automation Playground</h1>
        <p className="text-sm text-muted-foreground">
          Real, live interactive elements for your own Playwright, Selenium, or Cypress scripts to
          target — nothing runs inside this app. Point your automation at{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">localhost:3000/playground/automation/...</code>.
        </p>
      </div>
      <AutomationSubnav />
      <div>{children}</div>
    </div>
  );
}
