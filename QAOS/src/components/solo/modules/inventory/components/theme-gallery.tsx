"use client";

import { Lock, Check } from "lucide-react";
import { Card } from "@/components/solo/ui/card";
import { Button } from "@/components/solo/ui/button";
import { Badge } from "@/components/solo/ui/badge";
import { cn } from "@/lib/utils";
import { THEMES } from "@/lib/solo/constants";
import { useAppStore } from "@/lib/solo/store/useAppStore";
import { useLevelInfo } from "@/lib/solo/hooks/useLevelInfo";

export function ThemeGallery() {
  const equipped = useAppStore((s) => s.settings.accentTheme);
  const equipTheme = useAppStore((s) => s.equipTheme);
  const levelInfo = useLevelInfo();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {THEMES.map((theme) => {
        const unlocked = levelInfo.level >= theme.unlockLevel;
        const isEquipped = equipped === theme.id;
        return (
          <Card key={theme.id} className={cn("p-4 space-y-3", isEquipped && "border-[var(--accent)]/50")}>
            <div
              className="h-16 rounded-lg"
              style={{
                background: `linear-gradient(135deg, ${theme.colors.accent}, ${theme.colors.accentSoft})`,
              }}
            />
            <div>
              <div className="flex items-center justify-between gap-2">
                <div className="text-sm font-semibold truncate">{theme.name}</div>
                {isEquipped && <Badge variant="success">Equipped</Badge>}
              </div>
              <p className="text-xs text-muted-foreground mt-1">{theme.description}</p>
            </div>
            <Button
              size="sm"
              variant={unlocked ? "secondary" : "ghost"}
              className="w-full"
              disabled={!unlocked || isEquipped}
              onClick={() => equipTheme(theme.id)}
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
                  <Lock className="h-3.5 w-3.5" /> Lv. {theme.unlockLevel}
                </>
              )}
            </Button>
          </Card>
        );
      })}
    </div>
  );
}
