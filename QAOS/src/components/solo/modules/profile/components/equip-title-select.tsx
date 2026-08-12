"use client";

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/solo/ui/select";
import { useAppStore } from "@/lib/solo/store/useAppStore";
import { useLevelInfo } from "@/lib/solo/hooks/useLevelInfo";
import { TITLES } from "@/lib/solo/constants";

export function EquipTitleSelect() {
  const badge = useAppStore((s) => s.profile.badge);
  const equipTitle = useAppStore((s) => s.equipTitle);
  const levelInfo = useLevelInfo();

  return (
    <Select value={badge} onValueChange={equipTitle}>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Select title" />
      </SelectTrigger>
      <SelectContent>
        {TITLES.map((title) => {
          const unlocked = levelInfo.level >= title.unlockLevel;
          return (
            <SelectItem key={title.id} value={title.id} disabled={!unlocked}>
              {title.name} {!unlocked && `(Lv. ${title.unlockLevel})`}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );
}
