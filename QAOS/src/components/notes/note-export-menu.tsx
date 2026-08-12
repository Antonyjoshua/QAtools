"use client";

import { Download } from "lucide-react";
import { toast } from "sonner";
import type { Note } from "@/lib/notes/types";
import { downloadBlob, noteToMarkdown, noteToHTMLDocument, downloadNoteAsPDF, sanitizeFilename } from "@/lib/notes/export";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function NoteExportMenu({ note }: { note: Note }) {
  async function handleExport(format: "md" | "html" | "pdf") {
    try {
      const filename = sanitizeFilename(note.title);
      if (format === "md") {
        downloadBlob(noteToMarkdown(note), `${filename}.md`, "text/markdown");
      } else if (format === "html") {
        const html = await noteToHTMLDocument(note);
        downloadBlob(html, `${filename}.html`, "text/html");
      } else {
        await downloadNoteAsPDF(note);
      }
      toast.success(`Exported as ${format.toUpperCase()}`);
    } catch {
      toast.error("Export failed");
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-input px-2.5 text-xs transition-colors hover:bg-muted">
        <Download className="size-3.5" />
        Export
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => handleExport("md")}>Markdown (.md)</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("html")}>HTML (.html)</DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("pdf")}>PDF (.pdf)</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
