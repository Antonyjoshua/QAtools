// ---------------------------------------------------------------------------
// Section types — the reusable blocks a resume is built from
// ---------------------------------------------------------------------------

export const SECTION_TYPES = [
  "name",
  "photo",
  "title",
  "summary",
  "contact",
  "social",
  "skills",
  "technicalSkills",
  "softSkills",
  "experience",
  "education",
  "projects",
  "certifications",
  "awards",
  "publications",
  "languages",
  "interests",
  "references",
  "custom",
] as const;
export type SectionType = (typeof SECTION_TYPES)[number];

export interface SkillItem {
  id: string;
  name: string;
  level: number; // 0-100
}

export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string; // "yyyy-mm"
  endDate: string; // "yyyy-mm", ignored when current
  current: boolean;
  bullets: string[];
}

export interface EducationItem {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  link: string;
  bullets: string[];
}

export interface CertificationItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
  link: string;
}

export interface AwardItem {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description: string;
}

export interface PublicationItem {
  id: string;
  title: string;
  publisher: string;
  date: string;
  link: string;
}

export interface LanguageItem {
  id: string;
  name: string;
  level: string; // "Native" | "Fluent" | "Conversational" | "Basic", free text
}

export interface ReferenceItem {
  id: string;
  name: string;
  relation: string;
  contact: string;
}

export interface SocialLink {
  id: string;
  label: string;
  url: string;
}

// Discriminated-union section data — one shape per SectionType.
export type SectionData =
  | { type: "name"; fullName: string }
  | { type: "photo"; attachmentId: string | null; shape: "circle" | "square" }
  | { type: "title"; text: string }
  | { type: "summary"; text: string }
  | { type: "contact"; email: string; phone: string; location: string; website: string }
  | { type: "social"; links: SocialLink[] }
  | { type: "skills"; items: SkillItem[] }
  | { type: "technicalSkills"; items: SkillItem[] }
  | { type: "softSkills"; items: SkillItem[] }
  | { type: "experience"; items: ExperienceItem[] }
  | { type: "education"; items: EducationItem[] }
  | { type: "projects"; items: ProjectItem[] }
  | { type: "certifications"; items: CertificationItem[] }
  | { type: "awards"; items: AwardItem[] }
  | { type: "publications"; items: PublicationItem[] }
  | { type: "languages"; items: LanguageItem[] }
  | { type: "interests"; items: string[] }
  | { type: "references"; items: ReferenceItem[] }
  | { type: "custom"; heading: string; text: string };

export interface ResumeSectionInstance {
  id: string;
  type: SectionType;
  title: string; // display heading, editable even for fixed section types
  order: number; // position within its column
  column: 0 | 1; // 0 = main column, 1 = sidebar (only used when layout.columns === 2)
  visible: boolean;
  showIcon: boolean;
  data: SectionData;
}

// ---------------------------------------------------------------------------
// Theme — fonts, colors, spacing. Templates ship a default; users can override per-resume.
// ---------------------------------------------------------------------------

export interface ResumeTheme {
  headingFont: string;
  bodyFont: string;
  fontSize: number; // base body px
  fontWeight: 400 | 500 | 600;
  primaryColor: string; // headings/accents
  accentColor: string; // secondary accent (dividers, tags)
  textColor: string;
  mutedColor: string;
  backgroundColor: string;
  sectionSpacing: number; // px gap between sections
  pageMargin: number; // px page padding
  dividers: boolean;
  borders: boolean;
  alignment: "left" | "center";
}

export type PageSize = "a4" | "letter";
export type ColumnCount = 1 | 2;
export type ResumeMode = "template" | "custom";
export type PreviewScheme = "light" | "dark";

export interface ResumeLayout {
  columns: ColumnCount;
  columnRatio: number; // main column width, 0.5-0.8 (only relevant when columns === 2)
  pageSize: PageSize;
  headerLayout: "stacked" | "split" | "banner";
}

export interface Resume {
  id: string;
  name: string;
  mode: ResumeMode;
  templateId: string | null;
  layout: ResumeLayout;
  theme: ResumeTheme;
  sections: ResumeSectionInstance[];
  favorite: boolean;
  isDraft: boolean;
  createdAt: number;
  updatedAt: number;
  lastOpenedAt: number;
}

export const TEMPLATE_CATEGORIES = [
  "ATS Professional",
  "Modern",
  "Executive",
  "Minimal",
  "Corporate",
  "Software Engineer",
  "QA Engineer",
  "Automation Tester",
  "Playwright Tester",
  "DevOps",
  "UI/UX Designer",
  "Project Manager",
  "Business Analyst",
  "Data Analyst",
  "Fresher",
  "Student",
  "Marketing",
  "Finance",
  "Healthcare",
  "Creative",
] as const;
export type TemplateCategory = (typeof TEMPLATE_CATEGORIES)[number];

export interface ResumeTemplate {
  id: string;
  name: string;
  category: TemplateCategory;
  description: string;
  atsFriendly: boolean;
  layout: ResumeLayout;
  theme: ResumeTheme;
  /** Default section arrangement a new resume from this template starts with. */
  sections: { type: SectionType; column: 0 | 1 }[];
}

export interface ResumeAttachment {
  id: string;
  resumeId: string;
  filename: string;
  mimeType: string;
  size: number;
  blob: Blob;
  createdAt: number;
}

export interface ResumeHistoryEntry {
  id: string;
  resumeId: string;
  snapshot: Resume;
  createdAt: number;
}
