# Grades — committing to a film's colour

A cast film has a look: what the light is made of, how deep the blacks go, what the highlights do, how many
hues are allowed, what grain there is. Audiences recognise these at a glance. A site that names Wong Kar-wai and
then ships tidy CSS hex values on clean white has cast the director and kept none of the picture.

This file is how a grade is chosen, measured, built and checked. **Commit to it.** "Borrow the mechanism, not
the costume" does *not* mean "keep the colour polite". The grade *is* a mechanism: the light logic, the black level,
the halation, the banned hue. Commit to it fully. Costume is the iconography: the neon-sign clip-art, the VHS
timestamp, the pastel-umbrella illustration, the brush-script title. A Wong Kar-wai site may be soaked in green
fluorescent and red spill. It may not have a neon sign that says "Chungking".

## The chain

```
cast film → research it (film-research.md) → reference stills → measure → GRADE block → build (grade.js / stage.look + tokens) → screen against it
```

1. **Reference stills.** Six to twelve frames from the *specific sequence* you cast (`directors.md`), covering the
   darkest, the brightest and the most colourful moments. They can be stills the user supplies, frames from footage they
   own, or frames you looked at with their permission. They are reference for analysis only and never appear on the site.
   If you have no stills, use the starting values below, mark the grade **unmeasured** in the treatment, and ask for
   stills in the asset call.
2. **Measure.** `node scripts/grade-from-stills.mjs refs/ --out grade.json` writes the palette (k-means, with shares),
   the black and white points, the chroma range, the warmth of shadows vs highlights, the contrast, a suggested
   `look`, and a contact sheet `grade.jpg` with the swatches. Look at the sheet. Correct anything the numbers got
   wrong, because a still with one red dress is not a red film.
3. **Write the GRADE block** in the treatment (below).
4. **Build it.** Use `kit/grade.js` for DOM sites and `stage.look` for the 3D stage. Both take the same parameter
   names, so one `look` object drives either. The page's CSS tokens (ground, ink, accent, rules, selection, focus) come
   from the same measurement. The grade grades the *pictures*. The tokens make the *page* belong to the same film.
5. **Screen against it.** `node scripts/screening.mjs <site> --grade grade.json` (or the spec that `createGrade`
   publishes) flags frames whose palette, black level, white level or saturation drift from the grade:
   `grade-drift`, `grade-black`, `grade-white`, `grade-saturation`. A flag means the film slipped. Either re-grade the
   scene or note in the treatment why that scene departs.

## The GRADE block

```
GRADE        film · sequence · measured from <n stills> | unmeasured (starting values from grades.md R3)
SOURCE       where the colour comes from in the film: set paint · one lamp vs one window · street light · costume emitters · lab process
BLACKS       crushed clean · lifted haze · noisy · emissive on black — value: #hex
HIGHLIGHTS   held · blown, no blue sky · halation colour #hex · bloom only behind the source
HUES         ground #hex · ink #hex · accent #hex (share %) · allowed others · BANNED hues
GRAIN        none · fine print · pushed stock · video noise — amount
TIME/FORMAT  step-printed lead · 4:3 · per-chapter aspect ratio · none
LOOK         { contrast, saturation, temperature, tint, lift, split, shadows, highlights, grain, vignette, halation, halationColor, bloom, fade }
ARC          how the grade moves across acts, or "holds" and why
COSTUME      what this look's imitation would add, refused
```

## What a grade is made of — the dials

- **Where the colour comes from.** Each answer is a different film. Painted sets (Demy). Colour withheld so
  brown and black carry the frame (Willis). One lamp colour against one cool window (Hou / Lee Ping-bin). Colour
  subtracted, such as the blue sky removed (Almendros). The city's mixed street light (Mann, Refn / Sigel). Light
  worn by the actors (Tron: Legacy). Decide this first; the numbers follow.
- **Blacks.** Crushed and clean (Drive's underexposed digital). Lifted into haze (The Godfather's pushed stock,
  Blade Runner's smoke). Noisy (Collateral's video gain). Emissive light on black (Tron). Never `#000` unless the
  film is digitally clean *and* you measured it.
- **Highlights.** Held, blown white with no blue (Days of Heaven), haloed with red-orange halation (film stock), or
  bloomed only around the source (Blade Runner's shafts). A global glow on everything is the cheap version.
- **Hue count and banned hues.** One hue floods a location (2049's Las Vegas). Two (Drive, Tron). A closed four
  (Neon Demon: red, turquoise, magenta and violet, "no yellow and no orange"). A slow wash (Enter the Void, which
  avoids blue). A banned hue is as much a decision as an allowed one. List it, and let the screening hold it.
- **Grain.** None (Demy, Anderson), pushed-stock grain (Godfather, Mid90s), video noise heavier in the dark
  (Collateral). Grain separates 1972 from a 2014 pastel more than any hue does.
- **Time and format.** Some looks live in motion and frame shape, not hue. Wong Kar-wai's step-printing (the lead
  at 8–12 fps against a smooth world), Mid90s' 4:3, and Grand Budapest's aspect ratio per era cannot be carried by a
  grade alone.

## The grade reaches the whole page

- **Pictures** (photographs, video, canvas, the 3D stage) carry the grade through `grade.js` / `stage.look`.
- **The page** carries it through tokens taken from the measurement: the ground is the film's black or paper, the
  ink is its highlight colour, never `#fff`, and the accent is its measured accent at its measured share. Rules,
  selection colour, focus ring, caret and scrollbar all come from the same palette (`production-design.md`).
- **Type and material** follow the film's era of *making*, not its setting. Use a photo-set grotesk or a
  typewriter-era serif for a 70s look, and a crisp sensor-era sans for 2049. Never use the film's poster lettering.
- **Light events** replace decoration. In a neon film the button can be the lit source in a dark frame, and hover
  can raise its halation, not its scale.
- **Text stays text and stays readable.** Text is not colour-filtered by default. Copy over graded pictures keeps
  4.5:1 against the brightest thing that can pass behind it.
- **The accessible cut keeps the grade.** Reduced motion freezes the grain and drops step-printing and drift,
  but the colours stay. A reduced cut that falls back to plain white is a different film.

## Refused defaults

These are what an uncast "cinematic" page reaches for. Each is refused unless the measured stills of the cast
film literally say so and the filmography shows no recent production with it:

- **Warm paper ground + vermilion or red accent + dark ink.** This is the default "editorial / nostalgic" look.
- **Cool grey + one blue or green accent.** This is the default "calm / premium" look. Restraint is not a grade.
- **Retro, cheap:** one sepia or orange overlay; lifted blacks plus a vignette called "vintage"; the pink–teal
  photo-app crossover on a sharp modern image; VHS tracking noise and a timestamp; a grain PNG over crisp CSS.
- **Neon, cheap:** a pink–cyan gradient behind white type; glowing outline text at full strength; the synthwave
  sun and grid; purple blob plus glassmorphism; bloom on everything, so nothing is brighter than anything else; a
  black ground with no lit region, so the light has nothing to fall on.

## Worked examples: two families

These are fourteen films researched the way `film-research.md` describes, kept as examples of the result. They
are not a menu. Whatever film the user names or the description leads to is researched live, the same way.
What separates looks *inside* a family matters more than the family. "Retro" is not "warm and faded", and
"neon" is not "pink and cyan". Pick a film, not a family.

Every look below lists what the sources state, what to borrow, what is costume, and a **starting `look`**. The
starting look is a translation, not a measurement: replace it with the numbers from your stills. Facts are
sourced (see *Sources*); where a source is thin, the entry says so.

### Retro / nostalgic (復古懷舊)

Where the colour comes from in each film:

| Look | Colour is… |
|---|---|
| R1 Wong / Doyle | accident: motion and mixed street light |
| R2 Demy | design: the paint on the set |
| R3 Willis | restraint: brown and black |
| R4 Hou / Lee | a light source: one lamp against one window |
| R5 Malick / Almendros | subtraction: the blue sky removed |
| R6 Anderson / Yeoman | a chapter system: frame shape and palette per era |
| R7 Mid90s | degradation: pull-processed 16 mm |

**R1 · Wong Kar-wai / Christopher Doyle — Chungking Express (1994), Fallen Angels (1995).** Handheld,
available and mixed street light, step printing (the method is described inconsistently; stuttered, smeared
motion against a still subject), very wide lenses pushed close in Fallen Angels. Stock and grade are not sourced.
*Borrow:* time as part of the grade (the lead stepped at 8–12 fps against a smooth world), spill from mixed
sources, the subject too close to the lens. *Costume:* neon-sign graphics, HK-poster lettering, rain-on-glass
clips.
`{ contrast: 1.15, saturation: 1.25, temperature: 0.05, tint: -0.25, lift: 0.02, split: 0.6, shadows: '#1f5a44', highlights: '#ffb48a', grain: 0.07, vignette: 0.2, halation: 0.35, halationColor: '#ff4a2a', bloom: 0.3 }`
Ground `#0c0a0e` · ink `#f1e7d3` · accent `#d8352a`, second `#2f9e6a`. Most numbers are inference: measure.

**R2 · Jacques Demy / Jean Rabier / Bernard Evein — The Umbrellas of Cherbourg (1964).** Eastmancolor.
Deliberately unnatural saturated pastels painted into the sets; costume matched to wall; green and purple
backgrounds with solid red as relief; the palette matures across the film toward wintry whites and blues. The pink
haze in circulation is print fading, not intent. Demy made separation masters against it. *Borrow:* colour
designed into the set, figure matched to ground, a palette arc by act. *Costume:* umbrella iconography, sixties
French lettering, a faded-pink filter.
`{ contrast: 1.0, saturation: 1.35, temperature: 0.05, lift: 0.03, split: 0.2, shadows: '#4a3a6a', highlights: '#fff1dc', grain: 0.02, halation: 0.15, halationColor: '#ff8aa0', bloom: 0.1, fade: 0 }`
Ground `#f4e9d8` · ink `#2a2433` · accent `#d8344f` with the pair `#3f9e6a` / `#7a4fa8`.

**R3 · Gordon Willis — The Godfather (1972).** Rated ASA 250 and pushed one stop, so the negative is about half
a stop under. New York "brown-and-black", like "a newspaper photograph in bad color". Hollywood "bright, hard".
Sicily through heavy chocolate-brown filters. Printed in one range only. Grain "more prominent" than usual. The
"amber top light" reputation comes from secondary writing, not this interview. *Borrow:* underexposure with a
hazy lifted black, desaturation by a brown filter, one grade per location, the face on top of the dark. *Costume:*
orange–teal "nostalgia", a sepia overlay, Italian iconography.
`{ contrast: 1.2, saturation: 0.7, temperature: 0.3, tint: 0.02, lift: 0.025, split: 0.3, shadows: '#1a1410', highlights: '#d9b277', grain: 0.055, vignette: 0.4, halation: 0.1, halationColor: '#c98a3e', bloom: 0.05, fade: 0.08 }`
Ground `#120d09` · ink `#d9c9ad` · accent `#a8742c`.

**R4 · Hou Hsiao-hsien / Mark Lee Ping-bin — Flowers of Shanghai (1998).** Images "like oil paintings". Light
imitating oil lamps from a few small units, colour filters on white set walls, golden lamplight against blue
moonlight in windows, long takes. Stock is not sourced. *Borrow:* one lamp colour against one cool window, small
sources in a dark room, a long unbroken take. *Costume:* lanterns, calligraphy, chinoiserie.
`{ contrast: 1.2, saturation: 0.9, temperature: 0.45, lift: 0.015, split: 0.45, shadows: '#10203a', highlights: '#e0a24a', grain: 0.03, vignette: 0.4, halation: 0.25, halationColor: '#e08a2a', bloom: 0.15 }`
Ground `#0d0b0a` · ink `#e6cfa0` · accent `#d99a3a` · cool counter `#25406a`. The cool shadow is what keeps it from sepia.

**R5 · Terrence Malick / Nestor Almendros — Days of Heaven (1978).** Much of it shot in the minutes after
sunset, wide open, with the 85 filter pulled. Day exteriors exposed for the shadows, so skies blow out and lose their
blue. Interiors lit by window light only, no fill. Muted period colour. *Borrow:* the short window of light, a
white sky instead of a blue one, window-only interiors. *Costume:* wheat-field stock photos, sepia, old-photo
borders.
`{ contrast: 1.05, saturation: 0.7, temperature: 0.2, lift: 0.03, split: 0.25, shadows: '#26201b', highlights: '#f6e6c4', grain: 0.025, vignette: 0.3, halation: 0.2, halationColor: '#f0b060', bloom: 0.2, fade: 0.04 }`
Ground `#1a1511` · ink `#ede1c6` · accent `#c47a2c` · sky `#f2e9d6`.

**R6 · Wes Anderson / Robert Yeoman — The Grand Budapest Hotel (2014).** 35 mm. Three timelines in three
aspect ratios (1.37, 1.85 and a widescreen ratio; the sources disagree on the widescreen figure). Soft top light
through a diffused skylight, warm practicals. The per-era palette is critics' description, not a grading
statement. *Borrow:* frame shape and palette assigned per chapter, flat soft light, symmetry. *Costume:* pink
facade clip-art, the Futura-style card, decorative miniatures.
`{ contrast: 0.95, saturation: 1.05, temperature: 0.1, tint: 0.05, lift: 0.04, split: 0.1, shadows: '#6a3a5a', highlights: '#fff4e8', grain: 0.02, bloom: 0.05, fade: 0.04 }`
Ground `#f3d9dc` · ink `#3b1f2b` · accent `#a3203f`. Change the container ratio per chapter: the palette alone does not carry it.

**R7 · Jonah Hill / Christopher Blauvelt — Mid90s (2018).** Super 16, 4:3, Vision3 50D / 250D / 500T.
Underexposed on set and pulled one stop at the lab, which flattens contrast and mutes colour; 500T pushed for
grain at night. *Borrow:* pull-processed flatness, 4:3 as the format, an observational camera. *Costume:* VHS
logo, scan lines, timestamp, "REC". None of these is in the film.
`{ contrast: 0.9, saturation: 0.85, temperature: 0.05, lift: 0.05, split: 0.1, shadows: '#2a2a28', highlights: '#f1e6d2', grain: 0.06, vignette: 0.12, halation: 0.1, halationColor: '#ff9a5a', bloom: 0.05, fade: 0.1 }`
Ground `#201d1a` · ink `#e8dfd0` · accent `#c9683a`.

### Modern-future / neon (現代未來霓虹)

Neon is a light source, not a colour. Each look differs in what the source is and what it does to the space
around it:

| Look | Source | Blacks | Hues |
|---|---|---|---|
| N1 Blade Runner (1982) | hard backlight through smoke | smoky, lifted at the edge of light | two |
| N2 Blade Runner 2049 | one hue floods a location; another withheld grey | clean | one per location |
| N3 Drive | real sodium and mercury plus traffic signals | clean digital | two |
| N4 Neon Demon | an imposed closed set | clean | four, two banned |
| N5 Collateral | the ordinary city mix, pulled back | noisy | mixed |
| N6 Enter the Void | programmed shifting wash | clean | a wash, no blue |
| N7 Tron: Legacy | worn by the actors | emissive on dark | two worlds |

**N1 · Ridley Scott / Jordan Cronenweth — Blade Runner (1982).** Soft front light, hard backlight, smoke at a
constant density to make shafts visible, low-contrast filters weakened as backlight rose. Neon as the main source on
the street, dimmed just above flicker. Streets, people and the Tyrell office largely colourless: colour arrives only
from lit sources. *Borrow:* low-key space made visible by haze and one hard back source; colour withheld until a
source gives it. *Costume:* Japanese-signage clip-art, rain overlays, a cyan grid.
`{ contrast: 1.35, saturation: 0.5, temperature: -0.1, lift: 0, split: 0.5, shadows: '#05101a', highlights: '#ffd9a8', grain: 0.04, vignette: 0.3, halation: 0.4, halationColor: '#ffb070', bloom: 0.45 }`
Ground `#07090d` · ink `#e8e2d4` · accent `#ff5a2a`, rare `#27d1d8`. Bloom is a shaft behind the subject, not a global glow.

**N2 · Denis Villeneuve / Roger Deakins — Blade Runner 2049 (2017).** Alexa. Las Vegas red-orange through a
custom amber and pink front-filter pack and heavy smoke. Los Angeles cold, grey, rain and snow. Effects in camera
rather than in post. *Borrow:* one location, one hue, made at the source; cold grey as the control. Two states,
switched by section, are this look's arc. *Costume:* an orange–teal LUT over everything, holograms, a giant eye.
Vegas `{ contrast: 1.1, saturation: 1.2, temperature: 0.7, tint: 0.1, lift: 0.03, split: 0.7, shadows: '#4a1208', highlights: '#ffb26a', grain: 0.02, vignette: 0.25, halation: 0.5, halationColor: '#ff7a2a', bloom: 0.5 }` ground `#2a0f08` · ink `#ffd7b0` · accent `#ff6a1f`.
LA `{ contrast: 1.0, saturation: 0.25, temperature: -0.4, lift: 0.03, split: 0.1, grain: 0.02, vignette: 0.2, halation: 0.05, bloom: 0.1 }` ground `#0c1012` · ink `#c9d0d4` · accent `#7fa0b0`.

**N3 · Nicolas Winding Refn / Newton Thomas Sigel — Drive (2011).** Alexa at 800, minimal filtration. Existing
downtown night light: sodium and mercury practicals, red and green signals in the car scenes, sets and costume on a
vibrant palette. Refn asked for contrasting colours and plenty of red. The "80s" reading is critics', not Sigel's.
*Borrow:* real street-lamp colours, signals as accents, clean dark ground, wide lenses. *Costume:* the scorpion
jacket, pink cursive titles, the synthwave grid.
`{ contrast: 1.15, saturation: 1.15, temperature: -0.05, tint: 0.05, lift: 0, split: 0.55, shadows: '#0a0f2a', highlights: '#ff7a5a', grain: 0.015, vignette: 0.2, halation: 0.2, halationColor: '#ff6a40', bloom: 0.25 }`
Ground `#06070f` · ink `#f2e8e4` · accent `#ff3d6e`, second `#f2a33a`.

**N4 · Nicolas Winding Refn / Natasha Braier — The Neon Demon (2016).** "Mostly reds, turquoise blues,
magentas and violets", a little cyan-green, "no yellow and no orange". All of it was captured in camera with
minimal correction. Strobes and flares were caught in camera; anamorphic Xtal Express lenses. *Borrow:* a small
closed hue list with banned hues, made at the light; strobe as rhythm (never on text). *Costume:* triangle and
mirror iconography, glitter.
`{ contrast: 1.25, saturation: 1.3, temperature: -0.1, tint: 0.15, lift: 0, split: 0.7, shadows: '#12061c', highlights: '#ff4a7a', grain: 0.02, vignette: 0.25, halation: 0.15, halationColor: '#ff2a5a', bloom: 0.35 }`
Ground `#0a0509` · ink `#f4e6ee` · accent `#e0204a`, others `#18c6c0` `#c02a8a` `#6a3ac8`. Banned: yellow, orange.

**N5 · Michael Mann / Dion Beebe (and Paul Cameron) — Collateral (2004).** Night exteriors on HD video with gain
pushed. The city's mixed sodium, mercury, tungsten, neon and fluorescent, selectively desaturated because the
full mix looked "fruity". Faces overlit to stay above the noise; background noise tolerated; cool-green panels in
the cab. *Borrow:* the ordinary city's mixed light pulled back until believable; a clean lead on a noisy world.
*Costume:* tail-light clip-art, lens-flare overlays.
`{ contrast: 1.1, saturation: 0.85, tint: -0.1, lift: 0.02, split: 0.4, shadows: '#0d1c1e', highlights: '#e8b070', grain: 0.07, vignette: 0.2, halation: 0.15, halationColor: '#e0832a', bloom: 0.2 }`
Ground `#0b0f12` · ink `#d6dad8` · accent `#e0832a` (sodium), sparing `#3aa89a`. Grain here is noise: more in the dark, less on the lead.

**N6 · Gaspar Noé / Benoît Debie — Enter the Void (2009).** Tokyo streets with no added light, underexposed to
protect the highlights. Hidden programmable lights shifted moods from orange to purple, and blue was avoided
throughout. Post added emphasis to neon and reflections, flicker and aberration. The format is reported two ways.
*Borrow:* a slow, programmed hue wash, a banned hue, underexposure that keeps the highlight. *Costume:* a
first-person POV gimmick as hero video, signage clip-art, strobing text (an accessibility failure).
`{ contrast: 1.15, saturation: 1.4, temperature: 0.1, tint: 0.2, lift: 0.01, split: 0.6, shadows: '#1a0a2a', highlights: '#ff7a3a', grain: 0.05, vignette: 0.3, halation: 0.45, halationColor: '#ff6a2a', bloom: 0.5 }`
Ground `#080507` · ink `#f2e4e8` · accent drifting `#ff6a1a` ↔ `#9a3ae0` over seconds. Banned: blue.

**N7 · Joseph Kosinski / Claudio Miranda — Tron: Legacy (2010).** Sony F35, wide open. Battery-powered light
panels in the costumes lit the Grid; sets kept dim so the suits are the brightest thing in frame; the real world
warmer, the digital world cooler. The exact glow hues are not sourced. *Borrow:* the brightest thing is what a
character wears or holds; one or two emitters per view; a warm world against a cool world. *Costume:* the disc
logo, circuit wallpaper, a glowing outline on every card.
`{ contrast: 1.3, saturation: 1.0, temperature: -0.4, tint: -0.05, lift: 0, split: 0.5, shadows: '#02060e', highlights: '#9be4ff', grain: 0.015, vignette: 0.3, halation: 0.35, halationColor: '#37d0ff', bloom: 0.55 }`
Ground `#04060a` · ink `#e8f4fa` · accent `#37d0ff`, warm world `#ff8a2a`.

## Any other film

Research it (`film-research.md`) and write the same five things: what the sources state (stock, process, light,
lab), what to borrow, what is costume, the measured `look`, and the banned hues. Measure from stills before you
trust memory. A remembered palette is usually the poster's or another film's. Where no source is found, say so
in the treatment rather than inventing one. The film's world is the other half (`art-direction.md`).

## Sources

- R1: bfi.org.uk/interviews/christopher-doyle-shooting-chungking-express; en.wikipedia.org/wiki/Chungking_Express; en.wikipedia.org/wiki/Fallen_Angels_(1995_film)
- R2: austinchronicle.com/screens/1996-07-19/532176; criterion.com/films/27933
- R3: theasc.com/articles/the-godfather-on-location-gordon-willis-cinematography
- R4: filmcomment.com/interview-mark-lee-ping-bing; criterion.com/films/30521-flowers-of-shanghai
- R5: theasc.com/articles/photographing-days-of-heaven
- R6: theasc.com/?p=4422; kodak.com/en/motion/blog-post/the-french-dispatch
- R7: kodak.com/en/motion/blog-post/mid90s
- N1: theasc.com/articles/blade-runner-cronenweths-photography
- N2: theasc.com/articles/uncanny-valley-blade-runner-2049
- N3: theasc.com/articles/drive-road-warriors
- N4: pushing-pixels.org/?p=13122; filmcomment.com/interview-natasha-braier-honey-boy-neon-demon
- N5: theasc.com/articles/hell-on-wheels-collateral
- N6: en.wikipedia.org/wiki/Enter_the_Void (citing American Cinematographer, Oct 2010); miaminewtimes.com/?p=40440553
- N7: britishcinematographer.co.uk/claudio-miranda-asc-tron-legacy (summary only)

Research notes with the full statements, the gaps and the dropped candidates (Ghost in the Shell, Akira,
In the Mood for Love as its own look, a Kodachrome film, a VHS film: no adequate sources) are kept with the
skill's lab material.
