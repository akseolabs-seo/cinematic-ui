#!/usr/bin/env node
// generate-image.mjs — one optional route for the art department: generate a plate, illustration or cutout
// through the Runware API. Use it only when the user has chosen AI generation for an asset (see SKILL.md,
// "The asset call"). Any other image tool the environment offers is just as valid.
//
//   node generate-image.mjs --prompt "…" --out assets/ridge.webp [--size 1536x1024] [--model runware:400@1]
//        [--negative "…"] [--seed 7] [--n 1] [--remove-bg] [--env-file path/to/.env]
//
// The key is read from the RUNWARE_API_KEY environment variable, or from --env-file. It is never printed.
// --remove-bg runs a background-removal pass and writes a PNG with alpha (for cutouts and 2.5D layers).
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { parseArgs } from './lib.mjs';

const args = parseArgs(process.argv.slice(2), { size: '1536x1024', model: 'runware:400@1', n: 1 });
if (!args.prompt || !args.out) { console.error('usage: node generate-image.mjs --prompt "…" --out file.webp [--size 1536x1024] [--model id] [--negative "…"] [--seed n] [--n 1] [--remove-bg] [--env-file .env]'); process.exit(1); }

let key = process.env.RUNWARE_API_KEY;
if (!key && args['env-file']) {
  const line = fs.readFileSync(path.resolve(String(args['env-file'])), 'utf8').split(/\r?\n/).find((l) => /^\s*RUNWARE_API_KEY\s*=/.test(l));
  if (line) key = line.split('=').slice(1).join('=').trim().replace(/^["']|["']$/g, '');
}
if (!key) { console.error('No RUNWARE_API_KEY (set the environment variable or pass --env-file). Ask the user which image route to use.'); process.exit(1); }

const call = async (tasks) => {
  const res = await fetch('https://api.runware.ai/v1', { method: 'POST', headers: { 'content-type': 'application/json', authorization: `Bearer ${key}` }, body: JSON.stringify(tasks) });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json.errors?.length) throw new Error(`Runware: ${JSON.stringify(json.errors || json).slice(0, 400)}`);
  return json.data || [];
};
const download = async (url, file) => { const r = await fetch(url); if (!r.ok) throw new Error(`download failed ${r.status}`); fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, Buffer.from(await r.arrayBuffer())); };

const [width, height] = String(args.size).split('x').map(Number);
const out = path.resolve(String(args.out));
const ext = args['remove-bg'] ? 'png' : (path.extname(out).slice(1).toLowerCase() || 'webp').replace('jpeg', 'jpg');
const n = Math.max(1, Number(args.n));

try {
  const task = { taskType: 'imageInference', taskUUID: crypto.randomUUID(), positivePrompt: String(args.prompt), model: String(args.model), width, height, numberResults: n, outputFormat: args['remove-bg'] ? 'PNG' : ext.toUpperCase(), includeCost: true };
  if (args.negative) task.negativePrompt = String(args.negative);
  if (args.seed !== undefined) task.seed = Number(args.seed);
  const images = await call([task]);
  if (!images.length) throw new Error('Runware returned no image');
  let cost = 0, i = 0;
  for (const im of images) {
    cost += im.cost || 0;
    let url = im.imageURL;
    if (args['remove-bg']) {
      const cut = await call([{ taskType: 'imageBackgroundRemoval', taskUUID: crypto.randomUUID(), inputImage: url, model: 'runware:112@3', outputFormat: 'PNG', includeCost: true }]);
      cost += cut[0]?.cost || 0; url = cut[0]?.imageURL || url;
    }
    const file = images.length === 1 ? out.replace(/\.[^.]+$/, `.${ext}`) : out.replace(/\.[^.]+$/, `-${++i}.${ext}`);
    await download(url, file);
    console.log(`${file}  (${width}x${height}, seed ${im.seed ?? '?'})`);
  }
  console.log(`cost: $${cost.toFixed(4)}  model: ${args.model}`);
} catch (err) { console.error(err.message); process.exit(1); }
