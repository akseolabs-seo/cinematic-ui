# Type motion — 文字動畫 44 種

Type is an actor. Most of the time it is the second lead: it enters on a beat, hits a mark and holds
still so it can be read. In a typographic film it is the lead, and then how it moves *is* the
performance. `kit/type-fx.js` has forty-four type moves in six families. Each one is a tool for a specific
dramatic beat. None of them is decoration you add because it is there.

Every effect is driven by two numbers, so the reel can scrub it and the film clock can render it frame
by frame: `p` (0–1, the entrance or the transition) and `t` (seconds, for type that keeps moving). The
words stay words: the real text is in the DOM (visually hidden, read by screen readers and search
engines), and everything drawn is `aria-hidden` decoration. Before the script runs, the element is
just its own plain text.

## How each kind is driven

| Kind | What `p` / `t` do | Site mode (reel) | Film mode (clock) |
|---|---|---|---|
| **E** entrance | `p` 0→1 brings it in, `p = 1` is the rest pose | `main.fromTo(fx, { p: 0 }, { p: 1, duration: 0.3 }, 0.1)`. It lands in the first third of `main`, as the camera settles | `tl.fromTo(fx, { p: 0 }, { p: 1, duration: beat(2) }, beat(1))` |
| **C** continuous | `t` runs it, `p` is a short arrival (a wipe, or approach from depth) | `reel.onFrame((f) => { fx.t = f.time; })`, plus an entrance on `p` if it needs one | `film.onFrame((t) => { fx.t = t; })` |
| **S** switch | `p` walks through `text: [a, b, c]`. Each word holds, then changes (`hold`, default 0.3 of its share) | Scrub `p` over the scene's hold, about one word per 100vh | Key `p` across the beats, or `{ loop: beat(2) }` to change on time |

```js
import { typeFx } from './type-fx.js';
const fx = typeFx(document.querySelector('.stamp'), 'stamp', { colors: ['#d8261c'] });
reel.scene('verdict', ({ main }) => main.fromTo(fx, { p: 0 }, { p: 1, duration: 0.25 }, 0.35));
```

Field effects (marked ▣) fill their element's box, so give the element a size (usually the frame).
The rest set inline in the element's font size. `{ fit: true }` sizes them to the box instead.

## In a real page

**Cast the page's face once.** Unless told otherwise the effects draw in the library's own stack
(Noto Sans TC / PingFang TC / Microsoft JhengHei, weight 900), so in a page with its own cast face they
fall out of it. Call this once, before the effects are made:

```js
typeFx.defaults({ font: 'inherit', weight: 'inherit' });   // every effect made after this takes the element's face
```

`font: 'inherit'` (and `weight: 'inherit'`) resolve to the element's computed face, so canvas and SVG
drawing (LED board, fly-through, liquid fill) and the odometer labels and select-box size label use it
too. Precedence: an effect's own defaults (typewriter 700, headline-swap 800…) < `typeFx.defaults()` <
the options passed to `typeFx()`. `typeFx.defaults({ font: null })` clears a key; `typeFx.defaults()`
reads them. Nothing changes for a page that never calls it.

**What a screen reader hears.** The hidden `.tfx-sr` span holds the real text. For a switch effect with
several texts it holds the one text the visitor sees at the current `p`: the leaving text until the
change is half done (`k ≥ 0.5` within its share, after `hold`), then the arriving one; at rest (`p = 1`,
and under reduced motion) the last text. It updates as `p` crosses each switch point, as a pure
function of `p` and `t` like everything else. It is not a live region, so nothing is announced as it
changes. Other effects read all their texts once, joined with " / ". A bound odometer reads its value.

**Options for real pages:**

| Effect | Option | What it does |
|---|---|---|
| all | `font`, `weight: 'inherit'` | The element's own face (see above) |
| `headline-swap`, `highlighter` | `pad` (em) | Inline padding. Default 0 when the text is all CJK (so the phrase lines up with the lines around it), .1 for Latin |
| `highlighter` | (markup) | Keeps the element's own inline markup: a `<span class="num">` in the phrase keeps its face. Class selectors still match; child selectors written against the original parent (`p > .num`) do not, because the copy sits inside `.tfx-stage`. Passing `text` drops the markup |
| `select-box` | `target` | Default: the last word of multi-word text, else the whole string ("52,470" selects all of it). A CJK phrase has no spaces, so pass `target` to select one word of it |
| `select-box` | `labelFont` | The size label's family. Default: the effect's own family |
| `split-flap` | `still` | `'same+punct'` (default): a cell whose character does not change, or punctuation/space turning into punctuation/space, stays still ("NT$1,500" → "NT$3,500" flaps one cell). `false`: every cell flaps |
| `typewriter` | `caret` | `'typing'` (default): shown only while a line is deleted or typed, hidden at rest. `true`: also blinks with `t` between lines and at rest. `false`: never |
| `typewriter` | (one string) | A single string types in from empty as `p` goes 0 → 1. For an array, the first text shows at `p = 0`; start the array with `''` to type it in |
| `slot-roll` | `cell` (em) | Height of a reel window and of each step of the roll (default 1.2). Change it here, not in CSS: CSS that narrows the windows leaves the roll stepping 1.2em and blanks the letters |
| `odometer` | `zeros` | `true` (default) dims leading zeros; `false` drops them, and their separators, until their digit rolls in |
| `odometer` | `value`, `fx.value` | Shows that number and ignores `p`: `fx.value = 52470`, or tween `fx.value` to roll. `null` hands back to `p`. Digit columns come from the last text, which sets the format |
| `odometer` | `clip` | `[top, bottom]` em trimmed off each 1.1em digit window. Default: measured from the face's digit ink plus .03em, so mid-roll the neighbouring digit never shows in the leading or hangs into the next line. `false` keeps the full window |
| `slit-scan` | `bleed` (em) | How far the outer slits open past the line box (default .08): enough for ascenders and descenders, so the roll stays inside its own line |

## The catalogue

| # | id | 中文 | Kind | The beat it serves | Lazy case |
|---|---|---|---|---|---|
| **衝擊 Impact** | | | | *one word changes the atmosphere* | |
| 01 | `burst` | 文字爆發 | E | The climax word, detonated after a build | Every headline exploding; a burst with no build-up |
| 02 | `char-swap` ▣ | 逐字切換 | S | Lyrics, a beat: characters swap hard and the colour card cuts with them | Swapping off the beat; crossfades instead of cuts |
| 03 | `stamp` | 印章效果 | E | A decision made: approved, sold out, launched | Stamping what was never in doubt; two stamps on a page |
| 04 | `impact-zoom` | 衝擊縮放 | E | The opening title rushing in from far, echoes ringing | Echoes so strong the word stops reading |
| 05 | `stack` | 動態堆疊 | E | MV or opening card: lines fly in and lock into one block | Stacking a sentence meant to be read as one line |
| 06 | `stretch` | 彈性拉伸 | E | A playful brand: characters spring off the baseline | Anything heavy, precise or expensive |
| 07 | `fly-through` ▣ | 穿越文字 | S | A transition with speed: dive into a letter, it becomes the next scene | Every scene change; thin type (the window never opens) |
| 08 | `squeeze` | 擠壓變形 | S | Elastic switch between short word groups | Long phrases; serious subjects |
| **流動 Flow** | | | | *text keeps moving* | |
| 09 | `giant-marquee` ▣ | 巨字橫移 | C | A title ground: a word too big for the frame drifts, a ticker under it | The giant word as the hero's only content |
| 10 | `vertical-counter` ▣ | 直排逆向 | C | Quiet vertical CJK: columns pass in opposite directions | Latin set sideways for decoration |
| 11 | `wave-grid` ▣ | 波浪排列 | C | Texture made of the word itself, for a section without an image | Behind reading copy |
| 12 | `diagonal-bands` ▣ | 斜向字帶 | C | A loud section break: tilted bands cross and run | Leaving the bands up under content |
| 13 | `wave-ribbon` ▣ | 波浪緞帶 | C | Decor with a pulse: a ribbon of words rides a sine curve | Text someone must read in full |
| 14 | `multi-marquee` ▣ | 多層跑馬燈 | C | Announcements, news, a live feeling | Real news that has to be read (it scrolls away) |
| 15 | `vertical-parallax` ▣ | 直排視差 | C | Depth from type alone: near columns big and fast, far ones faint | Columns all one size (no depth reads) |
| 16 | `crossed-tape` ▣ | 交叉膠帶 | C | Warning, street energy, "under construction" | A calm brand; tape over a form or a price |
| **立體 3D** | | | | *walk into the space of text* | |
| 17 | `tunnel` ▣ | 文字隧道 | C | Opening pull: the word stands solid in front, outline copies step back, each smaller, to a vanishing point | A tunnel behind content for a whole page |
| 18 | `corridor` ▣ | 文字走廊 | C | Immersion: travel down a corridor whose walls are written | Words that matter on the walls (they rush past unread) |
| 19 | `cylinder` ▣ | 旋轉圓柱 | C | A name as an object, wrapped round a turning drum | Long phrases (only the front third reads) |
| 20 | `vortex` ▣ | 文字漩渦 | C | A dreamlike climax or a fall: layers twist out from the word | A loading spinner; a calm product |
| 21 | `ring-tunnel` ▣ | 圓環隧道 | C | Sci-fi opening, a signal: rings of characters arrive out of the dark | Rings of a sentence (reads as noise) |
| 22 | `orbit` ▣ | 軌道環繞 | C | Logo with a satellite line: characters circle the name, near big, far small | Orbiting filler; orbiting the CTA |
| 23 | `cube-flip` | 翻轉方塊 | S | A switch with mass: the word is a block face that tips to the next | Flipping on every scroll tick |
| 24 | `extrude` | 立體厚度 | E | A title that must feel like an object: it rises and gains thickness | Extruding more than one line; rainbow sides |
| **切換 Switch** | | | | *make the change interesting* | |
| 25 | `split-flap` | 翻頁看板 | S | Departures, schedules, a retro reveal, left to right | Long text; a modern brand with no reason to be mechanical |
| 26 | `card-flip` | 字卡翻轉 | S | An announcement turning over, card by card | Flipping with no new message on the back |
| 27 | `typewriter` | 打字效果 | S | Story and subtitles: typed, considered, deleted, retyped | Typing a headline nobody waits for; machine-even rhythm |
| 28 | `slot-roll` | 滾輪文字 | S | A result reveal: reels stop one by one on the answer | Revealing what was never uncertain |
| 29 | `odometer` | 數字計數 | S | Proof: a real number rolls up and stops on its exact value | Invented or rounded numbers; counting every number |
| 30 | `headline-swap` | 標題切換 | S | News and explainers: a colour bar wipes, the headline under it changes | A bar wipe on every heading |
| 31 | `led-matrix` ▣ | LED 點陣 | C | A gate, a train, an arcade, a status board | Long messages; complex CJK at too few rows |
| 32 | `split-reveal` | 上下分離 | S | A surprise: the word cracks open to show the next inside | Revealing something duller than what was split |
| **風格 Style** | | | | *raise the texture* | |
| 33 | `outline-fill` ▣ | 描邊填色 | C | Poster or MV texture: rows of outlines colour in, in sequence | Random fill order (the sequence is the effect) |
| 34 | `glitch` | 故障錯位 | E | Broken signal that locks clean: tech, tension, MV | Permanent glitching; glitching body copy |
| 35 | `pattern-mask` | 圖案遮罩 | C | Fun and festival: stripes run inside the letters, on a sticker shadow | Serious subjects; stripes busier than the letterforms |
| 36 | `long-shadow` | 長影效果 | C | A flat, graphic title whose shadow turns like the sun | Translucent shadows (they band) |
| 37 | `liquid-fill` ▣ | 液體填滿 | E | Fun, or a goal really being met: liquid rises in the outlines | A fake progress bar |
| 38 | `highlighter` | 螢光標記 | E | Emphasis inside reading copy: a marker drawn behind one phrase | Three highlights per screen; animating the words themselves |
| 39 | `split-invert` ▣ | 雙色反轉 | S | A title or switch with graphic snap: a diagonal crosses and inverts | Colours weak in either direction |
| 40 | `motion-trail` ▣ | 殘影軌跡 | C | Drift: the word floats and drags a wake of afterimages | Trails on fast UI text |
| **得獎 Award** | | | | *restraint, from Site-of-the-Month winners* | |
| 41 | `slit-scan` | 片幅捲動 | S | A film-minded title or chapter card: slits roll like a reel and lock into one line | Rolling body copy; random slips that read as a glitch |
| 42 | `read-fill` | 閱讀填色 | E | A statement or quote lit word by word in reading order as the scroll reads it | Starting from invisible; a hard tick per word |
| 43 | `blur-resolve` | 失焦對焦 | E | A calm title coming into focus, word after word (`out: true` blurs the block away) | A long paragraph blurred word by word |
| 44 | `select-box` | 選取框 | E | A design-tool selection frame draws round the key word, which changes colour | More than one selection per screen; a fake size label |

`EFFECTS[id]` carries the same metadata (`use`, `mood`, `avoid`) for tools and treatments. Options for
each effect are listed as a comment above it in `type-fx.js`.

### Moves to build by hand (seen on CSSDA winners, not in the library)

- **Path roll** — trailing letters ride the lead's curve (Lightweight's titles on the wheel's arc): SVG
  `textPath` with `startOffset` driven by `p`.
- **Scroll-typed input** — a real search field typed in step with the scroll (Poly): set `value` from `p`
  through a typewriter mapping; the field stays a real, editable input.
- **Drop physics** — the thesis line falls loose with the layout's shapes at the end (Grids): precompute
  the fall deterministically (seeded), never a live physics loop in a screened frame.

### The award family

The first forty are loud on purpose: they perform. The four award moves are the opposite. They come
from Awwwards Site-of-the-Month winners and are chosen for reading-heavy, restrained films, where the
words stay present and legible almost the whole time and the motion only changes how they are lit,
focused or pointed at.

| id | Seen on | What to keep |
|---|---|---|
| `slit-scan` | Siena Film Foundation | Clip-path slits of duplicated copies, never a filter. The slits lock into one solid line at rest |
| `read-fill` | Terminal Industries, Son Daven | The copy is fully readable at `p = 0` (dim, about 0.2). A soft front of 2–4 units, so it reads as lit, not ticked |
| `blur-resolve` | Belgrade Arbor | Deterministic blur (11px by default) with a little tracking, resolving word by word; `out` blurs the whole block away |
| `select-box` | Dropbox Brand | A 1px accent frame, four square handles and a real size label, round one word only (`target`) |

`read-fill` is the one effect allowed on running text, because the text never moves and is readable
from the first frame — and only on a statement paragraph or a quote, never on body copy, prices,
specifications or forms. The rule below on reading copy still holds for everything else.

## Rules

**State-bound effects are not entrances.** When `p` shows a state the visitor chose (ACTIVE/FROZEN on a
`card-flip`, an `odometer` bound to a slider, a level on `cube-flip`), reduced motion must show *that*
state, not the rest pose: create it with `{ reduced: false }` and, under reduced motion, set `p` instantly
instead of tweening. Bind an odometer to a number with `fx.value = n` (it ignores `p` and shows `n` in
reduced motion too). Typewriter and read-fill stages do not wrap by default; give the
stage `white-space: normal` for running lines.

**Key `p: 0` from the start of the clip.** On a plain object, a tween keyed mid-clip leaves the effect at
its last rendered value before the key — often the rest pose — so a title shows early. `main.set(fx, { p: 0 }, 0)`
then `main.to(fx, { p: 1, duration: 0.3 }, 0.4)`, or `fromTo` placed at 0.

**Choose by the beat, not by habit.** Name the beat first (a verdict, a number proven, a door opening,
a mood held), then pick the move that performs it. A film has **one signature type move**, repeated
deliberately: at the opening, again at the turn, resolved at the end. Around it, cast a small **type
department** — usually three to five more moves, each with one job and its own trigger: a switch on a
click (a headline that changes when a tab is chosen: `slot-roll`, `split-flap`, `cube-flip`), a counter
that runs when a real number comes into view (`odometer`), a continuous loop as set dressing (a marquee,
`vertical-parallax`), a hover or focus answer (`select-box`, `highlighter`), a reading move on a statement
(`read-fill`). Write the cast in the treatment as a table: effect · job · trigger · where. Forty-four
effects on one page is the gallery, not a film; a page whose only type motion is a mask-rise has no type
department at all.

**Entrances land as the camera settles.** Key `p` in the first third of `main`, after the move has
arrived, and keep it short: 0.2–0.4 of the clip on a site, one or two beats in a film. Then hold. A
word still arriving while the camera moves is two motions competing for one eye.

**Exit before the cut.** Take the word out in `exit`, or let the frame cut it. Never leave a word
half-arrived across a scene boundary.

**Continuous type is set dressing.** Marquees, tunnels, grids and bands are ground and atmosphere. They
are not the lead's only performance, unless the medium of the film *is* type. Behind reading copy they
run slowly or not at all. Stop feeding `t` while their scene is off stage (`reel.phase(name)`).

**Reading copy never animates per character.** Body text, prices, specifications and forms enter as
lines, from behind a mask, or not at all. In copy, the only moves allowed are the ones that leave the
words still: `highlighter`, `read-fill`, a line mask. Per-character effects are for titles of 2–14 CJK characters or
a few Latin words.

**Numbers are real.** `odometer` and `slot-roll` stop on the exact value from the brief, once. If the
figure is a placeholder, the scene is a placeholder.

**The rest pose is the frame.** `p = 1` is the composed, legible state. It is what reduced motion
shows (continuous effects freeze at a chosen `t`), what a screenshot at rest shows, and what the page
must look like if motion never runs. Screen it: `type-fx.html?fx=stamp&p=1` renders any state full
frame. In film mode there is no reduced cut, so pass `{ reduced: false }`.

**Repetition is decoration's job, not the lead's.** Duplicates (marquee copies, ghosts, tunnel layers)
are `aria-hidden`. The real string is read once. Never put a link or a control inside an effect.

## CJK notes

- **Vertical setting is native.** `vertical-counter`, `vertical-parallax` and any vertical title use
  `writing-mode: vertical-rl`. Latin inside a vertical run turns sideways. Use it on purpose, or set
  short numbers upright (`text-combine-upright: all`).
- **No letter-spacing on CJK body.** Display tracking 0 to +0.05em at most; negative tracking makes
  Han strokes collide. The effects never add negative tracking. Do not add it around them.
- **Weight.** The effects default to 900 (Noto Sans TC / PingFang TC / Microsoft JhengHei fallbacks),
  unless the page sets `typeFx.defaults({ font: 'inherit', weight: 'inherit' })`.
  Dense characters (黎, 體, 鬱) lose their counters at small sizes and on dot matrices. Use 700, more LED
  rows (24+), or a simpler word.
- **Split by character, keep the phrase.** CJK splits per character. Choose words whose characters
  still read as a phrase while they arrive one by one: 黎明之前, not a clause with particles.
- **Punctuation.** Full-width marks (・，。「」) take a full cell in a split. Keep them out of split-flap
  and slot reels, or give them a cell on purpose. In vertical runs, punctuation changes form and
  position; check it in a frame.
- **Fonts load in slices.** Google Fonts serves CJK in `unicode-range` pieces. Await
  `document.fonts.load('900 1em "Noto Sans TC"', text)` for the words in the effects before screening.
  The canvas effects (LED, fly-through) re-measure when fonts finish loading.

## Performance

Transforms, opacity and clip-path only. One render per `p` / `t` set: nothing runs between frames, so
an off-screen effect costs nothing. DOM is capped (the wave grid holds at most 400 cells). Text
shadows (`extrude`, `long-shadow`) and the stamp's SVG ink filter are the expensive ones; keep one of
each per frame. The LED board is canvas-2D. On the GPU rasteriser, two renders of the same state can
differ by ±1 in a few channels where the stamp's SVG filter is involved; the effect's state is
identical, and the software rasteriser is exact.
