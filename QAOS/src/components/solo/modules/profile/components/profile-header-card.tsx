"use client";

import { Card } from "@/components/solo/ui/card";
import { LevelBadge } from "@/components/solo/shared/level-badge";
import { useAppStore } from "@/lib/solo/store/useAppStore";
import { useLevelInfo } from "@/lib/solo/hooks/useLevelInfo";
import { TITLES } from "@/lib/solo/constants";
import { AvatarPicker } from "./avatar-picker";
import { EditProfileDialog } from "./edit-profile-dialog";
import { EquipTitleSelect } from "./equip-title-select";

export function ProfileHeaderCard() {
  const profile = useAppStore((s) => s.profile);
  const levelInfo = useLevelInfo();
  const equippedTitle = TITLES.find((t) => t.id === profile.badge)?.name ?? levelInfo.title;

  return (
    <Card className="p-6">
      <div className="flex flex-col sm:flex-row gap-6">
        <AvatarPicker>
          <button className="group relative shrink-0 mx-auto sm:mx-0">
            <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-[var(--accent)]/50 bg-[var(--accent)]/10 text-4xl shadow-[0_0_20px_var(--glow)] transition-transform group-hover:scale-105">
              {profile.avatar}
            </div>
            <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-2 py-0.5 text-[10px] text-foreground/80 opacity-0 transition-opacity group-hover:opacity-100">
              Change
            </span>
          </button>
        </AvatarPicker>

        <div className="flex-1 space-y-3 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="text-2xl font-bold">{profile.username}</h1>
              <p className="text-sm text-[var(--accent)] font-medium">{equippedTitle}</p>
            </div>
            <div className="flex items-center justify-center sm:justify-end gap-2">
              <LevelBadge level={levelInfo.level} size="sm" />
              <EditProfileDialog />
            </div>
          </div>

          {profile.bio && <p className="text-sm text-muted-foreground max-w-2xl">{profile.bio}</p>}

          <div className="flex flex-wrap justify-center sm:justify-start gap-x-6 gap-y-1 text-sm text-muted-foreground">
            {profile.careerGoal && (
              <span>
                🎯 Goal: <span className="text-foreground/90">{profile.careerGoal}</span>
              </span>
            )}
            {profile.company && (
              <span>
                🏢 <span className="text-foreground/90">{profile.company}</span>
              </span>
            )}
            <span>
              📅 <span className="text-foreground/90">{profile.yearsExperience}</span> yrs experience
            </span>
          </div>

          <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
            <span className="text-xs text-muted-foreground">Equipped title:</span>
            <EquipTitleSelect />
          </div>
        </div>
      </div>
    </Card>
  );
}
