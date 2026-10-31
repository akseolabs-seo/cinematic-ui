#!/usr/bin/env node
// copy-check.mjs — continuity for words. When a client supplies the copy, every line of it belongs on the
// page: in the DOM, readable, and present before any script runs (so readers, crawlers and a failed script
// all still get it).
//
//   node copy-check.mjs <copy.md | copy.txt> <dir | file.html | url> [--min 6] [--no-nojs]
//
// Each paragraph, list item and table cell of the copy file is looked for in the page's text, ignoring
// punctuation, whitespace, case and Markdown marks. Lines that are only a label ("Hero:", "主標：") are
// reduced to what follows the colon. Reports what is missing with JavaScript on and with it off.
import fs from 'node:fs';
import path from 'node:path';
import { parseArgs, resolveTarget, loadPlaywright, launch } from './lib.mjs';

const args = parseArgs(process.argv.slice(2), { min: 6 });
if (args._.length < 2) { console.error('usage: node copy-check.mjs <copy.md> <dir|file|url> [--min 6] [--no-nojs]'); process.exit(1); }

const norm = (s) => s.normalize('NFKC').toLowerCase().replace(/[\s\p{P}\p{S}]+/gu, '');
const strip = (s) => s.replace(/!\[[^\]]*\]\([^)]*\)/g, '').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/[*_`~]+/g, '').replace(/^\s*(?:[-*+]|\d+[.)、])\s+/, '').replace(/^#+\s*/, '').trim();

const pieces = [];
for (const raw of fs.readFileSync(path.resolve(args._[0]), 'utf8').split(/\r?\n/)) {
  if (!raw.trim() || /^\s*>/.test(raw) || /^\s*[-|: ]+$/.test(raw) || /^\s*[（(].*[)）]\s*$/.test(raw)) continue; // blank, client notes, table rules, bracketed instructions
  const isHeading = /^#+\s/.test(raw);
  for (let cell of raw.split(/\s*[|｜]\s*|　+/)) {                    // table cells and wide-space separated fields are separate pieces
    cell = strip(cell).replace(/^[^：:]{1,8}[：:]\s*/, '');               // "主標：…" → "…"
    const n = norm(cell);
    if (n.length >= Number(args.min)) pieces.push({ text: cell, n, heading: isHeading });
  }
}

const target = await resolveTarget(args._[1]);
const pw = await loadPlaywright();
const browser = await launch(pw);
const read = async (javaScriptEnabled) => {
  const ctx = await browser.newContext({ javaScriptEnabled, viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(target.url, { waitUntil: 'load', timeout: 60000 });
  if (javaScriptEnabled) await page.waitForTimeout(1500);
  const text = await page.evaluate(() => {
    const body = document.body.cloneNode(true);                   // decorative copies (marquee repeats, odometer digit strips) are aria-hidden: read what a reader reads
    body.querySelectorAll('[aria-hidden="true"], script, style, template').forEach((n) => n.remove());
    const parts = [body.textContent];
    for (const el of document.querySelectorAll('input, textarea, [aria-label], img[alt], [placeholder]')) parts.push(el.value || '', el.getAttribute('aria-label') || '', el.getAttribute('alt') || '', el.getAttribute('placeholder') || '');
    return parts.join(' ');
  });
  await ctx.close();
  return norm(text);
};

let failed = false;
try {
  for (const [label, js] of [['JavaScript on', true], ...(args['no-nojs'] ? [] : [['JavaScript off', false]])]) {
    const hay = await read(js);
    const missing = pieces.filter((p) => !hay.includes(p.n));
    console.log(`\n[${label}] ${pieces.length - missing.length} of ${pieces.length} pieces of copy found`);
    for (const m of missing) console.log(`  ✗ ${m.heading ? '(heading) ' : ''}${m.text.slice(0, 70)}${m.text.length > 70 ? '…' : ''}`);
    if (missing.some((m) => !m.heading)) failed = true;
  }
  console.log(failed ? '\nSome copy is not on the page (headings alone are not counted as failures: section labels are often rewritten).' : '\nEvery piece of copy is on the page.');
} finally { await browser.close(); target.close(); }
process.exit(failed ? 2 : 0);
