/**
 * ---------------------------------------------------------------------
 *  GARUR-CSS — Ultra-fast Atomic CSS Engine
 *  Author: Barshan Sarkar
 *  Version: 1.0.0
 *  License: MIT
 * ---------------------------------------------------------------------
 *
 *  This CLI powers the Garur-CSS ecosystem. It handles:
 *    • SSC ( SUPER SONIC CYCLONE ) compilation of utility classes
 *    • File scanning across HTML / JS / TS / JSX / TSX
 *    • Cache management and orphan-class detection
 *    • Config file creation (garur.config.js)
 *    • Plugin boilerplate generation
 *    • Watch mode for real-time builds ,, (coming soon)
 *
 *  Technologies:
 *    - TypeScript
 *    - Rollup bundling (CJS-compatible output)
 *    - Node.js (CLI execution via shebang)
 *
 *  Notes for contributors:
 *    • Keep the CLI ESM/CJS compatible.
 *    • Avoid dynamic require unless wrapped safely.
 *    • Keep output messages clean, fast, and developer-friendly.
 *
 *  Made in India.
 * ---------------------------------------------------------------------
 */

import fs from "fs"
import * as glob from "fast-glob"
import path from "path"
import crypto from "crypto"
import { mergeComponent } from "./marge"
import { build } from "./builder"
import { allComponents, enhancedAnimations } from "../components"
import {
  loadCache,
  saveCache,
  GarurCache,
  normalizePathForCache,
  pruneCache,
  removeFileFromCache,
} from "../utils/cache"
import configDefault from "../config/garur.config"

// types because ts makes me do this
export type JitStats = {
 filesScanned: number
 classOccurrences: number
 uniqueClasses: number
 uniqueUtilities: number
 cssBytes: number
 topClasses: Array<{ cls: string; count: number }>
 buildTimeMs: number
 memoryUsageMB: number
 cacheHits: number
 cacheMisses: number
 cacheSize: number
}

// constants - output stuff
const DIST = path.resolve(process.cwd(), "dist")
const OUT = path.join(DIST, "garur.css")
const OUT_MIN = path.join(DIST, "garur.min.css")

// small helper type. RuleParts... ugh
type RuleParts = { media: string | null; selector: string; decl: string }

// extractor caching. naive but works.
const extractorCache = new Map<string, string[]>()
const MAX_EXTRACTOR_CACHE_SIZE = 500

export function extractClassesFromContent(content: string): string[] {
  // quick bail out for tiny files
  if (!content || content.length < 10) return []

  // key for caching - md5 for huge content
  const cacheKey =
    content.length > 10000
      ? crypto.createHash("md5").update(content).digest("hex").slice(0, 12)
      : content

  const cached = extractorCache.get(cacheKey)
  if (cached) return cached

  const results = new Set<string>()

  // this regex tries to capture class, className, data-garur, and some template cases
  const classPattern =
    /(?:class|className|data-garur)\s*=\s*(?:"([^"]+)"|'([^']+)'|`([^`]+)`|\{["']([^"']+)["']\}|\{`([^`]+)`\})/g

  let match: RegExpExecArray | null
  while ((match = classPattern.exec(content)) !== null) {
    let classString = ""
    for (let i = 1; i <= 5; i++) {
      if (match[i]) {
        classString = match[i]
        break
      }
    }

    if (!classString) continue

    // manual split by whitespace to avoid weird template tokens
    let start = 0
    let inClass = false

    for (let i = 0; i <= classString.length; i++) {
      const char = classString[i]
      const isWhitespace =
        char === " " || char === "\t" || char === "\n" || i === classString.length

      if (isWhitespace && inClass) {
        const cls = classString.slice(start, i).trim()
        if (cls && cls.length > 0) {
          results.add(cls)
        }
        inClass = false
      } else if (!isWhitespace && !inClass) {
        start = i
        inClass = true
      }
    }
  }

  // handle template literal with ${} interpolation - remove interpolations then split
  const templatePattern = /(?:class|className)=\{`([^`]+)`\}/g
  while ((match = templatePattern.exec(content)) !== null) {
    const classString = match[1]
    const cleaned = classString.replace(/\$\{[^}]*\}/g, " ")
    if (cleaned.trim()) {
      const classes = cleaned.split(/\s+/).filter(Boolean)
      for (const cls of classes) {
        results.add(cls)
      }
    }
  }

  const result = Array.from(results)

  // simple LRU-ish eviction
  if (extractorCache.size >= MAX_EXTRACTOR_CACHE_SIZE) {
    const keys = Array.from(extractorCache.keys())
    const toRemove = Math.floor(MAX_EXTRACTOR_CACHE_SIZE * 0.3)
    for (let i = 0; i < toRemove && i < keys.length; i++) {
      extractorCache.delete(keys[i])
    }
  }

  extractorCache.set(cacheKey, result)
  return result
}


// rule parsing cache
const rulePartsCache = new Map<string, RuleParts>()
const MAX_RULE_CACHE_SIZE = 800

function extractRuleParts(rule: string): RuleParts {
  const cached = rulePartsCache.get(rule)
  if (cached) return cached

  const r = rule.trim()
  let media: string | null = null
  let inner = r

  if (r.startsWith("@media")) {
    const openBrace = r.indexOf("{")
    if (openBrace !== -1) {
      media = r.slice(6, openBrace).trim().replace(/^\(|\)$/g, "")
      inner = r.slice(openBrace + 1, -1).trim()
    }
  }

  // we need to find the selector (before first brace-level)
  let braceCount = 0
  let mainSelectorEnd = -1

  for (let i = 0; i < inner.length; i++) {
    const char = inner[i]
    if (char === "{") {
      braceCount++
      if (braceCount === 1 && mainSelectorEnd === -1) {
        mainSelectorEnd = i
      }
    } else if (char === "}") {
      braceCount--
    }
  }

  let selector = ""
  let decl = ""

  if (mainSelectorEnd !== -1) {
    selector = inner.slice(0, mainSelectorEnd).trim()

    let declStart = mainSelectorEnd + 1
    let declEnd = inner.length
    braceCount = 0

    for (let i = declStart; i < inner.length; i++) {
      const char = inner[i]
      if (char === "{") braceCount++
      else if (char === "}") {
        if (braceCount === 0) {
          declEnd = i
          break
        }
        braceCount--
      }
    }

    decl = inner.slice(declStart, declEnd).trim()
  }

  const result = { media, selector, decl }

  if (rulePartsCache.size >= MAX_RULE_CACHE_SIZE) {
    const firstKey = rulePartsCache.keys().next().value
    if (firstKey) rulePartsCache.delete(firstKey)
  }

  rulePartsCache.set(rule, result)
  return result
}

// breakpoints from config, may be empty
const breakpointConfig = configDefault.breakpoints || {}
const breakpointKeys = Object.keys(breakpointConfig)
const variantSet = new Set(["hover", "focus", "active", "disabled", "dark", "light"])

// variant parsing cache
type VariantParseResult = { breakpoints: string[]; variants: string[]; baseClass: string }
const variantParserCache = new Map<string, VariantParseResult>()
const MAX_VARIANT_CACHE_SIZE = 1500

function parseClassWithVariants(cls: string): VariantParseResult {
  const cached = variantParserCache.get(cls)
  if (cached) return cached

  const parts = cls.split(":")
  const baseClass = parts.pop() || ""
  const breakpoints: string[] = []
  const variants: string[] = []

  if (parts.length > 0) {
    for (const part of parts) {
      if (breakpointKeys.includes(part)) {
        breakpoints.push(part)
      } else if (variantSet.has(part)) {
        variants.push(part)
      } else {
        if (part.startsWith("sm-") && breakpointKeys.includes("sm")) {
          breakpoints.push("sm")
        } else if (part.startsWith("md-") && breakpointKeys.includes("md")) {
          breakpoints.push("md")
        } else if (part.startsWith("lg-") && breakpointKeys.includes("lg")) {
          breakpoints.push("lg")
        } else if (part.startsWith("xl-") && breakpointKeys.includes("xl")) {
          breakpoints.push("xl")
        } else {
          variants.push(part)
        }
      }
    }
  }

  const result = { breakpoints, variants, baseClass }

  if (variantParserCache.size >= MAX_VARIANT_CACHE_SIZE) {
    const firstKey = variantParserCache.keys().next().value
    if (firstKey) variantParserCache.delete(firstKey)
  }

  variantParserCache.set(cls, result)
  return result
}


// main build from cache + files
async function buildCssFromCacheAndFiles(
  files: string[],
  cache: GarurCache,
  stats?: { cacheHits: number; cacheMisses: number }
): Promise<string> {
  // referenced set
  const referencedClasses = new Set<string>()

  const BATCH_SIZE = 200
  const fileCount = files.length

  for (let batchStart = 0; batchStart < fileCount; batchStart += BATCH_SIZE) {
    const batchEnd = Math.min(batchStart + BATCH_SIZE, fileCount)
    const batchPromises: Promise<void>[] = []

    for (let i = batchStart; i < batchEnd; i++) {
      const file = files[i]
      batchPromises.push(
        Promise.resolve().then(() => {
          try {
            const content = fs.readFileSync(file, "utf-8")
            const classes = extractClassesFromContent(content)

            for (const cls of classes) {
              referencedClasses.add(cls)
            }
          } catch (error: unknown) {
            // ignore read errors, 3am fallback
          }
        })
      )
    }

    await Promise.all(batchPromises)
  }

  if (referencedClasses.size === 0) {
    return ""
  }

  // dedupe map key: media + decl OR just decl
  const dedupeMap = new Map<
    string,
    {
      selectors: string[]
      decl: string
      media: string | null
    }
  >()

  const order: string[] = []
  const componentClasses = Object.keys(allComponents)
  const isComponent = new Set(componentClasses)

  const referencedArray = Array.from(referencedClasses)
  const cacheClasses = cache.classes || {}

  const utilities: string[] = []
  const components: string[] = []

  for (const cls of referencedArray) {
    if (isComponent.has(cls)) {
      components.push(cls)
    } else {
      utilities.push(cls)
    }
  }

  // process utilities in chunks to avoid blocking event loop
  const UTILITY_CHUNK_SIZE = 500
  for (let i = 0; i < utilities.length; i += UTILITY_CHUNK_SIZE) {
    const chunk = utilities.slice(i, i + UTILITY_CHUNK_SIZE)
    const chunkPromises = chunk.map((cls) =>
      Promise.resolve().then(() => {
        let rule: string | null = null

        if (cacheClasses[cls]) {
          rule = cacheClasses[cls]
          if (stats) stats.cacheHits++
          return { cls, rule }
        } else {
          try {
            rule = build(cls)
            if (rule) {
              cacheClasses[cls] = rule
              if (stats) stats.cacheMisses++
            }
          } catch {
            rule = null
          }
          return { cls, rule }
        }
      })
    )

    const chunkResults = await Promise.all(chunkPromises)

    for (const { rule } of chunkResults) {
      if (!rule) continue

      const { media, selector, decl } = extractRuleParts(rule)
      if (!decl) continue

      const key = media ? `${media}::${decl}` : `::${decl}`
      let entry = dedupeMap.get(key)

      if (!entry) {
        entry = { selectors: [selector], decl, media }
        dedupeMap.set(key, entry)
        order.push(key)
      } else if (!entry.selectors.includes(selector)) {
        entry.selectors.push(selector)
      }
    }
  }

  // components: mergeComponent -> parse rules, same dedupe logic
  for (const cls of components) {
    try {
      const compCSS = mergeComponent([cls])
      if (!compCSS) continue

      const rules: string[] = []
      let currentRule = ""
      let braceCount = 0

      for (let i = 0; i < compCSS.length; i++) {
        const char = compCSS[i]
        currentRule += char

        if (char === "{") braceCount++
        else if (char === "}") {
          braceCount--
          if (braceCount === 0) {
            rules.push(currentRule.trim())
            currentRule = ""
          }
        }
      }

      for (const rule of rules) {
        if (!rule) continue

        const { media, selector, decl } = extractRuleParts(rule)
        if (!decl) continue

        const key = media ? `${media}::${decl}` : `::${decl}`
        let entry = dedupeMap.get(key)

        if (!entry) {
          entry = { selectors: [selector], decl, media }
          dedupeMap.set(key, entry)
          order.push(key)
        } else if (!entry.selectors.includes(selector)) {
          entry.selectors.push(selector)
        }
      }
    } catch {
      continue
    }
  }

  // update cache classes
  cache.classes = cacheClasses

  // now format blocks grouped by media and base
  const mediaBlocks = new Map<string, string[]>()
  const baseBlocks: string[] = []

  for (const key of order) {
    const entry = dedupeMap.get(key)
    if (!entry || entry.selectors.length === 0) continue

    const formattedDecl = entry.decl
      .split(";")
      .filter(Boolean)
      .map((line) => `  ${line.trim()};`)
      .join("\n")

    const block = `${entry.selectors.join(",\n")} {\n${formattedDecl}\n}`

    if (entry.media) {
      let blocks = mediaBlocks.get(entry.media)
      if (!blocks) {
        blocks = []
        mediaBlocks.set(entry.media, blocks)
      }
      blocks.push(block)
    } else {
      baseBlocks.push(block)
    }
  }

  // free memory-ish
  dedupeMap.clear()

  const cssParts: string[] = []

  if (baseBlocks.length > 0) {
    cssParts.push(baseBlocks.join("\n\n"))
  }

  for (const bp of breakpointKeys) {
    const blocks = mediaBlocks.get(bp)
    if (blocks && blocks.length > 0) {
      cssParts.push(`@media (min-width: ${breakpointConfig[bp]}) {`)
      cssParts.push(blocks.join("\n\n"))
      cssParts.push("}")
      mediaBlocks.delete(bp)
    }
  }

  for (const [media, blocks] of mediaBlocks.entries()) {
    if (blocks.length > 0) {
      cssParts.push(`@media (${media}) {`)
      cssParts.push(blocks.join("\n\n"))
      cssParts.push("}")
    }
  }

  return cssParts.join("\n\n")
}

// super naive minifier, but solid enough
function minifyCss(css: string): string {
  let result = ""
  let inComment = false
  let inSingleQuote = false
  let inDoubleQuote = false
  let lastChar = ""

  for (let i = 0; i < css.length; i++) {
    const char = css[i]
    const nextChar = i + 1 < css.length ? css[i + 1] : ""

    if (!inSingleQuote && !inDoubleQuote && char === "/" && nextChar === "*") {
      inComment = true
      i++
      continue
    }

    if (inComment && char === "*" && nextChar === "/") {
      inComment = false
      i++
      continue
    }

    if (inComment) continue

    if (char === "'" && !inDoubleQuote && lastChar !== "\\") {
      inSingleQuote = !inSingleQuote
    } else if (char === '"' && !inSingleQuote && lastChar !== "\\") {
      inDoubleQuote = !inDoubleQuote
    }

    if (!inSingleQuote && !inDoubleQuote) {
      if (char === " " || char === "\t" || char === "\n" || char === "\r") {
        if (
          lastChar &&
          lastChar !== " " &&
          lastChar !== "{" &&
          lastChar !== ";" &&
          lastChar !== ":"
        ) {
          if (nextChar && nextChar !== " " && nextChar !== "}" && nextChar !== ";" && nextChar !== ":") {
            result += " "
            lastChar = " "
          }
        }
        continue
      }

      if (char === ";" && (nextChar === "}" || nextChar === " ")) {
        result += ";"
        lastChar = ";"
        continue
      }
    }

    result += char
    lastChar = char
  }

  return result.trim()
}

let preflightCache: string | null = null
function loadPreflightFile(): string {
  if (preflightCache !== null) return preflightCache

  try {
    const PREFLIGHT_PATH = path.resolve(__dirname, "preflight.css")
    if (fs.existsSync(PREFLIGHT_PATH)) {
      preflightCache = fs.readFileSync(PREFLIGHT_PATH, "utf-8").trim() + "\n\n"
    } else {
      preflightCache = ""
    }
  } catch {
    preflightCache = ""
  }
  return preflightCache
}

export async function runJIT(globPattern: string[] = ["**/*.{html,ts,js,jsx,tsx}"]): Promise<JitStats> {
  const startTime = performance.now()
  const startMemory = process.memoryUsage().heapUsed

  const stats = {
    cacheHits: 0,
    cacheMisses: 0,
  }

  const cache: GarurCache = loadCache()
  const pruned = pruneCache(cache)
  if (pruned > 0) {
    console.log(`Pruned ${pruned} stale cache entries`)
  }

  cleanupMemoryCaches()

  const filesRelative = await glob.default(globPattern, {
    ignore: [
      "node_modules/**",
      "dist/**",
      ".git/**",
      "**/.next/**",
      "**/.nuxt/**",
      "**/build/**",
      "**/out/**",
      "**/.output/**",
      "**/*.test.*",
      "**/*.spec.*",
      "**/__tests__/**",
      "**/__mocks__/**",
      "**/*.test",
      "**/*.spec",
      "**/*.snap",
      "**/coverage/**",
      "**/*.map",
      "**/*.d.ts",
      "**/*.min.*",
      "**/*.bundle.*",
      "**/docs/**",
      "**/*.md",
      "**/*.mdx",
      "**/config/**",
      "**/*.config.*",
      "**/*.conf",
      "**/*.log",
      "**/.tmp/**",
      "**/tmp/**",
      "**/.cache/**",
      "**/.vercel/**",
      "**/.netlify/**",
      "**/.github/**",
      "**/.vscode/**",
      "**/.idea/**",
      "**/public/**/*.{jpg,jpeg,png,gif,svg,ico,webp,mp4,webm,mp3,wav}",
      "**/static/**/*.{jpg,jpeg,png,gif,svg,ico,webp,mp4,webm,mp3,wav}",
      "**/assets/**/*.{jpg,jpeg,png,gif,svg,ico,webp,mp4,webm,mp3,wav}",
      "**/package-lock.json",
      "**/yarn.lock",
      "**/pnpm-lock.yaml",
      ...(configDefault.jit?.ignore || []),
    ],
    caseSensitiveMatch: false,
    followSymbolicLinks: false,
    onlyFiles: true,
    deep: 5,
    absolute: false,
  })

  console.log(`Found ${filesRelative.length} files`)

  let files = filesRelative.map((f) => path.resolve(process.cwd(), f))
  if (files.length > 1500) {
    console.log("Applying size filtering...")
    const filteredFiles: string[] = []
    for (const file of files) {
      try {
        const stats = fs.statSync(file)
        if (stats.size < 300 * 1024) {
          filteredFiles.push(file)
        }
      } catch {
        // ignore
      }
    }
    files = filteredFiles
    console.log(`Filtered to ${files.length} files`)
  }

  const counts = new Map<string, number>()
  const allCurrentClasses = new Set<string>()
  const componentKeys = Object.keys(allComponents)

  const BATCH_SIZE = Math.min(200, files.length)
  let processedFiles = 0

  for (let i = 0; i < files.length; i += BATCH_SIZE) {
    const batch = files.slice(i, i + BATCH_SIZE)
    const batchPromises = batch.map((file) =>
      Promise.resolve().then(() => {
        try {
          if (!fs.existsSync(file)) {
            removeFileFromCache(cache, file)
            return
          }

          const content = fs.readFileSync(file, "utf-8")
          const classes = extractClassesFromContent(content)

          for (const cls of classes) {
            allCurrentClasses.add(cls)
            counts.set(cls, (counts.get(cls) || 0) + 1)
          }

          const norm = normalizePathForCache(file)
          cache.files = cache.files || {}
          cache.files[norm] = {
            hash: crypto.createHash("md5").update(content).digest("hex"),
            classes: Array.from(new Set(classes)),
            timestamp: Date.now(),
          }

          processedFiles++
        } catch {
          // whatever
        }
      })
    )

    await Promise.all(batchPromises)

    if (processedFiles % 1000 === 0) {
      cleanupMemoryCaches()
    }
  }

  if (cache.classes) {
    const cacheClassKeys = Object.keys(cache.classes)
    let removedCount = 0

    for (const cls of cacheClassKeys) {
      if (!allCurrentClasses.has(cls) && !componentKeys.includes(cls)) {
        delete cache.classes[cls]
        removedCount++
      }
    }

    if (removedCount > 0) {
      console.log(`Removed ${removedCount} orphaned classes`)
    }
  }

  let css = await buildCssFromCacheAndFiles(files, cache, stats)

  if (enhancedAnimations && typeof enhancedAnimations === "string") {
    const animTrimmed = enhancedAnimations.trim()
    if (animTrimmed) {
      css = `${css}\n\n${animTrimmed}`
    }
  }

  const preflightFile = loadPreflightFile()
  if (preflightFile) {
    css = `${preflightFile}${css}`
  }

  const finalMin = minifyCss(css)

  if (!fs.existsSync(DIST)) {
    fs.mkdirSync(DIST, { recursive: true })
  }

  try {
    await Promise.all([fs.promises.writeFile(OUT, css, "utf-8"), fs.promises.writeFile(OUT_MIN, finalMin, "utf-8")])
  } catch (error: unknown) {
    console.error("Failed to write CSS files:", error)
    throw error
  }

  saveCache(cache)

  cleanupMemory()

  const endTime = performance.now()
  const endMemory = process.memoryUsage().heapUsed

  const uniqueClasses = counts.size
  const uniqueUtilities = Array.from(counts.keys()).filter((c) => !componentKeys.includes(c)).length
  const classOccurrences = Array.from(counts.values()).reduce((a, b) => a + b, 0)
  const cssBytes = Buffer.byteLength(css, "utf-8")

  const top = Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([cls, count]) => ({ cls, count }))

  const memoryDelta = (endMemory - startMemory) / 1024 / 1024
  const resultStats: JitStats = {
    filesScanned: files.length,
    classOccurrences,
    uniqueClasses,
    uniqueUtilities,
    cssBytes,
    topClasses: top,
    buildTimeMs: Math.round(endTime - startTime),
    memoryUsageMB: Math.round(memoryDelta * 100) / 100,
    cacheHits: stats.cacheHits,
    cacheMisses: stats.cacheMisses,
    cacheSize: Object.keys(cache.classes || {}).length,
  }

  console.log(`\nBuild completed in ${resultStats.buildTimeMs}ms`)
  console.log(`${files.length} files, ${uniqueClasses} classes, ${(cssBytes / 1024).toFixed(1)}KB CSS`)
  console.log(`Memory: ${resultStats.memoryUsageMB}MB`)
  console.log(`Cache: ${stats.cacheHits} hits, ${stats.cacheMisses} misses`)

  return resultStats
}

export async function runJITIncremental(
  changedFiles: string[],
  deletedFiles: string[] = []
): Promise<{ filesScanned: number; buildTimeMs: number }> {
  const startTime = performance.now()

  const cache = loadCache()

  for (const file of changedFiles) {
    try {
      if (!fs.existsSync(file)) {
        removeFileFromCache(cache, file)
        continue
      }

      const content = fs.readFileSync(file, "utf-8")
      const classes = extractClassesFromContent(content)
      const norm = normalizePathForCache(file)

      cache.files = cache.files || {}
      cache.files[norm] = {
        hash: crypto.createHash("md5").update(content).digest("hex"),
        classes: Array.from(new Set(classes)),
        timestamp: Date.now(),
      }
    } catch {
      // ignore
    }
  }

  for (const file of deletedFiles) {
    removeFileFromCache(cache, file)
  }

  const allFiles: string[] = []
  const cacheFiles = cache.files || {}

  for (const [relativePath] of Object.entries(cacheFiles)) {
    try {
      const fullPath = path.resolve(process.cwd(), relativePath)
      if (fs.existsSync(fullPath)) {
        allFiles.push(fullPath)
      } else {
        removeFileFromCache(cache, relativePath)
      }
    } catch {
      // ignore
    }
  }

  const css = await buildCssFromCacheAndFiles(allFiles, cache)

  const finalMin = minifyCss(css)

  if (!fs.existsSync(DIST)) {
    fs.mkdirSync(DIST, { recursive: true })
  }

  await Promise.all([fs.promises.writeFile(OUT, css, "utf-8"), fs.promises.writeFile(OUT_MIN, finalMin, "utf-8")])

  saveCache(cache)

  const buildTime = Math.round(performance.now() - startTime)
  console.log(`Incremental build in ${buildTime}ms`)

  return { filesScanned: allFiles.length, buildTimeMs: buildTime }
}

export function cleanupMemoryCaches(): void {
  if (extractorCache.size > MAX_EXTRACTOR_CACHE_SIZE * 0.5) {
    const keys = Array.from(extractorCache.keys())
    const toRemove = Math.floor(keys.length * 0.3)
    for (let i = 0; i < toRemove && i < keys.length; i++) {
      extractorCache.delete(keys[i])
    }
  }

  if (rulePartsCache.size > MAX_RULE_CACHE_SIZE * 0.5) {
    const firstKey = rulePartsCache.keys().next().value
    if (firstKey) rulePartsCache.delete(firstKey)
  }

  if (variantParserCache.size > MAX_VARIANT_CACHE_SIZE * 0.5) {
    const firstKey = variantParserCache.keys().next().value
    if (firstKey) variantParserCache.delete(firstKey)
  }
}

export function cleanupMemory(): void {
  extractorCache.clear()
  rulePartsCache.clear()
  variantParserCache.clear()
  preflightCache = null

  if ((global as any).gc) {
    ;(global as any).gc()
  }
}
