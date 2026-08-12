import { jsPDF } from "jspdf";
import html2canvas from "html2canvas-pro";
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from "docx";
import { downloadBlob } from "@/lib/generator/export";
import { db } from "./db";
import { uid } from "./id";
import { PAGE_SIZE_PX } from "@/components/resume/shared/resume-renderer";
import type { Resume, ResumeSectionInstance, SectionData } from "./types";

function slug(name: string): string {
  return name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "resume";
}

// ---------------------------------------------------------------------------
// PDF — captures the rendered DOM at full resolution and slices it into pages
// sized to the resume's own page size, so overflowing content spans multiple
// PDF pages instead of being cut off.
// ---------------------------------------------------------------------------

const PDF_SCALE = 2;

export async function exportResumeToPDF(pageEl: HTMLElement, resume: Resume): Promise<void> {
  const page = PAGE_SIZE_PX[resume.layout.pageSize];
  const canvas = await html2canvas(pageEl, {
    scale: PDF_SCALE,
    backgroundColor: resume.theme.backgroundColor,
    useCORS: true,
    windowWidth: page.width,
  });

  const pageHeightPx = page.height * PDF_SCALE;
  const totalPages = Math.max(1, Math.ceil(canvas.height / pageHeightPx));
  const pdf = new jsPDF({ unit: "px", format: [page.width, page.height], hotfixes: ["px_scaling"] });

  for (let i = 0; i < totalPages; i++) {
    if (i > 0) pdf.addPage([page.width, page.height]);
    const sliceHeight = Math.min(pageHeightPx, canvas.height - i * pageHeightPx);
    const sliceCanvas = document.createElement("canvas");
    sliceCanvas.width = canvas.width;
    sliceCanvas.height = sliceHeight;
    const ctx = sliceCanvas.getContext("2d");
    if (!ctx) continue;
    ctx.drawImage(canvas, 0, i * pageHeightPx, canvas.width, sliceHeight, 0, 0, canvas.width, sliceHeight);
    // JPEG over PNG: this is a flat, text-heavy document, so PNG's lossless encoding mostly
    // spends bytes on font-antialiasing noise — JPEG at high quality looks identical here and
    // keeps the file well under typical job-portal upload caps (PNG output ran 10MB+).
    pdf.addImage(sliceCanvas.toDataURL("image/jpeg", 0.92), "JPEG", 0, 0, page.width, sliceHeight / PDF_SCALE);
  }

  pdf.save(`${slug(resume.name)}.pdf`);
}

// ---------------------------------------------------------------------------
// DOCX — built directly from section data (not the rendered DOM) so the
// output stays text-selectable and ATS-parseable rather than an image.
// ---------------------------------------------------------------------------

function itemsToLines(data: SectionData): string[] {
  switch (data.type) {
    case "summary":
      return data.text.split("\n");
    case "contact":
      return [[data.email, data.phone, data.location, data.website].filter(Boolean).join("  |  ")];
    case "social":
      return data.links.map((l) => `${l.label}: ${l.url}`);
    case "skills":
    case "technicalSkills":
    case "softSkills":
      return [data.items.map((s) => s.name).filter(Boolean).join(", ")];
    case "experience":
      return data.items.flatMap((i) => [
        `${i.role}${i.role && i.company ? " — " : ""}${i.company}`,
        [i.location, `${i.startDate || ""} – ${i.current ? "Present" : i.endDate || ""}`].filter(Boolean).join("   "),
        ...i.bullets.filter(Boolean).map((b) => `•  ${b}`),
        "",
      ]);
    case "education":
      return data.items.flatMap((i) => [
        `${i.degree}${i.degree && i.field ? ", " : ""}${i.field}${i.school ? " — " + i.school : ""}`,
        [`${i.startDate || ""} – ${i.endDate || ""}`, i.gpa && `GPA: ${i.gpa}`].filter(Boolean).join("   "),
        "",
      ]);
    case "projects":
      return data.items.flatMap((i) => [
        [i.name, i.link].filter(Boolean).join("  —  "),
        i.description,
        ...i.bullets.filter(Boolean).map((b) => `•  ${b}`),
        "",
      ].filter(Boolean));
    case "certifications":
      return data.items.map((i) => [i.name, i.issuer, i.date, i.link].filter(Boolean).join("  —  "));
    case "awards":
      return data.items.flatMap((i) => [[i.title, i.issuer, i.date].filter(Boolean).join("  —  "), i.description].filter(Boolean));
    case "publications":
      return data.items.map((i) => [i.title, i.publisher, i.date, i.link].filter(Boolean).join("  —  "));
    case "languages":
      return data.items.map((i) => [i.name, i.level].filter(Boolean).join(" — "));
    case "references":
      return data.items.map((i) => [i.name, i.relation, i.contact].filter(Boolean).join("  —  "));
    case "interests":
      return [data.items.join(", ")];
    case "custom":
      return data.text.split("\n");
    default:
      return [];
  }
}

function sectionParagraphs(section: ResumeSectionInstance): Paragraph[] {
  const heading = section.type === "custom" && section.data.type === "custom" ? section.data.heading || section.title : section.title;
  const lines = itemsToLines(section.data).filter((l) => l !== undefined);
  if (lines.every((l) => !l.trim())) return [];
  return [
    new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 80 }, children: [new TextRun({ text: heading.toUpperCase(), bold: true })] }),
    ...lines.map((line) => new Paragraph({ text: line, spacing: { after: 40 } })),
  ];
}

export async function exportResumeToDocx(resume: Resume): Promise<void> {
  const byType = new Map(resume.sections.map((s) => [s.type, s]));
  const nameData = byType.get("name")?.data;
  const titleData = byType.get("title")?.data;

  const children: Paragraph[] = [];
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      children: [new TextRun({ text: nameData?.type === "name" ? nameData.fullName || "Your Name" : "Your Name", bold: true, size: 44 })],
    })
  );
  if (titleData?.type === "title" && titleData.text) {
    children.push(new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [new TextRun({ text: titleData.text, italics: true, size: 24 })] }));
  }

  const body = resume.sections
    .filter((s) => s.visible && s.type !== "name" && s.type !== "title" && s.type !== "photo")
    .sort((a, b) => a.column - b.column || a.order - b.order);

  for (const section of body) children.push(...sectionParagraphs(section));

  const doc = new Document({ sections: [{ children }] });
  const blob = await Packer.toBlob(doc);
  downloadBlob(blob, `${slug(resume.name)}.docx`, "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
}

// ---------------------------------------------------------------------------
// JSON import / export
// ---------------------------------------------------------------------------

export function exportResumeAsJSON(resume: Resume): void {
  downloadBlob(JSON.stringify(resume, null, 2), `${slug(resume.name)}.json`, "application/json");
}

export async function importResumeFromJSON(file: File): Promise<Resume> {
  const text = await file.text();
  const parsed = JSON.parse(text) as Partial<Resume>;
  if (!parsed || typeof parsed !== "object" || !Array.isArray(parsed.sections) || !parsed.layout || !parsed.theme) {
    throw new Error("This file doesn't look like a resume export.");
  }
  const now = Date.now();
  const resume: Resume = {
    ...parsed,
    id: uid(),
    name: parsed.name ? `${parsed.name} (Imported)` : "Imported Resume",
    sections: parsed.sections.map((s) => ({ ...s, id: uid() })),
    favorite: false,
    isDraft: true,
    createdAt: now,
    updatedAt: now,
    lastOpenedAt: now,
  } as Resume;
  await db.resumes.add(resume);
  return resume;
}
