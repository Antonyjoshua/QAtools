"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Globe as GlobeIcon, History as HistoryIcon, Settings as SettingsIcon, Pin, PinOff, X, ArrowLeftRight, Clock, CalendarClock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useQuickTimezoneStore } from "@/lib/timezone/store";
import type { TimezoneTab } from "@/lib/timezone/types";
import { TimezoneConverter } from "./timezone-converter";
import { WorldClock } from "./world-clock";
import { MeetingPlanner } from "./meeting-planner";
import { ConversionHistory } from "./conversion-history";
import { TimezoneSettingsPanel } from "./timezone-settings-panel";

type Viewport = "desktop" | "tablet" | "mobile";
type Panel = "content" | "history" | "settings";

const PANEL_WIDTH = 480;

const TABS: { id: TimezoneTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "converter", label: "Converter", icon: ArrowLeftRight },
  { id: "worldclock", label: "World Clock", icon: Clock },
  { id: "meeting", label: "Meeting Planner", icon: CalendarClock },
];

function useViewport(): Viewport {
  const [viewport, setViewport] = React.useState<Viewport>("desktop");
  React.useEffect(() => {
    function update() {
      const w = window.innerWidth;
      setViewport(w < 640 ? "mobile" : w < 1024 ? "tablet" : "desktop");
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  return viewport;
}

export function QuickTimezone() {
  const isOpen = useQuickTimezoneStore((s) => s.isOpen);
  const isPinned = useQuickTimezoneStore((s) => s.isPinned);
  const close = useQuickTimezoneStore((s) => s.close);
  const toggleOpen = useQuickTimezoneStore((s) => s.toggleOpen);
  const togglePinned = useQuickTimezoneStore((s) => s.togglePinned);
  const activeTab = useQuickTimezoneStore((s) => s.activeTab);
  const setActiveTab = useQuickTimezoneStore((s) => s.setActiveTab);

  const viewport = useViewport();
  const [mounted, setMounted] = React.useState(false);
  const [panel, setPanel] = React.useState<Panel>("content");
  const [position, setPosition] = React.useState<{ top: number; left: number } | null>(null);

  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time mount guard for portal + SSR safety
  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    if (isOpen && viewport === "desktop" && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const left = Math.min(Math.max(8, rect.right - PANEL_WIDTH), window.innerWidth - PANEL_WIDTH - 8);
      setPosition({ top: rect.bottom + 10, left });
    } else {
      setPosition(null);
    }
  }, [isOpen, viewport]);

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset to the main view each time the popup closes
    if (!isOpen) setPanel("content");
  }, [isOpen]);

  const isPinnedRef = React.useRef(isPinned);
  React.useEffect(() => {
    isPinnedRef.current = isPinned;
  });

  React.useEffect(() => {
    if (!isOpen) return;

    function onPointerDown(e: PointerEvent) {
      if (isPinnedRef.current) return;
      const target = e.target as Node;
      if (panelRef.current?.contains(target)) return;
      if (triggerRef.current?.contains(target)) return;
      // Popover/Select dropdowns (e.g. the timezone search combobox) portal to document.body
      // as siblings of panelRef, not descendants, so `contains()` above can't see clicks
      // inside them — check for their content wrapper explicitly instead.
      if (target instanceof HTMLElement && target.closest('[data-slot="popover-content"], [data-slot="select-content"]')) return;
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

  // Global shortcut: Ctrl+Shift+Z. Works even while the popup is closed.
  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "z") {
        e.preventDefault();
        toggleOpen();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [toggleOpen]);

  const dragConstraints = React.useMemo(
    () =>
      position
        ? {
            left: 8 - position.left,
            right: Math.max(8, window.innerWidth - PANEL_WIDTH - 8) - position.left,
            top: 8 - position.top,
            bottom: Math.max(8, window.innerHeight - 160) - position.top,
          }
        : undefined,
    [position]
  );

  const panelBody = (
    <>
      <div className="flex items-center gap-2 px-4 pt-3.5 pb-2.5 cursor-grab active:cursor-grabbing">
        <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-primary to-[#8B5CF6] text-white">
          <GlobeIcon className="size-3.5" />
        </div>
        <p className="flex-1 text-sm font-semibold">Timezone Converter</p>
        <Button
          variant="ghost"
          size="icon"
          className={cn("size-7", panel === "history" && "bg-foreground/10")}
          aria-label="History"
          onClick={() => setPanel((p) => (p === "history" ? "content" : "history"))}
        >
          <HistoryIcon className="size-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={cn("size-7", isPinned && "text-primary")}
          aria-label={isPinned ? "Unpin" : "Pin"}
          onClick={togglePinned}
        >
          {isPinned ? <Pin className="size-3.5 fill-current" /> : <PinOff className="size-3.5" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={cn("size-7", panel === "settings" && "bg-foreground/10")}
          aria-label="Settings"
          onClick={() => setPanel((p) => (p === "settings" ? "content" : "settings"))}
        >
          <SettingsIcon className="size-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="size-7" aria-label="Close" onClick={close}>
          <X className="size-3.5" />
        </Button>
      </div>

      {panel === "content" && (
        <div className="flex gap-1 px-4 pb-2">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium transition-colors",
                activeTab === tab.id ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <tab.icon className="size-3.5" />
              {tab.label}
            </button>
          ))}
        </div>
      )}

      <div className="max-h-[70dvh] overflow-y-auto scrollbar-thin px-4 pb-4">
        {panel === "history" && <ConversionHistory />}
        {panel === "settings" && <TimezoneSettingsPanel />}
        {panel === "content" && (
          <>
            {activeTab === "converter" && <TimezoneConverter />}
            {activeTab === "worldclock" && <WorldClock />}
            {activeTab === "meeting" && <MeetingPlanner />}
          </>
        )}
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
        aria-label="Timezone Converter"
        title="Timezone Converter (Ctrl+Shift+Z)"
        onClick={toggleOpen}
      >
        <GlobeIcon className="size-4" />
      </Button>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <React.Fragment>
                {viewport !== "desktop" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[95] bg-black/40 backdrop-blur-[2px]"
                    onClick={() => !isPinned && close()}
                  />
                )}

                {viewport === "desktop" && position && (
                  <motion.div
                    ref={panelRef}
                    drag
                    dragMomentum={false}
                    dragConstraints={dragConstraints}
                    dragElastic={0}
                    initial={{ opacity: 0, scale: 0.94, y: -8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.96, y: -6 }}
                    transition={{ type: "spring", stiffness: 420, damping: 32 }}
                    style={{ position: "fixed", top: position.top, left: position.left, width: PANEL_WIDTH }}
                    className="z-[100] overflow-hidden rounded-2xl border border-border/70 bg-background/85 shadow-2xl shadow-black/20 backdrop-blur-xl supports-backdrop-filter:bg-background/70"
                  >
                    {panelBody}
                  </motion.div>
                )}

                {viewport === "tablet" && (
                  <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <motion.div
                      ref={panelRef}
                      initial={{ opacity: 0, scale: 0.92 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.94 }}
                      transition={{ type: "spring", stiffness: 420, damping: 32 }}
                      style={{ width: PANEL_WIDTH }}
                      className="overflow-hidden rounded-2xl border border-border/70 bg-background/90 shadow-2xl shadow-black/25 backdrop-blur-xl supports-backdrop-filter:bg-background/75"
                    >
                      {panelBody}
                    </motion.div>
                  </div>
                )}

                {viewport === "mobile" && (
                  <motion.div
                    ref={panelRef}
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ type: "spring", stiffness: 380, damping: 34 }}
                    className="fixed inset-x-0 bottom-0 z-[100] w-full overflow-hidden rounded-t-3xl border-t border-border/70 bg-background/95 shadow-2xl shadow-black/30 backdrop-blur-xl supports-backdrop-filter:bg-background/85"
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
