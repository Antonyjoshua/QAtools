import type { JSONContent } from "@tiptap/core";

export function paragraph(text = ""): JSONContent {
  return text ? { type: "paragraph", content: [{ type: "text", text }] } : { type: "paragraph" };
}

export function orderedList(items: string[]): JSONContent {
  return {
    type: "orderedList",
    content: items.map((i) => ({ type: "listItem", content: [paragraph(i)] })),
  };
}

export function bulletList(items: string[]): JSONContent {
  return {
    type: "bulletList",
    content: items.map((i) => ({ type: "listItem", content: [paragraph(i)] })),
  };
}

export function doc(...blocks: JSONContent[]): JSONContent {
  return { type: "doc", content: blocks.length ? blocks : [paragraph()] };
}
