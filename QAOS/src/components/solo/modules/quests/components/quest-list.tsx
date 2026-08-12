"use client";

import { Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/solo/ui/card";
import { Checkbox } from "@/components/solo/ui/checkbox";
import { Badge } from "@/components/solo/ui/badge";
import { Button } from "@/components/solo/ui/button";
import { cn } from "@/lib/utils";
import type { QuestTemplate, CustomQuest } from "@/lib/solo/types";

interface QuestListProps {
  templates: QuestTemplate[];
  completedIds: string[];
  customQuests: CustomQuest[];
  onCompleteTemplate: (id: string) => void;
  onCompleteCustom: (id: string) => void;
  onRemoveCustom: (id: string) => void;
}

export function QuestList({
  templates,
  completedIds,
  customQuests,
  onCompleteTemplate,
  onCompleteCustom,
  onRemoveCustom,
}: QuestListProps) {
  return (
    <Card>
      <CardContent className="pt-5 space-y-1.5">
        {templates.map((quest) => {
          const done = completedIds.includes(quest.id);
          return (
            <label
              key={quest.id}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2.5 cursor-pointer transition-colors",
                done ? "bg-white/[0.03] opacity-60" : "hover:bg-white/5"
              )}
            >
              <Checkbox
                checked={done}
                disabled={done}
                onCheckedChange={() => !done && onCompleteTemplate(quest.id)}
              />
              <div className="flex-1 min-w-0">
                <div className={cn("text-sm font-medium", done && "line-through")}>{quest.title}</div>
                <div className="text-xs text-muted-foreground truncate">{quest.description}</div>
              </div>
              <Badge variant={done ? "success" : "default"}>+{quest.xp} XP</Badge>
            </label>
          );
        })}

        {customQuests.length > 0 && (
          <>
            <div className="pt-2 pb-1 text-[11px] uppercase tracking-wide text-muted-foreground px-3">
              Custom
            </div>
            {customQuests.map((quest) => (
              <div key={quest.id} className="flex items-center gap-3 rounded-md px-3 py-2.5 hover:bg-white/5">
                <Checkbox checked={false} onCheckedChange={() => onCompleteCustom(quest.id)} />
                <div className="flex-1 min-w-0 text-sm font-medium">{quest.title}</div>
                <Badge>+{quest.xp} XP</Badge>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => onRemoveCustom(quest.id)}
                  aria-label="Remove quest"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            ))}
          </>
        )}

        {templates.length === 0 && customQuests.length === 0 && (
          <div className="text-sm text-muted-foreground text-center py-6">No quests yet.</div>
        )}
      </CardContent>
    </Card>
  );
}
