"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Download, Upload, Sun, Moon, Laptop, Keyboard } from "lucide-react";
import { toast } from "sonner";
import { useSettingsStore, type FontSize, type FontFamily } from "@/lib/notes/settings-store";
import { exportBackup, importBackup } from "@/lib/notes/backup";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const SHORTCUTS: [string, string][] = [
  ["⌘ / Ctrl + K", "Open global search"],
  ["⌘ / Ctrl + B", "Bold"],
  ["⌘ / Ctrl + I", "Italic"],
  ["⌘ / Ctrl + U", "Underline"],
  ["⌘ / Ctrl + Z", "Undo"],
  ["⌘ / Ctrl + Shift + Z", "Redo"],
  ["# / ## / ###", "Heading 1 / 2 / 3 (type at line start)"],
  ["``` ", "Code block"],
  ["- or *", "Bullet list"],
  ["1.", "Numbered list"],
  ["[] ", "Checklist item"],
  ["Esc", "Exit reading mode"],
];

function SettingsSection({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <h2 className="font-medium tracking-tight">{title}</h2>
      {description && <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>}
      <div className="mt-4">{children}</div>
    </div>
  );
}

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const fontSize = useSettingsStore((s) => s.fontSize);
  const fontFamily = useSettingsStore((s) => s.fontFamily);
  const autoSave = useSettingsStore((s) => s.autoSave);
  const autoSaveIntervalSec = useSettingsStore((s) => s.autoSaveIntervalSec);
  const setFontSize = useSettingsStore((s) => s.setFontSize);
  const setFontFamily = useSettingsStore((s) => s.setFontFamily);
  const setAutoSave = useSettingsStore((s) => s.setAutoSave);
  const setAutoSaveIntervalSec = useSettingsStore((s) => s.setAutoSaveIntervalSec);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      await importBackup(file, "merge");
      toast.success("Backup restored");
    } catch {
      toast.error("Could not restore backup — invalid file");
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
      <p className="mt-1 mb-8 text-muted-foreground">Customize QA Notes to your liking. Everything is stored locally in this browser.</p>

      <div className="flex flex-col gap-5">
        <SettingsSection title="Appearance" description="Choose how QA Notes looks.">
          <div className="flex flex-col gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Theme</label>
              <div className="flex gap-2">
                {[
                  { id: "dark", label: "Dark", icon: Moon },
                  { id: "light", label: "Light", icon: Sun },
                  { id: "system", label: "System", icon: Laptop },
                ].map((t) => (
                  <Button
                    key={t.id}
                    variant={theme === t.id ? "default" : "outline"}
                    size="sm"
                    className="gap-1.5"
                    onClick={() => setTheme(t.id)}
                  >
                    <t.icon className="size-3.5" />
                    {t.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Font size</label>
                <Select value={fontSize} onValueChange={(v) => v && setFontSize(v as FontSize)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sm">Small</SelectItem>
                    <SelectItem value="md">Medium</SelectItem>
                    <SelectItem value="lg">Large</SelectItem>
                    <SelectItem value="xl">Extra Large</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Font family</label>
                <Select value={fontFamily} onValueChange={(v) => v && setFontFamily(v as FontFamily)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sans">Sans-serif</SelectItem>
                    <SelectItem value="serif">Serif</SelectItem>
                    <SelectItem value="mono">Monospace</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </SettingsSection>

        <SettingsSection title="Auto-save" description="Automatically save notes while typing.">
          <div className="flex items-center justify-between">
            <span className="text-sm">Enable auto-save</span>
            <Switch checked={autoSave} onCheckedChange={setAutoSave} />
          </div>
          <div className={cn("mt-3 flex items-center justify-between", !autoSave && "opacity-50")}>
            <span className="text-sm">Save interval (seconds)</span>
            <Input
              type="number"
              min={1}
              max={30}
              disabled={!autoSave}
              value={autoSaveIntervalSec}
              onChange={(e) => setAutoSaveIntervalSec(Number(e.target.value) || 1)}
              className="w-20"
            />
          </div>
        </SettingsSection>

        <SettingsSection title="Backup & Restore" description="Export everything to a JSON file, or restore from one.">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="gap-1.5" onClick={() => exportBackup().then(() => toast.success("Backup downloaded"))}>
              <Download className="size-4" />
              Export backup
            </Button>
            <Button variant="outline" className="gap-1.5" onClick={() => fileInputRef.current?.click()}>
              <Upload className="size-4" />
              Restore from file
            </Button>
            <input ref={fileInputRef} type="file" accept="application/json" className="hidden" onChange={handleImport} />
          </div>
        </SettingsSection>

        <SettingsSection title="Keyboard Shortcuts">
          <div className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
            {SHORTCUTS.map(([keys, desc]) => (
              <div key={desc} className="flex items-center justify-between gap-3 text-sm">
                <span className="text-muted-foreground">{desc}</span>
                <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[11px]">{keys}</kbd>
              </div>
            ))}
          </div>
          <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Keyboard className="size-3.5" /> Standard editor shortcuts also work (⌘/Ctrl combos).
          </p>
        </SettingsSection>
      </div>
    </div>
  );
}
