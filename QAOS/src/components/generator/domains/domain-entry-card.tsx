import Link from "next/link";
import { ArrowRight, Globe } from "lucide-react";
import { DOMAINS } from "@/lib/generator/domains/domains";

export function DomainEntryCard() {
  return (
    <Link
      href="/generator/domain"
      className="group relative flex flex-col gap-3 overflow-hidden rounded-xl border border-primary/30 bg-gradient-to-br from-primary/10 to-transparent p-5 transition-all hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10 sm:flex-row sm:items-center sm:gap-5"
    >
      <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
        <Globe className="size-6" />
      </div>
      <div className="flex-1">
        <h3 className="font-medium tracking-tight">Domain-wise Test Data Generator</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Generate realistic test data based on specific application and business domains — {DOMAINS.length} domains including Banking &amp; Finance,
          Healthcare, and E-commerce.
        </p>
      </div>
      <ArrowRight className="size-4 shrink-0 -translate-x-1 text-primary opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
    </Link>
  );
}
