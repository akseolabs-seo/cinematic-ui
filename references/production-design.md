# Production design — the frame

Layout, type, colour and material. On a film this is everything the camera points at; here it is also
everything the visitor reads and touches. The test for all of it is the **freeze-frame test**: stop the
scroll anywhere, and what is on screen should be a composition someone chose.

## The frame, not the page

Stop thinking in a column of sections. Think in frames the size of the viewport, each composed like a
still, then decide how one becomes the next.

### Write the film's visual grammar first

A production designer does not decorate scenes one by one; they set the rules of the world, and every
frame obeys them. Start from the cast film's own production design (`art-direction.md`: the ART block and its UI
map), researched, not remembered. Decide these for *this* film, from its mechanisms, and write them in the treatment:

| Decide | Examples of answers (they should differ from film to film) |
|---|---|
| **Grid and alignment** | A strict 12-column grid everything sits on · one centre axis · a free collage with a single baseline · a modular field of equal cells |
| **Density** | One thing per frame · crowded tableaux · dense document with wide margins |
| **Scale relationships** | Everything at reading size, calm · one enormous element against small ones · three clear sizes and nothing else |
| **Depth** | Flat, no depth at all · two planes · deep staging with foreground occluders |
| **Edges and crops** | Everything inside generous margins · elements bleed off every edge · framed like prints |
| **Lettering** | How type is set, how large, where it sits, whether it touches images |
| **Image treatment** | Full-bleed · windowed · cut out · boxed with captions · none |
| **Texture** | Clean · paper and grain · print dots · screen glow |
| **Chrome** | How present the navigation and controls are: invisible until needed · a persistent slate · part of the picture |

Then test the grammar on three very different screens before building the rest: the opening, the densest
information section, and the conversion moment. If it only works on the opening, it is a poster, not a
grammar.

### Tools — use the ones the grammar asks for

None of these is a rule. Each is right for some films and wrong for others; a site that uses all of them
is the house style of this skill, not of its director.

- **One subject per frame.** A frame with a headline, a paragraph, three cards and a diagram has no
  subject. (Unless the film is a crowded tableau — then the crowd is the subject.)
- **Scale contrast.** Something enormous beside something tiny is dramatic. Even, quiet sizing is
  composed. Choose by the film's temperament; do not reach for giant type by reflex.
- **Crop.** Things cut by the frame edge belong to a bigger world; things held inside margins are
  objects on display. Both are positions.
- **Depth.** Planes behind and in front of the subject, or none at all for a flat, graphic film.
- **Overlap.** Type over image, lead in front of a word — or strict separation, as in a printed catalogue.
- **Negative space.** A frame that is mostly empty is making a statement; so is a full one.
- **Edge marks.** Small precise labels at the frame's edges give scale and finish. Keep them true to the
  product, and leave them out of films that are not about precision.
- **The grid, kept or broken.** A grid broken once reads as an event. A grid never broken reads as order.

### Compose for a range of frames, not one

A film is framed for one screen. A site is projected on a 2560 × 1080 monitor, a laptop whose browser
leaves 640 px of height, and a phone whose address bar comes and goes. A composition that is perfect at
1440 × 900 and broken elsewhere is the commonest way a directed page "falls apart" on a client's machine.

- **Short frames are the dangerous ones.** Anything composed by height — a tall card, three stacked
  blocks, copy pinned to the bottom — is cut off at 640 px. Size by the smaller dimension: `vmin`, or
  `clamp()` with `svh` in it (`font-size: clamp(1rem, 2.2svh + 0.6vw, 1.4rem)`; `max-height: 78svh`),
  and let the subject scale down before it crops.
- **Wide frames go empty.** Cap line lengths and block widths, but let display type, the lead and the
  gaps between them grow with the frame (`vw` / `vmin` terms in `clamp()`), or re-block: what is one
  column at 16:10 can be a tableau at 21:9. Rem-sized type on an ultrawide screen is a postcard on a wall.
- **Nothing important in the bottom strip on phones.** A frame is one *large* viewport tall, so the
  browser's bar can cover its lowest 50–110 px. Keep bottom-anchored copy and controls above
  `var(--safe-bottom)` (defined in `reel.css`): `padding-bottom: calc(6vmin + var(--safe-bottom))`.
- **A width-only breakpoint is a trap.** `max-width: 760px` hands the portrait cut to a phone on its side
  (844 × 390). Make the portrait cut portrait: `(max-width: 760px) and (max-aspect-ratio: 5/4)`. And a
  fixed `rem` floor defeats "scale before it crops": let the floor ease down on very short frames.
- **Decide what gives.** For each pinned scene, say what happens when the frame is too short for it:
  the subject scales, a secondary element drops out, or the scene stops being pinned and scrolls. "It
  gets cut off" is not one of the options.
- **Screen the range.** The screening shoots desktop, a short laptop and a phone (with a simulated
  browser bar) by default; add `--viewports ultrawide,tablet,landscape,mobile-small` before delivery.

### Refinement is in the relationships

What separates finished work from a good idea is exact relationships, checked at full size: the
headline's measure and where its lines break; punctuation hanging at the margin; body text that is
comfortable to read; the crop of every image; the proportions and states of the primary control; spacing
that follows one scale. Spend time here on the three test screens before multiplying scenes.

### Sets — layouts that are not "hero, three cards"

Each is a way to stage a scene. Choose per shot; do not repeat one in neighbouring scenes.

| Set | What it is | Suits |
|---|---|---|
| **Tableau** | One wide, deep, frontal frame; many small things inside | Establishing shots, overviews, ensembles |
| **Monolith** | One huge object or word, cropped, and almost nothing else | Openings, claims, the climax |
| **Corridor** | Travel in z: content passes the camera from depth | Journeys, timelines, onboarding |
| **Rail** | Lateral travel: a strip moving sideways through a fixed frame | Processes, portfolios, sequences |
| **Tower** | Vertical descent through stacked levels with meaning | Architecture of a system, depth of a product |
| **Table** | Top-down, objects laid out by hand | Kits, ingredients, components, what is in the box |
| **Wall** | A dense grid of many items, seen whole, then entered; give it 2–3 sort lenses | Archives, case studies, logos, galleries, catalogues |
| **Window** | A frame within the frame that opens to become the next scene | Reveals, product-in-context, transitions |
| **Split** | Two worlds sharing the frame along a hard line | Comparison, before / after, two audiences |
| **Panorama** | A frame much wider than the viewport, panned | Landscapes, ranges, long diagrams |
| **Cross-section** | The thing cut open, parts labelled | How it works, layers, stacks |
| **Card of words** | Type only, full frame | Intertitles, claims, quotes, the quiet scene |

## Typography — title design

Type is cast like an actor: it has a voice, it enters, it hits a mark. In most scenes it is the second
lead; in a typographic film it is the lead.

### Casting type

Cast from the film itself: look at its title cards, its posters, the lettering inside its world and its
era. Name the *class* of letter that belongs there (a didone, a wood-type grotesque, a geometric sans, a
typewriter, brush script, a Ming face) and then find a family of that class. Two families are usually
enough: one **display** face with character, one **text** face that disappears.

Faces that are chosen by nobody, because every model reaches for them first: Inter, Roboto, Poppins,
Montserrat, Open Sans, Space Grotesk — and, as the new defaults of "designed" AI pages, Fraunces,
Playfair Display, Cormorant, Instrument Serif, Syne, DM Serif, IBM Plex. Any of them can be right; none
of them is right by default. If the filmography shows a face used recently, cast another.

Free families by class, as places to start looking (confirm the licence and that the family loads):

| Voice | Google Fonts | Fontshare |
|---|---|---|
| High-contrast serif — fashion, luxury, drama | Bodoni Moda, Playfair Display, Gloock, DM Serif Display | Boska, Zodiak |
| Literary serif — editorial, thoughtful | Fraunces (variable, optical size), Newsreader, Instrument Serif, Cormorant Garamond, EB Garamond | Gambetta, Erode, Sentient |
| Neutral grotesk with character | Instrument Sans, Schibsted Grotesk, Hanken Grotesk, Familjen Grotesk, Geist | General Sans, Switzer, Satoshi, Supreme |
| Expressive grotesk — brand, display | Bricolage Grotesque, Syne, Unbounded, Archivo (width axis) | Clash Display, Cabinet Grotesk, Chillax, Ranade |
| Condensed / poster | Anton, Bebas Neue, Big Shoulders Display, Barlow Condensed, Oswald | Tanker, Panchang |
| Mono — data, labels, machines | JetBrains Mono, IBM Plex Mono, DM Mono, Martian Mono, Geist Mono | — |

Variable fonts earn their weight: one file, and weight, width and optical size become things you can
animate (`font-variation-settings`), which makes type a performer.

### Setting type

- **Size by the film.** Display type in `clamp()` with `vw` so it scales with the frame. How large is a
  decision of the grammar: monumental for one film, book-sized for another.
- **Leading (Latin).** Display 0.85–1.0, text 1.45–1.6, and little in between. CJK runs taller: see below.
- **Tracking.** Large display: −0.02 to −0.05em. Small caps labels: +0.06 to +0.14em. Body: 0.
- **Measure.** 45–70 characters for reading. Short lines for dialogue.
- **Break lines by hand.** Headlines are broken for sense and shape, each line its own `<span>`; never
  left to the viewport. Re-break for mobile.
- **One emphasis.** Per frame, one piece of type is loud. Everything else is quiet enough to ignore.
- **Numbers are images.** A statistic set at frame scale with tabular, lining figures is a shot.
- **Outlined type** (`-webkit-text-stroke`) on a variable font draws every overlapping contour inside the
  letters. Use a static instance, or `paint-order: stroke fill` with a fill.
- **Details.** Real quotation marks and dashes; `text-wrap: balance` on headings, `pretty` on text;
  `font-feature-settings` for alternates and old-style or tabular figures; optical alignment of
  punctuation at the margin.

### Type in motion

- **Cast the entrance from the film's titles.** How do words arrive in this film? Cut on, hard (Godard).
  Typed (a procedural). Wiped by a bar (Saul Bass). Tracked out slowly from tight to wide (Kubrick-era
  titles). Rising from behind a mask line by line (the web's own classic: `overflow: clip` box, inner
  span from `yPercent: 110`). Drawn on stroke by stroke. Burned in and held. Pick one or two for the whole
  film; the mask-rise on every heading of every site is a tic, not a style.
- **Split only titles.** Per-character animation on a few big words. Never on body text.
- **Keep it readable while it moves.** Type that must be read arrives fast and holds; type that is
  texture can move continuously.
- **Type and lead interact.** The lead passes in front of a word; a word wraps a surface; a letter
  becomes the object (match cut). This is where frames become memorable.
- **Accessibility of split text.** Put the full string in `aria-label` on the heading and
  `aria-hidden="true"` on the pieces.

### CJK (Chinese, Japanese, Korean)

CJK is its own composition system, not Latin type with other glyphs.

- **Shorter, larger, fewer.** A CJK headline carries its meaning in 4–14 characters per line. Cut
  first-screen copy to about half of what an English layout would hold, and move explanation down.
- **Break by meaning.** Author every headline line; never let a phrase split mid-word or leave a single
  character or a punctuation mark alone on a line. `line-break: strict; word-break: keep-all` (Korean),
  `text-wrap: balance` only after the manual breaks exist.
- **Set display by phrase** (kit snippet in `kit/README.md`, *CJK display setting*). Wrap each phrase of an
  H1–H3 in an inline-block `<span class="ph">`, so a line can only break between phrases; give headings
  `word-break: keep-all; line-break: strict; text-wrap: balance` as the fallback, and reading copy
  `text-wrap: pretty`. `font-feature-settings: "halt"` on display type closes the half-empty box of
  full-width punctuation (，。「」), which at 80 px+ reads as a hole in the line. A phrase wider than the
  phone's measure has nowhere to break: keep phrases ≤ 8–10 characters or split them. Audit every H1–H3
  at 1440, 1366 and 390: no lone character, no split word (「急 / 診入口」, 「獸醫 / 師。」 were both shipped).
- **No negative tracking on Han characters.** Tracking 0 to +0.05em for display; negative values make
  strokes collide. Latin display tracking must not leak onto CJK: set it per-language span.
- **Leading.** Display 1.15–1.35 (taller than Latin: the glyphs fill their box). Body 1.7–1.9.
- **Measure in `em`,** 22–32 characters per line for body. `ch` is a Latin unit.
- **Mixed script.** Latin and numerals inside CJK usually need to be 5–10% larger or one weight heavier
  to sit level, and a dedicated Latin family placed first in the `font-family` stack.
- **Vertical setting.** `writing-mode: vertical-rl` is native to CJK and to East Asian film titles. A
  vertical title down one edge of a wide frame is a composition Latin cannot make. Use it. To centre a
  single vertical line in a box, set `line-height` to the box's width; set short numbers upright with
  `text-combine-upright: all`, and check punctuation, which changes form and position in vertical runs.
- **Cast with the same care.** Noto Sans TC / SC is the Inter of CJK: correct and invisible. Alternatives
  on Google Fonts — Traditional Chinese: Noto Serif TC (Ming, for drama and editorial), LXGW WenKai TC
  (kai, warm and literary), Chocolate Classical Sans, Cactus Classical Serif, the Chiron families (HK).
  Simplified display: ZCOOL XiaoWei, ZCOOL QingKe HuangYou, Ma Shan Zheng (brush). Japanese faces with
  wide Han coverage for display — Shippori Mincho, Zen Old Mincho, Zen Antique, Dela Gothic One, Klee One —
  can set Traditional Chinese headlines, but **check every character renders in that face**: a missing
  glyph falls back to another font mid-word and looks broken. Verify in a screenshot.
- **Weight needs range.** Pair a 900 display weight with a 300–400 text weight; mid-weights everywhere
  make a grey wall.
- **Loading.** CJK web fonts are large; Google Fonts serves them in unicode-range slices, so use the
  hosted CSS rather than self-hosting a whole file, and `font-display: swap`.

## Colour

- **Measure the film before choosing hexes.** The ground, ink, accent and any supporting hue come from stills
  of the cast sequence (`grades.md`, `scripts/grade-from-stills.mjs`), and so do the black and white points. The
  same measurement drives the picture grade (`kit/grade.js` / `stage.look`), so page and picture belong to one
  print. Two uncast grades are refused: warm paper + vermilion + dark ink, and cool grey + one blue or green accent.
- **Declare the commitment first.** How much colour does this film spend? *Restrained* (near-monochrome,
  one accent: Ozu, Fincher) · *committed* (two or three hues, used everywhere: Wes Anderson) · *full
  palette* (Almodóvar, Jacques Demy) · *drenched* (one saturated hue floods the whole frame: Zhang Yimou,
  Refn). The choice comes from the film; restrained is not the safe default.
- **Write the colour script.** A row of swatches, one group per scene. Read along it: does the palette
  travel with the story (cold to warm, grey to colour), or hold still on purpose?
- **Decide what black and white are.** Pure black and pure white, tinted neutrals, coloured paper, a
  coloured dark: each belongs to different films. Whatever the ground is, the CSS ground and the stage
  backdrop are the same value.
- **A reserved colour** — one hue that appears only on the lead and the action — is a strong device for
  restrained films. Committed and drenched films work differently: say how the action stands out.
- **Contrast is light, not colour.** Check frames in greyscale. If the composition disappears, colour
  was doing a job that value should do.
- **Change the ground between acts,** or keep one ground throughout and say why. A cut from a dark scene
  to a paper-white one is a shot change the whole body feels.
- **Text contrast holds over the stage.** Copy over a moving canvas needs 4.5:1 against the *brightest*
  thing that can pass behind it. Guarantee it with composition (keep the lead out of the text zone), a
  local scrim or gradient, or a text block with its own ground — not with a shadow on the letters.

## Material and finish

- **One surface for canvas and DOM.** Whatever the picture is printed on — film grain, paper, screen,
  nothing — applies to both. If the stage has grain (`look.grain`), give DOM scenes the same (SVG
  `feTurbulence` or a tiled noise at 3–6%, `mix-blend-mode: overlay`, `pointer-events: none`); if the
  film is clean, neither has it. The medium's paper and ink colours (`looks.md`) are the DOM's too.
- **Depth by light.** Separation from gradients, rim highlights and cast shadow that agree with the
  scene's key — not from `box-shadow` on cards.
- **Lines and edges** come from the medium: hairlines for an architectural or printed film, brush edges
  for ink, hard pixel steps, no lines at all for a film made of light. Rounded rectangles with borders
  organise a frame the way a template does.
- **One material idea.** Paper, glass, metal, cloth, light: choose the world's material and let every
  surface, including buttons and inputs, be made of it.

## The interface inside the film

- **Navigation follows the grammar's "chrome" decision:** a quiet fixed slate, a bar that belongs to the
  picture, or nothing until asked for. Whatever it is, it stays legible over every ground (switch its ink
  by scene) and works by keyboard. A fixed slate needs its own ground wherever content scrolls beneath it —
  in flow scenes, during pushes, and throughout the reduced-motion cut (or let it scroll away there).
- **Fixed chrome never lands on content.** Header, slate, status slip, counters, chips: each gets a ground
  that follows the scene (`--cbg` switched per scene, or a solid strip), and the content keeps clearance —
  frames pad by the chrome's height plus a gap (a 56–64 px header → `scroll-padding-top: 72px`; a bottom bar
  → 72 px + `var(--safe-bottom)` under the last line). Chrome hides over the credits / footer, and on phones
  while a form field has focus (`body:has(form :focus) .pill { display: none }`). A focused element never
  sits under fixed chrome (WCAG 2.4.11): `scroll-padding` / `scroll-margin` on targets, and check by
  tabbing. On a phone a status instrument (rail, counter, slip) docks as the header's second line rather
  than floating over copy. `screening.mjs` flags `chrome-over-text` and `focus-hidden`.
- **Phone wayfinding lives in the thumb zone.** Instruments do not replace navigation on a phone. Either a
  bottom pill (the primary CTA + an index button with `aria-expanded`, opening a scene list; Escape closes
  it and returns focus to the button), or a 目次 / Index button with a bottom rail. A live product moment
  (a drill, a calculator) gets a thumb bar of equal keys on its own ground at the bottom of the frame.
  Every target ≥ 44 × 44 px; keep the pill above `var(--safe-bottom)`.
- **Progress as timecode.** A scene counter, chapter mark or thin progress line tells the visitor where
  they are in the film. It is the one piece of film furniture that is also good UX.
- **Buttons and links** look and behave like controls, with visible focus. The CTA is the one place the
  reserved colour appears in the interface.
- **Cursor.** The system cursor, unless the film has a specific reason for another; never on touch.
- **Loader.** If there is something real to wait for, the wait is the opening titles — short, and
  showing true progress. If there is nothing to wait for, there is no loader.
- **Forms, tables, pricing.** Designed in the film's type and material, lit plainly, never animated in a
  way that delays reading or input. When a form, quiz, calculator or search *is* the product's promise,
  stage it as the set piece: on a world object, one question per shot, each answer echoed back — real
  inputs, labels and keyboard paths kept (`award-reel.md`, the second jury).
- **Practical props work.** What the visitor handles has to feel made: one press behaviour for every
  control; hover, focus, pressed, disabled and loading states designed in the film's action language.
  Text selection colour, the caret, focus rings and scrollbars are part of the picture — grading them to
  the film is the cheapest sign that a page was built rather than assembled.
- **The more often it is used, the less it performs.** A menu opened fifty times a day does not animate;
  a once-per-visit reveal can.
