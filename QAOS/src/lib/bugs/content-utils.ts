import type { JSONContent } from "@tiptap/core";

export const EMPTY_DOC: JSONContent = { type: "doc", content: [{ type: "paragraph" }] };

export function extractText(node: JSONContent | undefined | null): string {
  if (!node) return "";
  let out = "";
  if (node.text) out += node.text;
  if (node.content) {
    for (const child of node.content) {
      out += extractText(child);
      if (child.type === "paragraph" || child.type === "heading" || child.type === "listItem") {
        out += " ";
      }
    }
  }
  return out;
}

export function excerpt(text: string, length = 140): string {
  const clean = text.trim().replace(/\s+/g, " ");
  if (clean.length <= length) return clean;
  return `${clean.slice(0, length).trimEnd()}…`;
}

export function isDocEmpty(doc: JSONContent | undefined | null): boolean {
  return !extractText(doc).trim();
}
