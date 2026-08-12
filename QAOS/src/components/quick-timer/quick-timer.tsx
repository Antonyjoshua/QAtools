"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Timer as TimerIcon,
  History as HistoryIcon,
  Settings as SettingsIcon,
  Pin,
  PinOff,
  X,
  Watch,
  Hourglass,
  Coffee,
  Globe2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useQuickTimerStore } from "@/lib/timer/store";
import type { TimerTab } from "@/lib/timer/types";
import { Stopwatch } from "./stopwatch";
import { CountdownTimer } from "./countdown-timer";
import { Pomodoro } from "./pomodoro";
import { WorldClock } from "./world-clock";
import { TimerHistory } from "./timer-history";
import { TimerSettingsPanel } from "./timer-settings-panel";

type Viewport = "desktop" | "tablet" | "mobile";
type Panel = "content" | "history" | "settings";

const PANEL_WIDTH = 420;

const TABS: { id: TimerTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "stopwatch", label: "Stopwatch", icon: Watch },
  { id: "timer", label: "Timer", icon: Hourglass },
  { id: "pomodoro", label: "Pomodoro", icon: Coffee },
  { id: "worldclock", label: "World Clock", icon: Globe2 },
];

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;
}

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

export function QuickTimer() {
  const isOpen = useQuickTimerStore((s) => s.isOpen);
  const isPinned = useQuickTimerStore((s) => s.isPinned);
  const close = useQuickTimerStore((s) => s.close);
  const toggleOpen = useQuickTimerStore((s) => s.toggleOpen);
  const togglePinned = useQuickTimerStore((s) => s.togglePinned);
  const activeTab = useQuickTimerStore((s) => s.activeTab);
  const setActiveTab = useQuickTimerStore((s) => s.setActiveTab);

  const stopwatchRunning = useQuickTimerStore((s) => s.stopwatch.running);
  const countdownRunning = useQuickTimerStore((s) => s.countdown.running);
  const pomodoroRunning = useQuickTimerStore((s) => s.pomodoro.running);
  const anyRunning = stopwatchRunning || countdownRunning || pomodoroRunning;

  const stopwatchStart = useQuickTimerStore((s) => s.stopwatchStart);
  const stopwatchPause = useQuickTimerStore((s) => s.stopwatchPause);
  const stopwatchReset = useQuickTimerStore((s) => s.stopwatchReset);
  const stopwatchLap = useQuickTimerStore((s) => s.stopwatchLap);
  const countdownStart = useQuickTimerStore((s) => s.countdownStart);
  const countdownPause = useQuickTimerStore((s) => s.countdownPause);
  const countdownReset = useQuickTimerStore((s) => s.countdownReset);
  const pomodoroStart = useQuickTimerStore((s) => s.pomodoroStart);
  const pomodoroPause = useQuickTimerStore((s) => s.pomodoroPause);
  const pomodoroResetCycle = useQuickTimerStore((s) => s.pomodoroResetCycle);

  const viewport = useViewport();
  const [mounted, setMounted] = React.useState(false);
  const [panel, setPanel] = React.useState<Panel>("content");
  const [position, setPosition] = React.useState<{ top: number; left: number } | null>(null);

  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time mount guard for portal + SSR safety
  React.useEffect(() => setMounted(true), []);

  // Always-mounted watcher: detects countdown/Pomodoro completion (and fires their sound/
  // notification/history side effects) even while the popup itself is closed, so "keep
  // running when closed" actually delivers a completion alert in the background.
  React.useEffect(() => {
    const interval = setInterval(() => {
      useQuickTimerStore.getState().checkCountdownCompletion();
      useQuickTimerStore.getState().checkPomodoroCompletion();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

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
      close();
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        close();
        return;
      }
      if (isTypingTarget(e.target)) return;

      const s = useQuickTimerStore.getState();
      if (e.key === " ") {
        e.preventDefault();
        if (s.activeTab === "stopwatch") (s.stopwatch.running ? stopwatchPause : stopwatchStart)();
        else if (s.activeTab === "timer") (s.countdown.running ? countdownPause : countdownStart)();
        else if (s.activeTab === "pomodoro") (s.pomodoro.running ? pomodoroPause : pomodoroStart)();
      } else if (e.key.toLowerCase() === "r") {
        if (s.activeTab === "stopwatch") stopwatchReset();
        else if (s.activeTab === "timer") countdownReset();
        else if (s.activeTab === "pomodoro") pomodoroResetCycle();
      } else if (e.key.toLowerCase() === "l") {
        if (s.activeTab === "stopwatch") stopwatchLap();
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- store actions are stable references from zustand
  }, [isOpen, close]);

  // Global shortcut: Ctrl+Shift+T. Works even while the popup is closed.
  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "t") {
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
          <TimerIcon className="size-3.5" />
        </div>
        <p className="flex-1 text-sm font-semibold">Quick Timer</p>
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
        {panel === "history" && <TimerHistory />}
        {panel === "settings" && <TimerSettingsPanel />}
        {panel === "content" && (
          <>
            {activeTab === "stopwatch" && <Stopwatch />}
            {activeTab === "timer" && <CountdownTimer />}
            {activeTab === "pomodoro" && <Pomodoro />}
            {activeTab === "worldclock" && <WorldClock />}
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
        className={cn("relative size-8", isOpen && "bg-foreground/10")}
        aria-label="Quick Timer"
        title="Quick Timer (Ctrl+Shift+T)"
        onClick={toggleOpen}
      >
        <TimerIcon className="size-4" />
        {anyRunning && <span className="absolute top-1.5 right-1.5 size-1.5 animate-pulse rounded-full bg-primary" />}
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
