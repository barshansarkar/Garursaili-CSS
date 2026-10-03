/* Auto-generated types for garur_core native module */

export interface ParsedToken {
  raw: string;
  key: string;
  value: string;
  negative: boolean;
  important: boolean;
}

export interface ScanResult {
  path: string;
  classes: string[];
}

export function initConfig(configJson: string): void;
export function initHandler(paletteJson: string): void;

export function parse(token: string): ParsedToken;
export function parseBatch(tokens: string[]): (ParsedToken | null)[];
export function lex(classString: string): string[];
export function clearParseCache(): void;

export function build(cls: string, inline?: boolean): string | null;
export function buildBatch(classes: string[]): (string | null)[];
export function clearCache(): void;

export function extractClasses(content: string): string[];
export function extractFromFile(path: string): string[] | null;
export function scanFiles(files: string[]): ScanResult[];
export function findFiles(cwd: string, include: string[], ignore: string[]): string[];

export function runSsc(files: string[], configJson: string): string;

export function minifyCss(css: string): string;

export function hashString(s: string): string;
export function hashFile(path: string): string;

export function cacheLoad(path: string): string;
export function cacheSave(path: string, json: string): void;

export function version(): string;