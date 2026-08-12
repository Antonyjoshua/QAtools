import { Node, mergeAttributes } from "@tiptap/core";

/**
 * Schema-only twin of FileEmbed (no NodeView) for headless use in export/markdown
 * serialization, where mounting a React NodeView isn't possible/needed.
 */
export const FileEmbedSchema = Node.create({
  name: "fileEmbed",
  group: "block",
  atom: true,

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
});
