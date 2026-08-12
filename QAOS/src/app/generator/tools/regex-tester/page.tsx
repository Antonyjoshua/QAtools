import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { RegexTesterClient } from "@/components/generator/tools/regex-tester-client";

export default function RegexTesterPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <Link href="/generator/category/devutils" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-3.5" />
        Back to Developer Utilities
      </Link>
      <h1 className="text-2xl font-semibold tracking-tight">Regex Tester / Builder</h1>
      <p className="mt-1 mb-8 max-w-2xl text-muted-foreground">
        Test a pattern against real text with live match highlighting, capture groups, and a replace preview — no
        need to leave the app to check a regex.
      </p>
      <RegexTesterClient />
    </div>
  );
}
