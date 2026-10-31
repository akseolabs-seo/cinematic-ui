# App mode — the film the crew works inside

Dashboards, back offices, admin panels, consoles, internal tools, the logged-in side of a SaaS product. The
audience is not a visitor who watches once. It is a crew that comes back every day, often for a whole shift,
and does the same few jobs hundreds of times. Here the playhead is not the scrollbar: **it is the task**. A
view is a shot, moving between views is a cut, and the record the crew is working on is the lead.

The director still decides what the eye sees, from where, in what light, and what is left dark. What changes
is the budget. **Cinema gets about a tenth of the frame; the rest is a quiet instrument.** The tenth is
spent where it pays: the one signature view only this product could have, the light that tells the crew
where to look, the continuity that keeps their place, and the rare moments that happen once a day.

Read this file instead of the site-mode stages it replaces (marked below), and alongside the ones that hold.

## Why the site-mode reflex fails here

Three blind tests (a SaaS analytics office, a shop's order back office, an on-call console) built with
site mode alone showed the same failures, and they are what this file corrects:

- **Every director produced the same app.** Roy Andersson, Jim Jarmusch and Lars von Trier all collapsed
  into one look: a muted ground, one accent, 1 px rules, a boxed panel grid, and a row of four equal KPI
  cells across the top. The film reached the palette and one motif (a tide gauge, a bowl glyph); it did not
  reach the structure. The one view that felt directed — a fleet drawn as a town plan from *Dogville* —
  came from the film reaching the *layout of the data*.
- **Site rules misfired.** Display-size extremes, loader-as-shot-one, the award pass, the scroll-scrubbed
  type cast and the phone cut were satisfied on paper or skipped.
- **The kit was unusable.** Nobody used `reel.js`; each tester wrote its own router, key map, row
  navigation, drawer and screenshot script. Nobody screened empty, loading, error or permission states.
- **One accent could not carry status.** Each tester improvised hatching and glyphs to encode four or five
  states under a rule written for marketing pages.
- **Film costume leaked into tool chrome.** Narrator captions, chapter numerals, a gauge drawn down the
  sidebar edge: borrowed decoration where a mechanism was needed.

## What carries over, what changes

| Site mode | App mode |
|---|---|
| Playhead: scroll | Playhead: the task. Routes, selection, filters, the record's state |
| Scene | View: overview, queue, list, record, editor, settings |
| Shot size by section | Shot size by job: wide = overview, medium = list or queue, close = one record, insert = one field or one event |
| Cut by scroll | Cut by navigation: the transition preserves where the crew was |
| Lead with five to seven states across the page | Lead = the product's core record (an order, an incident, an account); its states are the domain's real lifecycle, and the same mark carries them everywhere the record appears |
| Loader as the opening shot | No loader. First paint is readable; data loads inside its own frame |
| Display extreme | Working size 13–14 px; one display size at most, for the one number a view exists to show |
| One accent, spent rarely | One accent with one meaning ("a human must act here"), plus a separate status system |
| Type cast from `type-fx.js` | Usually none. A type performance is allowed only on a once-per-day moment |
| The audience's part: one meaningful interaction | The crew's verbs, all of them, by keyboard: approve, refund, acknowledge, assign, resolve |
| `reel.js`, `site-dom.html` | `kit/app.js`, `kit/fixtures.js`, `kit/app-shell.html` |
| `screening.mjs` | `scripts/app-screening.mjs`: routes × states × viewports × themes |

## The production, stage by stage

### 1. Development — the shift, not the visit (replaces the logline and audience arc)
Write **the shift**: who works in it, for how long, on what screen, what interrupts them, and what the
worst minute looks like (an incident at 03:00, a cut-off at 16:55, month-end close). List **the three
most frequent jobs** and **the one rare, high-stakes job** (a refund over the limit, a SEV1, a plan
downgrade). The logline becomes: *during [the shift], [the crew] needs to [job] without [the thing that
goes wrong]*. Every view exists to serve a job on that list; a view that serves none is cut.

### 2. Cast the director — by the work's dramatic problem
The dramatic problem of a tool is the work itself: triage under pressure, exactness, a queue that must
keep moving, drift that must be noticed early, a decision that must be defensible later. Cast by that.
Research stays proportionate: one sequence, the mechanisms, frames looked at. Then the test that matters
here: **delete the palette and the fonts — is the film still there?** If the film survives only as colour,
it never reached the app. A mechanism must change *how the data is laid out or how the crew moves*: a
staged plan of the fleet, a day drawn as the pickup timeline, a ledger that reads like a shooting script.

### 3. The medium and the grade — built for eight hours
The medium is almost always designed: DOM, SVG, canvas for heavy charts. Photographs and 3D appear only
where the product's data is visual (a product catalogue, a floor, a map). The grade is cast as in site
mode (`references/grades.md`), and then **tuned for the shift**:
- Ground and ink come from the cast film; body text keeps 7:1 on its ground, secondary text 4.5:1, and
  the grade never applies a filter to text, tables or controls.
- Ship both themes unless the shift decides (a second-monitor night console may be dark only; say why).
  Both come from the same measurement: lightness levels in a perceptual space (OKLCH or CIELAB), so level
  N has the same contrast in every hue.
- Grain, halation, vignette, leaks: none on working surfaces. They may appear on a once-per-day moment.
- **No stills to measure?** Then the grade is built from what the sources say in words (a palette named in
  an interview, "black and white", "one colour event") plus the shift's contrast targets, every value tagged
  [I], and stills are asked for in the asset call. Inference never lands on the uncast app grade below: if
  the words point near it, push to the film's most specific colour (the wall, the uniform, the one event)
  rather than its average. A black-and-white film with one colour event is a legitimate neutral-plus-one
  grade when that event is sourced.
- **The uncast app grade** is a muted olive, putty or sage ground with an amber or mustard accent: in tests it
  came out for four directors out of six. A neutral grey with one accent is the second default. Either is
  allowed only when the cast film's measured frames put it there; otherwise it is the kit's look, not the film's.

### 4. The lead and the asset call
The lead is the core record. Write its **lifecycle** from the domain (paid → packing → packed → shipped →
delivered, held, refunded; triggered → acknowledged → mitigated → resolved) and design **one mark** that
carries every state: in the row, the record header, the timeline, the palette results, the notification.
The crew should be able to read a record's state from the mark alone, at 12 px, in both themes.
The asset call here is mostly **data**: the real field names, real volumes (how many rows on a busy day),
the real ugly values (the 60-character company name, the refund of 0.01, the customer with no email),
screenshots of the tool they use now, and their brand's mark. Ask once.

### 5. Screenplay — microcopy
Write every label, column header, unit, empty-state line (one per cause), error line (what happened, what
to do, the request id), confirmation and undo message. Product words only: no film words in the interface,
no narrator captions, no chapter numerals unless the domain already counts in chapters.

### 6. Storyboard — the coverage plan (replaces the award pass and scroll shot list)
One row per view:

| Field | What to write |
|---|---|
| Job | Which job from the shift it serves |
| Shot size | Wide / medium / close / insert, and why |
| The lit region | The one thing on this view that gets light (below) |
| Density | Rows on screen at 1440 × 900 and 1280 × 800; row height |
| In and out | Where the crew arrives from, where they go next, what stays in place across the cut |
| States | Which of the eight states (below) this view shows and how |
| Keys | Every verb on this view and its key |
| Phone | Served, reduced to triage, or not served (and why) |

Then name **the signature set**: the one view only this product could have, built from its own model
rather than from cards — a fleet as a plan, a shift as a pickup timeline, a month as a close checklist
that fills in, an account as its contract history. It takes the place where a template puts its KPI row.
Most other views should look plain beside it. That contrast is the direction.

### 7. Animatic
Start from `kit/app-shell.html`: router, keyboard, row navigation, peek drawer, palette, toasts and all
eight states already wired, in grey (`?state=loading|empty|filtered|done|error|denied|huge` forces one;
views read `ctx.state`). Keep the wiring, replace everything visible. Fill it with
`kit/fixtures.js` data before any styling: layout decided on tidy fake data breaks on real data.

### 8. Principal photography
Order within a view: data → structure → light → type → material → motion. Never style an empty table.

### 9. Screening
`node scripts/app-screening.mjs <dir> --routes "#/,#/orders,#/orders/K-48067"` shoots every route in every
state, at 1440 × 900, 1280 × 800 and a phone, in both themes, and flags proportional digits in numeric
columns, left-aligned numbers, clipped text, layout shift between loading and loaded, low contrast, small
targets, hidden focus and blank states. Pass `--theme light,dark` for both themes, `--theme dark` for a
dark-only console (the default is light). Read each route's contact sheet as an image; it is for sequence,
and judging craft needs the full-size frames. Then open at full
size: the signature set, the densest list, a record opened from the list (with the list still visible), the
worst minute (the error or incident state), and the dark theme.
The **test screening** is a task test: a fresh agent sees only the screenshots and is asked three jobs from
the shift ("which orders must leave before 14:00?", "who is on this incident?", "why is this account at
risk?"). Each answer must be findable in one look. Compare with the coverage plan; reshoot what failed.

### 10. Delivery
As in site mode, plus: which states and themes were screened, which jobs were task-tested, and the phone
decision. The filmography line records the signature set and the lead's mark in the *form* and *lead*
fields, so the next app is cast away from them.

## The lighting plan — attention

A dense screen is lit like a night scene: most of it in shadow, one source the eye goes to.
- **Chrome is spent last.** Navigation, toolbars, dividers and headers take the lowest contrast the shift
  can read. Fewer borders: space and alignment separate before lines do. Not every region is a boxed panel.
- **One lit region per view.** The thing that needs the crew: the overdue queue, the failing service, the
  failed invoice. It gets the accent, the highest contrast and the most space. Everything else is
  readable but dim.
- **Headline before trend.** A chart answers one question; the answer (the value) sits above it in words
  and numbers, so it is read before the line is.
- **Light follows state.** When nothing needs the crew, nothing is lit. A calm screen is the reward for a
  cleared queue, and it should look like one.

## Coverage and continuity

- Wide, medium and close are the overview, the list and the record. **Default to keeping context**: open a
  record in a side panel or peek beside its list; use a full page only for start-to-finish work or wide
  content. The list keeps its scroll position, selection and filters when the panel closes.
- **The cut preserves place.** Filters, sort, selection and the open record live in the URL, so back,
  reload and a pasted link return the crew to the same frame. Focus lands on the new view's heading.
- **Match on the record.** The lead's mark, name and id sit in the same position and size in the row and the
  panel header, so the eye does not search after a cut.
- One view anatomy, learned once: navigation, a header for filters and display, the main content, an
  optional side panel. The signature set may break it; nothing else should.
- **The record page** (start-to-finish work: an incident, an order being refunded, an account review) is a
  close-up with a reverse shot: the record's own story on the left (its state, its timeline, its evidence:
  metrics, items, logs), the people and the related records on the right, the verbs at the top right in
  the order they happen. Back returns to the list exactly as it was.

## Density and type

- Working text 13–14 px, labels 11–12 px, line-height tight but not cramped. One display size per view at
  most, for the number the view exists to show.
- **Numbers are set for comparison:** tabular figures (`font-variant-numeric: tabular-nums`, or a mono
  face), right-aligned in columns, the same decimals down a column, units in the header rather than every
  cell. Negative values carry a sign, not only a colour.
- Row height by the shift: about 32 px compact, 40 px comfortable; offer both when shifts differ. A 1440 ×
  900 list shows 18–25 rows, not 8. Sticky column headers — and never inside an `overflow: auto` wrapper, which
  becomes the sticky container and lets the header ride over rows; let the page scroll, or give the wrapper
  its own height. Truncate with an ellipsis and the full value on
  hover and focus, never by clipping.
- Sparklines are word-sized, without axes, beside the value they explain.
- **Charts:** one question each, answered in a sentence above the chart. Label lines directly at their ends
  instead of a legend; two or three quiet reference lines, not a grid; the y axis starts at zero for bars and
  where the data lives for lines; events (a deploy, a price change, the incident's open and acknowledge) are
  marks on the time axis, and their labels never collide (stack them, offset them, or move them to a
  list beside the chart); charts that are compared share an axis and a height. One series in ink, the
  comparison in a dim tone, the accent only on the point that needs a person.
- **Data marks are not controls.** A field of hundreds of small cells is a picture of the data; its records
  are reached through the list beside it, and only real controls need the 24 px target.

## Colour — the accent and the status system

Two systems, kept apart:
- **The accent** keeps site mode's rule of one meaning, and in an app that meaning is *a human must act
  here*. It never decorates, and the primary button is not the accent unless pressing it is that act. It
  marks the **exception within a view**: in a to-pack queue every row needs a person, so the accent goes
  to the late ones, not to all of them. If more than about a fifth of a list is accented, it means nothing.
- **Status** (ok, warn, fail, info, neutral) is its own low-chroma scale, at the same lightness levels in
  both themes, and **always paired with shape and text**: a filled or hollow mark, a glyph, the word.
  Severity is told apart by form first and colour second. Domain conventions win where the crew expects
  them (finance red/green, aviation amber), desaturated and paired with a sign.
- The film's grade reaches the ground, the ink, the chrome, the selection colour, the focus ring and the
  scrollbars. It does not reach the data's meaning.

## Motion by frequency

**The more often it is used, the less it moves.** Anything used dozens of times a day — menus, the palette,
row focus, tab switches, opening a panel from the keyboard — is instant or under 120 ms. UI motion stays
under about 250 ms and moves only transform and opacity. Live data updates in place without a flash;
a changed value may mark itself once. Spinners wait 200–300 ms before appearing, so fast loads never flash.
What may perform: the once-per-day moments the treatment names (the first run, a cleared queue, month-end
closed, an incident resolved). One or two, cast like a site's set piece, and never in the way of the next job.

## The eight states

Every view is designed, and screened, in each state it can reach:

| State | Rule |
|---|---|
| Default | Real volume, real ugly values |
| Loading | Skeletons sized like the final content; the shell and navigation never disappear; no layout shift when data lands. Fixed regions (headers, charts, summary strips, the signature set) reserve their exact height; a region whose length depends on the record (line items, a timeline) reserves its first screen and grows downward only. Put `data-region` on the fixed ones and `data-region data-region-grow` on the growing ones; build skeletons by rendering the real layout with its text swapped for blocks, not as a separate drawing |
| Empty — not yet | Says what will appear here and the one action that creates it |
| Empty — filtered to zero | Says which filters caused it and offers to clear them; never a create button |
| Empty — all done | A cleared queue. Calm, short, earned |
| Error | What happened, what to try, a copyable request id; inside the region that failed, not the whole page |
| No permission | Who can grant it; inline if a section, full view only if the route is blocked |
| Huge | Ten thousand rows, a 60-character name, seven-figure values: counts stay true, columns hold, nothing overflows |

A record page reaches default, loading, error, denied and huge (the longest record), plus *not found*;
filtered and done belong to lists and queues. Declare what a view reaches with `data-states="default,loading,error,denied,huge"`
on its root, and the screening script stops expecting the rest.

Add **stale / live** for anything real-time: when the data was last true, and what happens while
disconnected.

## Data casting

Fake data is a stand-in actor; cast it like one. Real distributions are skewed and noisy: a few customers
carry most of the revenue, latency has a long tail, orders cluster at lunch and on Mondays, a chart has a
bad week. `kit/fixtures.js` generates seeded long-tailed values, noisy series with events, mixed-locale
names and edge rows. A chart whose twelve bars are all the same height, or a table of five tidy rows, hides
every layout decision that matters. **The numbers reconcile**: line items add up to the subtotal, the
bridge from opening to closing MRR closes, counts in a badge match the list behind it — a crew checks
these, and so does a client in a demo. `edge()` test strings (a URL as a company name, emoji, 10^7 values)
belong to the `huge` state; the default state shows only the ugliness the domain really has. Pin the clock
(`?now=`) and the seed (`?seed=`) in every screenshot script — the screening script defaults to seed 7 and
2026-10-22T13:12Z — so two runs never differ by accident.

## Keyboard, focus, accessibility

- Every verb has a key, and **the key is learned through the mouse**: shown beside the action in menus,
  buttons and the palette (`data-key` + `kbdHints()`). A command palette (`mod+k`) reaches every action
  and record. `?` lists every shortcut.
- Lists move with j/k or arrows, select with x, open with Enter; Escape closes and returns focus to where
  it came from. Shortcuts never fire while typing.
- Destructive actions prefer **undo** over a confirm dialog; confirm only what cannot be undone (money
  leaving, a message sent to a customer) and say exactly what will happen.
- **Bulk actions** report partial success in words ("12 marked packed, 2 skipped: on hold"), with the skipped
  ones left selected. Selection lives in the URL and survives paging and filtering; the bar says how many are
  selected that are off screen.
- Focus is always visible on every ground; status never relies on colour alone; tables use real table
  markup or the grid role with headers.

## The phone

Decide it per product and write it in the coverage plan. Most back offices serve the phone a reduced cut:
the queue, one record, the two verbs that matter away from a desk (approve, acknowledge). A dense table is
never squeezed into a column; it becomes a list of records showing the fields the job needs. A
second-monitor console may not serve phones at all; say so in the delivery report. The signature set gets
its own phone composition (one gate, one street of the plan, the current month) or the reduced cut opens on
the queue instead; it is never shrunk.

## What does not apply

`reel.js` and pinned scenes, the loader, the award pass, display extremes, scroll triggers, scroll-scrubbed
type, the theatrical/accessible double cut (an app has one cut, and it is accessible), and the site lazy-cut
entries written for heroes. In the treatment, keep the GRADE and ART blocks (the ART block's UI map is the
app's chrome); drop the POSTER line except for the sign-in screen and the empty first run. Site mode's director's rules 1–8, 10, 11 and 13 hold; rule 9 becomes *the
crew's verbs*; rule 12 becomes *every state is designed*.

## The lazy cut — apps

Refuse these. Each was seen in tests or is common in admin templates:

- A row of four equal KPI cards across the top, each with a big number and an arrow badge, whatever the
  view's question
- Every region a boxed panel of equal weight, radius, border and padding; a card mosaic standing in for a structure
- The cast film present only as palette, fonts and one motif; delete the colours and it is any dashboard
- Film costume in the chrome: narrator captions, chapter numerals, a gauge drawn down the sidebar, a
  title-card font on table headers
- A loud sidebar: coloured icons and badges on every item, as bright as the content
- Brand colour or gradient on every button, active tab, chart fill and badge
- A rainbow chart with a legend box, gridlines, a donut of five slices; gauges and dials
- Proportional digits, left-aligned numbers, mixed decimals in numeric columns
- Status as a different pill hue per state, colour only
- Fade-up or hover-scale on every card; anything used fifty times a day that animates
- A full-page spinner that replaces the navigation, then a layout jump when data lands
- One empty state for every cause: an illustration, "Get started", a create button even when a filter emptied it
- Every click a full page change; the list forgotten when a record opens
- Filters in a modal with Apply; filter state lost on reload
- A search box with no command palette, and shortcuts shown nowhere
- Big radius and padding so eight rows fit where twenty-five should
- Uniform fake data: equal bars, five tidy rows, no long names, no nulls
- Test strings in the default state: a URL as a company name, emoji in a customer's name, totals that do not add up
- The accent on every row of a queue, so the late ones look like the rest
- A table squeezed onto a phone: five truncated columns instead of a list of records
- The uncast app grade: olive or putty ground, amber or mustard accent, chosen by nobody
- A greeting and an illustration at the top of a working view
