import { RequirementCard } from "@/components/playground/testcase-lab/requirement-card";
import { REQUIREMENTS } from "@/lib/playground/testcase-lab/requirements-seed";

export default function TestCaseLabPage() {
  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <div>
        <h1 className="text-2xl font-bold">📝 Test Case Lab</h1>
        <p className="text-sm text-muted-foreground">
          Pick a requirement and write test cases that cover it — positive, negative, boundary,
          security, and usability.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {REQUIREMENTS.map((r) => (
          <RequirementCard key={r.id} requirement={r} />
        ))}
      </div>
    </div>
  );
}
