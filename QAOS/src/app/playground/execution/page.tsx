"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { REQUIREMENTS } from "@/lib/playground/testcase-lab/requirements-seed";
import { useAllTestCases } from "@/lib/playground/testcase-lab/hooks/use-test-cases";

export default function ExecutionHomePage() {
  const allCases = useAllTestCases();
  const counts = new Map<string, number>();
  for (const tc of allCases) counts.set(tc.requirementId, (counts.get(tc.requirementId) ?? 0) + 1);

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <div>
        <h1 className="text-2xl font-bold">▶️ Test Execution</h1>
        <p className="text-sm text-muted-foreground">
          Execute the test cases you wrote in the Test Case Lab against the live Brightbasket app.
        </p>
      </div>
      <div className="space-y-2">
        {REQUIREMENTS.map((r) => {
          const count = counts.get(r.id) ?? 0;
          return (
            <div
              key={r.id}
              className="flex items-center justify-between rounded-lg border border-border bg-card p-3"
            >
              <div>
                <p className="font-medium">{r.title}</p>
                <p className="text-xs text-muted-foreground">
                  {count} test case{count === 1 ? "" : "s"} written
                </p>
              </div>
              {count > 0 ? (
                <Button
                  nativeButton={false}
                  render={<Link href={`/playground/execution/requirements/${r.id}`}>Execute</Link>}
                />
              ) : (
                <Button disabled>Execute</Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
