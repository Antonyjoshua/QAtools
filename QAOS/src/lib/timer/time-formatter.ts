function pad(n: number, len = 2): string {
  return String(Math.max(0, Math.trunc(n))).padStart(len, "0");
}

/** HH:MM:SS.mm — the stopwatch's always-on display format. */
export function formatStopwatch(ms: number, showMilliseconds = true): string {
  const totalMs = Math.max(0, ms);
  const hours = Math.floor(totalMs / 3_600_000);
  const minutes = Math.floor((totalMs % 3_600_000) / 60_000);
  const seconds = Math.floor((totalMs % 60_000) / 1000);
  const centis = Math.floor((totalMs % 1000) / 10);
  const base = `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  return showMilliseconds ? `${base}.${pad(centis)}` : base;
}

/** HH:MM:SS, or MM:SS when under an hour — used for countdowns and Pomodoro. Rounds up to the next whole second. */
export function formatCountdown(ms: number): string {
  const totalSeconds = Math.max(0, Math.ceil(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return hours > 0 ? `${pad(hours)}:${pad(minutes)}:${pad(seconds)}` : `${pad(minutes)}:${pad(seconds)}`;
}

export function formatClockTime(date: Date, use24Hour: boolean): string {
  const hours24 = date.getHours();
  const minutes = pad(date.getMinutes());
  const seconds = pad(date.getSeconds());
  if (use24Hour) return `${pad(hours24)}:${minutes}:${seconds}`;
  const period = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 || 12;
  return `${hours12}:${minutes}:${seconds} ${period}`;
}

export function formatDurationLabel(ms: number): string {
  const totalSeconds = Math.round(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const parts: string[] = [];
  if (hours) parts.push(`${hours}h`);
  if (minutes) parts.push(`${minutes}m`);
  if (seconds || parts.length === 0) parts.push(`${seconds}s`);
  return parts.join(" ");
}
