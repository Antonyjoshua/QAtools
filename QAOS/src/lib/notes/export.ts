import { Editor, generateHTML, type JSONContent } from "@tiptap/core";
import { Markdown } from "tiptap-markdown";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { baseExtensions } from "./editor-extensions";
import { FileEmbedSchema } from "@/components/notes/editor/extensions/file-embed-schema";
import { db } from "./db";
import type { Note } from "./types";

function extensionsForExport() {
  return [...baseExtensions(), FileEmbedSchema];
}

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

export function noteToMarkdown(note: Note): string {
  const editor = new Editor({
    extensions: [...extensionsForExport(), Markdown],
    content: note.contentJSON,
  });
  const md = (editor.storage as unknown as { markdown: { getMarkdown: () => string } }).markdown.getMarkdown();
  editor.destroy();
  return `# ${note.title}\n\n${md}`;
}

export function markdownToJSON(markdown: string): JSONContent {
  const editor = new Editor({
    extensions: [...extensionsForExport(), Markdown],
    content: markdown,
  });
  const json = editor.getJSON();
  editor.destroy();
  return json;
}

async function blobToDataURL(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

async function embedAttachments(html: string): Promise<string> {
  const parser = new DOMParser();
  const docEl = parser.parseFromString(html, "text/html");
  const embeds = Array.from(docEl.querySelectorAll('div[data-type="file-embed"]'));
  for (const el of embeds) {
    const attachmentId = el.getAttribute("data-attachment-id");
    const filename = el.getAttribute("data-filename") ?? "attachment";
    const mimeType = el.getAttribute("data-mime-type") ?? "";
    if (!attachmentId) continue;
    const attachment = await db.attachments.get(attachmentId);
    if (!attachment) {
      el.outerHTML = `<p><em>Missing attachment: ${filename}</em></p>`;
      continue;
    }
    const dataUrl = await blobToDataURL(attachment.blob);
    if (mimeType.startsWith("image/")) {
      el.outerHTML = `<img src="${dataUrl}" alt="${filename}" style="max-width:100%;border-radius:8px;border:1px solid #ddd;" />`;
    } else if (mimeType.startsWith("video/")) {
      el.outerHTML = `<video src="${dataUrl}" controls style="max-width:100%;border-radius:8px;"></video>`;
    } else {
      el.outerHTML = `<p>📎 <a href="${dataUrl}" download="${filename}">${filename}</a></p>`;
    }
  }
  return docEl.body.innerHTML;
}

export async function noteToHTMLDocument(note: Note): Promise<string> {
  const rawHtml = generateHTML(note.contentJSON, extensionsForExport());
  const bodyHtml = await embedAttachments(rawHtml);
  return `<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>${escapeHtml(note.title)}</title>
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; max-width: 820px; margin: 40px auto; padding: 0 24px; color: #1a1a1a; line-height: 1.65; }
  h1, h2, h3 { letter-spacing: -0.01em; }
  table { border-collapse: collapse; width: 100%; }
  th, td { border: 1px solid #ddd; padding: 8px 10px; text-align: left; }
  th { background: #f5f5f5; }
  pre { background: #f5f5f5; padding: 14px 16px; border-radius: 8px; overflow-x: auto; }
  code { background: #f0f0f0; padding: 2px 5px; border-radius: 4px; }
  pre code { background: none; padding: 0; }
  blockquote { border-left: 3px solid #999; margin-left: 0; padding-left: 16px; color: #555; }
  ul[data-type="taskList"] { list-style: none; padding-left: 0; }
</style>
</head>
<body>
<h1>${escapeHtml(note.title)}</h1>
${bodyHtml}
</body>
</html>`;
}

function escapeHtml(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// ---------- PDF (structural, walks JSON directly) ----------
export async function downloadNoteAsPDF(note: Note): Promise<void> {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const marginX = 48;
  let y = 56;
  const pageHeight = doc.internal.pageSize.getHeight();
  const maxWidth = doc.internal.pageSize.getWidth() - marginX * 2;

  function ensureSpace(lineHeight: number) {
    if (y + lineHeight > pageHeight - 48) {
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
  writeText(note.title, 22, "bold", 16);

  async function walk(node: JSONContent) {
    switch (node.type) {
      case "heading": {
        const level = (node.attrs?.level as number) ?? 1;
        const size = level === 1 ? 17 : level === 2 ? 14.5 : 12.5;
        writeText(extractPlain(node), size, "bold", 8);
        break;
      }
      case "paragraph":
        writeText(extractPlain(node) || " ", 10.5, "normal", 8);
        break;
      case "bulletList":
      case "orderedList":
      case "taskList":
        for (const [i, item] of (node.content ?? []).entries()) {
          const prefix = node.type === "orderedList" ? `${i + 1}. ` : node.type === "taskList" ? (item.attrs?.checked ? "☑ " : "☐ ") : "•  ";
          writeText(`${prefix}${extractPlain(item)}`, 10.5, "normal", 4);
        }
        y += 4;
        break;
      case "blockquote":
        writeText(extractPlain(node), 10.5, "italic", 8);
        break;
      case "codeBlock": {
        const code = extractPlain(node);
        doc.setFillColor(245, 245, 245);
        const lines = doc.splitTextToSize(code, maxWidth - 16) as string[];
        const blockHeight = lines.length * 12 + 12;
        ensureSpace(blockHeight);
        doc.rect(marginX, y - 10, maxWidth, blockHeight, "F");
        doc.setFont("courier", "normal");
        doc.setFontSize(9);
        let cy = y;
        for (const line of lines) {
          doc.text(line, marginX + 8, cy);
          cy += 12;
        }
        y = cy + 10;
        break;
      }
      case "table": {
        const rows = (node.content ?? []).map((row) => (row.content ?? []).map((cell) => extractPlain(cell)));
        const [header, ...body] = rows;
        autoTable(doc, {
          startY: y,
          head: header ? [header] : undefined,
          body,
          styles: { fontSize: 9, cellPadding: 5 },
          headStyles: { fillColor: [21, 128, 106] },
          margin: { left: marginX, right: marginX },
        });
        y = (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 16;
        break;
      }
      case "horizontalRule":
        ensureSpace(20);
        doc.setDrawColor(200, 200, 200);
        doc.line(marginX, y, marginX + maxWidth, y);
        y += 16;
        break;
      case "fileEmbed": {
        const filename = (node.attrs?.filename as string) ?? "attachment";
        const mimeType = (node.attrs?.mimeType as string) ?? "";
        const attachmentId = node.attrs?.attachmentId as string | undefined;
        if (attachmentId && mimeType.startsWith("image/")) {
          const attachment = await db.attachments.get(attachmentId);
          if (attachment) {
            try {
              const dataUrl = await blobToDataURL(attachment.blob);
              const format = mimeType.includes("png") ? "PNG" : mimeType.includes("webp") ? "WEBP" : "JPEG";
              const dims = await getImageDimensions(dataUrl);
              const w = Math.min(maxWidth, dims.width);
              const h = (dims.height / dims.width) * w;
              ensureSpace(h + 12);
              doc.addImage(dataUrl, format, marginX, y, w, h, undefined, "FAST");
              y += h + 14;
              break;
            } catch {
              /* fall through to filename text */
            }
          }
        }
        writeText(`📎 ${filename}`, 10, "italic", 8);
        break;
      }
      default:
        if (node.content) {
          for (const child of node.content) await walk(child);
        }
    }
  }

  for (const child of note.contentJSON.content ?? []) {
    await walk(child);
  }

  doc.save(`${sanitizeFilename(note.title)}.pdf`);
}

function extractPlain(node: JSONContent): string {
  if (node.text) return node.text;
  if (!node.content) return "";
  return node.content.map(extractPlain).join(node.type === "paragraph" ? "" : " ");
}

function getImageDimensions(dataUrl: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = reject;
    img.src = dataUrl;
  });
}

export function sanitizeFilename(name: string): string {
  return name.replace(/[^a-z0-9\-_ ]+/gi, "").trim().replace(/\s+/g, "-").slice(0, 80) || "note";
}
