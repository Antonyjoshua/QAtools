"use client";

import * as React from "react";
import { useEditor, EditorContent, type JSONContent } from "@tiptap/react";
import { Placeholder } from "@tiptap/extension-placeholder";
import { CharacterCount } from "@tiptap/extension-character-count";
import { EditorToolbar } from "./editor-toolbar";
import { FileEmbed } from "./extensions/file-embed";
import { baseExtensions } from "@/lib/notes/editor-extensions";
import { FONT_FAMILY_STACK, FONT_SIZE_PX, useSettingsStore } from "@/lib/notes/settings-store";
import "./editor.css";

export interface NoteEditorHandle {
  getJSON: () => JSONContent;
}

interface NoteEditorProps {
  noteId: string;
  content: JSONContent;
  editable?: boolean;
  onUpdate?: (json: JSONContent) => void;
  onReady?: (editor: ReturnType<typeof useEditor>) => void;
}

export function NoteEditor({ noteId, content, editable = true, onUpdate, onReady }: NoteEditorProps) {
  const fontSize = useSettingsStore((s) => s.fontSize);
  const fontFamily = useSettingsStore((s) => s.fontFamily);

  const editor = useEditor({
    immediatelyRender: false,
    editable,
    extensions: [
      ...baseExtensions(),
      Placeholder.configure({ placeholder: "Start writing… use “/” shortcuts like # for a heading or ``` for code." }),
      CharacterCount,
      FileEmbed,
    ],
    content,
    onUpdate: ({ editor }) => {
      onUpdate?.(editor.getJSON());
    },
    editorProps: {
      attributes: {
        class: "qanotes-prose max-w-none focus:outline-none",
        style: `font-size:${FONT_SIZE_PX[fontSize]};font-family:${FONT_FAMILY_STACK[fontFamily]}`,
      },
    },
  });

  React.useEffect(() => {
    if (editor) onReady?.(editor);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor]);

  React.useEffect(() => {
    if (!editor) return;
    editor.setOptions({
      editorProps: {
        attributes: {
          class: "qanotes-prose max-w-none focus:outline-none",
          style: `font-size:${FONT_SIZE_PX[fontSize]};font-family:${FONT_FAMILY_STACK[fontFamily]}`,
        },
      },
    });
  }, [editor, fontSize, fontFamily]);

  React.useEffect(() => {
    if (!editor) return;
    editor.setEditable(editable);
  }, [editor, editable]);

  if (!editor) {
    return <div className="min-h-[200px] animate-pulse rounded-lg bg-muted/40" />;
  }

  return (
    <div className="flex flex-col">
      {editable && <EditorToolbar editor={editor} noteId={noteId} />}
      <div className="px-1 py-4 sm:px-2">
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
