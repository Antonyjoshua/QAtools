"use client";

import * as React from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../db";

/** Resolves an attachment id to an object URL, revoked on change/unmount. */
export function useAttachmentUrl(attachmentId: string | null | undefined): string | null {
  const attachment = useLiveQuery(() => (attachmentId ? db.attachments.get(attachmentId) : undefined), [attachmentId]);

  const url = React.useMemo(() => (attachment ? URL.createObjectURL(attachment.blob) : null), [attachment]);
  React.useEffect(() => {
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [url]);

  return url;
}
