import { TemplateGallery } from "@/components/portfolio/gallery/template-gallery";

export default function NewPortfolioPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Choose a Portfolio Template</h1>
        <p className="mt-1 text-sm text-muted-foreground">4 distinct designs, all backed by the same editable content — pick a look and start filling it in.</p>
      </div>
      <TemplateGallery />
    </div>
  );
}
