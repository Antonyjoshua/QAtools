import { getDomainCategories } from "@/lib/generator/domains/registry";
import { DomainCategoryCard } from "@/components/generator/domains/domain-category-card";

export function DomainCategoryView({ domainId, accent }: { domainId: string; accent: string }) {
  const categories = getDomainCategories(domainId);

  if (categories.length === 0) {
    return <p className="text-sm text-muted-foreground">No data categories configured for this domain yet.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {categories.map((c) => (
        <DomainCategoryCard key={c.id} category={c} accent={accent} />
      ))}
    </div>
  );
}
