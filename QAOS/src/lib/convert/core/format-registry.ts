import type { FormatDefinition, FileCategory } from "./types";

export const FORMATS: FormatDefinition[] = [
  // Documents
  { id: "docx", label: "Word Document", category: "document", extensions: [".docx"], mimeTypes: ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"], icon: "FileText" },
  { id: "doc", label: "Word 97-2003 Document", category: "document", extensions: [".doc"], mimeTypes: ["application/msword"], icon: "FileText" },
  { id: "odt", label: "OpenDocument Text", category: "document", extensions: [".odt"], mimeTypes: ["application/vnd.oasis.opendocument.text"], icon: "FileText" },
  { id: "rtf", label: "Rich Text Format", category: "document", extensions: [".rtf"], mimeTypes: ["application/rtf", "text/rtf"], icon: "FileText" },
  { id: "txt", label: "Plain Text", category: "document", extensions: [".txt"], mimeTypes: ["text/plain"], icon: "FileText" },
  { id: "html", label: "HTML Document", category: "document", extensions: [".html", ".htm"], mimeTypes: ["text/html"], icon: "Code2" },
  { id: "md", label: "Markdown", category: "document", extensions: [".md", ".markdown"], mimeTypes: ["text/markdown"], icon: "FileText" },

  // Spreadsheets
  { id: "xlsx", label: "Excel Workbook", category: "spreadsheet", extensions: [".xlsx"], mimeTypes: ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"], icon: "Sheet" },
  { id: "xls", label: "Excel 97-2003 Workbook", category: "spreadsheet", extensions: [".xls"], mimeTypes: ["application/vnd.ms-excel"], icon: "Sheet" },
  { id: "csv", label: "CSV", category: "spreadsheet", extensions: [".csv"], mimeTypes: ["text/csv"], icon: "Sheet" },
  { id: "ods", label: "OpenDocument Spreadsheet", category: "spreadsheet", extensions: [".ods"], mimeTypes: ["application/vnd.oasis.opendocument.spreadsheet"], icon: "Sheet" },

  // Presentations
  { id: "pptx", label: "PowerPoint Presentation", category: "presentation", extensions: [".pptx"], mimeTypes: ["application/vnd.openxmlformats-officedocument.presentationml.presentation"], icon: "Presentation" },
  { id: "ppt", label: "PowerPoint 97-2003 Presentation", category: "presentation", extensions: [".ppt"], mimeTypes: ["application/vnd.ms-powerpoint"], icon: "Presentation" },
  { id: "odp", label: "OpenDocument Presentation", category: "presentation", extensions: [".odp"], mimeTypes: ["application/vnd.oasis.opendocument.presentation"], icon: "Presentation" },

  // PDF
  { id: "pdf", label: "PDF Document", category: "pdf", extensions: [".pdf"], mimeTypes: ["application/pdf"], icon: "FileType" },

  // Images
  { id: "jpg", label: "JPEG Image", category: "image", extensions: [".jpg", ".jpeg"], mimeTypes: ["image/jpeg"], icon: "Image" },
  { id: "png", label: "PNG Image", category: "image", extensions: [".png"], mimeTypes: ["image/png"], icon: "Image" },
  { id: "webp", label: "WebP Image", category: "image", extensions: [".webp"], mimeTypes: ["image/webp"], icon: "Image" },
  { id: "gif", label: "GIF Image", category: "image", extensions: [".gif"], mimeTypes: ["image/gif"], icon: "Image" },
  { id: "bmp", label: "Bitmap Image", category: "image", extensions: [".bmp"], mimeTypes: ["image/bmp"], icon: "Image" },
  { id: "tiff", label: "TIFF Image", category: "image", extensions: [".tiff", ".tif"], mimeTypes: ["image/tiff"], icon: "Image" },
  { id: "svg", label: "SVG Vector Image", category: "image", extensions: [".svg"], mimeTypes: ["image/svg+xml"], icon: "Shapes" },
  { id: "ico", label: "Icon File", category: "image", extensions: [".ico"], mimeTypes: ["image/x-icon", "image/vnd.microsoft.icon"], icon: "Image" },

  // Text / data
  { id: "json", label: "JSON", category: "data", extensions: [".json"], mimeTypes: ["application/json"], icon: "Braces" },
  { id: "xml", label: "XML", category: "data", extensions: [".xml"], mimeTypes: ["application/xml", "text/xml"], icon: "Code2" },
  { id: "yaml", label: "YAML", category: "data", extensions: [".yaml", ".yml"], mimeTypes: ["application/x-yaml", "text/yaml"], icon: "Code2" },

  // Archives
  { id: "zip", label: "ZIP Archive", category: "archive", extensions: [".zip"], mimeTypes: ["application/zip"], icon: "FileArchive" },
  { id: "tar", label: "TAR Archive", category: "archive", extensions: [".tar"], mimeTypes: ["application/x-tar"], icon: "FileArchive" },
  { id: "gz", label: "Gzip Archive", category: "archive", extensions: [".gz"], mimeTypes: ["application/gzip"], icon: "FileArchive" },
];

const BY_ID = new Map(FORMATS.map((f) => [f.id, f]));
const BY_EXTENSION = new Map(FORMATS.flatMap((f) => f.extensions.map((ext) => [ext.toLowerCase(), f])));

export function getFormat(id: string): FormatDefinition | undefined {
  return BY_ID.get(id);
}

export function getFormatByExtension(extension: string): FormatDefinition | undefined {
  return BY_EXTENSION.get(extension.toLowerCase());
}

export function getFormatsByCategory(category: FileCategory): FormatDefinition[] {
  return FORMATS.filter((f) => f.category === category);
}

export const CATEGORY_LABELS: Record<FileCategory, string> = {
  document: "Documents",
  spreadsheet: "Spreadsheets",
  presentation: "Presentations",
  pdf: "PDF",
  image: "Images",
  data: "Text & Data",
  archive: "Archives",
};
