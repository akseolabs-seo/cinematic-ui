# The kit

Infrastructure for a film whose playhead is the scrollbar. It has no look of its own: every lens and print
effect starts at zero. Copy the files you need into the project and build on them. Only `reel.js` + `reel.css` are needed for a site; the 3D stage is one medium among
several (see `references/looks.md`). Copy fresh from the skill at the start of each production, and re-copy
when the kit changes: copies go stale (eight demos carried a `type-fx.js` without `caret: 'typing'`, seven without `zeros: false`).

| File | Role | Needs |
|---|---|---|
| `reel.js` + `reel.css` | The playhead: scenes, pinned frames, clips, designed cuts, reduced-motion stills | GSAP |
| `looks.js` | The lab: media other than photoreal — ink, sketch, pixel, halftone, CRT looks; cel materials; liquid and gradient plates; 2.5D image planes; line boil for DOM | three, `stage.js` (except `boil`) |
| `stage.js` | The sound stage: Three.js HDR pipeline, studio light, camera rig, grade | three |
| `grade.js` | The grade for DOM sites: the same `look` as `stage.look`, plus halation, bloom, grain, leak and weave, on photographs, video and canvases. Type stays unfiltered | nothing |
| `grade.html` | Its gallery: the look book's films side by side, `?look=r3&t=2.5&bare=1` renders one frozen frame | `grade.js` |
| `props.js` | The prop shop: backdrop, procedural maps, lathe, PBR material starting points, dust | three, `stage.js` |
| `plane.js` | The UI plane camera: a live DOM interface shot like a set — oblique close-ups, presets from extreme macro to wide, depth of field and rack focus by masked backdrop-filter, a shot audit, UI performance recipes | GSAP (for `shot`, `appear`), nothing else |
| `type-fx.js` | Type motion: forty-four type moves (文字動畫 44 種) in six families, driven by `p` and `t`, real text kept in the DOM | nothing |
| `type-fx.html` | Their gallery and screening page: `?fx=stamp&p=0.5&t=2.3&lang=en` renders one state full frame | `type-fx.js` |
| `site-dom.html` | Grey animatic of a site with **no canvas**: type, flat shapes, an image slot. Start here for graphic, typographic, drawn or photographed films | `reel.js` only |
| `site.html` | Grey animatic of a site on the 3D stage | all of the above |
| `app.js` | App mode's rig: hash router with state in the URL, forced screening states, frozen clock, shortcuts and their sheet, kbd hints, j/k row navigation, peek or modal drawer, command palette, toasts with undo | nothing |
| `fixtures.js` | Seeded stand-in data with real shape: long tails, noisy series with events, mixed-locale names, working-hours times, edge rows | nothing |
| `app-shell.html` | Grey animatic of an app: shell, overview, list, record in a peek, all eight states. Start here for app mode | `app.js`, `fixtures.js` |

Pages load GSAP (and optionally Lenis) as classic scripts and Three.js through an import map — see the
bottom of `site.html`. They must be served over HTTP; ES modules do not load from `file://`. Use a server
that honours byte-range requests (`npx serve`, Vite, any real dev server, or the skill's own scripts):
without them browsers cannot seek video, and scrubbed or film-rendered footage sticks on its first frame.
`python -m http.server` does not support ranges. The versions in the animatics are the ones the kit was
verified with (three 0.186.1, gsap 3.15.0, lenis 1.3.26); pin, and re-screen after upgrading.

## Site mode in thirty lines

```html
<canvas id="stage" aria-hidden="true"></canvas>
<main>
  <section data-scene="arrival" data-still="0.6" style="--length: 250"><div class="frame">…</div></section>
  <section data-scene="turn" data-cut style="--cut: 100; --length: 300"><div class="frame">…</div></section>
  <section data-scene="plans" data-flow><div class="frame">…</div></section>
</main>
```

```js
import { createReel } from './reel.js';
import { createStage, THREE } from './stage.js';

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const lenis = reduced ? null : new Lenis({ autoRaf: false, lerp: 0.1 });   // optional smooth scroll
const reel = createReel({ lenis });
const stage = createStage({ canvas: document.querySelector('#stage'), background: '#0b0b0d' });
const { rig, look } = stage;

stage.studio({ lights: [{ pos: [-6, 7, 5], size: [8, 8], intensity: 6 }] });
// … build cast and set, add to stage.scene …

reel.intro((tl) => tl.from('.title .line > span', { yPercent: 110, duration: 1.1, stagger: 0.09, ease: 'power4.out' }));
reel.scene('arrival', ({ enter, main, exit, q, frame }) => {
  main.fromTo(rig, { x: 2.6, z: 10 }, { x: 1.2, z: 6.2, ease: 'power1.inOut' }, 0);
});
reel.onFrame((f) => stage.render(f.time));
reel.start();
```

### Markup

| | |
|---|---|
| `data-scene="name"` | A scene. The name is the handle for `reel.scene()` and for screening |
| `style="--length: 250"` | Scroll length in vh. The frame is pinned for `length − 100` |
| `.frame` (direct child) | The shot: sticky, one viewport tall, `overflow: clip`. Lay out freely inside |
| `data-flow` | A reading scene: exactly as tall as its content (give it padding for air), not pinned. `--length` is ignored |
| `data-cut` + `--cut: 100` | A designed cut: this frame is pinned *on top of* the previous one for `--cut` vh, taken from the end of the previous scene's hold. Give the previous scene the extra length |
| `data-still="0.6"` | Where in `main` the money frame is (default 0.5): the reduced-motion pose |
| `data-phase` (set by reel) | `before / enter / main / exit / after` on each scene, for CSS hooks |
| `data-hold` | Marks a scene of deliberate stillness, so screening does not flag it as a dead hold |

Never put `overflow: hidden` on an ancestor of a `.frame` (it breaks sticky); use `overflow: clip`.
The reel hides off-stage frames itself (transparent, still focusable, so Tab reaches every control and
scrolls its scene into view): never tween `autoAlpha` / `visibility` on a `.frame`.

A frame is one large viewport tall (`100lvh`), so on phones the browser's bar can cover its bottom strip:
keep bottom-anchored content above `var(--safe-bottom)` — `padding-bottom: calc(6vmin + var(--safe-bottom))`,
or for absolutely positioned content measure from the visible height, `calc(100lvh - var(--safe-bottom))`.
Size what is inside a frame by the smaller dimension (`vmin`, `svh` inside `clamp()`), so a short laptop
window scales the shot instead of cropping it.

`--length` and `--cut` are ordinary custom properties: set them in CSS instead of inline when the mobile
cut needs other values — `.arrival { --length: 250 } @media (max-width: 760px) { .arrival { --length: 170 } }`.

**Scroll arithmetic.** `--length` is the scene's whole height. What you actually get to hold on:

```
hold (vh of scroll for `main`) = length − 100 − (this scene's --cut, if it has data-cut) − (the next scene's --cut, if that has data-cut)
```

A cut is paid for by both neighbours: it overlaps the end of the previous hold and delays the start of
this one. So a 300vh scene that enters by a 100vh cut and leaves by an 80vh cut holds for 20vh —
lengthen it. Lengths quoted in `storyboard.md` are `--length` values.

**Transparent frames share the stage.** Frames are transparent unless you give them a background, so
during any cut the outgoing scene's copy is still on screen over the same canvas. Clear it in the
outgoing scene's `exit` clip (`exit.set(q('.copy'), { opacity: 0 }, 0)` for a hard cut), or give the
incoming frame a ground.

### `createReel({ lenis?, smooth?, scenes? })`

| | |
|---|---|
| `reel.scene(name, ({ enter, main, exit, q, frame, el }) => {})` | Author a scene's three clips. Each is a GSAP timeline whose total length is the clip: **positions and durations are fractions (0–1)**, default `ease: 'none'`, default `duration: 1` (the whole clip). `q` is a selector scoped to the scene |
| `reel.intro((tl) => {})` | Opening titles: a normal time-based timeline, played once on start |
| `reel.onFrame((f) => {})` | Every frame: `f.time`, `f.dt`, `f.scene`, `f.sceneProgress`, `f.m` (master time), `f.progress` (page 0–1), `f.velocity` (viewports/s), `f.reduced`, `f.capturing`. `f.scene` changes over at the *middle* of a cut |
| `reel.phase(name)` | `'before' | 'enter' | 'main' | 'exit' | 'after'` for one scene — the precise signal. A flow scene covers the whole viewport only while it is `'main'` |
| `reel.start()` | Measure, initialise, begin. Call last |
| `reel.velocity`, `reel.scenes`, `reel.reduced`, `reel.master` | State |
| `reel.destroy()` | Tear down in single-page apps: stops the ticker, removes listeners, kills the timelines |
| `reel.seek(m, time?)`, `reel.seekScene(name, u, time?)`, `reel.release()` | Jump the playhead exactly (`u`: −1…0 enter, 0…1 main, 1…2 exit). Used by the screening and render scripts via `window.__reel` |

`enter` of scene B and `exit` of scene A cover the same stretch of scroll: the cut between them.

### `createStage(options)`

Options: `canvas`, `background`, `alpha`, `fov`, `tone` (`'aces' | 'agx' | 'neutral'`), `bloom`, `dof`,
`shadows`, `msaa`, `dprMax`, `fitAspect`, `pointer`, `film: { width, height }`.

| | |
|---|---|
| `stage.scene`, `stage.camera`, `stage.renderer`, `stage.THREE` | The Three.js objects. Do not move the camera directly |
| `stage.rig` | `{ x, y, z, lookX, lookY, lookZ, fov, roll, breathe, shake, parallax, focus, aperture }` — tween these |
| `stage.look` | `{ exposure, contrast, saturation, temperature, tint, lift, split, shadows{r,g,b}, highlights{r,g,b}, vignette, grain, aberration, bloom, bloomThreshold, fade, fadeColor{r,g,b} }` — tween these |
| `stage.studio({ lights, ambient, blur, intensity, rotation })` | Bake softboxes into the environment. `lights: [{ pos, size: [w, h], intensity, color, round }]` |
| `stage.key({ pos, color, intensity, softness, area })` | One shadow-casting light. Returns the light |
| `stage.floor({ y, opacity })` | Invisible shadow-catching floor |
| `stage.onTick((time, dt) => {})` | Per-frame hook for anything time-driven: apply your pose objects, shader uniforms, ambient motion |
| `stage.render(time, { force })` | Draw. Skips the draw when nothing changed |
| `stage.enabled = false` | Rest the stage while an opaque scene covers it: `stage.enabled = reel.phase('plans') !== 'main'` |
| `stage.invalidate()` | Force the next draw after changing something the stage cannot see (a material, the environment) |
| `stage.addPass(pass)` | Insert a display-space post pass before the grade (what `looks.js` uses) |
| `stage.dispose()` | Release GPU resources and listeners |
| `stage.quality` | `{ dpr, bloom, tier }` — steps down automatically on slow frames, never up |
| `stage.ok` | `false` when WebGL failed; `<html>` then has `.no-webgl`: show a poster. The stage is then a stand-in with the same API that draws nothing, so your code keeps running |

Also exported: `seeded(seed)` (deterministic random) and `rgb('#hex')` (for tweening grade tints:
`gsap.to(look.shadows, rgb('#0e3a4a'))`).

**Everything starts at zero.** `rig.breathe`, `rig.parallax`, `look.grain`, `look.vignette`, `look.bloom`
are all 0 until you set them: `Object.assign(look, { grain: 0.03, vignette: 0.25, bloom: 0.1 })`. If the
film has grain, it is because you chose a stock.

**Give the lead a pose object.** Keep its performance as plain numbers and apply them in one place:

```js
const act = { spin: 0, open: 0, glow: 0 };
stage.onTick(() => { lead.rotation.y = act.spin; lid.position.y = act.open * 0.8; lamp.material.emissiveIntensity = act.glow * 8; });
reel.scene('reveal', ({ main }) => main.fromTo(act, { open: 0, glow: 0 }, { open: 1, glow: 1, ease: 'power2.inOut' }, 0.2));
```

The stage only redraws when the rig or the grade changed; it cannot see your pose object. Draw with
`reel.onFrame((f) => stage.render(f.time, { force: true }))` when a pose object drives the shot, or call
`stage.invalidate()` after applying it — otherwise held frames and the reduced-motion stills come out blank.

## Other media — `looks.js`

```js
import * as looks from './looks.js';
const stage = createStage({ canvas, background: '#efe9dc', tone: 'none', bloom: false });  // colours arrive as authored

const ink = looks.ink(stage, { paper: '#efe9dc', ink: '#15120f', tint: 0.6 });   // also: sketch, pixel, halftone, crt
reel.scene('arrival', ({ main }) => main.fromTo(ink, { amount: 1 }, { amount: 0 }, 0.6));   // a medium shift, scrubbed

const art = looks.imagePlane(await looks.loadTexture('./ridge.webp'), { height: 6, multiply: true });  // drawn on white → onto paper
looks.fitToCamera(art, { distance: 12, fov: rig.fov, aspect: innerWidth / innerHeight });           // fills the frame at that depth
stage.scene.add(art);

const cup = new THREE.Mesh(geometry, looks.toon('#2f5d50', { steps: 3 })); looks.outline(cup);     // cel shading
const sea = looks.liquidPlate({ colors: ['#07080c', '#3a2a6b', '#f2c9a0'] }); stage.onTick(sea.tick); stage.scene.add(sea.mesh);

const b = looks.boil(); stage.onTick(b.tick);        // then in CSS:  .boil { filter: var(--boil); }
```

| | |
|---|---|
| `ink / sketch / pixel / halftone / crt (stage, options)` | Whole-frame looks. Each returns a plain object of numbers (`amount` plus its options) to tween |
| `toon(color, { steps })`, `outline(mesh, { thickness, color })`, `flat(color)` | Cel-shaded material, ink outline shell, unlit colour. Toon needs real lights (`stage.key()`, a `HemisphereLight`) |
| `liquidPlate(options)`, `gradientPlate(options)` | Moving grounds: `{ mesh, uniforms, tick }` |
| `loadTexture(url)`, `imagePlane(texture, { height, multiply })`, `fitToCamera(mesh, { distance, fov, aspect })` | Illustrations and photographs as layered planes |
| `loadVideo(url)`, `syncVideo(video, t, texture)` | Footage as a texture for `imagePlane`. Site: `video.play()`. Film: never play — `await syncVideo(...)` inside `film.onFrame` shows the exact frame for `t` |
| `boil({ fps, scale })` | Hand-drawn wobble for DOM and SVG: `{ tick(time) }`; needs no stage (drive it from `reel.onFrame(f => b.tick(f.time))`) |

Options, defaults and what each medium needs: `references/looks.md` and the comments in `looks.js`.

## The grade — `grade.js`

The stage grades only what it draws. A DOM site, with photographs, footage and canvases laid out in HTML, gets its
print from `grade.js`. Cast the grade first (`references/grades.md`), then:

```js
import { createGrade, applyLook } from './grade.js';
const reel = createReel({ lenis });  /* …scenes… */  reel.start();
const grade = createGrade({ clock: reel, spec });          // spec: the GRADE target, published for screening
applyLook(grade.look, { contrast: 1.2, saturation: 0.7, temperature: 0.3, lift: 0.025, split: 0.3,
  shadows: '#1a1410', highlights: '#d9b277', grain: 0.055, vignette: 0.4, halation: 0.1, halationColor: '#c98a3e', fade: 0.08 });
// a regrade at the turn: main.fromTo(grade.look, { …complete look… }, { …complete look… }, 0)
```

| API | |
|---|---|
| `createGrade({ look, spec, scope, targets, clock, tier, weaveTarget, seed })` | `scope: 'media'` (default: `img, video, canvas, picture, [data-grade]`) or `'frame'` (whole scene frames, type included). `clock`: a reel, a film, `{ onFrame }` or `'manual'`. It defaults to `window.__film` → manual, then `window.__reel`, then its own rAF only while grain, weave or leak run. `tier`: `'auto' / 'full' / 'lite' / 'min'` (lite merges bloom and halation into one blur, auto on small touch screens) |
| `grade.look` | `stage.look`'s names and neutral values, plus `halation`, `halationColor`, `halationThreshold`, `halationRadius`, `bloomThreshold` (display space, default 0.72, not the stage's 1.0), `bloomRadius`, `weave` (px), `leak`, `leakColor`, `grainSize`. Everything starts neutral: nothing is graded until you set it |
| `grade.update()` / `grade.render(t)` | Re-apply when `look` changed (dirty-checked; use as a tween's `onUpdate` with no clock) / the frame for time `t`, the same pixels for the same `t` |
| `grade.measure()`, `grade.destroy()`, `grade.filter` | Re-measure after resize; tear down; the filter URL to compose with a target's own CSS filter |
| `applyLook(look, preset, { reset })`, `neutral()`, `rgb('#hex')` | Set many keys at once (colours as `'#hex'`), a fresh neutral look, a tint for tweening |
| `window.__grade` | `{ look, spec, tier, reduced, layers, filterActive }`: `screening.mjs` checks frames against `spec` |

Rules: text and controls are not colour-filtered. Their colours are the GRADE's tokens. `data-grade="off"` opts an
element out. Leak, fade, vignette and grain are fixed `aria-hidden` layers that exist only while their value is
above 0. Reduced motion caps grain at 0.02 and freezes it, stops weave and leak, and keeps the colours. In a
page on its own clock, call `grade.render(t)` every frame. Limits: every SVG step clamps to 0–1, so
crushed blacks with contrast above 1 come out slightly lifted; exposure is a display gain, not HDR; bloom and
halation are tuned by eye and do not equal the stage's numbers; aberration is a uniform offset, not radial.

## Type motion — `type-fx.js`

```js
import { typeFx, EFFECTS } from './type-fx.js';
const verdict = typeFx(document.querySelector('.verdict'), 'stamp', { colors: ['#d8261c'] });
const ground = typeFx(document.querySelector('.ground'), 'giant-marquee');       // a field effect: fills its box
reel.scene('verdict', ({ main }) => main.fromTo(verdict, { p: 0 }, { p: 1, duration: 0.25 }, 0.35));
reel.onFrame((f) => { ground.t = f.time; });                                     // film: film.onFrame((t) => { ground.t = t; })
```

| | |
|---|---|
| `typeFx(el, id, options)` | Builds the effect inside `el`. The real text moves to a visually hidden span, and everything drawn is `aria-hidden`. Without JS, `el` is its own plain text |
| `fx.p`, `fx.t` | Progress 0–1 (entrance, or the walk through `text: [...]` for switch effects) and time in seconds (continuous effects). Setting either re-renders synchronously. Both start at rest (`p = 1`, `t = 0`) |
| `fx.set(p, t)`, `fx.render()`, `fx.still()` | Set both with one render; redraw; jump to the rest pose (what reduced motion shows) |
| `fx.rebuild(options)`, `fx.destroy()` | Change text or options in place; restore the original element |
| `typeFx.defaults(options)` | Page-wide defaults for effects made after the call: `typeFx.defaults({ font: 'inherit', weight: 'inherit' })` puts every effect in the page's cast face (canvas and SVG drawing included). Above each effect's own defaults, below per-call options; `null` clears a key; no argument reads them |
| `fx.value` | Odometer: show this number and ignore `p` (`fx.value = 52470`, or tween it); `null` hands back to `p` |
| Screen-reader text | The hidden `.tfx-sr` span. A switch with several texts holds the text visible at the current `p` (the arriving one once a change is half done; the last at rest); others hold all their texts, joined with " / " |
| Options | `text` (string or array), `colors`, `speed`, `seed`, `font`, `weight` (`'inherit'` takes the element's face), `by` (`'char'` / `'word'` for Latin), `fit`, `size`, `hold`, `loop`, `reduced`, plus per-effect ones (listed above each effect in the file), among them: `pad` (headline-swap, highlighter: inline padding in em, 0 for all-CJK text), `labelFont` and `target` (select-box: default the last word, else the whole string), `still` (split-flap: `'same+punct'` / `false`), `caret` (typewriter: `'typing'` / `true` / `false`), `cell` (slot-roll: window height in em), `zeros`, `value`, `clip` (odometer), `bleed` (slit-scan). Details: `references/type-motion.md`, "In a real page" |
| `EFFECTS[id]` | `{ id, n, zh, en, family, kind, field, use, mood, avoid }`. Also exported: `FAMILIES`, `ORDER`, `graphemes`, `seeded` |

Every frame is a pure function of `p`, `t`, the options and the seed, so the reel can scrub it and
`render-film.mjs` can render it frame-exact. Field effects (`EFFECTS[id].field`) fill their element, so
give it a size. Choose effects by the beat they serve, not by habit: `references/type-motion.md`.

### CJK display setting

Headlines break between authored phrases, never inside a word, and full-width punctuation does not leave
holes in display type (`references/production-design.md`, CJK):

```html
<h2><span class="ph">北辰路 24 號，</span><span class="ph">正門就是急診入口。</span></h2>
```

```css
h1, h2, h3 { word-break: keep-all; line-break: strict; text-wrap: balance; }  /* the fallback, after the phrases */
.ph { display: inline-block; }                                                /* a line breaks only between phrases */
.display { font-feature-settings: "halt" 1; }                                 /* half-width punctuation on display type */
p { text-wrap: pretty; }                                                      /* no one-character last line in reading copy */
```

A phrase wider than the column cannot break at all: on phones keep phrases short, or split them. Check every
H1–H3 at 1440, 1366 and 390: no lone character, no split word.

## Apps — `app.js`, `fixtures.js`, `app-shell.html`

App mode (`references/app-mode.md`) has no scroll playhead, so it does not use `reel.js`. Its playhead is the
task, and the rig keeps that task in the URL so any frame is reproducible from one link.

```js
import { createApp, keys, kbdHints, listNav, drawer, palette, toast } from './app.js';
import { rng, lognormal, series, people, times, edge, money } from './fixtures.js';
const app = createApp({ root: '#view', routes: { '/': overview, '/orders': orders, '/orders/:id': orders } });
function orders(ctx) {                       // ctx = { params, query, state, now, seed, navigate, setQuery, refresh, onMount }
  if (ctx.state === 'loading') return skeleton();   // sized like the final rows: no layout shift
  if (ctx.state === 'filtered') return noMatch(ctx.query);   // names the filters, offers to clear them
  …
}
keys({ '/': { run: focusSearch, label: 'Search' }, 'g o': { run: () => app.navigate('/orders'), label: 'Orders' } });
```

- Reserved query keys: `?state=default|loading|empty|filtered|done|error|denied|huge` forces a screening state
  (views read `ctx.state`); `?now=` freezes the clock (`appNow()`, `ctx.now`); `?seed=` seeds the data; `?still=1`
  sets `<html data-still>` so CSS can kill transitions. `now`, `seed` and `still` carry across navigation; `state` does not.
- Filters, sort, page, selection and the open record live in the query (`ctx.setQuery(patch)`); back, reload and a
  pasted link return the same frame. Focus moves to the new view's `h1`.
- `keys(map)`: single keys, sequences (`'g o'`), `mod+k`, ignored while typing; `?` opens the shortcut sheet.
  `kbdHints()` prints `<kbd>` beside every `[data-key]` so shortcuts are learned through the mouse.
- `listNav(container)`: roving focus over `[data-row][data-id]`, j/k, Enter opens, x / Shift+x select.
  `drawer(el, { modal: false })` is a peek beside the list; Escape closes and returns focus to the row.
- `palette(commands)` (`mod+k`) and `toast(msg, { undo })` use native `<dialog>` and a live region; the rig styles
  nothing and animates nothing. Hooks: `.app-palette`, `.app-sheet`, `.app-toasts`, `.app-toast`, `.app-kbd`,
  `[data-current]`, `[aria-selected]`.
- `fixtures.js`: `rng(seed)`, `lognormal`, `pareto`, `series({ trend, noise, season, events })`, `people`, `companies`,
  `ids`, `times({ businessHours })`, `edge(rows, r)` (long, empty, zero, negative, huge, unicode), `money`, `num`,
  `pct`, `dur`. Fill the animatic with it before styling anything.
- Mark fixed regions `data-region="name"`: `scripts/app-screening.mjs` compares them between loading and loaded. A region
  whose length depends on the record adds `data-region-grow` (it may grow downward). A view that reaches only some states
  declares them: `data-states="default,loading,error,denied,huge"`. `--fold` shoots viewport-sized frames instead of full pages.
- Screening: `MSYS_NO_PATHCONV=1 node scripts/app-screening.mjs <dir> --routes "#/,#/orders,#/orders/K-1"
  --viewports 1440x900,1280x800,390x844 --theme light,dark` (Git Bash rewrites a bare `#/` without the variable).
  It works on any app; one without `window.__app` is shot in its default state only.

## The UI plane camera (`plane.js`)

```html
<div class="frame"><div class="app">…the product's real UI, authored at its real size…</div></div>
```

```js
import { uiPlane, SHOTS, appear, stipple, uiCursor } from './plane.js';
const cam = uiPlane(document.querySelector('.app'), { dof: true });   // its parent is the frame
const k = cam.point('#ackKey');                                      // { fx, fy }: aim at a child element
cam.shot(tl, 14.0, 1.6, { ...SHOTS.macro, ...k, cy: 0.6, roll: -6 }, { mag: 2.9 });   // the cut sets the pose, the drift tweens what changes
tl.to(cam.pose, { rackY: -110, duration: 0.9, ease: 'power2.inOut' }, 15.0);           // rack focus
reel.onFrame(() => cam.apply());
```

- Pose (a plain object, keyed like `rig`): `mag`, `pitch`, `roll`, `yaw`, `persp`, focal point `fx` / `fy`
  (plane px) placed at `cx` / `cy` (0–1 of the frame), focus offset `rackX` / `rackY`, and the lens's
  `band` (sharp depth, px), `k` (blur per px of depth) and `maxBlur`. A preset's `dof` spreads into those.
- `cam.shot(tl, at, duration, from, to, ease)` sets the whole pose at `at` (anything unspecified returns to
  the camera's base pose) and tweens only what changes, so a rack or a second move inside the shot is a
  plain `tl.to(cam.pose, …)`. Every shot is logged; on `film-ready` the `[film]` audit warns
  (`console.warn`) when consecutive shots share scale and roll sign.
- Depth of field: `{ dof: true | { copies: 6, feather: 0.06 } }` adds `copies` backdrop-filter layers
  after the plane, masked to depth bands; type and grade layered above them stay sharp. Content behind
  the plane blurs with it.
- `cam.project(u, v)` → `{ x, y, depth }` on screen, for overlays that must track a point of the plane.
- Recipes: `appear(tl, targets, at, { y: 12, blur: 6, duration: 0.35 })`; `stipple(el, { cell: 2 })`
  returns `{ p }` (tween 0 → 1); `uiCursor(cam, [{ t, x, y, click }])` returns `{ at(t) }` — only for
  walkthroughs.
- Never give a plane `will-change: transform`: it would cache a 1× bitmap and blur every close-up.

## Recording a site (`scripts/render-film.mjs`)

```
node scripts/render-film.mjs ./site --tour 30 --out tour.mp4              # the scroll film, first hold to last, eased
```

Same options as for a film: `--motion-blur`, `--grain`, `--workers`, `--preview`, `--poster`, `--audio` / `--sound`.

## The four rules that keep frames honest

1. **Shared actors are plain objects, keyed with `fromTo`.** The rig, the grade and your pose objects
   can be keyed in scene after scene; the kit makes `from()` / `fromTo()` on plain objects
   order-independent. Before an actor's first key it keeps the value it was created with.
2. **One entrance per property on a DOM element.** A second `from()` / `fromTo()` on the same property of
   the same element must pass `immediateRender: false` (or be written as `set()` + `to()`). The kit logs
   `[reel]` / `[film]` errors naming any element that breaks this; the screening and render scripts report them.
   `tl.set(el, {…}, position)` is the scrub-safe way to **cut something on** at a moment (it reverts when the
   playhead goes back): a word that appears hard, a marker shown from one point onward.
   **SVG parts** are best driven as plain pose objects applied in `onFrame` (rule 1). Tweening SVG transforms
   directly inside scrubbed clips has put marks in the wrong place in practice; if you do it, screen it.
3. **Time comes from the kit.** Use the `time` given to `onTick` / `onFrame`; use `seeded()` for
   randomness. No `Date.now()`, `performance.now()`, `Math.random()`, or extra `requestAnimationFrame`
   loops in anything visible.
4. **Author the finished state in CSS.** Animate *from* elsewhere. Then no-JS, reduced motion and a
   failed script all still show a complete page.

Gotchas met in production:
- **No CSS `transition` on anything that is screened.** A still taken mid-transition shows a half state
  the timeline never asked for; drive it from the clip or the state function instead.
- **`vector-effect: non-scaling-stroke` breaks `pathLength` dash draw-ons in Chrome** (the stroke draws as
  broken arcs). Give each box its own stroke width instead.
- **`[data-scene][data-flow] > .frame` resets `min-height: 0`** and outranks an ordinary `.x .frame` rule, so a
  short flow frame given a min-height collapses silently. Raise the selector's specificity.
- **A fixed DOM/SVG lead (a line that rides above every scene) breaks the reduced-motion stills,** which
  stack scenes as separate blocks: render a still of the lead inside each frame for the accessible cut.
- **`[hidden]` loses to `display: grid/flex`** set by a class: add `[hidden] { display: none !important }`.
  And toggle children with `display`, not `visibility` — a child with `visibility: visible` shows through a hidden parent.
- **Latin display faces often lack `×`, `→`, `№`** (Anton has no proper `×`); the glyph falls back to
  another face mid-word. Check them in a screenshot, or set them in the text face.

## What reduced motion does

With `prefers-reduced-motion: reduce`: no Lenis, no pinning, no overlap cuts; every scene is one
viewport-tall block resting on its `data-still` pose with its `enter` complete; the camera jumps to the
pose of whichever scene is centred; breathing, shake and pointer lean are off; grain is reduced. The
intro is run to its end first, then the stills are applied. `<html>` gets `.reduced-motion` for your own
adjustments.

**Which scene is on screen.** With nothing scrubbed, every scene's phase is `'main'`, so
`reel.phase(name) === 'main'` is true for all of them at once. Ask the reel instead; both work in either cut
(by playhead normally, by geometry under reduced motion):

```js
reel.current();            // name of the scene on screen (the one under the viewport's middle when reduced)
reel.onScreen('offer');    // true while any of that scene is in the viewport (normally: phase enter / main / exit)
```

Because the camera *jumps* to the centred scene's `main` clip at its still, **each scene's `main` should
key the complete pose it needs** — every rig, look and pose-object property that matters to that frame,
not only the ones that change within the scene. A small helper keeps that painless:

```js
const pose = (o) => ({ x: 0, y: 0, z: 8, lookX: 0, lookY: 0, lookZ: 0, fov: 26, roll: 0, ...o });
main.fromTo(rig, pose({ z: 10 }), pose({ z: 6, lookY: 0.4 }), 0);
```

It is also what makes hard cuts exact and scenes safe to reorder.
