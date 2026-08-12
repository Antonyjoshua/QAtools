"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { DURATION_UNITS, UNIT_LABEL, unitLabel, type DurationUnit } from "@/lib/duration/units";
import { durationEquivalents, durationToMs, exactTotals, formatDuration } from "@/lib/duration/conversions";
import { CopyIconButton, EquivalentsList, ResultCard } from "./shared";

type InputStyle = "single" | "hms";

export function ConvertPanel({ onResult }: { onResult?: (expression: string, result: string) => void }) {
  const [style, setStyle] = React.useState<InputStyle>("single");
  const [value, setValue] = React.useState("54");
  const [unit, setUnit] = React.useState<DurationUnit>("s");
  const [hours, setHours] = React.useState("0");
  const [minutes, setMinutes] = React.useState("0");
  const [seconds, setSeconds] = React.useState("0");

  const singleValue = Number(value) || 0;
  const singleMs = durationToMs(singleValue, unit);
  const hmsMs = durationToMs(Number(hours) || 0, "hr") + durationToMs(Number(minutes) || 0, "min") + durationToMs(Number(seconds) || 0, "s");

  const equivalents = React.useMemo(() => durationEquivalents(singleMs), [singleMs]);
  const hmsTotals = React.useMemo(() => exactTotals(hmsMs), [hmsMs]);

  const singleExpression = `${value || 0} ${unitLabel(unit, singleValue)}`;
  const hmsExpression = `${hours}h ${minutes}m ${seconds}s`;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-1 rounded-lg bg-muted p-1">
        <Button type="button" size="sm" variant={style === "single" ? "default" : "ghost"} className="flex-1" onClick={() => setStyle("single")}>
          Value + Unit
        </Button>
        <Button type="button" size="sm" variant={style === "hms" ? "default" : "ghost"} className="flex-1" onClick={() => setStyle("hms")}>
          H : M : S
        </Button>
      </div>

      {style === "single" ? (
        <>
          <div className="flex gap-2">
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value.replace(/[^0-9.]/g, ""))}
              inputMode="decimal"
              placeholder="Value"
              className="flex-1"
            />
            <Select value={unit} onValueChange={(v) => v !== null && setUnit(v as DurationUnit)}>
              <SelectTrigger className="w-32">
                <SelectValue>{(v: DurationUnit) => UNIT_LABEL[v]?.plural ?? v}</SelectValue>
              </SelectTrigger>
              <SelectContent positionerClassName="z-[110]">
                {DURATION_UNITS.map((u) => (
                  <SelectItem key={u} value={u}>
                    {UNIT_LABEL[u].plural}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <ResultCard
            title="Formatted"
            value={formatDuration(singleMs) || "0 seconds"}
            copyText={formatDuration(singleMs) || "0 seconds"}
            onCopied={() => onResult?.(singleExpression, formatDuration(singleMs) || "0 seconds")}
          />
          <EquivalentsList items={equivalents} />
        </>
      ) : (
        <>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "Hours", value: hours, set: setHours },
              { label: "Minutes", value: minutes, set: setMinutes },
              { label: "Seconds", value: seconds, set: setSeconds },
            ].map((f) => (
              <div key={f.label} className="flex flex-col gap-1">
                <Label className="text-[10px] text-muted-foreground">{f.label}</Label>
                <Input value={f.value} onChange={(e) => f.set(e.target.value.replace(/[^0-9]/g, ""))} inputMode="numeric" className={cn("text-center")} />
              </div>
            ))}
          </div>
          <ResultCard
            title="Formatted"
            value={formatDuration(hmsMs) || "0 seconds"}
            copyText={formatDuration(hmsMs) || "0 seconds"}
            onCopied={() => onResult?.(hmsExpression, formatDuration(hmsMs) || "0 seconds")}
          />
          <div className="flex flex-col gap-0.5">
            {hmsTotals.map((t) => (
              <div key={t.label} className="flex items-center justify-between gap-2 rounded-md px-1.5 py-1 text-xs hover:bg-muted">
                <span className="text-muted-foreground">Total {t.label}</span>
                <span className="flex items-center gap-1 font-medium">
                  {t.value}
                  <CopyIconButton text={t.value} label={`total ${t.label.toLowerCase()}`} />
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
