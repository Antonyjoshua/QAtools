"use client";

import { BROWSERS, PLATFORMS, OS_LIST, DEVICE_TYPES } from "@/lib/bugs/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface EnvironmentValue {
  browser: string;
  browserVersion: string;
  platform: string;
  os: string;
  device: string;
  environment: string;
  buildVersion: string;
}

function ChipGroup({ label, options, value, onChange }: { label: string; options: readonly string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      <div className="flex flex-wrap gap-1.5">
        {options.map((o) => (
          <Button
            key={o}
            type="button"
            size="sm"
            variant="outline"
            className={cn("h-7 px-2.5 text-xs", value === o && "border-primary bg-accent text-accent-foreground")}
            onClick={() => onChange(value === o ? "" : o)}
          >
            {o}
          </Button>
        ))}
      </div>
    </div>
  );
}

export function EnvironmentBuilder({ value, onChange }: { value: EnvironmentValue; onChange: (patch: Partial<EnvironmentValue>) => void }) {
  return (
    <div className="flex flex-col gap-4">
      <ChipGroup label="Browser" options={BROWSERS} value={value.browser} onChange={(v) => onChange({ browser: v })} />
      <ChipGroup label="Platform" options={PLATFORMS} value={value.platform} onChange={(v) => onChange({ platform: v })} />
      <ChipGroup label="Operating System" options={OS_LIST} value={value.os} onChange={(v) => onChange({ os: v })} />
      <ChipGroup label="Device" options={DEVICE_TYPES} value={value.device} onChange={(v) => onChange({ device: v })} />

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-muted-foreground">Browser Version</Label>
          <Input value={value.browserVersion} onChange={(e) => onChange({ browserVersion: e.target.value })} placeholder="e.g. 124.0" className="h-8" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-muted-foreground">Build Version</Label>
          <Input value={value.buildVersion} onChange={(e) => onChange({ buildVersion: e.target.value })} placeholder="e.g. 1.2.0" className="h-8" />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <Label className="text-xs text-muted-foreground">Test Environment</Label>
        <Input value={value.environment} onChange={(e) => onChange({ environment: e.target.value })} placeholder="e.g. QA, Staging, Production" className="h-8" />
      </div>
    </div>
  );
}
