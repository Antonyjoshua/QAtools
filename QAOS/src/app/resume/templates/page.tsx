import { TemplateGallery } from "@/components/resume/gallery/template-gallery";

export default function ResumeTemplatesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Template Gallery</h1>
        <p className="mt-1 text-sm text-muted-foreground">20 ATS-friendly, professionally designed templates. Pick one to start writing.</p>
      </div>
      <TemplateGallery />
    </div>
  );
}
