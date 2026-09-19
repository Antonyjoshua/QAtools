import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { DomainList } from "@/components/generator/domains/domain-list";

export default function DomainGeneratorPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link href="/generator" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-3.5" />
        Back to Test Data Generator
      </Link>

      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Domain-wise Test Data Generator</h1>
        <p className="mt-1 max-w-2xl text-muted-foreground">
          Generate realistic test data based on specific application and business domains — pick a domain, then a data category.
        </p>
      </div>

      <DomainList />
    </div>
  );
}
