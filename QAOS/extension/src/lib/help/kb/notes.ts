import type { HelpEntry } from "../types";

export const NOTES_ENTRIES: HelpEntry[] = [
  {
    id: "notes-add",
    module: "Notes",
    question: "How do I add a note?",
    keywords: ["add note", "create note", "new note", "write note", "make a note"],
    steps: [
      'Open the Notes module from the sidebar.',
      'Click the "New Note" button (top right of the notes list).',
      "Start typing — the note is created and saved automatically as you type.",
      'Give it a title, and optionally set a Category, add Tags, or add it to a Collection from the panel on the right.',
    ],
    link: { href: "/notes", label: "Open Notes" },
  },
  {
    id: "notes-category",
    module: "Notes",
    question: "How do I organize notes into categories?",
    keywords: ["note category", "categorize notes", "note folder", "note topic"],
    steps: [
      "Open any note.",
      'In the right-hand meta panel, use the "Category" dropdown to pick a topic (e.g. Manual Testing, Automation Testing, API Testing) or one of its sub-topics.',
      'Choose "No category" to leave it uncategorized.',
    ],
  },
  {
    id: "notes-tags-collections",
    module: "Notes",
    question: "How do I tag a note or add it to a collection?",
    keywords: ["tag note", "note tags", "note collection", "group notes"],
    steps: [
      "Open the note.",
      'In the right-hand panel, type a tag into the "Add tag…" box and press Enter (or pick a suggested preset tag).',
      'Use "Add to collection…" to file the note under a named collection (e.g. Interview Preparation, SQL Queries).',
    ],
  },
  {
    id: "notes-favorite-pin-archive",
    module: "Notes",
    question: "How do I favorite, pin, or archive a note?",
    keywords: ["favorite note", "pin note", "archive note", "star note"],
    steps: [
      "Open the note you want to manage.",
      "Use the star icon to favorite it (shows up under Favorites in the sidebar).",
      "Use the pin icon to pin it near the top of your notes list.",
      'Use "Archive" to move it out of the main list without deleting it — find archived notes under Archive in the sidebar.',
    ],
  },
  {
    id: "notes-templates",
    module: "Notes",
    question: "How do I use a note template?",
    keywords: ["note template", "templates"],
    steps: [
      'Go to Notes > Templates in the sidebar.',
      "Pick a template (e.g. a checklist or meeting-notes layout).",
      "It creates a new note pre-filled with that template's structure, which you can then edit freely.",
    ],
    link: { href: "/notes/templates", label: "Browse templates" },
  },
  {
    id: "notes-backup",
    module: "Notes",
    question: "How do I back up or restore my notes?",
    keywords: ["backup notes", "export notes", "import notes", "restore notes"],
    steps: [
      "Go to Notes > Settings in the sidebar.",
      'Use "Export Backup" to download all your notes/categories/collections as a file.',
      'Use "Import Backup" and choose that file to restore them later or on another browser.',
    ],
    tip: "Notes are stored only in this browser, so a backup is the only way to move them to another device.",
    link: { href: "/notes/settings", label: "Open Notes settings" },
  },
  {
    id: "notes-screenshot-studio",
    module: "Notes",
    question: "What is Screenshot Studio?",
    keywords: ["screenshot studio", "annotate screenshot"],
    steps: [
      "Go to Notes > Screenshot Studio in the sidebar.",
      "Upload or paste a screenshot.",
      "Use the annotation tools (arrows, boxes, text, blur) to mark it up, then download the result — handy for illustrating bug reports.",
    ],
    link: { href: "/notes/tools/screenshot-studio", label: "Open Screenshot Studio" },
  },
];
