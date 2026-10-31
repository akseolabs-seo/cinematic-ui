/* stage.js — the sound stage.  Cinematic UI kit.
 *
 * Camera rig, studio lighting, lens and grade for a Three.js scene. It contains no look of its own:
 * everything visible (cast, set, light, grade) is yours to direct, and every lens / print effect (grain,
 * vignette, bloom, breathing, pointer lean) starts at zero. The stage is optional: a film made of type,
 * drawings or photographs may need no canvas at all. What it owns is the plumbing that
 * usually goes wrong — colour management, HDR pipeline, image-based studio light, post chain,
 * resize, quality tiers, reduced motion, WebGL failure — and it renders any frame from a time value,
 * so the same scene works under a scrollbar (site) or a clock (film).
 *
 *   const stage = createStage({ canvas, background: '#0b0b0c' });
 *   stage.studio({ lights: [{ pos: [-4, 5, 3], size: [5, 5], intensity: 10 }] });
 *   stage.key({ pos: [4, 7, 5], intensity: 2.2 });
 *   stage.scene.add(lead);
 *   gsap.to(stage.rig, { z: 4, lookY: 0.3 });     // rig and look are plain numbers: tween them
 *   stage.render(timeInSeconds);
 */
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { BokehPass } from 'three/addons/postprocessing/BokehPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

export { THREE };

/** Deterministic random — never use Math.random() for anything a film render will see. */
export function seeded(seed = 1) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** '#0e3a4a' → { r, g, b } in display space, for tweening grade tints. */
export function rgb(hex) {
  const n = parseInt(hex.replace('#', ''), 16);
  return { r: ((n >> 16) & 255) / 255, g: ((n >> 8) & 255) / 255, b: (n & 255) / 255 };
}

const TONES = { aces: THREE.ACESFilmicToneMapping, agx: THREE.AgXToneMapping, neutral: THREE.NeutralToneMapping, none: THREE.NoToneMapping };

const GRADE = {
  uniforms: {
    tDiffuse: { value: null }, uTime: { value: 0 }, uGrainScale: { value: 1 }, uPremultiplied: { value: 0 },
    uContrast: { value: 1 }, uSaturation: { value: 1 }, uTemperature: { value: 0 }, uTint: { value: 0 },
    uLift: { value: 0 }, uSplit: { value: 0 }, uShadows: { value: new THREE.Vector3(0.5, 0.5, 0.5) },
    uHighlights: { value: new THREE.Vector3(0.5, 0.5, 0.5) }, uVignette: { value: 0 }, uGrain: { value: 0 },
    uAberration: { value: 0 }, uFade: { value: 0 }, uFadeColor: { value: new THREE.Vector3(0, 0, 0) },
  },
  vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }',
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse; uniform float uTime, uGrainScale, uPremultiplied;
    uniform float uContrast, uSaturation, uTemperature, uTint, uLift, uSplit, uVignette, uGrain, uAberration, uFade;
    uniform vec3 uShadows, uHighlights, uFadeColor;
    varying vec2 vUv;
    const vec3 W = vec3(0.2126, 0.7152, 0.0722);
    float hash(vec2 p){ vec3 q = fract(vec3(p.xyx) * 0.1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
    void main(){
      vec2 d = vUv - 0.5; float r2 = dot(d, d);
      vec4 src = texture2D(tDiffuse, vUv);
      vec3 c = src.rgb;
      if (uAberration > 0.0) {                      // lens: lateral chromatic aberration, zero on the optical axis
        vec2 o = d * r2 * uAberration * 0.6;
        c.r = texture2D(tDiffuse, vUv + o).r; c.b = texture2D(tDiffuse, vUv - o).b;
      }
      if (uPremultiplied > 0.5 && src.a > 0.0) c /= src.a;
      c *= vec3(1.0 + uTemperature * 0.12, 1.0 - uTint * 0.08, 1.0 - uTemperature * 0.12);   // white balance
      c = (c - 0.5) * uContrast + 0.5;
      float l = dot(c, W);
      c = mix(vec3(l), c, uSaturation);
      vec3 sh = uShadows - dot(uShadows, W), hi = uHighlights - dot(uHighlights, W);          // split-tone: hue only
      c += (sh * (1.0 - smoothstep(0.0, 0.55, l)) + hi * smoothstep(0.45, 1.0, l)) * uSplit;
      c = c * (1.0 - uLift) + uLift;                                                          // lifted (faded) blacks
      c *= mix(1.0, 1.0 - smoothstep(0.18, 0.78, length(d)), uVignette);
      float n = hash(floor(gl_FragCoord.xy / uGrainScale) + floor(uTime * 24.0) * 17.13);     // grain steps at 24 fps
      c += (n - 0.5) * uGrain * (1.0 - 0.5 * abs(2.0 * l - 1.0));
      c = mix(c, uFadeColor, uFade);
      c = clamp(c, 0.0, 1.0);
      if (uPremultiplied > 0.5) c *= src.a;
      gl_FragColor = vec4(c, src.a);
    }`,
};

export function createStage(options = {}) {
  const o = {
    canvas: document.querySelector('#stage'),
    background: '#0b0b0c', // ignored when alpha: true
    alpha: false,          // true → the page shows through the canvas (bloom is then off: it cannot keep alpha)
    fov: 30, near: 0.1, far: 200,
    tone: 'aces',          // 'aces' filmic contrast · 'agx' holds saturated light · 'neutral' true product colour
    bloom: true, dof: false, shadows: true, msaa: 4,
    dprMax: 2, fitAspect: 1.25, // below this aspect the lens widens so the horizontal framing survives portrait
    pointer: true,
    film: null,            // { width, height } → fixed-size deterministic output for video
    ...options,
  };
  const root = document.documentElement;
  const film = o.film;
  let dirty = true, enabled = true;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const coarse = matchMedia('(pointer: coarse)').matches;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas: o.canvas, antialias: false, alpha: o.alpha, powerPreference: 'high-performance', preserveDrawingBuffer: !!film });
  } catch (err) {
    root.classList.add('no-webgl'); // the CSS poster / still takes over
    const noop = () => {};
    // A stand-in with the whole API, so code written against the stage keeps running and simply draws nothing.
    return {
      ok: false, THREE, renderer: null, composer: null, scene: new THREE.Scene(), camera: new THREE.PerspectiveCamera(o.fov, 1, o.near, o.far),
      rig: { x: 0, y: 0, z: 8, lookX: 0, lookY: 0, lookZ: 0, fov: o.fov, roll: 0, breathe: 0, shake: 0, parallax: 0, focus: 0, aperture: 0 },
      look: { exposure: 1, contrast: 1, saturation: 1, temperature: 0, tint: 0, lift: 0, split: 0, shadows: { r: 0.5, g: 0.5, b: 0.5 }, highlights: { r: 0.5, g: 0.5, b: 0.5 }, vignette: 0, grain: 0, aberration: 0, bloom: 0, bloomThreshold: 1, fade: 0, fadeColor: { r: 0, g: 0, b: 0 } },
      quality: { dpr: 1, bloom: false, tier: 'none' },
      studio: noop, key: () => new THREE.DirectionalLight(), floor: () => new THREE.Object3D(), render: () => false, resize: noop, dispose: noop,
      onTick: () => noop, invalidate: noop, addPass: (p) => p, enabled: false, reduced: matchMedia('(prefers-reduced-motion: reduce)').matches, film: !!o.film,
    };
  }
  o.canvas.addEventListener('webglcontextlost', (e) => { e.preventDefault(); root.classList.add('no-webgl'); });

  renderer.toneMapping = TONES[o.tone] ?? THREE.ACESFilmicToneMapping; // applied by OutputPass, after the HDR passes
  renderer.shadowMap.enabled = !!o.shadows;
  renderer.shadowMap.type = THREE.PCFShadowMap; // filtered and soft in current three; softness comes from light.shadow.radius
  if (o.alpha) renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  if (!o.alpha) scene.background = new THREE.Color(o.background);
  const camera = new THREE.PerspectiveCamera(o.fov, 1, o.near, o.far);

  /* ---------- lens + grade chain: HDR render → bloom → (depth of field) → tone map → grade ---------- */
  const target = new THREE.WebGLRenderTarget(2, 2, { type: THREE.HalfFloatType, samples: o.msaa });
  const composer = new EffectComposer(renderer, target);
  composer.addPass(new RenderPass(scene, camera));
  const bokeh = o.dof ? new BokehPass(scene, camera, { focus: 8, aperture: 0.002, maxblur: 0.008 }) : null;
  if (bokeh) composer.addPass(bokeh);
  const bloom = o.bloom && !o.alpha ? new UnrealBloomPass(new THREE.Vector2(2, 2), 0.12, 0.55, 1.0) : null;
  if (bloom) composer.addPass(bloom);
  composer.addPass(new OutputPass());
  const grade = new ShaderPass(GRADE);
  grade.uniforms.uPremultiplied.value = o.alpha ? 1 : 0;
  composer.addPass(grade);

  /* ---------- the two things you direct ---------- */
  const rig = {
    x: 0, y: 0, z: 8, lookX: 0, lookY: 0, lookZ: 0,
    fov: o.fov, roll: 0,
    breathe: 0,       // operator breathing: slow drift, as a fraction of subject distance (try 0.012; 0 = locked-off tripod)
    shake: 0,         // 0..1 impact shake — tween it to 1 and back to 0
    parallax: 0,      // how far the pointer can lean the camera (site mode only; try 0.15–0.3). Off until you direct it
    focus: 0, aperture: 0.002, // only when dof: true. focus = distance in world units; 0 = follow the look target
  };
  const look = {
    exposure: 1, contrast: 1, saturation: 1, temperature: 0, tint: 0, lift: 0,
    split: 0, shadows: { r: 0.5, g: 0.5, b: 0.5 }, highlights: { r: 0.5, g: 0.5, b: 0.5 },
    vignette: 0, grain: 0, aberration: 0, // every lens and print effect starts at zero: nothing is on screen that you did not put there
    bloom: 0, bloomThreshold: 1.0, // try bloom 0.08–0.2. Threshold is in scene-linear light: at 1.0 only sources and hot speculars glow
    fade: 0, fadeColor: { r: 0, g: 0, b: 0 },
  };

  /* ---------- lighting ---------- */
  const pmrem = new THREE.PMREMGenerator(renderer);
  let envTarget = null;
  /** Image-based studio light: softboxes you place, baked into the environment every PBR surface reflects. */
  function studio({ lights = [], ambient = '#08080a', blur = 0.035, intensity = 1, rotation = 0 } = {}) {
    const env = new THREE.Scene();
    const made = [];
    const add = (geo, color, scalar) => {
      const mat = new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(scalar), side: THREE.DoubleSide });
      const mesh = new THREE.Mesh(geo, mat); env.add(mesh); made.push(geo, mat); return mesh;
    };
    add(new THREE.SphereGeometry(60, 32, 16), ambient, 1);
    for (const l of lights) {
      const [w, h] = l.size || [4, 4];
      const m = add(l.round ? new THREE.CircleGeometry(w / 2, 48) : new THREE.PlaneGeometry(w, h), l.color || '#ffffff', l.intensity ?? 8);
      m.position.set(...l.pos); m.lookAt(0, 0, 0);
    }
    envTarget?.dispose();
    envTarget = pmrem.fromScene(env, blur);
    scene.environment = envTarget.texture;
    scene.environmentIntensity = intensity;
    scene.environmentRotation.y = rotation;
    made.forEach((x) => x.dispose());
    dirty = true;
  }

  /** One real light for cast shadows and a hard(er) edge. Everything else comes from studio(). */
  function key({ pos = [4, 7, 5], color = '#ffffff', intensity = 2, softness = 5, area = 8, mapSize = 2048 } = {}) {
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(...pos);
    light.castShadow = !!o.shadows;
    light.shadow.mapSize.set(mapSize, mapSize);
    Object.assign(light.shadow.camera, { left: -area, right: area, top: area, bottom: -area, near: 0.1, far: 60 });
    light.shadow.radius = softness; light.shadow.bias = -0.0003; light.shadow.normalBias = 0.03;
    scene.add(light, light.target);
    dirty = true;
    return light;
  }

  /** Invisible floor that only catches shadow — grounds the cast on any background. */
  function floor({ y = 0, size = 60, opacity = 0.45 } = {}) {
    const mesh = new THREE.Mesh(new THREE.PlaneGeometry(size, size), new THREE.ShadowMaterial({ opacity }));
    mesh.rotation.x = -Math.PI / 2; mesh.position.y = y; mesh.receiveShadow = true;
    scene.add(mesh);
    return mesh;
  }

  /* ---------- camera ---------- */
  const pointer = { x: 0, y: 0, sx: 0, sy: 0 };
  const onPointer = (e) => { pointer.x = (e.clientX / innerWidth) * 2 - 1; pointer.y = (e.clientY / innerHeight) * 2 - 1; };
  if (o.pointer && !film && !reduced && !coarse) {
    addEventListener('pointermove', onPointer, { passive: true });
  }
  const eye = new THREE.Vector3(), aim = new THREE.Vector3(), right = new THREE.Vector3(), up = new THREE.Vector3(), fwd = new THREE.Vector3();
  const wobble = (t, a, b, c) => (Math.sin(t * a) + Math.sin(t * b + 1.3) * 0.6 + Math.sin(t * c + 4.1) * 0.3) / 1.9;

  function applyRig(t, dt) {
    eye.set(rig.x, rig.y, rig.z); aim.set(rig.lookX, rig.lookY, rig.lookZ);
    const dist = Math.max(0.001, eye.distanceTo(aim));
    fwd.subVectors(aim, eye).normalize(); right.crossVectors(fwd, camera.up).normalize(); up.crossVectors(right, fwd);
    const k = 1 - Math.exp(-dt * 4);
    pointer.sx += (pointer.x - pointer.sx) * k; pointer.sy += (pointer.y - pointer.sy) * k;
    let dx = pointer.sx * rig.parallax * dist * 0.08, dy = -pointer.sy * rig.parallax * dist * 0.05, roll = rig.roll;
    if (!reduced) {
      dx += Math.sin(t * 0.31) * rig.breathe * dist; dy += Math.sin(t * 0.23 + 1.7) * rig.breathe * dist * 0.7;
      if (rig.shake > 0) {
        const s = rig.shake * dist * 0.02;
        dx += wobble(t, 37.1, 59.3, 83.7) * s; dy += wobble(t + 9.7, 41.9, 53.1, 91.3) * s; roll += wobble(t + 3.3, 29.3, 47.7, 71.9) * rig.shake * 0.012;
      }
    }
    camera.position.copy(eye).addScaledVector(right, dx).addScaledVector(up, dy);
    const widen = camera.aspect < o.fitAspect ? o.fitAspect / camera.aspect : 1;
    const fov = THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(rig.fov) / 2) * widen));
    if (Math.abs(fov - camera.fov) > 1e-4) { camera.fov = fov; camera.updateProjectionMatrix(); }
    camera.lookAt(aim);
    if (roll) camera.rotateZ(roll);
    if (bokeh) { bokeh.uniforms.focus.value = rig.focus > 0 ? rig.focus : dist; bokeh.uniforms.aperture.value = rig.aperture; }
  }

  function applyLook(t) {
    const u = grade.uniforms;
    renderer.toneMappingExposure = look.exposure;
    u.uTime.value = t; u.uContrast.value = look.contrast; u.uSaturation.value = look.saturation;
    u.uTemperature.value = look.temperature; u.uTint.value = look.tint; u.uLift.value = look.lift; u.uSplit.value = look.split;
    u.uShadows.value.set(look.shadows.r, look.shadows.g, look.shadows.b);
    u.uHighlights.value.set(look.highlights.r, look.highlights.g, look.highlights.b);
    u.uVignette.value = look.vignette; u.uGrain.value = reduced ? Math.min(look.grain, 0.02) : look.grain;
    u.uAberration.value = look.aberration; u.uFade.value = look.fade;
    u.uFadeColor.value.set(look.fadeColor.r, look.fadeColor.g, look.fadeColor.b);
    if (bloom) { bloom.strength = look.bloom; bloom.threshold = look.bloomThreshold; bloom.enabled = look.bloom > 0.001 && quality.bloom; }
  }

  /* ---------- size + quality ---------- */
  const quality = { dpr: Math.min(devicePixelRatio || 1, o.dprMax), bloom: true, tier: 'high' };
  function resize() {
    const w = film ? film.width : Math.max(1, o.canvas.clientWidth || innerWidth);
    const h = film ? film.height : Math.max(1, o.canvas.clientHeight || innerHeight);
    const dpr = film ? 1 : quality.dpr;
    renderer.setPixelRatio(dpr); renderer.setSize(w, h, false);
    composer.setPixelRatio(dpr); composer.setSize(w, h);
    camera.aspect = w / h; camera.updateProjectionMatrix();
    grade.uniforms.uGrainScale.value = Math.max(1, dpr * (w > 1400 ? 1.25 : 1));
    dirty = true;
  }
  const observer = !film && 'ResizeObserver' in window ? new ResizeObserver(resize) : null;
  observer?.observe(o.canvas);
  resize();

  let slow = 0, fast = 0, lastStamp = 0;
  function adapt() { // only ever steps down: a stage that oscillates looks worse than one that settles
    const now = performance.now(), ms = now - lastStamp; lastStamp = now;
    if (ms > 200) return;
    if (ms > 24) slow++; else fast++;
    if (slow + fast < 90) return;
    if (slow > fast) {
      if (quality.dpr > 1) { quality.dpr = Math.max(1, quality.dpr - 0.5); quality.tier = 'medium'; resize(); }
      else if (quality.bloom) { quality.bloom = false; quality.tier = 'low'; }
    }
    slow = fast = 0;
  }

  /* ---------- render ---------- */
  const tickers = new Set();
  let lastT = 0, lastSig = NaN;
  const signature = () => {
    let s = pointer.sx * 3.1 + pointer.sy * 7.3;
    for (const k in rig) s += rig[k] * (k.length + 1.37);
    for (const k in look) { const v = look[k]; s += typeof v === 'number' ? v * (k.length + 0.71) : v.r * 1.1 + v.g * 2.3 + v.b * 3.7; }
    return s;
  };

  /** Draw the frame for `time` (seconds). Returns false when nothing changed and the draw was skipped. */
  function render(time = 0, { force = false } = {}) {
    if (!enabled && !force) return false;
    const dt = Math.min(0.1, Math.max(0, time - lastT) || 1 / 60);
    lastT = time;
    tickers.forEach((fn) => fn(time, dt));
    applyRig(time, dt); applyLook(time);
    const sig = signature();
    const live = !reduced && (tickers.size > 0 || rig.breathe > 0 || rig.shake > 0 || look.grain > 0);
    if (!force && !film && !dirty && !live && sig === lastSig) return false;
    lastSig = sig; dirty = false;
    composer.render(dt);
    if (!film) adapt();
    return true;
  }

  function dispose() { removeEventListener('pointermove', onPointer); observer?.disconnect(); tickers.clear(); envTarget?.dispose(); pmrem.dispose(); composer.dispose(); target.dispose(); renderer.dispose(); }

  return {
    ok: true, THREE, renderer, scene, camera, composer, rig, look, quality,
    studio, key, floor, render, resize, dispose,
    /** Per-frame hook for anything driven by time: fn(time, dt). In film mode `time` is the timeline, not a clock. */
    onTick(fn) { tickers.add(fn); return () => tickers.delete(fn); },
    invalidate() { dirty = true; },
    /** Insert a display-space pass (after tone mapping, before the grade). looks.js uses this for media such as ink, pixel, halftone. */
    addPass(pass) { composer.insertPass(pass, composer.passes.indexOf(grade)); dirty = true; return pass; },
    /** Set false while an opaque scene covers the canvas: the stage stops drawing and the GPU rests. */
    get enabled() { return enabled; }, set enabled(v) { if (v && !enabled) dirty = true; enabled = !!v; },
    reduced, film: !!film,
  };
}
