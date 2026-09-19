import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { DOMAINS, getDomain } from "@/lib/generator/domains/domains";
import { CategoryIcon } from "@/components/icon";
import { DomainCategoryView } from "@/components/generator/domains/domain-category-view";

export function generateStaticParams() {
  return DOMAINS.map((d) => ({ domainId: d.id }));
}

export default async function DomainPage({ params }: { params: Promise<{ domainId: string }> }) {
  const { domainId } = await params;
  const domain = getDomain(domainId);
  if (!domain) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link href="/generator/domain" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-3.5" />
        Back to Domain-wise Generator
      </Link>

      <div className="mb-8 flex items-center gap-4">
        <div
          className="flex size-12 items-center justify-center rounded-xl"
          style={{ backgroundColor: `color-mix(in oklch, ${domain.accent} 16%, transparent)`, color: domain.accent }}
        >
          <CategoryIcon name={domain.icon} className="size-6" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{domain.name}</h1>
          <p className="text-muted-foreground">{domain.description}</p>
        </div>
      </div>

      <DomainCategoryView domainId={domain.id} accent={domain.accent} />
    </div>
  );
}
