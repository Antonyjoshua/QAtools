import { BADGES } from "@/lib/playground/gamification/badges";
import { BadgeIcon } from "@/components/playground/gamification/badge-icon";
import { cn } from "@/lib/utils";

export function BadgesShelf({ unlockedIds }: { unlockedIds: string[] }) {
  const unlocked = new Set(unlockedIds);

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <h3 className="mb-3 text-sm font-semibold">
        Badges ({unlocked.size}/{BADGES.length})
      </h3>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
        {BADGES.map((b) => {
          const earned = unlocked.has(b.id);
          return (
            <div
              key={b.id}
              title={b.description}
              className={cn(
                "flex flex-col items-center gap-1 rounded-md p-2 text-center",
                earned ? "bg-xp/10" : "opacity-40"
              )}
            >
              <BadgeIcon name={b.icon} className={cn("size-6", earned ? "text-xp" : "text-muted-foreground")} />
              <span className="text-[10px] leading-tight">{b.title}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
