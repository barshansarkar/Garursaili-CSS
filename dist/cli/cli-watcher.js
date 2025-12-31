/**
 * ---------------------------------------------------------------------
 *  GARUR-CSS — Ultra-fast Atomic CSS Engine
 *  Author: Barshan Sarkar
 *  Version: 1.0.0
 *  License: MIT
 * ---------------------------------------------------------------------
 *
 *  Watch mode that actually works
 *  (Fixed properly this time)
 * ---------------------------------------------------------------------
 */
import chokidar from "chokidar";
import path from "path";
import fs from "fs";
import pc from "picocolors";
// Use dynamic import to avoid path issues
async function loadGarur() {
    try {
        // Try different paths for the JIT engine
        const paths = [
            "../core/ssc.js",
            "./core/ssc.js",
            path.join(__dirname, "../core/ssc.js"),
            path.join(process.cwd(), "core/ssc.js")
        ];
        for (const modulePath of paths) {
            try {
                const module = await import(modulePath);
                if (module.runJIT && module.runJITIncremental) {
                    return module;
                }
            }
            catch (e) {
                // Continue to next path
            }
        }
        throw new Error("Garur JIT engine not found. Tried: " + paths.join(", "));
    }
    catch (error) {
        console.error(pc.red("Failed to load Garur engine:"), error);
        process.exit(1);
    }
}
async function main() {
    console.log(pc.cyan("🚀 Starting Garur-CSS Watch Mode"));
    console.log(pc.gray("Watching for file changes...\n"));
    // Load Garur engine
    const { runJIT, runJITIncremental } = await loadGarur();
    const args = process.argv.slice(2);
    // FIXED: Don't include ignore patterns in watch list
    const watchPatterns = args.length ? args : [
        "**/*.{html,htm,vue,svelte,astro,jsx,tsx,js,ts}",
        "src/**/*",
        "app/**/*",
        "pages/**/*",
        "components/**/*"
    ];
    // Separate build patterns (what to actually scan)
    const buildPatterns = args.length ? args : [
        "**/*.{html,htm,vue,svelte,astro,jsx,tsx,js,ts}",
        "src/**/*",
        "app/**/*",
        "pages/**/*",
        "components/**/*"
    ];
    console.log(pc.dim(`Watching: ${watchPatterns.join(", ")}`));
    // Ensure output directory exists
    const outputDir = path.resolve(process.cwd(), "dist");
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
        console.log(pc.green(`Created output directory: ${outputDir}`));
    }
    // Initial build with better error handling
    try {
        console.log(pc.cyan("⚡ Running initial build..."));
        // Convert patterns to absolute paths
        const absolutePatterns = buildPatterns.map(p => path.isAbsolute(p) ? p : path.resolve(process.cwd(), p));
        const stats = await runJIT(absolutePatterns);
        console.log(pc.green(`✅ Initial build complete!`));
        console.log(pc.dim(`   Files: ${stats.filesScanned} | Classes: ${stats.uniqueClasses} | CSS: ${(stats.cssBytes / 1024).toFixed(1)}KB`));
        // Verify CSS was generated
        const cssPath = path.join(outputDir, "garur.css");
        if (fs.existsSync(cssPath)) {
            const css = fs.readFileSync(cssPath, "utf-8");
            console.log(pc.green(`📄 CSS generated: ${css.length} bytes, ${css.split('\n').length} lines`));
        }
        else {
            console.warn(pc.yellow("⚠️  No CSS file generated! Check your patterns."));
        }
    }
    catch (error) {
        console.error(pc.red("❌ Initial build failed:"), error.message);
        console.log(pc.gray("Continuing to watch anyway..."));
    }
    // Watch configuration - FIXED: Remove ignore patterns from watch list
    const watcher = chokidar.watch(watchPatterns, {
        ignored: [
            "**/node_modules/**",
            "**/dist/**",
            "**/.git/**",
            "**/.next/**",
            "**/.nuxt/**",
            "**/build/**",
            "**/out/**",
            "**/*.map",
            "**/.DS_Store",
            "**/Thumbs.db"
        ],
        ignoreInitial: true,
        persistent: true,
        cwd: process.cwd(),
        awaitWriteFinish: {
            stabilityThreshold: 150,
            pollInterval: 50
        }
    });
    let pending = new Set();
    let deleted = new Set();
    let timer = null;
    let isBuilding = false;
    let buildCount = 0;
    async function flushChanges() {
        if (isBuilding) {
            if (process.env.DEBUG)
                console.log(pc.yellow("Build already in progress, queuing..."));
            return;
        }
        const changedFiles = Array.from(pending);
        const deletedFiles = Array.from(deleted);
        if (changedFiles.length === 0 && deletedFiles.length === 0) {
            return;
        }
        isBuilding = true;
        pending.clear();
        deleted.clear();
        console.log(pc.cyan(`\n🔄 Rebuilding (${++buildCount})...`));
        if (process.env.DEBUG) {
            console.log(pc.dim(`Changed: ${changedFiles.map(f => path.relative(process.cwd(), f)).join(", ")}`));
            if (deletedFiles.length > 0) {
                console.log(pc.dim(`Deleted: ${deletedFiles.map(f => path.relative(process.cwd(), f)).join(", ")}`));
            }
        }
        try {
            const startTime = Date.now();
            // FIXED: runJITIncremental might expect different parameters
            // Check your function signature
            if (runJITIncremental.length === 1) {
                await runJITIncremental(changedFiles);
            }
            else {
                await runJITIncremental(changedFiles, deletedFiles);
            }
            const elapsed = Date.now() - startTime;
            // Verify CSS was updated
            const cssPath = path.join(outputDir, "garur.css");
            if (fs.existsSync(cssPath)) {
                const stats = fs.statSync(cssPath);
                console.log(pc.green(`✅ Rebuilt in ${elapsed}ms`));
                console.log(pc.dim(`   CSS updated at: ${stats.mtime.toLocaleTimeString()}`));
                if (process.env.DEBUG) {
                    const css = fs.readFileSync(cssPath, "utf-8");
                    console.log(pc.dim(`   Size: ${css.length} bytes, Lines: ${css.split('\n').length}`));
                }
            }
            else {
                console.warn(pc.yellow("⚠️  No CSS file after rebuild!"));
            }
        }
        catch (error) {
            console.error(pc.red("❌ Rebuild failed:"), error.message);
            // Fallback to full rebuild on error
            console.log(pc.yellow("Attempting full rebuild..."));
            try {
                const absolutePatterns = buildPatterns.map(p => path.isAbsolute(p) ? p : path.resolve(process.cwd(), p));
                await runJIT(absolutePatterns);
                console.log(pc.green("✅ Full rebuild succeeded"));
            }
            catch (fallbackError) {
                console.error(pc.red("❌ Full rebuild also failed:"), fallbackError.message);
            }
        }
        finally {
            isBuilding = false;
            // Process any changes that came in while building
            if (pending.size > 0 || deleted.size > 0) {
                console.log(pc.cyan("Processing queued changes..."));
                setTimeout(flushChanges, 100);
            }
        }
    }
    function scheduleFlush() {
        if (timer)
            clearTimeout(timer);
        timer = setTimeout(flushChanges, 200); // 200ms debounce
    }
    // Event handlers
    watcher
        .on("add", (filePath) => {
        const fullPath = path.resolve(filePath);
        if (process.env.DEBUG)
            console.log(pc.gray(`+ ${path.relative(process.cwd(), fullPath)}`));
        pending.add(fullPath);
        deleted.delete(fullPath);
        scheduleFlush();
    })
        .on("change", (filePath) => {
        const fullPath = path.resolve(filePath);
        if (process.env.DEBUG)
            console.log(pc.gray(`~ ${path.relative(process.cwd(), fullPath)}`));
        pending.add(fullPath);
        scheduleFlush();
    })
        .on("unlink", (filePath) => {
        const fullPath = path.resolve(filePath);
        if (process.env.DEBUG)
            console.log(pc.gray(`- ${path.relative(process.cwd(), fullPath)}`));
        deleted.add(fullPath);
        pending.delete(fullPath);
        scheduleFlush();
    })
        .on("error", (error) => {
        console.error(pc.red("Watcher error:"), error);
    });
    // Graceful shutdown
    process.on("SIGINT", () => {
        console.log(pc.yellow("\n\n🛑 Stopping watcher..."));
        watcher.close().then(() => {
            console.log(pc.green("✅ Watch mode stopped"));
            process.exit(0);
        }).catch((err) => {
            console.error(pc.red("❌ Error stopping watcher:"), err);
            process.exit(1);
        });
    });
    // Keep alive
    console.log(pc.green("\n✅ Watch mode active"));
    console.log(pc.gray("Press Ctrl+C to stop\n"));
    // Keep process alive
    await new Promise(() => { });
}
// Run with better error handling
main().catch((error) => {
    console.error(pc.red("Fatal error in watch mode:"), error);
    process.exit(1);
});
