# Casting the director

A director is a set of habits about where the camera stands, how long a shot lasts, what the light
hides, and how a cut lands. You are hiring those habits for a product. This file is a casting book, not
a style menu: it tells you what each director *does* and what that becomes on a page.

## How to cast

1. **Name the dramatic problem.** What must the audience feel that they do not feel on arrival?
   Trust, awe, desire, calm, urgency, delight, belonging, clarity. Cast for that, not for the industry.
2. **Write down the three obvious picks and set them aside.** Tech → Villeneuve, Nolan, Kubrick.
   Lifestyle → Wes Anderson, Sofia Coppola. Night / fashion → Wong Kar-wai, Refn. They are obvious
   because every model reaches for them; a site cast this way looks like every other. Keep one only if
   you can name a mechanism of theirs that solves *this* product's problem better than anyone else's.
3. **Cast against type when it serves.** An accounting tool shot by Jacques Tati. A funeral home by Ozu.
   A developer API by Saul Bass. Contrast between subject and treatment is where memorable work lives —
   as long as the treatment makes the product clearer, not stranger.
4. **One director, one film.** The film narrows the director to a specific period, palette and rhythm.
   You may borrow one department from someone else ("titles by Saul Bass", "night photography by
   Michael Mann") and say so. A blend of three directors is a mood board, not a point of view.
5. **Extract five to seven mechanisms.** One line each: the observable habit → what it is on this site.
   Cover at least camera, light / colour, editing, and one of staging / type / sound.
6. **Note what the film is made of.** Stock and format, colour or monochrome, drawn or shot, studio or
   location. It decides the site's medium (`looks.md`) — and it is not the same as the director's genre:
   Miyazaki does not mean "anime style", it means painted depth, weather and stillness.
7. **Hold a casting session and cast away from your last productions.** Write three candidates into
   the treatment, three lines each: the mechanism that solves the dramatic problem, a signature shot,
   the risk, what it would be wrong for. Keep one; record why the other two were set aside. Read the
   filmography (`~/.cinematic-ui/filmography.md`) and, when product fit is comparable, take the candidate
   furthest from recent work. A new director's name on the same medium, grid and typeface is the same
   site — and "always the unexpected director" is a habit too: breaking the category expectation the
   same way twice is a house style. Test the winner: *could a competitor use this direction unchanged?*
8. **If research tools are available, look.** Confirm the film's cinematographer, aspect ratio, lenses,
   palette and signature sequences from sources. Do not invent specifics; a mechanism you are unsure of
   is better described plainly ("slow lateral tracking shots") than credited falsely.

The user's choice of director or film always wins. Your job is then the same: mechanisms, not costume.

## The casting book

These entries are a starting shelf, not the limit. Any director and film can be cast, researched live
(`film-research.md`). Mechanisms are what the filmmaker is known for. Builds refer to `film-grammar.md`. "Refuse" is the lazy
version that will occur to you first.

### When the product needs authority, precision, control

**Stanley Kubrick** — *2001, The Shining, Barry Lyndon*
One-point perspective with the subject dead centre. Slow optical zooms out from a detail to a tableau.
Steadicam gliding down corridors. Practical light only. Intertitles that announce chapters coldly.
→ Centre-axis composition for every scene; the vanishing point is the CTA or the lead. Scenes open on a
detail and *zoom* (fov, not dolly) to the whole. A corridor scroll in z. Chapters as bare title cards.
Symmetry that is slightly too perfect. Refuse: "black background + thin white type + HAL red dot".

**David Fincher** — *Zodiac, The Social Network, Se7en*
The camera moves only when the subject moves, locked to it with machine precision. Top light, faces half
in shadow. Sickly, desaturated palettes. Inserts of objects, paper, screens. Impossible moves through
keyholes and walls. → The lead stays fixed in screen space while the world tracks around it. Zero
overshoot, zero bounce; `power2.inOut` and nothing else. Macro inserts of interface details. One
impossible pass through the product. Dense, small, exact typography. Refuse: green tint and glitch.

**Jacques Tati** — *Playtime, Mon Oncle*
Enormous deep-focus wide shots where a dozen small events happen at once and the viewer chooses what to
watch. No close-ups. Modernist grids of glass and steel as a playground. Comedy from sound and timing.
→ One wide architectural frame per scene, with many small independent animations running in it —
the visitor's eye is the editor. A strict grid that people and objects gently misbehave inside.
Refuse: isometric "cute office" illustration.

**Yasujirō Ozu** — *Tokyo Story, Late Spring*
The camera sits low and does not move. Compositions are frontal and layered with door frames. Between
scenes come "pillow shots": a few seconds of an empty room, a vase, laundry on a line.
→ No camera motion at all; every change is a cut. Low horizon. Between content scenes, short silent
scenes of a single object or empty space. Direct frontal address in copy. Refuse: "Japanese minimalism"
as beige and a red circle.

**Michael Haneke / Roy Andersson** — *Caché; Songs from the Second Floor*
A fixed wide frame held past comfort. Nothing emphasised. Pale, flat, exact.
→ Long static holds where one small thing changes; unnervingly even light; a single slow reveal
doing all the work. For products whose promise is calm or honesty.

### When the product needs scale, awe, the sublime

**Denis Villeneuve** — *Arrival, Blade Runner 2049, Dune* (Deakins, Fraser, Young)
A tiny figure against something too large to fit in frame. Atmosphere as depth: fog, dust, haze turning
distance into flat tone. Silhouettes. One hue per scene. Slow, weighted push-ins.
→ The lead cropped by the viewport — you never see all of it at once until the end. Scene fog that
desaturates with depth. Small type, vast margins. A monochrome scene per act. Refuse: orange haze and
wide letter-spaced caps over a stock landscape.

**Christopher Nolan** — *Dunkirk, Interstellar, Inception*
Cross-cutting between timelines that run at different rates and converge. Aspect ratio opening to IMAX
for the big moments. Practical, physical scale. A ticking pulse underneath everything.
→ Two or three content threads advancing in alternation and meeting in one frame. Letterbox bars that
open at the climax. Layers scrolling at different speeds as different clocks. Refuse: a spinning top.

**Terrence Malick** — *The Tree of Life, Days of Heaven* (Lubezki, Almendros)
Wide lens floating close to its subjects, always drifting. Magic-hour backlight and flares. Cutaways to
water, grass, hands. Voice-over as fragments.
→ A wide-lens camera that never quite stops; warm rim light and a low sun; copy as short whispered lines
that arrive and leave; texture inserts between scenes. Refuse: lens-flare PNG on a hero photo.

**Andrei Tarkovsky** — *Stalker, Solaris, Mirror*
Very long takes; slow lateral tracking over textured ground; water, fire, wind and rain inside the frame;
shifts between sepia and colour. → One unbroken scroll with no cuts; a camera that travels sideways
across a detailed surface; simulated elements as the only motion; a grade that changes state once.
Refuse: slow fades on everything.

**Makoto Shinkai** — *Your Name, Weathering with You*
Hyper-detailed skies, light blooming off every edge, rain and reflections, small figures under vast
weather, time-lapse clouds. → A sky shader that moves through a day as you scroll; bloom on real
highlights; tiny subject low in frame. Refuse: gradient sky and sparkle particles.

### When the product needs intimacy, longing, warmth

**Wong Kar-wai** — *In the Mood for Love, Chungking Express* (Doyle, Lee Ping-bin)
Frames inside frames — doorways, mirrors, gaps — with the subject glimpsed, never fully shown.
Step-printed motion that smears. Saturated reds and greens under practical light. Repetition with
variation. Clocks. → Foreground occluders with the lead seen through slits; a motion smear tied to
scroll velocity; the same composition returning three times with one change; time shown as type.
Refuse: neon sign, a red overlay on everything (the red is practical light spilling on a dark ground), "nostalgic"
script font. Grade: `grades.md` R1.

**Sofia Coppola** — *Lost in Translation, Somewhere*
A small figure alone in a large soft space. Windows and daylight. Pastel, low contrast, shallow focus.
Long uneventful holds. → Generous empty frames, the subject off-centre and small; soft large light
sources; lifted blacks; very little motion, all of it slow. Refuse: pink and a serif.

**Hirokazu Kore-eda / Hou Hsiao-hsien** — *Still Walking; A City of Sadness*
A fixed, slightly distant camera; life moving through doorways; natural window light; nothing
underlined. → A static frame the content walks through; frames within frames as navigation; daylight
grade; quiet type. For products about family, craft, place.

**Hayao Miyazaki** — *Spirited Away, My Neighbor Totoro*
"Ma": deliberate empty beats where nothing advances — wind in grass, a held breath. Multiplane depth.
Loving detail on food and machines. Flight. → Scenes of pure ambience between the scenes that sell;
layered parallax planes; one lovingly over-detailed object. Refuse: pastel anime sky.

**Céline Sciamma** — *Portrait of a Lady on Fire*
The look itself as the subject; candle and firelight; painterly stillness; almost no score.
→ A lead that is revealed by degrees — back, profile, face; warm point light; silence and holds.

### When the product needs rhythm, energy, wit

**Edgar Wright** — *Hot Fuzz, Baby Driver, Scott Pilgrim*
Mundane actions cut as rapid percussive inserts. Whip pans and wipes hiding every transition. Objects
entering frame as punchlines. Action cut to the beat. → Process steps as three or four snap-cut
inserts instead of a list; transitions hidden in lateral whips; elements arriving on a beat with a hard
stop. Refuse: comic-book "POW" graphics.

**George Miller** — *Mad Max: Fury Road*
Centre framing so the eye never has to hunt across a fast cut. Under-cranked speed ramps. Saturated
complementary grade. → Keep the point of interest at the same screen position across every fast cut,
then you can cut as quickly as you like. Speed ramps on the lead. Refuse: dust and orange.

**Spike Jonze / Michel Gondry** — *Her; Eternal Sunshine*
In-camera invention: forced perspective, sets that transform within a single shot, handmade effects.
→ The set rebuilds itself around the lead without a cut; physical-feeling, slightly imperfect motion;
one trick that makes people ask how it was done.

**Tony Scott** — *Man on Fire, Domino*
Subtitles as kinetic typography placed in the scene. Flash frames, multiple exposures, hand-cranked
jitter. → Copy that lands inside the picture at the size and position of its emphasis; impact frames
on hits. Strong in film mode. Refuse: strobing (it is also an accessibility hazard).

**Quentin Tarantino** — *Kill Bill, Pulp Fiction*
Chapters with title cards. The low-angle POV from inside something. Split screen. Crash zooms. A needle
drop that redefines a scene. → Numbered chapters; one POV-from-inside shot; split-screen comparison;
a crash zoom onto the single boldest claim. Refuse: yellow, blood, and a serif poster font.

**Bong Joon-ho** — *Parasite, Memories of Murder*
Vertical geography that means something: up is power, down is truth. Exact blocking. Tone that turns in
one cut. → Descending the page is descending the story; levels and stairs as the layout; one smash cut
where the grade and type change at once.

### When the product needs a graphic, designed, typographic world

**Wes Anderson** — *The Grand Budapest Hotel, The French Dispatch* (Yeoman)
Planimetric frontal staging. Lateral tracking and 90° whip pans. Overhead inserts of objects laid out
by hand. Cross-sections. Chapter cards. A palette per film; aspect ratio per era.
→ Orthographic, square-on scenes; sideways camera travel; top-down knolled product inserts; a
cross-section of how it works; aspect ratio that changes by chapter. Refuse: pastel + Futura + centring
everything and calling it done.

**Saul Bass / Maurice Binder** (title designers) — *Vertigo, Anatomy of a Murder; Dr. No*
Flat cut-paper shapes, bars and spirals choreographed with type; the idea of the film in one moving
symbol. → A geometric system that *is* the lead: bars that become columns, a shape that becomes the
logo. Type and shape animated as one. Excellent for film mode and typographic sites.

**Kyle Cooper** (title designer) — *Se7en*
Scratched, hand-made, jittering type; macro inserts of process; images that never settle.
→ Tactile, imperfect letterforms; stepped frame rates; macro cutaways of making.

**Jean-Luc Godard** — *Pierrot le Fou, Breathless*
Jump cuts. Words as images: huge intertitles in primary colours. Direct address. Breaking the form.
→ Discrete jumps instead of tweens; full-frame type cards in two or three primaries; copy that talks
straight to the reader. Refuse: French flag palette.

**Hideaki Anno** — *Neon Genesis Evangelion, Shin Godzilla*
Dense Mincho title cards in L-shaped layouts. Long motionless holds. Extreme low angles of power lines
and infrastructure. Screens of data as drama. → Tight serif type set in hard blocks at the frame corners
(a native fit for CJK); stillness as tension; interface readouts as the texture of the world.

**Zhang Yimou** — *Hero, Raise the Red Lantern*
Colour as structure: each chapter one saturated hue. Masses moving as one body. Fabric and wind.
→ A colour per act, total and unmixed; thousands of instances choreographed as a single form; cloth.

**Persichetti, Ramsey, Rothman / Lord & Miller** — *Spider-Verse*
Animating on twos against a smooth camera. Halftone, misregistered colour instead of blur, drawn lines
over 3D, panels. → Stepped motion on the cast with a fluid camera; offset-print shaders; panel
layouts that the camera moves between. Refuse: comic font.

**Lars von Trier** — *Dogville*
A town drawn as chalk lines on a black stage; architecture as a labelled diagram.
→ The world as an annotated plan: outlines, labels, no walls. Striking for systems, infrastructure, SaaS.

### When the product needs a world, atmosphere, night

**Ridley Scott** — *Blade Runner, Alien* (Cronenweth, Vanlint)
Smoke and backlight. Shafts through blinds and fans. Layer upon layer of lived-in detail.
→ Haze with visible light shafts; patterned light crossing the UI; a dense, layered set behind
restrained type. Refuse: rain overlay and cyan-magenta.

**Michael Mann** — *Heat, Collateral*
The city at night on long lenses: fields of defocused lights, profiles at windows, cool blue against
sodium orange. → An instanced bokeh field as the set; profile compositions; a cold-warm split grade.

**Nicolas Winding Refn** — *Drive, Only God Forgives*
Two-colour gel lighting, symmetrical tableaux held a very long time, sudden change.
→ Hard two-colour light on the lead; long stillness; one violent cut.

**Guillermo del Toro** — *Pan's Labyrinth, The Shape of Water*
Amber against cyan. Clockwork and organic machinery. Sets with the texture of illustration.
→ A mechanical lead with visible workings; amber / teal split grade; ornate, tactile frames.

**Park Chan-wook** — *The Handmaiden, Oldboy*
Ornate symmetry, patterned walls, elaborate match cuts and transitions, a side-scrolling oner.
→ Match cuts on shape between every scene; a patterned ground; one lateral long take.

### When the product needs continuous space, a journey

**Alfonso Cuarón** — *Children of Men, Gravity, Roma* (Lubezki)
The long take: the camera wanders from subject to subject through a real space, in deep focus.
→ One camera path through one continuous set that contains every section. No cuts at all. The hardest
structure, and the most immersive. Refuse: a "scrolly" tunnel of floating cards.

**Alfred Hitchcock** — *Vertigo, Rear Window, Psycho*
Suspense by telling the audience what the character does not know. POV then reaction. The dolly zoom at
the moment of realisation. Graphic motifs. → Let the visitor see the payoff coming before the page
"admits" it; a POV shot; one dolly zoom at the turn. Refuse: spiral graphics.

**Steven Spielberg** — *Jurassic Park, Close Encounters*
The reaction before the reveal: faces lit by what they are looking at. One shot re-blocked into three
compositions. Backlit shafts. → Show the light of the thing on its surroundings before the thing;
a single pinned scene that recomposes twice. For products with a genuine "wow".

**Sergio Leone** — *Once Upon a Time in the West*
Extreme wide against extreme close-up, with nothing between. Time stretched unbearably before the draw.
→ Alternate vast and macro scenes; stretch the scroll before the CTA, then release it in one cut.

**Akira Kurosawa** — *Seven Samurai, Ran, High and Low*
Something moves in every frame: weather, flags, crowds. Wipes between scenes. Axial cuts straight in.
Groups arranged as geometry. → Ambient weather always present; wipe cuts; three hard punch-ins on one
axis; elements blocked in triangles that re-form. Refuse: brush font and a red sun.

**Satoshi Kon** — *Perfect Blue, Millennium Actress, Paprika*
Match cuts that slide between realities mid-gesture. → An element in one scene *is* a different element
in the next; UI inside UI inside UI.

## Crew you can borrow by name

| Department | Who | For |
|---|---|---|
| Cinematography | Roger Deakins | Silhouette, single-source motivated light, clean geometry |
| | Emmanuel Lubezki | Natural light, wide-lens long takes |
| | Christopher Doyle | Saturated practicals, handheld intimacy |
| | Vittorio Storaro | Colour as symbolism; hard warm / cold oppositions |
| | Gordon Willis | Top light, darkness, faces in shadow |
| | Hoyte van Hoytema | Large-format shallow focus, tactile close-ups |
| Titles | Saul Bass · Kyle Cooper · Pablo Ferro | Geometric · scratched · split-screen and hand lettering |
| Production design | Ken Adam · Syd Mead | Monumental interiors · industrial futures |
| Editing | Thelma Schoonmaker · Walter Murch | Energy and freeze frames · the cut on the blink, emotion first |

## The treatment's director block

(Tati and *Playtime* are this skill's worked example and therefore spent: do not cast them for a similar brief.)

```
Director / film:   Jacques Tati — Playtime (1967)
Why this director: the product's promise is order without stiffness; Tati stages order as play.
Set aside:         Kubrick (order as menace — wrong feeling), Wes Anderson (too precious for B2B)
Mechanisms:
  1. Deep wide tableau, no close-ups        → every scene is one full-viewport architectural frame
  2. Many small simultaneous events          → 6–10 independent micro-animations per scene; nothing demands the eye
  3. Modernist grid as playground            → a strict 12-column grid that objects visibly cross and re-enter
  4. Grey-blue world, one colour that travels → desaturated grade; a single red object passes through every scene
  5. Comedy from timing                       → hover and scroll responses arrive a beat late, then snap exactly into place
  6. The camera observes, never follows       → lock-off; pointer parallax off; changes happen inside the frame
```
