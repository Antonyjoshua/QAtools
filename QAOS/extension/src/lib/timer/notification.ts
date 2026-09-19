let sharedAudioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  if (!sharedAudioContext) sharedAudioContext = new Ctor();
  return sharedAudioContext;
}

export type ChimeVariant = "work" | "break" | "longBreak";

/** Distinct tone patterns per session type, so you can tell which one finished by ear alone. */
const CHIME_TONES: Record<ChimeVariant, { freq: number; start: number; duration: number }[]> = {
  // Work session done, break starting — bright ascending two-tone.
  work: [
    { freq: 880, start: 0, duration: 0.16 },
    { freq: 1174.66, start: 0.14, duration: 0.22 },
  ],
  // Break over, back to work — softer descending two-tone.
  break: [
    { freq: 659.25, start: 0, duration: 0.16 },
    { freq: 523.25, start: 0.14, duration: 0.24 },
  ],
  // Full cycle done — fuller three-tone ascending fanfare.
  longBreak: [
    { freq: 523.25, start: 0, duration: 0.14 },
    { freq: 659.25, start: 0.12, duration: 0.14 },
    { freq: 783.99, start: 0.24, duration: 0.3 },
  ],
};

/** Synthesizes a short chime — no audio asset required. Each session type has its own tone pattern. */
export function playChime(volume = 0.5, variant: ChimeVariant = "work"): void {
  const ctx = getAudioContext();
  if (!ctx) return;
  if (ctx.state === "suspended") void ctx.resume();

  const now = ctx.currentTime;
  const tones = CHIME_TONES[variant];

  for (const tone of tones) {
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(tone.freq, now + tone.start);
    gain.gain.setValueAtTime(0, now + tone.start);
    gain.gain.linearRampToValueAtTime(volume * 0.35, now + tone.start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + tone.start + tone.duration);
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start(now + tone.start);
    oscillator.stop(now + tone.start + tone.duration + 0.02);
  }
}

export async function requestNotificationPermission(): Promise<NotificationPermission | null> {
  if (typeof window === "undefined" || !("Notification" in window)) return null;
  if (Notification.permission === "default") return Notification.requestPermission();
  return Notification.permission;
}

/**
 * Extension note: this uses the plain web Notification API (no "notifications" permission
 * declared in manifest.json), same as the main app. It only works while the browser considers
 * the popup's origin allowed to notify and the popup is open long enough to call it — a real
 * background alarm would need a service worker + chrome.notifications, which is out of scope
 * for this v1 (popup-only, no background script).
 */
export function showDesktopNotification(title: string, body: string): void {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission !== "granted") return;
  try {
    new Notification(title, { body });
  } catch {
    // Some platforms throw synchronously on `new Notification`; ignore.
  }
}
