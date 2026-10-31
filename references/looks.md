# The medium — what the film is made of

Before a film is lit, someone decides what it is shot *on* and *as*: 35 mm anamorphic, grainy 16 mm,
black-and-white, cel animation, stop motion, ink on paper. That choice shapes every frame more than any
single shot does. A site has the same choice, and it is made once, early, from the director and the film —
never by default.

**If you did not choose a medium, you chose photoreal 3D by accident.** That is the kit's most developed
path, and the wrong one for most films.

## Deciding — from the film, not from a menu

The chain is: **observed mechanism → the perceptual property it needs → what assets can supply it → the
implementation.** Study a specific sequence of the film: how it handles space, marks, time, material and
observation. Then choose the simplest medium that keeps those properties. Ask three questions in this
order and write the answers into the treatment.

### 1. What is this film's relationship to reality?

| The film… | Directors (examples) | Its media |
|---|---|---|
| **observes** reality: found light, real places, people | Kore-eda, Hou Hsiao-hsien, Kiarostami, Malick, Ozu | Photography and footage, natural grade, type. *Not* CG |
| **constructs** reality: built sets, controlled perfection | Kubrick, Fincher, Villeneuve, Nolan | Photoreal 3D, studio light, macro detail |
| **draws** reality: animation, illustration | Miyazaki, Shinkai, Satoshi Kon, Anno, the Spider-Verse directors | Hand-drawn line, cel shading, painted multiplane (2.5D), ink |
| **designs** reality: flat, graphic, typographic | Wes Anderson, Saul Bass, Godard, Tati, von Trier (*Dogville*) | Flat geometry, cut paper, print and halftone, type as image |
| **heightens** reality: artificial light, night, colour as feeling | Wong Kar-wai, Refn, Michael Mann, Ridley Scott, Gaspar Noé | Neon, bloom, grain, smear, CRT, bokeh, gradient light |
| is about **matter**: water, fire, cloth, weather, ink | Tarkovsky, Zhang Yimou, King Hu, Kurosawa | Ink wash, liquid and fluid, cloth, particles, texture |
| is about **machines and games** | Edgar Wright (*Scott Pilgrim*), *Tron*, Oshii | Pixel, vector lines, CRT, HUD |
| is **handmade** | Michel Gondry, Wes Anderson (*Fantastic Mr. Fox*), Švankmajer | Stop motion: stepped frame rates, paper, felt, visible seams |

Name the film's actual format where you know it (stock, aspect ratio, colour or monochrome, drawn or shot):
it is a mechanism like any other, and the most direct one.

### 2. What must be literally true?

Some things a visitor knows the look of: the product itself, food, a face, a place, an interface. Those
need truthful assets — photographed, supplied, or generated with care — whatever the medium, and then
they are *passed through* the medium (an ink treatment over a photograph is still ink). Everything else
may be invented in the medium.

### 3. What can actually be made, with the assets available?

Hold the choice against the asset call (below). A medium you cannot supply — hand-drawn with no
illustrations and no generation, footage with no footage — is not a choice. Pick the nearest medium the
film supports that you *can* make well.

### Pitfalls

- **Genre association.** "Miyazaki, so anime." "Sci-fi, so neon." The medium comes from how the film is
  made and what it looks at, not from its shelf in the shop. The pitfall is *choosing* by genre. Once a neon or
  a period film is cast for its mechanism, its colour is committed in full (`grades.md`).
- **The filter applied afterwards.** A look laid over a composition designed for something else. Decide
  the medium before the shot list; a drawn film is *blocked* as drawings.
- **A treatment is not a drawing.** `looks.sketch` and `looks.ink` give 3D forms contour, hatching and
  wash; they do not give them a draughtsman's judgement — selective detail, a chosen silhouette, a line
  that knows what to leave out. For figures, places and anything expressive, the drawings must be
  authored (supplied or generated) and the look unifies them with the rest.
- **Fake handmade noise.** Wobble and grain on perfectly regular geometry reads as a plug-in. Irregularity
  has to be in the shapes.
- **Technology without material.** Splats without a capture, footage without footage, 3D close-ups
  without a model.
- **When feasibility changes, keep the mechanism.** If the assets cannot support the medium, change the
  shot or the medium — not the director's idea.

### One medium, a supporting one, and at most one shift

A film has one dominant medium. A supporting medium is fine where the relationship is clear and constant
(painted backgrounds with line figures; photographs with drawn annotation; type over footage). Beyond
that, a second medium appears only as an event: black-and-white becoming colour, live action
becoming animation for one chapter. Used once, at the turn, a **medium shift** is one of the strongest
cuts there is (`ink.amount` 1 → 0 across a scene boundary). Used twice, it is a style sampler.

## The asset call — ask before you build

After the medium is chosen and the shot list is drafted, list what the film needs and **ask the user once,
in one message**. Do not silently invent stand-ins for things that matter, and do not spend the user's
generation credits without their say.

```
Asset call — <project>
Medium: <chosen medium>, because <film reason>

 # | Asset                         | Scene(s)   | Why it cannot be faked        | Options
 1 | Product photographs, 3 angles | 1, 4, 7    | visitors know the real thing  | you supply · I generate · stand-in (grey form)
 2 | 5 painted backgrounds         | 1–6        | the medium is painted         | I generate (~5 images, ≈ $0.15) · you supply
 3 | Logo, SVG                     | 1, 9       | brand                         | you supply
 4 | Founder portrait              | 6          | a real person                 | you supply · cut the shot

My recommendation: 1 and 3 from you, 2 generated, drop shot 6 unless you have the portrait.
Formats: PNG/WebP ≥ 2000 px on the long side; cut-outs on white or with alpha.
```

Rules for the call:

- **Real things come from the user:** logo, product, people, client names, testimonials, screenshots,
  numbers. Never generate a likeness of a real person or a real product's appearance and present it as
  real. If they are unavailable, redesign the shot around their absence.
- **Offer the routes per asset:** the user supplies it; it comes from a **free licensed library** (no cost,
  real photography and footage — see "Casting footage" below); you generate it (name the tool, the count and
  the rough cost); or a procedural stand-in (say what is lost). Recommend one.
- **When the product itself is handmade** — a handwritten card, a signature, a sketch by the founder — the
  real one is the asset: ask for a scan or photograph. Until it arrives, a stand-in (a script typeface,
  authored SVG marks) is labelled as one on the page and in the delivery report; never pass it off as theirs.
- **Generation needs a yes.** If the user chose it — or said up front that AI assets are fine — use the
  image tool the environment provides. `scripts/generate-image.mjs` is one route (Runware; needs the
  user's key). Keep a list of what was generated, with prompts, in the treatment.
- **If nobody answers,** build with stand-ins that are obviously stand-ins, keep the shot list honest about
  them, and put the open asset call at the top of the delivery report.
- **Shots follow assets.** Never go to close-up on something you cannot make well. A weak asset stays in
  wide shot, in silhouette, out of focus, or off screen; the strongest asset gets the close-ups. Rewrite
  the shot list after the answers come back.
- **Keep generated sets coherent:** one style sentence reused verbatim in every prompt (medium, palette,
  paper, line quality), one model, consistent light direction; generate the hero first and describe the
  rest relative to it.

## The media — how each is built

`looks` is `kit/looks.js`. Post looks are whole-frame treatments with a tweenable `amount`; they work over
3D, photographs and plates alike. For every medium except photoreal, create the stage with
`{ tone: 'none', bloom: false }` so colours arrive as authored (keep bloom for neon).

| Medium | Build | Needs | The lazy version |
|---|---|---|---|
| **Photoreal 3D** | `stage.studio()`, `props.js` materials — see `vfx-threejs.md` | Nothing, for abstract or simple forms. A real model for a real product | Primitives in close-up pretending to be the product |
| **Photography / footage** | DOM `<img>` / `<video>`, or `looks.imagePlane()` / `looks.loadVideo()` in the set, under the film's grade; see "Casting footage" | The user's own, a free licensed library, or generated | Stock photos in rounded cards |
| **Hand-drawn (pencil, wash)** | Illustrations as planes (`imagePlane(tex, { multiply: true })` lays art drawn on white onto paper); `looks.sketch(stage)` turns a 3D cast into hatched pencil with a watercolour wash; `looks.boil()` + `.boil { filter: var(--boil) }` makes DOM and SVG lines wobble like redrawn frames | Illustrations (generated or supplied) for anything figurative | A handwriting font and a doodle arrow |
| **Cel animation** | `looks.toon(color, { steps })` materials + `looks.outline(mesh)`; light with `stage.key()` and a `HemisphereLight` (toon ignores the studio environment); animate the cast on twos (`steps(12)`), camera smooth | Nothing for simple casts | Flat-shaded low-poly |
| **Ink wash 水墨** | `looks.ink(stage, { paper, ink, levels, bleed, tint })`; reveal by bleed: tween `amount` or `levels`; layered silhouettes with fog for distance; leave paper empty | Nothing; stronger over painted plates | Black brush font on beige |
| **Painted multiplane (2.5D)** | 3–7 `imagePlane`s at different depths, `fitToCamera()` so they line up at rest and separate as the rig moves; foreground planes dark and soft | The paintings, as separate layers. Generate each layer on its own, or cut one image apart | One image translated by 20 px |
| **Flat / geometric / cut paper** | `looks.flat(color)` shapes, orthographic or long lens, hard shadows off; shapes are the cast and re-block | Nothing | Random circles and triangles |
| **Print: halftone, risograph** | `looks.halftone(stage, { mode: 'mono' | 'cmy', cell, misregister })`; two or three inks only; grain; type printed, not rendered | Nothing | A dot pattern as background texture |
| **Pixel** | `looks.pixel(stage, { size, palette })`; step the animation (`steps(n)`), snap type to the grid, a pixel typeface | Nothing | An 8-bit font on a normal site |
| **Neon / CRT / retro screen** | Emissive tubes (`materials.emissive`), `look.bloom` 0.3–0.5, coloured `PointLight`s, dark glossy set; `looks.crt(stage)` for the tube | Nothing | Pink-and-cyan gradient with a grid |
| **Glass and gradient light** | `materials.glass() / frosted()` over `looks.gradientPlate({ colors })`; DOM panels with `backdrop-filter`; one light source the glass refracts | Nothing | Glassmorphism cards on a purple blob |
| **Liquid** | `looks.liquidPlate({ colors })` (metal, oil, lacquer, lava); lead partly submerged or made of it; velocity-reactive distortion | Nothing | A wavy SVG divider |
| **Kinetic typography** | Type is the whole cast: variable-font axes, masks, scale, cuts on words — see `production-design.md`, `editing-and-motion.md` | A typeface with range | Words fading in one by one |
| **Stop motion** | Everything on twos or threes (`steps()`), tiny position jitter per frame, real texture (paper, felt, clay roughness maps), visible hands-made asymmetry | Texture photos help | — |
| **Gaussian splats / captured space** | A real place or object as a splat scene. Needs a captured or generated `.spz` / `.ply` and a splat renderer; **not in the kit and not verified here** — treat as a research task, and ask the user for the capture | The capture | Faking it with particles |

Notes that save time:

- **Post looks read tone and edges.** Give them a scene with clear silhouettes and light/dark separation;
  a mid-grey scene becomes mud. Check the look at the money frame of every scene, not just the first.
- **Two looks at once is rarely right.** A second pass (grain from `look`, or `crt` over `pixel`) is fine;
  ink over halftone is noise.
- **Looks are display-space passes:** `look.grain`, `look.vignette` and `look.fade` still apply on top.
  Turn grain off for pixel and print.
- **DOM must join the medium.** Type, buttons and lines are made of the same material: paper ground and
  ink colour from the look's own `paper` / `ink` values, `.boil` on hand-drawn elements, pixel-snapped
  borders, printed (multiply) type. A stylised canvas behind stock UI is two different films.
- **Illustrations drawn on white** go on with `mix-blend-mode: multiply` in the DOM or
  `imagePlane(tex, { multiply: true })` on the stage: the white disappears into the paper. Drawn on
  black: `screen`. No cut-out needed.
- **Reduced motion:** boil holds one frame; stepped animation becomes a still; the look itself stays.
- **Determinism:** every look is a function of the `time` it is given, so screening and film renders are
  exact.

## Casting footage — photographs, film and sound from open libraries

Real photography and footage are the right medium for films that *observe* — and the cheapest way to put
weather, water, light, hands and places on screen. Libraries are also where clichés live. Treat them as an
archive to research, not a catalogue to shop from.

```bash
node scripts/find-footage.mjs --query "dawn mist over still water, wide, low contrast" --type video --out casting
#   → casting/contact.jpg: candidates numbered, each with source, licence, author, size
node scripts/find-footage.mjs --pick 4,9 --trim 2,6 --width 1600 --to assets
#   → trimmed, silent, compressed MP4 + poster frame for each, and a line in assets/CREDITS.md
```

Sources: **Openverse** (photographs, sound), **Wikimedia Commons** (photographs, video), **Internet Archive**
— the curated Prelinger and FedFlix collections of public-domain films (home movies, industrial films,
newsreels: real period texture), **NASA** (earth, sky, space). No keys needed. **Pixabay** and **Unsplash**
join when the user has a free key (`PIXABAY_API_KEY`, `UNSPLASH_ACCESS_KEY`). Only licences that allow
commercial use are returned.

- **Search with the shot, not the topic.** Write the query from the shot list — shot size, light, time of
  day, lens, texture: "macro, raking light, wet stone", not "coffee". Then cast from the contact sheet the
  way you would cast an actor: does this frame do what the scene needs?
- **Develop it in the film's lab.** Footage joins the picture only when it is graded like everything else:
  CSS `filter` (saturation, contrast, a duotone via SVG `feColorMatrix`), or on the stage through `look`
  and the post looks — an ink wash or halftone over real footage is still real footage, now in this film's
  medium. Ungraded library footage is a different film spliced in.
- **Archive as a device.** Public-domain period film is not just "free video": it brings grain, gate weave,
  sprocket holes and a past. Use it where the film wants memory, history or evidence, and say so.
- **Truth rules still apply.** Library people are not the client's team or customers; a library product is
  not the product; a library place is not their premises. Credit every asset (`CREDITS.md`, and on the page
  where the licence asks for it: CC BY and BY-SA need visible attribution; BY-SA also asks that adapted
  versions keep the licence). Recognisable people, logos and buildings may need releases whatever the licence.
- **Expect to look hard.** Free libraries are uneven: many clips are small, shaky or off-subject, and
  keyless video is mostly atmosphere and texture rather than polished stock. Raise `--count`, vary the
  wording, and accept that the right answer may be one perfect still instead of a mediocre clip.

### Footage on a site

```html
<video class="bg" src="assets/fog.mp4" poster="assets/fog.poster.jpg" muted playsinline loop autoplay preload="metadata" aria-hidden="true"></video>
```

- **Budget:** a background loop is 4–10 s, 1280–1920 px wide, silent, about 1–3 MB (`find-footage` already
  trims, scales and compresses). Always a poster frame; `preload="metadata"` below the first scene.
- **Mobile autoplay** needs `muted` and `playsinline`. Pause videos whose scene is off stage
  (`reel.phase(name)` / `IntersectionObserver`), and under reduced motion show the poster instead.
- **Scrubbed by scroll:** tween the element's `currentTime` in a scene clip
  (`main.fromTo(video, { currentTime: 0 }, { currentTime: video.duration - 0.1 }, 0)`). Encode with
  `--scrub` (every frame a keyframe, so seeking is instant) and keep such clips short — they are several
  times larger.
- **Serve with byte ranges.** Browsers cannot seek a video from a server that ignores `Range` requests
  (`python -m http.server` is one): scrubbing and film renders silently stick on the first frame. The
  skill's scripts and `npx serve` handle ranges.

### Footage on the stage and in film mode

```js
const clip = await looks.loadVideo('assets/fog.mp4');
const plane = looks.imagePlane(clip.texture, { height: 6 });   // footage as a plane in the set: lit, graded, looked
// site:  clip.video.play();                // let it run (pause it under reduced motion)
// film:  film.onFrame(async (t) => { await looks.syncVideo(clip.video, t, clip.texture); stage.render(t, { force: true }); });
```

In film mode footage is never played: `syncVideo` puts the exact frame for each timeline time on the
texture before the stage renders, so renders are frame-exact and repeatable. Open-licensed sound
(Openverse, `--type audio`) can be laid under a film with `render-film.mjs --audio`; credit it.

## Writing it in the treatment

```
Medium:      Painted multiplane with ink line — the film draws its world; backgrounds are gouache, figures are line.
Format:      1.85:1, soft daylight, no black anywhere; paper #f3ecdc, line #2b2622
Grade:       see the GRADE block (grades.md): measured from 8 stills of the cast sequence, or "unmeasured"
World:       see the ART and POSTER blocks (art-direction.md), researched per film-research.md
Why not 3D:  nothing in this film is solid or glossy; a rendered cup would belong to a different picture.
Shift:       none.        (or: ink → full colour at scene 6, the moment the product arrives)
Asset call:  6 painted layers + 3 spot illustrations — generate (approved by user on <date>) / awaiting answer
```
