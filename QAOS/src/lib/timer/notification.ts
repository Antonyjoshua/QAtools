let sharedAudioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  if (!sharedAudioContext) sharedAudioContext = new Ctor();
  return sharedAudioContext;
}

/** Synthesizes a short two-tone chime — no audio asset required. */
export function playChime(volume = 0.5): void {
  const ctx = getAudioContext();
  if (!ctx) return;
  if (ctx.state === "suspended") void ctx.resume();

  const now = ctx.currentTime;
  const tones = [
    { freq: 880, start: 0, duration: 0.16 },
    { freq: 1174.66, start: 0.14, duration: 0.22 },
  ];

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

export function showDesktopNotification(title: string, body: string): void {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission !== "granted") return;
  try {
    new Notification(title, { body, icon: "/icon.svg" });
  } catch {
    // Some platforms (e.g. mobile Safari) throw synchronously on `new Notification`; ignore.
  }
}
