"use client";

import * as React from "react";
import { ArrowDown, ArrowLeftRight, Copy, Check, Star } from "lucide-react";
import { useQuickTimezoneStore } from "@/lib/timezone/store";
import { useTimezone } from "@/lib/timezone/hooks/use-timezone";
import { resolveTimezone, zonedTimeToUtc } from "@/lib/timezone/timezone";
import { formatDateLong, formatTime, formatDifferenceLabel } from "@/lib/timezone/formatter";
import { TimezoneSearch } from "./timezone-search";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function useCopy() {
  const [copied, setCopied] = React.useState<string | null>(null);
  const copy = React.useCallback((key: string, text: string) => {
    void navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied((c) => (c === key ? null : c)), 1500);
  }, []);
  return { copied, copy };
}

export function TimezoneConverter() {
  const { browserTimezone } = useTimezone();
  const defaultTimezoneId = useQuickTimezoneStore((s) => s.settings.defaultTimezoneId);
  const autoDetectLocation = useQuickTimezoneStore((s) => s.settings.autoDetectLocation);
  const fallbackSourceZone = defaultTimezoneId ?? (autoDetectLocation ? browserTimezone : "UTC");
  const sourceZoneId = useQuickTimezoneStore((s) => s.sourceZoneId) ?? fallbackSourceZone;
  const targetZoneId = useQuickTimezoneStore((s) => s.targetZoneId) ?? "UTC";
  const converterDate = useQuickTimezoneStore((s) => s.converterDate);
  const converterTime = useQuickTimezoneStore((s) => s.converterTime);
  const setSourceZone = useQuickTimezoneStore((s) => s.setSourceZone);
  const setTargetZone = useQuickTimezoneStore((s) => s.setTargetZone);
  const setConverterDate = useQuickTimezoneStore((s) => s.setConverterDate);
  const setConverterTime = useQuickTimezoneStore((s) => s.setConverterTime);
  const swapZones = useQuickTimezoneStore((s) => s.swapZones);
  const use24Hour = useQuickTimezoneStore((s) => s.settings.use24Hour);
  const addHistoryEntry = useQuickTimezoneStore((s) => s.addHistoryEntry);
  const addFavorite = useQuickTimezoneStore((s) => s.addFavorite);
  const isFavorite = useQuickTimezoneStore((s) => s.isFavorite);

  const { copied, copy } = useCopy();

  const [year, month, day] = converterDate.split("-").map(Number);
  const [hour, minute] = converterTime.split(":").map(Number);

  const isValidInput = Boolean(year && month && day && !Number.isNaN(hour) && !Number.isNaN(minute));

  // The exact wall-clock the user picked, reproduced verbatim by formatting it with
  // timeZone: "UTC" — a display-only trick, not a real conversion (see history.ts).
  const sourceWallClock = React.useMemo(
    () => (isValidInput ? new Date(Date.UTC(year, month - 1, day, hour, minute)) : null),
    [isValidInput, year, month, day, hour, minute]
  );

  const resultUtc = React.useMemo(() => {
    if (!isValidInput) return null;
    return zonedTimeToUtc(year, month, day, hour, minute, sourceZoneId);
  }, [isValidInput, year, month, day, hour, minute, sourceZoneId]);

  const source = resolveTimezone(sourceZoneId, resultUtc ?? new Date());
  const target = resolveTimezone(targetZoneId, resultUtc ?? new Date());
  const diffMinutes = target.offsetMinutes - source.offsetMinutes;

  function logConversion() {
    if (!resultUtc) return;
    addHistoryEntry(sourceZoneId, targetZoneId, `${converterDate}T${converterTime}`, resultUtc.getTime());
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-[1fr_auto_1fr] items-end gap-2">
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-muted-foreground">Source timezone</Label>
          <TimezoneSearch value={sourceZoneId} onChange={setSourceZone} />
        </div>
        <Button variant="outline" size="icon" className="mb-0.5 size-9 shrink-0" aria-label="Swap timezones" onClick={swapZones}>
          <ArrowLeftRight className="size-4" />
        </Button>
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-muted-foreground">Target timezone</Label>
          <TimezoneSearch value={targetZoneId} onChange={setTargetZone} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="tz-date" className="text-xs text-muted-foreground">
            Date
          </Label>
          <Input id="tz-date" type="date" value={converterDate} onChange={(e) => setConverterDate(e.target.value)} onBlur={logConversion} />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="tz-time" className="text-xs text-muted-foreground">
            Time
          </Label>
          <Input id="tz-time" type="time" value={converterTime} onChange={(e) => setConverterTime(e.target.value)} onBlur={logConversion} />
        </div>
      </div>

      {resultUtc && (
        <div className="flex flex-col items-center gap-2 rounded-xl border border-border p-4">
          <ZoneTimeCard
            label="Source"
            zoneId={sourceZoneId}
            city={source.city}
            abbreviation={source.abbreviation}
            date={sourceWallClock ? formatDateLong(sourceWallClock, "UTC") : ""}
            time={sourceWallClock ? formatTime(sourceWallClock, "UTC", use24Hour) : ""}
            use24Hour={use24Hour}
            onCopyTime={() => copy("source-time", formatTime(resultUtc, sourceZoneId, use24Hour))}
            onCopyZone={() => copy("source-zone", `${source.city} (${source.id})`)}
            onCopyOffset={() => copy("source-offset", source.offsetLabel)}
            copied={copied}
            keyPrefix="source"
            isFavorite={isFavorite(sourceZoneId)}
            onFavorite={() => addFavorite(sourceZoneId)}
          />

          <ArrowDown className="size-4 text-muted-foreground" />

          <ZoneTimeCard
            label="Converted"
            zoneId={targetZoneId}
            city={target.city}
            abbreviation={target.abbreviation}
            date={formatDateLong(resultUtc, targetZoneId)}
            time={formatTime(resultUtc, targetZoneId, use24Hour)}
            use24Hour={use24Hour}
            onCopyTime={() => copy("target-time", formatTime(resultUtc, targetZoneId, use24Hour))}
            onCopyZone={() => copy("target-zone", `${target.city} (${target.id})`)}
            onCopyOffset={() => copy("target-offset", target.offsetLabel)}
            copied={copied}
            keyPrefix="target"
            isFavorite={isFavorite(targetZoneId)}
            onFavorite={() => addFavorite(targetZoneId)}
            highlight
          />

          <div className="mt-1 flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium">
            <span className="text-muted-foreground">Difference</span>
            <span className={cn(diffMinutes === 0 ? "text-muted-foreground" : diffMinutes < 0 ? "text-destructive" : "text-success")}>
              {formatDifferenceLabel(diffMinutes)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

function ZoneTimeCard({
  label,
  city,
  abbreviation,
  date,
  time,
  onCopyTime,
  onCopyZone,
  onCopyOffset,
  copied,
  keyPrefix,
  isFavorite,
  onFavorite,
  highlight,
}: {
  label: string;
  zoneId: string;
  city: string;
  abbreviation: string;
  date: string;
  time: string;
  use24Hour: boolean;
  onCopyTime: () => void;
  onCopyZone: () => void;
  onCopyOffset: () => void;
  copied: string | null;
  keyPrefix: string;
  isFavorite: boolean;
  onFavorite: () => void;
  highlight?: boolean;
}) {
  return (
    <div className="flex w-full items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
          {label} · {city} ({abbreviation})
        </p>
        <p className={cn("font-mono text-2xl font-semibold tabular-nums", highlight && "text-primary")}>{time}</p>
        <p className="text-xs text-muted-foreground">{date}</p>
      </div>
      <div className="flex shrink-0 items-center gap-0.5">
        <Button variant="ghost" size="icon" className="size-7" aria-label="Copy time" onClick={onCopyTime}>
          {copied === `${keyPrefix}-time` ? <Check className="size-3.5 text-success" /> : <Copy className="size-3.5" />}
        </Button>
        <Button variant="ghost" size="icon" className="size-7" aria-label="Copy timezone" onClick={onCopyZone} title="Copy timezone">
          {copied === `${keyPrefix}-zone` ? <Check className="size-3.5 text-success" /> : <span className="text-[10px] font-medium">TZ</span>}
        </Button>
        <Button variant="ghost" size="icon" className="size-7" aria-label="Copy UTC offset" onClick={onCopyOffset} title="Copy UTC offset">
          {copied === `${keyPrefix}-offset` ? <Check className="size-3.5 text-success" /> : <span className="text-[10px] font-medium">±</span>}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className={cn("size-7", isFavorite && "text-primary")}
          aria-label={isFavorite ? "Already favorited" : "Add to favorites"}
          onClick={onFavorite}
          disabled={isFavorite}
        >
          <Star className={cn("size-3.5", isFavorite && "fill-current")} />
        </Button>
      </div>
    </div>
  );
}
