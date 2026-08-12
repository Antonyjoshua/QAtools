"use client";

import * as React from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink, History, Hourglass, RotateCcw, Search, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuickDurationStore } from "@/lib/duration/quick-tool-store";
import { useDurationHistoryStore } from "@/lib/duration/history-store";
import { parseQuickExpression, type QuickCalcResult } from "@/lib/duration/quick-expression";
import { ConvertPanel } from "./convert-panel";
import { CalculatePanel } from "./calculate-panel";
import { ResultCard } from "./shared";

const PANEL_WIDTH = 400;

export function QuickDurationConverter() {
  const isOpen = useQuickDurationStore((s) => s.isOpen);
  const close = useQuickDurationStore((s) => s.close);
  const toggleOpen = useQuickDurationStore((s) => s.toggleOpen);

  const history = useDurationHistoryStore((s) => s.history);
  const pushEntry = useDurationHistoryStore((s) => s.pushEntry);
  const clearHistory = useDurationHistoryStore((s) => s.clearHistory);

  const [quickInput, setQuickInput] = React.useState("");
  const [quickResult, setQuickResult] = React.useState<QuickCalcResult | null>(null);
  const [tab, setTab] = React.useState<"convert" | "calculate">("convert");
  const [resetKey, setResetKey] = React.useState(0);

  const [mounted, setMounted] = React.useState(false);
  const [isDesktop, setIsDesktop] = React.useState(true);
  const [position, setPosition] = React.useState<{ top: number; left: number } | null>(null);

  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time mount guard for portal + SSR safety
  React.useEffect(() => setMounted(true), []);

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

  const runQuickCalc = React.useCallback(() => {
    if (!quickInput.trim()) return;
    const result = parseQuickExpression(quickInput);
    setQuickResult(result);
    if (result.success) {
      pushEntry({ expression: result.expressionText, result: result.resultText });
    }
  }, [quickInput, pushEntry]);

  React.useEffect(() => {
    if (!isOpen) return;
    function onPointerDown(e: PointerEvent) {
      const target = e.target as Node;
      if (panelRef.current?.contains(target) || triggerRef.current?.contains(target)) return;
      close();
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        close();
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        runQuickCalc();
        return;
      }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "c") {
        const hasSelection = (window.getSelection()?.toString().length ?? 0) > 0;
        if (hasSelection) return;
        const copyBtn = panelRef.current?.querySelector<HTMLButtonElement>("[data-duration-result] button");
        if (copyBtn) {
          e.preventDefault();
          copyBtn.click();
        }
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [isOpen, close, runQuickCalc]);

  function handleReset() {
    setQuickInput("");
    setQuickResult(null);
    setResetKey((k) => k + 1);
  }

  function handlePanelResult(expression: string, result: string) {
    pushEntry({ expression, result });
  }

  const panelBody = (
    <>
      <div className="flex items-center gap-2 px-4 pt-3.5 pb-2.5">
        <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-primary to-[#8B5CF6] text-white">
          <Hourglass className="size-3.5" />
        </div>
        <p className="flex-1 text-sm font-semibold">Duration Converter</p>
        <Button variant="ghost" size="icon" className="size-7" aria-label="Close" onClick={close}>
          <X className="size-3.5" />
        </Button>
      </div>

      <div className="max-h-[75dvh] overflow-y-auto scrollbar-thin px-4 pb-4">
        <div className="flex flex-col gap-2">
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              autoFocus
              value={quickInput}
              onChange={(e) => setQuickInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") runQuickCalc();
              }}
              placeholder="What do you want to calculate?"
              className="pl-8 text-sm"
            />
          </div>
          <p className="text-[10px] text-muted-foreground">e.g. &ldquo;54 sec × 50 questions&rdquo;, &ldquo;45 min ÷ 50 questions&rdquo;, &ldquo;2 hr + 35 min&rdquo;, &ldquo;5000 ms → seconds&rdquo;</p>

          {quickResult &&
            (quickResult.success ? (
              <ResultCard
                title={quickResult.expressionText}
                value={quickResult.resultText}
                detail={quickResult.detailText}
                copyText={`${quickResult.expressionText} = ${quickResult.resultText}`}
              />
            ) : (
              <p className="rounded-lg border border-destructive/30 bg-destructive/5 p-2.5 text-xs text-destructive">{quickResult.error}</p>
            ))}
        </div>

        <div className="my-3 border-t border-border/70" />

        <Tabs value={tab} onValueChange={(v) => v !== null && setTab(v as "convert" | "calculate")}>
          <TabsList className="w-full">
            <TabsTrigger value="convert" className="flex-1">
              Convert
            </TabsTrigger>
            <TabsTrigger value="calculate" className="flex-1">
              Calculate
            </TabsTrigger>
          </TabsList>
          <TabsContent value="convert" className="mt-3">
            <ConvertPanel key={`convert-${resetKey}`} onResult={handlePanelResult} />
          </TabsContent>
          <TabsContent value="calculate" className="mt-3">
            <CalculatePanel key={`calculate-${resetKey}`} onResult={handlePanelResult} />
          </TabsContent>
        </Tabs>

        <div className="mt-3 flex items-center justify-between">
          <Button variant="outline" size="sm" className="h-7 gap-1.5 text-xs" onClick={handleReset}>
            <RotateCcw className="size-3" /> Reset
          </Button>
        </div>

        {history.length > 0 && (
          <div className="mt-3 border-t border-border/70 pt-3">
            <div className="mb-1.5 flex items-center justify-between">
              <p className="flex items-center gap-1.5 text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
                <History className="size-3" /> Recent
              </p>
              <button type="button" onClick={() => clearHistory()} className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-destructive">
                <Trash2 className="size-2.5" /> Clear
              </button>
            </div>
            <div className="flex flex-col gap-0.5">
              {history.map((h) => (
                <div key={h.id} className="truncate rounded-md px-1.5 py-1 text-xs text-muted-foreground hover:bg-muted">
                  <span className="text-foreground">{h.expression}</span> = {h.result}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-border/70 px-4 py-2.5">
        <Link href="/calculator" onClick={close} className="flex items-center justify-center gap-1.5 text-xs font-medium text-primary hover:underline">
          Open Calculator
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
        aria-label="Duration Converter"
        title="Duration Converter"
        onClick={toggleOpen}
      >
        <Hourglass className="size-4" />
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
