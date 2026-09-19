import { XpBar } from "@/components/playground/gamification/xp-bar";

export function XpProgressCard({ totalXp }: { totalXp: number }) {
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <XpBar totalXp={totalXp} />
      <p className="mt-2 text-xs text-muted-foreground">{totalXp} XP earned total</p>
    </div>
  );
}
