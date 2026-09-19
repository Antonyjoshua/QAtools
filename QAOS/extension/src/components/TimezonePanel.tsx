import * as React from "react";
import { POPULAR_ZONES, resolveTimezone, getZoneParts, zonedTimeToUtc, getBrowserTimezone } from "../lib/timezone/timezone";
import { formatTime, formatDate, formatDifferenceLabel } from "../lib/timezone/formatter";
import { useTimezone } from "../lib/timezone/hooks/use-timezone";

type SubTab = "converter" | "worldclock" | "meeting";

const SUB_TABS: { id: SubTab; label: string }[] = [
  { id: "converter", label: "Convert" },
  { id: "worldclock", label: "World Clock" },
  { id: "meeting", label: "Meeting" },
];

/** Popular zones, deduped by IANA id (several labels like PST/PDT intentionally share one id). */
function dedupedZones(): { id: string; label: string }[] {
  const seen = new Set<string>();
  const out: { id: string; label: string }[] = [];
  for (const z of POPULAR_ZONES) {
    if (seen.has(z.id)) continue;
    seen.add(z.id);
    out.push({ id: z.id, label: `${z.label} — ${z.id.replace(/_/g, " ")}` });
  }
  return out;
}

function ZoneSelect({ value, onChange, id }: { value: string; onChange: (id: string) => void; id: string }) {
  const zones = React.useMemo(dedupedZones, []);
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm outline-none focus:border-indigo-500 dark:border-slate-600 dark:bg-slate-800"
    >
      {zones.map((z) => (
        <option key={z.id} value={z.id}>
          {z.label}
        </option>
      ))}
    </select>
  );
}

function ConverterView() {
  const browserTz = React.useMemo(getBrowserTimezone, []);
  const [source, setSource] = React.useState(browserTz && POPULAR_ZONES.some((z) => z.id === browserTz) ? browserTz : "UTC");
  const [target, setTarget] = React.useState("Asia/Kolkata");
  const [date, setDate] = React.useState(() => new Date().toISOString().slice(0, 10));
  const [time, setTime] = React.useState(() => {
    const d = new Date();
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
  });
  const use24Hour = false;

  const result = React.useMemo(() => {
    const [y, m, d] = date.split("-").map(Number);
    const [hh, mm] = time.split(":").map(Number);
    if (!y || !m || !d || Number.isNaN(hh) || Number.isNaN(mm)) return null;
    const utcInstant = zonedTimeToUtc(y, m, d, hh, mm, source);
    const sourceInfo = resolveTimezone(source, utcInstant);
    const targetInfo = resolveTimezone(target, utcInstant);
    return {
      sourceInfo,
      targetInfo,
      targetTime: formatTime(utcInstant, target, use24Hour),
      targetDate: formatDate(utcInstant, target, "dmy"),
      diffLabel: formatDifferenceLabel(targetInfo.offsetMinutes - sourceInfo.offsetMinutes),
    };
  }, [date, time, source, target]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="tz-source" className="text-xs font-medium text-slate-600 dark:text-slate-300">
          From
        </label>
        <ZoneSelect id="tz-source" value={source} onChange={setSource} />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="flex-1 rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-800"
        />
        <input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          className="w-24 rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm dark:border-slate-600 dark:bg-slate-800"
        />
      </div>

      <button
        type="button"
        aria-label="Swap timezones"
        onClick={() => {
          setSource(target);
          setTarget(source);
        }}
        className="self-center rounded-full border border-slate-300 px-3 py-1 text-xs text-slate-500 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-400 dark:hover:bg-slate-800"
      >
        ↕ swap
      </button>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="tz-target" className="text-xs font-medium text-slate-600 dark:text-slate-300">
          To
        </label>
        <ZoneSelect id="tz-target" value={target} onChange={setTarget} />
      </div>

      {result && (
        <div
          data-testid="tz-convert-result"
          className="rounded-md border border-indigo-200 bg-indigo-50 px-3 py-2 dark:border-indigo-900 dark:bg-indigo-950"
        >
          <div className="font-mono text-lg font-semibold">{result.targetTime}</div>
          <div className="text-xs text-slate-600 dark:text-slate-300">
            {result.targetDate} · {result.targetInfo.city} ({result.targetInfo.abbreviation})
          </div>
          <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">{result.diffLabel} vs {result.sourceInfo.city}</div>
        </div>
      )}
    </div>
  );
}

function WorldClockView() {
  const { now } = useTimezone();
  const zones = React.useMemo(() => dedupedZones().slice(0, 8), []);

  return (
    <div className="flex flex-col gap-1.5" data-testid="world-clock">
      {zones.map((z) => {
        const info = resolveTimezone(z.id, now);
        return (
          <div
            key={z.id}
            className="flex items-center justify-between rounded-md border border-slate-200 px-2.5 py-1.5 dark:border-slate-700"
          >
            <div>
              <div className="text-sm font-medium">{info.city}</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                {info.abbreviation} · {info.offsetLabel}
              </div>
            </div>
            <div className="font-mono text-sm tabular-nums">{formatTime(now, z.id, false)}</div>
          </div>
        );
      })}
    </div>
  );
}

const HOURS = Array.from({ length: 24 }, (_, i) => i);

function hourLabel(h: number): string {
  const period = h < 12 ? "AM" : "PM";
  const h12 = h % 12 || 12;
  return `${h12} ${period}`;
}

function MeetingView() {
  const { now } = useTimezone();
  const zones = React.useMemo(dedupedZones, []);
  const [locA, setLocA] = React.useState("America/New_York");
  const [locB, setLocB] = React.useState("Asia/Kolkata");
  const [workStart, setWorkStart] = React.useState(9);
  const [workEnd, setWorkEnd] = React.useState(17);

  const referenceDay = React.useMemo(() => {
    const p = getZoneParts(now, "UTC");
    return { year: p.year, month: p.month, day: p.day };
  }, [now]);

  const locations = [locA, locB];

  const grid = React.useMemo(() => {
    return HOURS.map((h) => {
      const instant = new Date(Date.UTC(referenceDay.year, referenceDay.month - 1, referenceDay.day, h));
      const perLocation = locations.map((id) => {
        const localHour = getZoneParts(instant, id).hour;
        return localHour >= workStart && localHour < workEnd;
      });
      return { hour: h, perLocation, allWorking: perLocation.every(Boolean) };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    });
  }, [referenceDay, locA, locB, workStart, workEnd]);

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

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="meet-a" className="text-[11px] text-slate-500 dark:text-slate-400">
            Location A
          </label>
          <select
            id="meet-a"
            value={locA}
            onChange={(e) => setLocA(e.target.value)}
            className="rounded-md border border-slate-300 bg-white px-1.5 py-1 text-xs dark:border-slate-600 dark:bg-slate-800"
          >
            {zones.map((z) => (
              <option key={z.id} value={z.id}>
                {z.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="meet-b" className="text-[11px] text-slate-500 dark:text-slate-400">
            Location B
          </label>
          <select
            id="meet-b"
            value={locB}
            onChange={(e) => setLocB(e.target.value)}
            className="rounded-md border border-slate-300 bg-white px-1.5 py-1 text-xs dark:border-slate-600 dark:bg-slate-800"
          >
            {zones.map((z) => (
              <option key={z.id} value={z.id}>
                {z.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-2 text-xs">
        <span className="text-slate-500 dark:text-slate-400">Working hours</span>
        <select
          value={workStart}
          onChange={(e) => setWorkStart(Number(e.target.value))}
          className="rounded-md border border-slate-300 bg-white px-1 py-1 dark:border-slate-600 dark:bg-slate-800"
        >
          {HOURS.map((h) => (
            <option key={h} value={h}>
              {hourLabel(h)}
            </option>
          ))}
        </select>
        <span>to</span>
        <select
          value={workEnd}
          onChange={(e) => setWorkEnd(Number(e.target.value))}
          className="rounded-md border border-slate-300 bg-white px-1 py-1 dark:border-slate-600 dark:bg-slate-800"
        >
          {[...HOURS, 24].map((h) => (
            <option key={h} value={h}>
              {h === 24 ? "12 AM" : hourLabel(h)}
            </option>
          ))}
        </select>
      </div>

      <div className="rounded-md border border-slate-200 p-2.5 dark:border-slate-700" data-testid="meeting-result">
        {bestRange ? (
          <>
            <div className="text-xs text-slate-500 dark:text-slate-400">Best overlap (UTC)</div>
            <div className="font-mono text-base font-semibold">
              {hourLabel(bestRange.start)} – {hourLabel(bestRange.end % 24)}
            </div>
          </>
        ) : (
          <div className="text-xs text-slate-500 dark:text-slate-400">No overlapping working hours — try adjusting the window.</div>
        )}
      </div>

      <div className="flex gap-[2px] overflow-x-auto">
        {grid.map((cell) => (
          <div
            key={cell.hour}
            title={`${hourLabel(cell.hour)} UTC`}
            className={`h-4 w-2.5 shrink-0 rounded-sm ${cell.allWorking ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-700"}`}
          />
        ))}
      </div>
    </div>
  );
}

export function TimezonePanel() {
  const [sub, setSub] = React.useState<SubTab>("converter");

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-center gap-1 rounded-md bg-slate-100 p-1 text-xs dark:bg-slate-800">
        {SUB_TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setSub(t.id)}
            className={`flex-1 rounded px-2 py-1 font-medium ${
              sub === t.id
                ? "bg-white text-indigo-600 shadow-sm dark:bg-slate-700 dark:text-indigo-400"
                : "text-slate-500 dark:text-slate-400"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {sub === "converter" && <ConverterView />}
      {sub === "worldclock" && <WorldClockView />}
      {sub === "meeting" && <MeetingView />}
    </div>
  );
}
