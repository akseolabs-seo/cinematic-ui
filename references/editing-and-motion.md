# Editing and motion

The cutting room. Scroll is the playhead; you decide what the audience sees at each position, how one
shot becomes the next, and how every moving thing behaves. Built on `kit/reel.js` (API in `kit/README.md`).

## The model

```html
<canvas id="stage" aria-hidden="true"></canvas>
<main>
  <section data-scene="arrival" data-still="0.6" style="--length: 250"><div class="frame">…</div></section>
  <section data-scene="turn" data-cut style="--cut: 100; --length: 300"><div class="frame">…</div></section>
  <section data-scene="plans" data-flow><div class="frame">…</div></section>
</main>
```

- A **scene** is a stretch of scroll (`--length` in vh). Its **`.frame`** is pinned for that stretch: the
  shot. One persistent canvas sits behind all of them.
- Each scene has three **clips** on one master timeline: `enter` (while it comes in), `main` (while
  pinned), `exit` (while it leaves). Positions and durations inside a clip are fractions of it:
  `main.to(x, { duration: 0.3 }, 0.5)` runs from 50% to 80% of the hold.
- Scroll maps to master time. Nothing animates on its own clock except the **intro** (opening titles)
  and ambient life (`stage.onTick`).
- A **flow scene** (`data-flow`) is as tall as its content and is not pinned — for anything read.
- `data-still` marks the money frame within `main`: the pose shown under reduced motion.

```js
reel.scene('arrival', ({ enter, main, exit, q, frame }) => {
  main.fromTo(rig, { x: 2.6, z: 10, fov: 24 }, { x: 1.2, z: 6.2, fov: 24, ease: 'power1.inOut' }, 0);   // the camera move
  main.from(q('.line > span'), { yPercent: 110, duration: 0.2, stagger: 0.04, ease: 'power3.out' }, 0.1); // type arrives
  main.to(q('.kicker'), { opacity: 0, duration: 0.1 }, 0.85);                                             // and clears before the cut
});
```

## Cuts — every boundary is a decision

**Push (default).** With no `data-cut`, the next scene scrolls up from below while the stage camera
moves or cuts. Honest and physical. Good between flow scenes and where a hard change of ground is the
event.

**Designed cuts (`data-cut`).** The incoming scene slides under the end of the previous one, so for
`--cut` vh of scroll both frames are pinned and stacked. The incoming scene's `enter` clip and the
outgoing scene's `exit` clip play across that overlap. Give the incoming frame a ground (or keep it
transparent to let the stage show) and animate how it takes over:

| Cut | `enter` clip of the incoming scene | Notes |
|---|---|---|
| Wipe | `fromTo(frame, { clipPath: 'inset(0 0 0 100%)' }, { clipPath: 'inset(0 0 0 0%)' })` | Any edge; stop short of 0% to leave a split screen |
| Iris | `clipPath: 'circle(0% at 50% 50%)'` → `'circle(75% at 50% 50%)'` | Centre it on the lead's screen position for a match |
| Diagonal / shaped wipe | `clipPath: 'polygon(…)'` with the same point count at both ends | Follow a line already in the frame |
| Dissolve | `fromTo(frame, { opacity: 0 }, { opacity: 1 })` | Slow, once per film |
| Through black / white | Outgoing `exit.to(look, { fade: 1 })`, incoming `enter.fromTo(look, { fade: 1 }, { fade: 0 })` | An act break. Use the DOM `.flash` layer if type must be covered too |
| Hard cut | `data-cut` with `--cut: 1` and nothing animating the frame; `enter.set(rig, {…}, 0)` for the new camera pose | The incoming frame replaces the old one on a single scroll tick. Pair with a change of ground |
| Match cut | Outgoing `exit` moves the lead to an exact screen rect; incoming scene starts with a different element at that rect | Get position, size and silhouette identical at the join |
| Whip | Outgoing `exit`: content `xPercent: -60` with `filter: blur(…)` horizontal smear; incoming `enter`: from `xPercent: 60` | Cut at peak speed; `power3.in` out, `power3.out` in |
| Invisible | Lead (or a dark plane) scales to cover the frame in `exit`; swap everything behind it; reveal in `enter` | The camera "passes through" the object |
| Zoom-through | `exit`: frame scales up 4–8× into a detail with blur; `enter`: next frame scales from 0.6 | The detail should be the thing the next scene is about |

Frames are transparent over the shared stage unless you give them a ground, so in every cut decide what
happens to the outgoing copy: clear it in the outgoing `exit` clip (for a hard cut,
`exit.set(q('.copy'), { opacity: 0 }, 0)`), or let an opaque incoming frame cover it.

**Into and out of flow scenes.** A flow scene is not pinned, so it always arrives and leaves by push —
that is physical, and fine. Design the push instead of the overlap: what the stage does underneath (a
fade, a camera cut, the lead leaving), what the last pinned frame does in its `exit`, and how the flow
scene's first screen is composed to meet it. Two pushes are different cuts if the stage and the grounds
do different things.

The camera across a cut belongs to the incoming scene: key the `rig` in its `enter` clip. A camera that
*travels* between poses is a move; a `set` or two different `fromTo` starts is a cut. Choose.

**Eye-trace.** The viewer has one gaze. Note where the eye is resting when a scene ends (the last thing
that moved, the brightest point, the end of the line being read) and put the next scene's subject there,
already present at the cut. Then cuts can be as fast and as hard as you like and still read; if the eye
has to hunt after every cut, the film feels broken however good the frames are.

**J-cuts.** Let the next scene's first line of copy arrive in the outgoing scene's last 15%, over the old
picture. It pulls the reader through the cut.

**No dead air.** A frame with nothing to look at is almost always a subject placed late. Three rules:
- Bring the next scene's subject or headline in before the cut (the J-cut above), never after the
  incoming frame has settled. A pinned scene that opens on empty ground starts at its first beat instead.
- Title-card words sit on their mark from the card's first frame. If the card's ground pushes in, hold the
  words still on screen while the ground uncovers them: drive a `--enter` property 1 → 0 across the `enter`
  clip and counter-translate the words by it, so no frame of the card is black with only a label on it.
  ```css
  .card .word { translate: 0 calc(var(--enter, 0) * -1 * var(--frame-h, 100lvh)); }
  ```
  ```js
  reel.scene('chapter-2', ({ enter, el }) => enter.fromTo(el, { '--enter': 1 }, { '--enter': 0 }, 0));
  ```
- Copy fades before a moving clip edge (a wipe, a door seam, a console sliding over) reaches it. A
  headline sliced mid-word by a clip edge is a broken frame, however good the cut: clear it in the
  outgoing `exit`, or show the incoming copy only once the opening passes its line (`--open > .35`).

**Choose, do not default.** One cut used throughout is an editorial voice (Ozu cuts hard, always). A
different trick at every boundary is a showreel. An unconsidered push everywhere is neither.

## Pacing

- **One beat per ~100vh.** A beat is one thing the audience registers: a line landing, an object
  changing state, a camera arriving. Count beats, set length to match.
- **Arrive, hold, leave.** Within a scene: movement into the money frame over the first 30–40%, a hold on
  it (20–30% where almost nothing moves), then set-up for the cut. The hold is where the frame is *seen*.
- **Do not trap.** A pinned scene must keep developing. If the screening flags a dead hold, shorten the
  scene or add a development — never leave scroll that does nothing. The one exception is the scene of
  deliberate stillness: keep it short (100–130vh) and mark it `data-hold`.
- **Leave reading alone.** Never scrub the opacity or position of text someone is in the middle of
  reading. Bring it in, hold it still, take it out.
- **Snap sparingly.** CSS scroll-snap or Lenis snap suits a film of discrete cards; it fights a film of
  continuous camera moves.

## Easing is acting

How something moves says what it is. Choose per character, then stay consistent.

| Character | Ease | Duration (time-based) |
|---|---|---|
| Precise, engineered, calm | `power2.inOut`, `power3.inOut` | 0.6–1.0 s |
| Heavy, expensive, slow to stop | `power4.out`, `expo.out` | 1.0–1.6 s |
| Light, quick, digital | `power2.out` | 0.25–0.45 s |
| Mechanical, robotic, deliberate | `none`, or `steps(n)` | — |
| Playful, elastic, comic | `back.out(1.4)`; `elastic` only for a toy | 0.5–0.8 s |
| Organic, breathing | `sine.inOut` | 2–6 s loops |
| Violent, impact | `expo.in` into the hit, `expo.out` away from it | 0.15–0.3 s |

- **Scrubbed tweens** default to `ease: 'none'` in the kit: scroll already has the visitor's own easing.
  Add an ease to a scrubbed camera move only to shape where the movement concentrates.
- **Nothing bounces by default.** Overshoot is a personality; most products do not have that one.
- **Follow-through and overlap.** Parts of one object do not stop together: the body arrives, then the
  cap, then the label settles. Offsets of 40–120 ms sell weight.
- **Anticipation.** A small move the opposite way before a large one (the lead dips before it rises)
  makes the large one read.
- **Stagger is choreography.** Order by meaning — from the light, from the centre, by importance — with
  `stagger: { each: 0.05, from: 'center' }` or a function. Uniform top-to-bottom stagger is a default.
- **Arcs.** Things travel on curves, not straight lines: tween `x` and `y` with different eases.

## Type choreography

- Lines from behind a mask (see `production-design.md`); words for emphasis; characters only for titles.
- Enter on the beat of the camera: type lands as the move settles, not during it.
- Exit before the cut, or let it be cut with the frame. Never leave type half-faded across a boundary.
- Counters animate only real numbers, run once, and stop on the exact value.
- For a performance beyond the mask-rise — stamp, split-flap, odometer, slit-scan, tunnel, vertical
  parallax — cast one from `kit/type-fx.js` (`type-motion.md`); it scrubs with the scene's clip.

## The audience's part

A film is watched; a site is also touched. Scrolling operates the playhead — it is not yet a part in the
film. Award-level sites nearly always give the visitor **one thing to do that means something**, and
everything small on the page then speaks the same language.

Write it as a contract in the storyboard:

```
Action       what the visitor does            drags a stray sheet onto the ledger
Response     what answers, immediately        it snaps into its row; the row total updates
Consequence  what stays changed               that sheet is filed for the rest of the page
Equivalent   keyboard and touch               focus the sheet, press Enter; tap on touch
```

- **It enacts the promise.** The interaction is the product's claim made physical: a deploy tool lets
  you roll a release back and watch the old state return; a tea brand lets you open the wrapper and find
  the batch's origin. If it could sit on any site (a cursor trail, a tilt), it is decoration.
- **One, placed.** It belongs to a scene, usually the turn or the climax, and has room: the frame holds
  still while the visitor acts.
- **It persists.** Something stays different afterwards. An effect that resets when the pointer leaves
  is a hover state.
- **Action language repeats in the small things.** If the signature action is a fold, menus fold; if it
  is a snap, toggles snap and links land with the same weight. Hover, focus, pressed and loading states
  are designed in that language, not left as defaults.
- **Scroll and pointer never fight.** The scroll owns the camera. Pointer input moves something else
  (a light, the lead, a layer) or leans the camera by a hair (`rig.parallax`, off by default) — never
  the property a scene is scrubbing.
- **Invitation.** The visitor must be able to tell that something can be touched: a cursor change, a
  small label, a resting motion. An interaction nobody finds does not exist.
- **Never required.** Every word and the primary action are reachable without it.

## The pointer, otherwise

On pointer devices only.

- **A light in the hand.** Move a softbox, a specular or a mask with the pointer so the visitor "holds"
  the light.
- **Inspection.** Hover to turn the lead, open a part, bring a detail into focus.
- **Camera lean** (`rig.parallax` 0.1–0.3) only if the film's camera is handheld or floating; a
  locked-off film has none.
- **Magnetism** on one primary button at most. **Custom cursors** only with a reason from the film.
- Every pointer-driven reveal needs a keyboard and touch route to the same content.

## Velocity

`reel.velocity` (viewports per second, smoothed) lets the film respond to how the visitor scrolls: a
smear on images, a skew on type, the camera's `roll` or `fov` breathing with speed, particles streaking.
Cap it, and decay to rest. It is a seasoning.

## Ambient life

A held frame should still be alive: dust drifting, a slow breathe on the camera, light moving across a
surface, a screen flickering. Drive it from `stage.onTick(time)`. Keep amplitudes small; ambient motion
that draws the eye is a distraction from the subject.

## Sound

Off by default. If sound belongs to the idea, offer a visible, labelled toggle; start muted; respect
the toggle across scenes; never tie comprehension to it. When it is on, sound acknowledges events — the
signature action landing, a cut, the lead changing state — rather than playing underneath as wallpaper.

## Triggers — what starts a performance

Scroll is one trigger among many. A film where everything is scrubbed by scroll is as monotonous as one
where everything fades up. Cast the trigger with the beat, and give a piece **at least four kinds**:

| Trigger | What it is for | How (kit) |
|---|---|---|
| **Scroll scrub** | The camera: travel, transformation, anything the visitor should control in time | `reel.scene` clips |
| **Scroll enter, then play** | A beat that should land once at its own tempo, not be scrubbed: a counter, a stamp, a reveal | `reel.phase(name)` changes to `main` → play a time tween on `fx.p` (once) |
| **Autoplay / loop** | Ambient life, a product demo playing by itself, a loader, a hero that performs before anyone acts | a paused GSAP timeline or `reel.onFrame(f => fx.t = f.time)`; pause off-screen and under reduced motion |
| **Click / tap** | A choice, a step, a switch between options (tabs, plans, modes, chapters) | button → tween `fx.p` 0→1 with new `text`, or advance a shot index |
| **Hover / focus** | An answer to attention: preview, select, highlight, a cursor that becomes a tool. Best: the side a shopper would turn the object to see (the label, the spec, the back) | `pointerenter`/`focus` → tween; same answer on focus and on tap |
| **Drag / hold** | The product's verb performed by hand: scrub a comparison, hold to charge, draw | pointer events → set `p` directly; keyboard equivalent (arrows, Space held) |
| **Type / input** | The visitor writes and the page answers: a prompt box, a calculator, a search | `input` → state function |
| **Idle / time of day** | The page notices time: an idle prompt, a live clock, a demo resuming; a countdown only when time is the subject, ending on the CTA | the kit's time, never `Date.now()` inside a rendered frame (read the clock once, then advance with `t`) |

**Into a final pinned scene from a flow scene, push — don't overlap-cut:** an overlap hides the flow
scene's last screen of reading.
**Hold, built:** a tween on a state value (0→1 over ~1.2 s) on `pointerdown`, reversed on `pointerup` /
`pointerleave`, the state committed on complete; keyboard by `keydown`/`keyup` on Space or Enter, ignoring
repeats; `touch-action: none` on the target; a visible progress ring and the same commit on long-press.
**Entry-played beats in the screening:** `seek()` freezes the reel's clock but GSAP time tweens still run,
so a still catches them at frame zero — when `f.capturing` is true, jump them to their end.
**Chrome synced in `onFrame`** goes stale while the clock is frozen: also call its sync from your state
changes.

Every trigger has a keyboard and touch path and a reduced-motion state (autoplay pauses at a composed
still with a play control). Write the trigger next to every performance in the shot list.

## Click-driven and fixed-stage films

Not every film is scrolled. A piece advanced by clicks, keys or swipes — a darkroom, a projector, a deck
of shots, an interactive set — is a film whose playhead is a **shot index**. Keep the same discipline:

- **One state function.** Every frame is `render(x, s)`: `x` the shot index, `s` 0–1 progress through the
  cut into it (plus `t` for ambient life). Clicks only tween `s` and then step `x`; nothing else holds
  state. Expose `window.__stage = { seek(x, s) }` so any frame can be reproduced and screened.
- **Cuts are timed clips, not CSS transitions.** A GSAP tween on `s` (0.5–1.2 s, eased by the cut's
  temperament) drives the cut; type moves from `kit/type-fx.js` take `s` or `t` directly.
- **Every advance has three inputs:** a real `<button>` (focusable, labelled with where it goes), `←/→`
  and `Enter`, and a swipe. Show where the visitor is in the world's own language (the instrument).
- **The visitor's choice persists.** A choice made on one shot (the frame they circled, the colour they
  picked) is carried into later shots, the price, the ending.
- **Reading still scrolls.** Put the calm document (process, prices, FAQ) after or between the set pieces
  as ordinary flow; a click-only site that hides the reading is a trap.
- **Screen it with `--act`:** shoot every shot at rest and every cut mid-flight with `page.click` /
  `page.keyboard` or `__stage.seek`; the screening runs act scripts on any page.
- **Reduced motion:** cuts become instant, `s` jumps to 1; all shots remain reachable.

## Between pages

A multi-page site cuts between pages as a film cuts between locations. Use the View Transitions API
(`@view-transition { navigation: auto; }` with a shared `view-transition-name` on the element that
carries over) for a match cut between routes, and restore focus and scroll. One carried element is a
cut; six are a mess.

## The two cuts

**Reduced motion** (`prefers-reduced-motion: reduce`) is handled by the kit: pinning and overlaps are
removed, every scene rests on its `data-still` pose with its entrance complete, and the camera cuts
between poses instead of travelling. Your job is that each still is a finished frame, with all of the
scene's copy visible — if a scene reveals lines one after another, its still must show them all.

**No JavaScript / before load:** content is in the document in reading order, visible and styled.
Author the *final* state in CSS and animate *from* elsewhere, so a script failure leaves a page, not a
blank.

## Performance rules for motion

- Animate `transform`, `opacity`, `clip-path`, `filter` (sparingly) — never layout properties.
- `will-change` only on what is about to move, removed after; large blurred layers are expensive.
- One loop: `reel` drives `gsap.ticker`; do not add `requestAnimationFrame` loops or scroll listeners.
- `overflow: clip`, not `hidden`, on anything that contains a sticky frame.
- Images: sized, `loading="lazy"` below the first scene, modern formats; fonts preloaded for the
  first frame.
- Measure on a real mid-range phone before believing it is smooth.

## Without the kit

The same film can be cut with GSAP ScrollTrigger (`scrub`, `pin`), with CSS scroll-driven animations
(`animation-timeline: view()` / `scroll()`), or inside React with a scroll-progress hook. Keep the
invariants: one playhead, clips per scene, pinned frames, any frame reproducible, a still for every
scene.
