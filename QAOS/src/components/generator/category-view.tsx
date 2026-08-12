"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { getGeneratorsByCategory } from "@/lib/generator/registry";
import { CUSTOM_TOOLS } from "@/lib/generator/custom-tools";
import type { CategoryId } from "@/lib/generator/types";
import { CategoryIcon } from "@/components/icon";
import { GeneratorCard } from "@/components/generator/generator-card";

export function CategoryView({ categoryId }: { categoryId: CategoryId }) {
  const generators = getGeneratorsByCategory(categoryId);
  const tools = CUSTOM_TOOLS.filter((t) => t.category === categoryId);

  return (
    <>
      {tools.length > 0 && (
        <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {tools.map((tool) => (
            <Link
              key={tool.slug}
              href={tool.href}
              className="flex items-center justify-between gap-3 rounded-xl border border-primary/30 bg-primary/5 p-4 transition-colors hover:bg-primary/10"
            >
              <div>
                <div className="flex items-center gap-2 font-medium">
                  <CategoryIcon name={tool.icon} className="size-4 text-primary" />
                  {tool.name}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{tool.description}</p>
              </div>
              <ArrowUpRight className="size-4 shrink-0 text-primary" />
            </Link>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {generators.map((g) => (
          <GeneratorCard key={g.slug} generator={g} />
        ))}
      </div>
    </>
  );
}
