import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { DummyFileGeneratorClient } from "@/components/generator/tools/dummy-file-generator-client";

export default function DummyFileGeneratorPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <Link href="/generator/category/files" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-3.5" />
        Back to Files
      </Link>
      <h1 className="text-2xl font-semibold tracking-tight">Dummy File Generator</h1>
      <p className="mt-1 mb-8 max-w-2xl text-muted-foreground">
        Generate a real, downloadable file at an exact size and format — for testing upload size
        limits, format validation, and large-file handling.
      </p>
      <DummyFileGeneratorClient />
    </div>
  );
}
