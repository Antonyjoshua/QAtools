"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { GeneratorOptionDef, OptionValues } from "@/lib/generator/types";

interface OptionsFormProps {
  options: GeneratorOptionDef[];
  values: OptionValues;
  onChange: (key: string, value: string | number | boolean) => void;
}

export function OptionsForm({ options, values, onChange }: OptionsFormProps) {
  if (options.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {options.map((opt) => {
        const value = values[opt.key] ?? opt.default ?? "";
        return (
          <div key={opt.key} className="flex flex-col gap-1.5">
            <Label htmlFor={opt.key} className="text-xs text-muted-foreground">
              {opt.label}
            </Label>
            {opt.type === "select" && (
              <Select value={String(value)} onValueChange={(v) => v !== null && onChange(opt.key, v)}>
                <SelectTrigger id={opt.key} className="w-full">
                  <SelectValue>{(v: string) => opt.options?.find((o) => o.value === v)?.label ?? v}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {opt.options?.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {opt.type === "text" && (
              <Input
                id={opt.key}
                value={String(value)}
                placeholder={opt.placeholder}
                onChange={(e) => onChange(opt.key, e.target.value)}
              />
            )}
            {opt.type === "number" && (
              <Input
                id={opt.key}
                type="number"
                min={opt.min}
                max={opt.max}
                value={String(value)}
                onChange={(e) => onChange(opt.key, e.target.value === "" ? "" : Number(e.target.value))}
              />
            )}
            {opt.type === "boolean" && (
              <div className="flex h-9 items-center">
                <Switch id={opt.key} checked={Boolean(value)} onCheckedChange={(v) => onChange(opt.key, v)} />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
