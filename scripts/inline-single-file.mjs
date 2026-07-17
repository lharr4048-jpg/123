// Inlines the production build (dist/) into one self-contained HTML file that
// runs by double-clicking in a browser (file://) — no server, no external
// assets. The 3D mesh is already bundled into the JS (raw-imported), so the
// only things left to inline are the JS module, the CSS, and the favicon.
import fs from 'node:fs';
import path from 'node:path';

const dist = path.resolve('dist');
const outFile = path.resolve('ir-vascular-anatomy.html');

let html = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');

// Inline the module script: <script ... src="./assets/index-xxx.js"></script>
html = html.replace(
  /<script\b[^>]*\bsrc="([^"]+)"[^>]*><\/script>/g,
  (_m, src) => {
    const file = path.join(dist, src.replace(/^\.?\//, ''));
    const code = fs.readFileSync(file, 'utf8');
    return `<script type="module">\n${code}\n</script>`;
  },
);

// Inline the stylesheet: <link rel="stylesheet" href="./assets/index-xxx.css">
html = html.replace(
  /<link\b[^>]*\brel="stylesheet"[^>]*\bhref="([^"]+)"[^>]*>/g,
  (_m, href) => {
    const file = path.join(dist, href.replace(/^\.?\//, ''));
    const css = fs.readFileSync(file, 'utf8');
    return `<style>\n${css}\n</style>`;
  },
);

// Inline the favicon as a data URI (so the tab icon still works from file://).
html = html.replace(
  /<link\b[^>]*\brel="icon"[^>]*\bhref="([^"]+)"[^>]*>/g,
  (_m, href) => {
    try {
      const file = path.join(dist, href.replace(/^\.?\//, ''));
      const svg = fs.readFileSync(file, 'utf8');
      const data = Buffer.from(svg, 'utf8').toString('base64');
      return `<link rel="icon" type="image/svg+xml" href="data:image/svg+xml;base64,${data}">`;
    } catch {
      return ''; // favicon missing — just drop it
    }
  },
);

fs.writeFileSync(outFile, html, 'utf8');
const sizeMB = (fs.statSync(outFile).size / 1024 / 1024).toFixed(1);

// Sanity checks: nothing should still reference an external asset file.
const leftover = [...html.matchAll(/(?:src|href)="\.?\/assets\/[^"]+"/g)].map((m) => m[0]);
if (leftover.length) {
  console.error('WARNING: un-inlined asset references remain:', leftover);
  process.exit(1);
}

console.log(`Wrote ${outFile} (${sizeMB} MB) — open it directly in Chrome.`);
