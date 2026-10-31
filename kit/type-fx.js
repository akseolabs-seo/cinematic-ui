/* type-fx.js — type that performs.  Cinematic UI kit.
 *
 * Forty-four type moves (文字動畫 44 種) for sites and films, as one small ES module with no dependencies:
 * DOM, CSS, inline SVG and (for the LED board) canvas-2D. No GSAP, no Three.
 *
 *   import { typeFx, EFFECTS } from './type-fx.js';
 *   const fx = typeFx(el, 'stamp', { colors: ['#d8261c'] });
 *   main.fromTo(fx, { p: 0 }, { p: 1, duration: 0.4 }, 0.1);        // site: scrubbed by the reel
 *   reel.onFrame((f) => { fx.t = f.time; });                         // continuous effects
 *   tl.fromTo(fx, { p: 0 }, { p: 1, duration: beat(2) }, beat(1));   // film: keyed on the beat
 *   film.onFrame((t) => { fx.t = t; });
 *
 * Every frame is a pure function of (p, t, options, seed): no clock, no Math.random, no rAF of its own.
 *   p  0–1  the entrance, or the transition through `text` (an array) for switch effects
 *   t  s    time, for continuous effects (marquees, tunnels, orbits) and idle details (a caret)
 * The element keeps its words: the real text lives in a visually-hidden span; everything drawn is
 * aria-hidden decoration. Before JS (and after destroy()) the element is its own plain text.
 * With prefers-reduced-motion every frame is the rest pose (fx.still()); pass { reduced: false } in film mode.
 *
 * Field effects (meta.field) fill their element's box: give it a size. The others set inline and take
 * the element's font-size; pass { fit: true } to size the type to the element's box instead.
 */

let UID = 0;
export const FONT = '"Noto Sans TC","PingFang TC","Microsoft JhengHei","Hiragino Sans","Noto Sans CJK TC","Source Han Sans TC",system-ui,sans-serif';
/** Page-wide options, set once with typeFx.defaults({ font: 'inherit', weight: 'inherit' }). */
const DEFAULTS = {};

/** Deterministic random (same generator as stage.js, copied so this module needs no Three). */
export function seeded(seed = 1) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
/** Stateless hash → [0, 1): a random value addressed by integers, for stepped effects (glitch). */
function hash(a, b = 0, s = 0) {
  let x = (Math.imul(a | 0, 374761393) + Math.imul(b | 0, 668265263) + Math.imul(s | 0, 1442695041)) | 0;
  x = Math.imul(x ^ (x >>> 13), 1274126177); x ^= x >>> 16;
  return (x >>> 0) / 4294967296;
}

/* ---------------- maths ---------------- */
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a, b, k) => a + (b - a) * k;
const seg = (p, a, b) => clamp((p - a) / (b - a));
const frac = (x) => x - Math.floor(x);
const TAU = Math.PI * 2;
const E = {
  out2: (k) => 1 - (1 - k) ** 2, out3: (k) => 1 - (1 - k) ** 3, out4: (k) => 1 - (1 - k) ** 4,
  in2: (k) => k * k, in3: (k) => k * k * k,
  inOut2: (k) => (k < 0.5 ? 2 * k * k : 1 - (-2 * k + 2) ** 2 / 2),
  inOut3: (k) => (k < 0.5 ? 4 * k ** 3 : 1 - (-2 * k + 2) ** 3 / 2),
  expoOut: (k) => (k >= 1 ? 1 : 1 - 2 ** (-10 * k)),
  backOut: (k, s = 1.70158) => (k <= 0 ? 0 : 1 + (s + 1) * (k - 1) ** 3 + s * (k - 1) ** 2),
  /** damped spring that lands exactly on 1 at k = 1 */
  spring: (k, f = 2.5, d = 4) => (k <= 0 ? 0 : k >= 1 ? 1 : 1 - Math.exp(-d * k) * Math.cos(f * TAU * k) * (1 - k)),
};
const n4 = (v) => +v.toFixed(4);

/* ---------------- text ---------------- */
const SEG = typeof Intl !== 'undefined' && Intl.Segmenter ? new Intl.Segmenter(undefined, { granularity: 'grapheme' }) : null;
/** Split into user-perceived characters (keeps emoji and combining marks whole). */
export function graphemes(s) { return SEG ? [...SEG.segment(String(s))].map((x) => x.segment) : Array.from(String(s)); }
const CJK = /[⺀-⿿　-〿぀-ヿ㄀-ㇿ㐀-䶿一-鿿가-힯豈-﫿＀-￯]/;
export const isCJK = (s) => CJK.test(s);
/** Rough advance width in em for heavy display type (layout estimates only — never for drawing). */
export function emw(s) {
  let w = 0;
  for (const g of graphemes(s)) w += CJK.test(g) ? 1 : g === ' ' ? 0.3 : /[MW@%]/.test(g) ? 0.9 : /[A-Z0-9#&]/.test(g) ? 0.7 : /[.,:;'!|ilIj]/.test(g) ? 0.32 : 0.6;
  return w;
}
/** Tokens for splitting: CJK always per character; Latin per character, or per word with by: 'word'. Spaces kept. */
export function tokens(s, by = 'char') {
  const out = [];
  let word = '';
  const flush = () => { if (word) { out.push({ t: word, space: false }); word = ''; } };
  for (const g of graphemes(s)) {
    if (/\s/.test(g)) { flush(); out.push({ t: g === '\n' ? '\n' : ' ', space: true }); }
    else if (by === 'word' && !CJK.test(g)) word += g;
    else { flush(); out.push({ t: g, space: false }); }
  }
  flush();
  return out;
}
const lines = (s) => String(s).split(/\n/).map((x) => x.trim()).filter(Boolean);
/** A line of text split into spans; returns the non-space spans. */
function split(parent, s, by = 'char', cls = 'tfx-c') {
  const parts = [];
  for (const tk of tokens(s, by)) {
    if (tk.space) { parent.append(tk.t === '\n' ? h('br') : h('span', 'tfx-s', null, ' ')); continue; }
    const e = h('span', cls, null, tk.t); parent.append(e); parts.push(e);
  }
  return parts;
}

/* ---------------- DOM ---------------- */
function h(tag, cls, css, text) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (css) e.style.cssText = css;
  if (text != null) e.textContent = text;
  return e;
}
const SVGNS = 'http://www.w3.org/2000/svg';
function s(tag, attrs = {}, parent) {
  const e = document.createElementNS(SVGNS, tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  if (parent) parent.append(e);
  return e;
}
const CSS = `
.tfx-sr{position:absolute!important;width:1px!important;height:1px!important;margin:-1px!important;padding:0!important;border:0!important;overflow:hidden!important;clip:rect(0 0 0 0);clip-path:inset(50%);white-space:nowrap}
.tfx-stage{position:relative;display:inline-block;white-space:nowrap;font-synthesis:none;-webkit-font-smoothing:antialiased}
.tfx-field>.tfx-stage{position:absolute;inset:0;display:block;overflow:hidden}
.tfx-fit{display:grid!important;place-items:center}
.tfx-c{display:inline-block;white-space:pre}
.tfx-s{white-space:pre}
.tfx-g{display:inline-grid;vertical-align:top}.tfx-g>*{grid-area:1/1}
.tfx-hide{visibility:hidden}
.tfx-row{display:flex;width:max-content;white-space:pre}.tfx-row>span{flex:none}
.tfx-col{display:flex;flex-direction:column;height:max-content}.tfx-col>span{flex:none}
.tfx-v>span{writing-mode:vertical-rl;text-orientation:mixed;white-space:pre}
.tfx-at{position:absolute;left:50%;top:50%;white-space:pre}
.tfx svg{overflow:visible}
`;
function injectCSS() {
  if (document.getElementById('tfx-css')) return;
  const st = h('style'); st.id = 'tfx-css'; st.textContent = CSS; document.head.append(st);
}
/** A horizontal marquee track of n identical copies; slide() moves it by a fraction of one copy, seamlessly. */
function marquee(parent, copy, n, css = '', cls = 'tfx-row') {
  const row = h('div', cls, css);
  for (let i = 0; i < n; i++) row.append(h('span', '', null, copy));
  parent.append(row);
  return row;
}
function slideX(row, f, n, dir = 1) { const ff = dir > 0 ? frac(f) : 1 - frac(f); row.style.transform = `translate3d(${n4(-ff * 100 / n)}%,0,0)`; }
function slideY(col, f, n, dir = 1) { const ff = dir > 0 ? frac(f) : 1 - frac(f); col.style.transform = `translate3d(0,${n4(-ff * 100 / n)}%,0)`; }
const copiesFor = (span, copyPx) => Math.max(3, Math.ceil(span / Math.max(1, copyPx)) + 2);
/** Continuous effects arrive by a wipe unless they define their own entrance. */
function wipeIn(c, p) { c.stage.style.clipPath = p >= 1 ? '' : `inset(0 ${n4((1 - E.inOut2(clamp(p))) * 100)}% 0 0)`; }

/* ---------------- registry ---------------- */
/** Metadata for every effect, keyed by id: { id, n, zh, en, family, kind, field, use, mood, avoid }. */
export const EFFECTS = {};
const IMPL = {};
function def(meta, impl) { EFFECTS[meta.id] = Object.freeze({ field: false, ...meta }); IMPL[meta.id] = impl; }
export const FAMILIES = {
  impact: { zh: '衝擊', en: 'Impact', color: '#ff5a4e', note: 'one word changes the whole atmosphere' },
  flow: { zh: '流動', en: 'Flow', color: '#ffc928', note: 'text keeps moving' },
  '3d': { zh: '立體', en: '3D', color: '#1fb5a6', note: 'walk into the space of text' },
  switch: { zh: '切換', en: 'Switch', color: '#7b5cff', note: 'make the change interesting' },
  style: { zh: '風格', en: 'Style', color: '#ff8a2b', note: 'raise the texture' },
  award: { zh: '得獎', en: 'Award', color: '#141414', note: 'restraint, from Site-of-the-Month winners' },
};

/** For switch effects: which text is leaving (i, −1 = blank), which arrives (j), and how far (k 0–1). */
function sw(c, p, t) {
  const n = c.texts.length, hold = c.o.hold ?? 0.3;
  const hk = (u) => clamp((u - hold) / (1 - hold));
  if (c.o.loop > 0) {               // cycle by time instead: loop = seconds per text
    const pos = t / c.o.loop, i = Math.floor(pos);
    if (n === 1) return { i: -1, j: 0, k: hk(frac(pos)) };
    return { i: ((i % n) + n) % n, j: (((i + 1) % n) + n) % n, k: hk(frac(pos)) };
  }
  if (n === 1) return { i: -1, j: 0, k: clamp(p) };
  const pos = clamp(p) * (n - 1), i = Math.floor(pos);
  if (i >= n - 1) return { i: n - 1, j: n - 1, k: 0 };
  return { i, j: i + 1, k: hk(pos - i) };
}
const G = (c, i) => (i < 0 ? [] : c.G[i]);
const T = (c, i) => (i < 0 ? '' : c.texts[i]);

/* =====================================================================================================
 * The core
 * ===================================================================================================== */
export function typeFx(el, id, options = {}) {
  const impl = IMPL[id], meta = EFFECTS[id];
  if (!impl) throw new Error(`type-fx: unknown effect "${id}". Known: ${Object.keys(EFFECTS).join(', ')}`);
  injectCSS();
  const saved = { html: el.innerHTML, style: el.getAttribute('style'), cls: el.getAttribute('class') };
  const raw = options.text ?? el.textContent.replace(/[ \t]+/g, ' ').trim();
  const texts = (Array.isArray(raw) ? raw : [raw]).map(String);
  const o = { seed: 1, speed: 1, by: 'char', ...(meta.defaults || {}), ...DEFAULTS, ...options };
  const mq = typeof matchMedia === 'function' ? matchMedia('(prefers-reduced-motion: reduce)') : null;
  const reduced = () => (o.reduced ?? mq?.matches) === true;

  el.classList.add('tfx', `tfx-${id}`);
  if (meta.field) {
    el.classList.add('tfx-field');
    if (getComputedStyle(el).position === 'static') el.style.position = 'relative';
    el.style.overflow = 'hidden';
  } else if (o.fit) el.classList.add('tfx-fit');
  el.textContent = '';
  const sr = h('span', 'tfx-sr', null, texts.map((x) => x.replace(/\n/g, ' ')).filter(Boolean).join(' / '));
  const stage = h('span', 'tfx-stage');
  stage.setAttribute('aria-hidden', 'true');
  el.append(sr, stage);

  const cs = getComputedStyle(el);
  // 'inherit' resolves to the element's own computed face, so canvas and SVG drawing use it too
  const baseStyle = () => {
    c.family = o.font === 'inherit' ? cs.fontFamily : (o.font || FONT);
    c.weight = o.weight === 'inherit' ? cs.fontWeight : (o.weight ?? 900);
    stage.removeAttribute('style');
    stage.style.fontFamily = c.family;
    stage.style.fontWeight = c.weight;
    if (o.leading) stage.style.lineHeight = o.leading;
    else if (!meta.field) stage.style.lineHeight = '1.15';
  };

  const ink = cs.color;
  const col = [o.colors?.[0] ?? ink, o.colors?.[1] ?? '#ff5a4e', o.colors?.[2] ?? '#ffffff', ...(o.colors?.slice(3) || [])];
  // markup: the element's own inline markup, for effects that keep it (highlighter); null once text is given
  const c = { el, stage, texts, text: texts[0], G: texts.map(graphemes), o, meta, col, family: '', weight: '', W: 0, H: 0, fs: 0, rand: seeded(o.seed), markup: options.text == null ? saved.html : null };
  c.font = (px) => `${c.weight} ${px}px ${c.family}`;
  // The screen-reader text. A switch exposes the one text a visitor sees at this p (the leaving text until
  // the change is half done, then the arriving one; at rest, the last); everything else reads all its texts once.
  const clean = (x) => x.replace(/\n/g, ' ').trim();
  const srText = (pp, tt) => {
    const own = impl.sr?.(c, pp, tt);
    if (own != null) return clean(own);
    if (meta.kind !== 'switch' || texts.length < 2) return texts.map(clean).filter(Boolean).join(' / ');
    const { i, j, k } = sw(c, pp, tt);
    return clean(T(c, k >= 0.5 || i < 0 ? j : i)) || clean(T(c, j)) || texts.map(clean).find(Boolean) || '';
  };

  let p = 1, t = 0, size = '';
  function measure() {
    const r = el.getBoundingClientRect();
    c.W = r.width; c.H = r.height;
    if (meta.field || o.fit) {
      const longest = Math.max(...texts.flatMap((x) => lines(x).map(emw)), 0.5);
      const nl = Math.max(...texts.map((x) => lines(x).length), 1);
      const [fh, fw] = meta.fitRatio || [0.42, 0.84];
      c.fs = impl.fit ? impl.fit(c) : Math.max(6, Math.min((c.H * fh) / nl, (c.W * fw) / longest));
      if (o.size) c.fs = typeof o.size === 'number' ? o.size : parseFloat(o.size);
      stage.style.fontSize = `${c.fs}px`;
    } else c.fs = parseFloat(cs.fontSize) || 16;
    return `${Math.round(c.W)}x${Math.round(c.H)}`;
  }
  function build() {
    baseStyle();
    size = measure();
    stage.textContent = '';
    c.rand = seeded(o.seed);
    impl.build(c);
  }
  const stillT = () => (typeof meta.stillT === 'function' ? meta.stillT(c) : (o.stillT ?? meta.stillT ?? 0));
  function render() {
    const rp = reduced() ? 1 : clamp(p), rt = reduced() ? stillT() : t;
    impl.frame(c, rp, rt);
    const v = srText(rp, rt);
    if (sr.textContent !== v) sr.textContent = v;
    return fx;
  }

  build();
  let ro = null;
  if (typeof ResizeObserver === 'function') {
    ro = new ResizeObserver(() => { const r = el.getBoundingClientRect(); if (`${Math.round(r.width)}x${Math.round(r.height)}` !== size) { build(); render(); } });
    ro.observe(el);
  }
  // Canvas- and SVG-measured effects depend on the face being loaded.
  if (document.fonts && document.fonts.status !== 'loaded') document.fonts.ready.then(() => { if (!c.dead) { build(); render(); } });
  const onMq = () => render();
  mq?.addEventListener?.('change', onMq);

  const fx = {
    id, meta, el,
    get p() { return p; }, set p(v) { p = +v; render(); },
    get t() { return t; }, set t(v) { t = +v; render(); },
    get reduced() { return reduced(); },
    /** Set both at once (one render). */
    set(np, nt) { if (np != null) p = +np; if (nt != null) t = +nt; return render(); },
    render,
    /** The rest pose: finished, legible; what reduced motion shows. */
    still() { p = 1; t = stillT(); return render(); },
    /** Rebuild after changing options or text in place: fx.rebuild({ text: [...] }) */
    rebuild(next = {}) { Object.assign(o, next); if (next.colors) c.col.splice(0, c.col.length, next.colors[0] ?? ink, next.colors[1] ?? '#ff5a4e', next.colors[2] ?? '#ffffff', ...next.colors.slice(3)); if (next.text) { const a = Array.isArray(next.text) ? next.text : [next.text]; texts.splice(0, texts.length, ...a.map(String)); c.text = texts[0]; c.G = texts.map(graphemes); c.markup = null; } build(); return render(); },
    /** State-bound value, for effects that show a number (odometer): set it and p is ignored; null hands back to p. */
    get value() { return o.value ?? null; }, set value(v) { o.value = v == null ? null : +v; render(); },
    destroy() {
      c.dead = true; ro?.disconnect(); mq?.removeEventListener?.('change', onMq); if (el.__typeFx === fx) delete el.__typeFx;
      el.innerHTML = saved.html;
      if (saved.style == null) el.removeAttribute('style'); else el.setAttribute('style', saved.style);
      if (saved.cls == null) el.removeAttribute('class'); else el.setAttribute('class', saved.cls);
    },
  };
  // reachable from its element (so an editor can change the words and rebuild); scripted = the words came from options.text
  fx.scripted = options.text != null;
  Object.defineProperty(fx, 'texts', { get: () => [...texts] });
  Object.defineProperty(el, '__typeFx', { value: fx, configurable: true, writable: true });
  render();
  return fx;
}
/**
 * Page-wide defaults for every effect made after the call: typeFx.defaults({ font: 'inherit', weight: 'inherit' }).
 * They sit above each effect's own defaults and below the options passed to typeFx(). null or undefined
 * clears a key. Returns a copy of the current defaults; typeFx.defaults() just reads them.
 */
typeFx.defaults = (next = {}) => {
  for (const k in next) { if (next[k] == null) delete DEFAULTS[k]; else DEFAULTS[k] = next[k]; }
  return { ...DEFAULTS };
};

/* =====================================================================================================
 * 衝擊 IMPACT — one word changes the atmosphere
 * ===================================================================================================== */

// colors: [ink, spikes/flash]
def({ id: 'burst', n: 1, zh: '文字爆發', en: 'Burst', family: 'impact', kind: 'entrance', fitRatio: [0.4, 0.62],
  use: 'The climax hit: the one word the whole film has been building to lands like a detonation.',
  mood: 'strong / climax', avoid: 'Every headline exploding; a burst with no build-up before it has nothing to release.' }, {
  build(c) {
    const st = c.stage;
    c.flash = h('span', '', `position:absolute;left:50%;top:50%;width:1em;height:1em;margin:-.5em;border-radius:50%;background:${c.col[1]}`);
    c.ring = h('span', '', 'position:absolute;left:50%;top:50%;width:0;height:0');
    st.append(c.flash, c.ring);
    const word = h('span', '', `position:relative;color:${c.col[0]}`);
    st.append(word);
    c.chars = split(word, c.text, c.o.by);
    const wem = emw(c.text);
    c.rx = wem / 2 + 0.34; c.ry = 0.86;
    c.spikes = [];
    const N = 16;
    for (let i = 0; i < N; i++) {
      const a = (i / N) * TAU + (c.rand() - 0.5) * 0.25;
      const e = h('i', '', `position:absolute;left:0;top:0;height:.07em;width:1em;margin-top:-.035em;border-radius:.04em;background:${c.col[1]};transform-origin:0 50%`);
      c.ring.append(e);
      c.spikes.push({ e, a, l: 0.7 + c.rand() * 0.5 });
    }
    c.rot = c.chars.map(() => (c.rand() - 0.5) * 40);
  },
  frame(c, p) {
    const n = c.chars.length, mid = (n - 1) / 2;
    c.chars.forEach((e, i) => {
      const d = (Math.abs(i - mid) / Math.max(1, mid)) * 0.12;
      const k = seg(p, d, d + 0.42);
      e.style.opacity = k > 0 ? 1 : 0;
      e.style.transform = `scale(${n4(E.backOut(k, 2.8))}) rotate(${n4(c.rot[i] * (1 - E.out3(k)))}deg)`;
    });
    const fk = seg(p, 0.02, 0.4);
    c.flash.style.opacity = fk > 0 && fk < 1 ? n4(0.9 * (1 - fk)) : 0;
    c.flash.style.transform = `scale(${n4(0.2 + E.expoOut(fk) * (c.rx * 2.6))})`;
    const out = E.expoOut(seg(p, 0.04, 0.32)), settle = E.out3(seg(p, 0.32, 0.85));
    for (const sp of c.spikes) {
      const len = lerp(lerp(0.05, sp.l * 1.1, out), sp.l * 0.34, settle);
      const r = lerp(0.35, lerp(1.25, 1, settle), out);
      const x = Math.cos(sp.a) * c.rx * r, y = Math.sin(sp.a) * c.ry * r;
      sp.e.style.opacity = out > 0 ? 1 : 0;
      sp.e.style.transform = `translate(${n4(x)}em,${n4(y)}em) rotate(${n4(Math.atan2(Math.sin(sp.a) * c.ry, Math.cos(sp.a) * c.rx) * 180 / Math.PI)}deg) scaleX(${n4(len)})`;
    }
  },
});

// texts: the words cycled; cards: [{ bg, fg }] — the full-bleed colour card each word sits on
def({ id: 'char-swap', n: 2, zh: '逐字切換', en: 'Char swap', family: 'impact', kind: 'switch', field: true, fitRatio: [0.36, 0.8],
  use: 'Lyrics and rhythm: words change one character per beat, the whole card cutting colour with them.',
  mood: 'rhythm / lyrics', avoid: 'Swapping off the beat; a smooth crossfade instead of hard cuts (then it is just a fade).' }, {
  build(c) {
    const cards = c.o.cards || [{ bg: '#ff5a4e', fg: '#fff' }, { bg: '#111', fg: '#ffd23f' }, { bg: '#ffd23f', fg: '#111' }];
    c.cards = cards;
    c.stage.style.cssText += ';display:grid;place-items:center';
    const line = h('span', '', 'display:inline-flex;gap:.02em');
    c.stage.append(line);
    const L = Math.max(...c.G.map((g) => g.length));
    c.cells = Array.from({ length: L }, () => { const e = h('span', 'tfx-c', 'text-align:center'); line.append(e); return e; });
  },
  frame(c, p, t) {
    const { i, j, k } = sw(c, p, t);
    const from = G(c, i), to = G(c, j), L = c.cells.length;
    const m = Math.min(L, Math.floor(k * (L + 1)));
    const card = c.cards[(k > 0 || i < 0 ? j : i) % c.cards.length];
    c.stage.style.background = card.bg; c.stage.style.color = card.fg;
    const local = k * (L + 1) - m;
    c.cells.forEach((e, q) => {
      const ch = q < m ? to[q] : from[q];
      const v = ch ?? '';
      if (e.textContent !== v) e.textContent = v;
      e.style.display = v ? '' : 'none';
      e.style.transform = q === m - 1 && k < 1 ? `scale(${n4(lerp(1.28, 1, E.out3(clamp(local * 1.6))))})` : '';
    });
  },
});

// colors: [ink (the seal colour)]. angle: the stamp's rest rotation
def({ id: 'stamp', n: 3, zh: '印章效果', en: 'Stamp', family: 'impact', kind: 'entrance', defaults: { angle: -8 }, fitRatio: [0.36, 0.62],
  use: 'A decision made: approved, confirmed, sold out, launched. The seal comes down once, with weight.',
  mood: 'announce / confirmed', avoid: 'Stamping things that were never in doubt; more than one stamp per page.' }, {
  build(c) {
    const id = `tfx-ink-${++UID}`;
    const svg = s('svg', { width: 0, height: 0, style: 'position:absolute' }, c.stage);
    const f = s('filter', { id, x: '-15%', y: '-15%', width: '130%', height: '130%' }, s('defs', {}, svg));
    s('feTurbulence', { type: 'fractalNoise', baseFrequency: '0.85', numOctaves: 2, seed: c.o.seed, result: 'n' }, f);
    s('feColorMatrix', { in: 'n', type: 'matrix', values: '0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -3.2 0 0 0 2.55', result: 'm' }, f);
    s('feComposite', { in: 'SourceGraphic', in2: 'm', operator: 'in', result: 'x' }, f);
    s('feTurbulence', { type: 'fractalNoise', baseFrequency: '0.035', numOctaves: 2, seed: c.o.seed + 7, result: 'w' }, f);
    s('feDisplacementMap', { in: 'x', in2: 'w', scale: 4, xChannelSelector: 'R', yChannelSelector: 'G' }, f);
    const ink = c.col[0];
    c.box = h('span', '', `display:inline-block;position:relative;color:${ink};border:.085em solid ${ink};border-radius:.1em;padding:.06em .26em .1em;outline:.03em solid ${ink};outline-offset:-.17em;letter-spacing:.04em;filter:url(#${id})`, c.text);
    c.halo = h('span', '', `position:absolute;inset:-.06em;border:.04em solid ${ink};border-radius:.14em`);
    c.box.append(c.halo);
    c.stage.append(c.box);
  },
  frame(c, p) {
    const k1 = seg(p, 0, 0.3), k2 = seg(p, 0.3, 0.62);
    const sc = k1 < 1 ? lerp(3.4, 0.9, E.in3(k1)) : lerp(0.9, 1, E.backOut(k2, 2.2));
    const rot = lerp(c.o.angle - 18, c.o.angle, E.out2(k1));
    const shake = Math.sin(k2 * 38) * (1 - k2) * 0.035 * (k1 >= 1 ? 1 : 0);
    c.box.style.opacity = k1 > 0 ? n4(Math.min(1, k1 * 3)) : 0;
    c.box.style.transform = `translate(${n4(shake)}em,${n4(-shake * 0.6)}em) rotate(${n4(rot)}deg) scale(${n4(sc)})`;
    c.halo.style.opacity = k1 >= 1 && k2 < 1 ? n4(0.6 * (1 - k2)) : 0;
    c.halo.style.transform = `scale(${n4(1 + E.out2(k2) * 0.18)})`;
  },
});

// colors: [ink, ghost outline]
def({ id: 'impact-zoom', n: 4, zh: '衝擊縮放', en: 'Impact zoom', family: 'impact', kind: 'entrance', fitRatio: [0.38, 0.66],
  use: 'The opening title or the word that must be heard: it rushes in from far away and its echoes keep ringing.',
  mood: 'open / emphasis', avoid: 'Zooming body copy; afterimages so strong the word itself stops reading.' }, {
  build(c) {
    c.st = c.stage; c.st.classList.add('tfx-g');
    c.ghosts = [];
    for (let g = 4; g >= 1; g--) {
      const e = h('span', '', `-webkit-text-stroke:.022em ${c.col[1]};color:transparent`, c.text);
      c.st.append(e); c.ghosts[g] = e;
    }
    c.main = h('span', '', `color:${c.col[0]};position:relative`, c.text);
    c.st.append(c.main);
  },
  frame(c, p) {
    const zoom = (k) => Math.exp(lerp(Math.log(0.025), 0, E.out4(k)));
    const k = seg(p, 0, 0.55), settle = E.out2(seg(p, 0.5, 1));
    c.main.style.opacity = k > 0 ? n4(Math.min(1, k * 5)) : 0;
    c.main.style.transform = `scale(${n4(zoom(k))})`;
    for (let g = 1; g <= 4; g++) {
      const kg = seg(p, 0.05 * g, 0.55 + 0.05 * g);
      const e = c.ghosts[g];
      e.style.opacity = kg > 0 ? n4((0.75 - g * 0.13) * lerp(1, 0.55, settle)) : 0;
      e.style.color = settle < 1 ? `color-mix(in srgb, ${c.col[1]} ${n4((1 - settle) * 55)}%, transparent)` : 'transparent';
      e.style.transform = `scale(${n4(zoom(kg) * (1 + 0.07 * g * settle))})`;
    }
  },
});

// text: lines split by "\n" (or at ・ / spaces). colors: [ink, band, band text, third ink]. sizes: em per line
def({ id: 'stack', n: 5, zh: '動態堆疊', en: 'Stack', family: 'impact', kind: 'entrance', defaults: { sizes: [1.1, 0.78, 1.3, 0.72, 1] },
  use: 'The MV or opening title card: lines fly in and lock together into one composed block.',
  mood: 'MV / opening', avoid: 'Stacking a sentence that should be read as one line; random sizes with no hierarchy.' }, {
  fit(c) {
    const L = (c.lines = linesOf(c.text)), sz = c.o.sizes;
    const wmax = Math.max(...L.map((l, i) => emw(l) * sz[i % sz.length]));
    const hsum = L.reduce((a, l, i) => a + sz[i % sz.length] * 1.2, 0);
    return Math.min((c.H * 0.84) / hsum, (c.W * 0.82) / wmax);
  },
  build(c) {
    c.stage.style.cssText += ';display:inline-flex;flex-direction:column;align-items:flex-start;gap:.06em;line-height:1.1';
    const sz = c.o.sizes, col = c.col;
    c.lines = linesOf(c.text);
    c.rows = c.lines.map((l, i) => {
      const style = i % 3;
      const css = style === 1 ? `background:${col[1]};color:${col[2]};padding:.02em .16em` : `color:${style === 2 ? (col[3] ?? col[1]) : col[0]}`;
      const e = h('span', '', `display:block;font-size:${sz[i % sz.length]}em;${css}`, l);
      c.stage.append(e);
      return e;
    });
  },
  frame(c, p) {
    const n = c.rows.length, d = 0.62 / Math.max(1, n);
    c.rows.forEach((e, i) => {
      const k = seg(p, i * d, i * d + 0.38), side = i % 2 ? 1 : -1;
      e.style.opacity = k > 0 ? 1 : 0;
      e.style.transform = `translateX(${n4(side * (1 - E.backOut(k, 1.25)) * 130)}%) rotate(${n4(side * (1 - E.out3(k)) * -9)}deg)`;
    });
  },
});
/** Inline padding in em: the pad option, else 0 for text that is all CJK (it would indent it against the lines around it), else .1. */
const padOf = (c) => (c.o.pad != null ? +c.o.pad : c.G.flat().every((g) => isCJK(g) || /^[\s\p{P}]$/u.test(g)) ? 0 : 0.1);
const linesOf = (t) => { const l = lines(t); if (l.length > 1) return l; const parts = t.split(/(?<=・)|\s+/).map((x) => x.trim()).filter(Boolean); return parts.length > 1 ? parts : [t]; };

// colors: [ink]
def({ id: 'stretch', n: 6, zh: '彈性拉伸', en: 'Stretch', family: 'impact', kind: 'entrance', fitRatio: [0.4, 0.7],
  use: 'A lively product or a playful brand: each character springs up from the baseline and wobbles to rest.',
  mood: 'lively / impact', avoid: 'On anything that should feel heavy, precise or expensive; elastic is a personality.' }, {
  build(c) {
    const word = h('span', '', `color:${c.col[0]}`); c.stage.append(word);
    c.chars = split(word, c.text, c.o.by);
    c.chars.forEach((e) => { e.style.transformOrigin = '50% 88%'; });
  },
  frame(c, p) {
    const n = c.chars.length, st = 0.5 / Math.max(1, n);
    c.chars.forEach((e, i) => {
      const k = seg(p, i * st, i * st + 0.5);
      const g = E.out3(seg(k, 0, 0.22)), u = seg(k, 0.12, 1);
      const sy = Math.max(0.02, g * (1 + 0.6 * Math.sin(u * Math.PI * 3) * (1 - u) ** 1.4));
      const sx = 1 + (1 - sy) * 0.5;
      e.style.opacity = k > 0 ? 1 : 0;
      e.style.transform = `scale(${n4(clamp(sx, 0.6, 1.5))},${n4(sy)})`;
    });
  },
});

// text: [this word, next scene's word]. colors: [window / next ground, next word]. ground: this scene's ground
def({ id: 'fly-through', n: 7, zh: '穿越文字', en: 'Fly-through', family: 'impact', kind: 'switch', field: true, fitRatio: [0.5, 0.8],
  use: 'A transition with speed: the camera dives into a letter and the letter becomes the next scene.',
  mood: 'transition / speed', avoid: 'Using it for every scene change; diving into thin type, where the window never opens.' }, {
  build(c) {
    const W = c.W, H = c.H, A = c.texts[0], B = c.texts[1] ?? c.texts[0];
    const F = Math.min(H * 0.56, (W * 0.84) / emw(A));
    const FB = Math.min(H * 0.34, (W * 0.8) / emw(B));
    const by = H / 2 + F * 0.36;
    const id = `tfx-fly-${++UID}`;
    const svg = s('svg', { viewBox: `0 0 ${W} ${H}`, width: '100%', height: '100%', style: 'position:absolute;inset:0' }, c.stage);
    const defs = s('defs', {}, svg);
    const mask = s('mask', { id, maskUnits: 'userSpaceOnUse', x: 0, y: 0, width: W, height: H }, defs);
    c.zoom = s('g', {}, mask);
    const ft = `font-family:${c.family.replace(/"/g, "'")};font-weight:${c.weight}`;
    s('text', { x: W / 2, y: by, 'text-anchor': 'middle', 'font-size': F, fill: '#fff', style: ft }, c.zoom).textContent = A;
    if (c.o.ground) s('rect', { width: W, height: H, fill: c.o.ground }, svg);
    c.next = s('g', { mask: `url(#${id})` }, svg);
    s('rect', { width: W, height: H, fill: c.col[0] }, c.next);
    c.word = s('text', { x: W / 2, y: H / 2 + FB * 0.36, 'text-anchor': 'middle', 'font-size': FB, fill: c.col[1], style: `${ft};transform-box:fill-box;transform-origin:center` }, c.next);
    c.word.textContent = B;
    c.maskId = id;
    // find the thickest point of the strokes, so the camera flies through ink, never into a counter
    const k = 0.5, cw = Math.max(2, Math.ceil(W * k)), ch = Math.max(2, Math.ceil(H * k));
    const cv = document.createElement('canvas'); cv.width = cw; cv.height = ch;
    const x = cv.getContext('2d', { willReadFrequently: true });
    x.font = c.font(F * k); x.textAlign = 'center'; x.textBaseline = 'alphabetic'; x.fillStyle = '#000';
    x.fillText(A, (W / 2) * k, by * k);
    const a = x.getImageData(0, 0, cw, ch).data, on = (q) => a[q * 4 + 3] > 140;
    const Lr = new Uint16Array(cw * ch), Rr = new Uint16Array(cw * ch), Ur = new Uint16Array(cw * ch), Dr = new Uint16Array(cw * ch);
    for (let yy = 0; yy < ch; yy++) for (let xx = 0; xx < cw; xx++) { const q = yy * cw + xx; if (on(q)) { Lr[q] = xx ? Lr[q - 1] + 1 : 1; Ur[q] = yy ? Ur[q - cw] + 1 : 1; } }
    for (let yy = ch - 1; yy >= 0; yy--) for (let xx = cw - 1; xx >= 0; xx--) { const q = yy * cw + xx; if (on(q)) { Rr[q] = xx < cw - 1 ? Rr[q + 1] + 1 : 1; Dr[q] = yy < ch - 1 ? Dr[q + cw] + 1 : 1; } }
    let best = 0, bx = cw / 2, byy = ch / 2;
    for (let q = 0; q < cw * ch; q++) {
      const v = Math.min(Lr[q], Rr[q], Ur[q], Dr[q]);
      if (v > best || (v === best && v > 0 && Math.abs((q % cw) - cw / 2) < Math.abs(bx - cw / 2))) { best = v; bx = q % cw; byy = Math.floor(q / cw); }
    }
    c.P = { x: bx / k, y: byy / k, r: Math.max(2, best / k) };
    c.smax = (Math.hypot(W, H) / c.P.r) * 1.15;
  },
  frame(c, p) {
    const W = c.W, H = c.H, k = seg(p, 0, 0.78);
    const sc = Math.exp(Math.log(c.smax) * E.in3(k));
    const m = E.inOut2(seg(k, 0, 0.7));
    const cx = lerp(c.P.x, W / 2, m), cy = lerp(c.P.y, H / 2, m);
    c.zoom.setAttribute('transform', `translate(${n4(cx)} ${n4(cy)}) scale(${n4(sc)}) translate(${n4(-c.P.x)} ${n4(-c.P.y)})`);
    if (p >= 0.8) c.next.removeAttribute('mask'); else c.next.setAttribute('mask', `url(#${c.maskId})`);
    const w = seg(p, 0.58, 0.95);
    c.word.style.opacity = n4(E.out2(w));
    c.word.style.transform = `scale(${n4(lerp(1.35, 1, E.out3(w)))})`;
  },
});

// texts: word groups to switch between. colors: [ink]
def({ id: 'squeeze', n: 8, zh: '擠壓變形', en: 'Squeeze', family: 'impact', kind: 'switch', fitRatio: [0.4, 0.66],
  use: 'An elastic switch between short word groups: the word is crushed flat and the next one springs out of it.',
  mood: 'elastic / switch', avoid: 'Long phrases (the squash reads as a glitch); serious subjects.' }, {
  build(c) {
    c.stage.classList.add('tfx-g');
    c.stage.style.color = c.col[0];
    for (const tx of c.texts) c.stage.append(h('span', 'tfx-hide', null, tx));
    c.a = h('span', '', 'transform-origin:50% 60%;justify-self:center'); c.b = h('span', '', 'transform-origin:50% 60%;justify-self:center');
    c.stage.append(c.a, c.b);
  },
  frame(c, p, t) {
    const { i, j, k } = sw(c, p, t);
    if (c.a.textContent !== T(c, i)) c.a.textContent = T(c, i);
    if (c.b.textContent !== T(c, j)) c.b.textContent = T(c, j);
    if (k < 0.45) {
      const u = E.in3(k / 0.45);
      c.a.style.opacity = 1; c.b.style.opacity = 0;
      c.a.style.transform = `scale(${n4(1 + 0.55 * u)},${n4(1 - 0.94 * u)})`;
    } else {
      const u = (k - 0.45) / 0.55;
      c.a.style.opacity = 0; c.b.style.opacity = 1;
      c.b.style.transform = `scale(${n4(lerp(1.55, 1, E.out3(u)))},${n4(lerp(0.06, 1, E.backOut(u, 3.2)))})`;
    }
  },
});

/* =====================================================================================================
 * 流動 FLOW — text keeps moving
 * ===================================================================================================== */

// colors: [giant ink, band, band text]. sub: the small marquee line (defaults to the text)
def({ id: 'giant-marquee', n: 9, zh: '巨字橫移', en: 'Giant marquee', family: 'flow', kind: 'continuous', field: true,
  use: 'Set dressing for a title or a section ground: a word too big for the frame drifts past, a ticker runs beneath it.',
  mood: 'background / title', avoid: 'The giant word as the only content of a hero; a marquee on every section.' }, {
  build(c) {
    const W = c.W, H = c.H, sep = isCJK(c.text) ? '　' : '  ';
    const F = H * 0.56, copy = c.text + sep;
    c.n1 = copiesFor(W, emw(copy) * F);
    c.big = marquee(c.stage, copy, c.n1, `position:absolute;left:0;top:${H * 0.1}px;font-size:${F}px;line-height:1;color:${c.col[0]}`);
    const fb = H * 0.075, sub = (c.o.sub ?? c.text) + '  ★  ';
    const band = h('div', '', `position:absolute;left:0;right:0;top:${H * 0.74}px;height:${fb * 1.7}px;background:${c.col[1]};overflow:hidden;display:flex;align-items:center`);
    c.stage.append(band);
    c.n2 = copiesFor(W, emw(sub) * fb);
    c.small = marquee(band, sub, c.n2, `font-size:${fb}px;line-height:1;color:${c.col[2]};font-weight:800`);
    c.r1 = (W * 0.06) / (emw(copy) * F); c.r2 = (W * 0.16) / (emw(sub) * fb);
  },
  frame(c, p, t) {
    const v = c.o.speed;
    slideX(c.big, t * c.r1 * v, c.n1, 1);
    slideX(c.small, t * c.r2 * v, c.n2, -1);
    wipeIn(c, p);
  },
});

// colors: [ink, alternate ink]. cols: column count
def({ id: 'vertical-counter', n: 10, zh: '直排逆向', en: 'Vertical counter-scroll', family: 'flow', kind: 'continuous', field: true, defaults: { weight: 700 },
  use: 'A quiet, vertical CJK ground: columns slide past each other in opposite directions, like rain or traffic at night.',
  mood: 'vertical / quiet', avoid: 'Latin text set sideways for decoration; columns so fast the quiet is lost.' }, {
  build(c) {
    const W = c.W, H = c.H;
    const cols = c.o.cols ?? Math.max(3, Math.min(7, Math.round((W / H) * 3)));
    const F = Math.min(W / (cols * 1.55), H * 0.16);
    const copy = c.text + (isCJK(c.text) ? '・' : ' · ');
    c.n = copiesFor(H, emw(copy) * F);
    c.cols = [];
    const wrap = h('div', '', 'position:absolute;inset:0;display:flex;justify-content:space-evenly;align-items:flex-start');
    c.stage.append(wrap);
    for (let i = 0; i < cols; i++) {
      const col = marquee(wrap, copy, c.n, `font-size:${F}px;line-height:1.1;color:${i % 2 ? c.col[1] : c.col[0]}`, 'tfx-col tfx-v');
      c.cols.push(col);
    }
    c.r = (H * 0.05) / (emw(copy) * F);
  },
  frame(c, p, t) {
    c.cols.forEach((col, i) => slideY(col, t * c.r * c.o.speed * (1 + (i % 3) * 0.12) + i * 0.37, c.n, i % 2 ? -1 : 1));
    wipeIn(c, p);
  },
});

// colors: [ink]. A grid of the text's characters; a wave of scale and weight runs across it
def({ id: 'wave-grid', n: 11, zh: '波浪排列', en: 'Wave grid', family: 'flow', kind: 'continuous', field: true,
  use: 'A patterned ground made of the word itself, for a section that needs texture without an image.',
  mood: 'background / pattern', avoid: 'Behind reading copy; as the hero when the word itself must be read.' }, {
  build(c) {
    const W = c.W, H = c.H, chars = c.G[0].filter((g) => g.trim());
    let cols = Math.round(Math.sqrt((c.o.cells ?? 160) * (W / H))), rows = Math.round(cols * (H / W));
    while (cols * rows > 400) { cols--; rows = Math.round(cols * (H / W)); }
    c.cols = cols; c.rows = rows;
    const cw = W / cols, rh = H / rows, F = Math.min(cw, rh) * 0.82;
    c.cells = [];
    for (let r = 0; r < rows; r++) for (let q = 0; q < cols; q++) {
      const e = h('span', '', `position:absolute;left:${n4((q + 0.5) * cw)}px;top:${n4((r + 0.5) * rh)}px;width:0;height:0;display:grid;place-items:center;font-size:${n4(F)}px;line-height:1;color:${c.col[0]}`);
      e.append(h('span', '', 'white-space:pre', chars[(q + r * 0) % chars.length] || '・'));
      c.stage.append(e); c.cells.push({ e, q, r });
    }
  },
  frame(c, p, t) {
    const v = c.o.speed, n = c.cols + c.rows;
    for (const { e, q, r } of c.cells) {
      const w = Math.sin(q * 0.55 + r * 0.42 - t * 2.4 * v);
      const k = E.out3(seg(p, ((q + r) / n) * 0.55, ((q + r) / n) * 0.55 + 0.45));
      const sc = (0.38 + 0.62 * (0.5 + 0.5 * w)) * k;
      e.style.transform = `translateY(${n4(w * 0.18)}em) scale(${n4(sc)})`;
      e.style.opacity = n4(0.28 + 0.72 * (0.5 + 0.5 * w));
    }
  },
});

// colors: band grounds [a, b, c]; inks: band text colours [a, b, c]
def({ id: 'diagonal-bands', n: 12, zh: '斜向字帶', en: 'Diagonal bands', family: 'flow', kind: 'continuous', field: true,
  use: 'A transition or a loud section break: tilted bands of type cross the frame in opposite directions.',
  mood: 'transition / flow', avoid: 'Leaving the bands up under content; more than three bands (it becomes wallpaper).' }, {
  build(c) {
    const W = c.W, H = c.H, bh = H * 0.21, F = bh * 0.68;
    const copy = c.text + (isCJK(c.text) ? '　●　' : '  ●  ');
    const set = [{ y: 0.3, a: -13 }, { y: 0.58, a: 9 }, { y: 0.82, a: -5 }];
    const inks = c.o.inks || ['#111', '#fff', '#111'];
    c.n = copiesFor(W * 1.8, emw(copy) * F);
    c.bands = set.map((b, i) => {
      const band = h('div', '', `position:absolute;left:${-W * 0.4}px;width:${W * 1.8}px;top:${b.y * H - bh / 2}px;height:${bh}px;background:${c.col[i]};transform:rotate(${b.a}deg);overflow:hidden;display:flex;align-items:center;box-shadow:0 .5em 1.2em rgba(0,0,0,.25)`);
      c.stage.append(band);
      return marquee(band, copy, c.n, `font-size:${F}px;line-height:1;color:${inks[i % inks.length]}`);
    });
    c.r = (W * 0.12) / (emw(copy) * F);
  },
  frame(c, p, t) {
    c.bands.forEach((row, i) => slideX(row, t * c.r * c.o.speed * (1 + i * 0.25) + i * 0.3, c.n, i % 2 ? -1 : 1));
    wipeIn(c, p);
  },
});

// colors: [-, ribbon, ribbon text]. amp: wave height as a fraction of the box
def({ id: 'wave-ribbon', n: 13, zh: '波浪緞帶', en: 'Wave ribbon', family: 'flow', kind: 'continuous', field: true, defaults: { amp: 0.17 },
  use: 'Decor with a pulse: a ribbon of words travels along a sine curve, carrying rhythm through a section.',
  mood: 'decor / rhythm', avoid: 'Text someone must read in full; a ribbon so tight the letters overlap on the curve.' }, {
  build(c) {
    const W = c.W, H = c.H, F = H * 0.105;
    const svg = s('svg', { viewBox: `0 0 ${W} ${H}`, width: '100%', height: '100%', style: 'position:absolute;inset:0' }, c.stage);
    const ft = `font-family:${c.family.replace(/"/g, "'")};font-weight:${c.weight}`;
    const copy = c.text + (isCJK(c.text) ? '　〜　' : '  ~  ');
    const meas = s('text', { 'font-size': F, style: ft, x: 0, y: -999 }, svg); meas.textContent = copy;
    const L = Math.max(10, meas.getComputedTextLength()); meas.remove();
    c.L = L;
    const x0 = -2 * L, x1 = W + L, A = H * c.o.amp, lam = W * 0.62;
    let d = '';
    for (let x = x0; x <= x1; x += 6) d += `${d ? 'L' : 'M'}${n4(x)} ${n4(H / 2 + A * Math.sin((TAU * x) / lam))}`;
    const pid = `tfx-wave-${++UID}`;
    s('path', { id: pid, d, fill: 'none', stroke: 'rgba(0,0,0,.28)', 'stroke-width': F * 1.75, transform: `translate(0 ${F * 0.12})` }, svg);
    s('path', { d, fill: 'none', stroke: c.col[1], 'stroke-width': F * 1.55 }, svg);
    const path = svg.querySelector(`#${pid}`);
    const total = path.getTotalLength ? path.getTotalLength() : x1 - x0;
    const text = s('text', { 'font-size': F, style: ft, fill: c.col[2], 'dominant-baseline': 'central' }, svg);
    c.tp = s('textPath', { href: `#${pid}` }, text);
    c.tp.textContent = copy.repeat(Math.ceil(total / L) + 1);
    c.r = (W * 0.08) / L;
  },
  frame(c, p, t) {
    c.tp.setAttribute('startOffset', n4(c.L * (1 - frac(t * c.r * c.o.speed))));
    wipeIn(c, p);
  },
});

// colors: [ink, band, band text]. Rows of different sizes, speeds and directions
def({ id: 'multi-marquee', n: 14, zh: '多層跑馬燈', en: 'Multi-marquee', family: 'flow', kind: 'continuous', field: true,
  use: 'Announcements and news: stacked tickers at different sizes and speeds make a frame feel live.',
  mood: 'announce / news', avoid: 'Real news that must be read (it scrolls away); every row the same speed.' }, {
  build(c) {
    const W = c.W, H = c.H, sizes = [0.25, 0.1, 0.18, 0.085, 0.15, 0.1];
    const sum = sizes.reduce((a, b) => a + b, 0), seps = ['  ●  ', ' / ', '  —  ', '  ★  ', '  ▲  ', ' / '];
    c.rows = []; let y = (H - H * 0.97) / 2;
    sizes.forEach((sz, i) => {
      const rh = (sz / sum) * H * 0.97, F = rh * 0.8, inv = i % 3 === 1;
      const band = h('div', '', `position:absolute;left:0;right:0;top:${y}px;height:${rh}px;overflow:hidden;display:flex;align-items:center;${inv ? `background:${c.col[1]}` : ''}`);
      c.stage.append(band); y += rh;
      const copy = c.text + seps[i];
      const n = copiesFor(W, emw(copy) * F);
      const row = marquee(band, copy, n, `font-size:${F}px;line-height:1;color:${inv ? c.col[2] : c.col[0]}`);
      c.rows.push({ row, n, r: (W * (0.05 + 0.016 / sz)) / (emw(copy) * F), off: i * 0.21 });
    });
  },
  frame(c, p, t) {
    c.rows.forEach((x, i) => slideX(x.row, t * x.r * c.o.speed + x.off, x.n, i % 2 ? -1 : 1));
    wipeIn(c, p);
  },
});

// colors: [near ink, far ink]
def({ id: 'vertical-parallax', n: 15, zh: '直排視差', en: 'Vertical parallax', family: 'flow', kind: 'continuous', field: true,
  use: 'Depth from type alone: vertical columns at different sizes drift at different speeds, near ones fastest.',
  mood: 'depth / vertical', avoid: 'Too many columns of the same size (no depth reads); behind reading copy.' }, {
  build(c) {
    const W = c.W, H = c.H, N = c.o.cols ?? 7;
    const copy = c.text + (isCJK(c.text) ? '　' : '  ');
    const depths = Array.from({ length: N }, (_, i) => 0.2 + 0.8 * ((i * 0.618 + c.rand() * 0.25) % 1));
    c.cols = depths.map((d, i) => {
      const F = H * (0.06 + 0.2 * d * d);
      const n = copiesFor(H, emw(copy) * F);
      const x = ((i + 0.5) / N) * W + (c.rand() - 0.5) * W * 0.06 - F / 2;
      const col = marquee(c.stage, copy, n, `position:absolute;left:${x}px;top:0;font-size:${F}px;line-height:1;color:${d > 0.6 ? c.col[0] : c.col[1] ?? c.col[0]};opacity:${n4(0.22 + 0.78 * d)};z-index:${Math.round(d * 10)}`, 'tfx-col tfx-v');
      return { col, n, r: (H * (0.025 + 0.11 * d)) / (emw(copy) * F), off: c.rand() };
    });
  },
  frame(c, p, t) {
    for (const x of c.cols) slideY(x.col, t * x.r * c.o.speed + x.off, x.n, 1);
    wipeIn(c, p);
  },
});

// colors: [tape ink, tape ground]
def({ id: 'crossed-tape', n: 16, zh: '交叉膠帶', en: 'Crossed tape', family: 'flow', kind: 'continuous', field: true,
  use: 'A warning, a launch under construction, street energy: two caution tapes cross the frame and keep running.',
  mood: 'warning / street', avoid: 'On a calm brand; as decoration over a form or a price.' }, {
  build(c) {
    const W = c.W, H = c.H, th = H * 0.17, F = th * 0.5, ink = c.col[0], tape = c.col[1] === '#ff5a4e' ? '#ffd400' : c.col[1];
    const copy = c.text + (isCJK(c.text) ? '　▲　' : '  ▲  ');
    c.n = copiesFor(W * 1.8, emw(copy) * F);
    const stripes = `repeating-linear-gradient(-45deg,${ink} 0 .32em,${tape} .32em .64em)`;
    c.tapes = [16, -12].map((a, i) => {
      const band = h('div', '', `position:absolute;left:${-W * 0.4}px;width:${W * 1.8}px;top:${H * (i ? 0.56 : 0.44) - th / 2}px;height:${th}px;font-size:${F}px;transform:rotate(${a}deg);overflow:hidden;display:flex;align-items:center;background:${stripes} top/100% .3em no-repeat,${stripes} bottom/100% .3em no-repeat,${tape};box-shadow:0 .3em .8em rgba(0,0,0,.4)`);
      c.stage.append(band);
      return marquee(band, copy, c.n, `line-height:1;color:${ink}`);
    });
    c.r = (W * 0.1) / (emw(copy) * F);
  },
  frame(c, p, t) {
    c.tapes.forEach((row, i) => slideX(row, t * c.r * c.o.speed + i * 0.5, c.n, i ? -1 : 1));
    wipeIn(c, p);
  },
});

/* =====================================================================================================
 * 立體 3D — walk into the space of text
 * ===================================================================================================== */

// colors: [front word, outline a, outline b]. copies: outline copies in depth. ratio: each copy's size relative to the one before
// (default: just enough that the outer copies clear each other). vp: vanishing point [x, y] as fractions of the box; the front
// word sits at `at` [x, y]. line: outline width in em at the front. outlineWeight: the copies' weight (CJK default 700: open counters)
def({ id: 'tunnel', n: 17, zh: '文字隧道', en: 'Tunnel', family: '3d', kind: 'continuous', field: true, fitRatio: [0.24, 0.58],
  defaults: { copies: 9, vp: [0.5, 0.03], at: [0.5, 0.67], line: 0.024 },
  use: 'An opening with pull: the word stands solid in front while outline copies of it step back, each smaller, to a vanishing point, and the stack keeps flowing toward the camera.',
  mood: 'open / sci-fi', avoid: 'Running it behind content for a whole page; a tunnel with no word at its end.' }, {
  build(c) {
    c.copies = [];
    const cjk = c.G[0].some(isCJK), ow = c.o.outlineWeight ?? (cjk ? Math.min(700, c.weight) : c.weight);
    // size step so that each copy clears the next along the axis: (1 − r)·d ≥ h·(1 + r)/2, with a little air
    const d = Math.abs(c.o.at[1] - c.o.vp[1]) * c.H, hh = c.fs * (cjk ? 0.92 : 0.74) * 1.1;
    c.r = c.o.ratio ?? clamp((2 * d - hh) / (2 * d + hh), 0.58, 0.78);
    for (let i = 0; i < c.o.copies; i++) {
      const e = h('span', 'tfx-at', `left:0;top:0;line-height:1;font-weight:${ow};color:transparent;-webkit-text-stroke-color:${i % 2 ? (c.col[2] ?? c.col[1]) : c.col[1]}`, c.text);
      c.stage.append(e); c.copies.push(e);
    }
    c.lead = h('span', 'tfx-at', `left:0;top:0;line-height:1;color:${c.col[0]};z-index:100`, c.text);
    c.stage.append(c.lead);
  },
  frame(c, p, t) {
    const W = c.W, H = c.H, N = c.o.copies, r = c.r, v = c.o.speed;
    const approach = 1 + (1 - E.out3(p)) * 1.6;                       // the whole stack arrives from depth on p
    const vx = W * c.o.vp[0] + Math.sin(t * 0.5 * v) * W * 0.05, vy = H * c.o.vp[1] + Math.cos(t * 0.37 * v) * H * 0.025;
    const fx = W * c.o.at[0], fy = H * c.o.at[1];
    const place = (e, s) => {
      e.style.transform = `translate(${n4(vx + (fx - vx) * s)}px,${n4(vy + (fy - vy) * s)}px) translate(-50%,-50%) scale(${n4(s)})`;
      return s;
    };
    const phase = frac(t * 0.32 * v);
    c.copies.forEach((e, i) => {
      const d = i + 1 - phase;                                          // depth in steps; each step is `ratio` smaller
      const s = place(e, r ** d / approach);
      const merge = seg(d, 0, 0.75), fog = 1 - seg(d, N - 1.5, N), depth = lerp(1, 0.3, d / N);
      e.style.opacity = n4(merge * fog * depth * clamp(p * 2.5));
      e.style.zIndex = String(90 - i);
      e.style.webkitTextStrokeWidth = `${n4(Math.max(1, c.fs * c.o.line * s ** 0.45) / s)}px`;   // far copies keep a readable line
    });
    place(c.lead, 1 / approach);
    c.lead.style.opacity = p > 0 ? n4(Math.min(1, p * 4)) : 0;
  },
});

// colors: [walls, floor rows alt, lead word]
def({ id: 'corridor', n: 18, zh: '文字走廊', en: 'Corridor', family: '3d', kind: 'continuous', field: true,
  use: 'Immersion for an MV or a manifesto: the camera travels down a corridor whose walls and floor are written.',
  mood: 'immersive / MV', avoid: 'Words that matter on the walls (they rush past unread); using it in a reading section.' }, {
  build(c) {
    const W = c.W, H = c.H, D = Math.max(W, H) * 3.2, st = c.stage;
    st.style.perspective = `${n4(W * 0.42)}px`; st.style.perspectiveOrigin = '50% 50%';
    const copy = c.text + (isCJK(c.text) ? '　' : '  ');
    const fog = (dir) => `-webkit-mask-image:linear-gradient(${dir},#000 0%,rgba(0,0,0,.6) 30%,transparent 70%);mask-image:linear-gradient(${dir},#000 0%,rgba(0,0,0,.6) 30%,transparent 70%)`;
    c.planes = [];
    const wall = (left) => {
      const F = H / 6.2, pitch = emw(copy) * F;
      const pl = h('div', '', `position:absolute;top:0;${left ? 'left:0' : 'right:0'};width:${D}px;height:${H}px;overflow:hidden;transform-origin:${left ? '0' : '100%'} 50%;transform:rotateY(${left ? 90 : -90}deg);${fog(left ? 'to right' : 'to left')}`);
      st.append(pl);
      const n = Math.ceil(D / pitch) + 3, rows = [];
      for (let r = 0; r < 6; r++) rows.push(marquee(pl, copy, n, `position:absolute;left:0;top:${r * F * 1.02 + F * 0.05}px;font-size:${F}px;line-height:1;color:${c.col[0]};opacity:${r % 2 ? 0.55 : 1}`));
      c.planes.push({ rows, n, pitch, kind: left ? 'L' : 'R' });
    };
    const flat = (floor) => {
      const F = W / 9, rh = F * 1.3;
      const pl = h('div', '', `position:absolute;left:0;width:${W}px;height:${D}px;${floor ? `top:${H - D}px` : 'top:0'};overflow:hidden;transform-origin:50% ${floor ? '100%' : '0'};transform:rotateX(${floor ? 90 : -90}deg);${fog(floor ? 'to top' : 'to bottom')}`);
      st.append(pl);
      const nr = 2 * Math.ceil(D / (2 * rh)) + 4;
      const inner = h('div', '', `position:absolute;left:0;right:0;${floor ? 'bottom' : 'top'}:${-2 * rh}px;display:flex;flex-direction:${floor ? 'column-reverse' : 'column'};align-items:center`);
      pl.append(inner);
      const line = copy.repeat(Math.ceil(W / (emw(copy) * F)) + 1);
      for (let r = 0; r < nr; r++) inner.append(h('div', '', `height:${rh}px;font-size:${F}px;line-height:${rh}px;white-space:pre;color:${r % 2 ? c.col[1] : c.col[0]};opacity:${floor ? 1 : 0.5}`, line));
      c.planes.push({ rows: [inner], n: nr, pitch: 2 * rh, kind: floor ? 'F' : 'C' });
    };
    wall(true); wall(false); flat(true); flat(false);
    c.lead = h('span', 'tfx-at', `font-size:${Math.min(H * 0.16, (W * 0.3) / emw(c.text))}px;line-height:1;color:${c.col[2] ?? c.col[0]};z-index:5;transform:translate(-50%,-50%)`, c.text);
    st.append(c.lead);
    c.speed = W * 0.9;
  },
  frame(c, p, t) {
    const travel = t * c.speed * c.o.speed + (1 - E.out3(p)) * -c.W * 0.5;
    for (const pl of c.planes) {
      const f = travel / pl.pitch;
      for (const r of pl.rows) {
        if (pl.kind === 'L') slideX(r, f, pl.n, 1);
        else if (pl.kind === 'R') slideX(r, f, pl.n, -1);
        else r.style.transform = `translate3d(0,${n4((pl.kind === 'F' ? -1 : 1) * (1 - frac(f)) * 200 / pl.n)}%,0)`;
      }
    }
    c.stage.style.opacity = n4(clamp(p * 2.5));
    c.lead.style.opacity = n4(seg(p, 0.3, 0.8));
  },
});

// colors: [front ink, back ink]. rows: 1–4 rings
def({ id: 'cylinder', n: 19, zh: '旋轉圓柱', en: 'Cylinder', family: '3d', kind: 'continuous', field: true, defaults: { rows: 3 },
  use: 'A logo or a name as an object: characters wrapped round a turning drum, front bright, back seen through.',
  mood: '3D / logo', avoid: 'Long phrases (only the front third is readable); spinning fast enough to blur.' }, {
  build(c) {
    const W = c.W, H = c.H, st = c.stage, R = Math.min(W * 0.3, H * 0.62), rows = c.o.rows;
    st.style.perspective = `${n4(R * 4)}px`;
    const drum = h('div', '', 'position:absolute;left:50%;top:50%;width:0;height:0;transform-style:preserve-3d;transform:rotateX(-14deg) rotateZ(-6deg)');
    st.append(drum);
    const rowH = Math.min((H * 0.62) / rows, H * 0.2), F = rowH * 0.8;
    const unit = graphemes(c.text + (isCJK(c.text) ? '・' : ' · '));
    const M = Math.max(10, Math.min(30, Math.round((TAU * R) / (F * 0.95))));
    c.cells = [];
    for (let r = 0; r < rows; r++) for (let q = 0; q < M; q++) {
      const e = h('span', '', `position:absolute;left:0;top:0;width:${F}px;margin-left:${-F / 2}px;margin-top:${-F * 0.6}px;text-align:center;font-size:${F}px;line-height:1.2;white-space:pre;color:${c.col[0]}`, unit[q % unit.length]);
      drum.append(e);
      c.cells.push({ e, a: (q / M) * 360 + r * 9, y: (r - (rows - 1) / 2) * rowH, R });
    }
  },
  frame(c, p, t) {
    const spin = -t * 26 * c.o.speed - (1 - E.out3(p)) * 160, fade = clamp(p * 1.6);
    for (const x of c.cells) {
      const a = x.a + spin, front = Math.cos((a * Math.PI) / 180);
      x.e.style.transform = `translateY(${n4(x.y)}px) rotateY(${n4(a)}deg) translateZ(${n4(x.R)}px)`;
      x.e.style.opacity = n4((front > 0 ? 0.35 + 0.65 * front : 0.16) * fade);
      x.e.style.color = front > 0 ? c.col[0] : c.col[1];
    }
  },
});

// colors: [lead, outline a, outline b]
def({ id: 'vortex', n: 20, zh: '文字漩渦', en: 'Vortex', family: '3d', kind: 'continuous', field: true, fitRatio: [0.2, 0.36],
  use: 'A dreamlike climax or a fall: layers of the word twist outward into a spiral around the word, which holds still and reads.',
  mood: 'dreamy / climax', avoid: 'Under copy; as a loading spinner; a vortex for a calm product.' }, {
  build(c) {
    c.stage.style.cssText += ';display:grid;place-items:center';
    c.N = c.o.layers ?? 8; c.layers = [];
    for (let i = c.N; i >= 1; i--) {
      const sc = Math.pow(1.22, i);
      const e = h('span', 'tfx-at', `line-height:1;color:transparent;-webkit-text-stroke:${n4(2.2 / c.fs / sc)}em ${i % 2 ? c.col[1] : (c.col[2] ?? c.col[1])}`, c.text);
      c.stage.append(e); c.layers[i] = { e, sc };
    }
    c.lead = h('span', 'tfx-at', `line-height:1;color:${c.col[0]}`, c.text);
    c.stage.append(c.lead);
  },
  frame(c, p, t) {
    const a = E.out3(p);
    for (let i = 1; i <= c.N; i++) {
      const { e, sc } = c.layers[i];
      const rot = i * 11 * a + t * c.o.speed * (36 / (1 + i * 0.4)) - (1 - a) * 120;
      e.style.opacity = n4(clamp(p * 2) * (1 - (i / (c.N + 1.5)) ** 1.2));
      e.style.transform = `translate(-50%,-50%) rotate(${n4(rot)}deg) scale(${n4(sc * lerp(0.3, 1, a))})`;
    }
    c.lead.style.opacity = n4(seg(p, 0.2, 0.7));
    c.lead.style.transform = `translate(-50%,-50%) scale(${n4(lerp(0.4, 1, E.out3(seg(p, 0.2, 0.8))))})`;
  },
});

// colors: [lead, ring a, ring b]
def({ id: 'ring-tunnel', n: 21, zh: '圓環隧道', en: 'Ring tunnel', family: '3d', kind: 'continuous', field: true, fitRatio: [0.14, 0.3],
  use: 'A sci-fi opening or a signal: rings of characters arrive one after another out of the dark around the word.',
  mood: 'open / sci-fi', avoid: 'Rings of a long sentence (it reads as noise); behind anything to be read.' }, {
  build(c) {
    const W = c.W, H = c.H, r0 = Math.min(W, H) * 0.5, F = r0 * 0.21;
    const chars = c.G[0].filter((g) => g.trim());
    c.R = 8; c.rings = [];
    for (let i = 0; i < c.R; i++) {
      const ring = h('div', '', 'position:absolute;left:50%;top:50%;width:0;height:0');
      const M = 16;
      for (let q = 0; q < M; q++) ring.append(h('span', '', `position:absolute;left:0;top:0;width:${F}px;margin-left:${-F / 2}px;text-align:center;font-size:${F}px;line-height:1;color:${i % 2 ? c.col[1] : (c.col[2] ?? c.col[1])};transform:rotate(${n4((q / M) * 360)}deg) translateY(${n4(-r0)}px)`, chars[q % chars.length]));
      c.stage.append(ring); c.rings.push(ring);
    }
    c.lead = h('span', 'tfx-at', `color:${c.col[0]};z-index:40;line-height:1`, c.text);
    c.stage.append(c.lead);
  },
  frame(c, p, t) {
    c.rings.forEach((ring, i) => {
      const u = frac(i / c.R + t * 0.13 * c.o.speed);
      const sc = 1 / lerp(9, 0.55, u);
      ring.style.opacity = n4(seg(u, 0, 0.25) * (1 - seg(sc, 1.2, 1.8)) * clamp(p * 2));
      ring.style.zIndex = sc > 0.7 ? 60 : Math.round(sc * 40);
      ring.style.transform = `scale(${n4(sc)}) rotate(${n4(u * 70 + i * 11)}deg)`;
    });
    c.lead.style.opacity = n4(seg(p, 0.25, 0.7));
    c.lead.style.transform = `translate(-50%,-50%) scale(${n4(Math.exp(lerp(Math.log(0.08), 0, E.out3(p))))})`;
  },
});

// colors: [lead, orbiting characters]. orbit: text on the ring (defaults to the text)
def({ id: 'orbit', n: 22, zh: '軌道環繞', en: 'Orbit', family: '3d', kind: 'continuous', field: true, fitRatio: [0.24, 0.42],
  use: 'A logo or title with a satellite line: characters circle the name on a tilted ellipse, large in front, small behind.',
  mood: 'logo / title', avoid: 'An orbit of meaningless filler; orbiting the CTA.' }, {
  build(c) {
    const W = c.W, H = c.H, F = Math.min(H * 0.1, W * 0.05);
    c.rx = W * 0.4; c.ry = H * 0.2;
    const unit = graphemes((c.o.orbit ?? c.text) + (isCJK(c.text) ? '・' : ' · '));
    const M = Math.max(12, Math.min(34, Math.round((Math.PI * (c.rx + c.ry)) / (F * 1.05))));
    const sys = h('div', '', 'position:absolute;left:50%;top:50%;width:0;height:0;transform:rotate(-9deg)');
    c.stage.append(sys);
    c.lead = h('span', 'tfx-at', `color:${c.col[0]};z-index:20;line-height:1;transform:translate(-50%,-50%) rotate(9deg)`, c.text);
    sys.append(c.lead);
    c.cells = Array.from({ length: M }, (_, q) => { const e = h('span', '', `position:absolute;left:0;top:0;width:${F}px;margin:${-F * 0.55}px 0 0 ${-F / 2}px;text-align:center;font-size:${F}px;line-height:1.1;white-space:pre;color:${c.col[1]}`, unit[q % unit.length]); sys.append(e); return { e, q, M }; });
  },
  frame(c, p, t) {
    const a0 = Math.PI / 2 - t * 0.55 * c.o.speed - (1 - E.out3(p)) * 3;
    for (const { e, q, M } of c.cells) {
      const a = a0 - (q / M) * TAU, depth = Math.sin(a);
      const sc = lerp(0.5, 1.3, (depth + 1) / 2);
      e.style.transform = `translate(${n4(Math.cos(a) * c.rx)}px,${n4(depth * c.ry)}px) rotate(9deg) scale(${n4(sc)})`;
      e.style.zIndex = depth > 0 ? 30 : 10;
      e.style.opacity = n4(lerp(0.3, 1, (depth + 1) / 2) * clamp(p * 2));
    }
    c.lead.style.opacity = n4(seg(p, 0.1, 0.6));
  },
});

// texts: words on the cube's faces. cards: [{ bg, fg }] per face
def({ id: 'cube-flip', n: 23, zh: '翻轉方塊', en: 'Cube flip', family: '3d', kind: 'switch', fitRatio: [0.34, 0.64],
  use: 'A switch with mass: the word is the face of a block that tips forward to show the next word.',
  mood: 'switch / 3D', avoid: 'Flipping on every scroll tick; faces with sentences.' }, {
  build(c) {
    const cards = c.o.cards || [{ bg: '#1fb5a6', fg: '#06100f' }, { bg: '#f4f1e8', fg: '#06100f' }, { bg: '#06100f', fg: '#1fb5a6' }];
    c.cards = cards;
    c.stage.style.perspective = '7em';
    const cube = h('span', 'tfx-g', 'transform-style:preserve-3d;line-height:1.3');
    c.stage.append(cube);
    for (const tx of c.texts) cube.append(h('span', 'tfx-hide', 'padding:0 .3em', tx));
    const face = () => { const f = h('span', '', 'padding:0 .3em;display:grid;place-items:center;backface-visibility:hidden;position:relative;overflow:hidden'); const tx = h('span'); const sh = h('span', '', 'position:absolute;inset:0;background:#000;opacity:0'); f.append(tx, sh); cube.append(f); return { f, tx, sh }; };
    c.A = face(); c.B = face(); c.cube = cube;
  },
  frame(c, p, t) {
    const { i, j, k } = sw(c, p, t);
    const paint = (F, idx) => { const cd = c.cards[((idx % c.cards.length) + c.cards.length) % c.cards.length]; F.f.style.background = cd.bg; F.f.style.color = cd.fg; const v = T(c, idx); if (F.tx.textContent !== v) F.tx.textContent = v; };
    paint(c.A, i < 0 ? -1 : i); paint(c.B, j);
    if (i < 0) c.A.f.style.background = c.cards[c.cards.length - 1].bg;
    const a = 90 * E.backOut(k, 1.15);
    const half = '.65em';
    c.cube.style.transform = `translateZ(-${half}) rotateX(${n4(-a)}deg)`;
    c.A.f.style.transform = `translateZ(${half})`;
    c.B.f.style.transform = `rotateX(90deg) translateZ(${half})`;
    c.A.sh.style.opacity = n4(clamp(a / 90) * 0.55);
    c.B.sh.style.opacity = n4((1 - clamp(a / 90)) * 0.55);
  },
});

// colors: [face, side]. depth: extrusion in em
def({ id: 'extrude', n: 24, zh: '立體厚度', en: 'Extrude', family: '3d', kind: 'entrance', defaults: { depth: 0.16 }, fitRatio: [0.4, 0.68],
  use: 'A title that must feel like an object: the word rises off the page and gains thickness and a shadow.',
  mood: 'title', avoid: 'Extruding more than one line; rainbow sides; extrusion on thin weights.' }, {
  build(c) {
    c.word = h('span', '', `display:inline-block;color:${c.col[0]}`, c.text);
    c.stage.append(c.word);
    c.side = c.o.colors?.[1] ?? `color-mix(in srgb, ${c.col[0]} 55%, #000)`;
  },
  frame(c, p) {
    const d = c.o.depth * E.out3(seg(p, 0.05, 0.75)), n = 22, sh = [];
    for (let l = 1; l <= n; l++) sh.push(`${n4((l / n) * d)}em ${n4((l / n) * d)}em 0 ${c.side}`);
    sh.push(`${n4(d + 0.04)}em ${n4(d + 0.06)}em ${n4(0.06 + d * 0.6)}em rgba(0,0,0,.35)`);
    c.word.style.textShadow = sh.join(',');
    c.word.style.opacity = n4(seg(p, 0, 0.15));
    c.word.style.transform = `translate(${n4(-d * 0.5)}em,${n4(-d * 0.5)}em) scale(${n4(lerp(0.92, 1, E.out3(seg(p, 0, 0.6))))})`;
  },
});

/* =====================================================================================================
 * 切換 SWITCH — make the change interesting
 * ===================================================================================================== */

// texts: board states. colors: [letters, tile]. pool: characters the flaps flip through.
// still: 'same+punct' (default) keeps cells whose character does not change, and punctuation/spaces, still; false flaps every cell
def({ id: 'split-flap', n: 25, zh: '翻頁看板', en: 'Split-flap', family: 'switch', kind: 'switch', fitRatio: [0.32, 0.8],
  use: 'Departures, arrivals, a schedule, a retro reveal: letters clatter through the alphabet into place, left to right.',
  mood: 'retro / station', avoid: 'Long text (a board is a few words); modern brands with no reason to be mechanical.' }, {
  build(c) {
    const L = Math.max(...c.G.map((g) => g.length)), tile = c.o.colors?.[1] ?? '#1d1c22', ink = c.o.colors?.[0] ?? '#f4f1e8';
    c.stage.style.cssText += ';display:inline-flex;gap:.07em;line-height:1.3';
    c.cells = [];
    for (let q = 0; q < L; q++) {
      const w = c.G.some((g) => isCJK(g[q] || '')) ? 1.12 : 0.8;
      const cell = h('span', '', `position:relative;display:inline-block;width:${w}em;height:1.3em;perspective:3em;color:${ink}`);
      const half = (top) => { const o = h('span', '', `position:absolute;left:0;right:0;${top ? 'top:0' : 'bottom:0'};height:50%;overflow:hidden;background:${tile};border-radius:${top ? '.08em .08em 0 0' : '0 0 .08em .08em'};backface-visibility:hidden;transform-origin:50% ${top ? '100%' : '0'}`); const i = h('span', '', `position:absolute;left:0;right:0;height:200%;${top ? 'top:0' : 'top:-100%'};text-align:center;line-height:1.3em`); const shade = h('span', '', 'position:absolute;inset:0;background:#000;opacity:0'); o.append(i, shade); cell.append(o); return { o, i, shade }; };
      const x = { topS: half(true), botS: half(false), topF: half(true), botF: half(false) };
      cell.append(h('span', '', 'position:absolute;left:0;right:0;top:50%;height:.035em;margin-top:-.0175em;background:rgba(0,0,0,.55);z-index:3'));
      c.stage.append(cell);
      x.flips = 2 + Math.floor(c.rand() * 4);
      x.rnd = Array.from({ length: 8 }, () => c.rand());
      c.cells.push(x);
    }
    const pool = c.o.pool || (c.G.flat().some(isCJK) ? '東西南北京高台雄中港站線車機場一二三上下' : 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789');
    c.pool = graphemes(pool);
  },
  frame(c, p, t) {
    const { i, j, k } = sw(c, p, t), from = G(c, i), to = G(c, j), L = c.cells.length;
    const set = (x, v) => { if (x.i.textContent !== v) x.i.textContent = v; };
    const still = c.o.still ?? 'same+punct';
    c.cells.forEach((x, q) => {
      const a = from[q] ?? ' ', b = to[q] ?? ' ', st = (q / Math.max(1, L)) * 0.45;
      // a character that does not change, or punctuation turning into punctuation, never flaps
      if (still && (a === b || (/^[\s\p{P}]$/u.test(a) && /^[\s\p{P}]$/u.test(b)))) {
        const v = seg(k, st, st + 0.55) >= 0.5 ? b : a;
        set(x.topS, v); set(x.botS, v); x.topF.o.style.opacity = 0; x.botF.o.style.opacity = 0; return;
      }
      const seq = [a];
      for (let f = 0; f < x.flips; f++) seq.push(c.pool[Math.floor(x.rnd[f] * c.pool.length)]);
      seq.push(b);
      const u = seg(k, st, st + 0.55) * (seq.length - 1);
      const idx = Math.min(Math.floor(u), seq.length - 2), ph = u >= seq.length - 1 ? 1 : u - idx;
      const cur = seq[idx], nxt = seq[idx + 1];
      if (ph >= 1 || k <= 0) {
        const v = k <= 0 ? seq[0] : seq[seq.length - 1];
        set(x.topS, v); set(x.botS, v); x.topF.o.style.opacity = 0; x.botF.o.style.opacity = 0; return;
      }
      set(x.topS, nxt); set(x.botS, cur); set(x.topF, cur); set(x.botF, nxt);
      if (ph < 0.5) {
        const a = -90 * E.in2(ph * 2);
        x.topF.o.style.opacity = 1; x.topF.o.style.transform = `rotateX(${n4(a)}deg)`; x.topF.shade.style.opacity = n4(-a / 180);
        x.botF.o.style.opacity = 0;
      } else {
        const a = 90 * (1 - E.out2((ph - 0.5) * 2));
        x.topF.o.style.opacity = 0;
        x.botF.o.style.opacity = 1; x.botF.o.style.transform = `rotateX(${n4(a)}deg)`; x.botF.shade.style.opacity = n4(a / 180);
      }
    });
  },
});

// texts: card faces. cards: [{ bg, fg }] alternating by text
def({ id: 'card-flip', n: 26, zh: '字卡翻轉', en: 'Card flip', family: 'switch', kind: 'switch', fitRatio: [0.34, 0.78],
  use: 'An announcement that turns over: each character is a card that flips, in sequence, to show the news.',
  mood: 'switch / announce', avoid: 'Paragraphs on cards; flipping without a new message on the back.' }, {
  build(c) {
    c.cards = c.o.cards || [{ bg: '#fff', fg: '#7b5cff' }, { bg: '#120f24', fg: '#fff' }];
    const L = Math.max(...c.G.map((g) => g.length));
    c.stage.style.cssText += ';display:inline-flex;gap:.08em;line-height:1.3;perspective:6em';
    c.cells = [];
    for (let q = 0; q < L; q++) {
      const w = c.G.some((g) => isCJK(g[q] || '')) ? 1.12 : 0.82;
      const card = h('span', '', `position:relative;display:inline-block;width:${w}em;height:1.3em;transform-style:preserve-3d`);
      const face = (back) => { const f = h('span', '', `position:absolute;inset:0;display:grid;place-items:center;border-radius:.1em;backface-visibility:hidden;box-shadow:0 .05em .12em rgba(0,0,0,.25);${back ? 'transform:rotateY(180deg)' : ''}`); card.append(f); return f; };
      c.cells.push({ card, a: face(false), b: face(true) });
      c.stage.append(card);
    }
  },
  frame(c, p, t) {
    const { i, j, k } = sw(c, p, t), from = G(c, i), to = G(c, j), L = c.cells.length;
    const ci = c.cards[(Math.max(0, i) % c.cards.length)], cj = c.cards[(j % c.cards.length)];
    c.cells.forEach((x, q) => {
      const st = (q / Math.max(1, L)) * 0.5, u = E.inOut3(seg(k, st, st + 0.5));
      x.a.textContent = from[q] ?? ''; x.b.textContent = to[q] ?? '';
      x.a.style.background = i < 0 ? 'rgba(255,255,255,.18)' : ci.bg; x.a.style.color = ci.fg;
      x.b.style.background = cj.bg; x.b.style.color = cj.fg;
      x.card.style.transform = `rotateY(${n4(180 * u)}deg)`;
    });
  },
});

// texts: lines typed in turn (one string types in from empty as p goes 0→1; for an array, start it with '' to
// type the first line in). colors: [ink, caret]. caret: 'typing' (default: shown only while typing or deleting),
// true (also blinks with t between lines and at rest), false (never)
def({ id: 'typewriter', n: 27, zh: '打字效果', en: 'Typewriter', family: 'switch', kind: 'switch', defaults: { weight: 700, caret: 'typing' }, fitRatio: [0.3, 0.86],
  use: 'Story and subtitles: a line is typed, considered, deleted, and the next one typed — a voice thinking aloud.',
  mood: 'story / subtitle', avoid: 'Typing a headline nobody waits for; machine-even rhythm (people type unevenly).' }, {
  build(c) {
    c.stage.classList.add('tfx-g'); c.stage.style.color = c.col[0];
    for (const tx of c.texts) c.stage.append(h('span', 'tfx-hide', null, tx + ' '));
    const line = h('span', '', 'justify-self:start');
    c.txt = h('span', '', 'white-space:pre'); c.caret = h('span', '', `display:inline-block;width:.09em;height:1em;margin-left:.06em;vertical-align:-.12em;background:${c.col[1]}`);
    line.append(c.txt, c.caret); c.stage.append(line);
    c.sched = c.G.map((g) => { let a = 0; const w = g.map(() => (a += 0.6 + c.rand() * 0.9)); return w.map((x) => x / a); });
  },
  frame(c, p, t) {
    const { i, j, k } = sw(c, p, t), from = G(c, i), to = G(c, j);
    let shown, typing;
    const del = from.length && i !== j ? 0.32 : 0, gap = del ? 0.08 : 0;
    if (i === j) { shown = to; typing = false; }
    else if (k < del) { shown = from.slice(0, Math.ceil(from.length * (1 - k / del))); typing = k > 0; }
    else {
      const u = seg(k, del + gap, 1), sch = c.sched[j];
      let m = 0; while (m < sch.length && sch[m] <= u + 1e-9) m++;
      shown = to.slice(0, m); typing = u > 0 && u < 1;
      if (k <= del + gap && del) shown = [];
    }
    const v = shown.join('');
    if (c.txt.textContent !== v) c.txt.textContent = v;
    // 'typing': lit from the first deleted character to the last typed one, gaps included, so it never flickers
    const cr = c.o.caret, busy = cr === true ? typing : i !== j && k > 0 && k < 1;
    c.caret.style.opacity = cr === false ? 0 : busy || (cr === true && frac(t * 1.1) < 0.55) ? 1 : 0;
  },
});

// texts: what the reels land on. colors: [ink, frame, reel ground]. cell: reel window (and step) height in em, default 1.2
def({ id: 'slot-roll', n: 28, zh: '滾輪文字', en: 'Slot roll', family: 'switch', kind: 'switch', fitRatio: [0.32, 0.72],
  use: 'A result reveal: reels spin and stop one by one on the answer — a prize, a name, a score.',
  mood: 'result reveal', avoid: 'Revealing something that was never uncertain; reels that stop together (no suspense).' }, {
  build(c) {
    const ink = c.col[0], frame = c.o.colors?.[1] ?? '#111', ground = c.o.colors?.[2] ?? '#fff';
    const L = Math.max(...c.G.map((g) => g.length)), cell = (c.cell = +c.o.cell || 1.2);
    c.stage.style.cssText += `;display:inline-flex;gap:.06em;padding:.1em;background:${frame};border-radius:.14em;line-height:${cell}`;
    const pool = graphemes(c.o.pool || (c.G.flat().some(isCJK) ? '吉福財喜壽春金星光夢大中' : 'ABCDEFGHJKLMNPRSTUVWXYZ0123456789'));
    c.reels = [];
    for (let q = 0; q < L; q++) {
      const w = c.G.some((g) => isCJK(g[q] || '')) ? 1.1 : 0.8;
      const win = h('span', '', `position:relative;display:inline-block;width:${w}em;height:${cell}em;overflow:hidden;background:${ground};border-radius:.06em;-webkit-mask-image:linear-gradient(transparent,#000 22%,#000 78%,transparent);mask-image:linear-gradient(transparent,#000 22%,#000 78%,transparent)`);
      const strip = h('span', '', `position:absolute;left:0;right:0;top:0;display:flex;flex-direction:column;text-align:center;color:${ink}`);
      win.append(strip); c.stage.append(win);
      const m = Math.min(24, 7 + q * 3);
      const rnd = Array.from({ length: m }, () => pool[Math.floor(c.rand() * pool.length)]);
      const cellsEl = Array.from({ length: m + 2 }, () => { const e = h('span', '', `flex:none;height:${cell}em;line-height:${cell}em;white-space:pre`); strip.append(e); return e; });
      c.reels.push({ strip, rnd, cells: cellsEl });
    }
  },
  frame(c, p, t) {
    const { i, j, k } = sw(c, p, t), from = G(c, i), to = G(c, j), L = c.reels.length;
    c.reels.forEach((x, q) => {
      const seq = [from[q] ?? ' ', ...x.rnd, to[q] ?? ' '];
      seq.forEach((v, n) => { if (x.cells[n].textContent !== v) x.cells[n].textContent = v; });
      const end = 0.45 + (q / Math.max(1, L)) * 0.55, pos = (u) => E.backOut(seg(u, 0, end), 0.8) * (seq.length - 1);
      const y = i === j ? seq.length - 1 : pos(k), vel = Math.abs(pos(k + 0.01) - pos(k));
      x.strip.style.transform = `translateY(${n4(-y * c.cell)}em)`;
      x.strip.style.filter = vel > 0.05 && i !== j ? `blur(${n4(Math.min(4, vel * 6) * (c.fs / 100))}px)` : '';
    });
  },
});

// text: "label 48161 label" (or [from, to]); the last text sets the digit columns. colors: [digits, labels].
// clip: [top, bottom] em trimmed off each 1.1em digit window so a roll shows only the digits' ink band (default:
// measured from the face's digit ink, with .03em to spare; false keeps the full line box).
// zeros: true (default) dims the leading zeros, false drops them (and their separators). value: show this number
// instead of p (fx.value = 52470 binds it to a figure; tween fx.value to roll; null hands back to p)
def({ id: 'odometer', n: 29, zh: '數字計數', en: 'Odometer', family: 'switch', kind: 'switch',
  use: 'Results and proof: a real number rolls up digit by digit and stops on its exact value, labels either side.',
  mood: 'results / numbers', avoid: 'Invented or rounded-up numbers; counting every number on the page; counting twice.' }, {
  fit(c) {
    const m = /^(.*?)(\d[\d,.]*)(.*)$/s.exec(c.texts[c.texts.length - 1]) || ['', c.text, '', ''];
    const w = m[2].length * 0.62 + (emw(m[1].trim()) + emw(m[3].trim())) * 0.42 + 0.4;
    return Math.min(c.H * 0.4, (c.W * 0.86) / w);
  },
  build(c) {
    const parse = (s) => { const m = /^(.*?)(\d[\d,.]*)(.*)$/s.exec(s); return m ? { pre: m[1], num: m[2], post: m[3] } : { pre: s, num: '0', post: '' }; };
    c.parts = c.texts.map(parse);
    const last = c.parts[c.parts.length - 1];
    c.stage.style.cssText += ';display:inline-flex;align-items:center;gap:.12em;line-height:1.1;font-variant-numeric:tabular-nums';
    const lab = (s) => { const e = h('span', '', `font-size:.42em;color:${c.col[1]};white-space:pre;font-weight:700`, s.trim()); c.stage.append(e); return e; };
    c.pre = lab(last.pre);
    const box = h('span', '', `display:inline-flex;color:${c.col[0]}`); c.stage.append(box);
    c.cols = [];
    const digits = [...last.num];
    let place = digits.filter((d) => /\d/.test(d)).length;
    c.seps = [];
    const cl = odoClip(c), wclip = cl ? `;clip-path:inset(${n4(cl[0])}em 0 ${n4(cl[1])}em 0)` : '';
    for (const d of digits) {
      if (!/\d/.test(d)) { const e = h('span', '', null, d); box.append(e); c.seps.push({ e, place }); continue; }
      place--;
      const win = h('span', '', `display:inline-block;height:1.1em;overflow:hidden;position:relative${wclip}`);
      const strip = h('span', '', 'display:flex;flex-direction:column');
      for (let v = 0; v <= 10; v++) strip.append(h('span', '', 'height:1.1em;text-align:center', String(v % 10)));
      win.append(strip); box.append(win);
      c.cols.push({ strip, win, place });
    }
    c.post = lab(last.post);
    if (!c.pre.textContent) c.pre.style.display = 'none';
    if (!c.post.textContent) c.post.style.display = 'none';
    c.val = c.parts.map((x) => +x.num.replace(/[^\d]/g, ''));
  },
  // bound to a value, the hidden text reads that value, in the last text's format
  sr(c) {
    if (c.o.value == null || !Number.isFinite(+c.o.value)) return null;
    const last = c.parts[c.parts.length - 1], n = Math.round(Math.max(0, +c.o.value));
    return `${last.pre}${last.num.includes(',') ? n.toLocaleString('en-US') : String(n)}${last.post}`;
  },
  frame(c, p, t) {
    const { i, j, k } = sw(c, p, t);
    const a = i < 0 ? 0 : c.val[i], b = c.val[j], bound = c.o.value != null && Number.isFinite(+c.o.value);
    const v = bound ? Math.max(0, +c.o.value) : i === j ? b : lerp(a, b, E.out3(k));
    const drop = c.o.zeros === false;
    for (const col of c.cols) {
      const P = 10 ** col.place, lower = v % P;
      const whole = Math.floor(v / P) % 10;
      const roll = col.place === 0 ? frac(v) : clamp(lower - (P - 1));
      // a leading zero is dimmed, or with zeros: false dropped, until its digit starts to roll in
      const lead = col.place > 0 && Math.floor(v / P) === 0;
      col.strip.style.transform = `translateY(${n4(-(whole + roll) * 1.1)}em)`;
      col.win.style.opacity = lead && !drop ? 0.28 : 1;
      col.win.style.display = drop && col.place > 0 && v <= P - 1 ? 'none' : 'inline-block';
    }
    // a separator goes with the digit just before it (place q), i.e. when every digit to its left has gone
    for (const sp of c.seps) sp.e.style.display = drop && v <= 10 ** sp.place - 1 ? 'none' : 'inline';
    c.pre.style.opacity = c.post.style.opacity = bound ? 1 : n4(clamp(k * 3 + (i >= 0 ? 1 : 0)));
  },
});

/** The odometer window's [top, bottom] trim in em: the clip option, or the digits' ink band (measured once per build)
 * inside a 1.1em line box, plus a margin, so the rolling neighbour never shows in the leading or hangs into the next line. */
function odoClip(c) {
  if (c.o.clip === false) return null;
  if (Array.isArray(c.o.clip)) return [Math.max(0, +c.o.clip[0] || 0), Math.max(0, +c.o.clip[1] || 0)];
  const x = document.createElement('canvas').getContext('2d');
  x.font = c.font(100);
  const m = x.measureText('0123456789'), fa = m.fontBoundingBoxAscent, fd = m.fontBoundingBoxDescent;
  if (!(fa > 0) || !(m.actualBoundingBoxAscent > 0)) return null;
  const base = (1.1 - (fa + fd) / 100) / 2 + fa / 100, pad = 0.03;
  const top = base - m.actualBoundingBoxAscent / 100 - pad, bot = 1.1 - (base + Math.max(0, m.actualBoundingBoxDescent) / 100 + pad);
  return [Math.max(0, top), Math.max(0, bot)];
}

// texts: headlines. colors: [ink, bar]. pad: inline padding in em (default 0 for CJK-only text, so it lines up
// with the lines around it; .1 for Latin)
def({ id: 'headline-swap', n: 30, zh: '標題切換', en: 'Headline swap', family: 'switch', kind: 'switch', defaults: { weight: 800 }, fitRatio: [0.3, 0.86],
  use: 'News and explainers: a colour bar wipes across, and the headline under it is replaced as it passes.',
  mood: 'news / explainer', avoid: 'A bar wipe on every heading of a page; swapping headlines faster than they can be read.' }, {
  build(c) {
    c.stage.classList.add('tfx-g');
    const pad = padOf(c);
    for (const tx of c.texts) c.stage.append(h('span', 'tfx-hide', `padding:0 ${pad}em`, tx));
    const mask = h('span', '', `overflow:clip;justify-self:start;padding:0 ${pad}em`); c.line = h('span', '', `display:block;color:${c.col[0]}`);
    mask.append(c.line);
    c.bar = h('span', '', `position:absolute;left:-.12em;right:-.12em;top:0;bottom:0;background:${c.col[1]}`);
    c.stage.append(mask, c.bar);
  },
  frame(c, p, t) {
    const { i, j, k } = sw(c, p, t);
    if (k < 0.45) {
      const u = k / 0.45;
      if (c.line.textContent !== T(c, i)) c.line.textContent = T(c, i);
      c.line.style.transform = `translateY(${n4(-110 * E.in3(seg(u, 0.25, 1)))}%)`;
      c.bar.style.transformOrigin = '0 50%'; c.bar.style.transform = `scaleX(${n4(E.inOut3(u))})`;
    } else {
      const u = (k - 0.45) / 0.55;
      if (c.line.textContent !== T(c, j)) c.line.textContent = T(c, j);
      c.line.style.transform = `translateY(${n4(110 * (1 - E.out3(seg(u, 0.1, 0.8))))}%)`;
      c.bar.style.transformOrigin = '100% 50%'; c.bar.style.transform = `scaleX(${n4(1 - E.inOut3(seg(u, 0, 0.7)))})`;
    }
  },
});

// colors: [unlit dot, lit dot]. rows: dot rows (CJK needs 16+)
def({ id: 'led-matrix', n: 31, zh: 'LED 點陣', en: 'LED matrix', family: 'switch', kind: 'continuous', field: true, stillT: 0,
  use: 'Retro and tech: a glowing dot-matrix board scrolls a short message — a gate, a train, an arcade, a status.',
  mood: 'retro / tech', avoid: 'Long messages; complex CJK at too few rows (strokes merge); a board with nothing to announce.' }, {
  build(c) {
    const W = c.W, H = c.H, cjk = c.G[0].some(isCJK);
    const rows = c.o.rows ?? (cjk ? 24 : 14);
    const off = document.createElement('canvas'), ox = off.getContext('2d', { willReadFrequently: true });
    const F = rows * (cjk ? 0.95 : 1.05), lf = `${cjk ? 700 : c.weight} ${F}px ${c.family}`;
    ox.font = lf;
    const tw = Math.ceil(ox.measureText(c.text).width), gap = Math.round(rows * 0.9);
    // dot pitch: fit the whole message at rest when it can, within a readable band of sizes
    const pitch = clamp((W * 0.94) / (tw + 2), (H * 0.3) / rows, Math.min((H * 0.76) / rows, W / 18)), cols = Math.floor((W * 0.94) / pitch);
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const cv = h('canvas', '', 'position:absolute;inset:0;width:100%;height:100%');
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    c.stage.append(cv);
    off.width = Math.max(tw + gap, cols + 4); off.height = rows;
    ox.font = lf; ox.textBaseline = 'alphabetic'; ox.fillStyle = '#000';
    ox.fillText(c.text, 0, Math.round(rows * (cjk ? 0.86 : 0.84)));
    const d = ox.getImageData(0, 0, off.width, rows).data;
    c.bits = new Uint8Array(off.width * rows);
    for (let q = 0; q < off.width * rows; q++) c.bits[q] = d[q * 4 + 3] > 96 ? 1 : 0;
    Object.assign(c, { cv, ctx: cv.getContext('2d'), dpr, rows, cols, pitch, sw: off.width, tw });
    c.start = tw <= cols ? -Math.floor((cols - tw) / 2) : -2;
  },
  frame(c, p, t) {
    const { ctx, dpr, rows, cols, pitch, sw: SW } = c, W = c.W, H = c.H;
    const ox = (W - cols * pitch) / 2, oy = (H - rows * pitch) / 2, r = pitch * 0.36;
    const shift = Math.floor(t * 9 * c.o.speed);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#0a0806'; ctx.fillRect(ox - pitch * 0.6, oy - pitch * 0.6, cols * pitch + pitch * 1.2, rows * pitch + pitch * 1.2);
    const on = c.o.colors?.[1] ?? '#ffa53a', offc = c.o.colors?.[0] ?? '#2b1a0c', sweep = p * (cols + 6);
    for (let pass = 0; pass < 2; pass++) {
      ctx.fillStyle = pass ? on : offc;
      ctx.shadowColor = on; ctx.shadowBlur = pass ? pitch * 0.7 : 0;
      ctx.beginPath();
      for (let x = 0; x < cols; x++) {
        const sx = (((x + c.start + shift) % SW) + SW) % SW;
        for (let y = 0; y < rows; y++) {
          const lit = c.bits[y * SW + sx] && x < sweep;
          if ((pass === 1) !== !!lit) continue;
          const cx = ox + (x + 0.5) * pitch, cy = oy + (y + 0.5) * pitch;
          ctx.moveTo(cx + r, cy); ctx.arc(cx, cy, r, 0, TAU);
        }
      }
      ctx.fill();
    }
    ctx.shadowBlur = 0;
  },
});

// texts: what is split open, and what is behind it. colors: [ink, slit]
def({ id: 'split-reveal', n: 32, zh: '上下分離', en: 'Split reveal', family: 'switch', kind: 'switch', fitRatio: [0.36, 0.72],
  use: 'A transition with a surprise: the word cracks along its middle and opens to show the next one inside.',
  mood: 'transition / surprise', avoid: 'Revealing something less interesting than what was split; splitting small type.' }, {
  build(c) {
    c.stage.classList.add('tfx-g'); c.stage.style.color = c.col[0];
    for (const tx of c.texts) c.stage.append(h('span', 'tfx-hide', null, tx));
    c.slit = h('span', '', `position:absolute;left:-.1em;right:-.1em;top:50%;height:1em;margin-top:-.5em;background:${c.col[1]}`);
    c.nw = h('span', '', 'justify-self:center');
    c.top = h('span', '', 'justify-self:center;clip-path:inset(0 0 50% 0)'); c.bot = h('span', '', 'justify-self:center;clip-path:inset(50% 0 0 0)');
    c.stage.append(c.slit, c.nw, c.top, c.bot);
  },
  frame(c, p, t) {
    const { i, j, k } = sw(c, p, t);
    const a = T(c, i), b = T(c, j);
    if (c.top.textContent !== a) { c.top.textContent = a; c.bot.textContent = a; }
    if (c.nw.textContent !== b) c.nw.textContent = b;
    if (i === j) { c.top.style.opacity = c.bot.style.opacity = 0; c.slit.style.opacity = 0; c.nw.style.clipPath = ''; c.nw.style.transform = ''; return; }
    const d = 0.62 * E.inOut3(seg(k, 0, 0.6)) + 0.5 * E.in2(seg(k, 0.6, 1));
    c.top.style.transform = `translateY(${n4(-d)}em)`; c.bot.style.transform = `translateY(${n4(d)}em)`;
    c.top.style.opacity = c.bot.style.opacity = n4(1 - seg(k, 0.6, 0.95));
    c.slit.style.opacity = n4(d > 0 ? 1 - seg(k, 0.55, 0.9) : 0);
    c.slit.style.transform = `scaleY(${n4(Math.min(1, d * 1.6))})`;
    const g = Math.max(0, 50 - d * 85);
    c.nw.style.clipPath = k >= 0.95 ? '' : `inset(${n4(g)}% -10% ${n4(g)}% -10%)`;
    c.nw.style.transform = `scale(${n4(lerp(0.82, 1, E.out3(seg(k, 0.1, 0.9))))})`;
  },
});

/* =====================================================================================================
 * 風格 STYLE — raise the texture
 * ===================================================================================================== */

// colors: [outline, fill a, fill b, …]. rows: repeated rows
def({ id: 'outline-fill', n: 33, zh: '描邊填色', en: 'Outline fill', family: 'style', kind: 'continuous', field: true, defaults: { rows: 5 },
  stillT: (c) => (2.6 / c.o.speed) * (0.5 + Math.floor(c.o.rows / 2) * 0.16),
  use: 'Texture for an MV or a poster: rows of the word in outline, each colouring in and draining in sequence.',
  mood: 'texture / MV', avoid: 'More than one block of it per piece; filling rows in random order (the sequence is the effect).' }, {
  build(c) {
    const R = c.o.rows, W = c.W, H = c.H, F = Math.min(H / (R * 1.18), (W * 0.9) / emw(c.text));
    c.stage.style.cssText += `;display:flex;flex-direction:column;justify-content:center;align-items:center;font-size:${F}px;line-height:1.1`;
    const fills = c.col.slice(1).length ? c.col.slice(1) : ['#ff8a2b'];
    c.rows = [];
    for (let r = 0; r < R; r++) {
      const row = h('span', 'tfx-g');
      row.append(h('span', '', `color:transparent;-webkit-text-stroke:${n4(Math.max(1, F * 0.022))}px ${c.col[0]}`, c.text));
      const fill = h('span', '', `color:${fills[r % fills.length]}`, c.text);
      row.append(fill); c.stage.append(row); c.rows.push({ row, fill });
    }
  },
  frame(c, p, t) {
    const P = 2.6 / c.o.speed, R = c.rows.length;
    c.rows.forEach(({ row, fill }, r) => {
      const u = frac(t / P - r * 0.16);
      const inK = E.inOut2(seg(u, 0, 0.32)), outK = E.inOut2(seg(u, 0.62, 0.92));
      fill.style.clipPath = `inset(0 ${n4((1 - inK) * 100)}% 0 ${n4(outK * 100)}%)`;
      const k = E.out3(seg(p, (r / R) * 0.5, (r / R) * 0.5 + 0.5));
      row.style.opacity = n4(k); row.style.transform = `translateY(${n4((1 - k) * 0.4)}em)`;
    });
  },
});

// colors: [ink, split a, split b]. idle: 0–1 chance of t-driven glitch bursts after the entrance
def({ id: 'glitch', n: 34, zh: '故障錯位', en: 'Glitch', family: 'style', kind: 'entrance', defaults: { idle: 0 }, fitRatio: [0.38, 0.7],
  use: 'A hit for MV, tech or tension: the word arrives as broken signal, sliced and displaced, and locks clean.',
  mood: 'impact / MV', avoid: 'Permanent glitching; glitching body copy; glitch as the brand when nothing is broken.' }, {
  build(c) {
    c.stage.classList.add('tfx-g');
    const a = c.col[1] === '#ff5a4e' ? '#00e5ff' : c.col[1], b = c.col[2] === '#ffffff' ? '#ff2a6d' : c.col[2];
    c.ra = h('span', '', `color:${a};mix-blend-mode:screen`, c.text); c.rb = h('span', '', `color:${b};mix-blend-mode:screen`, c.text);
    c.base = h('span', '', `color:${c.col[0]}`, c.text);
    c.stage.append(c.ra, c.rb, c.base);
    c.S = 9; c.slices = Array.from({ length: c.S }, () => { const e = h('span', '', `color:${c.col[0]}`, c.text); c.stage.append(e); return e; });
  },
  frame(c, p, t) {
    let I = 1 - E.out2(seg(p, 0, 0.9));
    const bt = Math.floor(t * 12);
    if (c.o.idle > 0 && p >= 1 && hash(bt, 3, c.o.seed) < 0.12 * c.o.idle) I = Math.max(I, 0.35 + 0.4 * hash(bt, 4, c.o.seed));
    const step = I > 0 && p < 1 ? Math.floor(p * 30) : bt;
    const on = I < 0.02 ? 1 : (p < 0.12 ? (hash(step, 9, c.o.seed) > 0.35 ? 1 : 0.15) : 1);
    c.stage.style.opacity = p <= 0 ? 0 : on;
    if (I < 0.02) {
      c.base.style.opacity = 1; c.ra.style.opacity = c.rb.style.opacity = 0;
      for (const e of c.slices) e.style.opacity = 0;
      return;
    }
    c.base.style.opacity = 0;
    const off = 0.07 * I;
    c.ra.style.opacity = c.rb.style.opacity = n4(Math.min(1, I * 1.6));
    c.ra.style.transform = `translate(${n4(-off * (0.6 + hash(step, 1, c.o.seed)))}em,${n4(off * 0.2)}em)`;
    c.rb.style.transform = `translate(${n4(off * (0.6 + hash(step, 2, c.o.seed)))}em,${n4(-off * 0.2)}em)`;
    let y = 0;
    const cuts = Array.from({ length: c.S }, (_, q) => 0.4 + hash(step, 20 + q, c.o.seed));
    const sum = cuts.reduce((x, v) => x + v, 0);
    c.slices.forEach((e, q) => {
      const y1 = q === c.S - 1 ? 100 : y + (cuts[q] / sum) * 100;
      const r = hash(step, 40 + q, c.o.seed), big = r > 0.62 ? 1 : 0.18;
      e.style.opacity = 1;
      e.style.clipPath = `inset(${n4(y)}% -20% ${n4(100 - y1)}% -20%)`;
      e.style.transform = `translateX(${n4((r - 0.5) * 0.7 * I * big)}em)`;
      y = y1;
    });
  },
});

// colors: [shadow, stripe a, stripe b, stripe c]
def({ id: 'pattern-mask', n: 35, zh: '圖案遮罩', en: 'Pattern mask', family: 'style', kind: 'continuous', fitRatio: [0.42, 0.72],
  use: 'Fun and festival: candy stripes run inside the letters, the word sitting on a hard offset shadow like a sticker.',
  mood: 'fun / festival', avoid: 'Serious subjects; stripes so busy the letterforms dissolve.' }, {
  build(c) {
    c.stage.classList.add('tfx-g');
    const [sh, a, b, d] = [c.col[0], c.col[1] === '#ff5a4e' ? '#fff' : c.col[1], c.col[2] === '#ffffff' ? '#ffd23f' : c.col[2], c.col[3] ?? '#ff5a4e'];
    c.shadow = h('span', '', `color:${sh};transform:translate(.06em,.06em)`, c.text);
    c.pat = h('span', '', `position:relative;color:transparent;-webkit-text-stroke:.02em ${sh};background:repeating-linear-gradient(-45deg,${a} 0 .14em,${b} .14em .28em,${d} .28em .42em);-webkit-background-clip:text;background-clip:text;background-size:200% 200%`, c.text);
    c.stage.append(c.shadow, c.pat);
  },
  frame(c, p, t) {
    const per = 0.42 / Math.SQRT1_2;
    c.pat.style.backgroundPosition = `${n4(-frac(t * 0.9 * c.o.speed) * per)}em 0`;
    const k = seg(p, 0, 0.6);
    c.stage.style.opacity = k > 0 ? 1 : 0;
    c.stage.style.transform = `scale(${n4(E.backOut(k, 2))}) rotate(${n4((1 - E.out3(k)) * -6)}deg)`;
  },
});

// colors: [ink, shadow]. angle: base direction in degrees; swing: how far it turns
def({ id: 'long-shadow', n: 36, zh: '長影效果', en: 'Long shadow', family: 'style', kind: 'continuous', defaults: { angle: 45, swing: 30 }, fitRatio: [0.38, 0.66],
  use: 'A flat, graphic title: a long hard shadow falls from the word and turns slowly, as if the sun were moving.',
  mood: 'flat style', avoid: 'A shadow that changes nothing about the composition; translucent shadows (they band).' }, {
  build(c) {
    c.word = h('span', '', `display:inline-block;color:${c.col[0]}`, c.text);
    c.stage.append(c.word);
    c.sh = c.o.colors?.[1] ?? '#222';
  },
  frame(c, p, t) {
    const a = ((c.o.angle + c.o.swing * Math.sin(t * 0.45 * c.o.speed)) * Math.PI) / 180;
    const L = 0.85 * E.out3(seg(p, 0, 0.8)), n = 34, out = [];
    for (let l = 1; l <= n; l++) out.push(`${n4(Math.cos(a) * (l / n) * L)}em ${n4(Math.sin(a) * (l / n) * L)}em 0 ${c.sh}`);
    c.word.style.textShadow = out.join(',');
    c.word.style.opacity = n4(seg(p, 0, 0.12));
  },
});

// colors: [outline, liquid, back wave]. level: rest fill 0–1
def({ id: 'liquid-fill', n: 37, zh: '液體填滿', en: 'Liquid fill', family: 'style', kind: 'entrance', field: true, defaults: { level: 0.8 }, fitRatio: [0.5, 0.82],
  use: 'Fun or MV, or a progress that means something (a goal being met): liquid rises inside the outlines, its surface rolling.',
  mood: 'fun / MV', avoid: 'A fake progress bar; filling text that has no reason to hold liquid.' }, {
  build(c) {
    const W = c.W, H = c.H, F = Math.min(H * 0.5, (W * 0.82) / emw(c.text));
    const base = H / 2 + F * 0.36, id = `tfx-liq-${++UID}`;
    const svg = s('svg', { viewBox: `0 0 ${W} ${H}`, width: '100%', height: '100%', style: 'position:absolute;inset:0' }, c.stage);
    const ft = `font-family:${c.family.replace(/"/g, "'")};font-weight:${c.weight}`;
    const cp = s('clipPath', { id }, s('defs', {}, svg));
    s('text', { x: W / 2, y: base, 'text-anchor': 'middle', 'font-size': F, style: ft }, cp).textContent = c.text;
    const g = s('g', { 'clip-path': `url(#${id})` }, svg);
    c.back = s('path', { fill: c.col[2] === '#ffffff' ? '#ffd23f' : c.col[2] }, g);
    c.front = s('path', { fill: c.col[1] }, g);
    c.bubbles = Array.from({ length: 7 }, () => ({ e: s('circle', { fill: 'rgba(255,255,255,.55)' }, g), x: W / 2 + (c.rand() - 0.5) * emw(c.text) * F * 0.9, r: F * (0.012 + c.rand() * 0.02), ph: c.rand(), sp: 0.3 + c.rand() * 0.4 }));
    const out = s('text', { x: W / 2, y: base, 'text-anchor': 'middle', 'font-size': F, fill: 'none', stroke: c.col[0], 'stroke-width': Math.max(1.5, F * 0.022), style: ft }, svg);
    out.textContent = c.text;
    const mx = document.createElement('canvas').getContext('2d'); mx.font = c.font(F);
    const tm = mx.measureText(c.text);
    Object.assign(c, { F, yTop: base - (tm.actualBoundingBoxAscent || F * 0.9), yBot: base + (tm.actualBoundingBoxDescent || F * 0.12) });
  },
  frame(c, p, t) {
    const W = c.W, H = c.H, F = c.F, lev = c.o.level * E.inOut2(seg(p, 0, 0.92));
    const L = lerp(c.yBot, c.yTop - F * 0.06, lev), amp = F * 0.045 * (lev > 0 ? 1 : 0), lam = F * 1.15;
    const wave = (ph, dy, a) => { let d = `M0 ${H}`; for (let x = 0; x <= W + 8; x += 8) d += `L${x} ${n4(L + dy + a * Math.sin((TAU * x) / lam + ph))}`; return `${d}L${W} ${H}Z`; };
    c.front.setAttribute('d', wave(t * 2.4 * c.o.speed, 0, amp));
    c.back.setAttribute('d', wave(-t * 1.9 * c.o.speed + 2, -F * 0.035, amp * 0.8));
    for (const b of c.bubbles) {
      const u = frac(t * b.sp * c.o.speed + b.ph), y = lerp(c.yBot, L, u);
      b.e.setAttribute('cx', n4(b.x + Math.sin(u * 9 + b.ph * 6) * F * 0.02)); b.e.setAttribute('cy', n4(y)); b.e.setAttribute('r', n4(lev > 0.05 && y > L + b.r ? b.r : 0));
    }
  },
});

// colors: [ink, marker]. Works on wrapping reading copy: the text itself never moves. Keeps the element's own
// inline markup (a <span class="num"> inside the phrase keeps its face) unless text is given.
// pad: inline padding in em (default 0 for CJK-only text, .1 for Latin); the marker's soft ends scale with it
def({ id: 'highlighter', n: 38, zh: '螢光標記', en: 'Highlighter', family: 'style', kind: 'entrance', defaults: { font: 'inherit', weight: 'inherit' },
  use: 'Emphasis inside reading copy and explainers: a marker stroke is drawn behind the one phrase that matters.',
  mood: 'emphasis / explainer', avoid: 'Highlighting whole paragraphs, or three phrases per screen; animating the words themselves.' }, {
  build(c) {
    const m = c.col[1] === '#ff5a4e' ? '#ffe14d' : c.col[1], pad = padOf(c), em = (f) => `${n4(pad * f)}em`;
    c.stage.style.cssText += `;display:inline;white-space:normal;color:${c.col[0]};padding:0 ${pad}em;background-image:linear-gradient(100deg,transparent 0 ${em(0.8)},${m} ${em(1.6)} calc(100% - ${em(2)}),transparent calc(100% - ${em(0.6)}));background-repeat:no-repeat;background-position:0 86%`;
    c.stage.style.lineHeight = 'inherit';
    // inline children (mono digits, an <em>) are cloned into the drawn copy so they keep their styling
    if (c.markup && /<[a-z]/i.test(c.markup)) {
      c.stage.innerHTML = c.markup;
      // the copy is decoration: no duplicate ids, nothing in it takes focus
      for (const e of c.stage.querySelectorAll('[id]')) e.removeAttribute('id');
      for (const e of c.stage.querySelectorAll('a[href],button,input,select,textarea,[tabindex]')) e.setAttribute('tabindex', '-1');
    } else c.stage.textContent = c.text;
  },
  frame(c, p) { c.stage.style.backgroundSize = `${n4(E.inOut2(seg(p, 0, 1)) * 100)}% .46em`; },
});

// texts: one word (rest = split down the diagonal) or several (each sweep inverts to the next). colors: [a, b]
def({ id: 'split-invert', n: 39, zh: '雙色反轉', en: 'Split invert', family: 'style', kind: 'switch', field: true, defaults: { tilt: 14, swing: 1 }, fitRatio: [0.44, 0.8],
  use: 'A title or a switch with graphic snap: a diagonal boundary crosses the frame and everything behind it inverts.',
  mood: 'switch / title', avoid: 'Colours with weak contrast either way; a boundary that never stops moving under a title.' }, {
  build(c) {
    const lay = () => { const l = h('div', '', 'position:absolute;inset:0;display:grid;place-items:center'); const tx = h('span', '', 'line-height:1'); l.append(tx); c.stage.append(l); return { l, tx }; };
    c.A = lay(); c.B = lay();
  },
  frame(c, p, t) {
    const n = c.texts.length, pal = [[c.col[0], c.col[1]], [c.col[1], c.col[0]]];
    let i, j, X;
    if (n === 1) { i = 0; j = 0; X = lerp(-c.o.tilt - 2, 50, E.inOut3(p)) + Math.sin(t * 0.6 * c.o.speed) * 7 * c.o.swing * (p >= 1 ? 1 : 0); }
    else { const s0 = sw(c, p, t); i = s0.i; j = s0.j; X = i === j ? 120 : lerp(-c.o.tilt - 2, 100 + c.o.tilt + 2, E.inOut3(s0.k)); }
    const pa = pal[(i < 0 ? 0 : i) % 2], pb = pal[(n === 1 ? 1 : j) % 2];
    const paint = (L, txt, [bg, fg]) => { L.l.style.background = bg; L.l.style.color = fg; if (L.tx.textContent !== txt) L.tx.textContent = txt; };
    paint(c.A, T(c, Math.max(0, i)), pa); paint(c.B, T(c, j), pb);
    const tl = c.o.tilt;
    c.B.l.style.clipPath = `polygon(0 0,${n4(X + tl)}% 0,${n4(X - tl)}% 100%,0 100%)`;
  },
});

// colors: [ink, trail near, trail far]. trail: number of afterimages
def({ id: 'motion-trail', n: 40, zh: '殘影軌跡', en: 'Motion trail', family: 'style', kind: 'continuous', field: true, defaults: { trail: 9 }, fitRatio: [0.3, 0.5],
  use: 'Drift for an MV or a mood piece: the word floats through the frame dragging a wake of its own afterimages.',
  mood: 'drift / MV', avoid: 'Trails on fast UI text; a trail so dense the lead word cannot be found.' }, {
  build(c) {
    c.stage.style.cssText += ';display:grid;place-items:center';
    c.ghosts = [];
    for (let g = c.o.trail; g >= 1; g--) {
      const k = g / c.o.trail;
      const e = h('span', 'tfx-at', `line-height:1;color:color-mix(in srgb, ${c.col[1]} ${n4((1 - k) * 100)}%, ${c.col[2] === '#ffffff' ? c.col[1] : c.col[2]})`, c.text);
      c.stage.append(e); c.ghosts[g] = e;
    }
    c.lead = h('span', 'tfx-at', `line-height:1;color:${c.col[0]}`, c.text);
    c.stage.append(c.lead);
  },
  frame(c, p, t) {
    const W = c.W, H = c.H, v = c.o.speed;
    const pos = (pp, tt) => [(1 - E.out3(clamp(pp))) * -W * 0.8 + W * 0.17 * Math.sin(tt * 0.8 * v), H * 0.12 * Math.sin(tt * 1.3 * v), Math.sin(tt * 0.7 * v) * 4];
    const place = (e, [x, y, r]) => { e.style.transform = `translate(-50%,-50%) translate(${n4(x)}px,${n4(y)}px) rotate(${n4(r)}deg)`; };
    place(c.lead, pos(p, t));
    c.lead.style.opacity = p > 0 ? 1 : 0;
    for (let g = 1; g <= c.o.trail; g++) {
      place(c.ghosts[g], pos(p - g * 0.03, t - g * 0.1));
      c.ghosts[g].style.opacity = p > 0 ? n4(0.55 * (1 - g / (c.o.trail + 1)) ** 1.2) : 0;
    }
  },
});

/* =====================================================================================================
 * 得獎 AWARD — restraint, from Site-of-the-Month winners
 * Quiet moves for reading-heavy films: the words are present and legible almost the whole time.
 * ===================================================================================================== */

// texts: one (an entrance from blank) or several (each change rolls through the slits).
// colors: [ink]. bands: horizontal slices. gap: em of film between frames. order: 'down' (top band first) or 'random'.
// bleed: em the top and bottom slits open past the line box (default .12), so the roll stays inside the line
def({ id: 'slit-scan', n: 41, zh: '片幅捲動', en: 'Slit scan', family: 'award', kind: 'switch', defaults: { weight: 700, bands: 7, gap: 0.5, order: 'down' }, fitRatio: [0.3, 0.8],
  use: 'A title or chapter card for a film-minded piece: the line is cut into horizontal slits that roll like a reel at different speeds and lock into one clean line.',
  mood: 'film / editorial', avoid: 'Rolling body copy; random slip amounts that read as a glitch; leaving the bands unlocked at rest.' }, {
  build(c) {
    const st = c.stage, N = c.o.bands, lh = 1.15;
    st.classList.add('tfx-g'); st.style.color = c.col[0]; st.style.lineHeight = String(lh);
    for (const tx of c.texts) st.append(h('span', 'tfx-hide', 'justify-self:center', tx));
    c.solid = h('span', '', 'justify-self:center;white-space:pre');
    st.append(c.solid);
    c.pitch = lh + c.o.gap;
    c.bands = [];
    for (let b = 0; b < N; b++) {
      // slits share out the ink (≈ .16–1em of the 1.15em line), not the empty leading above the caps
      const cut = (q) => ((0.16 + 0.84 * (q / N)) / lh) * 100;
      // the outer slits open only by `bleed` (em) past the line, enough for ascenders and descenders, so a rolling
      // copy never rises into the line above or hangs into the one below
      const bl = ((c.o.bleed ?? 0.12) / lh) * 100, top = b === 0 ? -bl : cut(b), bot = b === N - 1 ? 100 + bl : cut(b + 1);
      const band = h('span', '', `display:block;height:${lh}em;overflow:visible;clip-path:inset(calc(${n4(top)}% - .5px) -.4em calc(${n4(100 - bot)}% - .5px) -.4em)`);   // .5px overlap: no seams
      const strip = h('span', '', 'display:flex;flex-direction:column;align-items:center');
      const a = h('span', '', `display:block;height:${lh}em;white-space:pre`), z = h('span', '', `display:block;height:${lh}em;margin-top:${c.o.gap}em;white-space:pre`);
      strip.append(a, z); band.append(strip); st.append(band);
      const base = c.o.order === 'random' ? c.rand() : b / Math.max(1, N - 1);
      const lag = clamp(base * 0.4 + (c.rand() - 0.5) * 0.1, 0, 0.42);
      c.bands.push({ band, strip, a, z, lag });
    }
  },
  frame(c, p, t) {
    const { i, j, k } = sw(c, p, t);
    const rest = i === j || k <= 0 || k >= 1;
    // at rest one solid copy shows: no seams between the slits, the line is simply the line
    const v = rest ? (k > 0 || i === j ? T(c, j) : T(c, i)) : '';
    if (c.solid.textContent !== v) c.solid.textContent = v;
    for (const x of c.bands) {
      x.band.style.visibility = rest ? 'hidden' : '';
      if (rest) continue;
      const a = T(c, i), b = T(c, j);
      if (x.a.textContent !== a) x.a.textContent = a;
      if (x.z.textContent !== b) x.z.textContent = b;
      const y = E.inOut3(seg(k, x.lag, x.lag + 0.58));
      x.strip.style.transform = `translateY(${n4(-y * c.pitch)}em)`;
    }
  },
});

// A paragraph or quote, fully present from the start, lit in reading order. colors: [ink].
// unit: 'word' (CJK still per character) or 'char'. dim: opacity of the unread copy. soft: width of the lit front, in units.
// dimInk: a grey ink for the unread copy instead of opacity
def({ id: 'read-fill', n: 42, zh: '閱讀填色', en: 'Read fill', family: 'award', kind: 'entrance', defaults: { font: 'inherit', weight: 'inherit', unit: 'word', dim: 0.2, soft: 3 },
  use: 'A statement paragraph or a quote that the scroll reads aloud: dim copy brightens to full ink word by word, in reading order, under a soft front.',
  mood: 'manifesto / quote', avoid: 'Starting from invisible (the copy must read from the first frame); a hard tick per word; more than one lit paragraph per screen.' }, {
  build(c) {
    const st = c.stage;
    st.style.cssText += `;display:block;white-space:normal;color:${c.col[0]}`;
    st.style.lineHeight = 'inherit';
    c.units = [];
    for (const tk of tokens(c.text, c.o.unit === 'char' ? 'char' : 'word')) {
      if (tk.space) { st.append(tk.t === '\n' ? h('br') : document.createTextNode(' ')); continue; }
      const e = h('span', '', null, tk.t); st.append(e); c.units.push(e);
    }
  },
  frame(c, p) {
    const n = c.units.length, soft = Math.max(1, c.o.soft), x = clamp(p) * (n + soft);
    c.units.forEach((e, i) => {
      const k = clamp((x - i) / soft), v = k * k * (3 - 2 * k);
      if (c.o.dimInk) e.style.color = v >= 1 ? '' : `color-mix(in srgb, ${c.col[0]} ${n4(v * 100)}%, ${c.o.dimInk})`;
      else e.style.opacity = v >= 1 ? '' : n4(lerp(c.o.dim, 1, v));
    });
  },
});

// colors: [ink]. blur: px at the start. track: em of extra tracking at the start.
// out: true turns p into the exit instead: 0 sharp → 1 the whole block blurred away (its rest pose is then empty, as an exit's is)
def({ id: 'blur-resolve', n: 43, zh: '失焦對焦', en: 'Blur resolve', family: 'award', kind: 'entrance', defaults: { font: 'inherit', weight: 'inherit', blur: 11, track: 0.14, out: false }, fitRatio: [0.3, 0.84],
  use: 'A calm title or a line of a statement coming into focus: words arrive out of a soft blur, slightly tracked out, and settle sharp one after another.',
  mood: 'calm / premium', avoid: 'Blurring a long paragraph word by word; a blur that never fully resolves; pairing it with motion of the same text.' }, {
  build(c) {
    c.stage.style.color = c.col[0];
    c.units = [];
    for (const tk of tokens(c.text, 'word')) {
      if (tk.space) { c.stage.append(tk.t === '\n' ? h('br') : h('span', 'tfx-s', null, ' ')); continue; }
      const g = h('span', 'tfx-g'), live = h('span', '', 'justify-self:center;white-space:pre', tk.t);
      g.append(h('span', 'tfx-hide', 'white-space:pre', tk.t), live);
      c.stage.append(g); c.units.push({ live, one: graphemes(tk.t).length === 1 });
    }
  },
  frame(c, p) {
    const n = c.units.length, mid = (n - 1) / 2, B = c.o.blur, L = c.o.track;
    const pose = (x, i, u) => {
      const s = x.live.style;
      s.filter = u > 0.002 ? `blur(${n4(B * u)}px)` : '';
      s.opacity = n4(clamp(1 - u * 1.08));
      s.letterSpacing = x.one || u <= 0 ? '' : `${n4(L * u)}em`;
      s.transform = u <= 0 ? '' : `translateX(${n4((i - mid) * 0.05 * u - (x.one ? 0 : (L * u) / 2))}em)`;
    };
    if (c.o.out) { const u = E.in2(clamp(p)); c.units.forEach((x, i) => pose(x, i, u)); return; }
    c.units.forEach((x, i) => {
      const d = n > 1 ? (i / (n - 1)) * 0.4 : 0;
      pose(x, i, 1 - E.out3(seg(p, d, d + 0.6)));
    });
  },
});

// colors: [ink, accent (stroke, handles, label), paper (handle fill, label text)].
// target: the substring to select (default: the last word of multi-word text, else the whole string — "52,470"
// selects all of it; pass target for one word of a CJK phrase). label: true (W ×), a string, or false.
// labelFont: the size label's family (default: the effect's own family).
// invert: true fills the box with the accent and turns the word paper; false (default) turns the word the accent
def({ id: 'select-box', n: 44, zh: '選取框', en: 'Select box', family: 'award', kind: 'entrance', defaults: { weight: 800, label: true, invert: false }, fitRatio: [0.3, 0.8],
  use: 'A design-minded headline that points at its key word: a design-tool selection frame draws round it, its handles pop, a size label appears, and the word changes colour.',
  mood: 'design / brand', avoid: 'Selecting more than one word per screen; a selection on body copy; a label with a fake number.' }, {
  build(c) {
    const tx = c.text;
    let target = c.o.target;
    if (!target || !tx.includes(target)) target = /\s/.test(tx.trim()) ? tx.trim().split(/\s+/).pop() : tx.trim();
    const at = tx.lastIndexOf(target);
    const accent = c.o.colors?.[1] ?? '#2f5bff', paper = c.o.colors?.[2] ?? '#ffffff';
    c.stage.style.color = c.col[0];
    const word = h('span', '', 'position:relative;display:inline-block;white-space:pre', target);
    c.stage.append(document.createTextNode(tx.slice(0, at)), word, document.createTextNode(tx.slice(at + target.length)));
    // CJK has no word spaces: the selected word gets a little air so the frame never sits on its neighbours
    const cjk = graphemes(target).some(isCJK), inset = cjk ? 'left:-.1em;right:-.1em;top:.01em;bottom:-.03em' : 'left:-.08em;right:-.08em;top:.06em;bottom:.02em';
    if (cjk) word.style.margin = '0 .16em';
    c.fill = h('span', '', `position:absolute;${inset};background:${accent};z-index:-1`);
    c.flip = h('span', '', `position:absolute;left:0;top:0;white-space:pre;color:${c.o.invert ? paper : accent}`, target);
    c.box = h('span', '', `position:absolute;${inset}`);
    word.style.isolation = 'isolate';
    word.append(c.fill, c.flip, c.box);
    if (!c.o.invert) c.fill.style.display = 'none';
    const sw0 = c.o.stroke ?? Math.max(1, Math.round(c.fs / 110));
    const svg = s('svg', { style: 'position:absolute;inset:0;width:100%;height:100%' }, c.box);
    c.rect = s('rect', { x: 0, y: 0, width: '100%', height: '100%', fill: 'none', stroke: accent, 'stroke-width': sw0, pathLength: 1, 'stroke-dasharray': '1 1', 'shape-rendering': 'crispEdges' }, svg);
    const hs = clamp(Math.round(c.fs * 0.065), 6, 11);
    c.handles = [[0, 0], [100, 0], [100, 100], [0, 100]].map(([x, y]) => {
      const e = h('span', '', `position:absolute;left:${x}%;top:${y}%;width:${hs}px;height:${hs}px;margin:${-hs / 2}px 0 0 ${-hs / 2}px;box-sizing:border-box;background:${paper};border:${sw0}px solid ${accent}`);
      c.box.append(e); return e;
    });
    c.label = null;
    if (c.o.label !== false) {
      const lf = clamp(Math.round(c.fs * 0.1), 10, 15);
      const txt = typeof c.o.label === 'string' ? c.o.label : `W ${Math.round(c.box.offsetWidth)}`;
      c.label = h('span', '', `position:absolute;left:50%;top:100%;margin-top:${Math.round(hs * 0.9)}px;font:600 ${lf}px/1 ${c.o.labelFont || c.family};letter-spacing:.02em;font-variant-numeric:tabular-nums;padding:.32em .5em;border-radius:.28em;background:${accent};color:${paper};white-space:nowrap`, txt);
      c.box.append(c.label);
    }
  },
  frame(c, p) {
    const kb = E.inOut2(seg(p, 0, 0.4));
    c.rect.style.strokeDashoffset = n4(1 - kb);
    c.rect.style.opacity = kb > 0 ? 1 : 0;
    c.handles.forEach((e, q) => {
      const k = seg(p, 0.36 + q * 0.04, 0.52 + q * 0.04);
      e.style.opacity = k > 0 ? 1 : 0;
      e.style.transform = k >= 1 ? '' : `scale(${n4(E.backOut(k, 2.6))})`;
    });
    if (c.label) {
      const k = seg(p, 0.52, 0.7);
      c.label.style.opacity = n4(E.out2(k));
      c.label.style.transform = `translate(-50%,${n4((1 - E.out3(k)) * -5)}px)`;
    }
    const f = E.inOut3(seg(p, 0.66, 0.94)), clip = `inset(-20% ${n4((1 - f) * 100)}% -20% 0)`;
    c.flip.style.clipPath = f >= 1 ? '' : clip;
    c.flip.style.opacity = f > 0 ? 1 : 0;
    c.fill.style.clipPath = f >= 1 ? '' : `inset(0 ${n4((1 - f) * 100)}% 0 0)`;
  },
});

/** Ids in catalogue order. */
export const ORDER = Object.values(EFFECTS).sort((a, b) => a.n - b.n).map((m) => m.id);
