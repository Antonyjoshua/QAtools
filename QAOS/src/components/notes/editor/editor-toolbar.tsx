"use client";

import * as React from "react";
import type { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  UnderlineIcon,
  Strikethrough,
  Code,
  Highlighter,
  List,
  ListOrdered,
  ListTodo,
  Quote,
  Minus,
  Link2,
  Image as ImageIcon,
  Paperclip,
  Table as TableIcon,
  Undo2,
  Redo2,
  ChevronDown,
  Heading1,
  Heading2,
  Heading3,
  Pilcrow,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Camera,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { addAttachment } from "@/lib/notes/attachments-repo";
import { ScreenshotInsertDialog } from "@/components/notes/screenshot-studio/insert-dialog";

/**
 * Base UI's Menu restores focus to its trigger when it closes, racing with
 * Tiptap's `.focus()` chain command fired from `onSelect` and silently
 * dropping the edit. Deferring to the next tick lets the menu finish first.
 */
function runAfterMenuClose(fn: () => void) {
  setTimeout(fn, 0);
}

const CODE_LANGUAGES = [
  { label: "Plain text", value: "plaintext" },
  { label: "Java", value: "java" },
  { label: "JavaScript", value: "javascript" },
  { label: "TypeScript", value: "typescript" },
  { label: "Python", value: "python" },
  { label: "SQL", value: "sql" },
  { label: "HTML/XML", value: "xml" },
  { label: "CSS", value: "css" },
  { label: "JSON", value: "json" },
];

function ToolbarButton({
  active,
  onClick,
  disabled,
  title,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      title={title}
      disabled={disabled}
      onClick={onClick}
      className={cn("size-8", active && "bg-accent text-accent-foreground")}
    >
      {children}
    </Button>
  );
}

function LinkPopover({ editor }: { editor: Editor }) {
  const [url, setUrl] = React.useState("");
  const [open, setOpen] = React.useState(false);

  function apply() {
    if (url) {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    } else {
      editor.chain().focus().unsetLink().run();
    }
    setOpen(false);
    setUrl("");
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        title="Link"
        className={cn(
          "inline-flex size-8 items-center justify-center rounded-lg transition-colors hover:bg-muted",
          editor.isActive("link") && "bg-accent text-accent-foreground"
        )}
      >
        <Link2 className="size-4" />
      </PopoverTrigger>
      <PopoverContent className="w-72" align="start">
        <div className="flex gap-2">
          <Input
            placeholder="https://…"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && apply()}
            autoFocus
          />
          <Button size="sm" onClick={apply}>
            Add
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function EditorToolbar({ editor, noteId }: { editor: Editor; noteId: string }) {
  const imageInputRef = React.useRef<HTMLInputElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [screenshotOpen, setScreenshotOpen] = React.useState(false);

  async function handleFileChosen(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    const attachment = await addAttachment(noteId, file);
    editor
      .chain()
      .focus()
      .insertFileEmbed({
        attachmentId: attachment.id,
        filename: attachment.filename,
        mimeType: attachment.mimeType,
        size: attachment.size,
      })
      .run();
  }

  const headingLabel = editor.isActive("heading", { level: 1 })
    ? "Heading 1"
    : editor.isActive("heading", { level: 2 })
      ? "Heading 2"
      : editor.isActive("heading", { level: 3 })
        ? "Heading 3"
        : "Paragraph";

  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-border bg-card/60 px-2 py-1.5">
      <DropdownMenu>
        <DropdownMenuTrigger className="inline-flex h-8 items-center gap-1 rounded-lg px-2 text-xs transition-colors hover:bg-muted">
          {headingLabel}
          <ChevronDown className="size-3" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => runAfterMenuClose(() => editor.chain().focus().setParagraph().run())}>
            <Pilcrow className="size-4" /> Paragraph
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => runAfterMenuClose(() => editor.chain().focus().toggleHeading({ level: 1 }).run())}>
            <Heading1 className="size-4" /> Heading 1
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => runAfterMenuClose(() => editor.chain().focus().toggleHeading({ level: 2 }).run())}>
            <Heading2 className="size-4" /> Heading 2
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => runAfterMenuClose(() => editor.chain().focus().toggleHeading({ level: 3 }).run())}>
            <Heading3 className="size-4" /> Heading 3
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Separator orientation="vertical" className="mx-1 h-5" />

      <ToolbarButton title="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
        <Bold className="size-4" />
      </ToolbarButton>
      <ToolbarButton title="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
        <Italic className="size-4" />
      </ToolbarButton>
      <ToolbarButton title="Underline" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}>
        <UnderlineIcon className="size-4" />
      </ToolbarButton>
      <ToolbarButton title="Strikethrough" active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}>
        <Strikethrough className="size-4" />
      </ToolbarButton>
      <ToolbarButton title="Inline code" active={editor.isActive("code")} onClick={() => editor.chain().focus().toggleCode().run()}>
        <Code className="size-4" />
      </ToolbarButton>
      <ToolbarButton title="Highlight" active={editor.isActive("highlight")} onClick={() => editor.chain().focus().toggleHighlight().run()}>
        <Highlighter className="size-4" />
      </ToolbarButton>

      <Separator orientation="vertical" className="mx-1 h-5" />

      <ToolbarButton title="Bullet list" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
        <List className="size-4" />
      </ToolbarButton>
      <ToolbarButton title="Numbered list" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        <ListOrdered className="size-4" />
      </ToolbarButton>
      <ToolbarButton title="Checklist" active={editor.isActive("taskList")} onClick={() => editor.chain().focus().toggleTaskList().run()}>
        <ListTodo className="size-4" />
      </ToolbarButton>
      <ToolbarButton title="Quote" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
        <Quote className="size-4" />
      </ToolbarButton>

      <Separator orientation="vertical" className="mx-1 h-5" />

      <ToolbarButton title="Align left" active={editor.isActive({ textAlign: "left" })} onClick={() => editor.chain().focus().setTextAlign("left").run()}>
        <AlignLeft className="size-4" />
      </ToolbarButton>
      <ToolbarButton title="Align center" active={editor.isActive({ textAlign: "center" })} onClick={() => editor.chain().focus().setTextAlign("center").run()}>
        <AlignCenter className="size-4" />
      </ToolbarButton>
      <ToolbarButton title="Align right" active={editor.isActive({ textAlign: "right" })} onClick={() => editor.chain().focus().setTextAlign("right").run()}>
        <AlignRight className="size-4" />
      </ToolbarButton>

      <Separator orientation="vertical" className="mx-1 h-5" />

      <LinkPopover editor={editor} />

      <DropdownMenu>
        <DropdownMenuTrigger
          title="Code block"
          className={cn(
            "inline-flex size-8 items-center justify-center rounded-lg transition-colors hover:bg-muted",
            editor.isActive("codeBlock") && "bg-accent text-accent-foreground"
          )}
        >
          <span className="font-mono text-[13px] font-semibold">{"</>"}</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          {CODE_LANGUAGES.map((l) => (
            <DropdownMenuItem
              key={l.value}
              onClick={() =>
                runAfterMenuClose(() => editor.chain().focus().setCodeBlock({ language: l.value }).run())
              }
            >
              {l.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <ToolbarButton
        title="Insert table"
        onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
      >
        <TableIcon className="size-4" />
      </ToolbarButton>

      <ToolbarButton title="Insert image" onClick={() => imageInputRef.current?.click()}>
        <ImageIcon className="size-4" />
      </ToolbarButton>
      <input ref={imageInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChosen} />

      <ToolbarButton title="Attach file" onClick={() => fileInputRef.current?.click()}>
        <Paperclip className="size-4" />
      </ToolbarButton>
      <input ref={fileInputRef} type="file" className="hidden" onChange={handleFileChosen} />

      <ToolbarButton title="Screenshot studio" onClick={() => setScreenshotOpen(true)}>
        <Camera className="size-4" />
      </ToolbarButton>

      <ToolbarButton title="Horizontal rule" onClick={() => editor.chain().focus().setHorizontalRule().run()}>
        <Minus className="size-4" />
      </ToolbarButton>

      <Separator orientation="vertical" className="mx-1 h-5" />

      <ToolbarButton title="Undo" onClick={() => editor.chain().focus().undo().run()}>
        <Undo2 className="size-4" />
      </ToolbarButton>
      <ToolbarButton title="Redo" onClick={() => editor.chain().focus().redo().run()}>
        <Redo2 className="size-4" />
      </ToolbarButton>

      {screenshotOpen && (
        <ScreenshotInsertDialog open={screenshotOpen} onOpenChange={setScreenshotOpen} editor={editor} noteId={noteId} />
      )}
    </div>
  );
}
