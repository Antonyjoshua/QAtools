import { uid } from "./id";
import type { SectionData, SectionType, ResumeSectionInstance } from "./types";

export const SECTION_LABELS: Record<SectionType, string> = {
  name: "Name",
  photo: "Profile Photo",
  title: "Professional Title",
  summary: "Summary",
  contact: "Contact Details",
  social: "Social Links",
  skills: "Skills",
  technicalSkills: "Technical Skills",
  softSkills: "Soft Skills",
  experience: "Experience",
  education: "Education",
  projects: "Projects",
  certifications: "Certifications",
  awards: "Awards",
  publications: "Publications",
  languages: "Languages",
  interests: "Interests",
  references: "References",
  custom: "Custom Section",
};

/** Section types that hold a single instance's worth of free text/identity, vs. repeatable-item lists. */
export const SINGLETON_SECTION_TYPES: SectionType[] = ["name", "photo", "title", "summary", "contact"];

export function createDefaultSectionData(type: SectionType): SectionData {
  switch (type) {
    case "name":
      return { type, fullName: "" };
    case "photo":
      return { type, attachmentId: null, shape: "circle" };
    case "title":
      return { type, text: "" };
    case "summary":
      return { type, text: "" };
    case "contact":
      return { type, email: "", phone: "", location: "", website: "" };
    case "social":
      return { type, links: [] };
    case "skills":
    case "technicalSkills":
    case "softSkills":
      return { type, items: [] };
    case "experience":
      return { type, items: [] };
    case "education":
      return { type, items: [] };
    case "projects":
      return { type, items: [] };
    case "certifications":
      return { type, items: [] };
    case "awards":
      return { type, items: [] };
    case "publications":
      return { type, items: [] };
    case "languages":
      return { type, items: [] };
    case "interests":
      return { type, items: [] };
    case "references":
      return { type, items: [] };
    case "custom":
      return { type, heading: "Custom Section", text: "" };
  }
}

export function createSectionInstance(type: SectionType, column: 0 | 1, order: number): ResumeSectionInstance {
  return {
    id: uid(),
    type,
    title: SECTION_LABELS[type],
    order,
    column,
    visible: true,
    showIcon: true,
    data: createDefaultSectionData(type),
  };
}

export function isSectionEmpty(data: SectionData): boolean {
  switch (data.type) {
    case "name":
      return !data.fullName.trim();
    case "photo":
      return !data.attachmentId;
    case "title":
      return !data.text.trim();
    case "summary":
      return !data.text.trim();
    case "contact":
      return !data.email && !data.phone && !data.location && !data.website;
    case "social":
      return data.links.length === 0;
    case "skills":
    case "technicalSkills":
    case "softSkills":
      return data.items.length === 0;
    case "experience":
      return data.items.length === 0;
    case "education":
      return data.items.length === 0;
    case "projects":
      return data.items.length === 0;
    case "certifications":
      return data.items.length === 0;
    case "awards":
      return data.items.length === 0;
    case "publications":
      return data.items.length === 0;
    case "languages":
      return data.items.length === 0;
    case "interests":
      return data.items.length === 0;
    case "references":
      return data.items.length === 0;
    case "custom":
      return !data.text.trim();
  }
}
