"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/solo/ui/tabs";
import { SKILLS } from "@/lib/solo/constants";
import { SkillCard } from "./components/skill-card";

const TECHNICAL = SKILLS.filter((s) => s.category === "technical");
const SOFT = SKILLS.filter((s) => s.category === "soft");

export function SkillsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-bold">Skill Tree</h1>
        <p className="text-sm text-muted-foreground">
          Practice manually or complete tagged quests to grow each skill.
        </p>
      </div>
      <Tabs defaultValue="technical">
        <TabsList>
          <TabsTrigger value="technical">Technical</TabsTrigger>
          <TabsTrigger value="soft">Soft Skills</TabsTrigger>
        </TabsList>
        <TabsContent value="technical">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {TECHNICAL.map((skill) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        </TabsContent>
        <TabsContent value="soft">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {SOFT.map((skill) => (
              <SkillCard key={skill.id} skill={skill} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
