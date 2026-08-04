'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { themes, defaultTheme, type ThemeConfig } from '@/lib/themes';
export type { ThemeConfig };

interface ThemeContextValue {
  themeId:   string;
  theme:     ThemeConfig;
  setTheme:  (id: string) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  themeId:  defaultTheme,
  theme:    themes[defaultTheme],
  setTheme: () => {},
});

function applyThemeToDom(theme: ThemeConfig) {
  const root = document.documentElement;
  root.setAttribute('data-theme', theme.id);
  Object.entries(theme.css).forEach(([k, v]) => root.style.setProperty(k, v));
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeId, setThemeId] = useState<string>(() => {
    if (typeof window === 'undefined') return defaultTheme;
    return localStorage.getItem('aj-theme') || defaultTheme;
  });

  const theme = themes[themeId] ?? themes[defaultTheme];

  // Apply CSS vars whenever theme changes
  useEffect(() => {
    applyThemeToDom(theme);
    try { localStorage.setItem('aj-theme', theme.id); } catch {}
  }, [theme]);

  const setTheme = useCallback((id: string) => {
    if (themes[id]) setThemeId(id);
  }, []);

  return (
    <ThemeContext.Provider value={{ themeId, theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

