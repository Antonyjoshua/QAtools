"use client";

import * as React from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../db";
import type { Resume } from "../types";

/** Resolves the resume's photo-section attachment (if any) to an object URL, revoked on change/unmount. */
export function useResumePhoto(resume: Resume | undefined): string | null {
  const photoSection = resume?.sections.find((s) => s.type === "photo");
  const attachmentId = photoSection?.data.type === "photo" ? photoSection.data.attachmentId : null;

  const attachment = useLiveQuery(() => (attachmentId ? db.attachments.get(attachmentId) : undefined), [attachmentId]);

  const url = React.useMemo(() => (attachment ? URL.createObjectURL(attachment.blob) : null), [attachment]);
  React.useEffect(() => {
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [url]);

  return url;
}
