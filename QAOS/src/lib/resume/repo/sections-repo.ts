import { db } from "../db";
import { createSectionInstance } from "../section-defaults";
import type { ResumeSectionInstance, SectionData, SectionType } from "../types";

async function mutateSections(resumeId: string, mutate: (sections: ResumeSectionInstance[]) => ResumeSectionInstance[]): Promise<void> {
  const resume = await db.resumes.get(resumeId);
  if (!resume) return;
  await db.resumes.update(resumeId, { sections: mutate(resume.sections), updatedAt: Date.now() });
}

export async function addSection(resumeId: string, type: SectionType, column: 0 | 1 = 0): Promise<void> {
  await mutateSections(resumeId, (sections) => {
    const order = sections.filter((s) => s.column === column).length;
    return [...sections, createSectionInstance(type, column, order)];
  });
}

export async function removeSection(resumeId: string, sectionId: string): Promise<void> {
  await mutateSections(resumeId, (sections) => sections.filter((s) => s.id !== sectionId));
}

export async function updateSectionData(resumeId: string, sectionId: string, data: SectionData): Promise<void> {
  await mutateSections(resumeId, (sections) => sections.map((s) => (s.id === sectionId ? { ...s, data } : s)));
}

export async function updateSectionMeta(
  resumeId: string,
  sectionId: string,
  patch: Partial<Pick<ResumeSectionInstance, "title" | "visible" | "showIcon">>
): Promise<void> {
  await mutateSections(resumeId, (sections) => sections.map((s) => (s.id === sectionId ? { ...s, ...patch } : s)));
}

/** Reorders sections within a single column, given the new ordered id list for that column. */
export async function reorderSectionsInColumn(resumeId: string, column: 0 | 1, orderedIds: string[]): Promise<void> {
  await mutateSections(resumeId, (sections) =>
    sections.map((s) => {
      if (s.column !== column) return s;
      const order = orderedIds.indexOf(s.id);
      return order === -1 ? s : { ...s, order };
    })
  );
}

/** Moves a section into a different column, appending it at the end of that column's order. */
export async function moveSectionToColumn(resumeId: string, sectionId: string, column: 0 | 1): Promise<void> {
  await mutateSections(resumeId, (sections) => {
    const targetCount = sections.filter((s) => s.column === column && s.id !== sectionId).length;
    return sections.map((s) => (s.id === sectionId ? { ...s, column, order: targetCount } : s));
  });
}
