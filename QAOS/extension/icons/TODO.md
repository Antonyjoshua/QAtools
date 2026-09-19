# Icons — TODO (needs a human/design tool)

This folder intentionally has no `.png` files yet. I have no image-generation tooling available,
so I'm not fabricating binary PNG content — that needs a human or a design tool to produce.

Needed, once available:

- `icon16.png` — 16×16
- `icon48.png` — 48×48
- `icon128.png` — 128×128

Why `manifest.json` doesn't reference them yet: Chrome's unpacked-extension loader hard-fails
("Could not load icon '...' specified in 'icons'.") when a referenced icon file is missing —
it won't load the extension at all, not even with a placeholder. Since this build was required to
be verified as an actually-loadable extension, `manifest.json` currently omits the `icons` /
`action.default_icon` keys entirely. Chrome falls back to a generic puzzle-piece icon in the
toolbar in the meantime, which is harmless.

Once real PNGs are dropped in this folder (`vite.config.ts`'s `copyExtensionAssets` plugin will
already pick up any `.png` files here and copy them into `dist/icons/` on build), add this back to
`manifest.json`:

```json
{
  "icons": {
    "16": "icons/icon16.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  },
  "action": {
    "default_popup": "popup.html",
    "default_icon": {
      "16": "icons/icon16.png",
      "48": "icons/icon48.png",
      "128": "icons/icon128.png"
    }
  }
}
```
