"use client";

import { Switch } from "@/components/ui/switch";
import type { UseCalculatorReturn } from "@/lib/quick-calculator/use-calculator";

function SettingRow({ label, description, control }: { label: string; description?: string; control: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <div className="min-w-0">
        <p className="text-sm">{label}</p>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </div>
      {control}
    </div>
  );
}

export function SettingsPanel({ calc }: { calc: UseCalculatorReturn }) {
  const { settings, updateSettings } = calc;

  return (
    <div className="flex flex-col divide-y divide-border/50 px-1">
      <SettingRow
        label="Angle unit"
        description="Used by trig functions"
        control={
          <div className="flex overflow-hidden rounded-lg border border-border/60 text-xs">
            {(["deg", "rad"] as const).map((unit) => (
              <button
                key={unit}
                type="button"
                onClick={() => updateSettings({ angleUnit: unit })}
                className={
                  settings.angleUnit === unit
                    ? "bg-primary px-2.5 py-1 font-semibold text-primary-foreground"
                    : "px-2.5 py-1 text-muted-foreground hover:text-foreground"
                }
              >
                {unit === "deg" ? "Deg" : "Rad"}
              </button>
            ))}
          </div>
        }
      />
      <SettingRow
        label="Thousands separator"
        description="1,000,000 instead of 1000000"
        control={<Switch checked={settings.thousandsSeparator} onCheckedChange={(v) => updateSettings({ thousandsSeparator: v })} />}
      />
      <SettingRow
        label="Decimal precision"
        description={`${settings.decimalPrecision} decimal place${settings.decimalPrecision === 1 ? "" : "s"}`}
        control={
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              className="flex size-6 items-center justify-center rounded-md border border-border/60 text-sm text-muted-foreground hover:text-foreground disabled:opacity-30"
              disabled={settings.decimalPrecision <= 0}
              onClick={() => updateSettings({ decimalPrecision: Math.max(0, settings.decimalPrecision - 1) })}
            >
              −
            </button>
            <span className="w-4 text-center text-sm tabular-nums">{settings.decimalPrecision}</span>
            <button
              type="button"
              className="flex size-6 items-center justify-center rounded-md border border-border/60 text-sm text-muted-foreground hover:text-foreground disabled:opacity-30"
              disabled={settings.decimalPrecision >= 10}
              onClick={() => updateSettings({ decimalPrecision: Math.min(10, settings.decimalPrecision + 1) })}
            >
              +
            </button>
          </div>
        }
      />
      <SettingRow
        label="Scientific notation"
        description="For very large or small results"
        control={<Switch checked={settings.scientificNotation} onCheckedChange={(v) => updateSettings({ scientificNotation: v })} />}
      />
      <SettingRow
        label="Sound"
        description="Play a click on key press"
        control={<Switch checked={settings.soundEnabled} onCheckedChange={(v) => updateSettings({ soundEnabled: v })} />}
      />
      <SettingRow
        label="Haptic feedback"
        description="Vibrate on key press (mobile)"
        control={<Switch checked={settings.hapticEnabled} onCheckedChange={(v) => updateSettings({ hapticEnabled: v })} />}
      />
    </div>
  );
}
