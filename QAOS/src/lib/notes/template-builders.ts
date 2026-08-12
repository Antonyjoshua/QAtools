import type { JSONContent } from "@tiptap/core";

export function heading(level: 1 | 2 | 3, text: string): JSONContent {
  return { type: "heading", attrs: { level }, content: [{ type: "text", text }] };
}

export function paragraph(text = ""): JSONContent {
  return text ? { type: "paragraph", content: [{ type: "text", text }] } : { type: "paragraph" };
}

export function bulletList(items: string[]): JSONContent {
  return {
    type: "bulletList",
    content: items.map((i) => ({ type: "listItem", content: [paragraph(i)] })),
  };
}

export function orderedList(items: string[]): JSONContent {
  return {
    type: "orderedList",
    content: items.map((i) => ({ type: "listItem", content: [paragraph(i)] })),
  };
}

export function taskList(items: string[]): JSONContent {
  return {
    type: "taskList",
    content: items.map((i) => ({ type: "taskItem", attrs: { checked: false }, content: [paragraph(i)] })),
  };
}

function cell(text: string, header = false): JSONContent {
  return {
    type: header ? "tableHeader" : "tableCell",
    content: [paragraph(text)],
  };
}

export function table(headers: string[], rows: string[][]): JSONContent {
  return {
    type: "table",
    content: [
      { type: "tableRow", content: headers.map((h) => cell(h, true)) },
      ...rows.map((row) => ({ type: "tableRow", content: row.map((c) => cell(c)) })),
    ],
  };
}

export function doc(...blocks: JSONContent[]): JSONContent {
  return { type: "doc", content: blocks };
}

export function hr(): JSONContent {
  return { type: "horizontalRule" };
}
