/* grade.js — the DOM grade.  Cinematic UI kit.
 *
 * The 3D stage grades its own canvas (`stage.look`, a WebGL post pass). A site made of DOM (photographs,
 * footage, canvases, type) has no such pass, so its pictures never share a film look. This is the same
 * grade for the DOM, with the same parameter names and neutral defaults:
 *
 *   media   an inline SVG filter (white balance, contrast, saturation, split-tone, lift, aberration, bloom,
 *           halation) applied with CSS `filter:url(#…)` to img / video / canvas / picture / [data-grade].
 *           Text and controls are NOT filtered: ground and ink stay your CSS tokens (scope:'frame' grades
 *           the whole scene frame, type included, when the film wants one print).
 *   print   fixed, pointer-events:none, aria-hidden layers above the page: light leak, fade, vignette,
 *           grain (a pre-generated noise tile, stepped at 24 fps); plus gate weave on one element.
 *           A layer does not exist while its value is 0, and the filter is not applied while the look is neutral.
 *
 *   import { createGrade, rgb, applyLook } from './grade.js';
 *   const grade = createGrade({ spec: { palette: ['#0e1a1c', '#d9a441'], ground: '#0e1a1c', ink: '#f3e9d2' } });
 *   applyLook(grade.look, { saturation: 0.85, temperature: 0.3, lift: 0.04, grain: 0.05, vignette: 0.25 });
 *   gsap.to(grade.look, { exposure: 0.8, duration: 2, onUpdate: grade.update });   // look is plain numbers: tween it
 *
 * Time (kit rule 3): this file never reads a clock. Grain, weave and leak are pure functions of the `t` you
 * give `render(t)`. With a reel on the page (window.__reel, or `clock: reel`) the grade subscribes to
 * `reel.onFrame` and every screened / recorded frame is reproducible from its time. In a film built on
 * film.js pass `clock: film` (anything with onFrame(fn), fn receiving seconds or { time }) or call
 * `film.onFrame((t) => grade.render(t))`. With no clock at all it runs its own rAF — only while grain, weave
 * or leak are on — using the timestamp rAF hands it.
 */

/** Deterministic random (same as stage.js). */
export function seeded(seed = 1) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** '#0e3a4a' → { r, g, b } in display space, for tweening grade tints (same as stage.js). */
export function rgb(hex) {
  const n = parseInt(hex.replace('#', ''), 16);
  return { r: ((n >> 16) & 255) / 255, g: ((n >> 8) & 255) / 255, b: (n & 255) / 255 };
}

/** A fresh look with everything neutral or zero. Names and neutrals match stage.look; the rest are DOM extras.
 *  Colours (fadeColor, halationColor, leakColor) only matter once their effect is above 0. Radii are px at a
 *  1440-wide viewport (they scale with the viewport width). */
export function neutral() {
  return {
    exposure: 1, contrast: 1, saturation: 1, temperature: 0, tint: 0, lift: 0,
    split: 0, shadows: { r: 0.5, g: 0.5, b: 0.5 }, highlights: { r: 0.5, g: 0.5, b: 0.5 },
    vignette: 0, grain: 0, aberration: 0,
    bloom: 0, bloomThreshold: 0.72, bloomRadius: 8,           // DOM threshold is display-space (0..1), not scene-linear: 0.72 = the top ~third of the range
    fade: 0, fadeColor: { r: 0, g: 0, b: 0 },
    halation: 0, halationColor: { r: 1, g: 0.32, b: 0.12 }, halationThreshold: 0.62, halationRadius: 20,
    weave: 0,                                                 // gate weave amplitude in px (try 0.6–1.5)
    leak: 0, leakColor: { r: 1, g: 0.45, b: 0.15 },
    grainSize: 1,                                             // grain cell in device px
  };
}

const COLOR_KEYS = new Set(['shadows', 'highlights', 'fadeColor', 'halationColor', 'leakColor']);
/** Write a preset (plain object; colours may be '#hex' or { r, g, b }) into a look. `reset: true` starts from neutral. */
export function applyLook(look, preset = {}, { reset = false } = {}) {
  if (reset) { const n = neutral(); for (const k in n) { if (COLOR_KEYS.has(k)) Object.assign(look[k], n[k]); else look[k] = n[k]; } }
  for (const k in preset) {
    const v = preset[k];
    if (COLOR_KEYS.has(k)) { const c = typeof v === 'string' ? rgb(v) : v; look[k] ??= { r: 0, g: 0, b: 0 }; Object.assign(look[k], c); }
    else look[k] = v;
  }
  return look;
}

/* ---------- small pure helpers ---------- */
const W = [0.2126, 0.7152, 0.0722];                          // the stage's luma weights
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };
const lum = (c) => c.r * W[0] + c.g * W[1] + c.b * W[2];
const css = (c, a = 1) => `rgb(${Math.round(clamp(c.r) * 255)} ${Math.round(clamp(c.g) * 255)} ${Math.round(clamp(c.b) * 255)} / ${+a.toFixed(4)})`;
const num = (x) => +x.toFixed(5);
/** Integer hash → 0..1. Random access by frame index, so any t gives the same value in any order. */
const hash = (i, s = 0) => {
  let h = (Math.imul(i | 0, 374761393) + Math.imul(s | 0, 668265263)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177); h ^= h >>> 16;
  return (h >>> 0) / 4294967296;
};
const vnoise = (x, s) => { const i = Math.floor(x), f = x - i, u = f * f * (3 - 2 * f); return hash(i, s) * (1 - u) + hash(i + 1, s) * u; };
const EPS = 1e-4;

/* The split-tone weights, as lookup tables (feComponentTransfer 'table' interpolates linearly between them). */
const table = (fn, n = 17) => Array.from({ length: n }, (_, i) => num(fn(i / (n - 1)))).join(' ');
const T_SHADOW = table((l) => 1 - smooth(0, 0.55, l)), T_HIGH = table((l) => smooth(0.45, 1, l));

const NS = 'http://www.w3.org/2000/svg';
let serial = 0;

export function createGrade(options = {}) {
  const o = {
    look: null,
    targets: null,                // CSS selector of what to colour-grade. Default by scope
    scope: 'media',               // 'media' → img, video, canvas, picture, [data-grade] · 'frame' → whole scene frames, type included
    spec: null,                   // the GRADE target the screening checks frames against (published, never enforced here)
    clock: null,                  // reel | film | { onFrame(fn) } | 'manual' (you call render(t)). Default: window.__reel, else own rAF
    tier: 'auto',                 // 'full' | 'lite' (one blur for bloom + halation) | 'min' (no blurs) | 'auto'
    weaveTarget: 'main',          // selector of the element that weaves (transform-free: uses CSS `translate` / `rotate`)
    z: 2147483000, seed: 7, fps: 24, id: null,
    ...options,
  };
  const doc = document, root = doc.documentElement;
  const id = o.id || `grade-fx-${++serial}`;
  const look = neutral();
  applyLook(look, o.look || {});

  const mqReduced = matchMedia('(prefers-reduced-motion: reduce)');
  let reduced = mqReduced.matches;
  let tier = o.tier === 'auto' ? autoTier() : o.tier;
  function autoTier() {         // phones and weak devices lose the second blur first
    const coarse = matchMedia('(pointer: coarse)').matches;
    return (coarse && innerWidth < 900) || (navigator.deviceMemory && navigator.deviceMemory <= 2) ? 'lite' : 'full';
  }

  /* ---------- scaffolding: the filter's home and the CSS that applies it ---------- */
  const svg = doc.createElementNS(NS, 'svg');
  svg.setAttribute('aria-hidden', 'true'); svg.setAttribute('focusable', 'false');
  svg.setAttribute('width', '0'); svg.setAttribute('height', '0');
  svg.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;pointer-events:none';
  const filt = doc.createElementNS(NS, 'filter');
  filt.setAttribute('id', id); filt.setAttribute('color-interpolation-filters', 'sRGB');   // the stage grades in display space: no linearRGB detour
  for (const [k, v] of Object.entries({ x: '0', y: '0', width: '100%', height: '100%' })) filt.setAttribute(k, v);
  svg.append(filt); root.append(svg);

  const T = o.targets || (o.scope === 'frame' ? '[data-scene] > .frame' : 'img, video, canvas, picture, [data-grade]');
  const style = doc.createElement('style');
  style.dataset.grade = '';
  // A target inside a target (img in picture, canvas in [data-grade]) is not graded twice.
  style.textContent = `html.grade-on :is(${T}):not([data-grade="off"]){filter:url(#${id})}\nhtml.grade-on :is(${T}) :is(${T}){filter:none}`;
  doc.head.append(style);

  /* ---------- the filter: the stage's maths, as far as SVG allows ---------- */
  const fills = [];
  let struct = '', filterOn = false, unit = 1;
  const E = {};                                              // effective values, derived from look on every change

  function derive() {
    unit = clamp(innerWidth / 1440, 0.5, 1.6);
    const bl = tier === 'min' ? 0 : look.bloom, ha = tier === 'min' ? 0 : look.halation;
    E.bloom = bl; E.halation = ha;
    E.lite = tier === 'lite' && bl > EPS && ha > EPS;        // lite: one blur carries both
    E.grain = reduced ? Math.min(look.grain, 0.02) : look.grain;
  }
  const hasSplit = () => look.split > EPS && (Math.abs(look.shadows.r - look.shadows.g) + Math.abs(look.shadows.g - look.shadows.b) + Math.abs(look.highlights.r - look.highlights.g) + Math.abs(look.highlights.g - look.highlights.b) > EPS
    || Math.abs(lum(look.shadows) - 0.5) > EPS || Math.abs(lum(look.highlights) - 0.5) > EPS);
  const mediaActive = () => Math.abs(look.exposure - 1) > EPS || Math.abs(look.contrast - 1) > EPS || Math.abs(look.saturation - 1) > EPS
    || Math.abs(look.temperature) > EPS || Math.abs(look.tint) > EPS || look.lift > EPS || hasSplit() || look.aberration > EPS || E.bloom > EPS || E.halation > EPS;

  /* white balance → contrast about .5 → saturation, which are all linear, fold into ONE feColorMatrix.
     Exposure: the stage multiplies scene-linear light; here a display-space gain of exposure^(1/2.2) is the same
     thing for mid-tones (highlights clip sooner than they would in HDR). */
  function baseMatrix() {
    const g = Math.pow(Math.max(look.exposure, 0), 1 / 2.2);
    const wb = [1 + look.temperature * 0.12, 1 - look.tint * 0.08, 1 - look.temperature * 0.12];
    const k = look.contrast, s = look.saturation;
    const rows = [0, 1, 2].map((i) => [0, 1, 2].map((j) => ((i === j ? s : 0) + (1 - s) * W[j]) * wb[j] * g * k));
    const b = 0.5 * (1 - k);                                 // contrast pivot; saturation leaves a grey offset unchanged
    return { rows, off: [b, b, b] };
  }
  const mstr = (rows, off) => rows.map((r, i) => `${r.map(num).join(' ')} 0 ${num(off[i])}`).join(' ') + ' 0 0 0 0 1';   // alpha row: a' = 1
  // (alpha is forced to 1 through the chain and restored from SourceAlpha at the end, so premultiplied maths stays honest)
  const liftOf = (m) => { const l = look.lift; return { rows: m.rows.map((r) => r.map((x) => x * (1 - l))), off: m.off.map((x) => x * (1 - l) + l) }; };
  const diag = (a, b, c, off = 0) => ({ rows: [[a, 0, 0], [0, b, 0], [0, 0, c]], off: [off, off, off] });
  const LUMA = { rows: [W, W, W], off: [0, 0, 0] };
  const CH = (i) => ({ rows: [0, 1, 2].map((r) => [0, 1, 2].map((c) => (r === i && c === i ? 1 : 0))), off: [0, 0, 0] });
  const thrAttrs = (th) => { th = clamp(th, 0, 0.98); const s = 1 / (1 - th); return { type: 'linear', slope: num(s), intercept: num(-th * s) }; };

  function buildFilter() {
    fills.length = 0; filt.replaceChildren();
    const mk = (name, fn, parent = filt, extra = {}) => {
      const e = doc.createElementNS(NS, name);
      for (const k in extra) e.setAttribute(k, extra[k]);
      const f = () => { const a = fn(); for (const k in a) { const v = String(a[k]); if (e.getAttribute(k) !== v) e.setAttribute(k, v); } };   // touch only what changed
      fills.push(f); f(); parent.append(e); return e;
    };
    let n = 0, cur = 'SourceGraphic';
    const step = (name, inn, fn, extra = {}) => { const result = 'p' + n++; mk(name, fn, filt, { in: inn, result, ...extra }); return result; };
    const matrix = (inn, get) => step('feColorMatrix', inn, () => { const m = get(); return { type: 'matrix', values: mstr(m.rows, m.off) }; });
    const funcs = (name, inn, fn) => {                       // feComponentTransfer with the same func on R, G, B
      const result = 'p' + n++; const e = mk(name, () => ({}), filt, { in: inn, result });
      for (const ch of ['R', 'G', 'B']) mk('feFunc' + ch, fn, e);
      return result;
    };
    const mix = (name, inn, in2, fn) => step(name, inn, () => ({ in2, ...fn() }));
    const add = (inn, in2) => mix('feComposite', inn, in2, () => ({ operator: 'arithmetic', k1: 0, k2: 1, k3: 1, k4: -0.5 }));
    const sum = (inn, in2) => mix('feComposite', inn, in2, () => ({ operator: 'arithmetic', k1: 0, k2: 1, k3: 1, k4: 0 }));

    const split = hasSplit();
    cur = matrix(cur, () => { const m = baseMatrix(); return !split && look.lift > EPS ? liftOf(m) : m; });

    if (look.aberration > EPS) {                             // approximation: a uniform red/blue offset (the stage's is radial)
      const px = () => num(look.aberration * 150 * unit);
      const r = step('feOffset', matrix(cur, () => CH(0)), () => ({ dx: px(), dy: 0 }));
      const gch = matrix(cur, () => CH(1));
      const b = step('feOffset', matrix(cur, () => CH(2)), () => ({ dx: -px(), dy: 0 }));
      cur = sum(sum(r, gch), b);
    }

    if (split) {
      // The stage adds (tint − its luma) × weight(luma) per band, then lifts: (c + s)(1 − lift) + lift. Here: grey luma → weight
      // table → signed offset carried at +0.5 → added with k4 = −0.5. Lift is applied first and the offsets scaled by (1 − lift),
      // which is the same sum and keeps negative offsets unclamped until the end, as in the shader. Bands use the stage's smoothsteps
      // (sampled at 17 points).
      const l = matrix(cur, () => LUMA);
      const band = (tbl, col) => {
        const w = funcs('feComponentTransfer', l, () => ({ type: 'table', tableValues: tbl }));
        return matrix(w, () => {
          const c = look[col], y = lum(c), v = [c.r - y, c.g - y, c.b - y].map((x) => clamp(x * look.split * (1 - look.lift), -0.5, 0.5));
          return diag(v[0], v[1], v[2], 0.5);
        });
      };
      const ts = band(T_SHADOW, 'shadows'), th = band(T_HIGH, 'highlights');
      if (look.lift > EPS) cur = matrix(cur, () => diag(1 - look.lift, 1 - look.lift, 1 - look.lift, look.lift));
      cur = add(add(cur, ts), th);
    }

    /* Bloom and halation: threshold the graded picture → (tint) → blur → screen back over it. Bloom keeps the
       highlight's own colour; halation is the film-base glow, tinted halationColor. */
    const glow = (th, gain, rad) => {
      const t = funcs('feComponentTransfer', cur, () => thrAttrs(th()));
      const m = matrix(t, () => gain());
      return step('feGaussianBlur', m, () => ({ stdDeviation: num(Math.max(0.1, rad() * unit)) }));
    };
    const bloomGain = () => { const k = E.bloom * 1; return diag(k, k, k); };
    const halGain = () => { const c = look.halationColor, k = E.halation * 1.2; return { rows: [c.r, c.g, c.b].map((h) => W.map((w) => h * w * k)), off: [0, 0, 0] }; };
    if (E.lite) {                                            // one blur: highlights·bloom + tinted luma·halation
      const t = Math.min(look.bloomThreshold, look.halationThreshold);
      const g = glow(() => t, () => { const a = bloomGain().rows, h = halGain().rows; return { rows: a.map((r, i) => r.map((x, j) => x + h[i][j])), off: [0, 0, 0] }; }, () => (look.bloomRadius + look.halationRadius) / 2);
      cur = mix('feBlend', cur, g, () => ({ mode: 'screen' }));
    } else {
      if (E.bloom > EPS) cur = mix('feBlend', cur, glow(() => look.bloomThreshold, bloomGain, () => look.bloomRadius), () => ({ mode: 'screen' }));
      if (E.halation > EPS) cur = mix('feBlend', cur, glow(() => look.halationThreshold, halGain, () => look.halationRadius), () => ({ mode: 'screen' }));
    }
    mix('feComposite', cur, 'SourceAlpha', () => ({ operator: 'in' }));   // restore the picture's own alpha
  }

  function syncFilter() {
    const active = mediaActive();
    if (active !== filterOn) { filterOn = active; root.classList.toggle('grade-on', active); }
    if (!active) { if (struct) { struct = ''; filt.replaceChildren(); fills.length = 0; } return; }
    const s = [hasSplit(), look.lift > EPS, look.aberration > EPS, E.bloom > EPS, E.halation > EPS, E.lite].join();
    if (s !== struct) { struct = s; buildFilter(); } else fills.forEach((f) => f());    // same shape: only the numbers change
  }

  /* ---------- print layers ---------- */
  const layers = {};
  const BASE = `position:fixed;left:0;top:0;width:100%;height:100vh;height:100lvh;pointer-events:none;`;
  function layer(name, on, cssText, fn) {
    let el = layers[name];
    if (!on) { if (el) { el.remove(); delete layers[name]; } return null; }
    if (!el) {
      el = doc.createElement('div'); el.setAttribute('aria-hidden', 'true'); el.dataset.gradeLayer = name;
      el.style.cssText = BASE + `z-index:${o.z + Object.keys(LAYER_Z).indexOf(name)};` + cssText;
      layers[name] = el; root.append(el);
    }
    fn(el); return el;
  }
  const LAYER_Z = { leak: 0, fade: 1, vignette: 2, grain: 3 };
  let tileUrl = '', tileSize = 256, lastKeyV = '';
  function makeTile() {
    const c = doc.createElement('canvas'); c.width = c.height = 256;
    const x = c.getContext('2d'), img = x.createImageData(256, 256), r = seeded(o.seed);
    for (let i = 0; i < img.data.length; i += 4) { img.data[i] = img.data[i + 1] = img.data[i + 2] = (r() * 256) | 0; img.data[i + 3] = 255; }
    x.putImageData(img, 0, 0);
    return c.toDataURL('image/png');
  }

  function syncLayers() {
    layer('leak', look.leak > EPS, 'mix-blend-mode:screen;overflow:hidden;', (el) => {
      if (!el.firstChild) { const d = doc.createElement('div'); d.style.cssText = 'position:absolute;inset:-12%;will-change:transform,opacity'; el.append(d); }
      const c = look.leakColor, w = { r: c.r + (1 - c.r) * 0.4, g: c.g + (1 - c.g) * 0.4, b: c.b + (1 - c.b) * 0.4 };
      el.firstChild.style.background =
        `radial-gradient(ellipse 52% 70% at 0% 34%, ${css(c, 1)} 0%, ${css(c, 0.5)} 38%, ${css(c, 0)} 100%),` +
        `radial-gradient(ellipse 38% 50% at 100% 84%, ${css(w, 0.85)} 0%, ${css(w, 0)} 100%),` +
        `radial-gradient(ellipse 60% 28% at 62% 0%, ${css(c, 0.5)} 0%, ${css(c, 0)} 100%)`;
    });
    layer('fade', look.fade > EPS, '', (el) => { el.style.background = css(look.fadeColor); el.style.opacity = String(clamp(look.fade)); });
    layer('vignette', look.vignette > EPS, '', (el) => {
      const k = look.vignette.toFixed(4); if (k === lastKeyV && el.style.background) return; lastKeyV = k;
      // the stage: c *= 1 − v·smoothstep(.18, .78, length(uv − .5)); black at that alpha is the same multiply. 50% of the ellipse = .5 uv.
      const stops = [`rgb(0 0 0 / 0) 0%`];
      for (let i = 0; i <= 12; i++) { const x = 0.18 + (0.6 * i) / 12; stops.push(`rgb(0 0 0 / ${+(look.vignette * smooth(0.18, 0.78, x)).toFixed(4)}) ${+(x * 200).toFixed(2)}%`); }
      el.style.background = `radial-gradient(ellipse 50% 50% at 50% 50%, ${stops.join(',')})`;
    });
    layer('grain', E.grain > EPS, 'overflow:hidden;', (el) => {
      if (!tileUrl) tileUrl = makeTile();
      tileSize = (256 * look.grainSize) / (devicePixelRatio || 1);                 // one noise pixel = grainSize device px
      // Overlay-blended grey noise at opacity = grain: on a mid grey that is ±grain/2, the shader's amplitude, and it thins out in
      // deep shadows and highlights as the shader's luminance weight does. The tile is shifted per frame inside an oversized box.
      el.style.opacity = String(clamp(E.grain)); el.style.mixBlendMode = 'overlay';
      el.style.background = `url(${tileUrl}) 0 0 / ${tileSize}px ${tileSize}px`;
      el.style.inset = `${-tileSize}px`; el.style.width = `calc(100% + ${2 * tileSize}px)`; el.style.height = `calc(100lvh + ${2 * tileSize}px)`;
    });
  }

  /* ---------- time: everything below is a pure function of t ---------- */
  let lastT = 0, weaveEl = null;
  function frame(t) {
    const f = reduced ? 0 : Math.floor(t * o.fps + 1e-6);   // reduced motion: frame 0 forever — static grain, no weave, no leak drift
    const g = layers.grain;
    if (g) g.style.transform = `translate(${-Math.floor(hash(f, 1) * tileSize)}px, ${-Math.floor(hash(f, 2) * tileSize)}px)`;
    const lk = layers.leak;
    if (lk) {
      const s = reduced ? 0 : t;                             // drift + a little projector flicker, both deterministic
      const fl = reduced ? 1 : 1 + 0.1 * Math.sin(s * 1.9) + 0.06 * (hash(Math.floor(s * 12), 9) * 2 - 1);
      lk.style.opacity = String(clamp(look.leak * fl));
      lk.firstChild.style.transform = `translate(${num(4 * Math.sin(s * 0.31) + 2 * Math.sin(s * 0.83 + 1))}%, ${num(3 * Math.sin(s * 0.23 + 2))}%) scale(${num(1 + 0.05 * Math.sin(s * 0.17))})`;
    }
    if (weaveEl) {
      if (reduced || look.weave <= EPS) { weaveEl.style.translate = ''; weaveEl.style.rotate = ''; }
      else {
        const a = look.weave, sm = (x, s) => vnoise(x, s) * 2 - 1, j = (s) => hash(f, s) * 2 - 1;
        weaveEl.style.translate = `${num(a * (0.7 * sm(f * 0.18, 3) + 0.3 * j(4)))}px ${num(a * (0.6 * sm(f * 0.22, 5) + 0.5 * j(6)))}px`;
        weaveEl.style.rotate = `${num(a * 0.02 * j(7))}deg`;
      }
    }
  }
  function findWeave() {
    const el = look.weave > EPS && !reduced ? doc.querySelector(o.weaveTarget) : null;
    if (weaveEl && weaveEl !== el) { weaveEl.style.translate = ''; weaveEl.style.rotate = ''; }
    weaveEl = el;
  }

  /* ---------- the instance ---------- */
  let lastKey = '', raf = 0, unsub = null, destroyed = false;
  const animating = () => !reduced && (E.grain > EPS || look.weave > EPS || look.leak > EPS);

  /** Re-apply the look if it changed (a dirty check, like stage.js). Call it after tweening `look`; returns true if anything was redrawn. */
  function update() {
    if (destroyed) return false;
    const key = JSON.stringify(look) + tier + reduced + innerWidth + (devicePixelRatio || 1);
    if (key === lastKey) { wake(); return false; }
    lastKey = key; derive(); syncFilter(); syncLayers(); findWeave(); frame(lastT); publish(); wake();
    return true;
  }
  /** Draw the frame for time t (seconds). Same t → same pixels. */
  function render(t = lastT) { lastT = t; update(); frame(t); }

  function loop(ts) { raf = 0; if (destroyed || !animating()) return; render(ts / 1000); raf = requestAnimationFrame(loop); }
  function wake() { if (!unsub && !o.clock && !raf && animating() && !window.__film) raf = requestAnimationFrame(loop); }

  const pub = {
    look, spec: o.spec, id, filter: `url(#${id})`,
    get tier() { return tier; }, get reduced() { return reduced; },
    get layers() { return Object.keys(layers); }, get filterActive() { return filterOn; },
    get targets() { return doc.querySelectorAll(`${T}`).length; },
  };
  function publish() { window.__grade = pub; }

  /** Re-measure after a resize (blur radii scale with the viewport; the grain tile with the pixel ratio). Republishes window.__grade. */
  function measure() { lastKey = ''; update(); return pub; }

  const onResize = () => measure();
  const onMotion = () => { reduced = mqReduced.matches; lastKey = ''; update(); };
  addEventListener('resize', onResize); mqReduced.addEventListener?.('change', onMotion);

  const clock = o.clock === 'manual' ? null : o.clock || window.__film || window.__reel || null;
  if (clock?.onFrame) unsub = clock.onFrame((f) => render(typeof f === 'number' ? f : f.time));

  const api = {
    look, update, render, measure,
    get spec() { return pub.spec; }, set spec(v) { pub.spec = v; },
    get tier() { return tier; }, set tier(v) { tier = v === 'auto' ? autoTier() : v; update(); },
    get filter() { return pub.filter; },
    destroy() {
      destroyed = true; cancelAnimationFrame(raf); unsub?.();
      removeEventListener('resize', onResize); mqReduced.removeEventListener?.('change', onMotion);
      Object.values(layers).forEach((l) => l.remove()); if (weaveEl) { weaveEl.style.translate = ''; weaveEl.style.rotate = ''; }
      svg.remove(); style.remove(); root.classList.remove('grade-on');
      if (window.__grade === pub) delete window.__grade;
    },
  };
  update();
  publish();
  return api;
}
