import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getCategory, CATEGORIES } from "@/lib/generator/categories";
import { CategoryIcon } from "@/components/icon";
import { CategoryView } from "@/components/generator/category-view";

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ id: c.id }));
}

export default async function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const category = getCategory(id);
  if (!category) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link href="/generator" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-3.5" />
        Back to dashboard
      </Link>

      <div className="mb-8 flex items-center gap-4">
        <div
          className="flex size-12 items-center justify-center rounded-xl"
          style={{ backgroundColor: `color-mix(in oklch, ${category.accent} 16%, transparent)`, color: category.accent }}
        >
          <CategoryIcon name={category.icon} className="size-6" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{category.name}</h1>
          <p className="text-muted-foreground">{category.description}</p>
        </div>
      </div>

      <CategoryView categoryId={category.id} />
    </div>
  );
}
