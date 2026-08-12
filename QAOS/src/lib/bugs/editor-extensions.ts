import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { Link } from "@tiptap/extension-link";
import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";
import { Highlight } from "@tiptap/extension-highlight";
import { TaskList } from "@tiptap/extension-task-list";
import { TaskItem } from "@tiptap/extension-task-item";
import { createLowlight, common } from "lowlight";
import type { AnyExtension } from "@tiptap/core";

const lowlight = createLowlight(common);

/** Extensions shared between the interactive editor and headless export/serialization. */
export function baseExtensions(): AnyExtension[] {
  return [
    StarterKit.configure({ codeBlock: false, link: false, underline: false }),
    Underline,
    Link.configure({ openOnClick: false, autolink: true }),
    CodeBlockLowlight.configure({ lowlight }),
    Highlight.configure({ multicolor: false }),
    TaskList,
    TaskItem.configure({ nested: true }),
  ];
}
