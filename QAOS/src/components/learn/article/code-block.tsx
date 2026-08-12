import { createLowlight, common } from "lowlight";
import { toHtml } from "hast-util-to-html";
import "./code-block.css";

const lowlight = createLowlight(common);

function escapeHtml(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function highlightToHtml(language: string, code: string): string {
  if (language === "text" || language === "plaintext") return escapeHtml(code);
  try {
    return toHtml(lowlight.highlight(language, code));
  } catch {
    return escapeHtml(code);
  }
}

export function CodeBlock({ language, code, caption }: { language: string; code: string; caption?: string }) {
  const html = highlightToHtml(language, code);
  return (
    <figure className="my-3 overflow-hidden rounded-lg border border-border">
      {caption && <figcaption className="border-b border-border bg-muted/40 px-3 py-1.5 text-xs text-muted-foreground">{caption}</figcaption>}
      <pre className="overflow-x-auto bg-muted/20 p-3 text-xs leading-relaxed">
        <code className="hljs" dangerouslySetInnerHTML={{ __html: html }} />
      </pre>
    </figure>
  );
}
