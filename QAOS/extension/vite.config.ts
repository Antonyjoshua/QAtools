import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { copyFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";
import { resolve } from "node:path";

/** Copies manifest.json (and icons/, if any real assets are ever added) into dist/ after the build. */
function copyExtensionAssets(): Plugin {
  return {
    name: "copy-extension-assets",
    closeBundle() {
      const root = __dirname;
      const dist = resolve(root, "dist");
      mkdirSync(dist, { recursive: true });
      copyFileSync(resolve(root, "manifest.json"), resolve(dist, "manifest.json"));

      const iconsDir = resolve(root, "icons");
      if (existsSync(iconsDir)) {
        const files = readdirSync(iconsDir).filter((f) => f.endsWith(".png"));
        if (files.length > 0) {
          mkdirSync(resolve(dist, "icons"), { recursive: true });
          for (const f of files) copyFileSync(resolve(iconsDir, f), resolve(dist, "icons", f));
        }
      }
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), copyExtensionAssets()],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: resolve(__dirname, "popup.html"),
      },
    },
  },
});
