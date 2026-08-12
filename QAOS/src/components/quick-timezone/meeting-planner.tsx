"use client";

import * as React from "react";
import { Plus, X, CalendarClock } from "lucide-react";
import { useQuickTimezoneStore } from "@/lib/timezone/store";
import { useTimezone } from "@/lib/timezone/hooks/use-timezone";
import { resolveTimezone, getZoneParts } from "@/lib/timezone/timezone";
import { formatTime } from "@/lib/timezone/formatter";
import { TimezoneSearch } from "./timezone-search";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const LOCATION_LABELS = ["Location A", "Location B", "Location C"];

function hourLabel(h: number): string {
  const period = h < 12 ? "AM" : "PM";
  const h12 = h % 12 || 12;
  return `${h12} ${period}`;
}

export function MeetingPlanner() {
  const { now, browserTimezone } = useTimezone();
  const meetingLocations = useQuickTimezoneStore((s) => s.meetingLocations);
  const setMeetingLocation = useQuickTimezoneStore((s) => s.setMeetingLocation);
  const addMeetingLocation = useQuickTimezoneStore((s) => s.addMeetingLocation);
  const removeMeetingLocation = useQuickTimezoneStore((s) => s.removeMeetingLocation);
  const workingHoursStart = useQuickTimezoneStore((s) => s.workingHoursStart);
  const workingHoursEnd = useQuickTimezoneStore((s) => s.workingHoursEnd);
  const setWorkingHours = useQuickTimezoneStore((s) => s.setWorkingHours);
  const use24Hour = useQuickTimezoneStore((s) => s.settings.use24Hour);

  const locations = React.useMemo(() => {
    const ids: (string | null)[] = [meetingLocations[0]?.timezoneId ?? browserTimezone, meetingLocations[1]?.timezoneId ?? null, meetingLocations[2]?.timezoneId ?? null];
    return ids;
  }, [meetingLocations, browserTimezone]);

  const activeLocations = locations.filter((id): id is string => Boolean(id));

  const referenceDay = React.useMemo(() => {
    const p = getZoneParts(now, "UTC");
    return { year: p.year, month: p.month, day: p.day };
  }, [now]);

  // For each UTC hour of the reference day, whether each active location is inside its working-hours window.
  const grid = React.useMemo(() => {
    return HOURS.map((h) => {
      const instant = new Date(Date.UTC(referenceDay.year, referenceDay.month - 1, referenceDay.day, h));
      const perLocation = activeLocations.map((id) => {
        const localHour = getZoneParts(instant, id).hour;
        return localHour >= workingHoursStart && localHour < workingHoursEnd;
      });
      return { hour: h, perLocation, allWorking: perLocation.length > 0 && perLocation.every(Boolean) };
    });
  }, [referenceDay, activeLocations, workingHoursStart, workingHoursEnd]);

  const bestRange = React.useMemo(() => {
    let bestStart = -1;
    let bestLength = 0;
    let curStart = -1;
    let curLength = 0;
    for (let i = 0; i < grid.length; i++) {
      if (grid[i].allWorking) {
        if (curLength === 0) curStart = i;
        curLength++;
        if (curLength > bestLength) {
          bestLength = curLength;
          bestStart = curStart;
        }
      } else {
        curLength = 0;
      }
    }
    return bestLength > 0 ? { start: bestStart, end: bestStart + bestLength } : null;
  }, [grid]);

  const overlapCount = grid.filter((g) => g.allWorking).length;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        {LOCATION_LABELS.map((label, index) => {
          const isOptionalThird = index === 2;
          if (isOptionalThird && !meetingLocations[2]) {
            return (
              <Button key={label} variant="outline" size="sm" className="w-fit gap-1.5" onClick={addMeetingLocation}>
                <Plus className="size-3.5" />
                Add location C
              </Button>
            );
          }
          return (
            <div key={label} className="flex items-end gap-2">
              <div className="flex flex-1 flex-col gap-1.5">
                <Label className="text-xs text-muted-foreground">{label}</Label>
                <TimezoneSearch value={locations[index]} onChange={(id) => setMeetingLocation(index, id)} />
              </div>
              {isOptionalThird && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="mb-0.5 size-9 shrink-0 text-muted-foreground"
                  aria-label="Remove location C"
                  onClick={() => meetingLocations[2] && removeMeetingLocation(meetingLocations[2].id)}
                >
                  <X className="size-4" />
                </Button>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-end gap-2">
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-muted-foreground">Working hours from</Label>
          <Select value={String(workingHoursStart)} onValueChange={(v) => setWorkingHours(Number(v), workingHoursEnd)}>
            <SelectTrigger className="w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent positionerClassName="z-[110]">
              {HOURS.map((h) => (
                <SelectItem key={h} value={String(h)}>
                  {hourLabel(h)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label className="text-xs text-muted-foreground">to</Label>
          <Select value={String(workingHoursEnd)} onValueChange={(v) => setWorkingHours(workingHoursStart, Number(v))}>
            <SelectTrigger className="w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent positionerClassName="z-[110]">
              {[...HOURS, 24].map((h) => (
                <SelectItem key={h} value={String(h)}>
                  {h === 24 ? "12 AM" : hourLabel(h)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {activeLocations.length < 2 ? (
        <p className="py-6 text-center text-sm text-muted-foreground">Add a second location to find overlapping hours.</p>
      ) : (
        <>
          <div className="rounded-xl border border-border p-3">
            <div className="flex items-center gap-2 text-sm font-medium">
              <CalendarClock className="size-4 text-primary" />
              Best meeting time
            </div>
            {bestRange ? (
              <div className="mt-2 flex flex-col gap-1">
                <p className="font-mono text-lg font-semibold tabular-nums">
                  {hourLabel(bestRange.start)} – {hourLabel(bestRange.end % 24)} <span className="text-xs font-normal text-muted-foreground">UTC</span>
                </p>
                <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-xs text-muted-foreground">
                  {activeLocations.map((id) => {
                    const startInstant = new Date(Date.UTC(referenceDay.year, referenceDay.month - 1, referenceDay.day, bestRange.start));
                    const info = resolveTimezone(id, now);
                    return (
                      <span key={id}>
                        {info.city}: {formatTime(startInstant, id, use24Hour)}
                      </span>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">No overlapping working hours today — try adjusting the working-hours window.</p>
            )}
            <p className="mt-2 text-xs text-muted-foreground">{overlapCount} of 24 hours overlap across all locations.</p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full border-collapse text-[10px]">
              <tbody>
                {activeLocations.map((id) => {
                  const info = resolveTimezone(id, now);
                  return (
                    <tr key={id}>
                      <td className="sticky left-0 z-10 min-w-24 bg-card px-2 py-1.5 text-xs font-medium">{info.city}</td>
                      {grid.map((cell, i) => {
                        const working = cell.perLocation[activeLocations.indexOf(id)];
                        const isBest = bestRange && i >= bestRange.start && i < bestRange.end;
                        return (
                          <td key={cell.hour} className="p-0">
                            <div
                              className={cn(
                                "h-6 w-4 border border-background",
                                working ? "bg-success/60" : "bg-muted",
                                isBest && working && "bg-primary"
                              )}
                              title={`${hourLabel(cell.hour)} UTC`}
                            />
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
