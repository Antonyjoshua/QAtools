import { DbProvider } from "@/components/notes/db-provider";

export default function NotesLayout({ children }: { children: React.ReactNode }) {
  return <DbProvider>{children}</DbProvider>;
}
