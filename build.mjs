// build.mjs — render every *.html in a folder to a print-ready, single-source PDF.
//
// Usage:
//   node build.mjs                       # renders *.html in the current folder
//   node build.mjs examples/capital-asset-management
//   node build.mjs path/to/file.html [more.html ...]
//
// Output: one <name>.pdf next to each <name>.html, US Letter, true zero margins
// (honors the CSS `@page { size: Letter; margin: 0 }` via preferCSSPageSize), so
// the full-bleed black bands print edge to edge. Requires Google Chrome.

import { spawn } from 'node:child_process';
import { writeFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { resolve, join, extname } from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';

const CHROME = process.env.CHROME_BIN
  || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PORT = 9333 + Math.floor((Date.now ? 0 : 0)); // fixed; single run at a time

// ---- resolve the list of html files from argv ----
const args = process.argv.slice(2);
let files = [];
if (args.length === 0) args.push('.');
for (const a of args) {
  const p = resolve(a);
  if (!existsSync(p)) { console.error(`skip (not found): ${a}`); continue; }
  if (statSync(p).isDirectory()) {
    for (const f of readdirSync(p)) if (extname(f) === '.html') files.push(join(p, f));
  } else if (extname(p) === '.html') {
    files.push(p);
  }
}
if (files.length === 0) { console.error('No .html files to render.'); process.exit(1); }

const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu',
  `--remote-debugging-port=${PORT}`, '--no-first-run',
  '--user-data-dir=/tmp/cre-build-profile'], { stdio: 'ignore' });

let id = 0;
const rpc = (ws, method, params = {}) => new Promise((res, rej) => {
  const mid = ++id;
  const on = (e) => { const m = JSON.parse(e.data); if (m.id === mid) { ws.removeEventListener('message', on); m.error ? rej(new Error(m.error.message)) : res(m.result); } };
  ws.addEventListener('message', on);
  ws.send(JSON.stringify({ id: mid, method, params }));
});
const waitEvent = (ws, method) => new Promise((r) => {
  const on = (e) => { const m = JSON.parse(e.data); if (m.method === method) { ws.removeEventListener('message', on); r(m.params); } };
  ws.addEventListener('message', on);
});

try {
  for (let i = 0; i < 60; i++) { try { const r = await fetch(`http://127.0.0.1:${PORT}/json/version`); if (r.ok) break; } catch {} await sleep(200); }
  for (const file of files) {
    const tab = await (await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, { method: 'PUT' })).json();
    const ws = new WebSocket(tab.webSocketDebuggerUrl);
    await new Promise((r) => ws.addEventListener('open', r, { once: true }));
    await rpc(ws, 'Page.enable');
    const loaded = waitEvent(ws, 'Page.loadEventFired');
    await rpc(ws, 'Page.navigate', { url: `file://${file}` });
    await loaded; await sleep(700); // let webfonts settle
    const { data } = await rpc(ws, 'Page.printToPDF', {
      printBackground: true, preferCSSPageSize: true,
      marginTop: 0, marginBottom: 0, marginLeft: 0, marginRight: 0,
      paperWidth: 8.5, paperHeight: 11,
    });
    const out = file.replace(/\.html$/, '.pdf');
    const buf = Buffer.from(data, 'base64');
    writeFileSync(out, buf);
    const pages = (buf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;
    console.log(`✓ ${out.split('/').pop()}  (${pages} page${pages === 1 ? '' : 's'})`);
    ws.close();
  }
} finally { chrome.kill('SIGKILL'); }
