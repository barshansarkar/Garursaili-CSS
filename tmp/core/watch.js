// src/watch.ts
// watch stuff and rebuild when files change
// this is basically just chokidar with extra steps
import chokidar from 'chokidar';
import { runJITIncremental } from '../core/jit.js';
import pc from 'picocolors';
// i should probably use debounce library but... nah
export async function watchJIT(patterns = ["**/*.{html,ts,js,jsx,tsx}"]) {
    console.log(pc.cyan(`👁️  Watching: ${patterns.join(', ')}`));
    console.log(pc.gray('Press Ctrl+C to stop\n'));
    let debounceTimer;
    let isBuilding = false;
    let pendingChanges = new Set();
    let pendingDeletions = new Set();
    // chokidar config - ignore all the things that would make this explode
    const watcher = chokidar.watch(patterns, {
        ignored: [
            'node_modules/**',
            'dist/**',
            '.git/**',
            '**/*.map',
            '**/.DS_Store', // mac bullshit
            '**/Thumbs.db', // windows bullshit
            '**/desktop.ini' // more windows bullshit
        ],
        ignoreInitial: true,
        persistent: true
    });
    // the actual build function
    const build = async () => {
        if (isBuilding) {
            console.log(pc.yellow('⚠️  Already building, queuing...'));
            return;
        }
        isBuilding = true;
        const changes = Array.from(pendingChanges);
        const deletions = Array.from(pendingDeletions);
        // clear before building in case more changes come in
        pendingChanges.clear();
        pendingDeletions.clear();
        // double check we actually have stuff to do
        if (changes.length === 0 && deletions.length === 0) {
            console.log(pc.gray('?? nothing to build'));
            isBuilding = false;
            return;
        }
        console.log(pc.cyan(`📝 Processing ${changes.length} changes, ${deletions.length} deletions...`));
        try {
            const start = Date.now();
            const result = await runJITIncremental(changes, deletions);
            const time = Date.now() - start;
            console.log(pc.green(`⚡ Rebuilt in ${time}ms (${result.filesScanned} files)`));
        }
        catch (err) {
            console.error(pc.red('🔥 Build error:'), err instanceof Error ? err.message : String(err));
            console.log(pc.yellow('😴 Retrying in 2s...'));
            setTimeout(() => {
                // requeue failed changes
                changes.forEach(c => pendingChanges.add(c));
                deletions.forEach(d => pendingDeletions.add(d));
                isBuilding = false;
                setTimeout(build, 100);
            }, 2000);
            return;
        }
        isBuilding = false;
        // Process any changes that came in while we were building
        // this can happen with big files i think
        if (pendingChanges.size > 0 || pendingDeletions.size > 0) {
            console.log(pc.cyan('🔄 More changes came in, building again...'));
            setTimeout(build, 50);
        }
    };
    // event handlers
    watcher
        .on('add', path => {
        console.log(pc.gray(`➕ ${path}`));
        pendingChanges.add(path);
        pendingDeletions.delete(path); // just in case
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(build, 100);
    })
        .on('change', path => {
        console.log(pc.gray(`✏️  ${path}`));
        pendingChanges.add(path);
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(build, 100);
    })
        .on('unlink', path => {
        console.log(pc.gray(`🗑️  ${path}`));
        pendingDeletions.add(path);
        pendingChanges.delete(path);
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(build, 100);
    })
        .on('error', error => {
        console.error(pc.red('💥 Watcher error:'), error);
        // don't crash tho
    });
    // Initial build because we need something to start with
    console.log(pc.cyan('🚀 Running initial build...'));
    try {
        const { runJIT } = await import('./jit.js');
        const stats = await runJIT(patterns);
        console.log(pc.green(`✅ Initial build: ${stats.filesScanned} files, ${Math.round(stats.cssBytes / 1024)}KB CSS`));
        console.log(pc.gray(`   Took ${stats.buildTimeMs}ms, ${stats.uniqueClasses} classes`));
    }
    catch (err) {
        console.error(pc.red('🔥 Initial build failed:'), err instanceof Error ? err.message : String(err));
        console.log(pc.yellow('Continuing to watch anyway...'));
    }
    // Keep alive forever (or until Ctrl+C)
    // this feels weird but it works
    return new Promise(() => {
        console.log(pc.gray('👀 Watching for changes...'));
    });
}
// Export for CLI
export default { watchJIT }; // i guess??
