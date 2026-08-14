"use client";

import * as React from "react";
import { Volume2, VolumeX, BellRing, Play } from "lucide-react";
import { useQuickTimerStore } from "@/lib/timer/store";
import { requestNotificationPermission, playChime, type ChimeVariant } from "@/lib/timer/notification";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const CHIME_PREVIEWS: { variant: ChimeVariant; label: string }[] = [
  { variant: "work", label: "Work done" },
  { variant: "break", label: "Break done" },
  { variant: "longBreak", label: "Long break done" },
];

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

export function TimerSettingsPanel() {
  const settings = useQuickTimerStore((s) => s.settings);
  const updateSettings = useQuickTimerStore((s) => s.updateSettings);

  async function handleDesktopNotificationsToggle(enabled: boolean) {
    if (enabled) {
      const permission = await requestNotificationPermission();
      updateSettings({ desktopNotifications: permission === "granted" });
    } else {
      updateSettings({ desktopNotifications: false });
    }
  }

  return (
    <div className="flex flex-col divide-y divide-border">
      <SettingRow label="Notification sound" description="Play a chime when a timer completes">
        <Switch checked={settings.notificationSoundEnabled} onCheckedChange={(v) => updateSettings({ notificationSoundEnabled: Boolean(v) })} />
      </SettingRow>

      <div className="flex items-center gap-3 py-2">
        {settings.volume === 0 ? <VolumeX className="size-4 text-muted-foreground" /> : <Volume2 className="size-4 text-muted-foreground" />}
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={settings.volume}
          onChange={(e) => updateSettings({ volume: Number(e.target.value) })}
          disabled={!settings.notificationSoundEnabled}
          className={cn("h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-muted disabled:cursor-not-allowed disabled:opacity-50")}
          style={{ accentColor: "var(--primary)" }}
          aria-label="Notification volume"
        />
      </div>

      {settings.notificationSoundEnabled && (
        <SettingRow label="Preview sounds" description="Each Pomodoro session has its own chime">
          <div className="flex gap-1.5">
            {CHIME_PREVIEWS.map((p) => (
              <Button
                key={p.variant}
                type="button"
                variant="outline"
                size="sm"
                className="h-7 gap-1 text-xs"
                title={`Preview: ${p.label}`}
                onClick={() => playChime(settings.volume, p.variant)}
              >
                <Play className="size-3" />
                {p.label}
              </Button>
            ))}
          </div>
        </SettingRow>
      )}

      <SettingRow label="Desktop notifications" description="Show a system notification on completion">
        <Switch checked={settings.desktopNotifications} onCheckedChange={(v) => void handleDesktopNotificationsToggle(Boolean(v))} />
      </SettingRow>

      <SettingRow label="Show milliseconds" description="Stopwatch display precision">
        <Switch checked={settings.showMilliseconds} onCheckedChange={(v) => updateSettings({ showMilliseconds: Boolean(v) })} />
      </SettingRow>

      <SettingRow label="24-hour clock" description="Used by World Clock">
        <Switch checked={settings.use24Hour} onCheckedChange={(v) => updateSettings({ use24Hour: Boolean(v) })} />
      </SettingRow>

      <SettingRow label="Keep running when closed" description="Timers keep going in the background">
        <Switch checked={settings.keepRunningWhenClosed} onCheckedChange={(v) => updateSettings({ keepRunningWhenClosed: Boolean(v) })} />
      </SettingRow>

      {settings.desktopNotifications === false && typeof window !== "undefined" && "Notification" in window && Notification.permission === "denied" && (
        <div className="flex items-start gap-2 py-2 text-xs text-muted-foreground">
          <BellRing className="mt-0.5 size-3.5 shrink-0" />
          Notifications are blocked in your browser settings — enable them there to use this.
        </div>
      )}
    </div>
  );
}
