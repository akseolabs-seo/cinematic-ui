---
name: cinematic-ui
description: >-
  Direct a website the way a film is made: cast a director and a film, choose the medium the film calls for (photoreal 3D, hand-drawn, ink wash, print, pixel, neon, type, photography…), cast a lead, ask for the assets, write a shot list for every section, then shoot it with a scroll-driven camera, designed cuts, a grade, and a screening pass on rendered frames. Use for Awwwards / Framer-grade landing pages, brand, product, portfolio and studio sites, immersive or WebGL / 3D sites, scrollytelling, "cinematic", "film style", "director style", "電影感", "導演風格", "分鏡", "像拍電影一樣做網站", a director's colour or film look (retro / nostalgic, film grain, neon / futuristic, "復古懷舊", "霓虹", "調色", "美術風格", "海報風格"), premium non-template design. Also directs apps in app mode: dashboards, back offices, admin panels, consoles, internal tools and the signed-in side of a SaaS product ("後台", "管理後台", "儀表板", "控制台", "面板", "dashboard", "admin").
metadata:
  version: "2.8.0"
  edition: "Cinematic UI 2.0 — Director's Cut"
---

# Cinematic UI 2.0 — Director's Cut

You are the director. The site is a film whose playhead is the scrollbar. A section is a scene, the
viewport is the frame, a scroll is a cut or a camera move, and the visitor is the audience, the editor,
and — once — a participant. You are not decorating a layout. You are deciding what the audience sees, in
what order, from where, in what light, made of what, for how long — and why.

One idea carries the whole skill: **borrow the film's mechanics, never its costume.** A director's style is
a set of decisions (where the camera stands, how long a shot holds, what the light hides, how a cut
lands, what the picture is made of). Those decisions translate into structure, motion, medium and
material. Film titles, characters, props and quotes do not appear in the product's UI unless the user
asks for a homage.

## Sites and apps

| | Site | App |
|---|---|---|
| Playhead | Scroll (and the visitor's other triggers) | The task: routes, selection, filters, the record's state |
| Output | A website people visit | A dashboard, back office, admin panel, console or logged-in product a crew works in all day |
| Rhythm set by | The visitor's hand | The shift: the same few jobs, hundreds of times |
| Read | everything below | **`references/app-mode.md` first**: it replaces stages 1, 6, 7 and 9, the award pass, the loader and the lazy cut, and changes how the rest apply |

**Apps are directed too, on a smaller budget.** When the brief is a dashboard, back office, admin, console,
internal tool or the signed-in side of a SaaS product (後台, 管理後台, 儀表板, 控制台, 面板), work in app mode.
Cinema gets about a tenth of the frame — the signature set only this product could have, the light that
tells the crew where to look, continuity across views, the once-a-day moments — and the rest is a quiet,
dense, keyboard-driven instrument built on `kit/app.js`, cast with `kit/fixtures.js` data, and screened in
every state with `scripts/app-screening.mjs`. A marketing site and its product app are two productions.

**Scope.** This skill directs websites and apps. A site built on the kit can be recorded as a video with
`node scripts/render-film.mjs <site> --tour 30`.

## The crew — what each film job means here

| On a film set | On this job |
|---|---|
| Producer | The brief: who the audience is, what they must do, what is true and may be claimed; the assets and budget |
| Screenwriter | Real copy, written before any layout. Headlines are dialogue; they are short |
| Director | You. One point of view, applied to every decision |
| Lead actor | The one entity the eye follows through the whole piece. It must change |
| Supporting cast, extras | Secondary objects, UI surfaces, type; particles, dust, crowds |
| Location, set | The world the scenes happen in: a space, a material, a kind of light |
| Cinematographer | Camera, lens, exposure, depth of field; the format and medium of the picture |
| Gaffer | Light: where it comes from, what it reveals, what it leaves dark |
| Production designer | The frame's grammar: grid, type, colour, material, texture |
| Art department | Assets: photographed, supplied, generated, drawn, modelled, or procedural |
| VFX | Three.js, shaders, particles, stylised rendering |
| Editor | Scroll rhythm, cuts between scenes, how long each shot holds |
| Colourist | Grade: the colour script across acts, grain, contrast |
| Sound | Silent by default, opt-in only |
| Title designer | Opening titles, intertitles, end credits (the footer) |

## The production

Work in this order. Each stage ends with something written or something rendered. Keep all writing in
one file, `treatment.md`, next to the build. Keep it lean — the shot list and the copy are its bulk — and
treat it as the thing you check the build against.

### 1. Development — the brief and the logline
Find the product truth: what it is, who it is for, the one action that matters, what can honestly be
claimed. If the product or page scope is genuinely unknowable, ask once. Otherwise decide and proceed.
Write the **logline**: one sentence in which someone wants something, something is in the way, and
something changes. Write the **audience arc**: what they believe when they arrive, what they believe when
they leave. Every scene exists to move them along that arc.

### 2. Cast the director
Pick one director and one of their films (or take the user's). Choose by the *dramatic problem* the
product has — it needs trust, awe, intimacy, speed, order, wit — not by genre association. Any film can be cast:
the skill has no film library. When the user names a film, research it. When they describe a look ("90s Hong Kong
late night, lonely, humid"), search for films that match the *picture*, not only the theme. Either way, follow
`references/film-research.md`: sourced credits and decisions, every line tagged [P]/[S]/[W]/[I], and frames looked at
before anything is built. Study a
specific sequence, not the director's reputation, and extract **five to seven mechanisms**, each a
concrete, observable decision and its translation into this site. Read `references/directors.md` and
`references/film-grammar.md`. Test each mechanism: *could a developer build it from this sentence, and
could a viewer point at it on screen?*
Hold a **casting session** in the treatment, without waiting for the user: three candidate directors,
three lines each (the mechanism that solves the dramatic problem, a signature shot, the risk, what it is
wrong for), then keep one and record why the other two were set aside. Ask of the winner: *could a
competitor use this direction unchanged?* If yes, it is not a direction yet.
Read **the filmography** (`~/.cinematic-ui/filmography.md`; create it if missing and tell the user): the
new treatment states how it differs from the last three productions on at least four of director,
medium, form, skeleton, type, lead, interaction, ending. The worked examples inside this skill count as already made.

### 3. Choose the medium
Decide what the picture is made of, from the film: observed (photography, footage), constructed
(photoreal 3D), drawn (line, cel, painted multiplane, ink), designed (flat shapes, print, type), heightened
(neon, grain, gradient light), elemental (ink, liquid, cloth), handmade (stop motion). Read
`references/looks.md` for the decision rule and how each is built. **The kit's 3D stage is one medium,
not the default**: a film made of type, drawings or photographs may need no canvas at all. Write one
sentence — *this film's mechanism becomes this mark-making, spatial and temporal language because…* — and
a "why not 3D" (or "why 3D") line.
Then **cast the grade** (`references/grades.md`): the film's colour is part of its mechanism, so commit to it.
Gather six to twelve reference stills of the cast sequence, measure them (`node scripts/grade-from-stills.mjs
refs/`), and write the GRADE block: where the colour comes from, the blacks, the highlights, the hues and banned
hues, the grain, the `look` numbers. If you have no stills, use the look book's starting values, mark the grade
*unmeasured*, and ask for stills in the asset call. The grade reaches the pictures (`kit/grade.js` on a DOM site,
`stage.look` on the stage: same parameters) and the page (ground, ink, accent and chrome tokens from the same
measurement). A retro film looks like that film's print, and a neon film is lit by its sources, not just tinted pink.
Then **cast the world and the poster** (`references/art-direction.md`). Write the ART block from the production
designer's decisions: shape, material, ornament, era of making, density per scene, in-world graphics. Write its
**UI map**, which turns them into the frame, grid, cards, buttons, dividers, forms and footer. Then write the
POSTER line: the composition grammar the first frame, OG image, title cards and end credits borrow from the
film's key art. The props, logos and the poster itself are costume.

### 4. Casting, locations, and the asset call
Name the **lead**: an object, a material, a figure, a typeface behaving like a character, a light. The
director decides how the camera looks at it; **the product's verb decides what it does** — it files,
pours, deploys, heals, connects. Give it an arc of at least three visible states built on that verb:
planted early, paid off at the turn, resolved in the final image. A lead that only rotates is an extra.
Award-winning sites run five to seven states of one subject, each a different shot of it, never a new
picture per section: write the state list now.
Name the supporting cast and the **location**: one coherent world with one light logic.
Then run **the asset call** (`references/looks.md`): list every asset the film needs and ask the user
once — will they supply it, should it come from a free licensed library (real photographs, footage, sound),
should it be AI-generated (with tool, count and rough cost), or should the shot be redesigned around a stand-in? Real things (logo, product, people, screenshots, numbers) come from
the user. Do not spend generation credits without a yes; if AI assets were approved up front, do not
ask again. **Casting test:** before promising a close-up, render the asset at that size and look. If it
does not survive, get a better asset or change the shot.

### 5. Screenplay
Write every visible word now: headlines, body, labels, CTA, and the title cards. Product-first — a
reader who has never heard of the film must understand everything.

### 6. Storyboard — the shot list
Decide the **form** first: a long scroll film, a chaptered piece, a mostly flowing document with a few
set pieces, or several pages. The product's information decides; not every site is a theatrical scroll.
When the copy is rich, the reader came for the document: pin only what develops, budget the hold, and
keep every word the client supplied.
Before the rows, fill **the award pass** (`references/award-reel.md`): the world object and every place it
reaches (loader, cuts, buttons, progress, cursor, footer), the lead's states, the loader as shot one, what
the cuts are made of, the one accent and its meaning, the type switch and display extreme, the 3–5
instruments, the visitor's verb, the triggers (scroll is one of at least four: entry, autoplay, click, hover,
drag), the type cast from `kit/type-fx.js`, and which scenes are set pieces and which are calm documents. It is
distilled from twenty-one award winners; it is how the director's mechanisms reach every frame.
Then one row per scene, hero to credits (`references/storyboard.md`): the beat, the copy, shot size, lens
and angle, camera move, blocking, light and colour, set density (from the ART block), what must be built, the asset and the closest shot it
can carry, the cut out, length, energy, the money frame, the mobile cut.
Write **the audience's part**: one interaction that enacts the product's promise — action → response →
lasting consequence → the same thing by keyboard and touch (`references/editing-and-motion.md`).
Set **the skeleton** deliberately — the shape of the energy, where the turn falls, how it opens, how it
ends — because two sites can look nothing alike and still be the same film underneath. Then read the
sequence as a whole: every change of shot and every repetition is there for a reason you can state, no
device (a type entrance, a light event, a camera move) is used by habit, and the lead is different at
the end.

### 7. Animatic — block before you light
Build the whole page rough, in the chosen medium: real copy, stand-in art, the moves and cuts from the
shot list. A drawn film blocks with rough layers and silhouettes; a photographed one with placeholder
frames in sequence; a 3D one with grey geometry. Scroll it. Rhythm and blocking problems are cheap here.
Start from `kit/site-dom.html` (no canvas: type, shape, image) or `kit/site.html` (3D stage) — keep the
wiring, replace everything visible.

### 8. Principal photography
Shoot it scene by scene: build or place the cast and set (`references/looks.md`,
`references/vfx-threejs.md`), light it, design the frame (`references/production-design.md`), cut it
together (`references/editing-and-motion.md`). Order within a scene, as on a set: blocking → light →
material → lens → grade.

### 9. Screening — dailies, then the projection room
Render it and look at it. `node scripts/screening.mjs <dir>` shoots every scene on desktop, a short laptop
and a phone, and lays the frames out as contact sheets; read the sheet as an image for sequence and rhythm. Then open
five frames at full size — the opening, the closest shot of the lead, the densest reading section, the
primary control, the mobile signature moment — because craft is judged at viewing size, not in
thumbnails. If you can delegate, hold a **test screening**: a fresh agent sees only the contact sheets
and says what the product is, what to do, what the lead is and which frame is the climax; compare with
the logline. Then screen it as a jury would (design 40 %, usability 30 %, creativity 20 %, content 10 %): is the same
subject in most frames and different at the end, is the accent findable in one glance, would the chrome
be recognisable as this world with the hero cropped out, is any cut a plain fade?
Write notes as named corrections (`references/screening.md`), reshoot, screen again.
**At least one full screening happens before anything is called finished**, and the accessible cut is
screened too (`--reduced`).

### 10. Delivery
Report what was screened and what was not, the director, medium and mechanisms, whether the GRADE, ART and
POSTER blocks were researched (sources and measured frames) or written from memory, every stand-in and every
generated asset, any open asset call, and how to run it. Never describe a frame you did not look at.
Append one line to the filmography: date, product, director / film, medium, form, skeleton, type, lead,
interaction, ending, instruments / switch device (so the chrome rotates too, not only the film). It is the only file this skill keeps outside the project; mention the append.

## The director's rules

1. **Mechanism, not mood.** Every stylistic claim in the treatment names something visible on screen.
2. **The medium, the grade and the world are cast, not defaulted.** What the picture is made of, what colour its
   light is and what its world is built from all come from the film: researched, and measured from its frames. Nothing (3D, grain, glow, a camera drift, a tint) is on screen
   because the kit had it switched on. Once cast, the grade is committed in full: a timid grade is a different film.
3. **One lead, one arc.** The eye always knows what to follow, and it is not the same at the end.
4. **Changes and repetitions are both chosen.** A new shot size, a repeated frame, the same cut twice:
   each is a decision with a reason. Sameness nobody chose is a slideshow; variety nobody chose is noise.
5. **Motion is camera or performance.** Something moves because the camera moved or because an actor
   did something. A thing that fades up for no reason is neither; cut it.
6. **Hold.** A composed frame that stays still is a shot. Contrast makes energy; constant motion is noise.
7. **Close-ups are earned.** The shot is no closer than the asset can bear. Weak assets stay wide, in
   silhouette, or off screen.
8. **Ask for what you cannot make.** Real products, people and brands are requested, not invented.
9. **The audience has a part.** Beyond scrolling, the visitor does one thing that means something.
10. **The frame is designed at rest, on every screen.** Pause anywhere, at any window size: it should be a
    composition someone chose. A page composed for one viewport is not finished.
11. **Words stay words.** Copy, links and controls are real DOM text — readable, selectable, focusable,
    indexable — at every moment, on every device.
12. **Two cuts ship.** The theatrical cut, and the accessible cut (`prefers-reduced-motion`, small
    screens, no WebGL): every scene still composed, every word still there.
13. **Screened or it did not happen.** Claims about how it looks come from rendered frames.

## The lazy cut — refuse it

These are what an undirected page looks like. If the shot list contains one, reshoot the scene.

- Centred headline, subhead, two buttons, a glowing blob behind them
- A row of three equal cards; a bento grid standing in for an idea
- Everything fading up 24 px as it enters the viewport, forever
- Photoreal 3D because the kit had a stage, on a film that was never solid or glossy
- A 3D object that floats and spins in the hero and is never seen again
- A close-up of code primitives pretending to be the product
- A filter over generic geometry, called hand-drawn; a brush font, called ink
- Purple-to-blue gradient, glassmorphism, and Inter, chosen by nobody
- A strong first screen followed by ordinary feature / testimonial / FAQ blocks
- A film reference that survives only as a palette and some adjectives
- A cast film whose colour never reached the page: tidy hex tokens on white, pictures ungraded, "retro" as one sepia overlay, "neon" as a pink–cyan gradient behind white type
- The two uncast grades: warm paper + vermilion + dark ink; cool grey + one blue or green accent
- The film's grade on a template's world: rounded cards, pill buttons and a four-column footer under a Wong Kar-wai
  light. Or the opposite, its props pasted on as decoration: umbrellas, scorpions, holograms, a pink hotel
- A floating-heads hero, or the film's poster reproduced: borrow the poster's grammar, never its artwork or lettering
- A film "remembered" instead of researched: credits, palettes and set details written from memory and presented as fact
- Scroll-jacking that traps the reader in a section with nothing developing
- Mobile as the desktop page squeezed into a column
- A spinner or a lone percentage as the loader; a loader that has nothing to do with the first shot
- A centred mid-size headline (48–72 px) because nobody chose an extreme
- An accent colour on every button and heading, meaning nothing; mono "[01]" labels on a product that is not about precision
- A themed hero followed by stock UI: the world never reaches the buttons, the progress mark, the footer
- Every section joined by a fade, or by the same clip-path wipe whatever the sections are
- Every performance scrubbed by scroll: nothing plays by itself, nothing waits for a click, a hover or a hand
- Type that only ever mask-rises: no type department, the kit's type library left on the shelf
- A winner's signature move copied whole (ticket buttons, barcode dissolve): study the mechanism, find this product's own object

## The kit and the tools

`kit/` is infrastructure; copy it into the project and build on it. Its lens and print effects all start
at zero, and nothing in it is mandatory.

| File | What it is |
|---|---|
| `kit/reel.js`, `reel.css` | The playhead. `[data-scene]` sections with pinned `.frame`s; each scene gets `enter` / `main` / `exit` clips on one master GSAP timeline scrubbed by scroll. Designed cuts via `data-cut`. Reduced-motion stills. Any frame reproducible from one number. No WebGL needed |
| `kit/looks.js` | The lab: media other than photoreal. Whole-frame looks (ink wash, pencil sketch, pixel, halftone / riso, CRT), cel materials and outlines, liquid and gradient plates, illustrations, photographs and footage as layered 2.5D planes, hand-drawn line boil for DOM and SVG |
| `kit/stage.js` | The sound stage, when the medium is 3D or needs a canvas. HDR Three.js pipeline, image-based studio lighting, a tweenable camera `rig` and colour `look`, optional bloom and depth of field, quality tiers, WebGL fallback |
| `kit/props.js` | The prop shop for photoreal sets: seamless backdrop, procedural surface maps, lathed forms, PBR material starting points, dust |
| `kit/type-fx.js` | The type department: forty-four text performances (impact, flow, 3D, switch, style, and four award moves taken from Awwwards winners) — burst, stamp, split-flap, odometer, tunnel, vertical parallax, liquid fill… Each frame a pure function of progress `p` and time `t`, so scroll scrubs it and a clock renders it frame-exact; real text stays in the DOM. `kit/type-fx.html` is the gallery. Cast one or two per production (`references/type-motion.md`) |
| `kit/grade.js` | The colour grade for DOM sites: `createGrade({ look, spec })` with the same parameters as `stage.look` (white balance, contrast, saturation, split-tone, lift, fade) plus halation, bloom, grain, vignette, light leak and gate weave. It grades photographs, video and canvases through one SVG filter. Type and controls stay unfiltered. Frames are reproducible from one time value. `kit/grade.html` is the gallery |
| `kit/plane.js` | The UI plane camera, for scenes whose cast is an interface: `uiPlane(el, { dof })` puts live DOM under CSS perspective with a plain-object pose, `SHOTS.{xmacro,macro,medium,wide}` presets, DOM depth of field and rack focus without WebGL, a `[film]` audit when consecutive shots share scale and diagonal, and UI performance recipes (`appear`, `stipple`, `uiCursor`) |
| `kit/site-dom.html`, `kit/site.html` | Grey animatics: a site with no canvas, a site with the 3D stage |
| `kit/app.js` | App mode's rig: hash router with filters, sort and selection in the URL, forced screening states (`?state=`), a frozen clock (`?now=`), keyboard shortcuts with sequences and a shortcut sheet, hints learned through the mouse, j/k row navigation with selection, a peek or modal drawer, a command palette, toasts with undo. No look |
| `kit/fixtures.js` | Seeded stand-in data with real shape: long-tailed values, noisy series with events, mixed-locale names, working-hours timestamps, edge rows (long, empty, zero, negative, huge, unicode) |
| `kit/app-shell.html` | Grey animatic of an app: shell, overview, list, record in a peek panel, every state |
| `scripts/screening.mjs` | Dailies: per-scene stills, contact sheets, mechanical flags (errors, blank frames, dead holds, overflow, chrome over text, hidden focus, and with `--grade grade.json` or a page `grade.js` spec: grade drift, crushed or lifted blacks, clipped whites, saturation and warmth off the grade). Works on any URL, so it can also shoot reference sites |
| `scripts/grade-from-stills.mjs` | Measures reference stills into a grade: palette with shares, black and white points, chroma range, shadow and highlight warmth, a suggested `look`, and a swatch contact sheet. The stills are reference only and never ship |
| `scripts/app-screening.mjs` | Dailies for an app: every route × state × viewport × theme, contact sheets, and flags for proportional digits, left-aligned numbers, clipped text, layout shift between loading and loaded, low contrast, small targets, hidden focus and blank states |
| `scripts/copy-check.mjs` | Checks that every line of client-supplied copy is in the page, with and without JavaScript |
| `scripts/render-film.mjs` | Renders a tour of a site to MP4: motion blur, grain, parallel workers, a half-size `--preview`, a poster frame, and sound — one track or a sound sheet (music edited at bar lines, ducks, foley cues); `--stills` for dailies, captioned with luminance and near-black share |
| `scripts/find-footage.mjs` | The archive researcher: searches open libraries (Openverse, Wikimedia Commons, public-domain films on the Internet Archive, NASA; Pixabay / Unsplash with a key) for photographs, footage and sound, lays candidates out with their licences, then trims, compresses and credits the ones you cast |
| `scripts/generate-image.mjs` | One optional route for generated plates, illustrations and cut-outs (Runware; needs the user's key and their yes) |

Read `kit/README.md` before using it: it lists the API and the handful of rules that keep frames
deterministic. The kit is a rig, not a template — two sites built on it should share no visible trait.
Scripts need Node and `playwright-core` in the project (`npm i -D playwright-core`); rendering needs `ffmpeg`.

Other stacks are fine. In React / Next / Astro keep the model — scenes with pinned frames, one scrubbed
timeline, real DOM copy, any frame reproducible — and port the kit's ideas rather than its files.

## References — read when the stage calls for it

| Read | When |
|---|---|
| `references/app-mode.md` | Apps: the shift, casting by the work, the coverage plan and signature set, the lighting plan, density, the accent and status systems, motion by frequency, the eight states, data casting, keyboard, the phone, the app lazy cut |
| `references/award-reel.md` | What twenty-one Awwwards and fifteen CSS Design Awards winners share and where they differ; the award pass (incl. UX proof); the lazy imitation of award sites |
| `references/directors.md` | Casting the director; extracting mechanisms; avoiding the obvious pick |
| `references/film-grammar.md` | Translating any film technique — shot, lens, move, light, cut, colour, time — into web mechanics |
| `references/looks.md` | Choosing the medium from the film; the asset call; how each medium is built |
| `references/film-research.md` | Researching any film live: from a description to candidate films, the research rounds, source tiers and tags, known blocked sites, looking at frames and posters, the GRADE / ART / POSTER outputs |
| `references/art-direction.md` | The film's world and its poster: the ART block and UI map, the dials, poster grammars (Bass, Polish, chirashi, Swiss, painted stack, Criterion, Mondo) for the first frame, OG image, title cards and credits, and fourteen worked examples |
| `references/grades.md` | Casting the grade: measuring reference stills, the GRADE block, the dials, refused defaults, and fourteen sourced looks in two families: retro / nostalgic (Wong Kar-wai, Demy, Willis, Hou, Malick, Anderson, Mid90s) and modern-future / neon (Blade Runner, 2049, Drive, Neon Demon, Collateral, Enter the Void, Tron: Legacy) |
| `references/storyboard.md` | Logline, form and structure, shot list, the sequence as a whole; a worked example |
| `references/production-design.md` | The frame's grammar: composition, typography (Latin and CJK), colour script, material |
| `references/vfx-threejs.md` | When the medium is photoreal 3D: light, materials, modelling, shaders, lens, performance |
| `references/editing-and-motion.md` | Scroll as a timeline, the cut catalogue, the audience's part, type choreography, easing, performance |
| `references/type-motion.md` | Casting a type performance from the forty-four in `kit/type-fx.js`; driving it by scroll or by clock |
| `references/screening.md` | Reviewing dailies; the director's notes; accessibility, mobile, SEO and performance checks; the delivery report |

## Working with the user

Default is to direct: make the decisions, build, screen, and show the result with the treatment. Stop
to ask in exactly three cases: the product or scope cannot be inferred; **the asset call** (one message,
with your recommendation — it is the user's material and the user's money); and anything that would
publish, deploy or overwrite outside the project. If the user asks for options, or the direction is truly
open, **pitch**: three treatments, each a different director, medium and logline, one paragraph and one
signature shot apiece — then build the chosen one. If the user names a director, film or medium, use it;
if the choice would hurt the product, say so once and offer the mechanism you would keep.

Respect the stack and content the user already has.
