#!/usr/bin/env node
// render-film.mjs — strike the print. Seeks a deterministic HTML film frame by frame and encodes it with ffmpeg.
//
//   node render-film.mjs <dir | file.html | url> [--out film.mp4] [--fps 30] [--size 1920x1080]
//        [--from 0] [--to <seconds>] [--motion-blur 4] [--grain 3] [--crf 16] [--workers 4]
//        [--audio track.mp3]    mux one finished track (cut to the picture's length)
//        [--sound sound.json]   mix a sound sheet: music edited at bar lines, ducks, foley cues (see below)
//        [--preview]            dailies print: half size, 30 fps, 2-sample shutter, fast encode — watch this first
//        [--poster 12.5]        also save that frame as <out>.poster.jpg (name the poster frame in the delivery)
//        [--lossless]           pipe PNG frames instead of JPEG (dark, smooth gradients: check for banding first)
//        [--tour 30]            record a scroll film built on the stage kit as a 30-second tour
//        [--stills 0,2.5,6]     save single frames + a contact sheet instead of encoding (dailies). --out is the folder
//        [--stills cuts]        the last frame before and the first frame after every clip boundary
//   --motion-blur also applies to stills, so dailies show the shutter the print will have. Each still's caption
//   reports mean luminance and the near-black share of the frame (a night film should not be a grey one).
//   --grain adds temporal film grain after the shutter (ffmpeg noise, 2–5 is "barely there"); stills show none.
//   --workers renders contiguous frame ranges in parallel pages and joins them: every frame is a function of t.
//
// Sound sheet (paths relative to the sheet):
//   { "music": [ { "src": "bed.mp3", "from": 21.93, "to": 65.93, "at": 0, "gain": 0 } , … ],   // segments, edit on beats
//     "duck":  [ [44, 48, -10] ],                       // music only: seconds from, to, dB (0.25 s ramps)
//     "cues":  [ { "src": "key.mp3", "at": 14.5, "gain": -4, "from": 0, "to": 0.4 } ],
//     "xfade": 0.03, "fadeIn": 0, "fadeOut": 2, "gain": -1 }
//
// The page must expose one of:
//   window.__film   { duration, seek(t), ready }   ← any page with its own clock
//   window.__reel   a scroll site built on kit/reel.js   ← needs --tour <seconds>
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';
import { parseArgs, resolveTarget, loadPlaywright, launch } from './lib.mjs';

const args = parseArgs(process.argv.slice(2), { out: 'film.mp4', crf: 16 });
if (!args._[0]) { console.error('usage: node render-film.mjs <dir|file|url> [--out film.mp4] [--fps 30] [--size 1920x1080] [--motion-blur 4] [--grain 3] [--workers 4] [--audio a.mp3 | --sound sound.json] [--preview] [--poster t] [--tour 30] [--stills 0,2,4 | cuts]'); process.exit(1); }

let stills = args.stills ? (args.stills === 'cuts' || args.stills === true ? 'cuts' : String(args.stills).split(',').map(Number)) : null;
if (!stills && spawnSync('ffmpeg', ['-version'], { stdio: 'ignore' }).status !== 0) { console.error('ffmpeg not found on PATH. Install it (winget install Gyan.FFmpeg · brew install ffmpeg · apt install ffmpeg) or use --stills.'); process.exit(1); }

const preview = !!args.preview;
const target = await resolveTarget(args._[0]);
const pw = await loadPlaywright();
const browser = await launch(pw, { headed: !!args.headed });
let exitCode = 0;
const problems = [], notes = [];

try {
  const probe = await browser.newPage();
  await probe.goto(target.url, { waitUntil: 'load', timeout: 60000 });
  await probe.waitForFunction(() => window.__film || window.__reel, null, { timeout: 30000 }).catch(() => {});
  const meta = await probe.evaluate(() => {
    const root = document.querySelector('[data-composition-id]');
    return { film: !!window.__film, reel: !!window.__reel, w: +(root?.dataset.width || 0), h: +(root?.dataset.height || 0), d: +(root?.dataset.duration || 0), fps: +(root?.dataset.fps || 0) };
  });
  await probe.close();

  const mode = meta.film ? 'film' : meta.reel && args.tour ? 'tour' : null;
  if (!mode) throw new Error(meta.reel ? 'This is a scroll site (window.__reel). Add --tour <seconds> to record it.' : 'No window.__film or window.__reel on the page — nothing to seek. (HyperFrames projects render with `npx hyperframes render`.)');
  const baseW = meta.w || 1920, baseH = meta.h || 1080;
  const [w, h] = String(args.size || (preview ? `${Math.round(baseW / 2)}x${Math.round(baseH / 2)}` : `${baseW}x${baseH}`)).split('x').map(Number);
  const fps = Number(args.fps || (preview ? Math.min(30, meta.fps || 30) : meta.fps || 30));
  const total = mode === 'tour' ? Number(args.tour) : meta.d;
  if (!(total > 0)) throw new Error('Unknown duration: set data-duration on the composition root, or pass --tour <seconds>.');
  const from = Number(args.from || 0), to = Math.min(total, Number(args.to || total));
  const sub = Math.max(1, Number(args['motion-blur'] || 1) > 1 && preview ? 2 : Number(args['motion-blur'] || 1)); // sub-frames averaged into each frame = a shutter
  const lossless = !!args.lossless;
  const shot = (page, extra = {}) => page.screenshot(lossless ? { type: 'png', ...extra } : { type: 'jpeg', quality: 96, ...extra });

  // A film is authored at its composition size: another --size of the same shape scales it (device pixel ratio),
  // it never crops. A site tour is responsive, so there --size is simply the viewport.
  const authored = mode === 'film' && meta.w && meta.h;
  if (authored && Math.abs(w / h - meta.w / meta.h) > 0.01) throw new Error(`--size ${w}x${h} has a different shape from the composition (${meta.w}x${meta.h}). Re-block the film for that format instead of cropping it.`);

  async function openPage() {
    const page = await browser.newPage(authored ? { viewport: { width: meta.w, height: meta.h }, deviceScaleFactor: w / meta.w } : { viewport: { width: w, height: h }, deviceScaleFactor: 1 });
    page.on('pageerror', (e) => problems.push(e.message));
    page.on('console', (m) => {
      const tx = m.text();
      if (m.type() === 'error' && !/Failed to load resource/.test(tx)) problems.push(tx.slice(0, 300)); // includes the kit's [film] / [reel] audit
      else if (m.type() === 'warning' && /^\[(film|plane|reel)\]/.test(tx)) notes.push(tx.slice(0, 300)); // the shot audit: advice, not a failure
    });
    await page.goto(target.url, { waitUntil: 'load', timeout: 60000 });
    await page.evaluate(() => document.fonts?.ready);
    if (mode === 'film') await page.evaluate(() => window.__film.ready);
    if (mode === 'tour') { await page.waitForTimeout(1200); await page.evaluate(() => { window.__reel.introTimeline?.progress(1); }); }
    return page;
  }

  const seek = (page, t) => page.evaluate(async ([m, time, D]) => {
    if (m === 'film') await window.__film.seek(time);
    else {
      const r = window.__reel, p = Math.min(1, Math.max(0, time / D));
      const eased = p * p * (3 - 2 * p) * 0.35 + p * 0.65;      // a tour eases off the first frame and onto the last
      r.seek(1 + eased * (r.end - 2), time);                    // from the first scene's hold to the last scene's hold
    }
    await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
  }, [mode, t, total]);

  if (stills) {
    const page = await openPage();
    const outDir = path.resolve(String(args.out).replace(/\.mp4$/i, '') || 'stills');
    fs.mkdirSync(outDir, { recursive: true });
    if (stills === 'cuts') { // every clip boundary: the last frame before it and the first frame after it
      const bounds = await page.evaluate(() => { const root = document.querySelector('[data-composition-id]'); return [...(root?.querySelectorAll('[data-start]') || [])].flatMap((el) => [+el.dataset.start, +el.dataset.start + (+el.dataset.duration || 0)]); });
      const set = new Set([0, (Math.round(total * fps) - 1) / fps]);
      for (const b of bounds) if (b > 0 && b < total) { const f = Math.ceil(b * fps - 1e-6); set.add((f - 1) / fps); set.add(f / fps); }
      stills = [...set].sort((a, b) => a - b);
      if (stills.length <= 2) console.log('  (no timed clips found: --stills cuts needs children with data-start / data-duration)');
    }
    const lab = await browser.newPage(); // blends the shutter's sub-frames and measures the exposure
    const develop = (imgs) => lab.evaluate(async ([list, W, H, type]) => {
      const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const cx = cv.getContext('2d');
      for (let i = 0; i < list.length; i++) { const im = new Image(); im.src = `data:image/${type};base64,` + list[i]; await im.decode(); cx.globalAlpha = 1 / (i + 1); cx.drawImage(im, 0, 0); }
      const sm = document.createElement('canvas'); sm.width = 192; sm.height = Math.max(1, Math.round((192 * H) / W));
      const sx = sm.getContext('2d'); sx.drawImage(cv, 0, 0, sm.width, sm.height);
      const d = sx.getImageData(0, 0, sm.width, sm.height).data; let sum = 0, dark = 0; const n = d.length / 4;
      for (let i = 0; i < d.length; i += 4) { const y = (0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]) / 255; sum += y; if (y < 0.06) dark++; }
      return { b64: cv.toDataURL('image/jpeg', 0.9).split(',')[1], luma: sum / n, black: dark / n };
    }, [imgs, w, h, lossless ? 'png' : 'jpeg']);
    const cells = [];
    for (const t of stills) {
      const f = path.join(outDir, `t${t.toFixed(3).padStart(7, '0')}.jpg`);
      const parts = [];
      for (let s = 0; s < sub; s++) { await seek(page, t + s / (sub * fps)); parts.push((await shot(page)).toString('base64')); } // the print's shutter: the sub-frames that follow t
      const dev = await develop(parts);
      fs.writeFileSync(f, Buffer.from(dev.b64, 'base64'));
      cells.push({ t, src: `data:image/jpeg;base64,${dev.b64}`, luma: dev.luma, black: dev.black });
    }
    await lab.close();
    const cols = Math.min(4, cells.length), tw = 480;
    const sheet = await browser.newPage({ viewport: { width: cols * tw + (cols + 1) * 12, height: 120 } });
    await sheet.setContent(`<!doctype html><style>body{margin:0;padding:12px;background:#111;color:#ddd;font:11px ui-monospace,Consolas,monospace}.g{display:grid;grid-template-columns:repeat(${cols},${tw}px);gap:12px}figure{margin:0}img{display:block;width:100%}</style><div class="g">${cells.map((c) => `<figure><img src="${c.src}"><figcaption>t = ${c.t.toFixed(3)}s · frame ${Math.round(c.t * fps)} · Y ${(c.luma * 100).toFixed(1)}% · black ${(c.black * 100).toFixed(0)}%</figcaption></figure>`).join('')}</div>`);
    await sheet.waitForFunction(() => [...document.images].every((im) => im.complete));
    await sheet.screenshot({ path: path.join(outDir, 'contact.jpg'), fullPage: true, type: 'jpeg', quality: 86 });
    await sheet.close();
    for (const c of cells) console.log(`  t ${c.t.toFixed(3).padStart(7)}  Y ${(c.luma * 100).toFixed(1).padStart(5)}%  near-black ${(c.black * 100).toFixed(0).padStart(3)}%`);
    console.log(`${cells.length} stills${sub > 1 ? ` (${sub}-sample shutter)` : ''} + contact sheet → ${path.join(outDir, 'contact.jpg')}`);
  } else {
    const out = path.resolve(String(args.out));
    fs.mkdirSync(path.dirname(out), { recursive: true });
    const frames = Math.round((to - from) * fps);
    const workers = Math.max(1, Math.min(Number(args.workers || 1), Math.ceil(frames / fps)));
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'cui-print-'));
    // Shutter: each output frame averages the sub-frames that FOLLOW its own timestamp, so a cut that sits on the
    // frame grid stays a clean cut (no ghost of the previous shot). Grain after the shutter (it is the film stock,
    // not the scene), then JPEG full range → video range.
    const vf = [
      sub > 1 ? `tmix=frames=${sub},select='eq(mod(n\\,${sub})\\,${sub - 1})',setpts=N/(${fps}*TB)` : '',
      args.grain ? `noise=alls=${Number(args.grain)}:allf=t` : '',
      'scale=in_range=pc:out_range=tv,format=yuv420p',
    ].filter(Boolean).join(',');
    const x264 = ['-r', String(fps), '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-color_range', 'tv', '-colorspace', 'bt709', '-color_primaries', 'bt709', '-color_trc', 'bt709', '-crf', String(preview && !args.crf ? 23 : args.crf), '-preset', preview ? 'veryfast' : 'medium'];
    const posterFrame = args.poster != null ? Math.round((Number(args.poster) - from) * fps) : -1;
    const t0 = Date.now();
    let doneFrames = 0;
    const progress = () => process.stdout.write(`\r  ${doneFrames}/${frames} frames  (${workers} worker${workers > 1 ? 's' : ''}, ${((Date.now() - t0) / 1000).toFixed(0)}s)`);

    async function renderRange(k, f0, f1) {
      const page = await openPage();
      const seg = path.join(tmp, `seg${String(k).padStart(3, '0')}.mp4`);
      const enc = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-c:v', lossless ? 'png' : 'mjpeg', '-framerate', String(fps * sub), '-i', '-', '-vf', vf, ...x264, seg], { stdio: ['pipe', 'inherit', 'inherit'] });
      const done = new Promise((res, rej) => enc.on('close', (c) => (c === 0 ? res() : rej(new Error(`ffmpeg exited with ${c}`)))));
      for (let f = f0; f < f1; f++) {
        for (let s = 0; s < sub; s++) {
          await seek(page, from + (f + s / sub) / fps);
          const buf = await shot(page);
          if (f === posterFrame && s === 0) fs.writeFileSync(out.replace(/\.mp4$/i, '') + '.poster.' + (lossless ? 'png' : 'jpg'), buf);
          if (!enc.stdin.write(buf)) await new Promise((r) => enc.stdin.once('drain', r));
        }
        doneFrames++;
        if (doneFrames % fps === 0) progress();
      }
      enc.stdin.end();
      await done;
      await page.close();
      return seg;
    }
    const per = Math.ceil(frames / workers);
    const segs = await Promise.all(Array.from({ length: workers }, (_, k) => renderRange(k, k * per, Math.min(frames, (k + 1) * per))).filter(Boolean));
    progress(); process.stdout.write('\n');
    fs.writeFileSync(path.join(tmp, 'list.txt'), segs.map((s) => `file '${s.replace(/\\/g, '/')}'`).join('\n'));

    // Join (stream copy) and lay the sound.
    const ff = ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', path.join(tmp, 'list.txt')];
    const dur = (to - from);
    let soundNote = 'silent';
    if (args.sound) {
      const sheetPath = path.resolve(String(args.sound)), dir = path.dirname(sheetPath);
      const sheet = JSON.parse(fs.readFileSync(sheetPath, 'utf8'));
      const graph = [], music = [], cues = [];
      let input = 1;
      const fmt = 'aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo';
      const xf = sheet.xfade ?? 0.03;
      for (const m of sheet.music || []) {
        const len = m.to - m.from, at = (m.at ?? 0) - from;
        ff.push('-i', path.resolve(dir, m.src));
        graph.push(`[${input}:a]${fmt},atrim=${m.from}:${m.to},asetpts=PTS-STARTPTS,afade=t=in:d=${xf},afade=t=out:st=${Math.max(0, len - xf)}:d=${xf},volume=${m.gain ?? 0}dB,adelay=${Math.max(0, Math.round(at * 1000))}:all=1[m${input}]`);
        music.push(`[m${input}]`); input++;
      }
      for (const c of sheet.cues || []) {
        ff.push('-i', path.resolve(dir, c.src));
        const trim = c.to != null ? `atrim=${c.from ?? 0}:${c.to},asetpts=PTS-STARTPTS,` : c.from ? `atrim=start=${c.from},asetpts=PTS-STARTPTS,` : '';
        graph.push(`[${input}:a]${fmt},${trim}volume=${c.gain ?? 0}dB,adelay=${Math.max(0, Math.round((c.at - from) * 1000))}:all=1[c${input}]`);
        cues.push(`[c${input}]`); input++;
      }
      if (!music.length && !cues.length) throw new Error('The sound sheet has no music and no cues.');
      const ducks = (sheet.duck || []).map(([a, b, db]) => { const g = 10 ** (db / 20), A = a - from, B = b - from; return `volume=volume='1-(1-${g.toFixed(4)})*clip(min((t-${A})/0.25\\,(${B}-t)/0.25)\\,0\\,1)':eval=frame`; });
      if (music.length) graph.push(`${music.join('')}amix=inputs=${music.length}:normalize=0:duration=longest${ducks.length ? ',' + ducks.join(',') : ''}[bus]`);
      const all = [...(music.length ? ['[bus]'] : []), ...cues];
      const fadeOut = sheet.fadeOut ? `,afade=t=out:st=${Math.max(0, dur - sheet.fadeOut)}:d=${sheet.fadeOut}` : '';
      const fadeIn = sheet.fadeIn ? `,afade=t=in:d=${sheet.fadeIn}` : '';
      graph.push(`${all.join('')}amix=inputs=${all.length}:normalize=0:duration=longest,volume=${sheet.gain ?? 0}dB,apad,atrim=0:${dur}${fadeIn}${fadeOut},alimiter=limit=0.95[aout]`);
      ff.push('-filter_complex', graph.join(';'), '-map', '0:v', '-map', '[aout]', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k');
      soundNote = `sound sheet: ${music.length} music segment${music.length === 1 ? '' : 's'}, ${cues.length} cue${cues.length === 1 ? '' : 's'}`;
    } else if (args.audio) {
      ff.push('-i', path.resolve(String(args.audio)), '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'aac', '-b:a', '192k', '-t', String(dur));
      soundNote = 'with audio';
    } else ff.push('-c', 'copy');
    ff.push('-movflags', '+faststart', out);
    const r = spawnSync('ffmpeg', ff, { stdio: 'inherit' });
    fs.rmSync(tmp, { recursive: true, force: true });
    if (r.status !== 0) throw new Error(`ffmpeg (join / sound) exited with ${r.status}`);
    console.log(`  ${frames} frames in ${((Date.now() - t0) / 1000).toFixed(1)}s\n${out}  (${w}x${h} @ ${fps}fps, ${dur.toFixed(2)}s${sub > 1 ? `, ${sub}-sample motion blur` : ''}${args.grain ? `, grain ${args.grain}` : ''}, ${soundNote}${preview ? ', PREVIEW' : ''})`);
    if (posterFrame >= 0) console.log(`poster frame → ${out.replace(/\.mp4$/i, '')}.poster.${lossless ? 'png' : 'jpg'}`);
  }
  if (notes.length) { console.log('audit notes:'); [...new Set(notes)].forEach((p) => console.log('  ~ ' + p)); }
  if (problems.length) { console.log('errors on the page during render:'); [...new Set(problems)].forEach((p) => console.log('  ! ' + p)); exitCode = 2; }
} catch (err) {
  console.error(err.message); exitCode = 1;
} finally {
  await browser.close();
  target.close();
}
process.exit(exitCode);
