// playground/server.js (async loader + ESM import fallback + ts-node fallback)
//
// Usage:
//  - From repo root: node playground/server.js
//  - From playground/ dir: node playground/server.js
//
// Endpoints:
//  - GET  /api/status
//  - POST /api/build  { classes: "p-4 bg-blue-500" }
//  - POST /api/reload -> re-attempt to load dist or src modules after a build

const express = require("express");
const path = require("path");
const fs = require("fs");
const { pathToFileURL } = require("url");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS for local usage
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

function findProjectRoot(startDir) {
  let cur = path.resolve(startDir);
  const root = path.parse(cur).root;
  while (true) {
    const maybeDistBuilder = path.join(cur, "dist", "builder.js");
    const maybePkg = path.join(cur, "package.json");
    if (fs.existsSync(maybeDistBuilder)) return cur;
    if (fs.existsSync(maybePkg)) return cur;
    if (cur === root) break;
    cur = path.dirname(cur);
  }
  return null;
}

const candidates = [process.cwd(), __dirname];
let PROJECT_ROOT = null;
for (const c of candidates) {
  const found = findProjectRoot(c);
  if (found) { PROJECT_ROOT = found; break; }
}
if (!PROJECT_ROOT) {
  const up = path.resolve(__dirname, "..");
  if (findProjectRoot(up)) PROJECT_ROOT = up;
}
if (!PROJECT_ROOT) PROJECT_ROOT = path.resolve(__dirname, "..");

const DIST_DIR = path.join(PROJECT_ROOT, "dist");
const DIST_BUILDER = path.join(DIST_DIR, "builder.js");
const DIST_MARGE = path.join(DIST_DIR, "marge.js");

let builder = null;
let mergeComponent = null;
let startupErrors = [];

/**
 * Try loading builder/marge using multiple strategies:
 *  1) require(dist/*.js)
 *  2) dynamic import(file://...dist/*.js)  (ESM fallback)
 *  3) ts-node/register -> require(src/*.ts) (dev fallback; requires ts-node installed)
 */
async function tryLoadBuilder() {
  builder = null;
  mergeComponent = null;
  startupErrors = [];

  // 1) try require() compiled dist
  try {
    if (fs.existsSync(DIST_BUILDER)) {
      try {
        builder = require(DIST_BUILDER);
        console.log(`Loaded builder with require() from ${DIST_BUILDER}`);
      } catch (err) {
        startupErrors.push(`Failed to require ${DIST_BUILDER}: ${err && err.message ? err.message : String(err)}`);
      }
    } else {
      startupErrors.push(`dist builder not found at ${DIST_BUILDER}`);
    }
  } catch (e) {
    startupErrors.push(`Error checking ${DIST_BUILDER}: ${String(e)}`);
  }

  try {
    if (fs.existsSync(DIST_MARGE)) {
      try {
        const mg = require(DIST_MARGE);
        mergeComponent = mg.mergeComponent || (mg.default && mg.default.mergeComponent) || mg;
        console.log(`Loaded marge with require() from ${DIST_MARGE}`);
      } catch (err) {
        startupErrors.push(`Failed to require ${DIST_MARGE}: ${err && err.message ? err.message : String(err)}`);
      }
    } else {
      startupErrors.push(`dist marge not found at ${DIST_MARGE}`);
    }
  } catch (e) {
    startupErrors.push(`Error checking ${DIST_MARGE}: ${String(e)}`);
  }

  // 2) If require() failed, try dynamic import() (handles ESM output)
  if ((!builder || !mergeComponent) && fs.existsSync(DIST_DIR)) {
    try {
      if (!builder && fs.existsSync(DIST_BUILDER)) {
        const mod = await import(pathToFileURL(DIST_BUILDER).href);
        builder = mod.default || mod;
        console.log(`Loaded builder via dynamic import from ${DIST_BUILDER}`);
      }
    } catch (err) {
      startupErrors.push(`Dynamic import for builder failed: ${err && err.message ? err.message : String(err)}`);
    }
    try {
      if (!mergeComponent && fs.existsSync(DIST_MARGE)) {
        const mod = await import(pathToFileURL(DIST_MARGE).href);
        const mg = mod.default || mod;
        mergeComponent = mg.mergeComponent || mg.default && mg.default.mergeComponent || mg;
        console.log(`Loaded marge via dynamic import from ${DIST_MARGE}`);
      }
    } catch (err) {
      startupErrors.push(`Dynamic import for marge failed: ${err && err.message ? err.message : String(err)}`);
    }
  }

  // 3) If still not loaded, try ts-node/register fallback (for development)
  if ((!builder || !mergeComponent)) {
    try {
      // Attempt to resolve ts-node from project root
      const tsNodeRegister = require.resolve("ts-node/register", { paths: [PROJECT_ROOT] });
      if (tsNodeRegister) {
        require("ts-node/register");
        const srcBuilderPath = path.join(PROJECT_ROOT, "src", "builder.ts");
        const srcMargePath = path.join(PROJECT_ROOT, "src", "marge.ts");

        if (fs.existsSync(srcBuilderPath)) {
          try {
            const bmod = require(srcBuilderPath);
            builder = (bmod && bmod.build) ? bmod : (bmod && bmod.default ? bmod.default : bmod);
            console.log(`Loaded builder from ${srcBuilderPath} via ts-node`);
          } catch (err) {
            startupErrors.push(`Failed to require ${srcBuilderPath} via ts-node: ${err && err.message ? err.message : String(err)}`);
          }
        } else {
          startupErrors.push(`src/builder.ts not found at ${srcBuilderPath}`);
        }

        if (fs.existsSync(srcMargePath)) {
          try {
            const mg = require(srcMargePath);
            mergeComponent = mg.mergeComponent || (mg.default && mg.default.mergeComponent) || mg;
            console.log(`Loaded marge from ${srcMargePath} via ts-node`);
          } catch (err) {
            startupErrors.push(`Failed to require ${srcMargePath} via ts-node: ${err && err.message ? err.message : String(err)}`);
          }
        } else {
          startupErrors.push(`src/marge.ts not found at ${srcMargePath}`);
        }
      }
    } catch (err) {
      startupErrors.push(`ts-node fallback unavailable or failed: ${err && err.message ? err.message : String(err)}`);
    }
  }

  // Normalize shapes
  if (builder) {
    if (typeof builder.build !== "function" && typeof builder.default === "function") {
      builder = { build: builder.default };
    } else if (typeof builder.default === "object" && typeof builder.default.build === "function" && !builder.build) {
      builder = builder.default;
    }
  }
}

app.get("/api/status", (req, res) => {
  res.json({
    ok: !!builder,
    builder: !!builder,
    mergeComponent: !!mergeComponent,
    projectRoot: PROJECT_ROOT,
    distDir: DIST_DIR,
    startupErrors,
  });
});

app.post("/api/build", async (req, res) => {
  // ensure builder is loaded (if user built after server start, they can POST /api/reload; we also attempt now)
  if (!builder || !mergeComponent) {
    // attempt to reload dynamically once
    await tryLoadBuilder();
  }

  const classesRaw = String(req.body.classes || "").trim();
  if (!classesRaw) return res.json({ css: "", perClass: {}, ok: true });

  const tokens = classesRaw.split(/\s+/).filter(Boolean);
  const perClass = {};
  const cssParts = [];
  const errors = [];

  for (const t of tokens) {
    let out = null;
    try {
      if (builder && typeof builder.build === "function") {
        out = builder.build(t);
        if (!out && typeof builder.build === "function") out = builder.build(t, true);
      } else {
        errors.push(`builder.build not available; ensure dist/builder.js exists under project root: ${PROJECT_ROOT}`);
        out = `/* builder not available - build ${t} */`;
      }
    } catch (e) {
      const msg = e && e.message ? e.message : String(e);
      errors.push(`error building ${t}: ${msg}`);
      out = `/* error building ${t}: ${msg} */`;
    }
    perClass[t] = out || "";
    if (out) cssParts.push(out);
  }

  if (mergeComponent && typeof mergeComponent === "function") {
    try {
      const compTokens = tokens.filter(tok => {
        try {
          const r = mergeComponent([tok]);
          return !!r;
        } catch {
          return false;
        }
      });
      for (const c of compTokens) {
        try {
          const compCss = mergeComponent([c]);
          if (compCss) cssParts.unshift(compCss);
        } catch (e) {
          errors.push(`component ${c} build error: ${e && e.message ? e.message : String(e)}`);
        }
      }
    } catch (e) {
      errors.push(`mergeComponent invocation failed: ${e && e.message ? e.message : String(e)}`);
    }
  } else {
    if (!mergeComponent) startupErrors.push("mergeComponent not available - component CSS won't be generated");
  }

  const css = cssParts.join("\n\n");
  res.json({ css, perClass, errors, ok: errors.length === 0 });
});

app.post("/api/reload", async (req, res) => {
  try {
    // clear dist requires from cache
    [DIST_BUILDER, DIST_MARGE].forEach(p => {
      try {
        const resolved = require.resolve(p);
        delete require.cache[resolved];
      } catch {}
    });
    await tryLoadBuilder();
    res.json({ ok: !!builder, startupErrors });
  } catch (e) {
    res.status(500).json({ ok: false, error: e && e.message ? e.message : String(e) });
  }
});

(async () => {
  await tryLoadBuilder();
  const port = process.env.PORT || 5173;
  app.listen(port, () => {
    console.log(`Garur Playground running at http://localhost:${port}`);
    console.log("Endpoints:");
    console.log("  GET  /api/status       -> check builder/merge status");
    console.log("  POST /api/build        -> { classes: 'p-4 bg-red-500' }");
    console.log("  POST /api/reload       -> attempt to reload dist modules (use after yarn build)");
    if (startupErrors.length) {
      console.warn("Startup warnings / errors:", startupErrors);
      console.warn("If dist/builder.js is missing or ESM, run `yarn build` from your project root and then POST /api/reload.");
    } else {
      console.log(`projectRoot: ${PROJECT_ROOT}`);
    }
  });
})();