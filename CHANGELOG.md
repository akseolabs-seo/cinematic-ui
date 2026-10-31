# Changelog

## 2.8.0 — App mode: dashboards, back offices, consoles

Public release of Cinematic UI 2.0 — Director's Cut. Live demos: https://cinematicskill.com/gallery/

Three blind tests (a SaaS analytics office, an order back office, an on-call console) built with site mode
alone came out competent and interchangeable: three directors, one look (muted ground, one accent, boxed
panels, four equal KPI cells on top). The film reached the palette, not the structure; the kit and screening
were unusable; nobody designed empty, loading or error states; one accent could not carry status.

- New `references/app-mode.md`: the playhead is the task. The shift replaces the logline (three frequent jobs,
  one rare high-stakes job); the director is cast by the work's dramatic problem and tested by deleting the
  palette; the coverage plan replaces the award pass (shot size by job, the lit region, density, continuity,
  states, keys, the phone decision); the signature set replaces the KPI row. The lighting plan, density and
  numerals, the accent kept apart from a status system, motion by frequency, the eight states, data casting,
  keyboard and undo, and an app lazy cut.
- New `kit/app.js` (router with state in the URL, screening states, frozen clock, shortcuts, kbd hints, row
  navigation, peek drawer, command palette, undo toasts), `kit/fixtures.js` (seeded long-tailed data and edge
  rows) and `kit/app-shell.html` (grey animatic, all eight states).
- New `scripts/app-screening.mjs`: routes × states × viewports × themes, contact sheets, and flags for
  proportional digits, left-aligned numbers, clipped text, layout shift, low contrast, small targets, hidden
  focus, blank and ignored states.
- `SKILL.md` routes dashboards, 後台 and consoles to app mode.
- Retested blind with the same three briefs on this version. No KPI row in any of them; each found a
  signature set from its own data (a three-month bridge where only the deviation is lit, a fleet as a fixed
  plan, the day's collection gates as a letterboxed yard); lists went from 8–15 to 20+ rows on screen; every
  route was screened in all eight states, and the screening found and fixed 26–30 flagged shots per app down
  to phone-only layout shift. What the retest still showed, now written in: the uncast app grade (olive or
  putty with amber, four of six), the accent spread over a whole queue, test strings and totals that do not
  reconcile in the default state, skeletons for variable-length records, chart and record-page guidance,
  bulk partial success, data marks versus controls, dark-only screening, the signature set on a phone.
- Third blind round on those rules: the olive-and-amber grade gave way in two of three (a blue-green wall with
  rust, black-and-white with one sourced pink), the accent marked only the exceptions (late orders, unacknowledged
  incidents, slipped accounts), every total reconciled, bulk actions reported partial success, and the phones got
  their own compositions. Fixed from it: `app-screening.mjs` mutated a cached colour (one dimmed element made every
  text of that colour fail contrast); `kbdHints()` doubled hints when called twice; growing record regions
  (`data-region-grow`) and per-view states (`data-states`) are now understood instead of flagged; `--fold` shoots
  viewport frames. app-mode.md adds the grade without stills, record-page states, sticky headers inside overflow
  wrappers, colliding chart labels, and the phone table squeezed into a column.

## 2.7.0 — Any film, researched; the world and the poster

**No film library.** The look book had started to read like a menu of fourteen films. Now any film the user
names, or any look they describe, is researched live, and the fourteen are worked examples.

- New `references/film-research.md` covers live research of any film:
  - from a description to three candidate films matched on the *picture*, not the theme (tested on "90s Hong
    Kong late night, lonely, humid");
  - research in rounds with a cap: credits, light and grade, art direction, poster and titles, and searches in
    the film's own language;
  - every line tagged [P] primary / [S] secondary / [W] wiki / [I] inference;
  - known blocked and useless sources, and the fields that are usually findable or usually missing;
  - looking at reference stills, set details and the poster (viewed, never shipped);
  - the GRADE, ART and POSTER outputs, and an honest fallback with no web access.
- New `references/art-direction.md` covers the film's world and its poster:
  - the ART block, whose UI map turns the production design into the frame, grid, cards, buttons, dividers,
    forms and footer;
  - the dials: shape, material, ornament, era of making, density, in-world graphics;
  - the poster layer, which borrows a composition grammar (Bass, Polish School, chirashi, Hong Kong painted, Swiss,
    Criterion, Mondo, roster-in-the-world) for the first frame, the 1200×630 OG image, title cards, the footer as
    end credits and the phone's portrait recomposition, never the poster itself;
  - worked examples for the same fourteen films, with sourced designer decisions (Chang, Evein, Tavoularis,
    Hwarng, Fisk, Stockhausen and Atkins, Assa, Paull and Mead, Gassner and Territory, Mickle, Hostetter, Wasco,
    Caro and Ohta, Gilford);
  - credit corrections found in research: Mid90s → Jahmin Assa, The Neon Demon → Elliott Hostetter, Enter the
    Void → credits disputed.
- Tested with a fresh agent on an unlisted brief ("1980s Taiwan summer nostalgia" for an oolong brand). It searched
  live and cast *A Summer at Grandpa's* (not one of the examples), tagging what it could not source. Its process
  notes added these rules to film-research.md: thin-evidence fallbacks (no stills, no poster, the client's word
  versus the refused defaults), a [conflict] tag, archives and original-language search before calling a field
  missing, and viewing stills in a browser or image tool.
- `grades.md`: the fourteen looks are now "worked examples", and the chain starts with research.
- SKILL.md:
  - casting accepts any film or description through film-research.md;
  - stage 3 casts the world and the poster after the grade;
  - rule 2 covers the world;
  - shot-list rows carry set density;
  - the delivery report says whether GRADE, ART and POSTER were researched or remembered;
  - four new lazy cuts: the film's grade on a template's world, or its props pasted on; floating heads or a
    reproduced poster; a film remembered instead of researched;
  - the description triggers now include 美術風格 and 海報風格.
- Shared references: `directors.md` (the casting book is a starting shelf, not the limit), `production-design.md`
  (start from the cast film's production design), `looks.md` (a World line in the treatment), and `screening.md`
  (the world check: crop the hero out, is the chrome still the film's world?).

## 2.6.0 — The grade is cast

**A cast film's colour now reaches the page.** Until now the grade lived only in `stage.look`, a WebGL pass,
so DOM sites (most of them) had no grade at all. Directors' colour also existed only as prose, and the
"mechanism, not costume" rule was being read as "keep the colour polite".

- New `references/grades.md`: how to cast a grade (reference stills → measure → GRADE block → build → screen),
  the dials (where the colour comes from, blacks, highlights, hue count and banned hues, grain, time and format),
  refused defaults (warm paper + vermilion + dark ink; cool grey + one blue or green accent; the cheap retro and neon
  imitations), and fourteen sourced looks in two families. Retro / nostalgic: Wong Kar-wai / Doyle, Demy,
  Willis, Hou / Lee Ping-bin, Malick / Almendros, Anderson / Yeoman, Mid90s. Modern-future / neon: Blade Runner,
  Blade Runner 2049, Drive, The Neon Demon, Collateral, Enter the Void, Tron: Legacy. Facts are cited (mostly
  American Cinematographer); starting values are marked as translations to be replaced by measurement.
- New `kit/grade.js` and `kit/grade.html`: the DOM grade with `stage.look`'s parameter names (bloom calibrated to
  the stage's scale) plus halation, grain, vignette, fade, light leak and gate weave. It grades photographs,
  video and canvases through one SVG filter and leaves type unfiltered. It is deterministic per time value and
  driven by the reel or a film clock, and reduced motion keeps the colour. The gallery shows the look book's films;
  its two assets are public domain / CC0 (`kit/grade-assets/CREDITS.md`).
- New `scripts/grade-from-stills.mjs`: measures reference stills into palette and shares, black and white
  points, chroma range, shadow and highlight warmth, a suggested `look`, and a swatch contact sheet.
- `scripts/screening.mjs`: `--grade grade.json` (or the spec `grade.js` publishes) adds `grade-drift`,
  `grade-warmth`, `grade-black`, `grade-white`, `grade-saturation` and `grade-outlier` (a few deliberate-looking scenes, named, not counted as drift). With no spec the output is unchanged.
- SKILL.md: stage 3 now casts the grade, director's rule 2 covers the grade, two lazy cuts (a cast film whose
  colour never reached the page; the two uncast grades), new kit and reference rows, and colour-look triggers in
  the description (復古懷舊, 霓虹, 調色).
- Shared references: `looks.md` (the genre pitfall no longer reads as "avoid neon"; a Grade line in the
  treatment), `directors.md` (Wong Kar-wai's "red tint" refusal clarified), `film-grammar.md`,
  `production-design.md` (measure before choosing hexes), `screening.md` (4a. Against the grade).

## 2.5.0 — Deck mode removed

**This skill now covers sites only; deck mode is gone.** Removed 2.2.0's deck mode and the editing panel, with
the deck rows in the toolkit and references, the deck screening and filmography notes, and the deck sections of
both READMEs and `kit/README.md`.

- Kept: `scripts/render-film.mjs` for a site `--tour`; `reel.js`, `type-fx.js`, `plane.js`, `stage.js`, `looks.js`,
  `props.js`.

## 2.4.0 — Film mode removed

**Film mode and promo motion are gone from this skill.** Removed 2.2.0's film mode and 2.3.0's promo motion, with
the film rows in the toolkit and references and the film examples in both READMEs and `kit/README.md`.

- Kept: `scripts/render-film.mjs` for a site `--tour`; `kit/plane.js`; `reel.js`, `type-fx.js`, `stage.js`,
  `looks.js`, `props.js` unchanged.

## 2.3.1 — Fix patterns

**What fixing eight demo sites taught.** Each pattern below was a visible flaw in more than one demo.

- **CJK display setting** (`production-design.md` CJK; snippet in `kit/README.md`) — phrases in inline-block
  `.ph` spans, `"halt"` on display type, `keep-all` / `strict` / `balance` for headings, `pretty` for body;
  every H1–H3 audited at 1440, 1366 and 390.
- **Fixed chrome never lands on content** (`production-design.md`, the interface) — a scene-aware ground,
  72 px clearance, hidden over the credits and while a phone form field has focus, `scroll-padding` so focus
  is never under it, the phone status instrument docked as the header's second line.
- **Phone wayfinding in the thumb zone** (same section; pointer from `award-reel.md`) — the bottom pill
  (CTA + index with `aria-expanded`, Escape returns focus), the 目次 rail, a thumb bar of equal keys for a
  live product moment; targets ≥ 44 px.
- **No dead air** (`editing-and-motion.md`, cuts) — the next subject in before the cut, title-card words on
  their mark from the first frame (the `--enter` counter-translate), copy cleared before a moving clip edge.
- **Copy the kit fresh** (`kit/README.md`) — demos carried stale `type-fx.js` copies.
- **`screening.mjs`** — two new flags in the same report: `chrome-over-text` (fixed or sticky chrome on page
  text, per frame) and `focus-hidden` (a Tab walk, `--tabs 60`: invisible, off-screen, clipped-ring and
  under-chrome focus). Documented in `screening.md`.
- **`reel.js`** — `reel.current()` and `reel.onScreen(name)`: which scene is on screen, also under reduced
  motion, where every phase reads `'main'`.

## 2.3.0 — Promo Motion

**The motion-graphics school of the product film.** Distilled from a frame-by-frame study of nine agency
SaaS launch films (4 fps contact sheets, 12–24 fps strips around ~64 transitions).

- **`references/promo-motion.md`** — the second school beside the cinema cut: cuts only at chapters and on
  action peaks, scenes handed over by transformation (becomes the container, zoom-through, logo portal,
  collapse and grow, pull-back reveal, fly-through into type), one lead shape doing every transition, the
  chapter map, the rebuilt UI (skeleton + hero values, bottom-fade floating cards, selection by lift, push
  and smash, the scan-line magic gesture, the type-to-UI seed), seven type voices, six house styles to
  rotate, two-clock rhythm with escalating repeats, living end cards, and a refuse list.
- **`kit/promo.js`** + gallery **`kit/promo.html`** — frame-exact tools: `actor` (to / dot / flood /
  wipeOpen / hide), `handoff`, `unfold`, `portal`, `focusLift`, `pushTo`, `smash`, `scan`, `clickBloom`,
  `caretCam`, `scatter`, `scramble`, `retype`, `slotGhost`, `drift`, `ticker`, `applyAll`, `rectIn`.
- **`film-mode.md`** — choose the school in the treatment; claim-then-proof, the chapter map and escalating
  repeats join the SaaS launch film; the floating-card refusal now says what makes a floating card right;
  video-shotcraft joins HyperFrames as a studio this skill can direct; whole-frame slams are rationed to
  three a film; and the first screening before delivery is given by a clean-context reviewer, never the maker.
- **`SKILL.md`** — the filmography records school and house style so films rotate.

## 2.2.0 — Three Modes

**Deck mode, a SaaS-launch film mode, and a second jury.**

- **Deck mode** (`references/deck-mode.md`, `kit/deck.js` + `deck.css` + `deck.html`, `scripts/render-deck.mjs`) —
  presentations as films whose playhead is the presenter's click. The screenplay discipline of `ppt-master`
  comes first (audience move contract, declared surface, evidence ledger, titles-only storyline, one slide
  contract per slide, owned next move); then slides as shots, builds as light and focus moves, designed cuts,
  one live product moment, a synced presenter view, URL-addressable builds, reduced motion, PDF export, and
  the autoplay cut rendered to video by `render-film.mjs`.
- **`kit/deck-edit.js`** — an optional editing panel inside the deck (E or `?edit`): change any word in place,
  replace or add images (file, drop, paste; move, resize, alt text required), text boxes on a build, notes, undo /
  redo, autosave, Download HTML with the edits written in, edits as JSON. Never loaded while presenting or rendering.
- **Deck mode: the look of a professional deck** (`references/deck-mode.md`) — the visual language shared by
  admired keynotes, featured templates and the presentation-design canon, as rules with numbers for a 1080p stage:
  a 12-column frame with a fixed title frame, a type scale, density by the glance test, boxes only for things that
  are boxes, one accent, quiet chrome, a layouts catalogue on the grid, and what an AI-made deck gets wrong. `?grid`
  overlays the grid for screening; the deck animatic now starts from the frame. The Lull demo deck was re-shot with it.
- **The SaaS launch film** (`references/film-mode.md`) — structure, product UI as the lead, kinetic type at
  video speed, 15/30/60 s pacing, aspect cuts, sound registers and the sound sheet, a polish checklist and the
  lazy promo to refuse. Action-led rhythm joins the beat grid and the voice.
- **`kit/plane.js`** — a camera for live UI: `uiPlane`, shot presets from extreme macro to wide, DOM depth of
  field and rack focus without WebGL, a shot audit, UI recipes. `film.js` gains `read`, `typing`, `path`,
  `lag`. `render-film.mjs` gains workers, `--preview`, `--grain`, `--poster` and a sound sheet.
- Distilled in part from a study of 1weiho/cinematic-shot (UI macro shots, action-led cutting) — as optional
  tools, never a default look.
- `find-footage.mjs`: Openverse searches no longer fail silently above 20 results.


## 2.1.0 — The Award Reel

**Calibrated against twenty-one Awwwards winners, and a type department.**

- **`references/award-reel.md`** — two Sites of the Year, fifteen Sites of the Month and four recent Sites of
  the Day (Lando Norris, Igloo Inc, Cartier, Siena Film Foundation, Terminal Industries, Heron AI…) studied
  frame by frame on desktop and phone. Fourteen shared patterns, ranked by how far they separate a winner
  from a generated page: one subject in five to seven states; the world reaching the chrome; the loader as
  shot one; cuts made of the world; one accent with a meaning; two type roles, one switch, an extreme size;
  instruments instead of navigation; and more. Where the winners differ, as dials to choose rather than
  average. The lazy imitation of award sites, called out.
- **The award pass** — eleven lines in the treatment before the shot list (world object, lead states,
  loader, cut material, accent, type, instruments, verb, rhythm), and a jury screening weighted as Awwwards
  weights it (design 40 %, usability 30 %, creativity 20 %, content 10 %).
- **`kit/type-fx.js`** — forty-four text performances: five families (impact, flow, 3D, switch, style) plus
  an award family taken from the winners (slit-scan roll, reading fill, blur resolve, selection box). No
  dependencies; every frame a pure function of progress and time, so scroll scrubs it and film mode
  renders it frame-exact; real text stays in the DOM; reduced motion rests on a legible pose. Gallery in
  `kit/type-fx.html`, casting guide in `references/type-motion.md`.
- **SKILL.md** — the lead's state list, the award pass, the jury screening, six new entries in the lazy cut;
  the filmography now logs instruments and the switch device so the chrome rotates too.
- **Click-driven films** — a recipe in `editing-and-motion.md` (one state function, cuts as timed clips,
  three inputs per advance, the visitor's choice persists), and `screening.mjs --act` now runs on any page,
  not only pages built on `reel.js`.
- **Triggers and the type department** — a trigger palette in `editing-and-motion.md` (scroll scrub, scroll
  entry, autoplay, click, hover, drag/hold, input, idle; at least four kinds per piece), TRIGGERS and TYPE CAST
  lines in the award pass, and a type department of three to five moves around the signature one.
- **The second jury** — fifteen CSS Design Awards winners (UI, UX and Innovation scored separately) added to
  `award-reel.md`: the conversion tool as the set piece, lead states from the use cycle, cards that carry
  decision data, designed wayfinding, visible accessibility and consent (a UX PROOF line in the award pass),
  hover as the hidden side, loaders inside the scene, lenses for collections — and the places they correct
  the Awwwards patterns.
- **type-fx in real pages** — `typeFx.defaults({ font: 'inherit' })` so every effect takes the page's cast
  face; switch effects expose the text on screen to screen readers (not "a / b"); `select-box` takes
  `labelFont` and selects whole figures; `split-flap` keeps unchanged cells and punctuation still;
  typewriter's caret hides at rest; CJK-aware `pad`; highlighter keeps inline markup; `slot-roll` `cell`;
  odometer `zeros: false`, `fx.value`, and a window clipped to the ink band; slit-scan's roll bounded by
  `bleed` — the last two fix rolling digits and slices printing over the lines above and below.
- **Field-tested again** on three more demos (a perfume launch with short copy, a 24-hour animal ER with
  medium copy, an accounting SaaS with long copy), each run with cro-master and talking-master. Fixes from
  them: the conversion-page exception to "no headline in the first frame", the CTA line in the award pass,
  "screens to the offer" under the shot list, CRO edits fold rather than delete, `stage.render` with a pose
  object, `blur-resolve` inherits the page's face, key `p: 0` from the clip start, act frames no longer
  flagged as dead holds, and two more kit gotchas.
- **Field-tested** on a click-driven demo (a film lab, directed after *Blow-Up*); its critique produced the
  native-vs-costume test, the chrome-sameness warning, the `read-fill` boundary and three kit gotchas.

## 2.0.0 — Director's Cut

**Cinematic UI stops asking an AI to design a website. It asks it to direct one.**

1.x treated film as a reference: pick a director, borrow the mood, then run a long pipeline of image
proofs, approval gates and contracts to keep the result on track. It worked, and it was heavy — and the
sites still tended to end up as a premium template wearing a film's palette.

2.0 is rebuilt from an empty folder around a different idea: **a site is a film whose playhead is the
scrollbar.** Sections are scenes. The viewport is the frame. A scroll is a cut or a camera move. The
agent's job is the director's job — decide what the audience sees, in what order, from where, in what
light, made of what, and why — and then prove it on rendered frames.

### What's new

**🎬 A real production, start to finish**
Logline → cast the director → choose the medium → cast the lead → the asset call → screenplay → shot
list → animatic → principal photography → screening → delivery. One working document (`treatment.md`).
No phase gates, no approval files, no JSON contracts.

**🎥 Directors as mechanisms, not moods**
Forty-odd directors written as what they actually *do* — where the camera stands, how long a shot holds,
what the light hides, how a cut lands — each translated into structure and motion, each with "the lazy
version" called out. A casting session picks one and records why the other two lost. A filmography makes
the next production differ from the last three.

**🖌 The medium is cast from the film**
Photoreal 3D is no longer the default — it is one medium among many. The skill reads the film's
relationship to reality (observed, constructed, drawn, designed, heightened, elemental, handmade) and
builds in the medium that follows: ink wash, pencil and watercolour, cel shading, pixel, halftone and
risograph, CRT and neon, liquid, gradient light, painted 2.5D multiplane, pure typography, photography —
or a studio-lit 3D stage when the film really is solid and glossy. Every look ships as tested code.

**📋 A shot list for every section**
Not a hero and some cards: every scene gets a beat, a shot size, a lens, a camera move, blocking, light,
a cut, a length, a money frame and a mobile cut. Plus the skeleton underneath — energy shape, where the
turn falls, how it opens, how it ends — so two sites cannot secretly be the same film.

**🤝 It asks before it fakes**
The asset call: one message listing what the film needs and three routes for each — you supply it, it
generates it (tool, count, cost), or the shot is redesigned. Logos, products and people are requested,
never invented. And no close-up is promised on an asset that cannot survive one.

**🎞 Real footage, legally**
`find-footage.mjs` researches open libraries — Openverse, Wikimedia Commons, public-domain films from the
Internet Archive, NASA (and Pixabay / Unsplash with a free key) — for photographs, footage and sound. Search
with the shot, cast from a contact sheet that shows every licence, and get back trimmed, compressed clips
with posters and a `CREDITS.md`. Footage runs as a background, scrubs with scroll, sits in the 3D set under
the film's looks, or plays frame-exactly inside a rendered film.

**👆 The audience gets a part**
One interaction per film that enacts the product's promise — action, response, a consequence that
stays, and the same thing by keyboard and touch — with every small interaction speaking its language.

**🎞 A kit with no look of its own**
`reel.js` — scenes, pinned frames, `enter` / `main` / `exit` clips on one scrubbed timeline, designed
cuts, reduced-motion stills, any frame reproducible from a single number.
`stage.js` — HDR Three.js pipeline, softbox studio lighting, a tweenable camera rig and grade.
`looks.js` — the non-photoreal media. `props.js` — procedural sets and PBR materials.
Every lens and print effect starts at zero. Nothing is on screen that the director did not put there.

**🔍 Screened or it did not happen**
`screening.mjs` shoots every scene on desktop, a short laptop and a phone, lays them out as contact
sheets, and flags blank frames, dead holds, sliced text and overflow. Then five frames are judged at
full size, because craft does not show in thumbnails. The accessible cut gets screened too.

**📽 Film mode**
The same craft on a clock instead of a scrollbar: direct a launch film, teaser or trailer in HTML, cut it
to a beat grid, and render it to MP4 with a real shutter (`render-film.mjs --motion-blur 8`). Or record
any site built on the kit as a tour, in one command. Works alone, or as the director for HyperFrames.

**🈶 Built for CJK as well as Latin**
Vertical setting, hand-broken lines, mixed-script rules and typeface casting for Traditional and
Simplified Chinese, Japanese and Korean — treated as a composition system, not a font swap.

### What's gone

The image-proof-first pipeline. Phase gates, approval JSON, run contracts, receipts and validators. The
2.3 MB design-DNA database, the directors-200 table, effect, font, colour and composition catalogues.
Provider-specific image protocols. Roughly two hundred files became thirty.

### How it was tested

Fresh agents with no context were given only this skill and a client brief. They produced a tea brand
homepage, a twenty-second launch teaser rendered to video, an independent bookshop's subscription page
built with no 3D at all, and a copy-heavy consultancy page. Their friction logs, an independent review by
a second model, and a survey of seventeen other skills each fed back into the text and the kit before
release. Kit and scripts are verified in headless Chrome with three 0.186, GSAP 3.15 and Lenis 1.3.

### Honest limits

Not verified on Safari, Firefox, real phones or screen readers. Smoothness cannot be judged headlessly.
Procedural 3D still struggles in close-up on familiar real objects — which is why 2.0 asks for assets
and keeps weak ones in wide shot. Gaussian splats are described but not built. Film mode renders
silent unless you supply a track. `kit/film.html` is not a lint-clean HyperFrames composition.

### Upgrading from 1.x

Nothing carries over except the idea. Replace the skill folder; old `decisions.md` / `storyboard.md` /
`compiled-spec.md` projects keep working as plain sites but are not read by 2.0.
