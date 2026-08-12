"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useLiveQuery } from "dexie-react-hooks";
import { Search, LayoutGrid, StickyNote, Calculator as CalculatorIcon, Sparkles, Bug, Swords, ClipboardList, FileText, GraduationCap, BookOpen, Map as MapIcon, RefreshCw, ArrowRight, Briefcase } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { DynamicIcon, CategoryIcon } from "@/components/icon";
import { db } from "@/lib/notes/db";
import { buildSearchIndex } from "@/lib/notes/search";
import { excerpt } from "@/lib/notes/content-utils";
import { searchCalculators } from "@/lib/calculator/registry";
import { searchGenerators } from "@/lib/generator/registry";
import { getCategory } from "@/lib/generator/categories";
import { db as bugsDb } from "@/lib/bugs/db";
import { buildBugSearchIndex } from "@/lib/bugs/search";
import { db as testcasesDb } from "@/lib/testcases/db";
import { db as resumeDb } from "@/lib/resume/db";
import { searchContent, getArticle } from "@/lib/learn/content/registry";
import { getAllConversionPairs } from "@/lib/convert/core/engine";
import { getFormat } from "@/lib/convert/core/format-registry";
import { db as jobsDb } from "@/lib/jobs/db";
import { applyFilters } from "@/lib/jobs/repo";
import { emptyFilterState } from "@/lib/jobs/types";

const goTo = [
  { href: "/", label: "Home", icon: LayoutGrid },
  { href: "/notes", label: "Notes", icon: StickyNote },
  { href: "/calculator", label: "Calculator", icon: CalculatorIcon },
  { href: "/generator", label: "Test Data Generator", icon: Sparkles },
  { href: "/bugs", label: "Bug Reports", icon: Bug },
  { href: "/testcases", label: "Test Management", icon: ClipboardList },
  { href: "/resume", label: "Resume Builder", icon: FileText },
  { href: "/learn", label: "Learn", icon: GraduationCap },
  { href: "/convert", label: "File Converter", icon: RefreshCw },
  { href: "/journey", label: "Solo Leveling", icon: Swords },
  { href: "/jobs", label: "Jobs", icon: Briefcase },
];

const LEARN_RESULT_ICONS = { article: GraduationCap, cheatsheet: FileText, book: BookOpen, roadmap: MapIcon } as const;

const RESULT_LIMIT = 6;

export function GlobalCommand() {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const router = useRouter();

  const notes = useLiveQuery(() => db.notes.filter((n) => !n.isArchived).toArray(), []);
  const categories = useLiveQuery(() => db.categories.toArray(), []);

  const categoryNameById = React.useMemo(() => {
    const map = new Map<string, string>();
    (categories ?? []).forEach((c) => map.set(c.id, c.name));
    return map;
  }, [categories]);

  const notesIndex = React.useMemo(() => {
    if (!notes) return null;
    return buildSearchIndex(notes, categoryNameById);
  }, [notes, categoryNameById]);

  const noteById = React.useMemo(() => {
    const map = new Map<string, NonNullable<typeof notes>[number]>();
    (notes ?? []).forEach((n) => map.set(n.id, n));
    return map;
  }, [notes]);

  const noteResults = React.useMemo(() => {
    if (!notesIndex || !query.trim()) return [];
    return notesIndex.search(query).slice(0, RESULT_LIMIT);
  }, [notesIndex, query]);

  const calculatorResults = React.useMemo(() => {
    if (!query.trim()) return [];
    return searchCalculators(query).slice(0, RESULT_LIMIT);
  }, [query]);

  const generatorResults = React.useMemo(() => {
    if (!query.trim()) return [];
    return searchGenerators(query).slice(0, RESULT_LIMIT);
  }, [query]);

  const bugs = useLiveQuery(() => bugsDb.bugs.toArray(), []);
  const bugProjects = useLiveQuery(() => bugsDb.projects.toArray(), []);
  const bugModules = useLiveQuery(() => bugsDb.modules.toArray(), []);

  const bugProjectNameById = React.useMemo(() => {
    const map = new Map<string, string>();
    (bugProjects ?? []).forEach((p) => map.set(p.id, p.name));
    return map;
  }, [bugProjects]);

  const bugModuleNameById = React.useMemo(() => {
    const map = new Map<string, string>();
    (bugModules ?? []).forEach((m) => map.set(m.id, m.name));
    return map;
  }, [bugModules]);

  const bugsIndex = React.useMemo(() => {
    if (!bugs) return null;
    return buildBugSearchIndex(bugs, bugProjectNameById, bugModuleNameById);
  }, [bugs, bugProjectNameById, bugModuleNameById]);

  const bugById = React.useMemo(() => {
    const map = new Map<string, NonNullable<typeof bugs>[number]>();
    (bugs ?? []).forEach((b) => map.set(b.id, b));
    return map;
  }, [bugs]);

  const bugResults = React.useMemo(() => {
    if (!bugsIndex || !query.trim()) return [];
    return bugsIndex.search(query).slice(0, RESULT_LIMIT);
  }, [bugsIndex, query]);

  const testCases = useLiveQuery(() => testcasesDb.testCases.toArray(), []);
  const testCaseSuites = useLiveQuery(() => testcasesDb.suites.toArray(), []);

  const testCaseSuiteNameById = React.useMemo(() => {
    const map = new Map<string, string>();
    (testCaseSuites ?? []).forEach((s) => map.set(s.id, s.name));
    return map;
  }, [testCaseSuites]);

  const testCaseResults = React.useMemo(() => {
    if (!testCases || !query.trim()) return [];
    const q = query.trim().toLowerCase();
    return testCases
      .filter((tc) => {
        const haystack = [tc.displayId, tc.title, tc.requirementId, tc.author, testCaseSuiteNameById.get(tc.suiteId) ?? "", ...tc.tags]
          .join(" ")
          .toLowerCase();
        return haystack.includes(q);
      })
      .slice(0, RESULT_LIMIT);
  }, [testCases, testCaseSuiteNameById, query]);

  const resumes = useLiveQuery(() => resumeDb.resumes.toArray(), []);

  const resumeResults = React.useMemo(() => {
    if (!resumes || !query.trim()) return [];
    const q = query.trim().toLowerCase();
    return resumes.filter((r) => r.name.toLowerCase().includes(q)).slice(0, RESULT_LIMIT);
  }, [resumes, query]);

  const learnResults = React.useMemo(() => {
    if (!query.trim()) return [];
    return searchContent(query, RESULT_LIMIT).map((r) => {
      const href =
        r.type === "article"
          ? (() => {
              const article = getArticle(r.id);
              return article ? `/learn/${article.moduleId}/${article.slug}` : "/learn";
            })()
          : r.type === "cheatsheet"
            ? `/learn/cheatsheets/${r.id}`
            : r.type === "roadmap"
              ? `/learn/roadmaps/${r.id}`
              : "/learn/books";
      return { ...r, href };
    });
  }, [query]);

  const conversionResults = React.useMemo(() => {
    const words = query.trim().toLowerCase().replace(/\bto\b/g, " ").split(/\s+/).filter(Boolean);
    if (words.length === 0) return [];
    return getAllConversionPairs()
      .map((pair) => ({ pair, fromFmt: getFormat(pair.from), toFmt: getFormat(pair.to) }))
      .filter((r): r is typeof r & { fromFmt: NonNullable<typeof r.fromFmt>; toFmt: NonNullable<typeof r.toFmt> } => Boolean(r.fromFmt && r.toFmt))
      .filter(({ fromFmt, toFmt }) => {
        const haystack = `${fromFmt.label} ${fromFmt.id} ${toFmt.label} ${toFmt.id}`.toLowerCase();
        return words.every((w) => haystack.includes(w));
      })
      .slice(0, RESULT_LIMIT);
  }, [query]);

  const jobs = useLiveQuery(() => jobsDb.jobs.toArray(), []);
  const jobResults = React.useMemo(() => {
    if (!jobs || !query.trim()) return [];
    const filters = emptyFilterState();
    filters.query = query;
    return applyFilters(jobs, filters).slice(0, RESULT_LIMIT);
  }, [jobs, query]);

  const filteredGoTo = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return goTo;
    return goTo.filter((item) => item.label.toLowerCase().includes(q));
  }, [query]);

  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  function go(href: string) {
    setOpen(false);
    setQuery("");
    router.push(href);
  }

  const hasQuery = query.trim().length > 0;
  const hasResults =
    filteredGoTo.length > 0 ||
    noteResults.length > 0 ||
    calculatorResults.length > 0 ||
    generatorResults.length > 0 ||
    bugResults.length > 0 ||
    testCaseResults.length > 0 ||
    resumeResults.length > 0 ||
    learnResults.length > 0 ||
    conversionResults.length > 0 ||
    jobResults.length > 0;

  return (
    <>
      <Button
        variant="outline"
        className="h-9 w-full max-w-sm justify-start gap-2 px-3 text-muted-foreground font-normal"
        onClick={() => setOpen(true)}
      >
        <Search className="size-4" />
        <span className="flex-1 text-left">Search QuanGrade…</span>
        <kbd className="pointer-events-none hidden select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:inline-flex">
          ⌘K
        </kbd>
      </Button>
      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Search QuanGrade"
        description="Search notes, calculators, generators, bug reports and test cases"
        shouldFilter={false}
      >
        <CommandInput
          placeholder="Search notes, calculators, generators, bug reports, test cases…"
          value={query}
          onValueChange={setQuery}
        />
        <CommandList>
          {!hasResults && <CommandEmpty>No results found.</CommandEmpty>}

          {filteredGoTo.length > 0 && (
            <CommandGroup heading="Go to">
              {filteredGoTo.map((item) => (
                <CommandItem key={item.href} value={item.href} onSelect={() => go(item.href)}>
                  <item.icon className="size-4" />
                  {item.label}
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {hasQuery && noteResults.length > 0 && (
            <CommandGroup heading="Notes">
              {noteResults.map((r) => {
                const note = noteById.get(String(r.id));
                return (
                  <CommandItem key={`note-${r.id}`} value={`note-${r.id}`} onSelect={() => go(`/notes/${r.id}`)}>
                    <DynamicIcon name={note?.icon ?? "FileText"} className="size-4" />
                    <div className="flex min-w-0 flex-col">
                      <span className="truncate">{note?.title ?? "Untitled"}</span>
                      {note && (
                        <span className="truncate text-xs text-muted-foreground">
                          {excerpt(note.contentText, 60)}
                        </span>
                      )}
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          )}

          {hasQuery && calculatorResults.length > 0 && (
            <CommandGroup heading="Calculators">
              {calculatorResults.map((c) => (
                <CommandItem key={`calc-${c.id}`} value={`calc-${c.id}`} onSelect={() => go(`/calculator/${c.slug}`)}>
                  <c.icon className="size-4" />
                  <span>{c.name}</span>
                  <span className="ml-auto text-xs text-muted-foreground">{c.category}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {hasQuery && generatorResults.length > 0 && (
            <CommandGroup heading="Generators">
              {generatorResults.map((g) => (
                <CommandItem key={`gen-${g.slug}`} value={`gen-${g.slug}`} onSelect={() => go(`/generator/g/${g.slug}`)}>
                  <CategoryIcon name={getCategory(g.category)?.icon ?? "FlaskConical"} className="size-4" />
                  <span>{g.name}</span>
                  <span className="ml-auto text-xs text-muted-foreground">{getCategory(g.category)?.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {hasQuery && bugResults.length > 0 && (
            <CommandGroup heading="Bug Reports">
              {bugResults.map((r) => {
                const bug = bugById.get(String(r.id));
                return (
                  <CommandItem key={`bug-${r.id}`} value={`bug-${r.id}`} onSelect={() => go(`/bugs/${r.id}`)}>
                    <Bug className="size-4" />
                    <div className="flex min-w-0 flex-col">
                      <span className="truncate">{bug?.title ?? "Untitled bug"}</span>
                      {bug && (
                        <span className="truncate text-xs text-muted-foreground">
                          {bug.displayId} · {bug.status}
                        </span>
                      )}
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          )}
          {hasQuery && testCaseResults.length > 0 && (
            <CommandGroup heading="Test Cases">
              {testCaseResults.map((tc) => (
                <CommandItem key={`tc-${tc.id}`} value={`tc-${tc.id}`} onSelect={() => go(`/testcases/case/${tc.id}`)}>
                  <ClipboardList className="size-4" />
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate">{tc.title}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {tc.displayId} · {testCaseSuiteNameById.get(tc.suiteId) ?? "—"}
                    </span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {hasQuery && resumeResults.length > 0 && (
            <CommandGroup heading="Resumes">
              {resumeResults.map((r) => (
                <CommandItem key={`resume-${r.id}`} value={`resume-${r.id}`} onSelect={() => go(`/resume/${r.id}`)}>
                  <FileText className="size-4" />
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate">{r.name}</span>
                    <span className="truncate text-xs text-muted-foreground">{r.isDraft ? "Draft" : "Saved"}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {hasQuery && learnResults.length > 0 && (
            <CommandGroup heading="Learn">
              {learnResults.map((r) => {
                const Icon = LEARN_RESULT_ICONS[r.type];
                return (
                  <CommandItem key={`learn-${r.type}-${r.id}`} value={`learn-${r.type}-${r.id}`} onSelect={() => go(r.href)}>
                    <Icon className="size-4" />
                    <div className="flex min-w-0 flex-col">
                      <span className="truncate">{r.title}</span>
                      <span className="truncate text-xs text-muted-foreground">{r.subtitle}</span>
                    </div>
                  </CommandItem>
                );
              })}
            </CommandGroup>
          )}

          {hasQuery && conversionResults.length > 0 && (
            <CommandGroup heading="File Converter">
              {conversionResults.map(({ pair, fromFmt, toFmt }) => (
                <CommandItem key={`convert-${pair.from}-${pair.to}`} value={`convert-${pair.from}-${pair.to}`} onSelect={() => go(`/convert?from=${pair.from}&to=${pair.to}`)}>
                  <RefreshCw className="size-4" />
                  <span className="truncate">{fromFmt.label}</span>
                  <ArrowRight className="size-3.5 shrink-0 text-muted-foreground" />
                  <span className="truncate">{toFmt.label}</span>
                  {pair.requiresBackend && <span className="ml-auto shrink-0 text-xs text-muted-foreground">Coming soon</span>}
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {hasQuery && jobResults.length > 0 && (
            <CommandGroup heading="Jobs">
              {jobResults.map((job) => (
                <CommandItem key={`job-${job.id}`} value={`job-${job.id}`} onSelect={() => go(`/jobs/${job.id}`)}>
                  <Briefcase className="size-4" />
                  <div className="flex min-w-0 flex-col">
                    <span className="truncate">{job.title}</span>
                    <span className="truncate text-xs text-muted-foreground">{job.companyName}</span>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  );
}
