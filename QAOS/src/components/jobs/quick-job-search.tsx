"use client";

import * as React from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
import { useLiveQuery } from "dexie-react-hooks";
import { AnimatePresence, motion } from "framer-motion";
import { Briefcase, ExternalLink, Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/lib/jobs/db";
import { ensureSeeded } from "@/lib/jobs/seed";
import { applyFilters } from "@/lib/jobs/repo";
import { emptyFilterState } from "@/lib/jobs/types";
import { useQuickJobSearchStore } from "@/lib/jobs/quick-tool-store";
import { RemoteBadge } from "@/components/jobs/shared/badges";
import { CompanyLogo } from "@/components/jobs/shared/company-logo";
import { formatExperience } from "@/lib/jobs/format";
import type { Job } from "@/lib/jobs/types";

const PANEL_WIDTH = 420;
const EMPTY_JOBS: Job[] = [];

export function QuickJobSearch() {
  const isOpen = useQuickJobSearchStore((s) => s.isOpen);
  const close = useQuickJobSearchStore((s) => s.close);
  const toggleOpen = useQuickJobSearchStore((s) => s.toggleOpen);

  const [query, setQuery] = React.useState("");
  const [mounted, setMounted] = React.useState(false);
  const [isDesktop, setIsDesktop] = React.useState(true);
  const [position, setPosition] = React.useState<{ top: number; left: number } | null>(null);

  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time mount guard for portal + SSR safety
  React.useEffect(() => setMounted(true), []);
  React.useEffect(() => {
    ensureSeeded();
  }, []);

  React.useEffect(() => {
    function update() {
      setIsDesktop(window.innerWidth >= 1024);
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  React.useEffect(() => {
    if (isOpen && isDesktop && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const left = Math.min(Math.max(8, rect.right - PANEL_WIDTH), window.innerWidth - PANEL_WIDTH - 8);
      setPosition({ top: rect.bottom + 10, left });
    } else {
      setPosition(null);
    }
  }, [isOpen, isDesktop]);

  React.useEffect(() => {
    if (!isOpen) return;
    function onPointerDown(e: PointerEvent) {
      const target = e.target as Node;
      if (panelRef.current?.contains(target) || triggerRef.current?.contains(target)) return;
      close();
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") close();
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, close]);

  const jobs = useLiveQuery(() => db.jobs.toArray(), []) ?? EMPTY_JOBS;
  const results = React.useMemo(() => {
    if (!query.trim()) return [];
    const filters = emptyFilterState();
    filters.query = query;
    return applyFilters(jobs, filters).slice(0, 5);
  }, [jobs, query]);

  const panelBody = (
    <>
      <div className="flex items-center gap-2 px-4 pt-3.5 pb-2.5">
        <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-primary to-[#8B5CF6] text-white">
          <Briefcase className="size-3.5" />
        </div>
        <p className="flex-1 text-sm font-semibold">Quick Job Search</p>
        <Button variant="ghost" size="icon" className="size-7" aria-label="Close" onClick={close}>
          <X className="size-3.5" />
        </Button>
      </div>

      <div className="flex flex-col gap-3 px-4 pb-4">
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input autoFocus value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Playwright remote India" className="pl-9" />
        </div>

        <div className="max-h-[50dvh] overflow-y-auto scrollbar-thin">
          {query.trim() && results.length === 0 && <p className="py-6 text-center text-xs text-muted-foreground">No matching jobs.</p>}
          <div className="flex flex-col gap-1.5">
            {results.map((job) => (
              <Link
                key={job.id}
                href={`/jobs/${job.id}`}
                onClick={close}
                className="flex items-center gap-2.5 rounded-lg p-2 text-left hover:bg-muted"
              >
                <CompanyLogo initials={job.companyLogoInitials} color={job.companyLogoColor} className="size-8 text-xs" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium">{job.title}</p>
                  <p className="truncate text-[11px] text-muted-foreground">{job.companyName}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-0.5">
                  <RemoteBadge value={job.remoteStatus} className="text-[9px]" />
                  <span className="text-[10px] text-muted-foreground">{formatExperience(job)}</span>
                </div>
              </Link>
            ))}
          </div>
          {!query.trim() && <p className="py-6 text-center text-xs text-muted-foreground">Search by title, skill, or company.</p>}
        </div>
      </div>

      <div className="border-t border-border/70 px-4 py-2.5">
        <Link
          href={query.trim() ? `/jobs?q=${encodeURIComponent(query.trim())}` : "/jobs"}
          onClick={close}
          className="flex items-center justify-center gap-1.5 text-xs font-medium text-primary hover:underline"
        >
          View All Jobs
          <ExternalLink className="size-3" />
        </Link>
      </div>
    </>
  );

  return (
    <>
      <Button
        ref={triggerRef}
        variant="ghost"
        size="icon"
        className={cn("size-8", isOpen && "bg-foreground/10")}
        aria-label="Quick Job Search"
        title="Quick Job Search"
        onClick={toggleOpen}
      >
        <Briefcase className="size-4" />
      </Button>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <React.Fragment>
                {!isDesktop && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[95] bg-black/40 backdrop-blur-[2px]"
                    onClick={close}
                  />
                )}

                {isDesktop && position && (
                  <motion.div
                    ref={panelRef}
                    initial={{ opacity: 0, scale: 0.94, y: -8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, y: -6 }}
                    transition={{ type: "spring", stiffness: 420, damping: 32 }}
                    style={{ position: "fixed", top: position.top, left: position.left, width: PANEL_WIDTH }}
                    className="z-[100] overflow-hidden rounded-2xl border border-border/70 bg-background/95 shadow-2xl shadow-black/20 backdrop-blur-xl supports-backdrop-filter:bg-background/90"
                  >
                    {panelBody}
                  </motion.div>
                )}

                {!isDesktop && (
                  <motion.div
                    ref={panelRef}
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ type: "spring", stiffness: 380, damping: 34 }}
                    className="fixed inset-x-0 bottom-0 z-[100] max-h-[85dvh] w-full overflow-hidden rounded-t-3xl border-t border-border/70 bg-background/95 shadow-2xl shadow-black/30 backdrop-blur-xl supports-backdrop-filter:bg-background/90"
                  >
                    <div className="flex justify-center pt-2">
                      <div className="h-1 w-9 rounded-full bg-foreground/15" />
                    </div>
                    {panelBody}
                  </motion.div>
                )}
              </React.Fragment>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
