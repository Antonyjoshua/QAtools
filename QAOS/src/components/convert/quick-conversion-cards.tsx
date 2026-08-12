import Link from "next/link";
import { ArrowRight, Lock } from "lucide-react";
import { getFormat } from "@/lib/convert/core/format-registry";
import { getConversionAvailability } from "@/lib/convert/core/engine";
import { cn } from "@/lib/utils";

const QUICK_CONVERSIONS: { from: string; to: string }[] = [
  { from: "xlsx", to: "pdf" },
  { from: "docx", to: "pdf" },
  { from: "pdf", to: "docx" },
  { from: "pdf", to: "xlsx" },
  { from: "pptx", to: "pdf" },
  { from: "jpg", to: "png" },
  { from: "png", to: "jpg" },
  { from: "csv", to: "xlsx" },
  { from: "json", to: "csv" },
];

export function QuickConversionCards() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {QUICK_CONVERSIONS.map(({ from, to }) => {
        const fromFmt = getFormat(from);
        const toFmt = getFormat(to);
        if (!fromFmt || !toFmt) return null;
        const { supported, requiresBackend } = getConversionAvailability(from, to);
        const content = (
          <div
            className={cn(
              "flex items-center gap-2 rounded-xl border border-border bg-card p-3 transition-colors",
              supported && "hover:border-primary/40",
              !supported && "opacity-60"
            )}
          >
            <span className="text-sm font-semibold uppercase">{fromFmt.id}</span>
            <ArrowRight className="size-3.5 shrink-0 text-muted-foreground" />
            <span className="text-sm font-semibold uppercase">{toFmt.id}</span>
            {requiresBackend && <Lock className="ml-auto size-3 shrink-0 text-muted-foreground" />}
          </div>
        );
        return supported ? (
          <Link key={`${from}-${to}`} href={`/convert?from=${from}&to=${to}`}>
            {content}
          </Link>
        ) : (
          <div key={`${from}-${to}`} title="Coming soon — requires server-side processing">
            {content}
          </div>
        );
      })}
    </div>
  );
}
