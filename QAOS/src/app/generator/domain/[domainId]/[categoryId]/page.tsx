import { notFound } from "next/navigation";
import { ALL_DOMAIN_CATEGORIES, getDomainCategory } from "@/lib/generator/domains/registry";
import { DomainGeneratorRunner } from "@/components/generator/domains/domain-generator-runner";

export function generateStaticParams() {
  return ALL_DOMAIN_CATEGORIES.map((c) => ({ domainId: c.domainId, categoryId: c.id }));
}

export default async function DomainCategoryPage({ params }: { params: Promise<{ domainId: string; categoryId: string }> }) {
  const { domainId, categoryId } = await params;
  const category = getDomainCategory(domainId, categoryId);
  if (!category) notFound();

  return <DomainGeneratorRunner category={category} />;
}
