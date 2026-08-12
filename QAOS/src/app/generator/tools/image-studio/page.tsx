import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ImageStudioClient } from "@/components/generator/tools/image-studio-client";

export default function ImageStudioPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <Link href="/generator/category/content" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-3.5" />
        Back to Content & Media
      </Link>
      <h1 className="text-2xl font-semibold tracking-tight">Placeholder Image Studio</h1>
      <p className="mt-1 mb-8 max-w-2xl text-muted-foreground">
        Generate downloadable placeholder images for profile photos, product shots, avatars, banners, and thumbnails — pick a preset or
        set a custom size.
      </p>
      <ImageStudioClient />
    </div>
  );
}
