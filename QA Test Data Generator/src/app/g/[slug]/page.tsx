import { notFound } from "next/navigation";
import { ALL_GENERATORS, getGeneratorBySlug } from "@/lib/generators/registry";
import { GeneratorRunner } from "@/components/generator-runner";

export function generateStaticParams() {
  return ALL_GENERATORS.map((g) => ({ slug: g.slug }));
}

export default async function GeneratorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!getGeneratorBySlug(slug)) notFound();
  return <GeneratorRunner slug={slug} />;
}
