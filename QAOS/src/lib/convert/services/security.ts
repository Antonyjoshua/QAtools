// Everything in this module runs entirely in the browser — files are never uploaded to a
// server, so there's no server filesystem, temp directory, or transfer channel to secure. What
// still applies, even client-side, is documented below.

const UNSAFE_FILENAME_CHARS = /[/\\:*?"<>|]/g;

/** Strips path separators and reserved characters before a name is handed to a browser download
 * or shown in the UI — guards against a source filename that happens to look like a path. */
export function sanitizeFilename(name: string): string {
  const cleaned = name.replace(UNSAFE_FILENAME_CHARS, "_").replace(/^\.+/, "").trim();
  return cleaned.length > 0 ? cleaned.slice(0, 200) : "file";
}

export function generateTempId(): string {
  return crypto.randomUUID();
}

export const PRIVACY_STATEMENT =
  "Every conversion runs entirely in your browser — files are never uploaded to a server. With Privacy Mode on (the default), converted files are never written to local storage either; only the file name, size, and format are kept in your history.";
