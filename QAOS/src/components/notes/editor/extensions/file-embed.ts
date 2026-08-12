import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { FileEmbedView } from "./file-embed-view";

export interface FileEmbedAttrs {
  attachmentId: string;
  filename: string;
  mimeType: string;
  size: number;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    fileEmbed: {
      insertFileEmbed: (attrs: FileEmbedAttrs) => ReturnType;
    };
  }
}

export const FileEmbed = Node.create({
  name: "fileEmbed",
  group: "block",
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      attachmentId: { default: null },
      filename: { default: "" },
      mimeType: { default: "" },
      size: { default: 0 },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="file-embed"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes({ "data-type": "file-embed" }, HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(FileEmbedView);
  },

  addCommands() {
    return {
      insertFileEmbed:
        (attrs) =>
        ({ commands }) => {
          return commands.insertContent({ type: this.name, attrs });
        },
    };
  },
});
