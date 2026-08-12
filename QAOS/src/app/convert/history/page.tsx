import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { HistoryList } from "@/components/convert/history-list";

export default function ConversionHistoryPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <Link href="/convert" className="mb-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-3.5" />
        File Converter
      </Link>
      <h1 className="text-2xl font-semibold tracking-tight">Conversion History</h1>
      <p className="mt-1 text-muted-foreground">Conversions expire and are automatically cleared 24 hours after they run.</p>
      <div className="mt-6">
        <HistoryList />
      </div>
    </div>
  );
}
