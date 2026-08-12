"use client";

import * as React from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { Paperclip, Trash2, Download } from "lucide-react";
import { db } from "@/lib/testcases/db";
import { addAttachment, deleteAttachment, formatBytes } from "@/lib/testcases/repo/attachments-repo";
import type { Attachment } from "@/lib/testcases/types";

function useObjectUrl(blob: Blob | undefined): string | null {
  const url = React.useMemo(() => (blob ? URL.createObjectURL(blob) : null), [blob]);
  React.useEffect(() => {
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [url]);
  return url;
}

export function AttachmentsPanel({ parentType, parentId }: { parentType: "testcase" | "step" | "executionResult" | "comment"; parentId: string }) {
  const attachments =
    useLiveQuery(() => db.attachments.where({ parentType, parentId }).sortBy("createdAt"), [parentType, parentId]) ?? [];
  const inputRef = React.useRef<HTMLInputElement>(null);

  async function handleFiles(files: FileList | null) {
    if (!files) return;
    for (const file of Array.from(files)) {
      await addAttachment(parentType, parentId, file);
    }
    if (inputRef.current) inputRef.current.value = "";
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {attachments.map((att) => (
          <AttachmentThumb key={att.id} attachment={att} />
        ))}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex h-24 w-32 flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-border text-muted-foreground hover:border-primary/40 hover:text-primary"
        >
          <Paperclip className="size-4" />
          <span className="text-[11px]">Attach file</span>
        </button>
        <input ref={inputRef} type="file" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
      </div>
      {attachments.length > 0 && (
        <p className="text-xs text-muted-foreground">
          {attachments.length} file{attachments.length === 1 ? "" : "s"} · {formatBytes(attachments.reduce((sum, a) => sum + a.size, 0))}
        </p>
      )}
    </div>
  );
}

function AttachmentThumb({ attachment }: { attachment: Attachment }) {
  const url = useObjectUrl(attachment.blob);
  const isImage = attachment.mimeType.startsWith("image/");

  function download() {
    if (!url) return;
    const a = document.createElement("a");
    a.href = url;
    a.download = attachment.filename;
    a.click();
  }

  return (
    <div className="group relative w-32 overflow-hidden rounded-lg border border-border">
      {isImage && url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt={attachment.filename} className="h-24 w-full object-cover" />
      ) : (
        <div className="flex h-24 w-full flex-col items-center justify-center gap-1 bg-muted">
          <Paperclip className="size-5 text-muted-foreground" />
        </div>
      )}
      <div className="flex items-center justify-between gap-1 bg-card px-1.5 py-1">
        <p className="truncate text-[10px] text-muted-foreground">{attachment.filename}</p>
      </div>
      <div className="absolute inset-x-0 top-0 flex justify-end gap-1 bg-gradient-to-b from-black/50 to-transparent p-1 opacity-0 transition-opacity group-hover:opacity-100">
        <button type="button" onClick={download} className="rounded bg-black/40 p-1 text-white" aria-label="Download">
          <Download className="size-3" />
        </button>
        <button type="button" onClick={() => deleteAttachment(attachment.id)} className="rounded bg-black/40 p-1 text-white" aria-label="Delete">
          <Trash2 className="size-3" />
        </button>
      </div>
    </div>
  );
}
