import { notFound } from "next/navigation";
import { getCheatSheet } from "@/lib/learn/content/registry";
import { CheatSheetView } from "@/components/learn/cheatsheets/cheatsheet-view";

export default async function CheatSheetPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const sheet = getCheatSheet(id);
  if (!sheet) notFound();

  return <CheatSheetView sheet={sheet} />;
}
