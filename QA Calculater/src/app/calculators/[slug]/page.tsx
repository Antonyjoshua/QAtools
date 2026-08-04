import { Suspense } from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { CALCULATORS, getCalculator } from "@/lib/calculators/registry";
import { CalculatorShell } from "@/components/calculators/calculator-shell";

export function generateStaticParams() {
  return CALCULATORS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const calculator = getCalculator(slug);
  if (!calculator) return {};
  return {
    title: `${calculator.name} — QA Calculator`,
    description: calculator.description,
  };
}

export default async function CalculatorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const calculator = getCalculator(slug);
  if (!calculator) notFound();

  return (
    <Suspense fallback={null}>
      <CalculatorShell slug={slug} />
    </Suspense>
  );
}
