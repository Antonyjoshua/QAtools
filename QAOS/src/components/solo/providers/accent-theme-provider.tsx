"use client";

import { useEffect } from "react";
import { useAppStore } from "@/lib/solo/store/useAppStore";

export function AccentThemeProvider({ children }: { children: React.ReactNode }) {
  const accent = useAppStore((s) => s.settings.accentTheme);

  useEffect(() => {
    document.documentElement.setAttribute("data-accent", accent);
  }, [accent]);

  return <>{children}</>;
}
