# QuanGrade Quick Tools (browser extension)

A Manifest V3 Chrome extension that ports four of QuanGrade's "Quick Tools" popups so they're
usable on any website, not just when the QuanGrade tab is open:

- **Duration Converter** — quick-expression bar ("2 hr + 35 min", "54 sec × 50 questions") plus a
  value/unit → equivalents table.
- **Timer / Pomodoro** — stopwatch, countdown timer, and a Pomodoro work/break cycle. Running
  timers are derived from wall-clock timestamps, so they keep correct time even if the popup is
  closed and reopened later (no background service worker needed).
- **Timezone Converter** — zone-to-zone conversion, a small world clock, and a simplified 2-location
  meeting-time overlap finder.
- **QuanGrade Assistant** — the same local, rule-based "how do I…" help chatbot as the main app,
  searching a ~55-entry knowledge base. No AI, no network call.

This is a separate build target from the main Next.js app (`../src`) — its own `package.json`,
its own dependency tree, its own storage (localStorage inside the extension's own origin, **not**
synced with the website's IndexedDB). Like the rest of QuanGrade, it makes zero network calls.

## Build

```bash
cd extension
npm install
npm run build
```

This runs `tsc --noEmit` (typecheck) then `vite build`, producing `extension/dist/` — a
ready-to-load unpacked extension (`popup.html`, `manifest.json`, and a `assets/` bundle).

`npm run dev` runs the Vite dev server for iterating on the popup UI in an ordinary browser tab
(useful for fast layout iteration — but always verify the real thing via "Load unpacked" too,
since extension popups behave slightly differently from a normal page).

## Load it in Chrome

1. `npm run build` (above).
2. Open `chrome://extensions`.
3. Enable **Developer mode** (top right).
4. Click **Load unpacked** and select `extension/dist`.
5. Pin "QuanGrade Quick Tools" from the extensions toolbar menu (puzzle-piece icon) and click it
   to open the popup.

## Project layout

```
extension/
  manifest.json        MV3 manifest — action.default_popup only, no other permissions
  popup.html            popup entry HTML
  vite.config.ts         Vite build config (React + Tailwind v4 + copies manifest.json into dist/)
  src/
    popup.tsx            React root
    App.tsx               tab shell (Duration / Timer / Timezone / Assistant)
    index.css              Tailwind entry + popup sizing
    components/            presentational panels for each tool (new, popup-sized — not reused
                            from the website's floating/portaled widgets)
    lib/
      duration/            ported as-is from src/lib/duration (pure, zero framework deps)
      timer/                ported logic + hooks; store.ts is a trimmed zustand store (drops the
                            website widget's floating-popup chrome: isOpen/isPinned/activeTab)
      timezone/             ported logic + hooks; store.ts trimmed the same way
      help/                 ported as-is from src/lib/help (knowledge base + deterministic
                            keyword search — AI_PROVIDER is already `null` upstream, so this was
                            already network-free)
```

## Known gap: icons

`manifest.json` intentionally does **not** reference an `icons` / `action.default_icon` key yet.
No image-generation tooling was available to produce real PNGs, and Chrome hard-fails to load an
unpacked extension if a referenced icon file is missing — so rather than ship a manifest that
can't load, the icon keys are left out entirely for this v1 (Chrome shows a generic puzzle-piece
icon in the toolbar in the meantime, which is harmless).

See `extension/icons/TODO.md` for the exact sizes needed (16/48/128) and the manifest.json snippet
to add back once a human or design tool supplies real `.png` files — `vite.config.ts` already
picks up and copies any `.png` files placed in `extension/icons/` on build.
