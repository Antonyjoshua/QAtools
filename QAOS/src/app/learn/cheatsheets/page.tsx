import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import { CHEAT_SHEETS } from "@/lib/learn/content/registry";

export default function CheatSheetsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/learn" className="mb-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-3.5" />
        Learn
      </Link>
      <h1 className="text-2xl font-semibold tracking-tight">Cheat Sheets</h1>
      <p className="mt-1 text-muted-foreground">Quick-reference sheets you can view, print, or download as a PDF.</p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CHEAT_SHEETS.map((sheet) => (
          <Link
            key={sheet.id}
            href={`/learn/cheatsheets/${sheet.id}`}
            className="group flex flex-col gap-2 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40"
          >
            <FileText className="size-5 text-primary" />
            <p className="font-medium group-hover:text-primary">{sheet.title}</p>
            <p className="text-xs text-muted-foreground">{sheet.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
