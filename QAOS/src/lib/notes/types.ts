import type { JSONContent } from "@tiptap/core";

export interface Note {
  id: string;
  title: string;
  contentJSON: JSONContent;
  contentText: string;
  categoryId: string | null;
  tags: string[];
  collectionIds: string[];
  isFavorite: boolean;
  isPinned: boolean;
  isArchived: boolean;
  icon: string;
  coverColor: string | null;
  templateId: string | null;
  readingProgress: number;
  wordCount: number;
  createdAt: number;
  updatedAt: number;
  lastViewedAt: number | null;
}

export interface Category {
  id: string;
  name: string;
  parentId: string | null;
  icon: string;
  order: number;
  isCustom: boolean;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  createdAt: number;
}

export interface Attachment {
  id: string;
  noteId: string;
  filename: string;
  mimeType: string;
  size: number;
  blob: Blob;
  createdAt: number;
}

export interface NoteVersion {
  id: string;
  noteId: string;
  title: string;
  contentJSON: JSONContent;
  wordCount: number;
  createdAt: number;
  label: string;
}

export interface Bookmark {
  id: string;
  noteId: string;
  label: string;
  headingText: string;
  headingId: string;
  createdAt: number;
}

export const TAG_PRESETS = [
  "Regression",
  "Smoke",
  "API",
  "SQL",
  "Playwright",
  "Selenium",
  "Mobile",
  "Bug",
  "Interview",
  "Automation",
] as const;
