import { Plugin, HmrContext } from "vite";
import path from "path";
import fs from "fs";

import { runJIT, runJITIncremental } from "../src/jit";

export default function garurVite(): Plugin {
  const ROOT = process.cwd();
  const DIST_DIR = path.join(ROOT, "dist");
  const OUT_CSS = path.join(DIST_DIR, "garur.css");

  return {
    name: "garur-vite-plugin",
    apply: "serve",

    async configureServer(server) {
      try {
        await runJIT(["**/*.{html,js,ts,jsx,tsx}"]);
        server.config.logger.info("[garur] Initial JIT build completed");
      } catch (err) {
        server.config.logger.warn(
          "[garur] Initial JIT build failed:\n" + String(err)
        );
      }
    },

    async handleHotUpdate(ctx: HmrContext) {
      try {
        const abs = path.resolve(ctx.file);

        // Avoid infinite rebuild loops
        if (abs.startsWith(DIST_DIR)) return [];

        const ext = path.extname(abs);
        const watchExt = [
          ".html",
          ".htm",
          ".js",
          ".ts",
          ".jsx",
          ".tsx",
          ".vue",
          ".svelte",
        ];

        if (!watchExt.includes(ext)) return [];

        // Run incremental JIT on a single file
        await runJITIncremental([abs]);

        // Push updated CSS through HMR
        if (fs.existsSync(OUT_CSS)) {
          const url = (ctx.server.config.base || "/") + "dist/garur.css";

          ctx.server.ws.send({
            type: "update",
            updates: [
              {
                type: "css-update",
                path: url,
                acceptedPath: url,
                timestamp: Date.now(),
              },
            ],
          });
        } else {
          // No CSS? → full reload
          ctx.server.ws.send({ type: "full-reload" });
        }

      } catch (err) {
        ctx.server.config.logger.error(
          "[garur] Incremental JIT build failed:\n" + String(err)
        );
      }

      return [];
    },
  };
}
