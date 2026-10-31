# Screenplay and storyboard

Everything here is written into `treatment.md` before the first line of code. It is the cheapest place to
find out a page is boring.

## Logline and arc

**Logline** — one sentence: *someone* wants *something*, *something* is in the way, and *this* changes it.

> A finance lead closing the month by hand, across six spreadsheets nobody trusts, watches the books
> reconcile themselves while she is still reading the first line.

It names the audience, the tension, and the turn. It never names features.

**Audience arc** — two lines.
*Arrives believing:* month-end is three days of dread, and tools only move the mess around.
*Leaves believing:* it can be over before lunch, and I can see exactly why it is right.

Every scene moves the audience along that line or it is cut. The **controlling idea** — the single
thing the film argues — is the arc stated as a claim ("certainty is faster than speed"). When two design
choices compete, the one that argues the controlling idea wins.

## Form — how much of this is a film

Decide the form from what the product has to say, before choosing a structure.

| Form | When | Shape |
|---|---|---|
| **Feature** | One strong idea to carry, a product that rewards a journey | A long scroll film: mostly pinned scenes, one or two flow scenes |
| **Chapters** | Several distinct things to explain | Self-contained sequences with title cards and hard act breaks |
| **Document with set pieces** | Dense information: B2B, docs-like products, pricing-led pages | Mostly flow scenes, directed by type, light and ground, with two or three pinned set pieces |
| **Collection** | Portfolios, catalogues, case studies | A wall or rail to explore, then short films per item (often separate pages) |
| **Short** | One message | Three to five scenes. Stop when it has been said |

A site does not become better by becoming longer or more pinned. Use the least film that carries the idea.

### When the copy is rich

A page with a lot to say — services, cases, plans, a long FAQ — is a **document with set pieces**, and
the reader came for the document. Direct it like one:

- **Pin only what develops.** A scene earns a pin when something changes that a reader could not get by
  reading: a method assembling, a number arriving, the one turn. Lists, tables, prices and answers flow.
- **Budget the hold.** Add up the scroll that does not advance the document (pinned holds). On a
  copy-heavy page keep it under about a quarter of the total; if the film costs the reader more than
  that, cut film, not copy.
- **Count screens to what matters.** How many screens of scroll to pricing, to proof, to the primary
  action? The primary action is in the first viewport and stays reachable (a quiet persistent control);
  long pages get an index or rail that jumps, and says where you are.
- **Everything the client wrote is on the page.** Reorder, re-break, set in levels, fold the tail of a
  long list into `<details>` — but do not cut. If a block should not be on the homepage, keep it and say
  so in the delivery. `scripts/copy-check.mjs` verifies coverage.
- **Reading comes first in reading scenes.** Body 16–18 px (CJK 17 px or more), a real measure, contrast
  measured, nothing animating under text being read. The film is in the type, the ground, the rhythm of
  dense and open — and in what the lead is doing in the margin.
- **Density is a rhythm.** Alternate dense reading scenes with one-thing scenes (a single figure, a
  single sentence), so the eye rests between chapters.
- **Conversion edits act on order, weight and folding, not deletion.** When a CRO pass says "less", move
  decision-critical copy later, set it quieter, or fold it (`<details>`) — the client's words stay on the page.

## Structure — pick one, on purpose

| Structure | Shape | Use for |
|---|---|---|
| **Three acts** | Setup (world, problem) → Confrontation (escalating set pieces, a midpoint turn) → Resolution (payoff, final image) | Most product and brand pages |
| **In medias res** | Open on the climax, then "how we got here" | Products with one spectacular result |
| **The heist** | The score → assembling the crew (capabilities) → the plan (how it works) → the job (demo) → the getaway (CTA) | Platforms with several parts that work together |
| **The oner** | One continuous journey through one space, no cuts | Immersive brand worlds, physical products, places |
| **Rashomon** | The same thing seen by three people in turn | Multi-persona products; before / during / after |
| **Documentary** | Thesis → evidence → witness → verdict | B2B, research, anything that must be believed |
| **Anthology** | Self-contained short films under one title sequence | Portfolios, studios, case-study collections |
| **A day** | Dawn to night; light is the clock | Lifestyle, routines, hospitality |

### The skeleton — four dials under every structure

Two sites with different directors, media and palettes are still the same film if they share a skeleton.
Set these on purpose, and differently from your last productions (the filmography records them):

| Dial | Settings |
|---|---|
| **Energy shape** | Ramp (only climbs) · wave (rise, break, peak, resolve) · cold open (starts at the peak, then explains) · plateau and drop · low and level (meditative) |
| **Where the turn falls** | Early, about 15% (the product arrives at once and the film is about living with it) · the middle · late, about 75% (a long ordinary world, then everything changes) |
| **How it opens** | An empty set · a full set · mid-action · a title card alone · a question |
| **How it ends** | A rhyme with the opening · a smash to black · mid-motion, unresolved · the product simply in use · a card of words |

The table of beats below is the *wave, middle turn, rhyme* skeleton written out. It is one skeleton, not
the template.

### The beats of a three-act page

| Beat | Film | On the page |
|---|---|---|
| Cold open | A hook before the titles | The first viewport: one image, one line. Not a summary of the page |
| Title | The name, alone | Brand or product name given its own moment (can be inside the cold open) |
| The ordinary world | Life before | The problem, shown — in the audience's terms |
| Inciting incident | The thing that changes everything | The product enters. The lead does its first action |
| Rising action | Set pieces, each bigger | Capabilities, each staged as a *different kind of shot*, escalating |
| Midpoint turn | The story is not what you thought | The surprising proof or reframe: a number, a demo, a reversal of scale |
| The quiet scene | Breath before the end | Stillness: a testimonial, one sentence, an empty frame |
| Climax | The biggest sequence | The signature shot — the one thing people will describe to someone else |
| Resolution | The new normal | What life looks like now; pricing or plans, plainly lit |
| Final image | The frame you leave on | The CTA, composed as an answer to the opening image |
| Credits | Who made this | Footer |

In this skeleton the final image *rhymes* with the opening one — same framing, changed subject. Other
endings are listed above; choose.

### Ordinary sections, directed

| Section | It is really a… | The lazy cut | Directed |
|---|---|---|---|
| Hero | Cold open | Headline, subhead, buttons, mock-up | One shot that starts the story; the headline is a line of dialogue |
| Logo wall | Establishing the world | Grey logo row | A credits crawl; names etched on the set; a montage at speed |
| Features | Set pieces | Three cards with icons | Each capability its own shot size and staging; the lead performs each one |
| How it works | The plan | Numbered steps | A single take following the object through the process; or snap-cut inserts |
| Metrics | The reveal | Big numbers in a row | One number, alone, at the scale of the frame; the others as an insert |
| Testimonials | Witnesses | Carousel of quotes | One voice, held in close-up; a pull quote as an intertitle |
| Comparison | Cross-cutting | A table with ticks | Split screen: two worlds running in parallel until one stops |
| Pricing | The deal | Three cards, middle one bigger | High key, eye level, lock-off. No tricks: this scene must be trusted. A flow scene |
| FAQ | Interrogation | Accordion | Plain, quiet, readable. A flow scene. Let the grade and type carry the film |
| CTA | Final image | Coloured band with a button | The last frame of the film, with one thing to do |
| Footer | End credits | Four columns of links | Credits: set, paced, with a closing mark |

Scenes that must be read — pricing, specs, FAQ, legal, long copy — are **flow scenes**: they scroll at the
reader's pace, with nothing pinned. Directing them means light, type and composition, not motion.

## The shot list

One row per scene. Write it as a table in `treatment.md`.

| Column | What to write |
|---|---|
| **#, slug** | `3 · INT. LEDGER — NIGHT`. The slug names place and light; it becomes `data-scene` |
| **Beat** | Which story beat this is, and what the audience should now believe |
| **Copy** | The exact words on screen |
| **Shot** | Size + angle + lens: "ECU, eye level, 100 mm" |
| **Camera** | The move, start → end: "lock-off", "push-in 9 → 4", "orbit 40° right", "crane up to reveal" |
| **Blocking** | Who is in frame, where, and what they do: enters, marks, exits |
| **Light / colour** | Key direction and quality, what stays dark, the palette for this scene |
| **Build** | What must be made, in the chosen medium: geometry, illustration layers, plates, shader, type |
| **Asset · closest shot** | Which asset carries the scene, where it comes from (supplied / generated / procedural), and the closest shot it survives. The Shot column may not be closer |
| **Cut out** | How this scene hands over to the next: hard, match on *what*, wipe, push, through black — and the eye-trace: where the eye is when this scene ends → where the next scene's subject is waiting |
| **Length** | Scroll length in vh (site) or seconds / beats (film) |
| **Energy** | 1–10 |
| **Money frame** | The one composed still this scene exists for, and where in the scene it sits (`data-still`) |
| **Mobile cut** | How it is re-framed for portrait: crop, re-block, shorter, fewer layers |

Under the table, write **screens to the offer**: how many viewports of scroll (or how many clicks) stand
between arrival and the primary action's full offer, on desktop and on a phone. A long film with short
copy has no reading to justify its length; if the number is over about ten, the primary action must sit in
the chrome from frame one, and the offer is a candidate to move up.

One scene also carries **the audience's part** — the interaction that enacts the product's promise
(`editing-and-motion.md`). Mark it in the Blocking column: what the visitor does, what answers, what stays changed.

### Reading the sequence as a whole

These are questions to answer, not quotas to fill. A film that repeats one frontal shot nine times can
be right (ritual, deadpan, Ozu); one that changes everything at every cut can be right (Edgar Wright).
What is never right is a pattern nobody chose.

1. **Why does each shot differ from the one before — or not?** Put a reason next to every change of shot
   size, angle, ground or layout, and next to every repetition. If neighbours are alike and you cannot
   say why, that is the slideshow; change one or cut one.
2. **What is the shape of the energy?** Plot the numbers. Most films rise, break once into stillness,
   peak, and resolve — but a meditative film may stay low and a trailer may only climb. Flat by accident
   is the failure.
3. **Where is the money?** One scene is the most elaborate. Spend there; simplify elsewhere.
4. **What happens to the lead?** It appears in most scenes and is visibly different at least three times.
5. **Do lengths follow content?** A scene is as long as what develops in it. A long hold where nothing
   changes is dead air, unless stillness is the point — then it is short and marked `data-hold`.
6. **What is the editorial voice?** The same cut used throughout is a voice; a different trick at every
   boundary is a reel of transitions. Reserve the rare cut (match, smash, medium shift) for the moment
   that earns it.
7. **Does every money frame survive as a still?** That frame is what reduced-motion visitors,
   screenshots and social previews will see.
8. **Does each scene say something new?** Coverage is not information. Five angles on the same object
   in the same state are one scene shot five times; each scene should show a different consequence.
9. **Which devices are in play, and how often?** Keep a continuity sheet: for every scene, the type
   entrance, the light event, the camera move. Used once, a device is an accident; twice or three times,
   a motif; in every scene, a tic. Changing a parameter (a little slower, from the other side) is not
   varying: compare frames, not numbers. The commonest tic is one type entrance for the whole site.
10. **Where does the product's verb appear?** The lead's action is planted, paid off and resolved — in
    which scenes?

### Length guide (site mode)

These are `--length` values — the scene's whole height. The hold you get is `length − 100`, minus any
designed cut into this scene and into the next one (see "Scroll arithmetic" in `kit/README.md`).

| Scene | Scroll length |
|---|---|
| A single beat, a hold, a title card | 100–150vh |
| A camera move with one development | 180–260vh |
| A sequence of 3–4 beats in one frame | 280–400vh |
| The climax | up to 500vh, only if it keeps developing |
| A designed cut (`data-cut`) | 60–120vh, taken from the end of the previous scene |
| Flow scene | its content height |

There is no right number of scenes. Count what the product needs said; when a page runs past twenty-odd
screens of scroll, check whether something should be an insert, a flow scene, or another page.

## The short cut and the wide cut

The shot list is drawn for a comfortable 16:10 desktop. Two more frames get a line each in the treatment:
the **short laptop** (about 1366 × 640 of usable height) — what scales down, what drops out, which scene
unpins — and the **ultrawide** — what grows or re-blocks so the frame is not a small layout in a large
room. See "Compose for a range of frames" in `production-design.md`.

## The mobile cut

Mobile is a re-frame of the same film for a tall screen, the way a film is re-framed for a different
format — not the desktop page pushed into a column.

- **Re-block for portrait.** Side-by-side becomes over-under, or the copy overlays the lower third while
  the lead takes the top two-thirds. Wide shots become taller, closer shots.
- **Keep the lead and the signature shot.** Drop supporting cast before you drop the idea.
- **Shorten.** About 60–70% of desktop scroll lengths; thumbs travel further per gesture.
- **Simplify the rig.** No pointer parallax; fewer layers and particles; depth of field off.
- **Give 3D shots a portrait pose.** A tall screen sees far more above and below the subject. Move the
  camera closer or lengthen the lens for phone, and make sure the set extends past the new frame edges.
- **Type re-set, not scaled.** Headlines re-broken by hand for the narrow measure.

## Worked example (shape only — this production is spent; a brief like it must be cast differently)

*Product:* month-end close software. *Director:* Jacques Tati, *Playtime*. *Form:* feature, three acts.
*Medium:* flat architectural drawing — orthographic line and grey-blue planes; no rendered materials
(Tati's world is designed, not solid; a glossy 3D office would be another film).
*Lead:* a single red ledger card moving through a grey-blue office of paper.
*Controlling idea:* order can be playful. *The audience's part:* in scene 3 the visitor drags any stray
sheet onto the ledger and it files itself, staying filed for the rest of the page.

Tati's first mechanism is "deep wide tableau, no close-ups", so the shot list has none: every scene is a
wide or extreme-wide frame, and emphasis comes from what changes inside it, not from getting closer.

| # · slug | Beat | Copy | Shot | Camera | Blocking | Light / colour | Cut out | Len | E |
|---|---|---|---|---|---|---|---|---|---|
| 1 · INT. OPEN FLOOR — MORNING | Cold open | "Month-end, without the month." | ELS, high, orthographic | Lock-off | 400 grey desks in a grid; one red card at desk 1 | Flat cool daylight; only the card has colour | Hard | 160 | 3 |
| 2 · THE CORRIDOR | Ordinary world | "Six spreadsheets. Nobody trusts the seventh." | WS, frontal | Slow truck right | Paper carts cross at three depths; the card rides one, half hidden | Soft top light, long shadows | Match: a cart's edge → a table rule | 220 | 4 |
| 3 · THE LEDGER ROOM | Inciting incident | "One ledger. Every entry accounted for." | WS, frontal, same height as 2 | Lock-off | The rule becomes a row; rows assemble into a wall-sized ledger around the card. **Visitor files a stray sheet** | Light rises from the ledger itself | Wipe (the ledger's edge) | 260 | 6 |
| 4 · THE SAME ROOM, STAMPED | The beat lands | "Reconciled." | WS, identical frame to 3 | Lock-off | Nothing moves; then one stamp lands on the far wall, small, exactly on the beat | One hard shadow appears | Smash | 100 | 8 |
| 5 · THE FLOOR, AGAIN | Midpoint | "3 days → 4 hours." | ELS, as scene 1 | Lock-off | Desks clear in a wave from the card outward | Grey lifts to warm | Through white | 300 | 7 |
| 6 · THE FLOOR, EMPTY | Quiet scene | One customer sentence | ELS, as scene 1 | Lock-off, `data-hold` | One person waters a plant | Window light | Hard | 120 | 2 |
| 7 · THE BUILDING | Climax | "Close the books. Keep the afternoon." | Pull-out from the floor to the whole building | Continuous pull-out, 400vh | Every floor's grid resolves in sequence; the card becomes one lit window | Dusk; windows as practicals | Fade | 420 | 10 |
| 8 · PLANS | Resolution | Pricing | Flow scene, eye level | — | Three plans as ledger pages | High key, paper white | Push | flow | 3 |
| 9 · FINAL IMAGE | Final image | "Start this month." | ELS as scene 1, at night, one desk lit red | Lock-off | The card, alone, glowing | Night; one practical | — | 150 | 5 |

Reasons, as the sequence check asks for them: scenes 1, 5, 6 and 9 repeat one frame on purpose — the
floor is the film's measure of change, and the final image rhymes with the opening. Scenes 3 and 4 share
a frame so that the stamp is the only event. Energy 3 4 6 8 7 2 10 3 5 rises, breaks at 6, peaks at 7.
The red is reserved for the lead. Nothing is ever closer than a wide shot.
