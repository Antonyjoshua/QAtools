export interface SkillUnlock {
  id: string;
  label: string;
  requiredLevel: number;
}

export interface SkillDefinition {
  id: string;
  name: string;
  category: "technical" | "soft";
  description: string;
  icon: string;
  unlocks: SkillUnlock[];
}

export interface SkillState {
  xp: number;
}
