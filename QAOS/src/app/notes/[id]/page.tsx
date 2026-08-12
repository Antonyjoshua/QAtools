import { NoteEditorPage } from "@/components/notes/note-editor-page";

export default async function NotePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <NoteEditorPage noteId={id} />;
}
