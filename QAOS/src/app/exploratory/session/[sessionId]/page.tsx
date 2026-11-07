"use client";

import * as React from "react";
import { use } from "react";
import Link from "next/link";
import { useLiveQuery } from "dexie-react-hooks";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { db } from "@/lib/exploratory/db";
import { startSession, pauseSession, completeSession } from "@/lib/exploratory/repo/sessions-repo";
import { addNote } from "@/lib/exploratory/repo/notes-repo";
import { createBugFromSessionNote } from "@/lib/exploratory/services/bug-link";
import { SessionTimer } from "@/components/exploratory/session-timer";
import { NoteLog } from "@/components/exploratory/note-log";
import { DebriefPanel } from "@/components/exploratory/debrief-panel";
import { SessionStatusBadge } from "@/components/exploratory/status-badge";
import type { SessionNote, NoteType } from "@/lib/exploratory/types";

export default function SessionRunnerPage({ params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = use(params);

  const session = useLiveQuery(() => db.sessions.get(sessionId), [sessionId]);
  const charter = useLiveQuery(() => (session ? db.charters.get(session.charterId) : undefined), [session?.charterId]);
  const notes = useLiveQuery(() => db.notes.where("sessionId").equals(sessionId).toArray(), [sessionId]) ?? [];

  const [now, setNow] = React.useState(() => Date.now());
  React.useEffect(() => {
    if (session?.status !== "In Progress") return;
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, [session?.status]);

  const elapsedMs = session ? session.accumulatedMs + (session.startedAt ? now - session.startedAt : 0) : 0;

  async function handleAddNote(type: NoteType, text: string) {
    await addNote(sessionId, type, text);
  }

  async function handleFileBug(note: SessionNote) {
    if (!session || !charter) return;
    const bug = await createBugFromSessionNote(note, session, charter, "You");
    toast.success(`Filed ${bug.displayId}`);
  }

  if (!session || !charter) return null;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <Link href="/exploratory" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-3.5" />
        Back to charters
      </Link>

      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-1">
            <SessionStatusBadge status={session.status} />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">{charter.title}</h1>
          <p className="mt-1 max-w-2xl text-muted-foreground">{charter.mission}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_280px]">
        <div className="flex flex-col gap-6">
          <SessionTimer
            session={session}
            elapsedMs={elapsedMs}
            targetMinutes={charter.targetDurationMinutes}
            onStart={() => startSession(sessionId)}
            onPause={() => pauseSession(sessionId)}
            onComplete={() => completeSession(sessionId)}
          />
          <NoteLog notes={notes} onAdd={handleAddNote} onFileBug={handleFileBug} />
        </div>
        <div>
          <DebriefPanel notes={notes} elapsedMs={elapsedMs} />
        </div>
      </div>
    </div>
  );
}
