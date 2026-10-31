#!/usr/bin/env node
// find-footage.mjs — the archive researcher. Searches free, openly licensed libraries for photographs, footage and
// sound, lays the candidates out as a contact sheet with their licences, and fetches the ones you cast — trimmed,
// compressed and credited.
//
//   search:  node find-footage.mjs --query "dawn mist over a valley, wide, backlit" [--type photo|video|audio]
//                 [--sources openverse,wikimedia,archive,nasa,pixabay,unsplash] [--count 24] [--out casting]
//                 [--wide] [--min-width 1280] [--allow-sharealike false]
//   cast:    node find-footage.mjs --pick 3,11 [--from casting/candidates.json] [--to assets]
//                 [--trim 4,8] [--width 1920] [--scrub] (video: start,seconds; scaled, silent H.264 + poster;
//                                                       --scrub makes every frame a keyframe so scroll can scrub it)
//
// Search with the SHOT, not the topic: shot size, light, lens, time of day, texture ("macro, raking light, wet
// stone"), not "coffee shop". Libraries answer topics with clichés.
//
// Keyless: openverse (photos, audio), wikimedia (photos, video), archive (public-domain films from the curated
// Prelinger and FedFlix collections — period footage, newsreel texture), nasa (video, photos). With a free key in the environment or --env-file: pixabay (PIXABAY_API_KEY),
// unsplash (UNSPLASH_ACCESS_KEY; Unsplash requires hotlinking, so picks are recorded, not downloaded).
// Only licences that allow commercial use are returned (CC0, public domain, CC BY, CC BY-SA, library licences).
// Every pick is appended to <to>/CREDITS.md. Read each source's terms before shipping; people, logos and
// trademarks in a frame may need releases whatever the licence says.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { parseArgs, loadPlaywright, launch } from './lib.mjs';

const args = parseArgs(process.argv.slice(2), { type: 'photo', count: 24, out: 'casting', to: 'assets', width: 1920, 'min-width': 1280, 'allow-sharealike': 'true' });
const UA = 'cinematic-ui/2.0 (https://github.com/akseolabs-seo/cinematic-ui; footage research)'; // Wikimedia asks for a contactable User-Agent
const keyFrom = (name) => {
  if (process.env[name]) return process.env[name];
  if (!args['env-file']) return null;
  const line = fs.readFileSync(path.resolve(String(args['env-file'])), 'utf8').split(/\r?\n/).find((l) => new RegExp(`^\\s*${name}\\s*=`).test(l));
  return line ? line.split('=').slice(1).join('=').trim().replace(/^["']|["']$/g, '') : null;
};
const get = async (url, headers = {}) => {
  const r = await fetch(url, { headers: { 'user-agent': UA, ...headers } });
  if (!r.ok) throw new Error(`${r.status} ${url.slice(0, 80)}`);
  return r.json();
};
const sa = String(args['allow-sharealike']) !== 'false';
const okLicence = (l = '') => { l = l.toLowerCase(); return !/nc|nd|non-?commercial|no-?deriv/.test(l) && (sa || !/sa\b|share/.test(l)); };
const strip = (s = '') => String(s).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

/* ------------------------------------------------------------------ sources ---------------------------------- */
const SOURCES = {
  async openverse(q, type, n) {
    if (type === 'video') return [];
    const kind = type === 'audio' ? 'audio' : 'images';
    const extra = type === 'photo' ? `&category=photograph${args.wide ? '&aspect_ratio=wide' : ''}` : '';
    const d = await get(`https://api.openverse.org/v1/${kind}/?q=${encodeURIComponent(q)}&license_type=commercial&page_size=${Math.min(n, 20)}${extra}`); // anonymous Openverse refuses page_size > 20 (401)
    return d.results.filter((r) => okLicence(`${r.license}`)).map((r) => ({
      source: 'openverse', type, id: r.id, title: r.title, author: r.creator || 'unknown', licence: `CC ${r.license.toUpperCase()} ${r.license_version || ''}`.trim().replace('CC PDM', 'Public Domain Mark').replace('CC CC0', 'CC0'),
      licenceUrl: r.license_url, page: r.foreign_landing_url, thumb: r.thumbnail || r.url, url: r.url, width: r.width, height: r.height, duration: r.duration ? r.duration / 1000 : undefined,
    }));
  },
  async wikimedia(q, type, n) {
    if (type === 'audio') return [];
    const ft = type === 'video' ? 'filetype:video' : 'filetype:bitmap';
    const d = await get(`https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrsearch=${encodeURIComponent(`${q} ${ft}`)}&gsrnamespace=6&gsrlimit=${Math.min(n, 40)}&prop=imageinfo&iiprop=url|size|mime|extmetadata&iiurlwidth=480`);
    return Object.values(d.query?.pages || {}).map((p) => {
      const ii = p.imageinfo?.[0] || {}, m = ii.extmetadata || {};
      return { source: 'wikimedia', type, id: String(p.pageid), title: p.title.replace(/^File:/, ''), author: strip(m.Artist?.value) || 'unknown', licence: m.LicenseShortName?.value || '?', licenceUrl: m.LicenseUrl?.value,
        page: ii.descriptionurl, thumb: ii.thumburl, url: ii.url, width: ii.width, height: ii.height, duration: ii.duration };
    }).filter((r) => r.url && okLicence(r.licence));
  },
  async archive(q, type, n) {
    if (type !== 'video') return [];
    // Curated public-domain collections only: self-applied "public domain" labels on arbitrary uploads are not trustworthy.
    const query = `(${q}) AND mediatype:movies AND (collection:prelinger OR collection:fedflix)`;
    const d = await get(`https://archive.org/advancedsearch.php?q=${encodeURIComponent(query)}&fl[]=identifier&fl[]=title&fl[]=creator&fl[]=year&fl[]=licenseurl&rows=${Math.min(n, 30)}&output=json`);
    return d.response.docs.map((r) => ({ source: 'archive', type, id: r.identifier, title: `${r.title}${r.year ? ` (${r.year})` : ''}`, author: [].concat(r.creator || 'Prelinger Archives')[0],
      licence: r.licenseurl ? (/publicdomain\/mark/.test(r.licenseurl) ? 'Public Domain Mark' : /zero/.test(r.licenseurl) ? 'CC0' : r.licenseurl) : 'Public domain (Prelinger / FedFlix) — verify', licenceUrl: r.licenseurl,
      page: `https://archive.org/details/${r.identifier}`, thumb: `https://archive.org/services/img/${r.identifier}` }));
  },
  async nasa(q, type, n) {
    if (type === 'audio') return [];
    const d = await get(`https://images-api.nasa.gov/search?q=${encodeURIComponent(q)}&media_type=${type === 'video' ? 'video' : 'image'}&page_size=${Math.min(n, 40)}`);
    return d.collection.items.map((it) => { const m = it.data[0]; return { source: 'nasa', type, id: m.nasa_id, title: m.title, author: `NASA${m.center ? ' ' + m.center : ''}`,
      licence: 'NASA media (generally not copyrighted; no endorsement implied)', licenceUrl: 'https://www.nasa.gov/nasa-brand-center/images-and-media/', page: `https://images.nasa.gov/details/${m.nasa_id}`, thumb: it.links?.[0]?.href, manifest: it.href }; });
  },
  async pixabay(q, type, n) {
    const key = keyFrom('PIXABAY_API_KEY'); if (!key || type === 'audio') return [];
    const base = type === 'video' ? 'https://pixabay.com/api/videos/' : 'https://pixabay.com/api/';
    const d = await get(`${base}?key=${key}&q=${encodeURIComponent(q)}&per_page=${Math.min(Math.max(n, 3), 50)}&safesearch=true${type === 'photo' ? '&image_type=photo' + (args.wide ? '&orientation=horizontal' : '') : ''}`);
    return d.hits.map((h) => { const v = h.videos?.large?.url ? h.videos.large : h.videos?.medium;
      return { source: 'pixabay', type, id: String(h.id), title: h.tags, author: h.user, licence: 'Pixabay Content License', licenceUrl: 'https://pixabay.com/service/license-summary/', page: h.pageURL,
        thumb: type === 'video' ? (v?.thumbnail || h.videos?.medium?.thumbnail) : h.webformatURL, url: type === 'video' ? v?.url : h.largeImageURL, width: type === 'video' ? v?.width : h.imageWidth, height: type === 'video' ? v?.height : h.imageHeight, duration: h.duration }; });
  },
  async unsplash(q, type, n) {
    const key = keyFrom('UNSPLASH_ACCESS_KEY'); if (!key || type !== 'photo') return [];
    const d = await get(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(q)}&per_page=${Math.min(n, 30)}${args.wide ? '&orientation=landscape' : ''}`, { authorization: `Client-ID ${key}` });
    return d.results.map((r) => ({ source: 'unsplash', type, id: r.id, title: strip(r.alt_description || r.description || ''), author: r.user?.name, licence: 'Unsplash License (hotlink + attribute)', licenceUrl: 'https://unsplash.com/license',
      page: `${r.links.html}?utm_source=cinematic-ui&utm_medium=referral`, thumb: r.urls.small, url: r.urls.regular, width: r.width, height: r.height, downloadLocation: r.links.download_location, hotlinkOnly: true }));
  },
};

/* ------------------------------------------------------------------ search ----------------------------------- */
async function search() {
  const type = String(args.type), n = Number(args.count);
  const names = String(args.sources || 'openverse,wikimedia,archive,nasa,pixabay,unsplash').split(',').map((s) => s.trim()).filter((s) => SOURCES[s]);
  const per = n; // each library is asked for the full count; the sheet interleaves them
  const settled = await Promise.allSettled(names.map((s) => SOURCES[s](String(args.query), type, per)));
  const minW = Number(args['min-width']); // too small to use full-bleed; items of unknown size stay in
  const pools = settled.map((r, i) => { if (r.status === 'rejected') console.log(`  ${names[i]}: ${r.reason.message}`); return r.status === 'fulfilled' ? r.value.filter((c) => c.thumb && !(c.width && c.width < minW && type !== 'audio')) : []; });
  const found = []; // interleave sources so one library does not fill the sheet
  for (let k = 0; found.length < n && pools.some((p) => p[k]); k++) for (const p of pools) if (p[k] && found.length < n) found.push(p[k]);
  found.forEach((c, i) => { c.n = i + 1; });
  const out = path.resolve(String(args.out)); fs.mkdirSync(out, { recursive: true });
  fs.writeFileSync(path.join(out, 'candidates.json'), JSON.stringify({ query: args.query, type, at: new Date().toISOString(), candidates: found }, null, 2));
  pools.forEach((p, i) => console.log(`  ${names[i]}: ${p.length}`));
  if (!found.length) { console.log('Nothing found. Describe the shot differently (fewer words, plainer nouns), or try another --type.'); return; }

  const pw = await loadPlaywright(); const browser = await launch(pw);
  try {
    const page = await browser.newPage({ viewport: { width: 1600, height: 200 } });
    const esc = (s = '') => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
    await page.setContent(`<!doctype html><meta charset="utf-8"><style>body{margin:0;padding:14px;background:#111;color:#ddd;font:11px/1.35 ui-monospace,Consolas,monospace}
      h1{font:600 14px system-ui;margin:0 0 12px;color:#eee}.g{display:grid;grid-template-columns:repeat(4,1fr);gap:14px}figure{margin:0}
      .im{aspect-ratio:16/10;background:#222 center/cover no-repeat;position:relative}.im b{position:absolute;left:6px;top:6px;background:#000c;color:#ffd166;padding:2px 6px;font-size:13px}
      .im i{position:absolute;right:6px;bottom:6px;background:#000c;padding:1px 5px;font-style:normal}figcaption{padding-top:5px}figcaption em{color:#8fd}</style>
      <h1>${esc(args.query)} — ${type} · ${found.length} candidates · cast with --pick n,n</h1>
      <div class="g">${found.map((c) => `<figure><div class="im" style="background-image:url('${esc(c.thumb)}')"><b>${c.n}</b>${type !== 'photo' ? `<i>${type}${c.duration ? ' ' + Math.round(c.duration) + 's' : ''}</i>` : ''}</div>
      <figcaption>${esc((c.title || '').slice(0, 70))}<br><em>${esc(c.source)} · ${esc(c.licence).slice(0, 48)}</em><br>${esc((c.author || '').slice(0, 40))}${c.width ? ` · ${c.width}×${c.height}` : ''}</figcaption></figure>`).join('')}</div>`);
    await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
    await page.screenshot({ path: path.join(out, 'contact.jpg'), fullPage: true, type: 'jpeg', quality: 82 });
  } finally { await browser.close(); }
  console.log(`${found.length} candidates → ${path.join(out, 'contact.jpg')}  (details in candidates.json)`);
}

/* ------------------------------------------------------------------ cast ------------------------------------- */
const download = async (url, file) => {
  for (let attempt = 0; ; attempt++) { // libraries rate-limit bursts: honour Retry-After, back off, try a few times
    const r = await fetch(url, { headers: { 'user-agent': UA } });
    if (r.ok) { fs.writeFileSync(file, Buffer.from(await r.arrayBuffer())); return file; }
    if (r.status !== 429 && r.status < 500 || attempt >= 4) throw new Error(`download ${r.status} ${url.slice(0, 80)}`);
    const wait = Math.min(60, Number(r.headers.get('retry-after')) || 2 ** (attempt + 2));
    console.log(`  rate-limited (${r.status}); waiting ${wait}s`);
    await new Promise((res) => setTimeout(res, wait * 1000));
  }
};
const ffmpeg = (a) => {
  const r = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', ...a], { stdio: ['ignore', 'ignore', 'pipe'] });
  if (r.error) throw new Error('ffmpeg not found on PATH');
  if (r.status !== 0) throw new Error(`ffmpeg: ${String(r.stderr).trim().split(/\r?\n/).pop()}`);
};

async function videoUrl(c) {
  if (c.url) return c.url;
  if (c.source === 'archive') {
    const m = await get(`https://archive.org/metadata/${c.id}`);
    const files = m.files.filter((f) => /\.(mp4|m4v)$/i.test(f.name));
    const best = files.find((f) => /h\.264/i.test(f.format) && !/ia\.mp4$/.test(f.name)) || files.find((f) => /h\.264|mpeg4/i.test(f.format)) || files[0];
    if (!best) throw new Error(`no mp4 in archive item ${c.id}`);
    return `https://archive.org/download/${c.id}/${encodeURIComponent(best.name)}`;
  }
  if (c.source === 'nasa') {
    const list = await get(c.manifest);
    return list.find((u) => /~medium\.mp4$/.test(u)) || list.find((u) => /~large\.mp4$/.test(u)) || list.find((u) => /~orig\.mp4$/.test(u)) || list.find((u) => /\.mp4$/.test(u));
  }
  throw new Error(`no video url for ${c.source}`);
}

async function cast() {
  const from = path.resolve(String(args.from || path.join(String(args.out), 'candidates.json')));
  const { candidates, type } = JSON.parse(fs.readFileSync(from, 'utf8'));
  const to = path.resolve(String(args.to)); fs.mkdirSync(to, { recursive: true });
  const credits = path.join(to, 'CREDITS.md');
  if (!fs.existsSync(credits)) fs.writeFileSync(credits, '# Credits\n\n| File | Title | Author | Source | Licence |\n|---|---|---|---|---|\n');
  for (const n of String(args.pick).split(',').map(Number)) {
    const c = candidates.find((x) => x.n === n); if (!c) { console.log(`  no candidate ${n}`); continue; }
    const slug = `${c.source}-${String(c.id).replace(/[^a-z0-9]+/gi, '-').slice(0, 40)}`;
    let file = '';
    if (c.hotlinkOnly) {
      if (c.downloadLocation) await get(c.downloadLocation, { authorization: `Client-ID ${keyFrom('UNSPLASH_ACCESS_KEY')}` }); // Unsplash asks to be told when a photo is used
      file = c.url; console.log(`  ${n}: hotlink ${c.url}`);
    } else if (type === 'video') {
      const src = await videoUrl(c);
      const [start, dur] = String(args.trim || '0,8').split(',').map(Number);
      file = path.join(to, `${slug}.mp4`);
      const encode = (input) => ffmpeg(['-user_agent', UA, '-ss', String(start), '-i', input, '-t', String(dur), '-an', '-vf', `scale='min(${args.width},iw)':-2,format=yuv420p`, '-c:v', 'libx264', '-preset', 'slow', '-crf', args.scrub ? '30' : '27', ...(args.scrub ? ['-g', '1'] : []), '-movflags', '+faststart', file]);
      // First try streaming only the trimmed part over HTTP (long archive films); if the server or container does not
      // allow it, download the whole file and trim locally.
      let ok = false;
      try { encode(src); ok = fs.existsSync(file) && fs.statSync(file).size > 20000; } catch {}
      if (!ok) {
        const local = path.join(to, `${slug}.source${path.extname(new URL(src).pathname) || '.mp4'}`);
        await download(src, local);
        try { encode(local); } finally { fs.rmSync(local, { force: true }); }
      }
      ffmpeg(['-i', file, '-frames:v', '1', '-q:v', '3', file.replace(/\.mp4$/, '.poster.jpg')]);
      console.log(`  ${n}: ${path.basename(file)} (${(fs.statSync(file).size / 1e6).toFixed(1)} MB, ${dur}s from ${start}s) + poster`);
    } else {
      const ext = (path.extname(new URL(c.url).pathname) || '.jpg').toLowerCase();
      file = await download(c.url, path.join(to, `${slug}${ext}`));
      console.log(`  ${n}: ${path.basename(file)}`);
    }
    fs.appendFileSync(credits, `| ${c.hotlinkOnly ? file : path.basename(file)} | ${strip(c.title).slice(0, 80).replace(/\|/g, '/')} | ${strip(c.author).replace(/\|/g, '/')} | [${c.source}](${c.page}) | ${c.licenceUrl ? `[${c.licence}](${c.licenceUrl})` : c.licence} |\n`);
  }
  console.log(`credits → ${credits}`);
}

if (args.pick) await cast();
else if (args.query) await search();
else { console.error('usage: node find-footage.mjs --query "shot description" [--type photo|video|audio]   |   --pick 3,7 [--trim 4,8]'); process.exit(1); }
