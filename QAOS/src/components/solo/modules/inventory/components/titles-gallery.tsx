"use client";

import { Lock, Check } from "lucide-react";
import { Card } from "@/components/solo/ui/card";
import { Button } from "@/components/solo/ui/button";
import { Badge } from "@/components/solo/ui/badge";
import { cn } from "@/lib/utils";
import { TITLES } from "@/lib/solo/constants";
import { useAppStore } from "@/lib/solo/store/useAppStore";
import { useLevelInfo } from "@/lib/solo/hooks/useLevelInfo";

export function TitlesGallery() {
  const equipped = useAppStore((s) => s.profile.badge);
  const equipTitle = useAppStore((s) => s.equipTitle);
  const levelInfo = useLevelInfo();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {TITLES.map((title) => {
        const unlocked = levelInfo.level >= title.unlockLevel;
        const isEquipped = equipped === title.id;
        return (
          <Card
            key={title.id}
            className={cn("p-4 flex flex-col gap-2", isEquipped && "border-[var(--accent)]/50")}
          >
            <div className="flex items-center justify-between gap-2">
              <div className="text-sm font-semibold truncate">{title.name}</div>
              {isEquipped && <Badge variant="success">Equipped</Badge>}
            </div>
            <Button
              size="sm"
              variant={unlocked ? "secondary" : "ghost"}
              disabled={!unlocked || isEquipped}
              onClick={() => equipTitle(title.id)}
            >
              {unlocked ? (
                isEquipped ? (
                  <>
                    <Check className="h-3.5 w-3.5" /> Equipped
                  </>
                ) : (
                  "Equip"
                )
              ) : (
                <>
                  <Lock className="h-3.5 w-3.5" /> Lv. {title.unlockLevel}
                </>
              )}
            </Button>
          </Card>
        );
      })}
    </div>
  );
}
