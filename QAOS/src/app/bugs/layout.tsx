import { DbProvider } from "@/components/bugs/db-provider";
import { KeyboardShortcuts } from "@/components/bugs/keyboard-shortcuts";

export default function BugsLayout({ children }: { children: React.ReactNode }) {
  return (
    <DbProvider>
      <KeyboardShortcuts />
      {children}
    </DbProvider>
  );
}
