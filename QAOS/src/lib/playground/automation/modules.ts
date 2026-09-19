import type { LucideIcon } from "lucide-react";
import {
  AlertTriangle,
  AppWindow,
  Rows3,
  Move,
  Sparkles,
  Upload,
  Table2,
  Layers,
  Copy,
  MousePointer2,
  ArrowDownWideNarrow,
} from "lucide-react";

export interface AutomationModule {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
}

export const AUTOMATION_MODULES: AutomationModule[] = [
  {
    id: "alerts",
    title: "Alerts & Dialogs",
    description: "window.alert, confirm, and prompt — including a delayed one for wait strategies.",
    href: "/playground/automation/alerts",
    icon: AlertTriangle,
  },
  {
    id: "windows",
    title: "Windows & Tabs",
    description: "Links and buttons that open new tabs/windows — practice switching between them.",
    href: "/playground/automation/windows",
    icon: AppWindow,
  },
  {
    id: "frames",
    title: "Frames & iFrames",
    description: "A single iframe and a nested (frame-within-a-frame) structure.",
    href: "/playground/automation/frames",
    icon: Rows3,
  },
  {
    id: "drag-drop",
    title: "Drag and Drop",
    description: "Native HTML5 drag-and-drop with two swappable boxes.",
    href: "/playground/automation/drag-drop",
    icon: Move,
  },
  {
    id: "dynamic",
    title: "Dynamic Elements",
    description: "Delayed appearance, an id that changes on every load, and a toggle-to-reveal element.",
    href: "/playground/automation/dynamic",
    icon: Sparkles,
  },
  {
    id: "upload",
    title: "File Upload",
    description: "A real file input — pick a file and see it get read and reported back.",
    href: "/playground/automation/upload",
    icon: Upload,
  },
  {
    id: "tables",
    title: "Tables & Pagination",
    description: "A sortable, paginated data table — practice row/column locators and pagination.",
    href: "/playground/automation/tables",
    icon: Table2,
  },
  {
    id: "shadow-dom",
    title: "Shadow DOM",
    description: "A button and input rendered inside a real shadow root.",
    href: "/playground/automation/shadow-dom",
    icon: Layers,
  },
  {
    id: "duplicates",
    title: "Duplicate IDs & Text",
    description: "Elements sharing the same id, and buttons sharing the same visible text.",
    href: "/playground/automation/duplicates",
    icon: Copy,
  },
  {
    id: "hover",
    title: "Hover Menus",
    description: "A menu that only appears on hover — requires a real hover, not just a click.",
    href: "/playground/automation/hover",
    icon: MousePointer2,
  },
  {
    id: "infinite-scroll",
    title: "Infinite Scroll",
    description: "A list that loads more rows as you scroll toward the bottom.",
    href: "/playground/automation/infinite-scroll",
    icon: ArrowDownWideNarrow,
  },
];

export function getAutomationModule(id: string): AutomationModule | undefined {
  return AUTOMATION_MODULES.find((m) => m.id === id);
}
