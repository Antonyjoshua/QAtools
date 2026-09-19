"use client";

import * as React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { COUNTRIES } from "@/lib/generator/data";
import type { DomainCategoryDef, DomainGenConfig, ScenarioMode } from "@/lib/generator/domains/types";

const COUNT_PRESETS = [10, 25, 50, 100, 1000, 10000];
const MAX_COUNT = 100000;

const SCENARIO_OPTIONS: { label: string; value: ScenarioMode }[] = [
  { label: "Valid data", value: "valid" },
  { label: "Invalid data", value: "invalid" },
  { label: "Boundary values", value: "boundary" },
  { label: "Mixed (positive & negative)", value: "mixed" },
];

interface DomainGeneratorConfigProps {
  category: DomainCategoryDef;
  config: DomainGenConfig;
  onChange: (patch: Partial<DomainGenConfig>) => void;
}

export function DomainGeneratorConfig({ category, config, onChange }: DomainGeneratorConfigProps) {
  const requiredFields = category.fields.filter((f) => f.required);
  const optionalFields = category.fields.filter((f) => !f.required);

  function toggleField(key: string, checked: boolean) {
    const next = checked ? [...config.selectedFieldKeys, key] : config.selectedFieldKeys.filter((k) => k !== key);
    onChange({ selectedFieldKeys: next });
  }

  return (
    <div className="flex flex-col gap-5">
      <div>
        <p className="mb-2 text-xs text-muted-foreground">Fields to include</p>
        <div className="grid grid-cols-1 gap-x-6 gap-y-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {requiredFields.map((f) => (
            <label key={f.key} className="flex items-center gap-2 text-sm text-muted-foreground">
              <Checkbox checked disabled />
              {f.label}
              <span className="text-[10px] uppercase tracking-wide text-muted-foreground/70">required</span>
            </label>
          ))}
          {optionalFields.map((f) => (
            <label key={f.key} className="flex items-center gap-2 text-sm">
              <Checkbox checked={config.selectedFieldKeys.includes(f.key)} onCheckedChange={(checked) => toggleField(f.key, Boolean(checked))} />
              {f.label}
            </label>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 border-t border-border pt-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-muted-foreground">Scenario</Label>
          <Select value={config.scenario} onValueChange={(v) => v !== null && onChange({ scenario: v as ScenarioMode })}>
            <SelectTrigger className="w-full">
              <SelectValue>{(v: string) => SCENARIO_OPTIONS.find((o) => o.value === v)?.label ?? v}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {SCENARIO_OPTIONS.map((o) => (
                <SelectItem key={o.value} value={o.value}>
                  {o.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-muted-foreground">Locale / Country</Label>
          <Select value={config.locale} onValueChange={(v) => v !== null && onChange({ locale: v })}>
            <SelectTrigger className="w-full">
              <SelectValue>{(v: string) => COUNTRIES.find((c) => c.code === v)?.name ?? v}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {COUNTRIES.map((c) => (
                <SelectItem key={c.code} value={c.code}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-muted-foreground">Row count</Label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              className="w-28"
              min={1}
              max={MAX_COUNT}
              value={config.count}
              onChange={(e) => onChange({ count: Number(e.target.value) || 1 })}
            />
            <div className="flex flex-wrap gap-1">
              {COUNT_PRESETS.map((p) => (
                <Button key={p} type="button" size="sm" variant={config.count === p ? "secondary" : "ghost"} className="h-7 px-2 text-xs" onClick={() => onChange({ count: p })}>
                  {p.toLocaleString("en-US")}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-6 border-t border-border pt-4">
        <label className="flex items-center gap-2 text-sm">
          <Switch checked={config.includeDuplicates} onCheckedChange={(v) => onChange({ includeDuplicates: v })} />
          Include duplicate rows
        </label>
        <label className="flex items-center gap-2 text-sm">
          <Switch checked={config.includeNulls} onCheckedChange={(v) => onChange({ includeNulls: v })} />
          Include empty / null values
        </label>
        <label className="flex items-center gap-2 text-sm">
          <Switch checked={config.includeSpecialChars} onCheckedChange={(v) => onChange({ includeSpecialChars: v })} />
          Include special characters
        </label>
      </div>
    </div>
  );
}
