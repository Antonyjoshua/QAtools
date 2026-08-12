"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen } from "lucide-react";
import { BOOKS, BOOK_CATEGORIES } from "@/lib/learn/content/registry";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Book } from "@/lib/learn/content/types";

export function BooksLibrary() {
  const [category, setCategory] = React.useState<string>("All");
  const [selected, setSelected] = React.useState<Book | null>(null);

  const filtered = category === "All" ? BOOKS : BOOKS.filter((b) => b.category === category);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/learn" className="mb-4 inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-3.5" />
        Learn
      </Link>
      <h1 className="text-2xl font-semibold tracking-tight">Books Library</h1>
      <p className="mt-1 text-muted-foreground">Curated reading, organized by category — summaries and key takeaways, not hosted copies.</p>

      <div className="mt-5 flex flex-wrap gap-1.5">
        {["All", ...BOOK_CATEGORIES].map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              category === c ? "border-primary/50 bg-primary/10 text-primary" : "border-border text-muted-foreground hover:bg-accent/50"
            )}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {filtered.map((book) => (
          <button key={book.id} type="button" onClick={() => setSelected(book)} className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card text-left transition-colors hover:border-primary/40">
            <div className="flex h-28 items-center justify-center p-4" style={{ background: `linear-gradient(135deg, ${book.accentColor}33, ${book.accentColor}11)` }}>
              <BookOpen className="size-8" style={{ color: book.accentColor }} />
            </div>
            <div className="flex flex-1 flex-col gap-1 p-3">
              <p className="text-sm font-medium group-hover:text-primary">{book.title}</p>
              <p className="text-xs text-muted-foreground">{book.author}</p>
              <Badge variant="secondary" className="mt-auto w-fit text-[10px]">
                {book.difficulty}
              </Badge>
            </div>
          </button>
        ))}
      </div>

      <Dialog open={selected !== null} onOpenChange={(open) => !open && setSelected(null)}>
        <DialogContent className="max-w-lg">
          {selected && (
            <>
              <DialogHeader>
                <DialogTitle>{selected.title}</DialogTitle>
              </DialogHeader>
              <div className="flex flex-col gap-3 text-sm">
                <p className="text-muted-foreground">
                  {selected.author} · {selected.publisher} · {selected.edition}
                </p>
                <div className="flex gap-1.5">
                  <Badge variant="secondary">{selected.category}</Badge>
                  <Badge variant="secondary">{selected.difficulty}</Badge>
                </div>
                <p className="leading-relaxed">{selected.summary}</p>
                <div>
                  <p className="mb-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">Key learnings</p>
                  <ul className="flex flex-col gap-1">
                    {selected.keyLearnings.map((k, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-primary">→</span>
                        {k}
                      </li>
                    ))}
                  </ul>
                </div>
                {selected.purchaseLink && (
                  <a href={selected.purchaseLink} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                    Find this book →
                  </a>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
