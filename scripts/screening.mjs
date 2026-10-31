#!/usr/bin/env node
// screening.mjs — dailies. Shoots stills of a page at every scene and lays them out as one contact sheet,
// so the whole film can be judged at a glance: rhythm, sameness, dead holds, blank frames, broken cuts.
//
//   node screening.mjs <dir | file.html | url> [--out screening] [--frames 3] [--viewports desktop,laptop,mobile]
//                      [--cuts] [--reduced] [--wait 1800] [--headed]
//                      [--bar 90]        height of the phone browser bar simulated on the mobile viewport (0 = none)
//                      [--act file.mjs]  your own shots after the scenes: export default async ({ page, shoot, seek, viewport }) => {}
//                                        e.g. await seek('order', 0.5); await page.fill('#name', 'Lin'); await shoot('order-filled');
//                      [--tabs 60]       Tab through the first n focusable elements and flag hidden focus (0 = skip)
//                      [--grade grade.json]  check frames against a colour grade (from grade-from-stills.mjs, or a spec
//                                        { palette, ground, ink, accent, black, white, saturation:[min,max] }); without it the
//                                        page's own window.__grade.spec is used if present; with neither, no grade check runs
//
// Every frame is also checked for fixed or sticky chrome landing on page text (chrome-over-text).
// Pages built on the kit expose window.__reel and are shot scene by scene at exact, repeatable playhead
// positions. Any other page is shot at evenly spaced scroll positions.
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { parseArgs, resolveTarget, loadPlaywright, launch, nextFrame } from './lib.mjs';

const args = parseArgs(process.argv.slice(2), { out: 'screening', frames: 3, viewports: 'desktop,laptop,mobile', wait: 1800, bar: 90, tabs: 60 });
if (!args._[0]) { console.error('usage: node screening.mjs <dir|file|url> [--out screening] [--frames 3] [--viewports desktop,laptop,mobile] [--cuts] [--reduced]'); process.exit(1); }

// Colour-grade probe, run in the contact-sheet page on every shot (a cut in progress is skipped by the caller).
// Self-contained: Playwright serialises it. ΔE2000 coverage of a 96x60 downscale against the spec's colours.
function gradeProbe(spec) {
  const lin = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
  const f = (t) => (t > 216 / 24389 ? Math.cbrt(t) : (24389 / 27 * t + 16) / 116);
  const lab = (r, g, b) => {
    const R = lin(r), G = lin(g), B = lin(b);
    const x = f((0.4124564 * R + 0.3575761 * G + 0.1804375 * B) / 0.95047), y = f(0.2126729 * R + 0.7151522 * G + 0.072175 * B), z = f((0.0193339 * R + 0.119192 * G + 0.9503041 * B) / 1.08883);
    return [116 * y - 16, 500 * (x - y), 200 * (y - z)];
  };
  const hexRgb = (h) => { const t0 = String(h).trim(), m = /^#?([0-9a-f]{6})$/i.exec(t0) || /^#?([0-9a-f]{3})$/i.exec(t0); if (!m) return null; const t = m[1].length === 3 ? m[1].replace(/./g, '$&$&') : m[1]; return [0, 2, 4].map((i) => parseInt(t.slice(i, i + 2), 16)); };
  const rad = Math.PI / 180;
  const dE = (p, q) => { // CIEDE2000
    const [L1, a1, b1] = p, [L2, a2, b2] = q;
    const C1 = Math.hypot(a1, b1), C2 = Math.hypot(a2, b2), Cm = (C1 + C2) / 2, G = 0.5 * (1 - Math.sqrt(Cm ** 7 / (Cm ** 7 + 25 ** 7)));
    const ap1 = (1 + G) * a1, ap2 = (1 + G) * a2, Cp1 = Math.hypot(ap1, b1), Cp2 = Math.hypot(ap2, b2);
    const hp = (b, a) => { if (!b && !a) return 0; const h = Math.atan2(b, a) / rad; return h < 0 ? h + 360 : h; };
    const hp1 = hp(b1, ap1), hp2 = hp(b2, ap2), dL = L2 - L1, dC = Cp2 - Cp1;
    let dh = 0; if (Cp1 * Cp2) { dh = hp2 - hp1; if (dh > 180) dh -= 360; else if (dh < -180) dh += 360; }
    const dH = 2 * Math.sqrt(Cp1 * Cp2) * Math.sin((dh / 2) * rad), Lb = (L1 + L2) / 2, Cb = (Cp1 + Cp2) / 2;
    let hb = hp1 + hp2; if (Cp1 * Cp2) { if (Math.abs(hp1 - hp2) > 180) hb += hb < 360 ? 360 : -360; hb /= 2; }
    const T = 1 - 0.17 * Math.cos((hb - 30) * rad) + 0.24 * Math.cos(2 * hb * rad) + 0.32 * Math.cos((3 * hb + 6) * rad) - 0.2 * Math.cos((4 * hb - 63) * rad);
    const Sl = 1 + (0.015 * (Lb - 50) ** 2) / Math.sqrt(20 + (Lb - 50) ** 2), Sc = 1 + 0.045 * Cb, Sh = 1 + 0.015 * Cb * T;
    const Rt = -2 * Math.sqrt(Cb ** 7 / (Cb ** 7 + 25 ** 7)) * Math.sin(60 * Math.exp(-(((hb - 275) / 25) ** 2)) * rad);
    return Math.sqrt((dL / Sl) ** 2 + (dC / Sc) ** 2 + (dH / Sh) ** 2 + Rt * (dC / Sc) * (dH / Sh));
  };
  const pal = (spec.palette || []).map((c) => hexRgb(c?.hex ?? c)).filter(Boolean).map((c) => lab(...c));
  const refs = [...pal, ...[spec.ground, spec.ink, spec.accent].map((c) => hexRgb(c)).filter(Boolean).map((c) => lab(...c))];
  const shares = spec.shares && spec.shares.length === pal.length ? spec.shares : null;
  const W = 96, H = 60, cv = document.createElement('canvas'); cv.width = W; cv.height = H;
  const cx = cv.getContext('2d', { willReadFrequently: true });
  return [...document.images].map((im) => {
    cx.drawImage(im, 0, 0, W, H);
    const d = cx.getImageData(0, 0, W, H).data, n = W * H, Ls = new Float32Array(n), As = new Float32Array(n), Bs = new Float32Array(n), hist = new Array(pal.length).fill(0);
    let near = 0, sumC = 0, pb = 0, pw = 0;
    for (let i = 0; i < n; i++) {
      const r = d[i * 4], g = d[i * 4 + 1], b = d[i * 4 + 2], l = lab(r, g, b);
      Ls[i] = l[0]; As[i] = l[1]; Bs[i] = l[2]; sumC += Math.hypot(l[1], l[2]);
      if (Math.max(r, g, b) <= 3) pb++; else if (Math.min(r, g, b) >= 252) pw++;
      for (const q of refs) if (dE(l, q) <= 8) { near++; break; }
      if (shares) { let bi = 0, bd = Infinity; for (let k = 0; k < pal.length; k++) { const dd = dE(l, pal[k]); if (dd < bd) { bd = dd; bi = k; } } hist[bi]++; }
    }
    const meanL = Ls.reduce((a, v) => a + v, 0) / n, sorted = Ls.slice().sort();
    const t1 = sorted[Math.round((n - 1) / 3)], t2 = sorted[Math.round((2 * (n - 1)) / 3)], sh = [0, 0, 0, 0], hi = [0, 0, 0, 0];
    for (let i = 0; i < n; i++) { const t = Ls[i] <= t1 ? sh : Ls[i] >= t2 ? hi : null; if (t) { t[0] += As[i]; t[1] += Bs[i]; t[2]++; t[3] += Ls[i]; } }
    const match = shares ? shares.reduce((a, v, k) => a + Math.min(v, hist[k] / n), 0) : null;
    const warm = { shadows: [sh[0] / Math.max(1, sh[2]), sh[1] / Math.max(1, sh[2]), sh[3] / Math.max(1, sh[2])], highlights: [hi[0] / Math.max(1, hi[2]), hi[1] / Math.max(1, hi[2]), hi[3] / Math.max(1, hi[2])] };
    Ls.sort();
    return { match, warm, coverage: near / n, p1: Ls[Math.round(0.01 * (n - 1))], p99: Ls[Math.round(0.99 * (n - 1))], meanL, chroma: sumC / n, pureBlack: pb / n, pureWhite: pw / n };
  });
}

const VIEWPORTS = {
  desktop: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, cols: 4, thumb: 480 },
  laptop: { viewport: { width: 1366, height: 640 }, deviceScaleFactor: 1, cols: 4, thumb: 480 },   // a 768-high laptop minus browser chrome: the short frame that breaks tall compositions
  wide: { viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1, cols: 4, thumb: 480 },
  ultrawide: { viewport: { width: 2560, height: 1080 }, deviceScaleFactor: 1, cols: 3, thumb: 640 },
  tablet: { viewport: { width: 820, height: 1180 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true, cols: 6, thumb: 300 },
  mobile: { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, cols: 8, thumb: 220 },
  'mobile-small': { viewport: { width: 360, height: 640 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, cols: 8, thumb: 220 },
  landscape: { viewport: { width: 844, height: 390 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true, cols: 4, thumb: 480 },   // a phone on its side
};

// In-page probes, installed on every navigation. Chrome = a fixed or sticky element that is not a scene frame,
// not decorative (aria-hidden, or pointer-events: none with no text), and under 40 % of the viewport.
function screenHelpers() {
  const vis = (el) => (el.checkVisibility ? el.checkVisibility({ opacityProperty: true, visibilityProperty: true }) : true);
  const opacityOf = (el) => { let o = 1; for (let e = el; e && e.nodeType === 1; e = e.parentElement) o *= +getComputedStyle(e).opacity; return o; };
  const alphaOf = (c) => {
    if (!c || c === 'transparent') return 0;
    const slash = /\/\s*([\d.]+)(%?)\s*\)$/.exec(c); if (slash) return parseFloat(slash[1]) * (slash[2] ? 0.01 : 1);
    const m = /^rgba\(([^)]+)\)$/.exec(c); return m ? parseFloat(m[1].split(',')[3]) : 1;
  };
  const ground = (el) => { const cs = getComputedStyle(el), a = alphaOf(cs.backgroundColor); return a >= 0.6 || cs.backgroundImage !== 'none' || (cs.backdropFilter && cs.backdropFilter !== 'none' && a >= 0.25); };
  const hidden = (el) => !!el.closest('[aria-hidden="true"], [inert]');
  const name = (el) => {
    let s = el.tagName.toLowerCase();
    if (el.id) s += '#' + el.id; else if (el.classList.length) s += '.' + [...el.classList].slice(0, 2).join('.');
    const l = el.getAttribute('aria-label'); return l ? `${s} [${l.slice(0, 24)}]` : s;
  };
  const inView = (r) => r.width >= 1 && r.height >= 1 && r.bottom > 0 && r.top < innerHeight && r.right > 0 && r.left < innerWidth;
  function chromeEls() {
    const out = [];
    for (const el of document.body.querySelectorAll('*')) {
      if (out.some((c) => c.contains(el))) continue;
      const cs = getComputedStyle(el);
      if (cs.position !== 'fixed' && cs.position !== 'sticky') continue;
      if (el.id === '__bar' || el.matches('[data-scene] > .frame, canvas') || el.querySelector('[data-scene]') || hidden(el) || !vis(el) || opacityOf(el) < 0.05) continue;
      const r = el.getBoundingClientRect();
      if (!inView(r) || r.width * r.height > 0.4 * innerWidth * innerHeight) continue; // a full-frame layer is a scene or an overlay, not chrome
      if (cs.pointerEvents === 'none' && !el.textContent.trim()) continue;            // grain, flash, vignette
      out.push(el);
    }
    return out;
  }
  function lines(root, skip) {
    const out = [], w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), range = document.createRange();
    for (let n; (n = w.nextNode());) {
      const t = n.textContent.trim(), el = n.parentElement;
      if (t.length < 2 || !el || /^(SCRIPT|STYLE|NOSCRIPT|TEMPLATE)$/.test(el.tagName) || skip(el)) continue;
      range.selectNodeContents(n);
      for (const r of range.getClientRects()) if (r.width > 2 && r.height > 2 && inView(r)) out.push({ r, el, t });
    }
    return out;
  }
  // What is on top at a point, counting chrome that ignores the pointer (a status slip with pointer-events: none still paints).
  function hitTest(c, x, y) {
    const pe = c.style.getPropertyValue('pointer-events'), pp = c.style.getPropertyPriority('pointer-events');
    c.style.setProperty('pointer-events', 'auto', 'important');
    const hit = document.elementFromPoint(x, y);
    c.style.setProperty('pointer-events', pe, pp);
    return hit;
  }
  const ids = new WeakMap(); let nextId = 1;
  window.__screen = {
    // Page text covered by chrome: chrome without a ground whose own text or controls overlap page text, or a
    // grounded chrome over text that cannot scroll clear of it (text in a pinned frame; the top or bottom of the page).
    chrome({ pinned }) {
      const C = chromeEls(); if (!C.length) return [];
      const cache = new Map();
      const ok = (el) => { if (!cache.has(el)) cache.set(el, !C.some((c) => c.contains(el)) && !hidden(el) && vis(el) && opacityOf(el) >= 0.35); return cache.get(el); };
      const content = lines(document.body, (el) => !ok(el));
      const atTop = scrollY <= 2, atEnd = scrollY >= document.documentElement.scrollHeight - innerHeight - 2;
      const found = new Map();
      for (const c of C) {
        const occ = [];
        if (ground(c)) occ.push({ r: c.getBoundingClientRect(), g: true });
        else {
          for (const d of c.querySelectorAll('*')) if (vis(d) && !hidden(d) && ground(d) && !occ.some((o) => o.el?.contains(d))) occ.push({ r: d.getBoundingClientRect(), g: true, el: d });
          for (const l of lines(c, (el) => hidden(el) || !vis(el) || opacityOf(el) < 0.35 || occ.some((o) => o.el?.contains(el)))) occ.push({ r: l.r, g: false }); // text on a grounded part is that part's
        }
        const cr = c.getBoundingClientRect(), low = cr.top + cr.height / 2 > innerHeight / 2;
        for (const o of occ) for (const L of content) {
          const x0 = Math.max(o.r.left, L.r.left), x1 = Math.min(o.r.right, L.r.right), y0 = Math.max(o.r.top, L.r.top), y1 = Math.min(o.r.bottom, L.r.bottom);
          if (x1 - x0 < 4 || y1 - y0 < Math.max(4, Math.min(10, 0.3 * L.r.height))) continue; // grazing a line's leading is not covering it
          const hit = hitTest(c, (x0 + x1) / 2, (y0 + y1) / 2);
          if (!hit || !c.contains(hit)) continue;                                 // the page text is on top here, or something else covers both
          let why = null;
          if (!o.g) why = 'no ground: its text sits on page text';
          else {
            const fr = L.el.closest('[data-scene]:not([data-flow]) > .frame');
            if (pinned && fr && Math.abs(fr.getBoundingClientRect().top) < 2) why = 'covers text in a pinned frame';
            else if ((low && atEnd) || (!low && atTop)) why = 'covers text that never scrolls clear';
          }
          const key = name(c) + '|' + L.t.slice(0, 28);
          if (why && !found.has(key)) found.set(key, { chrome: name(c), text: L.t.slice(0, 28), why });
        }
      }
      return [...found.values()].slice(0, 12);
    },
    // Where keyboard focus is and whether it can be seen: invisible, off screen, ring clipped by an ancestor's
    // overflow or inset() clip-path, under fixed chrome, or covered at its centre (other clip-paths, overlays).
    focus() {
      const el = document.activeElement;
      if (!el || el === document.body || el === document.documentElement) return null;
      if (!ids.has(el)) ids.set(el, nextId++);
      const r = el.getBoundingClientRect(), cs = getComputedStyle(el);
      const label = (el.getAttribute('aria-label') || el.textContent || el.value || el.name || '').trim().replace(/\s+/g, ' ').slice(0, 28);
      const base = { id: ids.get(el), el: name(el), label, why: null };
      if (r.width < 2 && r.height < 2) return base;                                  // visually hidden on purpose
      if (!vis(el) || opacityOf(el) < 0.1) { // a transparent native input over a drawn control is a proxy: its ring is drawn elsewhere
        const proxy = el.matches('input, select') && +cs.opacity < 0.1 && opacityOf(el.parentElement) >= 0.1;
        return proxy ? base : { ...base, why: 'focused but invisible (opacity 0 or visibility hidden)' };
      }
      if (!inView(r)) return { ...base, why: 'focused off screen (not scrolled into view)' };
      const ow = cs.outlineStyle !== 'none' ? parseFloat(cs.outlineWidth) || 0 : 0, pad = Math.max(0, ow + (ow ? parseFloat(cs.outlineOffset) || 0 : 0));
      const ring = { left: r.left - pad, top: r.top - pad, right: r.right + pad, bottom: r.bottom + pad };
      // How far the ring passes a clip edge. An edge at the viewport's edge does not count: the window clips there anyway.
      const clipBy = (k, x, y) => Math.max(
        x && k.left > 1 ? k.left - ring.left : 0, x && k.right < innerWidth - 1 ? ring.right - k.right : 0,
        y && k.top > 1 ? k.top - ring.top : 0, y && k.bottom < innerHeight - 1 ? ring.bottom - k.bottom : 0);
      for (let a = el; a && a !== document.documentElement; a = a.parentElement) {
        const as = getComputedStyle(a), ar = a.getBoundingClientRect();
        const px = (s, len) => (s.endsWith('%') ? (parseFloat(s) / 100) * len : parseFloat(s) || 0);
        if (as.clipPath && as.clipPath.startsWith('inset(')) {
          const [t, rt = t, b = t, l = rt] = as.clipPath.slice(6, -1).split(/\s+round\s+/)[0].trim().split(/\s+/);
          const cut = clipBy({ top: ar.top + px(t, ar.height), right: ar.right - px(rt, ar.width), bottom: ar.bottom - px(b, ar.height), left: ar.left + px(l, ar.width) }, true, true);
          if (cut > 1) return { ...base, why: `focus ring clipped ${Math.round(cut)}px by clip-path on ${name(a)}` };
        }
        if (a === el) continue;
        const cx = as.overflowX !== 'visible', cy = as.overflowY !== 'visible';
        if (cx || cy) {
          const cut = clipBy({ top: ar.top + (parseFloat(as.borderTopWidth) || 0), right: ar.right - (parseFloat(as.borderRightWidth) || 0), bottom: ar.bottom - (parseFloat(as.borderBottomWidth) || 0), left: ar.left + (parseFloat(as.borderLeftWidth) || 0) }, cx, cy);
          if (cut > 1) return { ...base, why: `focus ring clipped ${Math.round(cut)}px by overflow on ${name(a)}` };
        }
      }
      // Under chrome: a quarter or more of the control's on-screen box covered by fixed or sticky chrome.
      const vr = { left: Math.max(0, r.left), top: Math.max(0, r.top), right: Math.min(innerWidth, r.right), bottom: Math.min(innerHeight, r.bottom) };
      const area = Math.max(1, (vr.right - vr.left) * (vr.bottom - vr.top));
      for (const c of chromeEls()) {
        if (c.contains(el)) continue;
        const k = c.getBoundingClientRect(), x0 = Math.max(k.left, vr.left), x1 = Math.min(k.right, vr.right), y0 = Math.max(k.top, vr.top), y1 = Math.min(k.bottom, vr.bottom);
        if (x1 - x0 < 4 || y1 - y0 < 4 || ((x1 - x0) * (y1 - y0)) / area < 0.25) continue;
        const hit = hitTest(c, (x0 + x1) / 2, (y0 + y1) / 2);
        if (hit && c.contains(hit)) return { ...base, why: `${Math.round((100 * (x1 - x0) * (y1 - y0)) / area)}% under fixed chrome ${name(c)}` };
      }
      const pe = el.style.getPropertyValue('pointer-events'), pp = el.style.getPropertyPriority('pointer-events');
      el.style.setProperty('pointer-events', 'auto', 'important');                   // a control inside a pointer-events: none layer still has to be hit-testable
      const hit = document.elementFromPoint(Math.min(innerWidth - 1, Math.max(0, (r.left + r.right) / 2)), Math.min(innerHeight - 1, Math.max(0, (r.top + r.bottom) / 2)));
      el.style.setProperty('pointer-events', pe, pp);
      if (hit && !el.contains(hit) && !hit.contains(el)) return { ...base, why: `covered at its centre by ${name(hit)}` };
      return base;
    },
  };
}

const out = path.resolve(String(args.out));
fs.mkdirSync(out, { recursive: true });
const target = await resolveTarget(args._[0]);
// Optional colour grade: --grade file wins; otherwise window.__grade.spec is read from the page. No spec, no check.
let cliSpec = null;
if (args.grade) {
  const gp = path.resolve(String(args.grade));
  if (!fs.existsSync(gp)) { console.error(`Grade not found: ${gp}`); process.exit(1); }
  const j = JSON.parse(fs.readFileSync(gp, 'utf8'));
  cliSpec = j.spec || j;
}
const normSpec = (sp) => {
  if (!sp || typeof sp !== 'object') return null;
  const raw = Array.isArray(sp.palette) ? sp.palette : [], out = { ...sp, palette: raw.map((c) => c?.hex ?? c).filter(Boolean) };
  const tot = raw.reduce((a, c) => a + (Number(c?.share) || 0), 0);
  if (raw.length && raw.every((c) => c && typeof c === 'object' && Number(c.share) >= 0) && tot > 0) out.shares = raw.map((c) => Number(c.share) / tot); // histogram intersection needs the spec's shares; a bare palette falls back to coverage
  return out;
};
const pw = await loadPlaywright();
const browser = await launch(pw, { headed: !!args.headed });
const report = { target: path.resolve(String(args._[0]).split('?')[0]), url: target.url, at: new Date().toISOString(), reducedMotion: !!args.reduced, viewports: {} };

try {
  for (const name of String(args.viewports).split(',').map((s) => s.trim()).filter(Boolean)) {
    const vp = VIEWPORTS[name];
    if (!vp) { console.warn(`unknown viewport "${name}" (have: ${Object.keys(VIEWPORTS).join(', ')})`); continue; }
    const { cols, thumb, ...contextOptions } = vp;
    const context = await browser.newContext({ ...contextOptions, reducedMotion: args.reduced ? 'reduce' : 'no-preference' });
    await context.addInitScript(screenHelpers);
    // Headless browsers have no address bar, so 100lvh == 100svh and whatever a real phone's bar would cover goes unseen.
    // On phone viewports, pretend: tell the page the bar's height (--safe-bottom) and tint the strip it would hide.
    const bar = /^mobile/.test(name) ? Math.max(0, Number(args.bar)) : 0;
    if (bar) await context.addInitScript((px) => {
      const apply = () => {
        if (!document.documentElement) return;
        document.documentElement.style.setProperty('--safe-bottom', px + 'px');
        if (!document.body || document.getElementById('__bar')) return;
        const el = document.createElement('div'); el.id = '__bar'; el.setAttribute('aria-hidden', 'true');
        el.style.cssText = `position:fixed;left:0;right:0;bottom:0;height:${px}px;z-index:2147483647;pointer-events:none;background:repeating-linear-gradient(45deg,rgba(255,60,60,.16) 0 6px,rgba(255,60,60,.05) 6px 12px);border-top:1px dashed rgba(255,60,60,.8)`;
        document.body.appendChild(el);
      };
      apply(); new MutationObserver((_, o) => { apply(); if (document.body) o.disconnect(); }).observe(document, { childList: true, subtree: true });
    }, bar);
    const page = await context.newPage();
    const issues = [];
    page.on('console', (m) => { if (m.type() === 'error' && !/Failed to load resource/.test(m.text())) issues.push({ kind: 'console.error', text: m.text().slice(0, 300) }); });
    page.on('pageerror', (e) => issues.push({ kind: 'pageerror', text: String(e.message).slice(0, 300) }));
    page.on('requestfailed', (r) => issues.push({ kind: 'requestfailed', text: `${r.url().slice(0, 160)} — ${r.failure()?.errorText}` }));
    page.on('response', (r) => { if (r.status() >= 400 && !/favicon\.ico$/.test(r.url())) issues.push({ kind: `http ${r.status()}`, text: r.url().slice(0, 200) }); });

    await page.goto(target.url, { waitUntil: 'load', timeout: 60000 });
    await page.evaluate(() => document.fonts?.ready);
    await page.waitForTimeout(Number(args.wait)); // let opening titles play out

    const tag = args.reduced ? `${name}-reduced` : name; // the accessible cut keeps its own frames beside the theatrical ones
    for (const old of fs.readdirSync(out)) if (new RegExp(`^${tag}-\\d\\d-`).test(old)) fs.unlinkSync(path.join(out, old)); // no stale frames from an earlier pass
    const shots = [];
    const shoot = async (label, meta = {}) => {
      await page.waitForFunction(() => [...document.querySelectorAll('video')].every((v) => !v.seeking), null, { timeout: 4000 }).catch(() => {}); // scrubbed footage seeks asynchronously
      await nextFrame(page);
      const file = `${tag}-${String(shots.length + 1).padStart(2, '0')}-${label.replace(/[^a-z0-9.-]+/gi, '_')}.jpg`;
      await page.screenshot({ path: path.join(out, file), type: 'jpeg', quality: 82 });
      // Small text sliced by the top or bottom of a pinned frame is almost never deliberate (large type cropped is).
      const cut = meta.pinned && !meta.cut && !meta.flow && !args.reduced ? await page.evaluate((sceneName) => {
        const sc = document.querySelector(`[data-scene="${sceneName}"]`); if (!sc) return [];
        const vh = innerHeight, found = [];
        for (const el of sc.querySelectorAll('p, li, a, button, label, input, dt, dd, small, figcaption, h1, h2, h3, h4, span')) {
          if (![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 1)) continue;
          const cs = getComputedStyle(el); if (parseFloat(cs.fontSize) > 30 || cs.visibility === 'hidden' || +cs.opacity < 0.4) continue;
          const r = el.getBoundingClientRect(); if (!r.width || !r.height || r.right < 0 || r.left > innerWidth) continue;
          if ((r.top < vh - 2 && r.bottom > vh + 2) || (r.top < -2 && r.bottom > 2)) found.push(el.textContent.trim().slice(0, 18));
        }
        return [...new Set(found)].slice(0, 3);
      }, meta.scene) : [];
      // Fixed chrome on page text (mid-cut and mid-title frames are transitional: skipped).
      const chrome = meta.cut || meta.scene === '(intro)' ? [] : await page.evaluate((o) => window.__screen?.chrome(o) ?? [], { pinned: !!info.reel && !args.reduced }).catch(() => []);
      shots.push({ file, label, ...meta, cutText: cut, chromeOverText: chrome });
    };

    async function focusWalk() { // Tab through the page; every stop must be visible and not under chrome
      const max = Math.max(0, Number(args.tabs) || 0); if (!max) return { tabbed: 0, found: [] };
      // The browser scrolls focus into the layout viewport and knows nothing of the simulated phone bar: drop it here.
      await page.evaluate(() => { document.getElementById('__bar')?.remove(); if (document.documentElement.style.getPropertyValue('--safe-bottom')) document.documentElement.style.setProperty('--safe-bottom', '0px'); window.__reel?.release(); window.__reel?.measure?.(); document.activeElement?.blur?.(); scrollTo(0, 0); });
      await page.waitForTimeout(300);
      const found = []; let first = null, tabbed = 0;
      for (let k = 0; k < max; k++) {
        await page.keyboard.press('Tab');
        await page.waitForTimeout(220); await nextFrame(page); // let the reel bring a pinned scene to its money frame
        const st = await page.evaluate(() => window.__screen?.focus() ?? null).catch(() => null);
        if (!st) continue;
        if (first === null) first = st.id; else if (st.id === first) break; // wrapped round
        tabbed++;
        if (!st.why) continue;
        await page.waitForTimeout(900); // a fade or a scroll still settling is not a fault: look again
        const again = await page.evaluate(() => window.__screen?.focus() ?? null).catch(() => null);
        if (again?.why) found.push({ n: k + 1, ...again });
      }
      await page.evaluate(() => document.activeElement?.blur?.());
      return { tabbed, found };
    }

    const info = await page.evaluate(() => ({
      reel: !!window.__reel,
      scenes: window.__reel ? window.__reel.scenes : [],
      webgl: !!document.querySelector('canvas'),
      noWebgl: document.documentElement.classList.contains('no-webgl'),
      height: document.documentElement.scrollHeight,
    }));

    async function runAct() { // the director's own shots: states, hovers, clicks, the audience's part
      if (!args.act) return;
      const mod = await import(pathToFileURL(path.resolve(String(args.act))).href);
      const seek = (scene, u = 0.5) => page.evaluate(([nm, uu]) => { if (!window.__reel) throw new Error('seek() needs window.__reel; drive a non-reel page with page.click / page.keyboard'); window.__reel.seekScene(nm, uu, 1); }, [scene, u]);
      await mod.default({ page, viewport: name, seek, shoot: (label) => shoot(`act_${label}`, { scene: '(act)', act: true }) });
    }

    if (info.reel) {
      if (await page.evaluate(() => !!window.__reel.introTimeline && !window.__reel.reduced)) { // one frame of the opening titles, mid-flight
        await page.evaluate(() => { scrollTo(0, 0); window.__reel.introTimeline.pause().progress(0.4); });
        await shoot('intro@0.40', { scene: '(intro)', u: 0.4 });
      }
      await page.evaluate(() => { window.__reel.introTimeline?.progress(1); }); // block body: a timeline must not be returned across the bridge
      const n = Math.max(1, Number(args.frames));
      for (const s of info.scenes) {
        const span = await page.evaluate((nm) => [window.__reel.seekScene(nm, 0, 0), window.__reel.seekScene(nm, 1, 0)], s.name);
        const pinned = Math.abs(span[1] - span[0]) > 2;
        const us = !pinned ? [0.5] : n === 1 ? [s.still ?? 0.5] : Array.from({ length: n }, (_, k) => 0.06 + (0.88 * k) / (n - 1));
        for (const u of us) {
          await page.evaluate(([nm, uu, t]) => window.__reel.seekScene(nm, uu, t), [s.name, u, s.index + 1]); // one ambient time per scene: frames differ only by scroll
          await shoot(`${s.name}@${u.toFixed(2)}`, { scene: s.name, u, pinned, flow: !!s.flow, hold: !!s.hold || !!s.flow }); // a flow scene scrolls by itself: never a dead hold
        }
        if (args.cuts && s.index < info.scenes.length - 1) { // the middle of the cut into the next scene
          await page.evaluate(([nm, t]) => window.__reel.seekScene(nm, 1.5, t), [s.name, s.index + 1]);
          await shoot(`${s.name}→cut`, { scene: s.name, u: 1.5, cut: true });
        }
      }
      await runAct();
      await page.evaluate(() => { window.__reel.release(); });
    } else {
      const vh = vp.viewport.height;
      const count = Math.min(16, Math.max(1, Math.ceil(info.height / vh)));
      for (let k = 0; k < count; k++) {
        const y = count === 1 ? 0 : Math.round(((info.height - vh) * k) / (count - 1));
        await page.evaluate((yy) => window.scrollTo(0, yy), y);
        await page.waitForTimeout(350);
        await shoot(`y${y}`, { y });
      }
      await page.evaluate(() => window.scrollTo(0, 0));
      await runAct(); // click-driven and fixed-stage pages: the act script is the only way to shoot their states
    }

    const focusRun = await focusWalk();
    focusRun.found.slice(0, 8).forEach((f) => issues.push({ kind: 'focus-hidden', text: `Tab ${f.n}: ${f.el}${f.label ? ` "${f.label}"` : ''} — ${f.why}. A focused control must be seen: scroll-margin / scroll-padding for chrome, room for the ring inside clipped boxes.` }));
    if (focusRun.found.length > 8) issues.push({ kind: 'focus-hidden', text: `…and ${focusRun.found.length - 8} more stops (report.json → focusWalk)` });

    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (overflow > 1) issues.push({ kind: 'layout', text: `horizontal overflow of ${overflow}px` });
    if (info.noWebgl) issues.push({ kind: 'webgl', text: 'WebGL failed to start in this browser — frames show the fallback, not the stage' });

    // Contact sheet + cheap frame statistics (flat frames, holds where nothing changes).
    const cells = shots.map((s) => ({ ...s, src: `data:image/jpeg;base64,${fs.readFileSync(path.join(out, s.file)).toString('base64')}` }));
    const sheet = await browser.newPage(); // its own context: the page under test may carry init scripts (the simulated bar)
    await sheet.setViewportSize({ width: cols * thumb + (cols + 1) * 12, height: 120 });
    await sheet.setContent(`<!doctype html><meta charset="utf-8"><style>
      body{margin:0;padding:12px;background:#111;color:#ddd;font:11px/1.3 ui-monospace,Consolas,monospace}
      .g{display:grid;grid-template-columns:repeat(${cols},${thumb}px);gap:12px}
      figure{margin:0} img{display:block;width:100%;height:auto;background:#000} figcaption{padding:4px 0 0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
      .start{border-top:3px solid #e8c547}</style>
      <div class="g">${cells.map((c, i) => `<figure class="${i === 0 || c.scene !== cells[i - 1].scene ? 'start' : ''}"><img src="${c.src}"><figcaption>${String(i + 1).padStart(2, '0')} ${c.label}</figcaption></figure>`).join('')}</div>`);
    await sheet.waitForFunction(() => [...document.images].every((im) => im.complete && im.naturalWidth > 0));
    const stats = await sheet.evaluate(() => {
      const W = 64, H = 40, cv = document.createElement('canvas'); cv.width = W; cv.height = H;
      const cx = cv.getContext('2d', { willReadFrequently: true });
      return [...document.images].map((im) => {
        cx.drawImage(im, 0, 0, W, H);
        const d = cx.getImageData(0, 0, W, H).data, lum = new Float32Array(W * H);
        let sum = 0;
        for (let i = 0; i < lum.length; i++) { lum[i] = 0.2126 * d[i * 4] + 0.7152 * d[i * 4 + 1] + 0.0722 * d[i * 4 + 2]; sum += lum[i]; }
        const mean = sum / lum.length; let v = 0;
        for (let i = 0; i < lum.length; i++) v += (lum[i] - mean) ** 2;
        return { mean, contrast: Math.sqrt(v / lum.length), lum: Array.from(lum) };
      });
    });
    let gradeSpec = normSpec(cliSpec), gradeFrom = args.grade ? path.resolve(String(args.grade)) : null;
    if (!gradeSpec) { gradeSpec = normSpec(await page.evaluate(() => window.__grade?.spec ?? null).catch(() => null)); if (gradeSpec) gradeFrom = 'window.__grade.spec'; }
    const gradeStats = gradeSpec && (gradeSpec.palette.length || gradeSpec.ground || gradeSpec.ink || gradeSpec.accent) ? await sheet.evaluate(gradeProbe, gradeSpec) : null;
    const sheetFile = `contact-${name}${args.reduced ? '-reduced' : ''}.jpg`;
    await sheet.screenshot({ path: path.join(out, sheetFile), fullPage: true, type: 'jpeg', quality: 86 });
    await sheet.close();

    shots.forEach((s, i) => {
      const st = stats[i];
      s.meanLuma = +st.mean.toFixed(1); s.contrast = +st.contrast.toFixed(1);
      if (s.cutText?.length) issues.push({ kind: 'cut-text', text: `${s.label}: small text is sliced by the frame edge at this viewport — "${s.cutText.join('", "')}". Compose for the short frame, or let the scene scroll.` });
      if (st.contrast < 3) issues.push({ kind: 'flat-frame', text: `${s.label}: almost a single flat colour (contrast ${s.contrast}) — blank canvas or an empty shot?` });
      const prev = i > 0 && shots[i - 1].scene === s.scene && !s.cut && !shots[i - 1].cut ? stats[i - 1] : null;
      if (prev) {
        let diff = 0; for (let k = 0; k < st.lum.length; k++) diff += Math.abs(st.lum[k] - prev.lum[k]);
        s.changeFromPrevious = +(diff / st.lum.length).toFixed(2);
        if (s.changeFromPrevious < 0.8 && !s.hold && !s.act) issues.push({ kind: 'dead-hold', text: `${shots[i - 1].label} → ${s.label}: the frame barely changes (${s.changeFromPrevious}). A pinned hold needs a development, or less scroll. (Deliberate stillness: mark the scene data-hold. Small type changes do not register here: judge those by eye.)` });
      }
    });

    let gradeSummary = null;
    if (gradeStats) {
      const REF_CHROMA = 30, hexL = (h) => { const m = /^#?([0-9a-f]{6})$/i.exec(String(h || '').trim()); if (!m) return null; const v = [0, 2, 4].map((i) => parseInt(m[1].slice(i, i + 2), 16) / 255).map((x) => (x <= 0.04045 ? x / 12.92 : ((x + 0.055) / 1.055) ** 2.4)); const y = 0.2126729 * v[0] + 0.7151522 * v[1] + 0.072175 * v[2]; return 116 * (y > 216 / 24389 ? Math.cbrt(y) : (24389 / 27 * y + 16) / 116) - 16; };
      const bL = hexL(gradeSpec.black), wL = hexL(gradeSpec.white), sat = Array.isArray(gradeSpec.saturation) && gradeSpec.saturation.length === 2 ? gradeSpec.saturation.map(Number) : null;
      const MATCH_FLOOR = 0.35, COVER_FLOOR = 0.45, WARM_SHIFT = 10, LONE = 0.2; // LONE: a few off-grade scenes (an order card on paper in a dark film) may be a design choice: one grade-outlier note naming them, not grade-drift
      const sw = gradeSpec.warmth && typeof gradeSpec.warmth === 'object' && gradeSpec.warmth.shadows && gradeSpec.warmth.highlights ? gradeSpec.warmth : null;
      const hold = { drift: [], black: [], white: [], sat: [], warm: [] }, used = [];
      shots.forEach((s, i) => {
        const g = gradeStats[i];
        s.grade = { ...(g.match !== null ? { match: +g.match.toFixed(3) } : {}), warmShadows: g.warm.shadows.map((v) => +v.toFixed(1)), warmHighlights: g.warm.highlights.map((v) => +v.toFixed(1)), // [a*, b*, mean L*] of the darkest / brightest third
           coverage: +g.coverage.toFixed(3), blackL: +g.p1.toFixed(1), whiteL: +g.p99.toFixed(1), saturation: +(g.chroma / REF_CHROMA).toFixed(2), pureBlack: +g.pureBlack.toFixed(3), pureWhite: +g.pureWhite.toFixed(3) };
        if (s.cut) return; // a cut in progress is a blend of two scenes: not judged
        used.push(s);
        if (g.match !== null ? g.match < MATCH_FLOOR : g.coverage < COVER_FLOOR) hold.drift.push({ s, why: g.match !== null ? `match ${Math.round(g.match * 100)}%` : `${Math.round(g.coverage * 100)}% near` });
        if (sw) { // a tint is a direction: project the frame's mean a*/b* on the spec's. Opposite or missing (cool grey under amber, amber under teal) or sideways (hue off) is drift.
          let worst = null;
          for (const part of ['shadows', 'highlights']) {
            const ref = sw[part], cur = g.warm[part], rl = Math.hypot(ref.a, ref.b);
            if (cur[2] < 15) continue; // near-black thirds carry no readable tint
            let why = null;
            if (rl >= 6) {
              const p = (cur[0] * ref.a + cur[1] * ref.b) / rl, q = Math.abs(cur[0] * ref.b - cur[1] * ref.a) / rl;
              if (q > WARM_SHIFT) why = `${part} hue is off the grade's (sideways shift ${q.toFixed(0)})`;
              else if (cur[2] >= 25 && p < 0.2 * rl) why = `${part} carry ${p < 0 ? 'the opposite tint' : 'almost none of the tint'} (${p.toFixed(0)} along the grade's ${rl.toFixed(0)})`;
            } // a spec third that is itself near-neutral has no tint to hold: not checked
            if (why && !worst) worst = why;
          }
          if (worst) hold.warm.push({ s, why: worst });
        }
        if (g.pureBlack > 0.06 && !(bL !== null && bL < 3)) hold.black.push({ s, why: `crushed: ${Math.round(g.pureBlack * 100)}% pure #000` });
        else if (bL !== null && g.meanL < 60 && g.p1 > bL + 12) hold.black.push({ s, why: `lifted: darkest 1% at L* ${g.p1.toFixed(0)} vs spec ${bL.toFixed(0)}` });
        if (g.pureWhite > 0.06 && !(wL !== null && wL > 97)) hold.white.push({ s, why: `clipped: ${Math.round(g.pureWhite * 100)}% pure #fff` });
        else if (wL !== null && g.meanL > 40 && g.p99 < wL - 15) hold.white.push({ s, why: `dull: brightest 1% at L* ${g.p99.toFixed(0)} vs spec ${wL.toFixed(0)}` });
        if (sat) { const v = g.chroma / REF_CHROMA; if (v > sat[1] * 1.15 + 0.05) hold.sat.push({ s, why: `${v.toFixed(2)} above ${sat[1]}` }); else if (v < sat[0] * 0.85 - 0.05) hold.sat.push({ s, why: `${v.toFixed(2)} below ${sat[0]}` }); }
      });
      const list = (a) => `${a.slice(0, 4).map((x) => `${x.s.label} (${x.why})`).join(', ')}${a.length > 4 ? ` (+${a.length - 4})` : ''}`;
      const widespread = (a) => a.length > LONE * used.length, lone = [];
      for (const k of ['drift', 'warm']) if (!widespread(hold[k])) { lone.push(...hold[k].map((x) => `${x.s.label} (${k})`)); hold[k] = []; }
      if (lone.length) issues.push({ kind: 'grade-outlier', text: `${lone.slice(0, 6).join(', ')}${lone.length > 6 ? ` (+${lone.length - 6})` : ''}: off the grade while the rest of the film holds it. Fine if deliberate (a paper card in a dark film, a regrade at the turn): say so in the treatment's GRADE ARC line. Otherwise re-grade the scene.` });
      if (hold.drift.length) issues.push({ kind: 'grade-drift', text: `${list(hold.drift)}: the frame's colour distribution does not match the grade's palette shares (histogram intersection under ${MATCH_FLOOR * 100}%; without palette shares: under ${COVER_FLOOR * 100}% of pixels within ΔE2000 8 of the palette). Re-grade the scene's footage, light and ground toward the palette, or add the colour to the spec if it is deliberate.` });
      if (hold.black.length) issues.push({ kind: 'grade-black', text: `${list(hold.black)}: blacks do not sit where the grade puts them (spec black ${gradeSpec.black || 'not set'}). Pure #000 reads as a screen, not film; lift to the spec black, or pull a milky lift back down.` });
      if (hold.white.length) issues.push({ kind: 'grade-white', text: `${list(hold.white)}: whites do not sit where the grade puts them (spec white ${gradeSpec.white || 'not set'}). Pull clipped #fff down to the spec white, or restore dull highlights.` });
      if (hold.warm.length) issues.push({ kind: 'grade-warmth', text: `${list(hold.warm)}: the tint of the shadows or highlights sits away from the grade's (a*/b* off by more than ${WARM_SHIFT}, or the tint missing or reversed). Re-balance the colour temperature or split-tone toward the spec warmth.` });
      if (hold.sat.length) issues.push({ kind: 'grade-saturation', text: `${list(hold.sat)}: frame chroma is outside the grade's saturation range ${sat[0]}–${sat[1]} (1 = neutral photographic chroma). Tune the grade's saturation or the scene's colours.` });
      const avg = (k) => used.reduce((a, s) => a + s.grade[k], 0) / Math.max(1, used.length);
      const flagged = new Set([...hold.drift, ...hold.black, ...hold.white, ...hold.sat, ...hold.warm].map((x) => x.s.label)).size;
      gradeSummary = { from: gradeFrom, framesChecked: used.length, framesFlagged: flagged, outliers: lone, meanCoverage: +avg('coverage').toFixed(3), meanMatch: used.every((x) => x.grade.match !== undefined) && used.length ? +avg('match').toFixed(3) : null, meanBlackL: +avg('blackL').toFixed(1), meanWhiteL: +avg('whiteL').toFixed(1), meanSaturation: +avg('saturation').toFixed(2), meanPureBlack: +avg('pureBlack').toFixed(3), meanPureWhite: +avg('pureWhite').toFixed(3), spec: gradeSpec };
    }

    const covered = new Map(); // one line per chrome + text, with the frames it happens in
    for (const s of shots) for (const c of s.chromeOverText || []) {
      const key = `${c.chrome}|${c.text}`;
      if (!covered.has(key)) covered.set(key, { ...c, frames: [] });
      covered.get(key).frames.push(s.label);
    }
    [...covered.values()].slice(0, 8).forEach((c) => issues.push({ kind: 'chrome-over-text', text: `${c.frames.slice(0, 3).join(', ')}${c.frames.length > 3 ? ` (+${c.frames.length - 3})` : ''}: ${c.chrome} ${c.why} — "${c.text}". Give the chrome a ground, or keep clearance under it.` }));
    if (covered.size > 8) issues.push({ kind: 'chrome-over-text', text: `…and ${covered.size - 8} more chrome / text pairs (report.json → frames[].chromeOverText)` });

    const measured = {};
    for (const s of shots) if (s.changeFromPrevious !== undefined) measured[s.scene] = +((measured[s.scene] || 0) + s.changeFromPrevious).toFixed(1);
    report.viewports[tag] = { simulatedBrowserBar: bar, measuredChange: measured, viewport: vp.viewport, usesReel: info.reel, scenes: info.scenes.map((s) => s.name), contactSheet: sheetFile, frames: shots, focusWalk: focusRun, issues, ...(gradeSummary ? { grade: gradeSummary } : {}) };
    console.log(`\n[${tag}] ${shots.length} frames → ${path.join(out, sheetFile)}`);
    if (!info.reel) console.log('  (no window.__reel: shot at even scroll positions, not per scene)');
    if (Object.keys(measured).length) console.log('  measured change per pinned scene (compare with the Energy column): ' + Object.entries(measured).map(([k, v]) => `${k} ${v}`).join(' · '));
    if (gradeSummary) console.log(`  grade (${gradeSummary.from}): ${gradeSummary.framesChecked} frames, ${gradeSummary.framesFlagged} flagged · palette ${gradeSummary.meanMatch !== null ? `match ${Math.round(gradeSummary.meanMatch * 100)}%` : `coverage ${Math.round(gradeSummary.meanCoverage * 100)}%`} · black L* ${gradeSummary.meanBlackL} · white L* ${gradeSummary.meanWhiteL} · saturation ${gradeSummary.meanSaturation} · pure #000 ${(gradeSummary.meanPureBlack * 100).toFixed(1)}% / #fff ${(gradeSummary.meanPureWhite * 100).toFixed(1)}%`);
    for (const it of issues) console.log(`  ! ${it.kind}: ${it.text}`);
    if (!issues.length) console.log('  no mechanical issues found (this says nothing yet about whether it is good — look at the sheet)');
    await context.close();
  }
} finally {
  await browser.close();
  target.close();
}

const reportFile = path.join(out, 'report.json'); // merge with earlier runs: one report for every viewport and cut screened
try { const prev = JSON.parse(fs.readFileSync(reportFile, 'utf8')); if (prev.target === report.target) report.viewports = { ...prev.viewports, ...report.viewports }; } catch {}
fs.writeFileSync(reportFile, JSON.stringify(report, null, 2));
console.log(`\nreport → ${path.join(out, 'report.json')}`);
