import Link from "next/link";
import { Sparkles, History as HistoryIcon, Grid3x3 } from "lucide-react";
import { ConversionHub } from "@/components/convert/conversion-hub";
import { ConversionSearch } from "@/components/convert/conversion-search";
import { FavoritePairsStrip } from "@/components/convert/favorite-pairs-strip";
import { QuickConversionCards } from "@/components/convert/quick-conversion-cards";
import { HistoryList } from "@/components/convert/history-list";
import { FormatMatrix } from "@/components/convert/format-matrix";
import { PrivacyToggle } from "@/components/convert/privacy-toggle";
import { getConversionAvailability } from "@/lib/convert/core/engine";
import { MAX_FILE_SIZE_MB } from "@/lib/convert/services/file-validation";

export default async function ConvertPage({ searchParams }: { searchParams: Promise<{ from?: string; to?: string }> }) {
  const params = await searchParams;
  const initialFormatPair = params.from && params.to && getConversionAvailability(params.from, params.to).supported ? { from: params.from, to: params.to } : undefined;

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
          <Sparkles className="size-3.5" />
          File Converter
        </div>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">Convert any file, right in your browser.</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Documents, spreadsheets, PDFs, images, and data files — upload, pick a format, and download. Nothing ever leaves your device.
          Max file size: {MAX_FILE_SIZE_MB}MB.
        </p>
      </div>

      <div className="mb-6">
        <ConversionSearch />
      </div>

      <div className="mb-8 rounded-2xl border border-border bg-card/50 p-6">
        <ConversionHub initialFormatPair={initialFormatPair} />
      </div>

      <div className="mb-8">
        <FavoritePairsStrip />
      </div>

      <section className="mb-10">
        <h2 className="mb-3 text-sm font-semibold text-muted-foreground">Popular Conversions</h2>
        <QuickConversionCards />
      </section>

      <section className="mb-10">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground">
            <HistoryIcon className="size-3.5" />
            Recent Conversions
          </h2>
          <Link href="/convert/history" className="text-xs text-primary hover:underline">
            View all
          </Link>
        </div>
        <HistoryList limit={5} />
      </section>

      <section className="mb-10">
        <PrivacyToggle />
      </section>

      <section>
        <h2 className="mb-3 flex items-center gap-1.5 text-sm font-semibold text-muted-foreground">
          <Grid3x3 className="size-3.5" />
          Supported Formats
        </h2>
        <FormatMatrix />
      </section>
    </div>
  );
}
