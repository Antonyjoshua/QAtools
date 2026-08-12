"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, Laptop, Keyboard } from "lucide-react";
import { useSettingsStore } from "@/lib/bugs/settings-store";
import { ROLES, type UserRole } from "@/lib/bugs/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const SHORTCUTS: [string, string][] = [
  ["⌘ / Ctrl + N", "New bug report"],
  ["⌘ / Ctrl + S", "Save draft now"],
  ["⌘ / Ctrl + P", "Export current bug as PDF"],
  ["⌘ / Ctrl + K", "Open global search"],
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
  const currentUser = useSettingsStore((s) => s.currentUser);
  const currentRole = useSettingsStore((s) => s.currentRole);
  const autoSave = useSettingsStore((s) => s.autoSave);
  const setCurrentUser = useSettingsStore((s) => s.setCurrentUser);
  const setCurrentRole = useSettingsStore((s) => s.setCurrentRole);
  const setAutoSave = useSettingsStore((s) => s.setAutoSave);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
      <p className="mt-1 mb-8 text-muted-foreground">Everything is stored locally in this browser.</p>

      <div className="flex flex-col gap-5">
        <SettingsSection title="Profile" description="Used as the default reporter and comment author.">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Display Name</label>
              <Input value={currentUser} onChange={(e) => setCurrentUser(e.target.value)} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-muted-foreground">Role</label>
              <Select value={currentRole} onValueChange={(v) => v && setCurrentRole(v as UserRole)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {ROLES.map((r) => (
                    <SelectItem key={r} value={r}>
                      {r}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </SettingsSection>

        <SettingsSection title="Appearance">
          <div className="flex gap-2">
            {[
              { id: "dark", label: "Dark", icon: Moon },
              { id: "light", label: "Light", icon: Sun },
              { id: "system", label: "System", icon: Laptop },
            ].map((t) => (
              <Button key={t.id} variant={theme === t.id ? "default" : "outline"} size="sm" className="gap-1.5" onClick={() => setTheme(t.id)}>
                <t.icon className="size-3.5" />
                {t.label}
              </Button>
            ))}
          </div>
        </SettingsSection>

        <SettingsSection title="Auto-save" description="Automatically save bug reports while typing.">
          <div className="flex items-center justify-between">
            <span className="text-sm">Enable auto-save</span>
            <Switch checked={autoSave} onCheckedChange={setAutoSave} />
          </div>
        </SettingsSection>

        <SettingsSection title="Keyboard Shortcuts">
          <div className="flex flex-col gap-2">
            {SHORTCUTS.map(([keys, desc]) => (
              <div key={desc} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{desc}</span>
                <kbd className="rounded border border-border bg-muted px-1.5 py-0.5 font-mono text-[11px]">{keys}</kbd>
              </div>
            ))}
          </div>
          <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
            <Keyboard className="size-3.5" /> Shortcuts work anywhere in the app.
          </p>
        </SettingsSection>
      </div>
    </div>
  );
}
