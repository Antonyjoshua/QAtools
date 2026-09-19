export interface PortfolioProfile {
  name: string;
  role: string;
  tagline: string;
  location: string;
  email: string;
  phone: string;
  github: string;
  linkedin: string;
  resumeAttachmentId: string | null;
  photoAttachmentId: string | null;
}

export interface PortfolioStat {
  id: string;
  value: string;
  suffix: string;
  label: string;
}

export interface PortfolioEducationItem {
  id: string;
  degree: string;
  institution: string;
  status: string;
  note: string;
}

export interface PortfolioContactDetail {
  id: string;
  label: string;
  value: string;
  link: string;
}

export interface PortfolioPassion {
  id: string;
  icon: string;
  title: string;
  desc: string;
}

export interface PortfolioSkillGroup {
  id: string;
  category: string;
  icon: string;
  items: string[];
}

export interface PortfolioExperienceItem {
  id: string;
  company: string;
  role: string;
  period: string;
  current: boolean;
  highlights: string[];
  tech: string[];
}

export interface PortfolioProjectItem {
  id: string;
  title: string;
  subtitle: string;
  company: string;
  description: string;
  tags: string[];
  liveUrl: string;
  githubUrl: string;
  status: string;
}

export interface PortfolioCertification {
  id: string;
  title: string;
  subtitle: string;
  issuer: string;
  date: string;
  instructor: string;
  duration: string;
  skills: string[];
}

export interface PortfolioExtraItem {
  id: string;
  icon: string;
  title: string;
  desc: string;
  tag: string;
}

export interface PortfolioContent {
  profile: PortfolioProfile;
  stats: PortfolioStat[];
  aboutParagraphs: string[];
  education: PortfolioEducationItem[];
  contactDetails: PortfolioContactDetail[];
  passions: PortfolioPassion[];
  skills: PortfolioSkillGroup[];
  experience: PortfolioExperienceItem[];
  projects: PortfolioProjectItem[];
  certifications: PortfolioCertification[];
  extras: PortfolioExtraItem[];
}

export const PORTFOLIO_TEMPLATE_IDS = ["bug-mascot", "ai-dashboard", "sports-fire", "cyber-hud"] as const;
export type PortfolioTemplateId = (typeof PORTFOLIO_TEMPLATE_IDS)[number];

export interface Portfolio {
  id: string;
  name: string;
  templateId: PortfolioTemplateId;
  themeId?: string;
  content: PortfolioContent;
  favorite: boolean;
  createdAt: number;
  updatedAt: number;
  lastOpenedAt: number;
}

export interface PortfolioAttachment {
  id: string;
  portfolioId: string;
  kind: "photo" | "resume";
  filename: string;
  mimeType: string;
  size: number;
  blob: Blob;
  createdAt: number;
}
