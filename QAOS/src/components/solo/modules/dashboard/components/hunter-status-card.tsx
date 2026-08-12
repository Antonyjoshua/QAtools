"use client";

import { motion } from "framer-motion";
import { Card } from "@/components/solo/ui/card";
import { LevelBadge } from "@/components/solo/shared/level-badge";
import { XpBar } from "@/components/solo/shared/xp-bar";
import { useLevelInfo } from "@/lib/solo/hooks/useLevelInfo";
import { useAppStore } from "@/lib/solo/store/useAppStore";
import { Flame } from "lucide-react";

export function HunterStatusCard() {
  const levelInfo = useLevelInfo();
  const totalXp = useAppStore((s) => s.xp.total);
  const streak = useAppStore((s) => s.streak);
  const username = useAppStore((s) => s.profile.username);
  const avatar = useAppStore((s) => s.profile.avatar);

  return (
    <Card className="overflow-hidden">
      <div className="p-6 flex flex-col sm:flex-row sm:items-center gap-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          <LevelBadge level={levelInfo.level} size="lg" className="animate-glow-pulse" />
        </motion.div>

        <div className="flex-1 min-w-0 space-y-3">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h1 className="text-2xl font-bold">
              {avatar} {username}
            </h1>
            <span className="text-sm text-[var(--accent)] font-semibold">{levelInfo.title}</span>
          </div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground">
            Rank: <span className="text-foreground/90">{levelInfo.rank}</span>
          </div>
          <XpBar
            current={levelInfo.xpIntoLevel}
            max={levelInfo.xpForNextLevel || 1}
            label={levelInfo.isMaxLevel ? "Max Level Reached" : `Level ${levelInfo.level} Progress`}
          />
          <div className="flex flex-wrap items-center gap-4 pt-1 text-sm">
            <div className="text-muted-foreground">
              Total XP: <span className="font-semibold text-foreground">{totalXp.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1.5 text-orange-400 font-semibold">
              <Flame className="h-4 w-4" />
              {streak.current} Day Streak
              <span className="text-muted-foreground font-normal">(best {streak.longest})</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
