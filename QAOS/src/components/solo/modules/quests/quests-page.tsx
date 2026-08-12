"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/solo/ui/tabs";
import { useAppStore } from "@/lib/solo/store/useAppStore";
import { DAILY_QUEST_TEMPLATES, WEEKLY_MISSION_TEMPLATES, MONTHLY_CHALLENGE_TEMPLATES } from "@/lib/solo/constants";
import { QuestList } from "./components/quest-list";
import { AddCustomQuestDialog } from "./components/add-custom-quest-dialog";

export function QuestsPage() {
  const quests = useAppStore((s) => s.quests);
  const completeDailyQuest = useAppStore((s) => s.completeDailyQuest);
  const completeWeeklyMission = useAppStore((s) => s.completeWeeklyMission);
  const completeMonthlyChallenge = useAppStore((s) => s.completeMonthlyChallenge);
  const completeCustomQuest = useAppStore((s) => s.completeCustomQuest);
  const removeCustomQuest = useAppStore((s) => s.removeCustomQuest);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">Quests</h1>
        <p className="text-sm text-muted-foreground">Daily quests, weekly missions, monthly challenges.</p>
      </div>

      <Tabs defaultValue="daily">
        <TabsList>
          <TabsTrigger value="daily">Daily</TabsTrigger>
          <TabsTrigger value="weekly">Weekly</TabsTrigger>
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
        </TabsList>

        <TabsContent value="daily" className="space-y-3">
          <div className="flex justify-end">
            <AddCustomQuestDialog frequency="daily" />
          </div>
          <QuestList
            templates={DAILY_QUEST_TEMPLATES}
            completedIds={quests.dailyCompleted}
            customQuests={quests.custom.filter((c) => c.frequency === "daily")}
            onCompleteTemplate={completeDailyQuest}
            onCompleteCustom={completeCustomQuest}
            onRemoveCustom={removeCustomQuest}
          />
        </TabsContent>

        <TabsContent value="weekly" className="space-y-3">
          <div className="flex justify-end">
            <AddCustomQuestDialog frequency="weekly" />
          </div>
          <QuestList
            templates={WEEKLY_MISSION_TEMPLATES}
            completedIds={quests.weeklyCompleted}
            customQuests={quests.custom.filter((c) => c.frequency === "weekly")}
            onCompleteTemplate={completeWeeklyMission}
            onCompleteCustom={completeCustomQuest}
            onRemoveCustom={removeCustomQuest}
          />
        </TabsContent>

        <TabsContent value="monthly" className="space-y-3">
          <div className="flex justify-end">
            <AddCustomQuestDialog frequency="monthly" />
          </div>
          <QuestList
            templates={MONTHLY_CHALLENGE_TEMPLATES}
            completedIds={quests.monthlyCompleted}
            customQuests={quests.custom.filter((c) => c.frequency === "monthly")}
            onCompleteTemplate={completeMonthlyChallenge}
            onCompleteCustom={completeCustomQuest}
            onRemoveCustom={removeCustomQuest}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
