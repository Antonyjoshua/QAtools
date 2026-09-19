"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useLiveQuery } from "dexie-react-hooks";
import {
  Camera,
  Video,
  Square,
  Download,
  Copy,
  Bug as BugIcon,
  StickyNote,
  RotateCcw,
  Search,
  CheckCircle2,
  Pin,
  PinOff,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useQuickCaptureStore } from "@/lib/capture/store";
import { captureScreenshot, startScreenRecording, formatElapsed, downloadCapture, type ScreenRecordingHandle } from "@/lib/capture/screen-capture";
import { db as bugsDb } from "@/lib/bugs/db";
import { addAttachment as addBugAttachment } from "@/lib/bugs/attachments-repo";
import type { BugReport } from "@/lib/bugs/types";
import { db as notesDb } from "@/lib/notes/db";
import { addAttachment as addNoteAttachment } from "@/lib/notes/attachments-repo";
import type { Note } from "@/lib/notes/types";

const PANEL_WIDTH = 400;

type ResultKind = "screenshot" | "recording" | null;
type AttachTarget = "bug" | "note" | null;

function captureFilename(kind: ResultKind): string {
  return kind === "screenshot" ? `screenshot-${Date.now()}.png` : `recording-${Date.now()}.webm`;
}

export function QuickScreenCapture() {
  const isOpen = useQuickCaptureStore((s) => s.isOpen);
  const isPinned = useQuickCaptureStore((s) => s.isPinned);
  const phase = useQuickCaptureStore((s) => s.phase);
  const elapsedMs = useQuickCaptureStore((s) => s.elapsedMs);
  const close = useQuickCaptureStore((s) => s.close);
  const toggleOpen = useQuickCaptureStore((s) => s.toggleOpen);
  const togglePinned = useQuickCaptureStore((s) => s.togglePinned);

  const [mounted, setMounted] = React.useState(false);
  const [isDesktop, setIsDesktop] = React.useState(true);
  const [position, setPosition] = React.useState<{ top: number; left: number } | null>(null);

  const [isCapturing, setIsCapturing] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [resultBlob, setResultBlob] = React.useState<Blob | null>(null);
  const [resultKind, setResultKind] = React.useState<ResultKind>(null);

  const [attachTarget, setAttachTarget] = React.useState<AttachTarget>(null);
  const [attachQuery, setAttachQuery] = React.useState("");
  const [attachedLabel, setAttachedLabel] = React.useState<string | null>(null);

  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const panelRef = React.useRef<HTMLDivElement>(null);
  // Live capture handles are not serializable and don't belong in the zustand store — held here
  // instead, on the component that owns the in-progress capture.
  const recordingHandleRef = React.useRef<ScreenRecordingHandle | null>(null);
  const recordingStartedAtRef = React.useRef<number | null>(null);

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

  const isPinnedRef = React.useRef(isPinned);
  React.useEffect(() => {
    isPinnedRef.current = isPinned;
  });

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

  // Finalizes a recording in progress — used by both the "Stop Recording" button and by the
  // browser's own native "Stop sharing" control (detected via the video track's onended event
  // wired up in handleStartRecording). Safe to call more than once; the underlying handle.stop()
  // is idempotent, and recordingHandleRef is cleared immediately so a second call is a no-op.
  const finishRecording = React.useCallback(async () => {
    const handle = recordingHandleRef.current;
    if (!handle) return;
    recordingHandleRef.current = null;
    recordingStartedAtRef.current = null;
    try {
      const blob = await handle.stop();
      setResultBlob(blob);
      setResultKind("recording");
    } catch {
      setError("The recording could not be saved.");
    } finally {
      useQuickCaptureStore.getState().setPhase("idle");
      useQuickCaptureStore.getState().setElapsedMs(0);
    }
  }, []);

  // Always-mounted elapsed-time ticker: derives the displayed duration from a wall-clock
  // timestamp (not an incrementing counter) so it can never drift, and keeps ticking even while
  // the popup is closed or the tab is backgrounded — mirrors Quick Timer's own watcher pattern.
  React.useEffect(() => {
    const interval = setInterval(() => {
      if (recordingStartedAtRef.current !== null) {
        useQuickCaptureStore.getState().setElapsedMs(Date.now() - recordingStartedAtRef.current);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  React.useEffect(() => {
    if (!isOpen) return;
    function onPointerDown(e: PointerEvent) {
      if (isPinnedRef.current) return;
      const target = e.target as Node;
      if (panelRef.current?.contains(target) || triggerRef.current?.contains(target)) return;
      // Select/Popover dropdowns portal to document.body as siblings of panelRef, not
      // descendants, so `contains()` above can't see clicks inside them — check for their
      // content wrapper explicitly instead of treating the click as "outside".
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

  const resultUrl = React.useMemo(() => (resultBlob ? URL.createObjectURL(resultBlob) : null), [resultBlob]);
  React.useEffect(() => {
    return () => {
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, [resultUrl]);

  async function handleTakeScreenshot() {
    setError(null);
    setIsCapturing(true);
    try {
      const blob = await captureScreenshot();
      setResultBlob(blob);
      setResultKind("screenshot");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Screenshot failed.");
    } finally {
      setIsCapturing(false);
    }
  }

  async function handleStartRecording() {
    setError(null);
    setIsCapturing(true);
    try {
      const handle = await startScreenRecording();
      recordingHandleRef.current = handle;
      recordingStartedAtRef.current = Date.now();
      const track = handle.stream.getVideoTracks()[0];
      if (track) {
        // The user clicked the browser's own "Stop sharing" control rather than our Stop button —
        // treat it exactly the same as a manual stop.
        track.onended = () => {
          void finishRecording();
        };
      }
      useQuickCaptureStore.getState().setElapsedMs(0);
      useQuickCaptureStore.getState().setPhase("recording");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Screen recording failed to start.");
    } finally {
      setIsCapturing(false);
    }
  }

  function handleDiscard() {
    setResultBlob(null);
    setResultKind(null);
    setError(null);
    setAttachTarget(null);
    setAttachQuery("");
    setAttachedLabel(null);
  }

  function handleDownload() {
    if (!resultBlob) return;
    downloadCapture(captureFilename(resultKind), resultBlob);
  }

  async function handleCopy() {
    if (!resultBlob) return;
    try {
      await navigator.clipboard.write([new ClipboardItem({ [resultBlob.type]: resultBlob })]);
      toast.success("Screenshot copied to clipboard");
    } catch {
      toast.error("Couldn't copy the screenshot — your browser may not support this.");
    }
  }

  function openAttachPicker(target: "bug" | "note") {
    setAttachTarget(target);
    setAttachQuery("");
    setAttachedLabel(null);
  }

  async function handleAttachToBug(bug: BugReport) {
    if (!resultBlob) return;
    const file = new File([resultBlob], captureFilename(resultKind), { type: resultKind === "screenshot" ? "image/png" : "video/webm" });
    try {
      await addBugAttachment(bug.id, file, resultKind === "screenshot" ? "screenshot" : "video");
      toast.success(`Attached to "${bug.title}"`);
      setAttachedLabel(bug.title);
      setAttachTarget(null);
      setAttachQuery("");
    } catch {
      toast.error("Failed to attach to bug report.");
    }
  }

  async function handleAttachToNote(note: Note) {
    if (!resultBlob) return;
    const file = new File([resultBlob], captureFilename(resultKind), { type: resultKind === "screenshot" ? "image/png" : "video/webm" });
    try {
      await addNoteAttachment(note.id, file);
      toast.success(`Attached to "${note.title}"`);
      setAttachedLabel(note.title);
      setAttachTarget(null);
      setAttachQuery("");
    } catch {
      toast.error("Failed to attach to note.");
    }
  }

  const bugs = useLiveQuery(() => bugsDb.bugs.toArray(), []);
  const notes = useLiveQuery(() => notesDb.notes.toArray(), []);

  const filteredBugs = React.useMemo(() => {
    const q = attachQuery.trim().toLowerCase();
    const list = bugs ?? [];
    const matches = q ? list.filter((b) => b.title.toLowerCase().includes(q)) : list;
    return matches.slice().sort((a, b) => b.createdAt - a.createdAt).slice(0, 5);
  }, [attachQuery, bugs]);

  const filteredNotes = React.useMemo(() => {
    const q = attachQuery.trim().toLowerCase();
    const list = notes ?? [];
    const matches = q ? list.filter((n) => n.title.toLowerCase().includes(q)) : list;
    return matches.slice().sort((a, b) => b.createdAt - a.createdAt).slice(0, 5);
  }, [attachQuery, notes]);

  const isRecording = phase === "recording";

  const panelBody = (
    <>
      <div className="flex items-center gap-2 px-4 pt-3.5 pb-2.5 cursor-grab active:cursor-grabbing">
        <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-gradient-to-br from-primary to-[#8B5CF6] text-white">
          <Camera className="size-3.5" />
        </div>
        <p className="flex-1 text-sm font-semibold">Screen Capture</p>
        <Button
          variant="ghost"
          size="icon"
          className={cn("size-7", isPinned && "text-primary")}
          aria-label={isPinned ? "Unpin" : "Pin"}
          onClick={togglePinned}
        >
          {isPinned ? <Pin className="size-3.5 fill-current" /> : <PinOff className="size-3.5" />}
        </Button>
        <Button variant="ghost" size="icon" className="size-7" aria-label="Close" onClick={close}>
          <X className="size-3.5" />
        </Button>
      </div>

      <div className="max-h-[75dvh] overflow-y-auto scrollbar-thin px-4 pb-4">
        {error && (
          <p className="mb-3 rounded-lg border border-destructive/30 bg-destructive/5 p-2.5 text-xs text-destructive">{error}</p>
        )}

        {!resultBlob && !isRecording && (
          <div className="flex flex-col gap-3">
            <p className="text-xs text-muted-foreground">
              Capture a screenshot or record your screen. Nothing leaves this device — it&apos;s local until you attach or download it.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Button size="lg" className="h-16 flex-col gap-1.5" disabled={isCapturing} onClick={() => void handleTakeScreenshot()}>
                <Camera className="size-5" />
                Take Screenshot
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-16 flex-col gap-1.5"
                disabled={isCapturing}
                onClick={() => void handleStartRecording()}
              >
                <Video className="size-5" />
                Record Screen
              </Button>
            </div>
          </div>
        )}

        {!resultBlob && isRecording && (
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="flex items-center gap-2 font-mono text-2xl font-semibold tabular-nums text-primary">
              <span className="size-2.5 animate-pulse rounded-full bg-destructive" />
              {formatElapsed(elapsedMs)}
            </div>
            <p className="text-xs text-muted-foreground">Recording your screen…</p>
            <Button size="lg" variant="destructive" className="h-11 gap-1.5 px-6" onClick={() => void finishRecording()}>
              <Square className="size-3.5 fill-current" />
              Stop Recording
            </Button>
          </div>
        )}

        {resultBlob && resultKind && (
          <div className="flex flex-col gap-3">
            {resultKind === "screenshot" && resultUrl && (
              // eslint-disable-next-line @next/next/no-img-element -- object URL for a locally captured blob, not an optimizable static asset
              <img src={resultUrl} alt="Captured screenshot" className="w-full rounded-lg border border-border" />
            )}
            {resultKind === "recording" && resultUrl && (
              <video src={resultUrl} controls className="w-full rounded-lg border border-border" />
            )}

            <div className="flex flex-wrap gap-1.5">
              <Button size="sm" variant="outline" className="gap-1.5" onClick={handleDownload}>
                <Download className="size-3.5" />
                Download
              </Button>
              {resultKind === "screenshot" && (
                <Button size="sm" variant="outline" className="gap-1.5" onClick={() => void handleCopy()}>
                  <Copy className="size-3.5" />
                  Copy
                </Button>
              )}
              <Button size="sm" variant="outline" className="gap-1.5" onClick={() => openAttachPicker("bug")}>
                <BugIcon className="size-3.5" />
                Attach to Bug Report
              </Button>
              <Button size="sm" variant="outline" className="gap-1.5" onClick={() => openAttachPicker("note")}>
                <StickyNote className="size-3.5" />
                Attach to Note
              </Button>
              <Button size="sm" variant="ghost" className="gap-1.5 text-muted-foreground" onClick={handleDiscard}>
                <RotateCcw className="size-3.5" />
                Discard / Retake
              </Button>
            </div>

            {attachTarget && (
              <div className="flex flex-col gap-1.5 rounded-lg border border-border/70 bg-muted/30 p-2.5">
                <div className="relative">
                  <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    autoFocus
                    value={attachQuery}
                    onChange={(e) => setAttachQuery(e.target.value)}
                    placeholder={attachTarget === "bug" ? "Search bug reports by title…" : "Search notes by title…"}
                    className="h-8 pl-8 text-sm"
                  />
                </div>
                <div className="flex flex-col gap-0.5">
                  {attachTarget === "bug" &&
                    (filteredBugs.length > 0 ? (
                      filteredBugs.map((bug) => (
                        <button
                          key={bug.id}
                          type="button"
                          onClick={() => void handleAttachToBug(bug)}
                          className="truncate rounded-md px-1.5 py-1 text-left text-xs hover:bg-muted"
                        >
                          <span className="font-mono text-[10px] text-muted-foreground">{bug.displayId}</span> {bug.title || "Untitled"}
                        </button>
                      ))
                    ) : (
                      <p className="px-1.5 py-1 text-xs text-muted-foreground">No matching bug reports.</p>
                    ))}
                  {attachTarget === "note" &&
                    (filteredNotes.length > 0 ? (
                      filteredNotes.map((note) => (
                        <button
                          key={note.id}
                          type="button"
                          onClick={() => void handleAttachToNote(note)}
                          className="truncate rounded-md px-1.5 py-1 text-left text-xs hover:bg-muted"
                        >
                          {note.title || "Untitled"}
                        </button>
                      ))
                    ) : (
                      <p className="px-1.5 py-1 text-xs text-muted-foreground">No matching notes.</p>
                    ))}
                </div>
              </div>
            )}

            {attachedLabel && (
              <p className="flex items-center gap-1.5 text-xs text-primary">
                <CheckCircle2 className="size-3.5" />
                Attached to &ldquo;{attachedLabel}&rdquo;
              </p>
            )}
          </div>
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
        aria-label="Screen Capture"
        title="Screen Capture"
        onClick={toggleOpen}
      >
        <Camera className="size-4" />
        {isRecording && <span className="absolute top-1.5 right-1.5 size-1.5 animate-pulse rounded-full bg-destructive" />}
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
                    onClick={() => !isPinned && close()}
                  />
                )}

                {isDesktop && position && (
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
