"use client";

import * as React from "react";
import Link from "next/link";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X, Send, ExternalLink, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogoMark } from "@/components/logo-mark";
import { useHelpChatStore } from "@/lib/help/chat-store";
import { getStarterQuestions } from "@/lib/help/search";
import { resolveHelpAnswer } from "@/lib/help/resolve-answer";
import type { HelpEntry } from "@/lib/help/types";
import type { ChatTurn, HelpAnswer } from "@/lib/help/providers/types";

const PANEL_WIDTH = 380;

interface ChatMessage {
  id: string;
  role: "user" | "bot";
  text?: string; // user turns
  answer?: HelpAnswer; // bot turns
}

function genId(): string {
  return Math.random().toString(36).slice(2);
}

/** Flattens an answer to plain text for conversation-history purposes (what a future AI
 * provider would see as "what did the assistant say last turn"). */
function answerToPlainText(answer: HelpAnswer): string {
  if (answer.kind === "kb") return `${answer.entry.question}\n${answer.entry.steps.join("\n")}`;
  return answer.text;
}

function AnswerBubble({ match, alternatives, onAsk }: { match: HelpEntry; alternatives: HelpEntry[]; onAsk: (q: string) => void }) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl rounded-tl-sm border border-border bg-card p-3 text-sm">
      <span className="w-fit rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-medium tracking-wide text-primary uppercase">{match.module}</span>
      <p className="font-medium">{match.question}</p>
      <ol className="flex flex-col gap-1 pl-4 text-xs text-muted-foreground marker:text-foreground/60">
        {match.steps.map((step, i) => (
          <li key={i} className="list-decimal pl-1 leading-relaxed">
            {step}
          </li>
        ))}
      </ol>
      {match.tip && (
        <p className="rounded-lg bg-muted/50 p-2 text-[11px] text-muted-foreground">
          <span className="font-medium text-foreground">Tip: </span>
          {match.tip}
        </p>
      )}
      {match.link && (
        <Link href={match.link.href} className="flex w-fit items-center gap-1 text-xs font-medium text-primary hover:underline">
          {match.link.label}
          <ExternalLink className="size-3" />
        </Link>
      )}
      {alternatives.length > 0 && (
        <div className="mt-1 flex flex-col gap-1 border-t border-border/70 pt-2">
          <p className="text-[10px] text-muted-foreground">Related:</p>
          <div className="flex flex-wrap gap-1.5">
            {alternatives.map((alt) => (
              <button
                key={alt.id}
                type="button"
                onClick={() => onAsk(alt.question)}
                className="rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground hover:bg-accent/50"
              >
                {alt.question}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Renders a free-text answer with its grounding sources — dormant today (AI_PROVIDER is null, so
// resolveHelpAnswer() never actually produces a "text" answer yet), but the bubble is built and
// styled now so wiring in a real model later is a data change, not a UI change.
function TextAnswerBubble({ text, sources, onAsk }: { text: string; sources: HelpEntry[]; onAsk: (q: string) => void }) {
  return (
    <div className="flex flex-col gap-2 rounded-2xl rounded-tl-sm border border-border bg-card p-3 text-sm">
      <p className="leading-relaxed whitespace-pre-wrap">{text}</p>
      {sources.length > 0 && (
        <div className="mt-1 flex flex-col gap-1 border-t border-border/70 pt-2">
          <p className="text-[10px] text-muted-foreground">Based on:</p>
          <div className="flex flex-wrap gap-1.5">
            {sources.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => onAsk(s.question)}
                className="rounded-full border border-border px-2 py-0.5 text-[11px] text-muted-foreground hover:bg-accent/50"
              >
                {s.question}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function HelpChatWidget() {
  const isOpen = useHelpChatStore((s) => s.isOpen);
  const close = useHelpChatStore((s) => s.close);
  const toggleOpen = useHelpChatStore((s) => s.toggleOpen);

  const [mounted, setMounted] = React.useState(false);
  const [isDesktop, setIsDesktop] = React.useState(true);
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [input, setInput] = React.useState("");
  const [isThinking, setIsThinking] = React.useState(false);
  const [panelPos, setPanelPos] = React.useState<{ left: number; anchor: "top" | "bottom"; value: number; maxHeight: number } | null>(null);

  const panelRef = React.useRef<HTMLDivElement>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);
  // A dragged element still sits under the cursor at release, so the browser fires a native click
  // there too — without this guard, every drag also toggles the panel open/closed.
  const draggedTriggerRef = React.useRef(false);
  const dragBoundsRef = React.useRef<HTMLDivElement>(null);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time mount guard for portal + SSR safety
  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    function update() {
      setIsDesktop(window.innerWidth >= 640);
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // The trigger bubble is itself draggable (see below), so the panel opens relative to wherever
  // it currently is on screen — not a fixed spot — recomputed via getBoundingClientRect(), which
  // correctly reflects the bubble's current position even after a framer-motion drag transform.
  // It flips to whichever side (above/below the bubble) has more room, since the bubble could now
  // be anywhere on screen, including near the top where "always open above" would push the panel
  // off-screen.
  React.useEffect(() => {
    if (isOpen && isDesktop && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const gap = 10;
      const edgeMargin = 8;
      const left = Math.min(Math.max(edgeMargin, rect.left), window.innerWidth - PANEL_WIDTH - edgeMargin);
      const spaceBelow = window.innerHeight - rect.bottom - gap - edgeMargin;
      const spaceAbove = rect.top - gap - edgeMargin;
      const genericCap = window.innerHeight * 0.7;
      if (spaceBelow >= spaceAbove) {
        setPanelPos({ left, anchor: "top", value: rect.bottom + gap, maxHeight: Math.max(200, Math.min(genericCap, spaceBelow)) });
      } else {
        setPanelPos({ left, anchor: "bottom", value: window.innerHeight - rect.top + gap, maxHeight: Math.max(200, Math.min(genericCap, spaceAbove)) });
      }
    } else {
      setPanelPos(null);
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

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isThinking]);

  async function ask(question: string) {
    const trimmed = question.trim();
    if (!trimmed || isThinking) return;

    const history: ChatTurn[] = messages.map((m) => ({
      role: m.role === "user" ? "user" : "assistant",
      text: m.role === "user" ? (m.text ?? "") : answerToPlainText(m.answer!),
    }));

    setMessages((prev) => [...prev, { id: genId(), role: "user", text: trimmed }]);
    setInput("");
    setIsThinking(true);
    const answer = await resolveHelpAnswer(trimmed, history);
    setMessages((prev) => [...prev, { id: genId(), role: "bot", answer }]);
    setIsThinking(false);
  }

  const starters = getStarterQuestions();

  const panelBody = (
    <>
      <div className="flex cursor-grab items-center gap-2 px-4 pt-3.5 pb-2.5 active:cursor-grabbing">
        <LogoMark className="size-6 shrink-0" />
        <p className="flex-1 text-sm font-semibold">QuanGrade Assistant</p>
        <Button variant="ghost" size="icon" className="size-7" aria-label="Close" onClick={close}>
          <X className="size-3.5" />
        </Button>
      </div>

      <div ref={scrollRef} className="flex min-h-40 flex-1 flex-col gap-3 overflow-y-auto scrollbar-thin px-4 py-2">
        {messages.length === 0 && (
          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-2 rounded-2xl rounded-tl-sm border border-border bg-card p-3 text-sm">
              <Sparkles className="mt-0.5 size-3.5 shrink-0 text-primary" />
              <p>
                Hi! Ask me how to do something in QuanGrade — e.g. <span className="font-medium">&ldquo;how do I add a note&rdquo;</span>. I answer
                from a built-in help guide, entirely offline.
              </p>
            </div>
            <div className="flex flex-col gap-1.5">
              {starters.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => void ask(s.question)}
                  className="rounded-lg border border-border px-3 py-1.5 text-left text-xs text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                >
                  {s.question}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((m) =>
          m.role === "user" ? (
            <div key={m.id} className="flex justify-end">
              <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-primary px-3 py-2 text-sm text-primary-foreground">{m.text}</div>
            </div>
          ) : m.answer!.kind === "kb" ? (
            <AnswerBubble key={m.id} match={m.answer!.entry} alternatives={m.answer!.alternatives} onAsk={(q) => void ask(q)} />
          ) : m.answer!.kind === "text" ? (
            <TextAnswerBubble key={m.id} text={m.answer!.text} sources={m.answer!.sources} onAsk={(q) => void ask(q)} />
          ) : (
            <div key={m.id} className="rounded-2xl rounded-tl-sm border border-border bg-card p-3 text-sm text-muted-foreground">
              {m.answer!.text}
            </div>
          )
        )}

        {isThinking && (
          <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm border border-border bg-card px-3 py-2.5 text-sm">
            <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
            <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
            <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground" />
          </div>
        )}
      </div>

      <form
        className="flex items-center gap-1.5 border-t border-border/70 px-3 py-2.5"
        onSubmit={(e) => {
          e.preventDefault();
          void ask(input);
        }}
      >
        <Input
          autoFocus
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask how to do something…"
          className="h-8 text-sm"
        />
        <Button type="submit" size="icon" className="size-8 shrink-0" aria-label="Send" disabled={!input.trim() || isThinking}>
          <Send className="size-3.5" />
        </Button>
      </form>
    </>
  );

  return (
    <>
      {mounted &&
        createPortal(
          <>
            {/* Invisible viewport-sized bounds so both the collapsed bubble and the open panel can
                be dragged anywhere on screen without manual position math — framer-motion measures
                this container's rect directly. */}
            {isDesktop && <div ref={dragBoundsRef} className="pointer-events-none fixed inset-4 z-[99]" />}

            <motion.div
              drag={isDesktop}
              dragMomentum={false}
              dragElastic={0}
              dragConstraints={dragBoundsRef}
              onDragStart={() => {
                draggedTriggerRef.current = true;
              }}
              // Bottom-left, not bottom-right — Next.js's own dev-mode indicator badge lives in the
              // bottom-right corner and would otherwise sit on top of / intercept clicks on a
              // bottom-right FAB.
              className={cn("fixed bottom-5 left-5 z-[100]", isOpen && "opacity-0 pointer-events-none")}
              style={{ touchAction: "none" }}
            >
              <Button
                ref={triggerRef}
                size="icon"
                className="size-12 cursor-grab rounded-full border border-border/70 bg-background p-2 shadow-lg shadow-black/10 hover:bg-muted active:cursor-grabbing"
                aria-label="Open help assistant"
                title="QuanGrade Assistant — drag to move"
                onClick={() => {
                  // A drag ends with the pointer still over this element, so the browser fires a
                  // click here too — swallow that one click rather than toggling the panel.
                  if (draggedTriggerRef.current) {
                    draggedTriggerRef.current = false;
                    return;
                  }
                  toggleOpen();
                }}
              >
                <LogoMark className="size-full" />
              </Button>
            </motion.div>

            <AnimatePresence>
              {isOpen && isDesktop && panelPos && (
                <motion.div
                  ref={panelRef}
                  drag
                  dragMomentum={false}
                  dragElastic={0}
                  dragConstraints={dragBoundsRef}
                  initial={{ opacity: 0, scale: 0.94, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: 8 }}
                  transition={{ type: "spring", stiffness: 420, damping: 32 }}
                  style={{
                    position: "fixed",
                    [panelPos.anchor]: panelPos.value,
                    left: panelPos.left,
                    width: PANEL_WIDTH,
                    maxHeight: panelPos.maxHeight,
                  }}
                  className="z-[100] flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-background/95 shadow-2xl shadow-black/20 backdrop-blur-xl supports-backdrop-filter:bg-background/90"
                >
                  {panelBody}
                </motion.div>
              )}
              {isOpen && !isDesktop && (
                <React.Fragment>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[95] bg-black/40 backdrop-blur-[2px]"
                    onClick={close}
                  />
                  <motion.div
                    ref={panelRef}
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ type: "spring", stiffness: 380, damping: 34 }}
                    className="fixed inset-x-0 bottom-0 z-[100] flex max-h-[85dvh] w-full flex-col overflow-hidden rounded-t-3xl border-t border-border/70 bg-background/95 shadow-2xl shadow-black/30 backdrop-blur-xl supports-backdrop-filter:bg-background/90"
                  >
                    <div className="flex justify-center pt-2">
                      <div className="h-1 w-9 rounded-full bg-foreground/15" />
                    </div>
                    {panelBody}
                  </motion.div>
                </React.Fragment>
              )}
            </AnimatePresence>
          </>,
          document.body
        )}
    </>
  );
}
