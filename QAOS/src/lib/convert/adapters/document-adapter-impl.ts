import * as mammoth from "mammoth";
import type { ConversionAdapter, ConversionRequest, ConversionResult, ProgressCallback } from "../core/types";

function baseName(fileName: string): string {
  return fileName.replace(/\.[^.]+$/, "");
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function inlineMarkdown(text: string): string {
  let t = escapeHtml(text);
  t = t.replace(/`([^`]+)`/g, "<code>$1</code>");
  t = t.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  t = t.replace(/\*([^*]+)\*/g, "<em>$1</em>");
  t = t.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  return t;
}

/** A small, dependency-free markdown-to-HTML converter — covers headings, bold/italic, inline
 * code, code fences, links, and lists, which is enough fidelity for typical README-style docs. */
function markdownToHtml(md: string): string {
  const lines = md.split("\n");
  const out: string[] = [];
  let inList = false;
  let inCode = false;

  for (const line of lines) {
    if (line.trim().startsWith("```")) {
      inCode = !inCode;
      out.push(inCode ? "<pre><code>" : "</code></pre>");
      continue;
    }
    if (inCode) {
      out.push(escapeHtml(line));
      continue;
    }
    const heading = line.match(/^(#{1,6})\s+(.*)$/);
    if (heading) {
      if (inList) {
        out.push("</ul>");
        inList = false;
      }
      out.push(`<h${heading[1].length}>${inlineMarkdown(heading[2])}</h${heading[1].length}>`);
      continue;
    }
    const listItem = line.match(/^[-*]\s+(.*)$/);
    if (listItem) {
      if (!inList) {
        out.push("<ul>");
        inList = true;
      }
      out.push(`<li>${inlineMarkdown(listItem[1])}</li>`);
      continue;
    }
    if (inList) {
      out.push("</ul>");
      inList = false;
    }
    out.push(line.trim() === "" ? "" : `<p>${inlineMarkdown(line)}</p>`);
  }
  if (inList) out.push("</ul>");
  return out.join("\n");
}

async function htmlToPdfBlob(html: string, onProgress: ProgressCallback): Promise<Blob> {
  const html2canvas = (await import("html2canvas-pro")).default;
  const { jsPDF } = await import("jspdf");

  const PAGE_WIDTH = 794; // A4 @ 96dpi
  const PAGE_HEIGHT = 1123;
  const MARGIN = 48;
  const SCALE = 2;

  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.left = "-99999px";
  container.style.top = "0";
  container.style.width = `${PAGE_WIDTH - MARGIN * 2}px`;
  container.style.padding = `${MARGIN}px`;
  container.style.background = "#ffffff";
  container.style.color = "#111827";
  container.style.fontFamily = "Arial, Helvetica, sans-serif";
  container.style.fontSize = "13px";
  container.style.lineHeight = "1.6";
  container.innerHTML = html;
  document.body.appendChild(container);

  onProgress({ stage: "converting", percent: 45, message: "Rendering…" });
  let canvas: HTMLCanvasElement;
  try {
    canvas = await html2canvas(container, { scale: SCALE, backgroundColor: "#ffffff", windowWidth: PAGE_WIDTH });
  } finally {
    document.body.removeChild(container);
  }

  const pageHeightPx = PAGE_HEIGHT * SCALE;
  const totalPages = Math.max(1, Math.ceil(canvas.height / pageHeightPx));
  const pdf = new jsPDF({ unit: "px", format: [PAGE_WIDTH, PAGE_HEIGHT], hotfixes: ["px_scaling"] });

  onProgress({ stage: "finalizing", percent: 80, message: "Building PDF…" });
  for (let i = 0; i < totalPages; i++) {
    if (i > 0) pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    const sliceHeight = Math.min(pageHeightPx, canvas.height - i * pageHeightPx);
    const sliceCanvas = document.createElement("canvas");
    sliceCanvas.width = canvas.width;
    sliceCanvas.height = sliceHeight;
    const ctx = sliceCanvas.getContext("2d");
    if (!ctx) continue;
    ctx.drawImage(canvas, 0, i * pageHeightPx, canvas.width, sliceHeight, 0, 0, canvas.width, sliceHeight);
    pdf.addImage(sliceCanvas.toDataURL("image/jpeg", 0.92), "JPEG", 0, 0, PAGE_WIDTH, sliceHeight / SCALE);
  }

  return pdf.output("blob");
}

async function textToPdfBlob(text: string): Promise<Blob> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 48;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const lines = doc.splitTextToSize(text, pageWidth - margin * 2) as string[];
  doc.setFontSize(11);
  let y = margin;
  const lineHeight = 14;
  for (const line of lines) {
    if (y > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
    doc.text(line, margin, y);
    y += lineHeight;
  }
  return doc.output("blob");
}

export const documentAdapter: ConversionAdapter = {
  id: "document",
  async convert(request: ConversionRequest, onProgress: ProgressCallback): Promise<ConversionResult> {
    const start = Date.now();
    const file = request.files[0];
    const pair = `${request.inputFormat}->${request.outputFormat}`;

    try {
      onProgress({ stage: "processing", percent: 10, message: "Reading document…" });
      let blob: Blob;
      let outName: string;

      if (pair === "docx->html") {
        const { value: html } = await mammoth.convertToHtml({ arrayBuffer: await file.arrayBuffer() });
        onProgress({ stage: "converting", percent: 70 });
        blob = new Blob([`<!doctype html><html><head><meta charset="utf-8"></head><body>${html}</body></html>`], { type: "text/html" });
        outName = `${baseName(file.name)}.html`;
      } else if (pair === "docx->txt") {
        const { value: text } = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
        onProgress({ stage: "converting", percent: 70 });
        blob = new Blob([text], { type: "text/plain" });
        outName = `${baseName(file.name)}.txt`;
      } else if (pair === "docx->pdf") {
        const { value: html } = await mammoth.convertToHtml({ arrayBuffer: await file.arrayBuffer() });
        blob = await htmlToPdfBlob(html, onProgress);
        outName = `${baseName(file.name)}.pdf`;
      } else if (pair === "html->pdf") {
        const html = await file.text();
        blob = await htmlToPdfBlob(html, onProgress);
        outName = `${baseName(file.name)}.pdf`;
      } else if (pair === "md->pdf") {
        const md = await file.text();
        blob = await htmlToPdfBlob(markdownToHtml(md), onProgress);
        outName = `${baseName(file.name)}.pdf`;
      } else if (pair === "txt->pdf") {
        const text = await file.text();
        onProgress({ stage: "converting", percent: 50 });
        blob = await textToPdfBlob(text);
        outName = `${baseName(file.name)}.pdf`;
      } else {
        throw new Error("unsupported-conversion");
      }

      onProgress({ stage: "completed", percent: 100 });
      return { success: true, outputs: [{ name: outName, blob, format: request.outputFormat }], durationMs: Date.now() - start };
    } catch {
      return {
        success: false,
        outputs: [],
        durationMs: Date.now() - start,
        error: { code: "corrupted-file", message: "This document couldn't be converted. It may be corrupted or use unsupported formatting." },
      };
    }
  },
};
