export interface JournalEntry {
  id: string;
  date: string;
  timestamp: number;
  learning: string;
  challenges: string;
  mistakes: string;
  lessons: string;
  goals: string;
  wins: string;
}

export type CertificationStatus = "not-started" | "in-progress" | "completed";

export interface Certification {
  id: string;
  courseName: string;
  provider: string;
  status: CertificationStatus;
  completionPercent: number;
  hasCertificate: boolean;
  expiryDate: string | null;
  createdAt: number;
}

export interface RoadmapMilestone {
  id: string;
  order: number;
  title: string;
  description: string;
}

export interface ThemeDefinition {
  id: string;
  name: string;
  description: string;
  unlockLevel: number;
  colors: {
    accent: string;
    accentSoft: string;
    glow: string;
  };
}

export interface TitleDefinition {
  id: string;
  name: string;
  unlockLevel: number;
}

export interface NotificationItem {
  id: string;
  message: string;
  tone: "info" | "warning" | "success";
  createdAt: number;
}
