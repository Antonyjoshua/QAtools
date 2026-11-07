import { createBug, type CreateBugInput } from "@/lib/bugs/bugs-repo";
import { doc, paragraph } from "@/lib/bugs/template-builders";
import type { BugReport } from "@/lib/bugs/types";
import { updateNote } from "../repo/notes-repo";
import type { SessionNote, Session, Charter } from "../types";

// Exploratory Testing reaches into Bug Reports (not the other way around) — same
// intentional one-directional edge already established by Test Management's bug-link.ts.

export async function createBugFromSessionNote(note: SessionNote, session: Session, charter: Charter, reporter: string): Promise<BugReport> {
  const input: CreateBugInput = {
    title: note.text.length > 120 ? `${note.text.slice(0, 117)}...` : note.text || `Bug found during "${charter.title}"`,
    actualResult: doc(paragraph(note.text)),
    reporter,
    linkedExploratorySessionId: session.id,
    linkedExploratorySessionCharter: charter.title,
  };

  const bug = await createBug(input);
  await updateNote(note.id, { linkedBugId: bug.id, linkedBugDisplayId: bug.displayId });
  return bug;
}
