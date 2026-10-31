# Screening — dailies, notes, reshoots

A film is finished in the screening room. So is a site. This stage is not a checklist to tick after
the work; it is where the second half of the quality comes from. Nothing is described to the user as
done, beautiful or working that was not seen in a rendered frame.

## Shooting dailies

Run from the project folder (Playwright is resolved from where you run; the target and `--out` are relative to it).

```bash
npm i -D playwright-core                      # once per project; uses the installed Chrome or Edge
node <skill>/scripts/screening.mjs ./site     # desktop + short laptop + mobile, 3 frames per scene with scroll length (pinned, or a tall flow scene)
node <skill>/scripts/screening.mjs ./site --cuts            # also the midpoint of every cut
node <skill>/scripts/screening.mjs ./site --reduced         # the accessible cut (frames are named …-reduced-…)
node <skill>/scripts/screening.mjs ./site --act shots.mjs   # your own shots: control states, the audience's part
node <skill>/scripts/copy-check.mjs copy.md ./site          # is every line of the supplied copy on the page? (also with JS off)
node <skill>/scripts/screening.mjs ./site --frames 2 --viewports ultrawide,wide,tablet     # the rest of the range, before delivery
node <skill>/scripts/screening.mjs ./site --tabs 120          # tab further than the first 60 stops (--tabs 0 skips the walk)
```

It writes `screening/contact-<viewport>.jpg`, the individual frames, and `report.json` (runs into the same
`--out` are merged). On the phone viewport it simulates a 90 px browser bar — the tinted strip at the
bottom is what a real phone would cover; nothing important belongs under it (`--bar 0` turns it off).
`--act` runs a small script of your own after the scenes (give act runs their own `--out`: runs that share a folder and a viewport replace each other's frames; and call `await page.evaluate(() => window.__reel?.release())` before testing anything time-driven, because `seek()` freezes the clock; `page.reload()` restores the scroll position, so for shots timed from load use `page.goto(url + '?act')`; and reset state between act steps, because a seek can leave a layer `inert`), so the primary control's states and the
audience's part can be shot too: `export default async ({ page, seek, shoot }) => { await seek('order', 0.5); await page.hover('.cta'); await shoot('cta-hover'); }`. Sites on the
kit are shot scene by scene at exact playhead positions, plus one frame of the opening titles mid-flight;
any other page at even scroll positions, and `--act` runs on any page, so a click-driven film is screened by clicking through it. Three frames per scene can step over a short performance: raise
`--frames`, or seek it yourself with `window.__reel.seekScene(name, u)`. Film mode uses
`render-film.mjs --stills …`, which also writes a contact sheet.

**Open the contact sheet as an image and look at it.** Then open single frames at full size for
anything that needs a closer look: type, edges, the lead's materials.

The script's flags are mechanical, and each means something:

| Flag | Usually means |
|---|---|
| `pageerror`, `console.error` | A script failure. Fix before judging anything visual |
| `[reel] … second from()/fromTo()` | A determinism bug: an element's start state leaks backwards. Add `immediateRender: false` |
| `flat-frame` | Blank canvas, content not yet revealed at that position, or a genuinely empty shot. A canvas that goes blank in some scenes only is usually a NaN in a shader (see `vfx-threejs.md`) |
| `dead-hold` | A pinned stretch where nothing changes: shorten the scene or give it a development. Mark a deliberate still scene `data-hold`. The measure is coarse brightness, so a hold whose development is small type can be flagged wrongly: look. In a film made of type and paper, expect these flags and low "measured change" figures, and judge by eye |
| `layout: horizontal overflow` | Something wider than the viewport; almost always a mobile bug |
| `cut-text` | Small text sliced by the top or bottom of a pinned frame at this viewport: the composition does not fit the short frame. Scale it, drop something, or unpin the scene |
| `webgl` | The stage did not start; frames show the fallback |
| `chrome-over-text` | In a frame, fixed or sticky chrome (header, slate, rail, status slip, chip, pill — not a scene frame, not decorative, under 40 % of the viewport) is on top of page text. *No ground*: the chrome's own text or controls sit on page text. *Pinned frame*: a grounded bar covers text that cannot scroll out from under it. *Never scrolls clear*: a top bar at scroll 0 or a bottom bar at the end of the page covers text. Give the chrome a ground, pad the frame by the chrome's height (`production-design.md`, the interface). Text scrolling under a grounded header in a flow document is not flagged. Mid-cut and mid-title frames are skipped |
| `focus-hidden` | Tabbing the first `--tabs` stops (60), a focused element is invisible, off screen, has its ring clipped by an ancestor's `overflow` or `inset()` clip-path (edges at the viewport edge do not count), is ≥ 25 % under fixed chrome, or is covered at its centre. Each stop is looked at again after 0.9 s, so a fade still settling is not flagged. Fix with `scroll-padding` / `scroll-margin`, room for the ring inside clipped boxes, chrome that steps aside while a field has focus. A transparent native input over a drawn control is treated as a proxy and passed. The walk drops the simulated phone bar, which the browser's own scroll-into-view cannot see |

No flags means nothing is mechanically broken. It does not mean the film is good.

Headless Chrome may render WebGL in software: correct pixels, wrong speed. Judge look from dailies;
judge smoothness in a real browser on real hardware, or say that it was not measured.

## Reading the sheet — the director's notes

Look in this order. Write notes as you go; each note names a scene and a fix.

### 1. The sheet as a whole (squint)

- **Sameness.** Do the thumbnails look like one frame repeated? Same ground, same layout, same scale in
  every cell is a slideshow. There should be visible changes of scale, light and colour across the sheet.
- **Rhythm.** Wide, close, wide; dark, light; busy, empty. Can you see the energy curve?
- **The lead.** Is it in most frames? Does it look different at the end than at the start?
- **The first frame and the last.** Would the first stop a scroll? Does the last answer it?
- **Hero-only quality.** Is the bottom half of the sheet as designed as the top row? This is the most
  common failure: a directed opening and a template underneath.

### 2. Each frame (the freeze-frame test)

- **Is it a composition?** One subject, clear hierarchy, intention in the empty space.
- **Shot size.** Does it match the shot list — is the close-up actually close?
- **Light.** Where is the key? What is dark on purpose? Is the lead separated from the ground?
- **Type.** Readable at this size against what is behind it; line breaks deliberate; nothing clipped,
  overlapping, orphaned, or half-faded mid-hold.
- **Edges.** Anything cut off that should not be; anything floating without a reason.
- **Does it look computed?** Check the tells in `vfx-threejs.md`: flat light, razor edges, uniform
  surfaces, glow everywhere, a wide lens on a product.
- **Could this frame be on any other site?** If yes, the director is missing from it.

### 2b. The projection room — five frames at full size

A contact sheet shows sequence; it hides craft. Open these five at full resolution and judge them as a
visitor would see them:

1. **The opening.** Would it stop a scroll? Is the type set, or merely placed?
2. **The closest shot of the lead.** Asset credibility: does it look made, or computed? Is this shot
   closer than the asset can bear?
3. **The densest reading section.** Is it comfortable to read, and still clearly the same film?
4. **The primary control**, with its hover / focus / pressed states. Does it belong to the world?
5. **The mobile signature moment.** Re-composed for the hand, or shrunk?

Look for exact things: line breaks, hanging punctuation, uneven spacing, a crop that cuts the wrong
place, an edge that aliases, a highlight that blows out, a material that reads as plastic. Then perform
the audience's part and each transition in a real browser: stills cannot show whether they reward use.

### 2c. The test screening — someone who has not read the script

You hold the treatment, so you will see what you meant. If you can delegate to a fresh agent, give it
only the contact sheets (no treatment, no brief) and ask four things: what is this product, what should
I do here, what is the lead, and which frame is the climax? Compare its answers with the logline and
shot list. Where they differ, the film is not saying what you think. Its reading counts for more than
yours.

The report also prints the **measured change** in each pinned scene (how much the picture actually
changes across the hold). Put it beside the Energy column of the shot list: a scene planned as a 9 that
measures like a 2 has not been built.

### 3. Each cut (`--cuts`)

- Is the transition what the shot list says? Is anything visible mid-cut that should not be — two
  layouts fighting, a flash of an unstyled frame, text from both scenes colliding?
- Do neighbouring cuts differ?

### 4. Against the treatment

Go down the mechanisms list. For each: point at the frame where it is visible. A mechanism you cannot
point at was not built — build it or remove it from the treatment. Remove the film's name from your
mind: does the page still look directed, or only styled?

### 4a. Against the grade

Lay the reference stills' sheet (`grade.jpg`) beside the contact sheet. Squint at both: would someone who knows
the film recognise its print? Then check it by number: `node scripts/screening.mjs <dir> --grade grade.json` (or
the spec a page's `grade.js` publishes). It flags:
- `grade-drift`: the frame's colours do not match the grade's palette and shares
- `grade-warmth`: shadows or highlights lean the wrong way (a cool grey frame under an amber grade)
- `grade-black`: blacks crushed to pure `#000`, or lifted far above the film's black
- `grade-white`: whites clipped, or dull under the film's white
- `grade-saturation`: the frame's chroma sits outside the grade's range
- `grade-outlier`: one or two scenes off the grade while the rest holds it. That is fine when deliberate (a paper card in a dark film, the regrade at the turn), but say so in the GRADE block's ARC line

Re-grade a flagged scene, or write in the treatment why it departs (a deliberate regrade at the turn). The
usual failures are a grade that stops at the hero, chrome and forms left in default greys, and a reduced-motion
cut that drops the colour along with the grain.

**The world, not only the light.** Crop the hero out of three frames: the densest reading section, a form and the
footer. Do the cards, buttons, dividers and footer still belong to the cast film's world (the ART block's UI map),
or are they a template's under the film's light? Is any prop, logo or the poster itself pasted on? No script
measures this. Judge it by eye on the full-size frames, and put a failure in the notes as a named correction.

### 4b. The short laptop sheet

The same film in a 640-px-high frame. Is every subject whole? Is anything sliced by the bottom edge or
squeezed against the top? Does the type still have air? This sheet is where a page that looked finished
turns out to have been composed for one screen. Check the ultrawide sheet too before delivery: is it a
composition, or a small layout stranded in a large room?

### 5. The mobile sheet

Its own film, judged the same way: composition re-blocked for portrait (not shrunk), type re-set, the
lead still present and large, no overflow, tap targets reachable, nothing hidden behind browser chrome
at the bottom edge (bottom-anchored content clears `var(--safe-bottom)`).

### 6. The accessible cut (`--reduced`)

Every scene a finished still; all copy present; no scene blank or mid-transition; the page a sensible
length with nothing pinned.

## Reshoots

Fix by cause, not by symptom:

| Note | Go back to |
|---|---|
| Frames look the same | Shot list: change shot sizes, grounds and sets between neighbours |
| No clear lead / lead never changes | Casting: give it an arc; put it in more scenes |
| Looks like a template with effects | Director: the mechanisms are not driving structure. Rebuild two scenes from a mechanism |
| Looks computed | Light and material (`vfx-threejs.md`), then lens |
| Type weak or generic | `production-design.md`: scale contrast, a cast display face, hand-set lines |
| Dead holds, dragging | Editing: shorten, or add a development; re-plot the energy curve |
| Lower page collapses | It was never storyboarded. Storyboard it |
| Busy, exhausting | Cut motion. Add a quiet scene. Hold the money frames |

Write every note as a **named correction**: the scene, the fault, the change ("scene 6: tea reads opaque —
replace the surface with a photographed plate, or pull back to MS"). "Polish more" is not a note. If a
screening finds nothing consequential, do not reshoot for the sake of it.

Then screen again. Faults come first; but at this level, taste *is* the work — once nothing is broken,
keep going on the weakest of the five projection-room frames while there is budget, and say plainly
where you stopped and what you would still change.

**Calibrating the eye.** When the brief names a quality bar ("Awwwards level") or reference sites, shoot
them with the same script (`node scripts/screening.mjs https://… --out refs/<name>`) and put your contact
sheet beside theirs. Compare craft, density and finish — not style. Do not copy what you see; notice what
yours lacks.

## Beyond the frame — checks that pictures cannot show

**Interaction.** In a real browser session or with a short script: scroll the full page both ways;
resize; tab through every link and control (visible focus, logical order); click the CTA; use touch
emulation. A hover or pointer effect is verified by performing it and looking, not by reading the code.

**Reading** (copy-heavy pages). Measure, do not guess: body size and leading, characters per line,
contrast of body and secondary text, screens of scroll to pricing and to the primary action, and the
share of total scroll spent in pinned holds. If the client supplied the copy, run `copy-check.mjs`.

**Accessibility.**
- All copy is real text in the DOM, in reading order, with one `h1` and a sane heading outline.
- The canvas is `aria-hidden="true"`; anything meaningful it shows is also said in text.
- Contrast 4.5:1 for text against the brightest thing that can be behind it.
- Nothing flashes more than three times a second; hits are single frames, not strobes.
- No scroll trap: every pinned scene can be scrolled through; Page Down, Space and End work.
- A skip link to the content when a rail or index puts many links before it; DOM order matches visual order.
- Reduced motion honoured (the kit does this; confirm the stills).

**Search and sharing** (the page still has to be found).
- Title, meta description, canonical, Open Graph image — use a rendered money frame as the OG image.
- Content is in the HTML at load, not injected after an animation. Headings describe the product.
- Links are real `<a href>`; nothing important exists only in the canvas or behind an interaction.
- Images have dimensions and alt text; decorative ones have empty alt. Background video is `aria-hidden`, muted, with a poster.
- Every library asset is in `CREDITS.md`, and attribution the licence requires is visible on the page.

**Performance.**
- The first frame is text and CSS; the stage arrives after, over a matching ground. LCP should be the
  headline, not a canvas.
- Largest costs: Three.js itself (the minified core is roughly 200 kB compressed, plus the addons you
  import), fonts (CJK especially), any HDR or model. Nothing else should be heavy. Load the minified build.
- Smooth scrolling on a mid-range laptop and a recent phone. The kit steps quality down automatically;
  check `stage.quality.tier` to see whether it had to, and simplify if it did.
- No layout shift when the reel starts or fonts load.

## The delivery report

Short, and exact about evidence:

```
Film:      <product> — directed after <director>, <film>
Medium:    <what the picture is made of, and why>
Idea:      <controlling idea, one line>
Mechanisms: 1 … 2 … 3 …            (each with the scene where it shows)
Built:     <n> scenes, <structure>; lead: <what>, arc: <states>
Screened:  desktop 1440, mobile 390, reduced motion — contact sheets at <path>
           reshoot passes: <n>; what changed
Not verified: <real-device smoothness, Safari / Firefox, screen reader, …>
Assets:    <supplied / library (CREDITS.md) / generated (tool, count, cost) / procedural>; open asset call: <what is still needed from the user>
Stand-ins: <placeholder copy, imagery, audio, numbers that need the real thing>
Run:       <command>
```

List anything the user must supply or decide. If something does not work, say so here, plainly.
