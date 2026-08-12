import { Editor, generateHTML, type JSONContent } from "@tiptap/core";
import { Markdown } from "tiptap-markdown";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, BorderStyle } from "docx";
import { baseExtensions } from "./editor-extensions";
import { jsonToDocxParagraphs } from "./docx-convert";
import type { BugReport } from "./types";
import { uid } from "./id";
import { db } from "./db";

export interface BugExportContext {
  projectName: string;
  moduleName: string;
  featureName: string;
}

const SECTIONS: { key: keyof BugReport; label: string }[] = [
  { key: "description", label: "Description" },
  { key: "preconditions", label: "Preconditions" },
  { key: "stepsToReproduce", label: "Steps to Reproduce" },
  { key: "expectedResult", label: "Expected Result" },
  { key: "actualResult", label: "Actual Result" },
  { key: "observedBehaviour", label: "Observed Behaviour" },
  { key: "additionalNotes", label: "Additional Notes" },
];

export function downloadBlob(content: BlobPart, filename: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function sanitizeFilename(name: string): string {
  return name.replace(/[^a-z0-9\-_ ]+/gi, "").trim().replace(/\s+/g, "-").slice(0, 80) || "bug-report";
}

function metadataRows(bug: BugReport, ctx: BugExportContext): [string, string][] {
  return [
    ["Bug ID", bug.displayId],
    ["Project", ctx.projectName || "—"],
    ["Module", ctx.moduleName || "—"],
    ["Feature", ctx.featureName || "—"],
    ["Build Version", bug.buildVersion || "—"],
    ["Environment", bug.environment || "—"],
    ["Platform", bug.platform || "—"],
    ["Browser", `${bug.browser || "—"} ${bug.browserVersion}`.trim()],
    ["Device", bug.device || "—"],
    ["OS", bug.os || "—"],
    ["Reporter", bug.reporter || "—"],
    ["Severity", bug.severity ?? "—"],
    ["Priority", bug.priority ?? "—"],
    ["Category", bug.category ?? "—"],
    ["Status", bug.status],
    ["Labels", bug.labels.join(", ") || "—"],
  ];
}

// ---------- Markdown ----------
function jsonToMarkdown(json: JSONContent): string {
  const editor = new Editor({ extensions: [...baseExtensions(), Markdown], content: json });
  const md = (editor.storage as unknown as { markdown: { getMarkdown: () => string } }).markdown.getMarkdown();
  editor.destroy();
  return md;
}

export function bugToMarkdown(bug: BugReport, ctx: BugExportContext): string {
  const lines: string[] = [`# ${bug.displayId} — ${bug.title || "Untitled"}`, ""];
  lines.push("| Field | Value |", "|---|---|");
  for (const [k, v] of metadataRows(bug, ctx)) lines.push(`| ${k} | ${v} |`);
  lines.push("");
  for (const s of SECTIONS) {
    lines.push(`## ${s.label}`, "", jsonToMarkdown(bug[s.key] as JSONContent), "");
  }
  return lines.join("\n");
}

// ---------- HTML ----------
function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export async function bugToHTMLDocument(bug: BugReport, ctx: BugExportContext): Promise<string> {
  const metaRows = metadataRows(bug, ctx)
    .map(([k, v]) => `<tr><th>${escapeHtml(k)}</th><td>${escapeHtml(v)}</td></tr>`)
    .join("");
  const sections = SECTIONS.map((s) => {
    const html = generateHTML(bug[s.key] as JSONContent, baseExtensions());
    return `<h2>${escapeHtml(s.label)}</h2>${html}`;
  }).join("\n");

  return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>${escapeHtml(bug.displayId)} — ${escapeHtml(bug.title)}</title>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; max-width: 860px; margin: 40px auto; padding: 0 24px; color: #1a1a1a; line-height: 1.65; }
  h1 { letter-spacing: -0.01em; }
  h2 { margin-top: 2em; border-bottom: 2px solid #eee; padding-bottom: 4px; }
  table { border-collapse: collapse; width: 100%; margin: 16px 0; }
  th, td { border: 1px solid #ddd; padding: 6px 10px; text-align: left; font-size: 14px; }
  th { background: #f5f5f5; width: 180px; }
  pre { background: #f5f5f5; padding: 12px 14px; border-radius: 8px; overflow-x: auto; }
  code { background: #f0f0f0; padding: 2px 5px; border-radius: 4px; }
</style>
</head>
<body>
<h1>${escapeHtml(bug.displayId)} — ${escapeHtml(bug.title || "Untitled")}</h1>
<table>${metaRows}</table>
${sections}
</body>
</html>`;
}

// ---------- JSON ----------
export function bugToJSON(bug: BugReport, ctx: BugExportContext): string {
  return JSON.stringify(
    {
      ...bug,
      project: ctx.projectName,
      module: ctx.moduleName,
      feature: ctx.featureName,
      sections: Object.fromEntries(SECTIONS.map((s) => [s.key, jsonToMarkdown(bug[s.key] as JSONContent)])),
    },
    null,
    2
  );
}

// ---------- PDF ----------
function extractPlain(node: JSONContent): string {
  if (node.text) return node.text;
  if (!node.content) return "";
  return node.content.map(extractPlain).join(node.type === "paragraph" ? "" : " ");
}

export function downloadBugAsPDF(bug: BugReport, ctx: BugExportContext): void {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const marginX = 48;
  let y = 56;
  const pageHeight = doc.internal.pageSize.getHeight();
  const maxWidth = doc.internal.pageSize.getWidth() - marginX * 2;

  function ensureSpace(h: number) {
    if (y + h > pageHeight - 48) {
      doc.addPage();
      y = 56;
    }
  }
  function writeText(text: string, size: number, style: "normal" | "bold" | "italic" = "normal", gap = 6) {
    doc.setFont("helvetica", style);
    doc.setFontSize(size);
    const lines = doc.splitTextToSize(text, maxWidth) as string[];
    for (const line of lines) {
      ensureSpace(size * 1.3);
      doc.text(line, marginX, y);
      y += size * 1.3;
    }
    y += gap;
  }

  doc.setTextColor(20, 20, 20);
  writeText(`${bug.displayId} — ${bug.title || "Untitled"}`, 18, "bold", 12);

  autoTable(doc, {
    startY: y,
    body: metadataRows(bug, ctx),
    styles: { fontSize: 9, cellPadding: 5 },
    columnStyles: { 0: { fontStyle: "bold", cellWidth: 130 } },
    theme: "grid",
    margin: { left: marginX, right: marginX },
  });
  y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 20;

  function walk(node: JSONContent) {
    switch (node.type) {
      case "heading":
        writeText(extractPlain(node), 13, "bold", 6);
        break;
      case "paragraph":
        writeText(extractPlain(node) || " ", 10, "normal", 6);
        break;
      case "bulletList":
      case "orderedList":
      case "taskList":
        (node.content ?? []).forEach((item, i) => {
          const prefix = node.type === "orderedList" ? `${i + 1}. ` : node.type === "taskList" ? (item.attrs?.checked ? "[x] " : "[ ] ") : "•  ";
          writeText(`${prefix}${extractPlain(item)}`, 10, "normal", 3);
        });
        y += 4;
        break;
      case "codeBlock":
        writeText(extractPlain(node), 9, "normal", 6);
        break;
      default:
        if (node.content) node.content.forEach(walk);
    }
  }

  for (const s of SECTIONS) {
    ensureSpace(30);
    writeText(s.label, 13, "bold", 4);
    doc.setDrawColor(220, 220, 220);
    doc.line(marginX, y - 10, marginX + maxWidth, y - 10);
    for (const child of ((bug[s.key] as JSONContent).content ?? [])) walk(child);
    y += 6;
  }

  doc.save(`${sanitizeFilename(bug.displayId + "-" + bug.title)}.pdf`);
}

// ---------- DOCX ----------
export async function downloadBugAsDOCX(bug: BugReport, ctx: BugExportContext): Promise<void> {
  const rows = metadataRows(bug, ctx).map(
    ([k, v]) =>
      new TableRow({
        children: [
          new TableCell({ width: { size: 25, type: WidthType.PERCENTAGE }, children: [new Paragraph({ children: [new TextRun({ text: k, bold: true })] })] }),
          new TableCell({ width: { size: 75, type: WidthType.PERCENTAGE }, children: [new Paragraph({ text: v })] }),
        ],
      })
  );

  const sectionParagraphs = SECTIONS.flatMap((s) => [
    new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 300 }, children: [new TextRun({ text: s.label })] }),
    ...jsonToDocxParagraphs(bug[s.key] as JSONContent),
  ]);

  const document = new Document({
    sections: [
      {
        children: [
          new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun({ text: `${bug.displayId} — ${bug.title || "Untitled"}` })] }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: {
              top: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
              bottom: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
              left: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
              right: { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" },
              insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "EEEEEE" },
              insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "EEEEEE" },
            },
            rows,
          }),
          ...sectionParagraphs,
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(document);
  downloadBlob(blob, `${sanitizeFilename(bug.displayId + "-" + bug.title)}.docx`, "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
}

// ---------- Export history tracking ----------
export async function recordExport(bug: BugReport, format: "pdf" | "docx" | "markdown" | "html" | "json" | "print"): Promise<void> {
  await db.exportHistory.add({
    id: uid(),
    bugId: bug.id,
    bugDisplayId: bug.displayId,
    format,
    createdAt: Date.now(),
  });
}
