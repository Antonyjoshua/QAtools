"use client";

import { Check } from "lucide-react";
import { Card } from "@/components/solo/ui/card";
import { Badge } from "@/components/solo/ui/badge";
import { Checkbox } from "@/components/solo/ui/checkbox";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/lib/solo/store/useAppStore";
import { ROADMAP_MILESTONES, XP_REWARDS } from "@/lib/solo/constants";

export function RoadmapPage() {
  const completedIds = useAppStore((s) => s.roadmap.completedMilestoneIds);
  const toggleRoadmapMilestone = useAppStore((s) => s.toggleRoadmapMilestone);
  const completedCount = ROADMAP_MILESTONES.filter((m) => completedIds.includes(m.id)).length;

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">Learning Roadmap</h1>
        <p className="text-sm text-muted-foreground">
          {completedCount} / {ROADMAP_MILESTONES.length} milestones complete
        </p>
      </div>

      <div className="relative pl-8">
        <div className="absolute left-[15px] top-2 bottom-2 w-px bg-white/10" />
        <div className="space-y-3">
          {ROADMAP_MILESTONES.map((milestone) => {
            const done = completedIds.includes(milestone.id);
            return (
              <div key={milestone.id} className="relative">
                <div
                  className={cn(
                    "absolute -left-8 top-4 flex h-6 w-6 items-center justify-center rounded-full border-2 z-10",
                    done
                      ? "bg-[var(--accent)] border-[var(--accent)] text-black shadow-[0_0_10px_var(--glow)]"
                      : "bg-[var(--panel-solid)] border-white/20 text-muted-foreground"
                  )}
                >
                  {done ? <Check className="h-3.5 w-3.5" /> : milestone.order}
                </div>
                <Card className={cn("p-4", done && "border-[var(--accent)]/30")}>
                  <label className="flex items-start gap-3 cursor-pointer">
                    <Checkbox checked={done} onCheckedChange={() => toggleRoadmapMilestone(milestone.id)} className="mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className={cn("font-semibold text-sm", done && "line-through text-muted-foreground")}>
                          {milestone.title}
                        </span>
                        <Badge variant={done ? "success" : "default"}>+{XP_REWARDS.ROADMAP_MILESTONE} XP</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">{milestone.description}</p>
                    </div>
                  </label>
                </Card>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
