// new-prospect.mjs — scaffold a prospect build from the tokenized templates.
//
// Usage:
//   node new-prospect.mjs prospects/<name>.json
//
// Reads a small config file, fills the {{TOKENS}} in templates/*.html, writes the
// result to examples/<slug>/, and renders the PDFs. The three things you normally
// change — company, market, property focus — plus their short/derived forms.
//
// After it runs, edit the SAMPLE signal rows and the featured brief in the new
// Signal Report with real intel for that market (those are marked in the HTML).

import { readFileSync, writeFileSync, mkdirSync, readdirSync, existsSync } from 'node:fs';
import { resolve, join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const ROOT = dirname(fileURLToPath(import.meta.url));

const cfgArg = process.argv[2];
if (!cfgArg) { console.error('Usage: node new-prospect.mjs prospects/<name>.json'); process.exit(1); }
const cfgPath = resolve(cfgArg);
if (!existsSync(cfgPath)) { console.error(`Config not found: ${cfgArg}`); process.exit(1); }
const cfg = JSON.parse(readFileSync(cfgPath, 'utf8'));

const required = ['slug', 'company', 'companyShort', 'market', 'marketShort', 'focus', 'footprint'];
const missing = required.filter((k) => !cfg[k] || !String(cfg[k]).trim());
if (missing.length) { console.error('Missing required config field(s): ' + missing.join(', ')); process.exit(1); }

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const tokens = {
  COMPANY: cfg.company,               // "Capital Asset Management"
  COMPANY_SHORT: cfg.companyShort,    // "CAM"
  MARKET: cfg.market,                 // "Phoenix Metro"
  MARKET_SHORT: cfg.marketShort,      // "Phoenix"
  MARKET_UPPER: cfg.marketShort.toUpperCase(),   // "PHOENIX"  (derived)
  FOCUS: cfg.focus,                   // "industrial"
  FOCUS_TITLE: cap(cfg.focus),        // "Industrial" (derived)
  FOCUS_UPPER: cfg.focus.toUpperCase(),          // "INDUSTRIAL" (derived)
  FOOTPRINT: cfg.footprint,           // "five-state footprint"
};

const outDir = join(ROOT, 'examples', cfg.slug);
mkdirSync(outDir, { recursive: true });

const tplDir = join(ROOT, 'templates');
for (const f of readdirSync(tplDir).filter((f) => f.endsWith('.html'))) {
  let html = readFileSync(join(tplDir, f), 'utf8');
  html = html.replace(/\{\{([A-Z_]+)\}\}/g, (m, key) => {
    if (!(key in tokens)) { console.error(`Unknown token ${m} in templates/${f}`); process.exit(1); }
    return tokens[key];
  });
  const leftover = html.match(/\{\{[A-Z_]+\}\}/g);
  if (leftover) { console.error(`Unresolved tokens in ${f}: ${[...new Set(leftover)].join(', ')}`); process.exit(1); }
  writeFileSync(join(outDir, f), html);
  console.log(`✓ scaffolded examples/${cfg.slug}/${f}`);
}

console.log('\nrendering PDFs…');
const r = spawnSync('node', [join(ROOT, 'build.mjs'), outDir], { stdio: 'inherit' });

console.log('\nrendering previews…');
spawnSync('node', [join(ROOT, 'preview.mjs'), outDir], { stdio: 'inherit' });

console.log(`\nDone → examples/${cfg.slug}/  (HTML + PDFs + previews/)`);
console.log('Next: replace the SAMPLE signal rows and the featured brief in');
console.log(`      02-signal-report.html with real ${cfg.marketShort} ${cfg.focus} intel,`);
console.log('      then re-run:  node build.mjs examples/' + cfg.slug);
process.exit(r.status ?? 0);
