# Film grammar → web mechanics

The dictionary. Left: what a filmmaker does and what it makes an audience feel. Right: what you actually
build. Use it to turn a director's habit into something visible on screen, and to fill the lens, move,
light and cut columns of the shot list.

`rig` and `look` are the camera and grade objects from `kit/stage.js`. "CSS lens" means the same idea
without WebGL: `perspective`, transforms, blur, masks.

## Shot size — how much of the frame the subject takes

| Shot | The subject… | Says | Build |
|---|---|---|---|
| Extreme wide (ELS) | is under 10% of the frame | scale, isolation, awe, context | Tiny lead in a vast set; small type against huge empty ground; fog for distance |
| Wide (WS) | is whole, with room | geography, "here is the world" | Whole object and its floor, horizon or wall; the layout's full grid visible |
| Medium (MS) | fills about half | conversation, explanation | The working shot for copy beside subject. Use it least: it is the default |
| Close-up (CU) | fills the frame | importance, emotion, proof | One feature, one number, one face of the object, cropped by the edges |
| Extreme close-up (ECU) | exceeds the frame | texture, obsession, tension | Macro: material grain, a seam, a single glyph larger than the viewport |
| Insert | is a detail cut in | "notice this" | A brief macro cutaway between two wider scenes |

Cut between sizes at least two steps apart (wide → close). One step reads as a mistake, a jump cut.
A page that lives in medium shots is a brochure.

## Angle and height

| Angle | Says | Build |
|---|---|---|
| Eye level | neutral, honest | Camera at subject height. Pricing, specs, anything that must be trusted |
| Low angle | power, monument | `rig.y` below the subject, looking up; verticals converge upward; type set huge and bottom-anchored |
| High angle | smallness, overview, vulnerability | Camera above, looking down 30–60° |
| Top-down (overhead) | inventory, plan, ritual | Camera straight down; objects knolled on a surface; works with orthographic framing |
| Dutch (roll) | instability, wrongness | `rig.roll` 3–8°. A whole tilted composition, never a tilted card |
| POV | you are there | The camera is the user's eye or hand; UI is seen as the user would hold it |
| Over-the-shoulder | witness, relationship | A foreground occluder (out of focus) with the subject beyond it |
| Profile / frontal (planimetric) | order, artifice, deadpan | Camera square to a flat wall; subjects perpendicular or parallel to the lens; no diagonals |

## Lens

| Lens | Field of view | Says | Build |
|---|---|---|---|
| Ultra-wide 14–20 mm | `rig.fov` 80–100 | immersion, speed, distortion near the lens | Space rushing past; objects close to camera stretch. Rooms, tunnels, flythroughs |
| Wide 24–35 mm | 55–75 | presence, environment | Subject and its world together; deep focus |
| Normal 40–55 mm | 35–45 | how the eye sees | Neutral. Documentary honesty |
| Portrait 85–135 mm | 15–28 | compression, flattery, product hero | The product-photography lens. Background collapses onto the subject; shallow focus |
| Long 200 mm+ | 6–12 | surveillance, heat, stacked planes | Planes pile up; parallax nearly vanishes; pair with haze |
| Orthographic | — | diagram, miniature, artifice | `OrthographicCamera`, or CSS with no `perspective`. Dollhouse, plan, cross-section |

CSS lens: `perspective: 600px` is a wide lens (violent foreshortening), `2400px` is long (nearly flat).
Product on a 75° lens is the single most common reason 3D looks cheap: default to 20–30.

**Depth of field.** Shallow focus isolates and softens; deep focus lets the eye choose. Build with
`createStage({ dof: true })` and `rig.focus` / `rig.aperture`, or in CSS by blurring whole layers by depth.
**Rack focus** — sharpness moves from one plane to another and takes attention with it: tween `rig.focus`,
or cross-tween blur between two layers. **Anamorphic** — oval bokeh, horizontal streak flares, 2.39:1:
a stretched flare sprite on highlights plus letterbox bars. **Lens character** — vignette, slight
chromatic aberration at the edges, barrel distortion, halation: `look.vignette`, `look.aberration`,
bloom. All of it at "barely there". If someone can name the effect, it is too much.

## UI planes — shooting an interface

When the cast is a product's interface (film mode, mostly), the set is a flat plane and the camera is
`kit/plane.js`: `uiPlane(el, { dof: true })` puts a live DOM plane under CSS perspective, with the pose as a
plain object (`mag`, `pitch`, `roll`, `yaw`, `persp`, focal point `fx` / `fy` placed at `cx` / `cy`, focus
offset `rackX` / `rackY`). The focal point is drawn at exactly `mag` and stays sharp.

| Preset | Magnification | Pitch · roll · yaw | Lens (`persp`) | Sharp band | Says |
|---|---|---|---|---|---|
| `SHOTS.xmacro` | 5–7× | 50° · ±9° · 12° | 1100 px (wide, steep falloff) | ~40 px of depth | the one action: a key going down, a value changing |
| `SHOTS.macro` | 2.5–3.5× | 38° · ±7° · 10° | 1400 px | ~90 px | a component working: a status, a chart, a row |
| `SHOTS.medium` | 1.4–1.8× | 22° · ±4° · 6° | 1900 px | ~220 px | a panel and its context: cause and effect in one frame |
| `SHOTS.wide` | 0.8–1.1× | 8° · 0 · 0 | 2600 px (long, nearly flat) | all | the payoff, once: the whole screen at rest |

- **Oblique, not flat.** Pitch tips the plane away so depth exists and focus can fall off; a flat plane
  at any magnification is a screenshot.
- **Rack focus** is a tween of `rackX` / `rackY` (plane px from the focal point): sharpness walks from a
  log row to the chart it caused. It replaces the arrow, the highlight box and the zoom.
- **Depth of field without WebGL.** Equal-depth lines on a plane project to parallel lines on screen, so
  each blur level is one `backdrop-filter` layer masked by a linear gradient; layers are cumulative and
  compound like a real defocus. Everything behind the plane (a field of out-of-focus points, a room)
  blurs with it. Type laid over the frame stays sharp.
- **Alternate the diagonal and jump the scale.** Consecutive shots that share scale and roll sign read as a
  jump cut; the `[film]` audit names them.
- **Light on the plane.** A radial pool that trails the subject (`film.lag` of the camera's own path) and
  a falloff to the plane's edges: a practical light, never a vignette pasted on the frame.
- **Never upscale a bitmap.** Live DOM re-rasterises at the drawn scale; an image on a plane is captured at
  the shot's magnification or it blurs.

## Camera movement

Every move is motivated: it follows something, reveals something, or says something about the subject.

| Move | What it is | Says | Build |
|---|---|---|---|
| Lock-off | Camera does not move | authority, composure, observation | `rig.breathe = 0`, `parallax = 0`. Change happens inside the frame or by cut |
| Push-in (dolly in) | Camera travels toward subject | growing importance, realisation, intimacy | Tween `rig.z` (and position) toward the subject over a pinned scene. Slow. Parallax increases |
| Pull-out | Camera travels away | reveal of context, loneliness, the bigger picture | Start on a detail, end wide. Great final image |
| Zoom | Lens changes, camera stays | observation, voyeurism, sudden attention | Tween `rig.fov` only; no parallax change. Crash zoom: fast, with `expo.out` |
| Dolly zoom | Push in while widening lens | the ground shifts; dread or revelation | Tween `rig.z` in and `rig.fov` up so the subject stays the same size. Once per film, at the turn |
| Truck / track | Camera slides sideways | journey, list becoming landscape | Tween `rig.x`; a horizontal rail of content moving past. Foreground must move faster than background |
| Crane / boom | Camera rises or descends | arrival, departure, grandeur | Tween `rig.y` with a tilt to keep the subject; rise to reveal what was behind |
| Pan / tilt | Camera rotates in place | looking around, connecting two things | Tween `lookX` / `lookY` with position fixed. Content sweeps with perspective |
| Whip pan | A pan too fast to see | energy, simultaneity; hides a cut | 150–250 ms of motion blur along one axis, with the cut in the middle |
| Arc / orbit | Camera circles the subject | examination, admiration, 360° truth | Tween position on a circle with `look` fixed on the subject. A half-turn, rarely more |
| Handheld | Operator movement | presence, urgency, documentary | `rig.breathe` 0.02–0.04, plus small `rig.shake`. Never on text-heavy frames |
| Steadicam / float | Smooth travel through space | being led, dream, guided tour | A long eased path through the set; the camera hands off from subject to subject |
| The oner (long take) | No cut for a whole sequence | immersion, virtuosity, real time | One continuous camera path through one space; all content lives in that space |

Dolly versus zoom is the distinction that separates directed 3D from a rotating model: a dolly changes
parallax and feels like presence; a zoom does not and feels like watching.

## Blocking and staging — where things are, and when they move

- **Marks.** Every element has a start mark and an end mark. It enters *from somewhere* — an edge, behind
  another object, out of the dark — travels, and stops on its mark. Nothing materialises.
- **Depth staging.** Foreground / midground / background, each doing a job. A dark, soft foreground
  object at the frame edge makes the middle feel deep.
- **Frame within a frame.** Doorways, windows, mirrors, screens: a smaller rectangle inside the viewport
  concentrates attention and can become the next scene.
- **Lead room and headroom.** Leave space in the direction a subject faces or moves. Crowding the edge
  creates tension — use that on purpose.
- **Who moves first.** In a group, order of motion is hierarchy. Stagger by importance or by geometry
  (from the light, from the centre), never by DOM order alone.
- **Re-blocking.** A long hold stays alive when the actors rearrange into a new composition inside the
  same frame. One pinned scene, three compositions, no cut.
- **Leading lines and triangles.** Edges, light and gaze point at the subject; three points of interest
  form a triangle whose shape (stable base, or standing on a point) sets the mood.

## Composition

| System | Feels | Build |
|---|---|---|
| One-point symmetry | authority, fate, menace or calm | Subject on the centre axis; lines converge to one vanishing point behind it |
| Planimetric | deadpan, storybook, control | Flat frontal layers parallel to the screen; lateral movement only |
| Rule of thirds, off-centre | natural, unposed | Subject on a third; the empty two-thirds is the point |
| Extreme negative space | loneliness, luxury, confidence | Subject under a tenth of the frame, near an edge or corner |
| Diagonal / dynamic | energy, speed | Dominant lines corner to corner; type on the diagonal's opposite side |
| Quadrant / split | comparison, duality, parallel lives | Hard division of the frame; each half its own shot |
| Deep tableau | a world to explore | One wide frame, many small events at different depths; the viewer's eye edits |
| Short-siding | unease, being trapped | Subject faces the near edge, with the space behind it |

## Light

Light is the cheapest way to look expensive and the first thing missing from an undirected scene.

- **Key, fill, back.** One dominant source (key), a much weaker one opening the shadows (fill), one from
  behind tracing the silhouette (back or rim). The key-to-fill ratio is the mood: 2:1 bright commercial,
  8:1 drama, no fill at all noir.
- **High key / low key.** High key: bright, few shadows, optimism, clarity, retail. Low key: mostly
  dark, pools of light, mystery, luxury, threat.
- **Motivated light.** Light comes from something in the world: a window, a screen, a sign, a fire. On a
  site the product's own screen or emissive detail is the best practical.
- **Hard versus soft.** Small or distant source: hard shadow edges, graphic, harsh. Large or close
  source: soft wrap, flattering. Softbox size in `stage.studio()` is exactly this control.
- **Rim separation.** A dark subject on a dark ground needs an edge light or it is a hole.
- **Silhouette.** Subject black against a bright field: shape only, identity withheld. A strong reveal
  is going from silhouette to lit.
- **Chiaroscuro, gobos, shafts.** Patterned light (blinds, leaves, grids) sweeping across a surface gives
  a flat frame depth and time. Shafts need haze.
- **Colour contrast.** Warm key with cool shadows (or the reverse) separates planes better than
  brightness alone.
- **Light as reveal.** Bring the light to the object instead of raising the object's opacity: tween a
  softbox's intensity, rotate `scene.environmentRotation`, sweep a mask. In CSS, a moving gradient mask
  or `mix-blend-mode` pass.

## Colour

- **Colour script.** Plan colour by act, as animation studios do: a strip of swatches, one per scene,
  showing how the palette moves with the story. Tween `look` at scene boundaries.
- **Limited palette.** Two or three hues and their tints for the whole film. Restraint reads as intent.
- **The reserved colour.** One saturated colour appears only on the lead or the action — the red coat.
  Nothing else may use it.
- **Arc.** Desaturated → saturated as the product arrives; cold → warm; dark → light. The grade tells the
  audience arc again in colour.
- **The grade is cast from the film's frames** (`grades.md`): measure reference stills, then drive
  `stage.look` on the stage or `kit/grade.js` on a DOM site. They share parameter names.
- **Grade recipes** (`look`): bleach bypass — `saturation 0.6, contrast 1.25`. Teal / orange —
  `split 0.5`, `shadows` teal, `highlights` amber. Faded print — `lift 0.06, contrast 0.92`. Day for
  night — `temperature −0.5, exposure 0.6, saturation 0.7`. Noir — `saturation 0`, `contrast 1.3`.
- **Blacks and whites are tinted.** Never `#000` and `#fff` for ground and paper; pick them from the
  palette (`#0b0a0e`, `#f3efe6`).

## Editing — the cut

| Cut | What happens | Says | Build |
|---|---|---|---|
| Hard cut | Instant change | "and then" — confident, modern | Poses jump at the scene boundary: `enter.set(...)`, or two different `fromTo` starts. No easing across it |
| Match cut | Shape, position or motion continues across the cut | these two things are one idea | The lead ends scene A exactly where a different element begins scene B: same screen position, size and silhouette. Circle → circle, line → line |
| Jump cut | Same shot, time skipped | impatience, energy, wit | Discrete state steps instead of a tween: `steps()` easing or stacked `set` calls |
| J-cut / L-cut | Sound of the next scene arrives before its picture (or lingers after) | flow, anticipation | Text or UI of scene B enters over the end of scene A's image; the picture cuts later |
| Dissolve | Two images overlap | time passes, memory, softness | Cross-tween opacity in a `data-cut` overlap. The default of the lazy: use once, mean it |
| Fade to / from black | Scene ends in darkness | end of an act, a breath | `look.fade` → 1 and back; or the DOM `.flash` in black |
| Wipe | A line or shape replaces the image | adventure, chapter turn, comic energy | `clip-path` on the incoming frame in a `data-cut` overlap: inset, circle (iris), polygon (diagonal) |
| Whip-pan cut | A blur hides the join | meanwhile; speed | Fast lateral motion blur out of A and into B, cut at peak blur |
| Invisible cut | Something fills the lens and the scene changes behind it | one continuous shot | The camera passes through darkness, a wall, the lead itself; swap the set while the frame is covered |
| Smash cut | Quiet to loud, or loud to silence | shock, comedy, impact | A long still hold, then full-frame change on the next scroll tick, no transition at all |
| Cutaway / insert | A brief different shot inside a scene | detail, proof, relief | A short macro scene (100–120vh) between two long ones |
| Montage | A rapid series | time compressed, abundance | 4–8 quick states inside one pinned scene: features, logos, screens. Even rhythm, then one long hold |
| Cross-cutting | Two threads alternate | tension, comparison, convergence | Two columns or two layers advancing in alternation until they meet in one frame |

**Kuleshov.** Meaning comes from the order of shots, not from either shot. A claim followed by proof is
an argument; proof followed by the claim is a reveal. Order sections so the cut itself makes a point.

**Rhythm.** Vary shot length. A run of short scenes needs a long hold after it; a long take earns a
fast flurry. Equal-length scenes are a metronome, and a metronome is not music.

## Time

| Technique | Build |
|---|---|
| Slow motion | More scroll per unit of change: a long pinned scene where little moves, beautifully. Use for the money shot |
| Speed ramp | Ease with a steep middle (`expo.inOut`, custom curves): slow in, violent through, slow out |
| Freeze frame | The motion stops dead and a caption lands on it. Pin, hold, add type |
| Time-lapse | A long process in one short scrub: day to night, build-up, growth |
| Reverse | The scene assembles from its wreckage. Play the destruction timeline backwards |
| Real time | One continuous take, no compression. Honest; hard; impressive |
| Stepped time | 12 or 8 fps on selected elements (`steps(n)`) against a smooth camera: hand-made, stop-motion |

## Format and texture

- **Aspect ratio.** 2.39:1 letterbox: epic, composed (`.letterbox` with `--bars: 0.12`). 1.85:1: neutral.
  4:3 or 1.37:1 pillarbox: intimate, archival, portrait. 1:1: formal, iconic. *Changing* ratio inside
  the film — bars opening as the world expands — is one of the strongest moves available.
- **Grain.** Fine, luminance-weighted, changing at 24 fps (`look.grain` 0.02–0.06). It unifies CG and
  DOM, hides banding, and reads as photographed.
- **Frame rate feel.** Smooth camera, stepped elements. Or the opposite.
- **Gate and print.** Weave, dust, light leaks, burn marks: only for an explicitly archival concept.

## Titles

- **Cold open.** Start inside the film; the title arrives after the hook.
- **Title card / opening titles.** The name, held alone. Type and motion here set the contract.
- **Intertitle.** A full-frame card of words between scenes: a chapter, a claim, a breath.
- **Lower third.** A small label naming what is on screen. Good for specs, credits, captions.
- **Subtitle.** A quiet line at the bottom edge carrying the literal meaning while the picture does the
  rest. Useful when the image is abstract and the copy must be plain.
- **End credits.** The footer. Links, legal and people set as a credits roll, or a final card.

## Sound

In a film, music is half the film. On a site: silent by default, an explicit unmuted
toggle if sound matters, never autoplay. But "visual sound" is always available: rhythm, impact frames,
shake on a hit, a beat of black before a reveal.
