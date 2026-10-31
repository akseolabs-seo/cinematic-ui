# VFX — photoreal cast and sets in Three.js

Read this when the chosen medium is photoreal 3D (`looks.md` decides that; it is one medium among
several, right for films that *construct* reality). A lit, physically based object can change state,
take the scene's light and move with the camera — but geometry only buys viewpoints. Whether it is
convincing depends on the asset: silhouette, material, the small imperfections of a made thing.

**Casting test before close-ups.** Procedural forms (lathes, extrusions, rounded boxes) carry wide and
medium shots and abstract or designed objects well. They rarely survive a close-up as a *real, familiar*
thing — a cup of tea, a leaf, food, a hand. Render the closest planned shot of each asset early and look.
If it reads as computed, get a real asset (a supplied or generated model, a photograph on a plane), stay
wide, or change the medium. Roughness noise will not rescue a generic silhouette.

Code below uses `kit/stage.js` and `kit/props.js` (verified against three r186 loaded from the
import map in `kit/site.html`). The principles hold for any Three.js setup. Every lens and print value in
the stage starts at zero: set the ones this film needs.

## Why default 3D looks cheap — and the fix for each

| The tell | Fix |
|---|---|
| Flat, even shading; no reflections | An environment. PBR surfaces are mostly *reflection*; with nothing to reflect they are dead. `stage.studio()` |
| One hard directional light | Large soft sources as the key, a strip from behind as rim; a real light only for shadows |
| Washed or clipped highlights | HDR pipeline with tone mapping at the end. The kit renders to half-float and applies it in `OutputPass` |
| 75° lens on a product | `rig.fov` 18–30 and move the camera back. Wide lenses are for spaces |
| Razor-sharp edges | Bevel everything. Real edges are rounded and catch a highlight line |
| Uniform, perfect surfaces | Roughness variation and a faint normal map. Nothing real is evenly glossy |
| Object floats | Contact shadow, a floor to bounce light, a backdrop with no horizon line |
| Pure saturated colours, pure black and white | Albedo between about 0.04 and 0.9; tinted neutrals |
| Glow on everything | Bloom threshold at 1.0 in scene-linear light, low strength. Only sources and hot speculars glow |
| Stair-stepped edges, banding in gradients | MSAA on the HDR target (kit default 4×); grain dithers the banding |
| A glowing surface that is one flat colour | Break up emissive with an `emissiveMap` (mottle from `noiseField` → `fieldTexture`); real heat and light are uneven |
| It spins for no reason | Motion is camera or performance: key the `rig`, give the lead an action |

## The stage

```js
import { createStage, THREE, seeded, rgb } from './stage.js';

const stage = createStage({
  canvas: document.querySelector('#stage'),
  background: '#0b0b0d',   // or alpha: true to let the page show through (bloom is then disabled)
  tone: 'aces',            // 'aces' filmic · 'agx' keeps saturated light from clipping to white · 'neutral' faithful product colour
  dof: false,              // true adds a depth-of-field pass
});
const { scene, rig, look } = stage;
```

`rig` is the camera as plain numbers: `x y z` position, `lookX lookY lookZ` target, `fov`, `roll`,
`breathe` (operator drift, 0 for a tripod), `shake` (0–1 impact), `parallax` (pointer lean), and with
`dof: true`, `focus` (world distance; 0 follows the look target) and `aperture`.
`look` is the grade: `exposure contrast saturation temperature tint lift split shadows highlights
vignette grain aberration bloom bloomThreshold fade fadeColor`.
Both are tweened by the timeline; never set `camera.position` directly.

## Light first

Lighting is 80% of the realism and should take that share of your attention.

### Studio light — softboxes baked into the environment

```js
stage.studio({
  ambient: '#0a0a0c',                                                     // the dark room
  lights: [
    { pos: [-6, 7, 5], size: [8, 8], intensity: 6 },                      // key: large, soft, high and to one side
    { pos: [7, 3, -6], size: [1, 10], intensity: 12, color: '#bcd4ff' },  // rim: a thin strip from behind
    { pos: [0, 9, 0], size: [6, 6], intensity: 2.5, round: true },        // top
    { pos: [3, -3, 7], size: [9, 2], intensity: 0.8, color: '#ffd9b0' },  // warm bounce from below
  ],
  blur: 0.035,   // softness of the reflections
});
```

Each light is an emissive panel facing the origin, baked into a prefiltered environment map. Every PBR
surface is lit by it and reflects it, so the panels are the highlights you see on glossy objects —
you are placing the reflections directly. This is how product photography is lit.

- **Size is softness.** Large panel: broad, gentle highlight. Thin strip: a crisp line that draws an edge.
- **Intensity guide.** Key 4–8, rim 8–14, fill under 2. Above about 15 a panel reflected in a light,
  glossy surface blows out and blooms. Dark gloss is the exception: black glass, glaze or lacquer reflects
  only about 4% head-on, so it needs large shapes at 20–40 in the mirror direction to register at all.
- **A glossy face pointed at the camera mirrors whatever is behind the camera.** Tea in a cup, a screen,
  a table top: if the key softbox sits there the surface goes white. Move the panel, tilt the surface,
  or dim that one object's reflections (below).
- **Shape the highlight for the form.** Cylinders and bottles want tall strips; spheres want one big
  round source; flat faces want a gradient (a large panel partly out of view).
- **Leave darkness.** A lit object in a dark room has contrast. Light from everywhere is a clay render.
- **Relight by acts.** Call `stage.studio()` again with a new set, or animate
  `scene.environmentRotation.y` and `scene.environmentIntensity` (then `stage.invalidate()`), to move the
  light across the lead — a reveal by light instead of opacity.

**Dimming one object's reflections.** `scene.environmentIntensity` is global. Per object, a material's
`envMapIntensity` only takes effect when the material has its own `envMap`, so assign the shared one:
`mat.envMap = scene.environment; mat.envMapIntensity = 0.3;` (re-assign after calling `stage.studio()` again).

Need a real location instead (sky, interior)? Load an `.hdr` with `HDRLoader` (three/addons/loaders),
run it through `PMREMGenerator.fromEquirectangular`, and assign it to `scene.environment`. Self-host it;
compress to 1k–2k.

### One real light, for shadows

```js
stage.key({ pos: [-5, 9, 6], intensity: 1.4, softness: 6 });   // DirectionalLight with soft shadow
stage.floor({ y: -1.2 });                                      // invisible plane that only catches shadow
mesh.castShadow = mesh.receiveShadow = true;
```

Put it where the key softbox is, so shadow direction agrees with the reflection. Without a visible
floor, `stage.floor()` grounds the object on any background, including a transparent canvas.

### Practicals

A light that exists in the scene — a screen, an LED, a filament — motivates the lighting and blooms
honestly. `materials.emissive({ emissive: '#ffb070', emissiveIntensity: 8 })`: emissive above 1 crosses
the bloom threshold. Add a `PointLight` at the same position (distance-limited) if it should light
its neighbours. Point and spot lights are in physical units and fall off with the square of distance:
expect intensities in the tens to hundreds, not 1–2, and more again on dark surfaces — judge in dailies.
A point light close to a glossy floor leaves a hot specular dot; hide the source below the floor plane
or behind the object it belongs to.

### Atmosphere

- **Haze for depth.** `scene.fog = new THREE.FogExp2(backgroundColor, 0.03)` — distant things fade to
  the background tone, which is what makes scale readable.
- **Dust in the light.** `const motes = dust({ count: 220, center: [0, 2, 0] }); scene.add(motes.points);
  stage.onTick(motes.tick);` Few, soft, faint. If it reads as a starfield, there are too many.
- **Shafts.** Additive cones or planes with a soft noise texture, aligned with the key, at 3–8% opacity.

## Sets

```js
import { cyclorama } from './props.js';
const cyc = cyclorama({ color: '#1b1b1f' });   // floor sweeping up into wall: no horizon, real bounce
cyc.position.y = -1.2; scene.add(cyc);
```

A set gives the lead a place to stand, a surface to shadow, and something to reflect. Options: a
cyclorama (studio), a large rough floor fading into fog (infinite plane), a glossy floor
(`roughness 0.15`, shows a blurred reflection of the lead via the environment), an architectural shell
of a few big planes, or a shader plate behind everything (below). Match the page background to the
backdrop colour so DOM and canvas are one space.

## Building the cast

### Geometry: profile, bevel, density

- **Turned forms** — bottles, vases, bowls, knobs, lenses, columns: `turned([[r, y], …])` from `props.js`
  lathes a smooth spline profile (every corner rounds). Pass `{ smooth: false }` as the third argument to
  keep hard shoulders, foot rings and machined steps exactly as drawn. Most product silhouettes are a profile.
- **Extruded forms** — logos, plates, device bodies: `THREE.ExtrudeGeometry(shape, { depth, bevelEnabled:
  true, bevelSize: 0.03, bevelThickness: 0.03, bevelSegments: 6, curveSegments: 48 })`. An SVG path
  becomes a `Shape` with `SVGLoader` (three/addons).
- **Rounded boxes** — `RoundedBoxGeometry(w, h, d, 8, radius)` (three/addons/geometries).
- **Assemblies.** A convincing product is ten simple parts with seams between them, not one clever
  mesh: body, cap, collar, label band, button, lens ring. Seams (a 0.01 gap) read as manufacturing.
- **Segment counts.** Silhouettes show polygons first: 64–128 radial segments on anything seen close.
- **Instancing.** For crowds, fields and particles use `InstancedMesh`; thousands cost one draw call.
- **Real models.** If the product exists as CAD or glTF, use it (`GLTFLoader`, Draco / Meshopt
  compressed, self-hosted) and relight it with your studio. Do not model a real, recognisable product
  approximately; a wrong silhouette is worse than a photograph.

### Materials — `MeshPhysicalMaterial`

```js
import { materials, noiseField, roughnessMap, normalMap } from './props.js';

const wear  = roughnessMap(noiseField(512, 7, { scale: 3 }), 0.2, 0.7);      // smudges, handling
const pores = normalMap(noiseField(512, 11, { scale: 96, octaves: 3 }), 3);  // micro-texture

materials.ceramic({ roughnessMap: wear });                                    // glazed: base + clearcoat
materials.metal({ color: '#f0b95a', roughness: 0.18 });                       // gold; default is steel
materials.glass({ attenuationColor: '#cfeee2' });                             // transmission + ior + dispersion
materials.frosted();                                                          // rough transmission
materials.paint({ clearcoatNormalMap: pores, clearcoatNormalScale: new THREE.Vector2(0.015, 0.015) }); // lacquer with orange peel
materials.softTouch({ normalMap: pores, normalScale: new THREE.Vector2(0.06, 0.06) });                // rubberised plastic
materials.velvet();  materials.pearl();  materials.emissive();
```

What each channel is for:

| Property | Use |
|---|---|
| `metalness` 0 or 1 | A surface is metal or it is not. In-between only for dusty or painted metal |
| `roughness` + `roughnessMap` | The most important look control. 0.05 mirror, 0.3 satin, 0.6 matte plastic, 0.9 chalk. Always vary it |
| `clearcoat`, `clearcoatRoughness` | A second glossy layer: glaze, lacquer, car paint, coated plastic |
| `transmission`, `thickness`, `ior`, `attenuationColor`, `dispersion` | Glass, liquid, gems. IOR: water 1.33, glass 1.5, diamond 2.4 |
| `sheen`, `sheenColor` | Cloth and soft-touch surfaces: a glow at grazing angles |
| `iridescence` | Thin film: pearl, soap, anodised metal, oil |
| `anisotropy` | Brushed metal, hair, vinyl. Needs clean UVs: fine on lathed and cylindrical forms, artefacts at sphere poles |
| `normalMap` (tiny scale) | Pores, grain, orange peel. 0.02–0.1 is plenty; more looks hammered |
| `emissive` × intensity | Practicals, screens, LEDs |

Rules that keep it real: glass is only as good as what is behind it and around it — give it a backdrop
and bright softboxes to refract. Dark glossy objects are *all* reflection — light them with shapes, not
brightness. Colour textures need `texture.colorSpace = THREE.SRGBColorSpace`; data maps (roughness,
normal) must not have it. Transmission renders the scene an extra time: one or two glass objects, not ten.

### Putting product UI and photography into the scene

- **Screens.** A plane with the real UI as a texture (a screenshot, or a `CanvasTexture` you draw),
  `emissive` white with `emissiveMap` set to the same texture at intensity ~1.2, and a clearcoat glass
  layer in front. Interactive or readable UI stays in the DOM, positioned over the frame.
- **Photographs and generated plates.** People, food, places, fabric worn on a body: photograph, source
  or generate them, then bring them *into* the world — as a texture on a plane in the set, lit and graded
  with everything else, moving with the camera — never as a flat `<img>` in a rounded card. Several
  planes at different depths give parallax that a single image cannot.
- **Type as an object.** Draw large type to a `CanvasTexture` on a plane behind or around the lead, so
  the lead occludes it. Keep the same words in the DOM for readers and crawlers (visually hidden if
  needed). Reserve 3D-extruded type for a logo or a title.

### Shader plates and fields

A fullscreen or large-plane `ShaderMaterial` makes sky, fluid, aurora, heat and light fields that no
gradient can. Keep it deterministic: every animated term is a function of a `uTime` uniform you set in
`stage.onTick`.

```js
const plate = new THREE.Mesh(new THREE.PlaneGeometry(60, 34), new THREE.ShaderMaterial({
  uniforms: { uTime: { value: 0 }, uA: { value: new THREE.Color('#0d1b2a') }, uB: { value: new THREE.Color('#e07a3f') } },
  vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
  fragmentShader: /* glsl */ `
    uniform float uTime; uniform vec3 uA, uB; varying vec2 vUv;
    float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y); }
    float fbm(vec2 p){ float a = 0.0, w = 0.5; for (int i = 0; i < 5; i++){ a += noise(p) * w; p = p * 2.03 + 11.7; w *= 0.5; } return a; }
    void main(){
      vec2 p = vUv * vec2(3.0, 1.7);
      vec2 warp = vec2(fbm(p + uTime * 0.03), fbm(p + 5.2 - uTime * 0.02));     // domain warp: the difference between noise and weather
      float f = fbm(p + warp * 1.6);
      vec3 c = mix(uA, uB, smoothstep(0.25, 0.85, f + (vUv.y - 0.5) * 0.6));
      gl_FragColor = vec4(c, 1.0);
      #include <tonemapping_fragment>
      #include <colorspace_fragment>
    }`,
}));
plate.position.z = -14; scene.add(plate);
stage.onTick((t) => { plate.material.uniforms.uTime.value = t; });
```

**One NaN blanks the frame.** A single not-a-number pixel entering the bloom pass spreads to the whole
image, and the screening only reports a `flat-frame`. In shaders guard every `pow` (base must be ≥ 0:
`pow(max(x, 0.0), e)`), `sqrt`, `log`, division and `normalize` of a possibly-zero vector — values just
outside 0–1 turn up at polygon edges under MSAA. If a scene renders blank, suspect the newest shader first.

The same pattern drives: image planes that ripple or bend with scroll velocity (pass `reel.velocity`
as a uniform and displace in the vertex shader), dissolves (threshold a noise against a progress
uniform), fresnel rims, and halftone or print-misregistration looks.

## Lens and grade

- **Lens.** Product: `rig.fov` 18–30. Space: 45–70. Decide per shot in the storyboard.
- **Depth of field.** `createStage({ dof: true })`. Focus follows the look target unless `rig.focus` is
  set; `rig.aperture` 0.001–0.004. Use it for gentle falloff on close shots. It is a screen-space
  effect: heavy blur on bright highlights shows ringing, so do not use it to blur a whole wide shot —
  put a soft backdrop there instead.
- **Bloom.** `look.bloom` 0.08–0.2. Raise it for a moment (a hit, a reveal) and bring it back.
- **Grade.** Set a base `look` once, then key changes at scene boundaries: `look.temperature`,
  `look.saturation`, `look.split` with `Object.assign(look.shadows, rgb('#0e3a4a'))`.
- **Grain and vignette** make CG sit with the DOM and hide banding: `look.grain` 0.02–0.05.
- **Motion blur** does not exist in real time here; in film mode `render-film.mjs --motion-blur 8`
  adds a true shutter.

## Performance — the stage has a budget

The kit already clamps device pixel ratio to 2, steps quality down (never up) if frames run slow, skips
drawing when nothing changed, widens the lens on portrait screens so framing survives, and falls back to
a `no-webgl` class on failure. Your part:

- **Rest the stage** when an opaque scene covers it: `reel.onFrame(f => { stage.enabled = f.scene.name !== 'pricing'; })`.
- **Budgets (mid-range laptop / recent phone):** under ~300k triangles on screen, under ~100 draw
  calls, one shadow-casting light at 2048², at most two transmissive objects, textures ≤ 2k.
- **Mobile cut.** Fewer particles and instances, `dof: false`, simpler materials (drop transmission and
  clearcoat normal maps), shorter scroll. Decide with `matchMedia('(max-width: 760px)')` at build time.
- **Portrait sees more of the set.** To keep the horizontal framing, the stage widens the lens on tall
  screens (`fitAspect`), so a phone sees far above and below what desktop does — past the edge of a
  floor, over the top of a backdrop. Extend floors and backdrops well beyond the desktop frame, and give
  phone shots their own poses (closer, or a longer `rig.fov`) where the wide view weakens the shot.
- **Load order.** Text and layout first; the import map and module scripts are deferred by nature. Paint
  a CSS background that matches the first frame so the canvas arriving is not a flash. Heavy assets
  (glTF, HDR) load after first paint with a real progress state — or do not ship them.
- **Dispose** geometries, materials and textures you replace; call `stage.dispose()` on teardown in SPAs.
- **Determinism.** No `Math.random()` and no clocks in anything a film render or a screening will see:
  use `seeded(n)` and the `time` passed to `stage.onTick`. No temporal effects (trails, TAA, afterimage).

## Fallbacks are part of the shot

- **No WebGL:** `.no-webgl` on `<html>`. Provide a poster — a rendered still of the money frame as a CSS
  background — so the layout still has its lead.
- **Reduced motion:** the stage renders one still pose per scene (see `kit/README.md`). Check that each
  still is a composed frame.
- **WebGPU / TSL:** `WebGPURenderer` and node materials are the direction of travel, but this kit targets
  `WebGLRenderer` for reach and for frame-exact rendering. Move only for a need WebGL cannot meet.
