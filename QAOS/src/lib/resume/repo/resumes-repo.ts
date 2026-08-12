import { db } from "../db";
import { uid } from "../id";
import { getTemplate } from "../templates/registry";
import { createSectionInstance, SECTION_LABELS } from "../section-defaults";
import type { Resume, ResumeLayout, ResumeTheme, SectionType } from "../types";
import { buildTheme } from "../templates/theme-presets";

const BLANK_LAYOUT: ResumeLayout = { columns: 1, columnRatio: 1, pageSize: "a4", headerLayout: "stacked" };
const BLANK_THEME: ResumeTheme = buildTheme({});
const BLANK_SECTIONS: SectionType[] = ["name", "title", "contact", "summary", "experience", "education", "skills"];

export async function createResumeFromTemplate(templateId: string, name?: string): Promise<Resume> {
  const template = getTemplate(templateId);
  if (!template) throw new Error(`Unknown template: ${templateId}`);
  const now = Date.now();
  const columnCounters: Record<0 | 1, number> = { 0: 0, 1: 0 };
  const resume: Resume = {
    id: uid(),
    name: name?.trim() || `${template.name} Resume`,
    mode: "template",
    templateId: template.id,
    layout: { ...template.layout },
    theme: { ...template.theme },
    sections: template.sections.map(({ type, column }) => createSectionInstance(type, column, columnCounters[column]++)),
    favorite: false,
    isDraft: true,
    createdAt: now,
    updatedAt: now,
    lastOpenedAt: now,
  };
  await db.resumes.add(resume);
  return resume;
}

export async function createBlankResume(name = "Untitled Resume"): Promise<Resume> {
  const now = Date.now();
  const resume: Resume = {
    id: uid(),
    name,
    mode: "custom",
    templateId: null,
    layout: { ...BLANK_LAYOUT },
    theme: { ...BLANK_THEME },
    sections: BLANK_SECTIONS.map((type, i) => createSectionInstance(type, 0, i)),
    favorite: false,
    isDraft: true,
    createdAt: now,
    updatedAt: now,
    lastOpenedAt: now,
  };
  await db.resumes.add(resume);
  return resume;
}

export async function updateResume(id: string, patch: Partial<Resume>): Promise<void> {
  await db.resumes.update(id, { ...patch, updatedAt: Date.now() });
}

/** Overwrites the full resume record — used to restore an undo/redo snapshot. */
export async function restoreResume(snapshot: Resume): Promise<void> {
  await db.resumes.put({ ...snapshot, updatedAt: Date.now() });
}

export async function touchResumeOpened(id: string): Promise<void> {
  await db.resumes.update(id, { lastOpenedAt: Date.now() });
}

export async function duplicateResume(id: string): Promise<Resume | null> {
  const original = await db.resumes.get(id);
  if (!original) return null;
  const now = Date.now();
  const copy: Resume = {
    ...original,
    id: uid(),
    name: `${original.name} (Copy)`,
    sections: original.sections.map((s) => ({ ...s, id: uid() })),
    createdAt: now,
    updatedAt: now,
    lastOpenedAt: now,
  };
  await db.resumes.add(copy);
  return copy;
}

export async function deleteResume(id: string): Promise<void> {
  await db.transaction("rw", [db.resumes, db.attachments, db.history], async () => {
    await db.resumes.delete(id);
    await db.attachments.where("resumeId").equals(id).delete();
    await db.history.where("resumeId").equals(id).delete();
  });
}

export async function toggleResumeFavorite(id: string): Promise<void> {
  const resume = await db.resumes.get(id);
  if (!resume) return;
  await db.resumes.update(id, { favorite: !resume.favorite });
}

/** Switches templates while carrying over any existing data for matching section types. */
export async function switchTemplate(id: string, templateId: string): Promise<void> {
  const resume = await db.resumes.get(id);
  const template = getTemplate(templateId);
  if (!resume || !template) return;

  const dataByType = new Map(resume.sections.map((s) => [s.type, s]));
  const columnCounters: Record<0 | 1, number> = { 0: 0, 1: 0 };
  const sections = template.sections.map(({ type, column }) => {
    const existing = dataByType.get(type);
    const order = columnCounters[column]++;
    if (existing) return { ...existing, column, order, title: existing.title || SECTION_LABELS[type] };
    return createSectionInstance(type, column, order);
  });

  await db.resumes.update(id, {
    templateId: template.id,
    mode: "template",
    layout: { ...template.layout },
    theme: { ...template.theme },
    sections,
    updatedAt: Date.now(),
  });
}
