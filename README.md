# Cinematic UI 2.0 — Director's Cut

**An agent skill that directs websites and apps the way films are made.**

AI-built sites tend to look alike because nobody chose anything. Cinematic UI makes your agent cast a director,
decide what the picture is made of, write a shot list for every section, shoot it, and check the rendered frames
before handing it over.

**[Website](https://cinematicskill.com/)** · **[Live demos](https://cinematicskill.com/gallery/)** · **[Docs](https://cinematicskill.com/docs/)** · English · [繁體中文](README.zh-TW.md)

```bash
git clone https://github.com/akseolabs-seo/cinematic-ui ~/.claude/skills/cinematic-ui
```

Then tell your agent: `/cinematic-ui a homepage for a pour-over coffee subscription`

## Launch film

[![Watch the Cinematic UI 2.0 launch film](docs/launch-film-en.jpg)](https://github.com/akseolabs-seo/cinematic-ui/releases/download/v2.8.0/cinematic-ui-2.0-launch.mp4)

**[Watch the launch film](https://github.com/akseolabs-seo/cinematic-ui/releases/download/v2.8.0/cinematic-ui-2.0-launch.mp4)** · 1:30, MP4, with sound, on-screen text in Traditional Chinese

## Live demos

Ten live sites at **[cinematicskill.com](https://cinematicskill.com/gallery/)**, each made by an agent with this
skill. Every brand is fictional; the output is real. Click a frame to open the site. Each one also has its
treatment: the director, medium, lead and grade it chose, and why. The site lists the English productions in the
[gallery](https://cinematicskill.com/gallery/) and the Traditional Chinese ones in the
[zh-TW gallery](https://cinematicskill.com/zh-tw/gallery/).

<table>
<tr>
<td width="50%"><a href="https://cinematicskill.com/demos/lockwork/"><img src="docs/demos/lockwork.jpg" alt="Lockwork"></a><br><b>Lockwork</b>, AI ops agents<br>Robert Wise, <i>The Andromeda Strain</i><br>A live typeset monitor wall · <a href="https://cinematicskill.com/gallery/lockwork/">treatment</a></td>
<td width="50%"><a href="https://cinematicskill.com/demos/purser/"><img src="docs/demos/purser.jpg" alt="Purser"></a><br><b>Purser</b>, business spend cards<br>Billy Wilder, <i>The Apartment</i><br>Monochrome CSS 3D office · <a href="https://cinematicskill.com/gallery/purser/">treatment</a></td>
</tr>
<tr>
<td><a href="https://cinematicskill.com/demos/lull/"><img src="docs/demos/lull.jpg" alt="Lull"></a><br><b>Lull</b>, incident response<br>Edgar Wright, <i>Baby Driver</i><br>The product UI as the world · <a href="https://cinematicskill.com/gallery/lull/">treatment</a></td>
<td><a href="https://cinematicskill.com/demos/odd-lot/"><img src="docs/demos/odd-lot.jpg" alt="Odd Lot"></a><br><b>Odd Lot</b>, design studio portfolio<br>Jean-Luc Godard, <i>Pierrot le Fou</i><br>Flat primaries and set type · <a href="https://cinematicskill.com/gallery/odd-lot/">treatment</a></td>
</tr>
<tr>
<td><a href="https://cinematicskill.com/demos/lattice-matrix/"><img src="docs/demos/lattice-matrix.jpg" alt="Lattice, Matrix cut"></a><br><b>Lattice (Matrix cut)</b>, LLM gateway<br>The Wachowskis, <i>The Matrix</i><br>Glyph streams of its own traffic · <a href="https://cinematicskill.com/gallery/lattice-matrix/">treatment</a></td>
<td><a href="https://cinematicskill.com/demos/lattice-kiki/"><img src="docs/demos/lattice-kiki.jpg" alt="Lattice, Miyazaki cut"></a><br><b>Lattice (Miyazaki cut)</b>, the same product<br>Hayao Miyazaki, <i>Kiki's Delivery Service</i><br>Gouache-style painted plates · <a href="https://cinematicskill.com/gallery/lattice-kiki/">treatment</a></td>
</tr>
<tr>
<td><a href="https://cinematicskill.com/demos/latent-film-lab/"><img src="docs/demos/latent-film-lab.jpg" alt="Latent Film Lab"></a><br><b>Latent Film Lab</b>, film lab (zh-TW)<br>Michelangelo Antonioni, <i>Blow-Up</i><br>Archival photographs in a darkroom · <a href="https://cinematicskill.com/zh-tw/gallery/latent-film-lab/">treatment</a></td>
<td><a href="https://cinematicskill.com/demos/beichen-er/"><img src="docs/demos/beichen-er.jpg" alt="Beichen Animal ER"></a><br><b>Beichen Animal ER</b>, 24-hour animal hospital (zh-TW)<br>David Fincher, <i>Zodiac</i><br>One continuous drawn line · <a href="https://cinematicskill.com/zh-tw/gallery/beichen-er/">treatment</a></td>
</tr>
<tr>
<td><a href="https://cinematicskill.com/demos/tieout/"><img src="docs/demos/tieout.jpg" alt="Tieout"></a><br><b>Tieout</b>, accounting SaaS (zh-TW)<br>Hideaki Anno, <i>Shin Godzilla</i><br>Typeset accounting documents · <a href="https://cinematicskill.com/zh-tw/gallery/tieout/">treatment</a></td>
<td><a href="https://cinematicskill.com/demos/retour/"><img src="docs/demos/retour.jpg" alt="Retour"></a><br><b>Retour</b>, fragrance launch (zh-TW)<br>Céline Sciamma, <i>Portrait of a Lady on Fire</i><br>Real-time 3D glass by one candle · <a href="https://cinematicskill.com/zh-tw/gallery/retour/">treatment</a></td>
</tr>
</table>

## The idea

A site is a film whose playhead is the scrollbar. A section is a scene, the viewport is the frame, a scroll is a
cut or a camera move, and the visitor is the audience, the editor and, once, a participant.

One rule carries the whole skill: **borrow the film's mechanics, never its costume.** A director's style is a set
of decisions: where the camera stands, how long a shot holds, what the light hides, how a cut lands, what the
picture is made of. Those become structure, motion, medium and material. Film titles, characters and props stay
out of the product's UI.

## What it does differently

| Most "make it premium" prompts | Cinematic UI |
|---|---|
| Pick a style, apply it to a layout | Pick a director by the product's *dramatic problem*, extract 5–7 observable mechanisms |
| Default to one look (usually glossy 3D or glass) | Cast the **medium** from the film: ink, pencil, cel, pixel, print, neon, type, photography, or 3D |
| Design a hero, then fill sections | A **shot list** for every scene: beat, shot size, lens, move, blocking, light, cut, length |
| Invent placeholder imagery | **The asset call**: ask once. You supply it, a free licensed library, it generates, or the shot changes |
| Animate things as they enter the viewport | One scrubbed timeline; every cut between scenes is a decision |
| "Looks good" | **Screening**: contact sheets on three viewports, five frames judged at full size, named corrections |
| Every site ends up related | A filmography and a skeleton check, so the next production differs from the last three |

## The production

| # | Stage | What comes out |
|---|---|---|
| 1 | Development | Logline and audience arc |
| 2 | Cast the director | Three candidates, one kept, mechanisms extracted |
| 3 | Choose the medium | What the picture is made of, and why |
| 4 | Casting and the asset call | The lead and its arc; one message asking for what the film needs |
| 5 | Screenplay | Every visible word |
| 6 | Storyboard | Form, skeleton, a shot list for every scene, the audience's part |
| 7 | Animatic | The whole page, rough, in the chosen medium |
| 8 | Principal photography | Cast, set, light, frame, cuts |
| 9 | Screening | Contact sheets, the projection room, notes, reshoots |
| 10 | Delivery | An honest report: what was screened, what is a stand-in, what is still needed |

## What's in 2.0

**App mode.** Dashboards, back offices, admin panels and consoles get their own rules. The playhead is the task,
and cinema gets about a tenth of the frame: a signature view only this product could have, in place of the usual
KPI row. Every route is screened in eight states with `app-screening.mjs`, across viewports and themes.

**Any film, researched live.** There is no fixed film list. Name a film, or describe a look ("90s Hong Kong late
night, lonely, humid"), and `references/film-research.md` works from sourced interviews and reference frames, with
every claim tagged by source quality.

**The grade.** A film's colour reaches the page. `references/grades.md` has fourteen sourced looks,
`grade-from-stills.mjs` measures reference stills into a grade, `kit/grade.js` applies it to DOM sites, and
`screening.mjs --grade` flags frames that drift off it.

**The film's world.** `references/art-direction.md` turns production design into cards, buttons, dividers, forms
and footer. The poster's composition grammar shapes the first frame, the OG image and the title cards.

**The media.** Photoreal 3D is one option, not the default. Each of these ships as tested code in `kit/looks.js`:

![The same scene in different media](docs/looks.jpg)

Ink wash · pencil and watercolour · pixel · halftone and CMY print · CRT and neon · cel shading with outlines ·
liquid · gradient light · illustrations and photographs as layered 2.5D planes · hand-drawn line boil for DOM and
SVG, plus a studio-lit HDR 3D stage for films that really are solid and glossy, and a no-canvas path for films
made of type.

**Type performances.** `kit/type-fx.js` holds forty-four text performances. Scroll can scrub them, a clock can
render them frame-exact, and the real text stays in the DOM.

**Real footage, legally.** `find-footage.mjs` searches open libraries (Openverse, Wikimedia Commons, Internet
Archive, NASA, and Pixabay or Unsplash with a free key) with the shot as the query, and returns trimmed clips with
poster frames and a `CREDITS.md`.

## Install

**Claude Code**

```bash
git clone https://github.com/akseolabs-seo/cinematic-ui ~/.claude/skills/cinematic-ui
```

**Codex CLI**

```bash
git clone https://github.com/akseolabs-seo/cinematic-ui ~/.codex/skills/cinematic-ui
```

**Any other agent:** point it at `SKILL.md`. Everything is plain Markdown, plain JavaScript and Node scripts, so
there is nothing to build.

The screening and render scripts need this in the project you are building:

```bash
npm i -D playwright-core     # uses your installed Chrome or Edge
```

ffmpeg is needed only to render video.

## Use

```
/cinematic-ui a homepage for a pour-over coffee subscription, Awwwards level
/cinematic-ui shoot this SaaS landing page the way Ozu would
/cinematic-ui pitch me three directions for this brand
/cinematic-ui direct an order back office for a logistics team
```

It directs by default: it makes the decisions, builds, screens, and shows you the result with its treatment. It
stops to ask in three cases only: it cannot tell what the product is, it needs assets (yours, or your permission
to generate them), or something would be published.

To record a finished site as a video:

```bash
node scripts/render-film.mjs ./site --tour 30 --out tour.mp4
```

## What's in the box

```
SKILL.md                     the director's method
references/
  directors.md               casting: ~40 directors as mechanisms, and the obvious pick to avoid
  film-grammar.md            shot, lens, move, light, cut, colour, time → web mechanics
  film-research.md           any film, researched live; from a description to candidate films
  looks.md                   choosing the medium; the asset call; how each medium is built
  grades.md                  casting the grade; 14 worked retro and neon looks
  art-direction.md           the film's world (UI map) and its poster grammar
  storyboard.md              logline, form, skeleton, the shot list, a worked example
  production-design.md       composition, type (Latin + CJK), colour, material
  award-reel.md              what Awwwards and CSS Design Awards winners share; the award pass
  type-motion.md             casting a type performance
  vfx-threejs.md             photoreal 3D: light, materials, modelling, shaders, performance
  editing-and-motion.md      scroll as a timeline, the cut catalogue, the audience's part
  screening.md               dailies, the projection room, accessibility / SEO / performance checks
  app-mode.md                dashboards, back offices and consoles
kit/                         infrastructure with no look of its own; every effect starts at zero
  reel.js  reel.css          the playhead: scenes, pinned frames, clips, designed cuts
  looks.js                   the non-photoreal media
  grade.js  grade.html       the colour grade for DOM sites, and its gallery
  type-fx.js  type-fx.html   forty-four type performances, and their gallery
  plane.js                   a camera that shoots a live interface like a set
  stage.js  props.js         the 3D sound stage and prop shop
  app.js  fixtures.js        app mode: router, states, shortcuts, seeded data
  site-dom.html  site.html  app-shell.html   grey animatics to start from
scripts/
  screening.mjs              contact sheets + mechanical flags, on any URL (--grade: colour drift)
  app-screening.mjs          routes × states × viewports × themes, with flags
  grade-from-stills.mjs      reference stills → palette, black / white points, warmth, a suggested look
  find-footage.mjs           photographs, footage and sound from open libraries
  copy-check.mjs             is every line of supplied copy on the page, with and without JS?
  render-film.mjs            site tour → MP4
  generate-image.mjs         optional image generation (Runware), used only with your say-so
```

## How it was tested

Fresh agents with no other context were given this skill and a client brief. Their friction logs, an independent
review by a second model and a survey of other skills were folded back into the text and the kit. App mode went
through three rounds of blind tests on the same three briefs. The kit and scripts are verified in headless Chrome
with three 0.186, GSAP 3.15 and Lenis 1.3: scene and cut logic, frame-exact seeking in any order, reduced motion,
keyboard order, every look, frame-by-frame video rendering.

## Honest limits

- Not verified on Safari, Firefox, real phones or screen readers. Smoothness cannot be judged headlessly.
- Procedural 3D struggles in close-up on familiar real objects. The skill asks for assets and keeps weak ones in
  wide shot; it cannot conjure a product photograph.
- Gaussian splats are described, not built.
- It raises the floor and widens the range. It does not guarantee an award.

## Credits

Built on [GSAP](https://gsap.com), [Three.js](https://threejs.org) and [Lenis](https://lenis.darkroom.engineering).

## License

MIT
