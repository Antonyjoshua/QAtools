"use client";

import { useQuickTimezoneStore } from "@/lib/timezone/store";
import { TimezoneSearch } from "./timezone-search";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { DateFormat } from "@/lib/timezone/types";

function SettingRow({ label, description, children }: { label: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <div className="min-w-0">
        <Label className="text-sm font-normal">{label}</Label>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
      {children}
    </div>
  );
}

const DATE_FORMATS: { value: DateFormat; label: string }[] = [
  { value: "dmy", label: "DD/MM/YYYY" },
  { value: "mdy", label: "MM/DD/YYYY" },
  { value: "ymd", label: "YYYY-MM-DD" },
];

export function TimezoneSettingsPanel() {
  const settings = useQuickTimezoneStore((s) => s.settings);
  const updateSettings = useQuickTimezoneStore((s) => s.updateSettings);

  return (
    <div className="flex flex-col divide-y divide-border">
      <SettingRow label="24-hour time" description="Use 24h instead of AM/PM">
        <Switch checked={settings.use24Hour} onCheckedChange={(v) => updateSettings({ use24Hour: Boolean(v) })} />
      </SettingRow>

      <SettingRow label="Date format">
        <Select value={settings.dateFormat} onValueChange={(v) => updateSettings({ dateFormat: v as DateFormat })}>
          <SelectTrigger className="w-36">
            <SelectValue>{(v: DateFormat) => DATE_FORMATS.find((f) => f.value === v)?.label ?? v}</SelectValue>
          </SelectTrigger>
          <SelectContent positionerClassName="z-[110]">
            {DATE_FORMATS.map((f) => (
              <SelectItem key={f.value} value={f.value}>
                {f.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </SettingRow>

      <SettingRow label="First day of week">
        <Select value={String(settings.firstDayOfWeek)} onValueChange={(v) => updateSettings({ firstDayOfWeek: Number(v) as 0 | 1 })}>
          <SelectTrigger className="w-32">
            <SelectValue>{(v: string) => (v === "0" ? "Sunday" : "Monday")}</SelectValue>
          </SelectTrigger>
          <SelectContent positionerClassName="z-[110]">
            <SelectItem value="0">Sunday</SelectItem>
            <SelectItem value="1">Monday</SelectItem>
          </SelectContent>
        </Select>
      </SettingRow>

      <SettingRow label="Auto-detect location" description="Default the source zone to your browser's timezone">
        <Switch checked={settings.autoDetectLocation} onCheckedChange={(v) => updateSettings({ autoDetectLocation: Boolean(v) })} />
      </SettingRow>

      <div className="flex flex-col gap-1.5 py-2">
        <Label className="text-sm font-normal">Default timezone</Label>
        <TimezoneSearch
          value={settings.defaultTimezoneId}
          onChange={(id) => updateSettings({ defaultTimezoneId: id })}
          placeholder="None — use browser timezone"
        />
      </div>
    </div>
  );
}
