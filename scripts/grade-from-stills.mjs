#!/usr/bin/env node
// grade-from-stills.mjs — measure a colour grade from real reference frames, not from memory.
//
//   node grade-from-stills.mjs <images or folders...> [--out grade.json] [--k 6]
//
// Loads stills (jpg / png / webp) in headless Chromium, measures them in a canvas, and writes
//   grade.json  the numbers (palette, ground / ink / accent, black and white points, saturation, warmth, contrast, a suggested look)
//   grade.jpg   a contact sheet beside it: the stills, a swatch bar with hex labels, the numbers — for the director to look at
// The stills are reference material for analysis only. grade.jpg carries small thumbnails for your eyes; never publish either.
//
// Scales (so screening.mjs and the kit read the same numbers):
//   saturation  mean Lab chroma C* / 30. 1 = the chroma of ordinary neutral-processed photography, 0 = grey, 2 = very saturated.
//               saturation:[min,max] is the 10th–90th percentile of per-pixel chroma on that scale.
//   black/white 1st / 99th percentile of Lab L*, as the average colour of the pixels at that level (hex).
//   warmth      mean a*, b* of the darkest and brightest thirds; the hex is that tint at L* 55 (a split-tone colour).
import fs from 'node:fs';
import path from 'node:path';
import { parseArgs, loadPlaywright, launch } from './lib.mjs';

const args = parseArgs(process.argv.slice(2), { out: 'grade.json', k: 6 });
if (!args._.length) { console.error('usage: node grade-from-stills.mjs <images or folders...> [--out grade.json] [--k 6]'); process.exit(1); }

const EXT = { '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.webp': 'image/webp' };
const files = [];
for (const a of args._) {
  const p = path.resolve(a);
  if (!fs.existsSync(p)) { console.error(`Not found: ${p}`); process.exit(1); }
  if (fs.statSync(p).isDirectory()) files.push(...fs.readdirSync(p).filter((f) => EXT[path.extname(f).toLowerCase()]).sort().map((f) => path.join(p, f)));
  else if (EXT[path.extname(p).toLowerCase()]) files.push(p);
  else console.warn(`skipped (not jpg/png/webp): ${p}`);
}
if (!files.length) { console.error('No images found.'); process.exit(1); }
const K = Math.max(2, Math.min(16, Number(args.k) || 6));
const outJson = path.resolve(String(args.out));
const outJpg = outJson.replace(/\.json$/i, '') + '.jpg';
fs.mkdirSync(path.dirname(outJson), { recursive: true });

/* ---------------------------------------------------------------- in-page analysis ------------------------- */
async function analyse({ images, K }) {
  const REF_CHROMA = 30, REF_STD = 25;
  const REF_MEAN_CHROMA = 15; // mean Lab C* of ordinary, neutrally processed photographs (about 11–18 on the kit's sample stills): stills at that mean → saturation 1
  const lin = (v) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
  const gam = (v) => { v = v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1 / 2.4) - 0.055; return Math.max(0, Math.min(255, Math.round(v * 255))); };
  const f = (t) => (t > 216 / 24389 ? Math.cbrt(t) : (24389 / 27 * t + 16) / 116);
  const fi = (t) => (t ** 3 > 216 / 24389 ? t ** 3 : (116 * t - 16) / (24389 / 27));
  function toLab(r, g, b) {
    const R = lin(r), G = lin(g), B = lin(b);
    const x = f((0.4124564 * R + 0.3575761 * G + 0.1804375 * B) / 0.95047), y = f(0.2126729 * R + 0.7151522 * G + 0.072175 * B), z = f((0.0193339 * R + 0.119192 * G + 0.9503041 * B) / 1.08883);
    return [116 * y - 16, 500 * (x - y), 200 * (y - z)];
  }
  function toRgb(L, a, b) {
    const y = (L + 16) / 116, x = y + a / 500, z = y - b / 200;
    const X = 0.95047 * fi(x), Y = fi(y), Z = 1.08883 * fi(z);
    return [gam(3.2404542 * X - 1.5371385 * Y - 0.4985314 * Z), gam(-0.969266 * X + 1.8760108 * Y + 0.041556 * Z), gam(0.0556434 * X - 0.2040259 * Y + 1.0572252 * Z)];
  }
  const hex = (c) => '#' + c.map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, '0')).join('');
  const lum = (c) => { const [r, g, b] = c.map(lin); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
  const wcag = (c1, c2) => { const a = lum(c1), b = lum(c2); return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05); };
  const r1 = (v) => Math.round(v * 10) / 10, r2 = (v) => Math.round(v * 100) / 100;

  // decode + sample
  const SIDE = 256, per = [], pxRGB = [], pxLab = [];
  for (const im of images) {
    const img = new Image(); img.src = im.src; await img.decode();
    const sc = Math.min(1, SIDE / Math.max(img.naturalWidth, img.naturalHeight)), w = Math.max(1, Math.round(img.naturalWidth * sc)), h = Math.max(1, Math.round(img.naturalHeight * sc));
    const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
    const cx = cv.getContext('2d', { willReadFrequently: true }); cx.imageSmoothingQuality = 'high'; cx.drawImage(img, 0, 0, w, h);
    const d = cx.getImageData(0, 0, w, h).data; let sL = 0, sC = 0, n = 0;
    for (let i = 0; i < w * h; i++) {
      if (d[i * 4 + 3] < 250) continue;
      const rgb = [d[i * 4], d[i * 4 + 1], d[i * 4 + 2]], lab = toLab(...rgb);
      pxRGB.push(rgb); pxLab.push(lab); sL += lab[0]; sC += Math.hypot(lab[1], lab[2]); n++;
    }
    const tw = 420, th = Math.round(420 * img.naturalHeight / img.naturalWidth), tc = document.createElement('canvas'); tc.width = tw; tc.height = th;
    const tx = tc.getContext('2d'); tx.imageSmoothingQuality = 'high'; tx.drawImage(img, 0, 0, tw, th);
    per.push({ name: im.name, width: img.naturalWidth, height: img.naturalHeight, meanL: r1(sL / Math.max(1, n)), saturation: r2(sC / Math.max(1, n) / REF_CHROMA), thumb: tc.toDataURL('image/jpeg', 0.8) });
  }
  const N = pxLab.length;
  if (!N) throw new Error('no opaque pixels');

  // k-means in Lab, k-means++ seeding with a fixed seed: same stills, same palette
  let seed = 7; const rnd = () => { seed |= 0; seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const d2 = (p, c) => (p[0] - c[0]) ** 2 + (p[1] - c[1]) ** 2 + (p[2] - c[2]) ** 2;
  const k = Math.min(K, N);
  const cent = [pxLab[Math.floor(rnd() * N)].slice()];
  const dist = new Float64Array(N).fill(Infinity);
  while (cent.length < k) {
    let tot = 0; const last = cent[cent.length - 1];
    for (let i = 0; i < N; i++) { dist[i] = Math.min(dist[i], d2(pxLab[i], last)); tot += dist[i]; }
    let r = rnd() * tot, pick = N - 1;
    for (let i = 0; i < N; i++) { r -= dist[i]; if (r <= 0) { pick = i; break; } }
    cent.push(pxLab[pick].slice());
  }
  const asg = new Int32Array(N);
  for (let it = 0; it < 30; it++) {
    let moved = 0; const sum = cent.map(() => [0, 0, 0, 0]);
    for (let i = 0; i < N; i++) {
      let best = 0, bd = Infinity;
      for (let c = 0; c < k; c++) { const dd = d2(pxLab[i], cent[c]); if (dd < bd) { bd = dd; best = c; } }
      if (asg[i] !== best) { asg[i] = best; moved++; }
      const s = sum[best]; s[0] += pxLab[i][0]; s[1] += pxLab[i][1]; s[2] += pxLab[i][2]; s[3]++;
    }
    for (let c = 0; c < k; c++) if (sum[c][3]) cent[c] = [sum[c][0] / sum[c][3], sum[c][1] / sum[c][3], sum[c][2] / sum[c][3]];
    if (!moved && it) break;
  }
  const cnt = new Array(k).fill(0); for (let i = 0; i < N; i++) cnt[asg[i]]++;
  const pal = cent.map((c, i) => ({ lab: c, rgb: toRgb(...c), share: cnt[i] / N })).filter((p) => p.share > 0).sort((a, b) => b.share - a.share)
    .map((p) => ({ hex: hex(p.rgb), share: r1(p.share * 100), rgb: p.rgb, L: p.lab[0], C: Math.hypot(p.lab[1], p.lab[2]) }));

  // percentiles
  const Ls = Float32Array.from(pxLab, (l) => l[0]).sort();
  const pct = (p) => Ls[Math.min(N - 1, Math.max(0, Math.round((p / 100) * (N - 1))))];
  const avgAt = (Lp) => { // mean colour of the pixels at that luminance level (±1.5 L*), widening if the band is thin
    for (const tol of [1.5, 3, 6]) {
      let s = [0, 0, 0], n = 0;
      for (let i = 0; i < N; i++) if (Math.abs(pxLab[i][0] - Lp) <= tol) { s[0] += pxRGB[i][0]; s[1] += pxRGB[i][1]; s[2] += pxRGB[i][2]; n++; }
      if (n >= Math.max(5, N * 0.002)) return s.map((v) => v / n);
    }
    return toRgb(Lp, 0, 0);
  };
  const L1 = pct(1), L99 = pct(99), black = avgAt(L1), white = avgAt(L99);

  // chroma
  const Cs = Float32Array.from(pxLab, (l) => Math.hypot(l[1], l[2])).sort();
  const cp = (p) => Cs[Math.min(N - 1, Math.round((p / 100) * (N - 1)))];
  let sumC = 0, sumL = 0; for (let i = 0; i < N; i++) { sumC += Math.hypot(pxLab[i][1], pxLab[i][2]); sumL += pxLab[i][0]; }
  const meanC = sumC / N, meanL = sumL / N;
  let vL = 0; for (let i = 0; i < N; i++) vL += (pxLab[i][0] - meanL) ** 2;
  const stdL = Math.sqrt(vL / N);

  // warmth: darkest and brightest thirds
  const t1 = pct(100 / 3), t2 = pct(200 / 3), sh = [0, 0, 0], hi = [0, 0, 0], all = [0, 0];
  for (let i = 0; i < N; i++) {
    const l = pxLab[i]; all[0] += l[1]; all[1] += l[2];
    if (l[0] <= t1) { sh[0] += l[1]; sh[1] += l[2]; sh[2]++; } else if (l[0] >= t2) { hi[0] += l[1]; hi[1] += l[2]; hi[2]++; }
  }
  const tint = (s) => { const a = s[0] / Math.max(1, s[2]), b = s[1] / Math.max(1, s[2]); return { a: r1(a), b: r1(b), hex: hex(toRgb(55, a, b)) }; };
  const warmth = { shadows: tint(sh), highlights: tint(hi) };
  const meanB = all[1] / N, meanA = all[0] / N;

  // near-pure black / white share (max channel ≤ 6 / min channel ≥ 249)
  let nb = 0, nw = 0; for (let i = 0; i < N; i++) { const p = pxRGB[i]; if (Math.max(p[0], p[1], p[2]) <= 6) nb++; else if (Math.min(p[0], p[1], p[2]) >= 249) nw++; }

  // ground / ink / accent
  const sig = pal.filter((p) => p.share >= 1);
  const ground = sig.filter((p) => p.L < 30 || p.L > 75)[0] || sig[0];
  const ink = sig.filter((p) => p !== ground).sort((a, b) => wcag(b.rgb, ground.rgb) - wcag(a.rgb, ground.rgb))[0] || ground;
  const accent = pal.filter((p) => p !== ground && p !== ink && p.share < 12).sort((a, b) => b.C - a.C)[0]
    || pal.filter((p) => p !== ground && p !== ink).sort((a, b) => b.C - a.C)[0] || ink;

  const sat = (c) => r2(Math.min(2, c / REF_CHROMA));
  const temp = Math.max(-1, Math.min(1, meanB / 25));
  const split = Math.min(1, Math.hypot(warmth.highlights.a - warmth.shadows.a, warmth.highlights.b - warmth.shadows.b) / 30);
  const grade = {
    palette: pal.map(({ hex, share }) => ({ hex, share })),
    ground: ground.hex, ink: ink.hex, accent: accent.hex,
    black: hex(black), white: hex(white),
    saturation: [sat(cp(10)), sat(cp(90))],
    saturationMean: sat(meanC),
    chroma: { mean: r1(meanC), p10: r1(cp(10)), p90: r1(cp(90)) },
    luminance: { mean: r1(meanL), blackL: r1(L1), whiteL: r1(L99) },
    warmth,
    contrast: r2(stdL),
    pureShare: { black: r1(nb / N * 100), white: r1(nw / N * 100) },
    suggestedLook: {
      contrast: r2(Math.max(0.5, Math.min(2, stdL / REF_STD))),
      saturation: r2(Math.max(0, Math.min(2, meanC / REF_MEAN_CHROMA))), // a grade multiplier on ordinary photographs, not the stills' own chroma
      temperature: r2(temp),
      lift: r2(L1 / 100),
      split: r2(split),
      shadows: warmth.shadows.hex,
      highlights: warmth.highlights.hex,
    },
  };
  return { grade, per, N };
}

/* ---------------------------------------------------------------- run ------------------------------------- */
const pw = await loadPlaywright();
const browser = await launch(pw, {});
try {
  const page = await browser.newPage();
  await page.setContent('<!doctype html><meta charset="utf-8"><body></body>');
  const images = files.map((f) => ({ name: path.basename(f), src: `data:${EXT[path.extname(f).toLowerCase()]};base64,${fs.readFileSync(f).toString('base64')}` }));
  const { grade, per, N } = await page.evaluate(analyse, { images, K });
  const json = { source: files, ...grade };
  fs.writeFileSync(outJson, JSON.stringify(json, null, 2));

  // contact sheet
  const th = 'font:11px/1.35 ui-monospace,Consolas,monospace';
  const chip = (label, h) => `<div class="chip"><i style="background:${h}"></i><b>${label}</b> ${h}</div>`;
  const g = grade;
  await page.setViewportSize({ width: 1360, height: 200 });
  await page.setContent(`<!doctype html><meta charset="utf-8"><style>
    body{margin:0;padding:16px;background:#111;color:#ddd;${th}}
    .stills{display:grid;grid-template-columns:repeat(${Math.min(4, per.length)},1fr);gap:10px;margin-bottom:14px}
    figure{margin:0} img{display:block;width:100%;height:auto} figcaption{padding:3px 0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#999}
    .bar{display:flex;height:64px;margin:6px 0 2px;border:1px solid #333} .bar div{display:flex;align-items:flex-end;padding:3px 4px;box-sizing:border-box;overflow:hidden;white-space:nowrap}
    .bar span{background:rgba(0,0,0,.55);color:#fff;padding:1px 3px}
    .chips{display:flex;flex-wrap:wrap;gap:6px 18px;margin:10px 0} .chip{display:flex;align-items:center;gap:6px} .chip i{width:22px;height:22px;border:1px solid #444;display:block}
    pre{margin:10px 0 0;white-space:pre-wrap;color:#bbb}</style>
    <div class="stills">${per.map((p) => `<figure><img src="${p.thumb}"><figcaption>${p.name} · ${p.width}×${p.height} · L̄ ${p.meanL} · sat ${p.saturation}</figcaption></figure>`).join('')}</div>
    <div>palette (k-means, Lab) — width = share</div>
    <div class="bar">${g.palette.map((p) => `<div style="flex:${Math.max(p.share, 3)};background:${p.hex}"><span>${p.hex} ${p.share}%</span></div>`).join('')}</div>
    <div class="chips">${chip('ground', g.ground)}${chip('ink', g.ink)}${chip('accent', g.accent)}${chip('black', g.black)}${chip('white', g.white)}${chip('shadow tint', g.warmth.shadows.hex)}${chip('highlight tint', g.warmth.highlights.hex)}</div>
    <pre>${[
      `saturation ${g.saturation[0]} – ${g.saturation[1]} (mean ${g.saturationMean}; 1 = neutral photographic chroma)`,
      `black L* ${g.luminance.blackL} (${g.black})   white L* ${g.luminance.whiteL} (${g.white})   mean L* ${g.luminance.mean}   contrast (σL*) ${g.contrast}`,
      `near-pure black ${g.pureShare.black}%   near-pure white ${g.pureShare.white}%`,
      `warmth  shadows a*${g.warmth.shadows.a} b*${g.warmth.shadows.b}   highlights a*${g.warmth.highlights.a} b*${g.warmth.highlights.b}`,
      `suggested look  ${JSON.stringify(g.suggestedLook)}`,
      `${per.length} still(s), ${N} sampled pixels`,
    ].join('\n')}</pre>`);
  await page.waitForFunction(() => [...document.images].every((im) => im.complete && im.naturalWidth > 0));
  await page.screenshot({ path: outJpg, fullPage: true, type: 'jpeg', quality: 88 });
  console.log(`${per.length} still(s) → ${outJson}\n               ${outJpg}`);
  console.log(`  palette ${g.palette.map((p) => `${p.hex} ${p.share}%`).join('  ')}`);
  console.log(`  ground ${g.ground}  ink ${g.ink}  accent ${g.accent}  black ${g.black}  white ${g.white}`);
  console.log(`  saturation ${g.saturation.join('–')} (mean ${g.saturationMean})  contrast ${g.contrast}  warmth shadows ${g.warmth.shadows.hex} highlights ${g.warmth.highlights.hex}`);
} finally {
  await browser.close();
}
