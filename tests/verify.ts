import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const root = join(__dirname, '..');

// Load native .node directly — bypasses src/index.ts entirely
const require = createRequire(import.meta.url);
const garur = require(join(root, 'garur_core.linux-x64-gnu.node'));
garur.initConfig('{}');
// const __dirname = dirname(fileURLToPath(import.meta.url));

console.log('═══════════════════════════════════════════');
console.log('🧪 Garur CSS — Post-Patch Verification');
console.log('═══════════════════════════════════════════\n');

// ── Test 1: Sample HTML
const html = readFileSync(join(__dirname, 'sample.html'), 'utf8');
const classes: string[] = garur.extractClasses(html);
console.log(`✅ Extracted ${classes.length} classes`);

const results = garur.buildBatch(classes);
let passed = 0, failed = 0;
const failures: string[] = [];
classes.forEach((cls, i) => {
  if (results[i]) passed++;
  else { failed++; failures.push(cls); }
});
console.log(`✅ Built: ${passed}/${classes.length}`);
if (failures.length > 0) {
  console.log(`❌ Failed (${failed}):`);
  failures.slice(0, 30).forEach((f) => console.log(`   - ${f}`));
}
console.log();

// ── Test 2: Critical utilities
const critical = [
  'p-13', 'm-99', 'w-123', 'gap-7', 'inset-3',
  'bg-clip-text', 'drop-shadow-lg',
  'caption-top', 'outline-hidden', 'transition-discrete',
  'bg-linear-to-r', 'bg-radial', 'bg-conic-180',
  'rotate-z-45', 'ring-offset-blue-500', 'text-shadow-lg',
  'list-image-none', 'content-none',
];

console.log('🔬 Critical utilities:');
let cPass = 0;
for (const c of critical) {
  const r = garur.build(c, false);
  if (r) { cPass++; console.log(`   ✅ ${c}`); }
  else    { console.log(`   ❌ ${c} → MISSING`); }
}
console.log(`   → ${cPass}/${critical.length}\n`);

// ── Test 3: Variants
const variantTests = [
  'hover:bg-red-500', 'md:flex', 'dark:text-white',
  'nth-3:text-bold', 'nth-last-2:opacity-50', 'nth-of-type-2:underline',
  'not-hover:underline',
  '*:p-2', '**:m-1',
  'inert:opacity-50', 'user-valid:border-green-500', 'user-invalid:border-red-500',
  '@sm/card:flex', '@lg/sidebar:grid', '@container/card:block',
  'group-hover:text-blue-500', 'group-has-[:checked]:bg-green-500',
  'peer-checked:opacity-100', 'peer-has-[:focus]:ring-2',
  'has-[:checked]:border-blue-500',
  'data-[state=open]:rotate-90', 'data-active:bg-blue-500',
  'aria-expanded:bg-blue-500',
  'supports-[display:grid]:grid',
  'min-[900px]:p-8', 'max-md:hidden',
  'starting:opacity-0', 'popover-open:opacity-100',
  'pointer-fine:cursor-pointer', 'pointer-coarse:p-6',
  'rtl:text-right', 'ltr:text-left',
  'motion-safe:animate-spin', 'motion-reduce:animate-none',
];

console.log('🎭 Variants:');
let vPass = 0;
for (const v of variantTests) {
  const r = garur.build(v, false);
  if (r) { vPass++; console.log(`   ✅ ${v}`); }
  else    { console.log(`   ❌ ${v} → FAILED`); }
}
console.log(`   → ${vPass}/${variantTests.length}\n`);

// ── Test 4: @apply with variants
console.log('📝 @apply test:');
try {
  const out = garur.processCssInput('.test { @apply bg-blue-500 hover:bg-red-500 p-4 md:flex; }');
  console.log(out);
} catch (e: any) {
  console.log(`❌ @apply failed: ${e.message}`);
}
console.log();

// ── Test 5: @theme
console.log('🎨 @theme test:');
const themeCss = `
@theme {
  --color-brand: #ff00aa;
  --spacing-18: 4.5rem;
  --radius-xxl: 2rem;
}
`;
const tokens = JSON.parse(garur.getThemeTokens(themeCss));
console.log(`   colors:  ${Object.keys(tokens.colors).join(', ')}`);
console.log(`   spacing: ${Object.keys(tokens.spacing).join(', ')}`);
console.log(`   radius:  ${Object.keys(tokens.radius).join(', ')}`);
console.log();

console.log('═══════════════════════════════════════════');
console.log(`📊 Summary: utilities ${cPass}/${critical.length} | variants ${vPass}/${variantTests.length}`);
console.log('═══════════════════════════════════════════');
