import { uid } from "./id";
import type { Resume, ResumeTemplate, SectionData, SectionType } from "./types";

const SAMPLE_DATA: Partial<Record<SectionType, SectionData>> = {
  name: { type: "name", fullName: "Alex Morgan" },
  title: { type: "title", text: "Senior QA Engineer" },
  photo: { type: "photo", attachmentId: null, shape: "circle" },
  summary: {
    type: "summary",
    text: "Detail-oriented QA professional with 5+ years driving test strategy, automation coverage and release quality across web and mobile platforms.",
  },
  contact: { type: "contact", email: "alex.morgan@email.com", phone: "+1 555 010 2020", location: "Austin, TX", website: "alexmorgan.dev" },
  social: { type: "social", links: [{ id: uid(), label: "LinkedIn", url: "linkedin.com/in/alexmorgan" }, { id: uid(), label: "GitHub", url: "github.com/alexmorgan" }] },
  skills: { type: "skills", items: [{ id: uid(), name: "Test Planning", level: 90 }, { id: uid(), name: "API Testing", level: 85 }, { id: uid(), name: "Selenium", level: 80 }] },
  technicalSkills: {
    type: "technicalSkills",
    items: [{ id: uid(), name: "Playwright", level: 92 }, { id: uid(), name: "TypeScript", level: 85 }, { id: uid(), name: "CI/CD", level: 78 }],
  },
  softSkills: { type: "softSkills", items: [{ id: uid(), name: "Communication", level: 90 }, { id: uid(), name: "Leadership", level: 75 }] },
  experience: {
    type: "experience",
    items: [
      {
        id: uid(),
        company: "Nimbus Systems",
        role: "Senior QA Engineer",
        location: "Remote",
        startDate: "2022-01",
        endDate: "",
        current: true,
        bullets: ["Led migration of regression suite to Playwright, cutting run time by 40%", "Mentored 3 junior QA engineers on automation best practices"],
      },
      {
        id: uid(),
        company: "Brightpath Labs",
        role: "QA Engineer",
        location: "Austin, TX",
        startDate: "2019-06",
        endDate: "2021-12",
        current: false,
        bullets: ["Built API test framework covering 200+ endpoints", "Reduced production defects by 30% through shift-left testing"],
      },
    ],
  },
  education: {
    type: "education",
    items: [{ id: uid(), school: "University of Texas", degree: "B.S.", field: "Computer Science", startDate: "2015-08", endDate: "2019-05", gpa: "3.7" }],
  },
  projects: {
    type: "projects",
    items: [{ id: uid(), name: "QA Test Data Generator", description: "Internal tool generating realistic test fixtures across 15 data domains.", link: "", bullets: ["Adopted by 4 teams company-wide"] }],
  },
  certifications: { type: "certifications", items: [{ id: uid(), name: "ISTQB Certified Tester", issuer: "ISTQB", date: "2021-03", link: "" }] },
  awards: { type: "awards", items: [{ id: uid(), title: "Quality Champion Award", issuer: "Nimbus Systems", date: "2023-11", description: "Recognized for reducing escaped defects by 35%" }] },
  publications: { type: "publications", items: [{ id: uid(), title: "Shift-Left Testing in Practice", publisher: "QA Weekly", date: "2022-09", link: "" }] },
  languages: { type: "languages", items: [{ id: uid(), name: "English", level: "Native" }, { id: uid(), name: "Spanish", level: "Conversational" }] },
  interests: { type: "interests", items: ["Open source", "Chess", "Hiking"] },
  references: { type: "references", items: [{ id: uid(), name: "Jordan Lee", relation: "Former Manager", contact: "jordan.lee@email.com" }] },
  custom: { type: "custom", heading: "Custom Section", text: "Additional details go here." },
};

export function buildSampleResume(template: ResumeTemplate): Resume {
  const now = Date.now();
  const columnCounters: Record<0 | 1, number> = { 0: 0, 1: 0 };
  return {
    id: `sample-${template.id}`,
    name: `${template.name} Sample`,
    mode: "template",
    templateId: template.id,
    layout: { ...template.layout },
    theme: { ...template.theme },
    sections: template.sections.map(({ type, column }) => ({
      id: uid(),
      type,
      title: SAMPLE_TITLES[type] ?? type,
      order: columnCounters[column]++,
      column,
      visible: true,
      showIcon: true,
      data: SAMPLE_DATA[type] ?? { type: "custom", heading: type, text: "" },
    })),
    favorite: false,
    isDraft: true,
    createdAt: now,
    updatedAt: now,
    lastOpenedAt: now,
  };
}

const SAMPLE_TITLES: Partial<Record<SectionType, string>> = {
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
  summary: "Summary",
  contact: "Contact",
  social: "Social",
};
