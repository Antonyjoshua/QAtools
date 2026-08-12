"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  StickyNote,
  Star,
  Pin,
  Archive,
  Tag,
  LayoutTemplate,
  Settings,
  Image as ImageIcon,
  Calculator as CalculatorIcon,
  History as HistoryIcon,
  Sparkles,
  QrCode,
  ChevronRight,
  Menu,
  X,
  Bug,
  Pencil,
  BarChart3,
  Download,
  ListChecks,
  FolderKanban,
  User,
  Swords,
  Trophy,
  Package,
  BookOpen,
  Award,
  Map,
  CalendarDays,
  Users,
  ClipboardList,
  FolderTree,
  PlayCircle,
  FileBarChart2,
  FileText,
  Plus,
  GraduationCap,
  Mic,
  FlaskConical,
  RefreshCw,
  Briefcase,
  Bookmark,
  BellRing,
  ShieldCheck,
} from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { GlobalCommand } from "@/components/global-command";
import { QuickCalculator } from "@/components/quick-calculator/quick-calculator";
import { QuickTimer } from "@/components/quick-timer/quick-timer";
import { QuickTimezone } from "@/components/quick-timezone/quick-timezone";
import { QuickConvertPopup } from "@/components/convert/quick-convert-popup";
import { QuickDurationConverter } from "@/components/duration/quick-duration-converter";
import { QuickJobSearch } from "@/components/jobs/quick-job-search";
import { LogoMark } from "@/components/logo-mark";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type NavItem = { href: string; label: string; icon: React.ComponentType<{ className?: string }> };

type ModuleSection = {
  id: string;
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  items: NavItem[];
};

const modules: ModuleSection[] = [
  {
    id: "notes",
    label: "Notes",
    href: "/notes",
    icon: StickyNote,
    items: [
      { href: "/notes", label: "All Notes", icon: StickyNote },
      { href: "/notes/favorites", label: "Favorites", icon: Star },
      { href: "/notes/pinned", label: "Pinned", icon: Pin },
      { href: "/notes/archive", label: "Archive", icon: Archive },
      { href: "/notes/tags", label: "Tags", icon: Tag },
      { href: "/notes/templates", label: "Templates", icon: LayoutTemplate },
      { href: "/notes/tools/screenshot-studio", label: "Screenshot Studio", icon: ImageIcon },
      { href: "/notes/settings", label: "Settings", icon: Settings },
    ],
  },
  {
    id: "calculator",
    label: "Calculator",
    href: "/calculator",
    icon: CalculatorIcon,
    items: [
      { href: "/calculator", label: "Dashboard", icon: LayoutGrid },
      { href: "/calculator/history", label: "History", icon: HistoryIcon },
    ],
  },
  {
    id: "generator",
    label: "Test Data Generator",
    href: "/generator",
    icon: Sparkles,
    items: [
      { href: "/generator", label: "Dashboard", icon: LayoutGrid },
      { href: "/generator/favorites", label: "Favorites", icon: Star },
      { href: "/generator/history", label: "History", icon: HistoryIcon },
      { href: "/generator/templates", label: "Templates", icon: LayoutTemplate },
      { href: "/generator/tools/image-studio", label: "Image Studio", icon: ImageIcon },
      { href: "/generator/tools/qr-barcode-studio", label: "QR / Barcode Studio", icon: QrCode },
    ],
  },
  {
    id: "testcases",
    label: "Test Management",
    href: "/testcases",
    icon: ClipboardList,
    items: [
      { href: "/testcases", label: "Dashboard", icon: LayoutGrid },
      { href: "/testcases/projects", label: "Projects", icon: FolderTree },
      { href: "/testcases/runs", label: "Test Runs", icon: PlayCircle },
      { href: "/testcases/reports", label: "Reports", icon: FileBarChart2 },
    ],
  },
  {
    id: "bugs",
    label: "Bug Reports",
    href: "/bugs",
    icon: Bug,
    items: [
      { href: "/bugs", label: "All Bug Reports", icon: Bug },
      { href: "/bugs/drafts", label: "Drafts", icon: Pencil },
      { href: "/bugs/templates", label: "Templates", icon: LayoutTemplate },
      { href: "/bugs/analytics", label: "Analytics", icon: BarChart3 },
      { href: "/bugs/export-history", label: "Export History", icon: Download },
      { href: "/bugs/labels", label: "Labels", icon: Tag },
      { href: "/bugs/reusable-steps", label: "Reusable Steps", icon: ListChecks },
      { href: "/bugs/admin", label: "Projects & Modules", icon: FolderKanban },
      { href: "/bugs/settings", label: "Settings", icon: Settings },
    ],
  },
  {
    id: "resume",
    label: "Resume Builder",
    href: "/resume",
    icon: FileText,
    items: [
      { href: "/resume", label: "Dashboard", icon: LayoutGrid },
      { href: "/resume/templates", label: "Templates", icon: LayoutTemplate },
      { href: "/resume/new", label: "New Resume", icon: Plus },
    ],
  },
  {
    id: "learn",
    label: "Learn",
    href: "/learn",
    icon: GraduationCap,
    items: [
      { href: "/learn", label: "Dashboard", icon: LayoutGrid },
      { href: "/learn/cheatsheets", label: "Cheat Sheets", icon: FileText },
      { href: "/learn/books", label: "Books", icon: BookOpen },
      { href: "/learn/roadmaps", label: "Roadmaps", icon: Map },
      { href: "/learn/interview-prep", label: "Interview Prep", icon: Mic },
      { href: "/learn/practice", label: "Practice Zone", icon: FlaskConical },
    ],
  },
  {
    id: "convert",
    label: "File Converter",
    href: "/convert",
    icon: RefreshCw,
    items: [
      { href: "/convert", label: "Dashboard", icon: LayoutGrid },
      { href: "/convert/history", label: "History", icon: HistoryIcon },
    ],
  },
  {
    id: "jobs",
    label: "Jobs",
    href: "/jobs",
    icon: Briefcase,
    items: [
      { href: "/jobs", label: "Find Jobs", icon: Briefcase },
      { href: "/jobs/saved", label: "Saved Jobs", icon: Bookmark },
      { href: "/jobs/alerts", label: "Job Alerts", icon: BellRing },
      { href: "/jobs/profile", label: "Job Profile", icon: User },
      { href: "/jobs/analytics", label: "Analytics", icon: BarChart3 },
      { href: "/jobs/admin", label: "Admin", icon: ShieldCheck },
    ],
  },
  {
    id: "journey",
    label: "Solo Leveling",
    href: "/journey",
    icon: Swords,
    items: [
      { href: "/journey", label: "Dashboard", icon: LayoutGrid },
      { href: "/journey/profile", label: "Profile", icon: User },
      { href: "/journey/skills", label: "Skills", icon: Swords },
      { href: "/journey/quests", label: "Quests", icon: ListChecks },
      { href: "/journey/achievements", label: "Achievements", icon: Trophy },
      { href: "/journey/inventory", label: "Inventory", icon: Package },
      { href: "/journey/statistics", label: "Statistics", icon: BarChart3 },
      { href: "/journey/journal", label: "Journal", icon: BookOpen },
      { href: "/journey/certifications", label: "Certifications", icon: Award },
      { href: "/journey/roadmap", label: "Roadmap", icon: Map },
      { href: "/journey/calendar", label: "Calendar", icon: CalendarDays },
      { href: "/journey/leaderboard", label: "Leaderboard", icon: Users },
      { href: "/journey/settings", label: "Settings", icon: Settings },
    ],
  },
];

function ModuleNav({ mod, pathname, onNavigate }: { mod: ModuleSection; pathname: string; onNavigate?: () => void }) {
  const active = pathname === mod.href || pathname.startsWith(mod.href + "/");
  const [open, setOpen] = React.useState(active);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- expand section when its route becomes active
    if (active) setOpen(true);
  }, [active]);

  return (
    <div className="mt-1">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm font-medium transition-colors",
          active ? "text-foreground" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
        )}
      >
        <mod.icon className="size-4" />
        <span className="flex-1 text-left truncate">{mod.label}</span>
        <ChevronRight className={cn("size-3.5 transition-transform", open && "rotate-90")} />
      </button>
      {open && (
        <nav className="mt-0.5 flex flex-col gap-0.5 border-l border-border pl-3.5 ml-3.5">
          {mod.items.map((item) => {
            const itemActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onNavigate}
                className={cn(
                  "flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition-colors",
                  itemActive ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
                )}
              >
                <item.icon className="size-4" />
                <span className="truncate">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      )}
    </div>
  );
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <div className="flex h-full flex-col">
      <Link href="/" className="flex items-center gap-2 px-4 py-4" onClick={onNavigate}>
        <LogoMark className="size-7 shrink-0" />
        <span className="font-[family-name:var(--font-plex-mono)] font-bold tracking-tight">QuanGrade</span>
      </Link>
      <div className="flex-1 overflow-y-auto scrollbar-thin px-2 pb-4">
        <Link
          href="/"
          onClick={onNavigate}
          className={cn(
            "flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition-colors",
            pathname === "/" ? "bg-accent text-accent-foreground font-medium" : "text-muted-foreground hover:bg-accent/60 hover:text-foreground"
          )}
        >
          <LayoutGrid className="size-4" />
          Home
        </Link>

        <div className="mt-4 border-t border-border pt-2">
          {modules.map((mod) => (
            <ModuleNav key={mod.id} mod={mod} pathname={pathname} onNavigate={onNavigate} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen w-full">
      <aside className="hidden w-64 shrink-0 border-r border-border bg-sidebar md:block">
        <div className="sticky top-0 h-screen">
          <SidebarContent />
        </div>
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute inset-y-0 left-0 w-64 bg-sidebar border-r border-border">
            <div className="flex justify-end p-2">
              <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)}>
                <X className="size-4" />
              </Button>
            </div>
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-border bg-background/80 px-4 backdrop-blur supports-backdrop-filter:bg-background/60">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(true)}>
            <Menu className="size-4" />
          </Button>
          <div className="flex-1">
            <GlobalCommand />
          </div>
          <QuickTimezone />
          <QuickTimer />
          <QuickCalculator />
          <QuickDurationConverter />
          <QuickConvertPopup />
          <QuickJobSearch />
          <ThemeToggle />
        </header>
        <main className="flex-1 bg-grid">{children}</main>
      </div>
    </div>
  );
}
