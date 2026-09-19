import { Badge } from "@/components/ui/badge";
import { getLevelInfo } from "@/lib/playground/gamification/levels";

export function LevelBadge({ totalXp }: { totalXp: number }) {
  const info = getLevelInfo(totalXp);
  return (
    <Badge variant="secondary" className="tabular-nums">
      Lv {info.level}
    </Badge>
  );
}
