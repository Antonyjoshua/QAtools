"use client";

import * as React from "react";
import { NodeViewWrapper, type NodeViewProps } from "@tiptap/react";
import { useLiveQuery } from "dexie-react-hooks";
import { FileText, FileArchive, FileSpreadsheet, Download, Trash2, Image as ImageIcon } from "lucide-react";
import { db } from "@/lib/notes/db";
import { formatBytes, kindForMime } from "@/lib/notes/attachments-repo";
import { Button } from "@/components/ui/button";

function fileIconFor(mime: string) {
  if (mime.includes("zip")) return FileArchive;
  if (mime.includes("sheet") || mime.includes("excel")) return FileSpreadsheet;
  if (mime.startsWith("image/")) return ImageIcon;
  return FileText;
}

function useObjectUrl(blob: Blob | undefined): string | null {
  const [url, setUrl] = React.useState<string | null>(null);
  React.useEffect(() => {
    if (!blob) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- reset object URL when blob is cleared
      setUrl(null);
      return;
    }
    const objectUrl = URL.createObjectURL(blob);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [blob]);
  return url;
}

export function FileEmbedView({ node, editor, deleteNode }: NodeViewProps) {
  const { attachmentId, filename, mimeType, size } = node.attrs as {
    attachmentId: string;
    filename: string;
    mimeType: string;
    size: number;
  };
  const attachment = useLiveQuery(() => db.attachments.get(attachmentId), [attachmentId]);
  const url = useObjectUrl(attachment?.blob);
  const kind = kindForMime(mimeType);
  const editable = editor.isEditable;

  function handleDownload() {
    if (!url) return;
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
  }

  return (
    <NodeViewWrapper className="my-2" data-drag-handle>
      {kind === "image" && (
        <div className="group relative inline-block max-w-full">
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt={filename} className="max-h-[500px] max-w-full rounded-lg border border-border object-contain" />
          ) : (
            <div className="flex h-40 w-64 items-center justify-center rounded-lg border border-dashed border-border text-muted-foreground text-xs">
              Loading image…
            </div>
          )}
          {editable && (
            <Button
              variant="destructive"
              size="icon"
              className="absolute right-2 top-2 size-7 opacity-0 transition-opacity group-hover:opacity-100"
              onClick={deleteNode}
              contentEditable={false}
            >
              <Trash2 className="size-3.5" />
            </Button>
          )}
        </div>
      )}

      {kind === "video" &&
        (url ? (
          <video src={url} controls className="max-h-[500px] max-w-full rounded-lg border border-border" />
        ) : (
          <div className="flex h-40 w-64 items-center justify-center rounded-lg border border-dashed border-border text-muted-foreground text-xs">
            Loading video…
          </div>
        ))}

      {kind === "file" && (
        <div className="not-prose flex max-w-sm items-center gap-3 rounded-lg border border-border bg-card p-3" contentEditable={false}>
          {React.createElement(fileIconFor(mimeType), { className: "size-8 shrink-0 text-primary" })}
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{filename}</p>
            <p className="text-xs text-muted-foreground">{formatBytes(size)}</p>
          </div>
          <Button variant="ghost" size="icon" className="size-8 shrink-0" onClick={handleDownload}>
            <Download className="size-4" />
          </Button>
          {editable && (
            <Button variant="ghost" size="icon" className="size-8 shrink-0 text-destructive" onClick={deleteNode}>
              <Trash2 className="size-4" />
            </Button>
          )}
        </div>
      )}
    </NodeViewWrapper>
  );
}
