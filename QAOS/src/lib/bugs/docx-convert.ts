import type { JSONContent } from "@tiptap/core";
import { Paragraph, TextRun, HeadingLevel } from "docx";

function runsFromInline(node: JSONContent): TextRun[] {
  if (!node.text) return [];
  const marks = node.marks ?? [];
  const bold = marks.some((m) => m.type === "bold");
  const italics = marks.some((m) => m.type === "italic");
  const underline = marks.some((m) => m.type === "underline") ? {} : undefined;
  const code = marks.some((m) => m.type === "code");
  return [
    new TextRun({
      text: node.text,
      bold,
      italics,
      underline,
      font: code ? "Courier New" : undefined,
    }),
  ];
}

function inlineRuns(content: JSONContent[] | undefined): TextRun[] {
  if (!content) return [];
  return content.flatMap((c) => runsFromInline(c));
}

export function jsonToDocxParagraphs(doc: JSONContent, prefix = ""): Paragraph[] {
  const out: Paragraph[] = [];
  for (const node of doc.content ?? []) {
    switch (node.type) {
      case "heading": {
        const level = (node.attrs?.level as number) ?? 1;
        const headingMap: Record<number, (typeof HeadingLevel)[keyof typeof HeadingLevel]> = {
          1: HeadingLevel.HEADING_1,
          2: HeadingLevel.HEADING_2,
          3: HeadingLevel.HEADING_3,
        };
        out.push(new Paragraph({ heading: headingMap[level] ?? HeadingLevel.HEADING_3, children: inlineRuns(node.content) }));
        break;
      }
      case "paragraph":
        out.push(new Paragraph({ children: inlineRuns(node.content) }));
        break;
      case "blockquote":
        for (const child of node.content ?? []) {
          const text = flattenText(child);
          out.push(new Paragraph({ children: [new TextRun({ text, italics: true })], indent: { left: 360 } }));
        }
        break;
      case "codeBlock": {
        const text = (node.content ?? []).map((c) => c.text ?? "").join("\n");
        out.push(new Paragraph({ children: [new TextRun({ text, font: "Courier New" })] }));
        break;
      }
      case "bulletList":
        for (const item of node.content ?? []) {
          out.push(new Paragraph({ text: `${prefix}•  ${flattenText(item)}` }));
        }
        break;
      case "orderedList":
        (node.content ?? []).forEach((item, i) => {
          out.push(new Paragraph({ text: `${prefix}${i + 1}.  ${flattenText(item)}` }));
        });
        break;
      case "taskList":
        for (const item of node.content ?? []) {
          const checked = item.attrs?.checked ? "☑" : "☐";
          out.push(new Paragraph({ text: `${prefix}${checked}  ${flattenText(item)}` }));
        }
        break;
      default:
        if (node.content) out.push(...jsonToDocxParagraphs(node, prefix));
    }
  }
  return out.length ? out : [new Paragraph({ text: "" })];
}

function flattenText(node: JSONContent): string {
  if (node.text) return node.text;
  return (node.content ?? []).map(flattenText).join(" ").trim();
}
