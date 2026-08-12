"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Calculator as CalculatorIcon,
  History as HistoryIcon,
  Settings as SettingsIcon,
  Pin,
  PinOff,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useQuickCalculatorStore, type CalculatorMode } from "@/lib/quick-calculator/store";
import { useCalculator } from "@/lib/quick-calculator/use-calculator";
import { CalculatorDisplay } from "./calculator-display";
import { CalculatorKeypad } from "./calculator-keypad";
import { ScientificKeypad } from "./scientific-keypad";
import { HistoryPanel } from "./history-panel";
import { SettingsPanel } from "./settings-panel";

type Viewport = "desktop" | "tablet" | "mobile";
type Panel = "keypad" | "history" | "settings";

const PANEL_WIDTH = 380;

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

export function QuickCalculator() {
  const isOpen = useQuickCalculatorStore((s) => s.isOpen);
  const isPinned = useQuickCalculatorStore((s) => s.isPinned);
  const close = useQuickCalculatorStore((s) => s.close);
  const toggleOpen = useQuickCalculatorStore((s) => s.toggleOpen);
  const togglePinned = useQuickCalculatorStore((s) => s.togglePinned);
  const mode = useQuickCalculatorStore((s) => s.mode);
  const setMode = useQuickCalculatorStore((s) => s.setMode);

  const calc = useCalculator();
  const viewport = useViewport();
  const [mounted, setMounted] = React.useState(false);
  const [panel, setPanel] = React.useState<Panel>("keypad");
  const [position, setPosition] = React.useState<{ top: number; left: number } | null>(null);

  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time mount guard for portal + SSR safety
  React.useEffect(() => setMounted(true), []);

  // Anchor the desktop popup under the trigger each time it opens.
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
    // eslint-disable-next-line react-hooks/set-state-in-effect -- reset to the keypad view each time the popup closes
    if (!isOpen) setPanel("keypad");
  }, [isOpen]);

  // Global shortcut: Ctrl+Shift+C. Note: some browsers (Chrome) reserve this combo for
  // DevTools' element inspector at the OS/browser-chrome level and never deliver the
  // keydown to the page, so this listener is a best-effort — it works in Firefox/Safari
  // and whenever Chrome doesn't intercept it first.
  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "c") {
        e.preventDefault();
        toggleOpen();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [toggleOpen]);

  // Outside click + Escape + calculator keyboard input, only while open. Reads the
  // calculator via a ref (rather than depending on `calc` directly) so this listener
  // doesn't get torn down and rebuilt on every keystroke — `calc` is a fresh object
  // every render.
  const calcRef = React.useRef(calc);
  const isPinnedRef = React.useRef(isPinned);
  React.useEffect(() => {
    calcRef.current = calc;
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

      const calc = calcRef.current;
      const a = calc.actions;
      if (/^[0-9]$/.test(e.key)) {
        e.preventDefault();
        a.digit(e.key);
      } else if (e.key === ".") {
        e.preventDefault();
        a.decimal();
      } else if (e.key === "+") {
        e.preventDefault();
        a.operator("+");
      } else if (e.key === "-") {
        e.preventDefault();
        a.operator("-");
      } else if (e.key === "*") {
        e.preventDefault();
        a.operator("×");
      } else if (e.key === "/") {
        e.preventDefault();
        a.operator("÷");
      } else if (e.key === "%") {
        e.preventDefault();
        a.percent();
      } else if (e.key === "^") {
        e.preventDefault();
        a.operator("^");
      } else if (e.key === "(") {
        e.preventDefault();
        a.openParen();
      } else if (e.key === ")") {
        e.preventDefault();
        a.closeParen();
      } else if (e.key === "Enter" || e.key === "=") {
        e.preventDefault();
        a.equals();
      } else if (e.key === "Backspace") {
        e.preventDefault();
        a.backspace();
      } else if (e.key === "Delete") {
        e.preventDefault();
        a.clearAll();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        calc.recallHistory("up");
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        calc.recallHistory("down");
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, close]);

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
          <CalculatorIcon className="size-3.5" />
        </div>
        <p className="flex-1 text-sm font-semibold">Quick Calculator</p>
        <Button
          variant="ghost"
          size="icon"
          className={cn("size-7", panel === "history" && "bg-foreground/10")}
          aria-label="History"
          onClick={() => setPanel((p) => (p === "history" ? "keypad" : "history"))}
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
          onClick={() => setPanel((p) => (p === "settings" ? "keypad" : "settings"))}
        >
          <SettingsIcon className="size-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="size-7" aria-label="Close" onClick={close}>
          <X className="size-3.5" />
        </Button>
      </div>

      <div className="flex gap-1 px-4 pb-2">
        {(["basic", "scientific"] as CalculatorMode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={cn(
              "rounded-lg px-2.5 py-1 text-xs font-medium capitalize transition-colors",
              mode === m ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"
            )}
          >
            {m}
          </button>
        ))}
      </div>

      <div className="max-h-[70dvh] overflow-y-auto scrollbar-thin px-4 pb-4">
        <CalculatorDisplay calc={calc} />
        <div className="mt-3">
          {panel === "history" && <HistoryPanel calc={calc} />}
          {panel === "settings" && <SettingsPanel calc={calc} />}
          {panel === "keypad" && (
            <div className="flex flex-col gap-2">
              {mode === "scientific" && <ScientificKeypad calc={calc} />}
              <CalculatorKeypad calc={calc} />
            </div>
          )}
        </div>
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
        aria-label="Quick Calculator"
        title="Quick Calculator (Ctrl+Shift+C)"
        onClick={toggleOpen}
      >
        <CalculatorIcon className="size-4" />
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
