import type { JSONContent } from "@tiptap/core";

export const EMPTY_DOC: JSONContent = { type: "doc", content: [{ type: "paragraph" }] };

export function extractText(node: JSONContent | undefined | null): string {
  if (!node) return "";
  let out = "";
  if (node.text) out += node.text;
  if (node.content) {
    for (const child of node.content) {
      out += extractText(child);
      if (child.type === "paragraph" || child.type === "heading" || child.type === "tableRow") {
        out += " ";
      }
    }
  }
  return out;
}

export function wordCount(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

export function estimateReadingMinutes(words: number): number {
  return Math.max(1, Math.round(words / 200));
}

export function excerpt(text: string, length = 140): string {
  const clean = text.trim().replace(/\s+/g, " ");
  if (clean.length <= length) return clean;
  return `${clean.slice(0, length).trimEnd()}…`;
}
