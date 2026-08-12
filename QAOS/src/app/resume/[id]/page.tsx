"use client";

import { use, useEffect } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/resume/db";
import { touchResumeOpened } from "@/lib/resume/repo/resumes-repo";
import { useResumeSettings } from "@/lib/resume/settings-store";
import { ResumeEditorShell } from "@/components/resume/editor/resume-editor-shell";

export default function ResumeEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const resume = useLiveQuery(() => db.resumes.get(id), [id]);
  const setLastResumeId = useResumeSettings((s) => s.setLastResumeId);

  useEffect(() => {
    void touchResumeOpened(id);
    setLastResumeId(id);
  }, [id, setLastResumeId]);

  if (resume === undefined) return null;

  return <ResumeEditorShell key={resume.id} resume={resume} />;
}
