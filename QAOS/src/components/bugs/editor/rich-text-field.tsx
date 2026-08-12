"use client";

import * as React from "react";
import { useEditor, EditorContent, type JSONContent } from "@tiptap/react";
import { Placeholder } from "@tiptap/extension-placeholder";
import { Bold, Italic, UnderlineIcon, List, ListOrdered, ListTodo, Code, Link2 } from "lucide-react";
import { baseExtensions } from "@/lib/bugs/editor-extensions";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import "./editor.css";

interface RichTextFieldProps {
  content: JSONContent;
  onChange: (json: JSONContent) => void;
  placeholder?: string;
  minHeight?: number;
  readOnly?: boolean;
}

function ToolbarBtn({ active, onClick, title, children }: { active?: boolean; onClick: () => void; title: string; children: React.ReactNode }) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      title={title}
      onClick={onClick}
      className={cn("size-6.5", active && "bg-accent text-accent-foreground")}
    >
      {children}
    </Button>
  );
}

export function RichTextField({ content, onChange, placeholder, minHeight = 90, readOnly = false }: RichTextFieldProps) {
  const editor = useEditor({
    immediatelyRender: false,
    editable: !readOnly,
    extensions: [
      ...baseExtensions(),
      Placeholder.configure({ placeholder: placeholder ?? "Type here…" }),
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getJSON()),
    editorProps: {
      attributes: { class: "bf-prose max-w-none text-sm focus:outline-none" },
    },
  });

  React.useEffect(() => {
    if (!editor) return;
    editor.setEditable(!readOnly);
  }, [editor, readOnly]);

  if (!editor) {
    return <div className="animate-pulse rounded-lg bg-muted/40" style={{ minHeight }} />;
  }

  return (
    <div className="rounded-lg border border-input bg-transparent">
      {!readOnly && (
        <div className="flex items-center gap-0.5 border-b border-border px-1.5 py-1">
          <ToolbarBtn title="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
            <Bold className="size-3.5" />
          </ToolbarBtn>
          <ToolbarBtn title="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
            <Italic className="size-3.5" />
          </ToolbarBtn>
          <ToolbarBtn title="Underline" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}>
            <UnderlineIcon className="size-3.5" />
          </ToolbarBtn>
          <ToolbarBtn title="Bullet list" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
            <List className="size-3.5" />
          </ToolbarBtn>
          <ToolbarBtn title="Numbered list" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
            <ListOrdered className="size-3.5" />
          </ToolbarBtn>
          <ToolbarBtn title="Checklist" active={editor.isActive("taskList")} onClick={() => editor.chain().focus().toggleTaskList().run()}>
            <ListTodo className="size-3.5" />
          </ToolbarBtn>
          <ToolbarBtn title="Code" active={editor.isActive("codeBlock")} onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
            <Code className="size-3.5" />
          </ToolbarBtn>
          <ToolbarBtn
            title="Link"
            active={editor.isActive("link")}
            onClick={() => {
              const url = window.prompt("URL");
              if (url) editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
            }}
          >
            <Link2 className="size-3.5" />
          </ToolbarBtn>
        </div>
      )}
      <div className="px-3 py-2" style={{ minHeight }}>
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
