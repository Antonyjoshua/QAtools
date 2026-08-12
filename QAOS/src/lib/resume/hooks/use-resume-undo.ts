"use client";

import * as React from "react";
import { restoreResume } from "../repo/resumes-repo";
import type { Resume } from "../types";

const SETTLE_MS = 900;
const MAX_STACK = 50;

/**
 * Session-scoped undo/redo for the resume editor. Every field write already saves straight to
 * Dexie (autosave), so rather than intercept every call site, this coalesces the stream of live
 * `resume` updates into checkpoints after a short settle period — one undo step per editing
 * burst (e.g. a sentence typed, a section reordered) instead of one per keystroke.
 */
export function useResumeUndo(resume: Resume) {
  const undoStack = React.useRef<Resume[]>([]);
  const redoStack = React.useRef<Resume[]>([]);
  const lastCommitted = React.useRef<Resume>(resume);
  const skipNextRef = React.useRef(false);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const [counts, setCounts] = React.useState({ undo: 0, redo: 0 });

  // No reset-on-resume-id-change effect needed here: the caller keys <ResumeEditorShell> by
  // resume.id, so this hook (and all its refs/state) fully remounts on every resume switch.

  React.useEffect(() => {
    if (skipNextRef.current) {
      skipNextRef.current = false;
      lastCommitted.current = resume;
      return;
    }
    const prev = lastCommitted.current;
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (prev.updatedAt !== resume.updatedAt) {
        undoStack.current = [...undoStack.current, prev].slice(-MAX_STACK);
        redoStack.current = [];
        lastCommitted.current = resume;
        setCounts({ undo: undoStack.current.length, redo: 0 });
      }
    }, SETTLE_MS);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [resume]);

  const undo = React.useCallback(async () => {
    if (undoStack.current.length === 0) return;
    const snapshot = undoStack.current[undoStack.current.length - 1];
    undoStack.current = undoStack.current.slice(0, -1);
    redoStack.current = [...redoStack.current, lastCommitted.current];
    skipNextRef.current = true;
    lastCommitted.current = snapshot;
    setCounts({ undo: undoStack.current.length, redo: redoStack.current.length });
    await restoreResume(snapshot);
  }, []);

  const redo = React.useCallback(async () => {
    if (redoStack.current.length === 0) return;
    const snapshot = redoStack.current[redoStack.current.length - 1];
    redoStack.current = redoStack.current.slice(0, -1);
    undoStack.current = [...undoStack.current, lastCommitted.current];
    skipNextRef.current = true;
    lastCommitted.current = snapshot;
    setCounts({ undo: undoStack.current.length, redo: redoStack.current.length });
    await restoreResume(snapshot);
  }, []);

  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      const inField = target?.tagName === "INPUT" || target?.tagName === "TEXTAREA" || target?.isContentEditable;
      if (inField || !(e.ctrlKey || e.metaKey)) return;
      if (e.key.toLowerCase() === "z" && !e.shiftKey) {
        e.preventDefault();
        void undo();
      } else if ((e.key.toLowerCase() === "z" && e.shiftKey) || e.key.toLowerCase() === "y") {
        e.preventDefault();
        void redo();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [undo, redo]);

  return {
    canUndo: counts.undo > 0,
    canRedo: counts.redo > 0,
    undo,
    redo,
  };
}
