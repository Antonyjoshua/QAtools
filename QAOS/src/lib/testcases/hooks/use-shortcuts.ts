"use client";

import * as React from "react";

export interface TestManagementShortcutHandlers {
  onNew?: () => void; // Ctrl+N
  onSave?: () => void; // Ctrl+S
  onSearch?: () => void; // Ctrl+F
  onExecute?: () => void; // Ctrl+E
}

function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable;
}

/** Wires Ctrl+N / Ctrl+S / Ctrl+F / Ctrl+E for the currently mounted Test Management page. */
export function useTestManagementShortcuts(handlers: TestManagementShortcutHandlers) {
  const handlersRef = React.useRef(handlers);
  React.useEffect(() => {
    handlersRef.current = handlers;
  });

  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (!(e.ctrlKey || e.metaKey)) return;
      const key = e.key.toLowerCase();
      const h = handlersRef.current;

      if (key === "n" && h.onNew) {
        e.preventDefault();
        h.onNew();
      } else if (key === "s" && h.onSave) {
        e.preventDefault();
        h.onSave();
      } else if (key === "f" && h.onSearch) {
        if (isTypingTarget(e.target)) return;
        e.preventDefault();
        h.onSearch();
      } else if (key === "e" && h.onExecute) {
        e.preventDefault();
        h.onExecute();
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);
}
