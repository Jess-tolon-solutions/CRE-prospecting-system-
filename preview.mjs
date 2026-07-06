// preview.mjs — render a PNG preview of every page of every *.html in a folder.
//
// Usage:
//   node preview.mjs                       # *.html in the current folder
//   node preview.mjs examples/capital-asset-management
//   node preview.mjs path/to/file.html
//
// Writes 2x PNGs into a `previews/` subfolder next to the HTML, one per page:
//   01-growth-system.html  -> previews/growth-system.png        (1 page)
//   02-signal-report.html  -> previews/signal-report-p1.png     (2 pages)
//                             previews/signal-report-p2.png
// Each image is clipped to the `.page` element, so it matches the printed sheet.
// Requires Google Chrome.

import { spawn } from 'node:child_process';
import { writeFileSync, mkdirSync, readdirSync, statSync, existsSync } from 'node:fs';
import { resolve, join, dirname, extname, basename } from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';

const CHROME = process.env.CHROME_BIN
  || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const PORT = 9334;

// ---- resolve html files from argv ----
const args = process.argv.slice(2);
if (args.length === 0) args.push('.');
let files = [];
for (const a of args) {
  const p = resolve(a);
  if (!existsSync(p)) { console.error(`skip (not found): ${a}`); continue; }
  if (statSync(p).isDirectory()) {
    for (const f of readdirSync(p)) if (extname(f) === '.html') files.push(join(p, f));
  } else if (extname(p) === '.html') files.push(p);
}
if (files.length === 0) { console.error('No .html files to preview.'); process.exit(1); }

const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu',
  `--remote-debugging-port=${PORT}`, '--no-first-run', '--hide-scrollbars',
  '--user-data-dir=/tmp/cre-preview-profile'], { stdio: 'ignore' });

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
// strip a leading order prefix like "01-" so the image name is clean
const cleanName = (file) => basename(file, '.html').replace(/^\d+[-_]/, '');

try {
  for (let i = 0; i < 60; i++) { try { const r = await fetch(`http://127.0.0.1:${PORT}/json/version`); if (r.ok) break; } catch {} await sleep(200); }
  for (const file of files) {
    const previewDir = join(dirname(file), 'previews');
    mkdirSync(previewDir, { recursive: true });

    const tab = await (await fetch(`http://127.0.0.1:${PORT}/json/new?about:blank`, { method: 'PUT' })).json();
    const ws = new WebSocket(tab.webSocketDebuggerUrl);
    await new Promise((r) => ws.addEventListener('open', r, { once: true }));
    await rpc(ws, 'Page.enable');
    // desktop-width viewport so the print (not mobile) layout renders
    await rpc(ws, 'Emulation.setDeviceMetricsOverride', { width: 1000, height: 1400, deviceScaleFactor: 1, mobile: false });
    const loaded = waitEvent(ws, 'Page.loadEventFired');
    await rpc(ws, 'Page.navigate', { url: `file://${file}` });
    await loaded;
    await rpc(ws, 'Runtime.evaluate', { expression: 'document.fonts && document.fonts.ready', awaitPromise: true }).catch(() => {});
    await sleep(600);

    // measure each .page box in document coordinates (no scroll)
    const boxes = (await rpc(ws, 'Runtime.evaluate', {
      expression: `JSON.stringify([...document.querySelectorAll('.page')].map(p=>{const r=p.getBoundingClientRect();return {x:r.left+scrollX,y:r.top+scrollY,w:r.width,h:r.height};}))`,
      returnByValue: true,
    })).result.value;
    const pages = JSON.parse(boxes);
    const name = cleanName(file);

    for (let p = 0; p < pages.length; p++) {
      const b = pages[p];
      const { data } = await rpc(ws, 'Page.captureScreenshot', {
        format: 'png', captureBeyondViewport: true,
        clip: { x: b.x, y: b.y, width: b.w, height: b.h, scale: 2 },
      });
      const out = join(previewDir, pages.length === 1 ? `${name}.png` : `${name}-p${p + 1}.png`);
      writeFileSync(out, Buffer.from(data, 'base64'));
      console.log(`✓ previews/${basename(out)}`);
    }
    ws.close();
  }
} finally { chrome.kill('SIGKILL'); }
