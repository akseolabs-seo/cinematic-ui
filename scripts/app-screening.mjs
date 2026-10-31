#!/usr/bin/env node
// app-screening.mjs — dailies for an app. Shoots every route × state × viewport × theme, lays each route out as a
// contact sheet (states as rows, viewports and themes as columns) and runs mechanical checks on every shot.
//
//   node app-screening.mjs <dir | file.html | url> [--routes "#/,#/items,#/items/42"]
//                          [--states default,loading,empty,filtered,done,error,denied,huge]
//                          [--viewports 1440x900,390x844] [--theme light,dark] [--now 2026-10-22T13:12:00Z] [--seed 7]
//                          [--act file.mjs] [--tabs 40] [--out app-screening] [--headed]
//                          [--fold]   shoot the viewport only (1440x900 frames) instead of the full page
//
// Markup the checks read: data-region="name" on fixed regions (compared loading vs default: no move, no resize);
// add data-region-grow to a region whose length depends on the record (it may grow downward, not move or shrink);
// data-states="default,loading,error,denied,huge" on a view that only reaches some states (a record page has no
// "filtered" or "done"): state-ignored and blank-state skip the others.
//
// Each shot loads <route>?state=…&now=…&seed=…&still=1 and waits for window.__app.ready (pages built on kit/app.js
// publish it). A page without window.__app is shot as it is, after load + 600 ms, with no extra query and the
// default state only. Output: <out>/shots/<route>/<state>-<w>x<h>-<theme>.png, <out>/<route>.png (contact sheet),
// <out>/flags.json. Flags per shot: page-error, console-error, request-failed, h-overflow, clipped-text,
// ellipsis-no-title, proportional-digits, numbers-left, layout-shift (loading vs default), low-contrast, small-target,
// focus-hidden (--tabs), blank-state (empty / filtered / done / error / denied with no explaining text),
// state-ignored (a kit app rendered ?state=X exactly like default). Always exits 0: it reports, it does not judge.
//
//   --act file.mjs   export default async ({ page, shoot, go, viewport, theme }) => {}   interaction shots
//                    e.g. await go('#/items'); await page.keyboard.press('Control+k'); await shoot('palette');
//                    go(route, { state }) loads a route fresh; shoot(label) saves <out>/shots/_act/ and runs the checks.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseArgs, resolveTarget, loadPlaywright, launch, nextFrame } from './lib.mjs';

const ALL_STATES = 'default,loading,empty,filtered,done,error,denied,huge';
const args = parseArgs(process.argv.slice(2), { out: 'app-screening', routes: '#/', states: ALL_STATES, viewports: '1440x900,390x844', theme: 'light', now: '2026-10-22T13:12:00Z', seed: '7', tabs: 40 });
if (!args._[0]) { console.error('usage: node app-screening.mjs <dir|file|url> [--routes "#/,#/items"] [--states ' + ALL_STATES + '] [--viewports 1440x900,390x844] [--theme light,dark] [--act file.mjs] [--tabs 40] [--out app-screening]'); process.exit(1); }

const list = (v) => String(v).split(',').map((s) => s.trim()).filter(Boolean);
const slug = (s) => String(s).replace(/^#?\/?/, '').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '') || 'root';
const BLANK_STATES = new Set(['empty', 'filtered', 'done', 'error', 'denied']);

// In-page probes, installed on every navigation. Self-contained: Playwright serialises the function.
function appProbes() {
  const vis = (e) => (e.checkVisibility ? e.checkVisibility({ opacityProperty: true, visibilityProperty: true }) : true);
  const sel = (e) => {
    let s = e.tagName.toLowerCase();
    if (e.id) s += '#' + e.id; else if (e.classList.length) s += '.' + [...e.classList].slice(0, 2).join('.');
    const r = e.closest('[data-region]'); return r && r !== e ? `${s} in [${r.dataset.region}]` : s;
  };
  const own = (e) => [...e.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent).join('').trim();
  const tiny = (r) => r.width <= 2 || r.height <= 2;
  const skip = (e) => !!e.closest('[inert], [hidden]') || !vis(e);

  // colour: parse anything the browser understands through a canvas
  const cv = document.createElement('canvas'); cv.width = cv.height = 1;
  const cx = cv.getContext('2d', { willReadFrequently: true }), cc = new Map();
  const rgba = (c) => {
    if (cc.has(c)) return cc.get(c);
    cx.clearRect(0, 0, 1, 1); cx.fillStyle = '#000'; cx.fillStyle = c; cx.fillRect(0, 0, 1, 1);
    const d = cx.getImageData(0, 0, 1, 1).data, a = d[3] / 255;
    const v = a ? [d[0] / a, d[1] / a, d[2] / a, a] : [0, 0, 0, 0]; cc.set(c, v); return v;
  };
  const over = (f, b) => [0, 1, 2].map((i) => f[i] * f[3] + b[i] * (1 - f[3]));
  const lum = (c) => { const l = c.map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * l[0] + 0.7152 * l[1] + 0.0722 * l[2]; };
  const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };
  function backdrop(e) {                                                        // composited background behind e, or null when an image/gradient is in the way
    const layers = [];
    for (let a = e; a && a.nodeType === 1; a = a.parentElement) {
      const cs = getComputedStyle(a);
      if (cs.backgroundImage !== 'none') return null;
      const c = rgba(cs.backgroundColor);
      if (c[3] > 0) layers.push(c);
      if (c[3] >= 0.99) break;
    }
    const dark = matchMedia('(prefers-color-scheme: dark)').matches && /dark/.test(getComputedStyle(document.documentElement).colorScheme);
    let b = layers.length && layers[layers.length - 1][3] >= 0.99 ? layers.pop().slice(0, 3) : dark ? [18, 18, 18] : [255, 255, 255];
    while (layers.length) b = over(layers.pop(), b.concat(1));
    return b;
  }
  const opacity = (e) => { let o = 1; for (let a = e; a && a.nodeType === 1; a = a.parentElement) o *= +getComputedStyle(a).opacity; return o; };

  const NUM = /^[-−+(]?\d[\d.,   ]*[kKMBT]?%?\)?$/, CLOCK = /^\d{1,2}:\d{2}(:\d{2})?$/, DUR = /^(\d+(\.\d+)?\s?(ms|s|sec|m|min|h|hr|d|w)\b\s*)+$/;
  const isNum = (t) => { t = t.replace(/^[-−+]?\s*(?:[A-Z]{3}(?=[\s\d])|[$€£¥₩₹])\s*/, (m) => (/^[-−+]/.test(m) ? m[0] : '')).replace(/\s*[A-Z]{3}$/, ''); return NUM.test(t) || CLOCK.test(t) || DUR.test(t); };
  const mono = (ff) => /monospace|\b(mono|consolas|courier|menlo|monaco)\b/i.test(ff);
  let fid = 1; const fids = new WeakMap();

  window.__appscreen = {
    overflow: () => document.documentElement.scrollWidth - innerWidth,
    height: () => document.documentElement.scrollHeight,
    text: () => ((document.querySelector('main, [role=main]') || document.body).innerText || '').replace(/\s+/g, ' ').trim(),
    states: () => { const e = document.querySelector('[data-states]'); return e ? e.dataset.states.split(/[\s,]+/).filter(Boolean) : null; },
    regions() {
      const seen = {};
      return [...document.querySelectorAll('[data-region]')].map((e) => {
        const n = e.dataset.region, i = (seen[n] = (seen[n] || 0) + 1), r = e.getBoundingClientRect();
        return { name: i > 1 ? `${n}#${i}` : n, top: Math.round((r.top + scrollY) * 10) / 10, height: Math.round(r.height * 10) / 10, shown: r.height > 0, grow: e.hasAttribute('data-region-grow') };
      });
    },
    // text cut off by overflow:hidden, and ellipsised text with no way to read the rest
    clipped() {
      const clip = [], noTitle = [];
      for (const e of document.body.querySelectorAll('*')) {
        const cs = getComputedStyle(e);
        if (!/^(hidden|clip)$/.test(cs.overflowX) && !/^(hidden|clip)$/.test(cs.overflowY)) continue;
        if (!e.textContent.trim() || skip(e)) continue;
        const r = e.getBoundingClientRect(); if (tiny(r)) continue;
        const cutX = /^(hidden|clip)$/.test(cs.overflowX) && e.scrollWidth > e.clientWidth + 1, cutY = /^(hidden|clip)$/.test(cs.overflowY) && e.scrollHeight > e.clientHeight + 1;
        if (!cutX && !cutY) continue;
        const ell = (cs.textOverflow === 'ellipsis' && cutX) || (cs.webkitLineClamp && cs.webkitLineClamp !== 'none' && cutY);
        if (!ell) { clip.push(`${sel(e)} "${e.textContent.trim().slice(0, 28)}" hides ${Math.max(e.scrollWidth - e.clientWidth, e.scrollHeight - e.clientHeight)}px`); continue; }
        const full = e.closest('[title]')?.title || e.closest('[aria-label]') || e.querySelector('[title], [aria-label]');
        if (!full) noTitle.push(`${sel(e)} "${e.textContent.trim().slice(0, 28)}"`);
      }
      return { clip, noTitle };
    },
    // numeric cells: tabular figures, and right-aligned columns
    numbers() {
      const prop = [], left = [], cols = new Map();
      for (const c of document.querySelectorAll('td, [role=cell], [role=gridcell]')) {
        if (skip(c)) continue;
        const t = c.textContent.trim(); if (!t || t === '—') continue;
        const tb = c.closest('table, [role=table], [role=grid], [role=treegrid]'), row = c.parentElement, idx = [...row.children].indexOf(c);
        const key = tb ? tb : document.body;
        const m = cols.get(key) || cols.set(key, new Map()).get(key);
        const col = m.get(idx) || m.set(idx, { num: [], all: 0 }).get(idx);
        col.all++;
        if (isNum(t)) col.num.push(c);
      }
      for (const m of cols.values()) for (const col of m.values()) {
        if (col.num.length < 2 || col.num.length < 0.6 * col.all) continue;
        let l = 0;
        for (const c of col.num) {
          const cs = getComputedStyle(c), tn = document.createRange(); tn.selectNodeContents(c);
          const rr = tn.getBoundingClientRect(), cr = c.getBoundingClientRect();
          const tab = /tabular-nums/.test(cs.fontVariantNumeric) || /tnum/.test(cs.fontFeatureSettings);
          const inner = c.querySelector('*'); const fv = inner ? getComputedStyle(inner) : cs;
          if (!(tab || /tabular-nums|tnum/.test(fv.fontVariantNumeric + fv.fontFeatureSettings)) && !mono(cs.fontFamily)) prop.push(`${sel(c)} "${c.textContent.trim().slice(0, 14)}"`);
          const gapL = rr.left - cr.left - (parseFloat(cs.paddingLeft) || 0), gapR = cr.right - rr.right - (parseFloat(cs.paddingRight) || 0);
          if (gapR > gapL + 6) l++;                                                // clearly nearer the left edge
        }
        if (l > col.num.length / 2) left.push(`${sel(col.num[0])} column (${l}/${col.num.length} cells left-aligned, e.g. "${col.num[0].textContent.trim().slice(0, 14)}")`);
      }
      return { prop: [...new Set(prop)], left };
    },
    // text under 4.5:1 (3:1 from 18px up)
    contrast() {
      const bad = new Map(); let n = 0;
      const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT), seen = new Map();
      for (let t; (t = w.nextNode());) {
        const e = t.parentElement;
        if (!e || !t.textContent.trim() || /^(SCRIPT|STYLE|NOSCRIPT|TEMPLATE|OPTION)$/.test(e.tagName) || skip(e)) continue;
        if (e.closest('[disabled], [aria-disabled="true"]')) continue;
        if (!seen.has(e)) {
          const r = e.getBoundingClientRect(); let res = null;
          if (!tiny(r)) {
            const cs = getComputedStyle(e), size = parseFloat(cs.fontSize), b = backdrop(e);
            if (b) {
              const fg = rgba(cs.color).slice(); fg[3] *= opacity(e);
              const f = over(fg, b.concat(1)), cr = ratio(f, b);
              res = { cr, min: size >= 18 ? 3 : 4.5, text: `${rgb(f)} on ${rgb(b)}` };
            }
          }
          seen.set(e, res);
        }
        const res = seen.get(e);
        if (res && res.cr < res.min) {
          n++;
          const k = res.text; if (!bad.has(k)) bad.set(k, { count: 0, sample: `${sel(t.parentElement)} "${t.textContent.trim().slice(0, 24)}" ${res.cr.toFixed(2)}:1 (${res.text})` });
          bad.get(k).count++;
        }
      }
      return { count: n, samples: [...bad.values()].sort((a, b) => b.count - a.count).slice(0, 3).map((x) => x.sample) };
    },
    targets() {
      const out = [];
      for (const e of document.querySelectorAll('a[href], button, [role=button], [role=link], input[type=checkbox], input[type=radio], select, summary')) {
        if (skip(e)) continue;
        let r = e.getBoundingClientRect();
        if (e.matches('input')) { const l = e.closest('label'); if (l) { const lr = l.getBoundingClientRect(); if (lr.width * lr.height > r.width * r.height) r = lr; } }
        if (tiny(r) || r.right <= 0 || r.bottom <= 0 || r.left >= innerWidth) continue;      // visually hidden, or parked off screen (skip links)
        if (e.matches('a') && getComputedStyle(e).display === 'inline' && [...e.parentElement.childNodes].some((n) => n !== e && n.nodeType === 3 && n.textContent.trim())) continue;   // a link inside a sentence
        if (r.width < 24 || r.height < 24) out.push(`${sel(e)} "${(e.getAttribute('aria-label') || e.textContent || '').trim().slice(0, 16)}" ${Math.round(r.width)}x${Math.round(r.height)}`);
      }
      return out;
    },
    // the focused element: does it look focused, is it on screen, is anything on top of it
    focusCheck() {
      const e = document.activeElement;
      if (!e || e === document.body || e === document.documentElement) return null;
      if (!fids.has(e)) fids.set(e, fid++);
      const label = (e.getAttribute('aria-label') || e.textContent || e.name || '').trim().replace(/\s+/g, ' ').slice(0, 24);
      const base = { id: fids.get(e), el: sel(e), label, why: null };
      const r = e.getBoundingClientRect();
      if (r.width < 2 && r.height < 2) return base;
      const sig = (n) => { const c = getComputedStyle(n); return [c.outlineStyle, c.outlineWidth, c.outlineColor, c.boxShadow, c.backgroundColor, c.borderTopColor, c.borderBottomColor, c.color, c.textDecorationLine].join('|'); };
      const chain = [e, e.parentElement, e.parentElement?.parentElement].filter(Boolean);
      const on = chain.map(sig); e.blur(); const off = chain.map(sig); e.focus({ preventScroll: true });
      if (on.every((s, i) => s === off[i])) return { ...base, why: 'no visible focus indicator (outline, box-shadow, colour all unchanged)' };
      if (r.bottom <= 0 || r.top >= innerHeight || r.right <= 0 || r.left >= innerWidth) return { ...base, why: 'focused off screen' };
      for (let a = e.parentElement; a && a !== document.documentElement; a = a.parentElement) {
        const cs = getComputedStyle(a); if (cs.overflowX === 'visible' && cs.overflowY === 'visible') continue;
        const ar = a.getBoundingClientRect();
        if (r.bottom <= ar.top + 1 || r.top >= ar.bottom - 1 || r.right <= ar.left + 1 || r.left >= ar.right - 1) return { ...base, why: `scrolled out of view inside ${sel(a)}` };
      }
      const x = Math.min(innerWidth - 1, Math.max(0, (Math.max(0, r.left) + Math.min(innerWidth, r.right)) / 2)), y = Math.min(innerHeight - 1, Math.max(0, (Math.max(0, r.top) + Math.min(innerHeight, r.bottom)) / 2));
      const hit = document.elementFromPoint(x, y);
      if (hit && !e.contains(hit) && !hit.contains(e)) return { ...base, why: `covered by ${sel(hit)}` };
      return base;
    },
  };
  function rgb(c) { return '#' + c.slice(0, 3).map((v) => Math.round(v).toString(16).padStart(2, '0')).join(''); }
}

// ---- run ---------------------------------------------------------------------------------------------------
const out = path.resolve(String(args.out));
fs.mkdirSync(out, { recursive: true });
const target = await resolveTarget(args._[0]);
const pw = await loadPlaywright();
const browser = await launch(pw, { headed: !!args.headed });
const routes = list(args.routes).map((r) => r.replace(/^[A-Za-z]:[\/].*?Git[\/]/, '#/')).map((r) => (r.startsWith('#')  // Git Bash turns a leading "#/" into a path
 ? r : '#' + (r.startsWith('/') ? r : '/' + r)));
const viewports = list(args.viewports).map((v) => { const m = /^(\d+)x(\d+)$/.exec(v); if (!m) { console.warn(`bad viewport "${v}" (want 1440x900)`); return null; } return { name: v, width: +m[1], height: +m[2] }; }).filter(Boolean);
const themes = list(args.theme);
let states = list(args.states);

const buildUrl = (route, extra) => {
  const [p, q = ''] = route.slice(1).split('?'), sp = new URLSearchParams(q);
  for (const [k, v] of Object.entries(extra || {})) if (v != null && v !== '') sp.set(k, v);
  const u = new URL(target.url); u.hash = '#' + (p || '/') + (sp.toString() ? '?' + sp : '');
  return u.href;
};

const shots = [], regionsBy = new Map(), mainText = new Map(), declared = new Map();
const summary = {};
let isKit = false;

try {
  // is this a kit app? decides whether the screening query goes on the URL at all
  {
    const ctx0 = await browser.newContext({ viewport: { width: 1280, height: 800 } });
    const p0 = await ctx0.newPage();
    await p0.goto(buildUrl(routes[0]), { waitUntil: 'load', timeout: 60000 });
    isKit = await p0.evaluate(() => !!window.__app);
    await ctx0.close();
    if (!isKit) {
      console.log('no window.__app: this is not a kit app. Shooting the default state only, without ?state / ?now / ?seed / ?still.');
      states = states.includes('default') ? ['default'] : states.slice(0, 1);
    }
  }
  const act = args.act ? (await import(pathToFileURL(path.resolve(String(args.act))).href)).default : null;

  for (const vp of viewports) {
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, deviceScaleFactor: 1, isMobile: vp.width < 700, hasTouch: vp.width < 700 });
    await context.addInitScript(appProbes);
    const page = await context.newPage();
    let issues = [];
    page.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) issues.push({ type: 'console-error', detail: m.text().slice(0, 240) }); });
    page.on('pageerror', (e) => issues.push({ type: 'page-error', detail: String(e.message).slice(0, 240) }));
    page.on('requestfailed', (r) => { if (!/ERR_ABORTED/.test(r.failure()?.errorText || '')) issues.push({ type: 'request-failed', detail: `${r.url().slice(0, 140)} ${r.failure()?.errorText}` }); });
    page.on('response', (r) => { if (r.status() >= 400 && !/favicon\.ico$/.test(r.url())) issues.push({ type: 'request-failed', detail: `${r.status()} ${r.url().slice(0, 140)}` }); });

    async function load(route, state, theme) {
      await page.emulateMedia({ colorScheme: theme });
      await page.goto('about:blank');
      await page.goto(buildUrl(route, isKit ? { state, now: args.now, seed: args.seed, still: '1' } : {}), { waitUntil: 'load', timeout: 60000 });
      if (isKit) {
        await page.evaluate(() => Promise.race([window.__app?.whenIdle?.() ?? window.__app?.ready, new Promise((r) => setTimeout(r, 8000))]));
      } else await page.waitForTimeout(600);
      await page.evaluate(() => document.fonts?.ready);
      await nextFrame(page);
    }

    // run every probe on the loaded page; returns flags [{ type, detail }]
    async function probe(state, extra = {}) {
      const flags = issues.splice(0);
      const S = (fn) => page.evaluate(`window.__appscreen.${fn}`);
      const ov = await S('overflow()');
      if (ov > 1) flags.push({ type: 'h-overflow', detail: `page scrolls sideways by ${ov}px` });
      const c = await S('clipped()');
      c.clip.slice(0, 3).forEach((d) => flags.push({ type: 'clipped-text', detail: d }));
      if (c.clip.length > 3) flags.push({ type: 'clipped-text', detail: `…and ${c.clip.length - 3} more` });
      if (c.noTitle.length) flags.push({ type: 'ellipsis-no-title', detail: `${c.noTitle.length} truncated, e.g. ${c.noTitle[0]}` });
      const n = await S('numbers()');
      if (n.prop.length) flags.push({ type: 'proportional-digits', detail: `${n.prop.length} cells, e.g. ${n.prop[0]}` });
      n.left.forEach((d) => flags.push({ type: 'numbers-left', detail: d }));
      const k = await S('contrast()');
      if (k.count) flags.push({ type: 'low-contrast', detail: `${k.count} text runs; ${k.samples.join('; ')}` });
      const t = await S('targets()');
      if (t.length) flags.push({ type: 'small-target', detail: `${t.length}, e.g. ${t.slice(0, 2).join('; ')}` });
      const own = await S('states()');
      if (BLANK_STATES.has(state) && !(own && !own.includes(state))) {
        const text = await S('text()');
        if (text.length < 40) flags.push({ type: 'blank-state', detail: `${state}: only ${text.length} characters of text in the main area` });
      }
      return flags;
    }

    for (const theme of themes) {
      for (const route of routes) {
        const rs = slug(route), dir = path.join(out, 'shots', rs);
        fs.mkdirSync(dir, { recursive: true });
        const group = `${route}|${vp.name}|${theme}`, byState = {};
        for (const state of states) {
          await load(route, state, theme);
          const file = `${state}-${vp.name}-${theme}.png`;
          const h = await page.evaluate('window.__appscreen.height()');
          await page.screenshot(args.fold ? { path: path.join(dir, file) } : { path: path.join(dir, file), fullPage: true, clip: { x: 0, y: 0, width: vp.width, height: Math.min(Math.max(h, vp.height), 2400) } });
          const flags = await probe(state);
          const shot = { file: path.relative(out, path.join(dir, file)).replace(/\\/g, '/'), route, slug: rs, state, viewport: vp.name, theme, flags };
          byState[state] = shot;
          shots.push(shot);
          regionsBy.set(`${group}|${state}`, await page.evaluate('window.__appscreen.regions()'));
          mainText.set(`${group}|${state}`, await page.evaluate('window.__appscreen.text()'));
          if (state === 'default') declared.set(group, await page.evaluate('window.__appscreen.states()'));
        }
        // loading vs default: nothing may move when the data lands
        const L = regionsBy.get(`${group}|loading`), D = regionsBy.get(`${group}|default`);
        if (L && D && byState.default) {
          for (const d of D) {
            const l = L.find((x) => x.name === d.name);
            if (!l) byState.default.flags.push({ type: 'layout-shift', detail: `[${d.name}] exists in default but not in loading` });
            else if (Math.abs(l.top - d.top) > 8 || (d.grow ? l.height - d.height > 8 : Math.abs(l.height - d.height) > 8)) byState.default.flags.push({ type: 'layout-shift', detail: `[${d.name}] loading → default: top ${l.top} → ${d.top}, height ${l.height} → ${d.height}` });
          }
          for (const l of L) if (!D.find((x) => x.name === l.name)) byState.default.flags.push({ type: 'layout-shift', detail: `[${l.name}] exists in loading but not in default` });
        }
        if (isKit && byState.default) {
          const dt = mainText.get(`${group}|default`);
          const own = declared.get(group);
          for (const [st, sh] of Object.entries(byState)) if (st !== 'default' && !(own && !own.includes(st)) && mainText.get(`${group}|${st}`) === dt) sh.flags.push({ type: 'state-ignored', detail: `?state=${st} rendered the same text as default: this view does not handle it` });
        }
        // Tab through the default state (first theme only)
        if (Number(args.tabs) > 0 && byState.default && theme === themes[0]) {
          await load(route, 'default', theme);
          await page.evaluate(() => { document.activeElement?.blur?.(); scrollTo(0, 0); });
          const found = []; let first = null;
          for (let i = 0; i < Number(args.tabs); i++) {
            await page.keyboard.press('Tab');
            await nextFrame(page);
            const st = await page.evaluate('window.__appscreen.focusCheck()');
            if (!st) { if (i > 0) break; continue; }
            if (first === null) first = st.id; else if (st.id === first) break;
            if (st.why) { await page.waitForTimeout(150); const again = await page.evaluate('window.__appscreen.focusCheck()'); if (again?.why) found.push(`Tab ${i + 1}: ${again.el}${again.label ? ` "${again.label}"` : ''}: ${again.why}`); }
          }
          found.slice(0, 4).forEach((d) => byState.default.flags.push({ type: 'focus-hidden', detail: d }));
          if (found.length > 4) byState.default.flags.push({ type: 'focus-hidden', detail: `…and ${found.length - 4} more stops` });
          issues.splice(0);
        }
      }

      // the director's own shots
      if (act) {
        const dir = path.join(out, 'shots', '_act');
        fs.mkdirSync(dir, { recursive: true });
        let i = 0;
        const go = async (route, { state = 'default' } = {}) => { await load(route.startsWith('#') ? route : '#' + route, state, theme); };
        const shoot = async (label) => {
          await page.evaluate(() => document.fonts?.ready); await nextFrame(page);
          const file = `${vp.name}-${theme}-${String(++i).padStart(2, '0')}-${String(label).replace(/[^a-z0-9.-]+/gi, '_')}.png`;
          await page.screenshot({ path: path.join(dir, file) });
          const flags = await probe('act');
          shots.push({ file: `shots/_act/${file}`, route: '(act)', slug: '_act', state: String(label), viewport: vp.name, theme, flags });
        };
        issues.splice(0);
        await act({ page, shoot, go, viewport: vp.name, theme });
      }
    }
    await context.close();
  }
} finally {
  // contact sheets: states as rows, viewports × themes as columns
  const sheets = new Map();
  for (const s of shots) { if (!sheets.has(s.slug)) sheets.set(s.slug, []); sheets.get(s.slug).push(s); }
  const sheetPage = await browser.newPage();
  for (const [rs, list0] of sheets) {
    const cols = [...new Set(list0.map((s) => `${s.viewport} ${s.theme}`))], rows = [...new Set(list0.map((s) => s.state))], act = rs === '_act';
    const w = (c) => Math.max(200, Math.round((420 * parseInt(c)) / 1440));
    const cell = (s) => s ? `<figure><img src="${s.file}" loading="eager"><figcaption>${s.flags.length ? `<b>${s.flags.length} flag${s.flags.length > 1 ? 's' : ''}</b>: ${[...new Set(s.flags.map((f) => f.type))].join(', ')}` : 'clean'}</figcaption></figure>` : '';
    const html = `<!doctype html><meta charset="utf-8"><style>
      body{margin:0;padding:12px;background:#111;color:#ddd;font:11px/1.35 ui-monospace,Consolas,monospace}
      table{border-collapse:separate;border-spacing:12px}th{text-align:left;font-weight:400;color:#999;vertical-align:top}td{vertical-align:top}
      figure{margin:0}img{display:block;width:100%;height:auto;background:#000;outline:1px solid #333}figcaption{padding:4px 0 0}b{color:#e8c547}h1{font:600 13px ui-monospace,Consolas,monospace;margin:0 0 4px 12px}</style>
      <h1>${act ? 'act shots' : rs}</h1><table><tr><th></th>${cols.map((c) => `<th style="width:${w(c)}px">${c}</th>`).join('')}</tr>
      ${rows.map((r) => `<tr><th>${r}</th>${cols.map((c) => `<td style="width:${w(c)}px">${cell(list0.find((s) => s.state === r && `${s.viewport} ${s.theme}` === c))}</td>`).join('')}</tr>`).join('')}</table>`;
    const f = path.join(out, `_sheet-${rs}.html`);
    fs.writeFileSync(f, html);
    await sheetPage.setViewportSize({ width: 1600, height: 900 });
    await sheetPage.goto(pathToFileURL(f).href, { waitUntil: 'load' });
    await sheetPage.waitForFunction(() => [...document.images].every((i) => i.complete)).catch(() => {});
    await sheetPage.screenshot({ path: path.join(out, `${rs}.png`), fullPage: true });
    fs.unlinkSync(f);
  }
  await browser.close();
  target.close();
}

// ---- report ------------------------------------------------------------------------------------------------
const byType = {};
for (const s of shots) for (const f of s.flags) { byType[f.type] ||= { instances: 0, shots: new Set() }; byType[f.type].instances++; byType[f.type].shots.add(s.file); }
fs.writeFileSync(path.join(out, 'flags.json'), JSON.stringify({ target: String(args._[0]), at: new Date().toISOString(), kit: isKit, now: args.now, seed: args.seed, shots, summary: Object.fromEntries(Object.entries(byType).map(([k, v]) => [k, { instances: v.instances, shots: v.shots.size }])) }, null, 2));

// a flag repeated across viewports and themes prints once
const lines = new Map();
for (const s of shots) for (const f of s.flags) {
  const key = `${f.type}|${s.route}|${s.state}|${f.detail}`;
  if (!lines.has(key)) lines.set(key, { f, s, where: [] });
  lines.get(key).where.push(`${s.viewport} ${s.theme}`);
}
console.log('');
let n = 0;
for (const { f, s, where } of lines.values()) { if (n++ >= 60) break; console.log(`! ${f.type.padEnd(19)} ${s.route} [${s.state}] ${f.detail}  (${where.join(', ')})`); }
if (lines.size > 60) console.log(`…and ${lines.size - 60} more (flags.json)`);
console.log(`\n${'flag'.padEnd(22)}${'shots'.padStart(6)}${'instances'.padStart(11)}`);
for (const [k, v] of Object.entries(byType).sort((a, b) => b[1].shots.size - a[1].shots.size)) console.log(`${k.padEnd(22)}${String(v.shots.size).padStart(6)}${String(v.instances).padStart(11)}`);
if (!Object.keys(byType).length) console.log('no mechanical flags (this says nothing yet about whether it is good: look at the sheets)');
console.log(`\n${shots.length} shots, ${shots.filter((s) => s.flags.length).length} with flags → ${out}`);
console.log(`contact sheets: ${[...new Set(shots.map((s) => s.slug))].map((s) => path.join(out, (s === '_act' ? '_act' : s) + '.png')).join('  ')}`);
console.log(`flags → ${path.join(out, 'flags.json')}`);
