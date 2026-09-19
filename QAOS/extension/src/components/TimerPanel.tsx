import * as React from "react";
import { useStopwatch } from "../lib/timer/hooks/use-stopwatch";
import { useTimer } from "../lib/timer/hooks/use-timer";
import { usePomodoro } from "../lib/timer/hooks/use-pomodoro";
import { formatStopwatch, formatCountdown } from "../lib/timer/time-formatter";
import { COUNTDOWN_PRESETS_SECONDS } from "../lib/timer/types";

type SubTab = "stopwatch" | "timer" | "pomodoro";

const SUB_TABS: { id: SubTab; label: string }[] = [
  { id: "stopwatch", label: "Stopwatch" },
  { id: "timer", label: "Timer" },
  { id: "pomodoro", label: "Pomodoro" },
];

function Btn({
  children,
  onClick,
  variant = "primary",
  disabled,
}: {
  children: React.ReactNode;
  onClick: () => void;
  variant?: "primary" | "secondary";
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-md px-3 py-1.5 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-40 ${
        variant === "primary"
          ? "bg-indigo-600 text-white hover:bg-indigo-700"
          : "border border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
      }`}
    >
      {children}
    </button>
  );
}

function StopwatchView() {
  const { elapsedMs, laps, isRunning, start, pause, reset, lap, clearLaps } = useStopwatch();

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="font-mono text-3xl font-semibold tabular-nums" data-testid="stopwatch-display">
        {formatStopwatch(elapsedMs)}
      </div>
      <div className="flex gap-2">
        {!isRunning ? <Btn onClick={start}>Start</Btn> : <Btn onClick={pause}>Pause</Btn>}
        <Btn variant="secondary" onClick={lap} disabled={!isRunning}>
          Lap
        </Btn>
        <Btn variant="secondary" onClick={reset}>
          Reset
        </Btn>
      </div>
      {laps.length > 0 && (
        <div className="w-full">
          <div className="flex items-center justify-between px-1 text-[11px] text-slate-500 dark:text-slate-400">
            <span>{laps.length} laps</span>
            <button onClick={clearLaps} className="underline">
              Clear
            </button>
          </div>
          <div className="mt-1 max-h-28 overflow-y-auto rounded-md border border-slate-200 dark:border-slate-700">
            {laps.map((l) => (
              <div
                key={l.id}
                className="flex justify-between border-b border-slate-100 px-2 py-1 font-mono text-xs last:border-0 dark:border-slate-800"
              >
                <span className="text-slate-400">#{l.index}</span>
                <span>{formatStopwatch(l.lapMs)}</span>
                <span className="text-slate-400">{formatStopwatch(l.totalMs)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function TimerView() {
  const { remainingMs, totalMs, isRunning, setDuration, start, pause, reset } = useTimer();
  const [customMin, setCustomMin] = React.useState("5");

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="font-mono text-3xl font-semibold tabular-nums" data-testid="countdown-display">
        {formatCountdown(remainingMs)}
      </div>
      <div className="flex flex-wrap justify-center gap-1.5">
        {COUNTDOWN_PRESETS_SECONDS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setDuration(s * 1000)}
            className="rounded-md border border-slate-300 px-2 py-1 text-xs hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-800"
          >
            {s < 60 ? `${s}s` : `${s / 60}m`}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <input
          type="number"
          min={1}
          value={customMin}
          onChange={(e) => setCustomMin(e.target.value)}
          className="w-16 rounded-md border border-slate-300 px-2 py-1 text-sm dark:border-slate-600 dark:bg-slate-800"
        />
        <span className="text-xs text-slate-500 dark:text-slate-400">minutes</span>
        <Btn
          variant="secondary"
          onClick={() => {
            const n = Number(customMin);
            if (Number.isFinite(n) && n > 0) setDuration(n * 60_000);
          }}
        >
          Set
        </Btn>
      </div>
      <div className="flex gap-2">
        {!isRunning ? (
          <Btn onClick={start} disabled={remainingMs <= 0}>
            Start
          </Btn>
        ) : (
          <Btn onClick={pause}>Pause</Btn>
        )}
        <Btn variant="secondary" onClick={reset}>
          Reset
        </Btn>
      </div>
      <div className="text-[11px] text-slate-400">Total: {formatCountdown(totalMs)}</div>
    </div>
  );
}

function PomodoroView() {
  const { phase, remainingMs, isRunning, completedWorkSessions, completedToday, settings, updateSettings, start, pause, skip, resetCycle } =
    usePomodoro();

  const phaseLabel = phase === "work" ? "Focus" : phase === "break" ? "Short break" : "Long break";
  const phaseColor =
    phase === "work"
      ? "text-indigo-600 dark:text-indigo-400"
      : phase === "break"
        ? "text-emerald-600 dark:text-emerald-400"
        : "text-amber-600 dark:text-amber-400";

  return (
    <div className="flex flex-col items-center gap-3">
      <div className={`text-sm font-semibold uppercase tracking-wide ${phaseColor}`}>{phaseLabel}</div>
      <div className="font-mono text-3xl font-semibold tabular-nums" data-testid="pomodoro-display">
        {formatCountdown(remainingMs)}
      </div>
      <div className="flex gap-2">
        {!isRunning ? <Btn onClick={start}>Start</Btn> : <Btn onClick={pause}>Pause</Btn>}
        <Btn variant="secondary" onClick={skip}>
          Skip
        </Btn>
        <Btn variant="secondary" onClick={resetCycle}>
          Reset cycle
        </Btn>
      </div>
      <div className="text-[11px] text-slate-500 dark:text-slate-400">
        {completedWorkSessions} of {settings.sessionsUntilLongBreak} sessions this cycle · {completedToday} completed today
      </div>
      <div className="grid w-full grid-cols-3 gap-2 border-t border-slate-200 pt-3 text-center dark:border-slate-700">
        <label className="flex flex-col gap-1 text-[11px] text-slate-500 dark:text-slate-400">
          Work (min)
          <input
            type="number"
            min={1}
            value={settings.workMinutes}
            onChange={(e) => updateSettings({ workMinutes: Number(e.target.value) || 1 })}
            className="rounded-md border border-slate-300 px-1.5 py-1 text-center text-xs dark:border-slate-600 dark:bg-slate-800"
          />
        </label>
        <label className="flex flex-col gap-1 text-[11px] text-slate-500 dark:text-slate-400">
          Break (min)
          <input
            type="number"
            min={1}
            value={settings.breakMinutes}
            onChange={(e) => updateSettings({ breakMinutes: Number(e.target.value) || 1 })}
            className="rounded-md border border-slate-300 px-1.5 py-1 text-center text-xs dark:border-slate-600 dark:bg-slate-800"
          />
        </label>
        <label className="flex flex-col gap-1 text-[11px] text-slate-500 dark:text-slate-400">
          Long break
          <input
            type="number"
            min={1}
            value={settings.longBreakMinutes}
            onChange={(e) => updateSettings({ longBreakMinutes: Number(e.target.value) || 1 })}
            className="rounded-md border border-slate-300 px-1.5 py-1 text-center text-xs dark:border-slate-600 dark:bg-slate-800"
          />
        </label>
      </div>
    </div>
  );
}

export function TimerPanel() {
  const [sub, setSub] = React.useState<SubTab>("stopwatch");

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

      {sub === "stopwatch" && <StopwatchView />}
      {sub === "timer" && <TimerView />}
      {sub === "pomodoro" && <PomodoroView />}
    </div>
  );
}
