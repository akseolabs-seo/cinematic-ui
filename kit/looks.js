/* looks.js — the lab.  Cinematic UI kit.
 *
 * A film is shot in a medium: 35 mm, 16 mm, cel animation, ink on paper, stop motion. This file is the
 * same choice for the stage. Photoreal (stage.js + props.js) is one medium among several; these are the
 * others, each verified in a browser:
 *
 *   post looks      ink · sketch · pixel · halftone · crt        (whole-frame treatments, each with `amount`)
 *   materials       toon · outline · flat                         (cel shading for 3D casts)
 *   plates          liquidPlate · gradientPlate                   (moving grounds)
 *   2.5D            loadTexture · imagePlane · fitToCamera        (illustrations and photographs as layered planes)
 *   footage         loadVideo · syncVideo                         (video as a plane in the set, graded with the rest)
 *   DOM             boil                                          (the wobble of a hand-drawn line, for HTML and SVG)
 *
 * Post looks return a plain object of numbers you can tween:  const ink = looks.ink(stage); gsap.to(ink, { amount: 1 });
 * For non-photoreal media create the stage with { tone: 'none', bloom: false } so colours arrive unaltered.
 */
import * as THREE from 'three';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';

const VERT = 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }';
const COMMON = /* glsl */ `
  uniform sampler2D tDiffuse; uniform vec2 uResolution; uniform float uTime, uAmount; varying vec2 vUv;
  const vec3 W = vec3(0.2126, 0.7152, 0.0722);
  float lum(vec3 c){ return dot(c, W); }
  float hash(vec2 p){ vec3 q = fract(vec3(p.xyx) * 0.1031); q += dot(q, q.yzx + 33.33); return fract((q.x + q.y) * q.z); }
  float noise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y); }
  float fbm(vec2 p){ float a = 0.0, w = 0.5; for (int i = 0; i < 4; i++){ a += noise(p) * w; p = p * 2.03 + 11.7; w *= 0.5; } return a; }
  float sobel(vec2 uv, float px){ vec2 d = px / uResolution;
    float tl = lum(texture2D(tDiffuse, uv + d * vec2(-1, 1)).rgb), t = lum(texture2D(tDiffuse, uv + d * vec2(0, 1)).rgb), tr = lum(texture2D(tDiffuse, uv + d * vec2(1, 1)).rgb);
    float l = lum(texture2D(tDiffuse, uv + d * vec2(-1, 0)).rgb), r = lum(texture2D(tDiffuse, uv + d * vec2(1, 0)).rgb);
    float bl = lum(texture2D(tDiffuse, uv + d * vec2(-1, -1)).rgb), b = lum(texture2D(tDiffuse, uv + d * vec2(0, -1)).rgb), br = lum(texture2D(tDiffuse, uv + d * vec2(1, -1)).rgb);
    return length(vec2(tr + 2.0 * r + br - tl - 2.0 * l - bl, tl + 2.0 * t + tr - bl - 2.0 * b - br)); }
`;
const col = (c) => { const k = new THREE.Color(c); return new THREE.Vector3(k.r, k.g, k.b).set(...k.getHexString().match(/../g).map((h) => parseInt(h, 16) / 255)); }; // display-space rgb

/* One post look = one ShaderPass in display space (after tone mapping, before the grade), driven by a plain
   object of numbers. Every numeric param maps to a uniform `u<Name>`. */
function post(stage, fragment, params, extra = {}) {
  const state = { amount: 1, ...params };
  if (!stage.ok) return state;
  const uniforms = { tDiffuse: { value: null }, uResolution: { value: new THREE.Vector2(1, 1) }, uTime: { value: 0 }, uAmount: { value: 1 } };
  for (const k in params) uniforms['u' + k[0].toUpperCase() + k.slice(1)] = { value: params[k] };
  for (const k in extra) uniforms[k] = { value: extra[k] };
  const pass = new ShaderPass({ uniforms, vertexShader: VERT, fragmentShader: COMMON + fragment });
  pass.setSize = (w, h) => pass.uniforms.uResolution.value.set(w, h);
  stage.addPass(pass);
  stage.onTick((t) => {
    pass.uniforms.uTime.value = t; pass.uniforms.uAmount.value = state.amount; pass.enabled = state.amount > 0.001;
    for (const k in params) pass.uniforms['u' + k[0].toUpperCase() + k.slice(1)].value = state[k];
  });
  state.pass = pass;
  return state;
}

/** 水墨 — ink wash on paper: tone becomes layered washes with wet, wandering edges; contours become dry-brush line.
 *  tint keeps some of the scene's own colour (淡彩). Works on 3D, on photographs, on anything behind it. */
export function ink(stage, { paper = '#efe9dc', ink: inkColor = '#15120f', levels = 4, edge = 1.4, bleed = 0.7, grain = 0.5, tint = 0 } = {}) {
  return post(stage, /* glsl */ `
    uniform float uLevels, uEdge, uBleed, uGrain, uTint; uniform vec3 uPaper, uInk;
    void main(){
      vec2 p = vUv * vec2(uResolution.x / uResolution.y, 1.0);
      vec2 warp = (vec2(fbm(p * 3.0), fbm(p * 3.0 + 7.3)) - 0.5) * uBleed * 0.03;            // the brush never follows the pencil exactly
      vec4 src0 = texture2D(tDiffuse, vUv); vec3 src = texture2D(tDiffuse, vUv + warp).rgb;
      float dk = 1.0 - lum(src);
      float q = dk * uLevels + (fbm(p * 9.0) - 0.5) * uBleed * 1.3 * smoothstep(0.03, 0.3, dk);   // wash boundaries wander; bare paper stays bare
      float f = fract(q), wash = (floor(q) + smoothstep(0.3, 0.7, f)) / uLevels;
      wash += (1.0 - smoothstep(0.0, 0.12, abs(f - 0.5))) * 0.06 * uBleed;                    // pigment pools at the edge of a wash
      float line = smoothstep(0.12, 0.55, sobel(vUv + warp, 1.5) * uEdge) * (0.55 + 0.45 * noise(p * 70.0)); // dry brush breaks up
      float amt = clamp(wash * 0.92 + line * 0.85, 0.0, 1.0);
      vec3 inkc = mix(uInk, uInk + (src - lum(src)) * 0.9, uTint);
      vec3 c = mix(uPaper, inkc, amt);
      c = mix(c, c * (0.6 + 0.4 * src / max(lum(src), 0.08)), uTint * (1.0 - amt));          // 淡彩: colour lives in the light washes
      c *= 1.0 - (fbm(p * vec2(60.0, 240.0)) - 0.5) * 0.22 * uGrain;                           // paper fibre
      gl_FragColor = vec4(mix(src0.rgb, clamp(c, 0.0, 1.0), uAmount), src0.a);
    }`, { levels, edge, bleed, grain, tint }, { uPaper: col(paper), uInk: col(inkColor) });
}

/** 手繪 — pencil and wash: contours become line, shade becomes cross-hatching, and the line "boils" (re-drawn at
 *  `fps`, like frames of hand-drawn animation). color keeps the scene's colour as a watercolour wash under the pencil. */
export function sketch(stage, { paper = '#f4efe4', ink: inkColor = '#2a2622', line = 1, hatch = 0.7, boil = 1, color = 0.6, fps = 8, spacing = 7 } = {}) {
  return post(stage, /* glsl */ `
    uniform float uLine, uHatch, uBoil, uColor, uFps, uSpacing; uniform vec3 uPaper, uInk;
    float strokes(vec2 px, float dir, float wob){ float v = (px.x + dir * px.y) / uSpacing + wob; return 1.0 - smoothstep(0.12, 0.3, abs(fract(v) - 0.5)); }
    void main(){
      vec2 p = vUv * vec2(uResolution.x / uResolution.y, 1.0);
      float t = floor(uTime * uFps);
      vec2 wob = (vec2(noise(p * 14.0 + t * 7.31), noise(p * 14.0 + 31.0 + t * 5.17)) - 0.5) * uBoil * 0.005;
      vec4 src0 = texture2D(tDiffuse, vUv); vec3 src = texture2D(tDiffuse, vUv + wob).rgb; float l = lum(src);
      vec2 px = (vUv + wob) * uResolution;
      float contour = smoothstep(0.1, 0.4, sobel(vUv + wob, 1.2) * uLine) * (0.7 + 0.3 * noise(px * 0.35));
      float w = noise(p * 5.0 + t) * 0.6, h = 0.0;
      h = max(h, strokes(px, 1.0, w) * step(l, 0.62));
      h = max(h, strokes(px, -1.0, w + 0.3) * step(l, 0.4));
      h = max(h, strokes(px * 1.7, 0.2, w + 0.6) * step(l, 0.22));
      h *= 0.55 + 0.45 * noise(px * 0.5);                                                       // graphite is uneven
      vec3 wash = mix(vec3(1.0), src / max(l, 0.1) * (0.55 + 0.45 * smoothstep(0.0, 0.9, l)), uColor);
      wash = mix(wash, vec3(1.0), smoothstep(0.75, 1.0, l) * 0.6);                              // leave the paper in the highlights
      vec3 c = uPaper * clamp(wash, 0.0, 1.15);
      c = mix(c, uInk, clamp(max(contour, h * uHatch), 0.0, 1.0) * 0.9);
      c *= 1.0 - (fbm(p * 90.0) - 0.5) * 0.12;
      gl_FragColor = vec4(mix(src0.rgb, clamp(c, 0.0, 1.0), uAmount), src0.a);
    }`, { line, hatch, boil, color, fps, spacing }, { uPaper: col(paper), uInk: col(inkColor) });
}

/** 像素 — low resolution, ordered dither, a limited palette. size is the pixel size in screen pixels; levels the
 *  steps per channel when no palette is given; palette up to 8 colours ('#hex'). */
export function pixel(stage, { size = 5, levels = 5, dither = 0.6, palette = [] } = {}) {
  const pal = Array.from({ length: 8 }, (_, i) => col(palette[i] || '#000000'));
  return post(stage, /* glsl */ `
    uniform float uSize, uLevels, uDither; uniform vec3 uPalette[8]; uniform int uCount;
    const float M[16] = float[16](0.0, 8.0, 2.0, 10.0, 12.0, 4.0, 14.0, 6.0, 3.0, 11.0, 1.0, 9.0, 15.0, 7.0, 13.0, 5.0);
    void main(){
      vec4 src0 = texture2D(tDiffuse, vUv);
      vec2 cell = floor(vUv * uResolution / uSize);
      vec3 c = texture2D(tDiffuse, (cell + 0.5) * uSize / uResolution).rgb;
      float d = (M[int(mod(cell.x, 4.0)) + int(mod(cell.y, 4.0)) * 4] / 16.0 - 0.47) * uDither;
      if (uCount > 0) {
        c += d * 0.28; float best = 1e9; vec3 pick = c;
        for (int i = 0; i < 8; i++) { if (i >= uCount) break; vec3 e = c - uPalette[i]; float dd = dot(e, e); if (dd < best) { best = dd; pick = uPalette[i]; } }
        c = pick;
      } else c = floor(c * (uLevels - 1.0) + 0.5 + d) / (uLevels - 1.0);
      gl_FragColor = vec4(mix(src0.rgb, clamp(c, 0.0, 1.0), uAmount), src0.a);
    }`, { size, levels, dither }, { uPalette: pal, uCount: Math.min(8, palette.length) });
}

/** 網點印刷 — halftone. mode 'mono': one ink on paper. mode 'cmy': three screens at different angles, with
 *  `misregister` pixels of plate slip (risograph, newsprint, comic). cell is the dot pitch in pixels. */
export function halftone(stage, { mode = 'mono', cell = 7, angle = 0.4, paper = '#f2ede3', ink: inkColor = '#16130f', misregister = 0, contrast = 1 } = {}) {
  return post(stage, /* glsl */ `
    uniform float uCell, uAngle, uMisregister, uContrast, uCmy; uniform vec3 uPaper, uInk;
    vec2 rot(vec2 p, float a){ float s = sin(a), c = cos(a); return vec2(c * p.x - s * p.y, s * p.x + c * p.y); }
    float screen(float a, vec2 off, int ch){
      vec2 q = rot(vUv * uResolution + off, a) / uCell, g = fract(q) - 0.5;
      vec3 s = texture2D(tDiffuse, (rot((floor(q) + 0.5) * uCell, -a) - off) / uResolution).rgb;
      float v = ch == 0 ? s.r : ch == 1 ? s.g : ch == 2 ? s.b : lum(s);
      v = clamp((v - 0.5) * uContrast + 0.5, 0.0, 1.0);
      float r = sqrt(1.0 - v) * 0.74;                                                           // dot area follows darkness
      return 1.0 - smoothstep(r - 0.06, r + 0.06, length(g));
    }
    void main(){
      vec4 src0 = texture2D(tDiffuse, vUv); vec3 c;
      if (uCmy > 0.5) {
        c = uPaper;
        c *= mix(vec3(1.0), vec3(0.05, 0.75, 0.95), screen(uAngle + 0.26, vec2(uMisregister, 0.0), 0));         // cyan plate prints where red is missing
        c *= mix(vec3(1.0), vec3(0.95, 0.12, 0.55), screen(uAngle + 1.31, vec2(-uMisregister, uMisregister), 1)); // magenta
        c *= mix(vec3(1.0), vec3(1.0, 0.9, 0.1), screen(uAngle, vec2(0.0, -uMisregister), 2));                  // yellow
      } else c = mix(uPaper, uInk, screen(uAngle, vec2(0.0), 3));
      gl_FragColor = vec4(mix(src0.rgb, c, uAmount), src0.a);
    }`, { cell, angle, misregister, contrast }, { uPaper: col(paper), uInk: col(inkColor), uCmy: mode === 'cmy' ? 1 : 0 });
}

/** 復古霓虹／映像管 — a CRT: curved glass, scanlines, an aperture mask, colour bleeding sideways. Pair it with
 *  emissive tubes and look.bloom (create the stage with bloom on) for neon. */
export function crt(stage, { scanlines = 0.35, curve = 0.12, mask = 0.18, bleed = 1.5, lines = 0 } = {}) {
  return post(stage, /* glsl */ `
    uniform float uScanlines, uCurve, uMask, uBleed, uLines;
    void main(){
      vec4 src0 = texture2D(tDiffuse, vUv);
      vec2 q = vUv * 2.0 - 1.0; q *= 1.0 + uCurve * dot(q, q) * 0.22; vec2 uv = q * 0.5 + 0.5;  // barrel distortion of the tube
      float sh = uBleed / uResolution.x;
      vec3 c = vec3(texture2D(tDiffuse, uv + vec2(sh, 0.0)).r, texture2D(tDiffuse, uv).g, texture2D(tDiffuse, uv - vec2(sh, 0.0)).b);
      float n = uLines > 0.0 ? uLines : uResolution.y / 3.0;                                     // one scanline every three pixels unless told
      c *= 1.0 - uScanlines * (0.5 - 0.5 * cos(uv.y * n * 6.28318));
      float m = mod(floor(vUv.x * uResolution.x), 3.0);
      c *= mix(vec3(1.0), vec3(m == 0.0 ? 1.25 : 0.82, m == 1.0 ? 1.25 : 0.82, m == 2.0 ? 1.25 : 0.82), uMask);
      vec2 e = smoothstep(vec2(0.0), vec2(0.012), uv) * smoothstep(vec2(0.0), vec2(0.012), 1.0 - uv);
      c *= e.x * e.y * (1.0 - 0.35 * dot(q, q) * uCurve * 2.0);
      gl_FragColor = vec4(mix(src0.rgb, clamp(c, 0.0, 1.0), uAmount), src0.a);
    }`, { scanlines, curve, mask, bleed, lines });
}

/* ---------------------------------------------------------------- cel shading ---------------------------------- */

/** Cel-shaded material: light falls in `steps` flat bands. Toon materials ignore the studio environment — light them
 *  with stage.key() plus an AmbientLight / HemisphereLight. */
export function toon(color = '#d95f3b', { steps = 3, ...rest } = {}) {
  const data = new Uint8Array(steps * 4);
  for (let i = 0; i < steps; i++) { const v = Math.round(((i + 0.5) / steps) * 255); data.set([v, v, v, 255], i * 4); }
  const ramp = new THREE.DataTexture(data, steps, 1, THREE.RGBAFormat);
  ramp.minFilter = ramp.magFilter = THREE.NearestFilter; ramp.needsUpdate = true;
  return new THREE.MeshToonMaterial({ color, gradientMap: ramp, ...rest });
}

/** An ink outline for a mesh: a slightly larger back-facing shell. Smooth-shaded geometry only (hard edges split). */
export function outline(mesh, { thickness = 0.025, color = '#141210' } = {}) {
  const hull = new THREE.Mesh(mesh.geometry, new THREE.ShaderMaterial({
    side: THREE.BackSide, uniforms: { uT: { value: thickness }, uColor: { value: new THREE.Color(color) } },
    vertexShader: 'uniform float uT; void main(){ gl_Position = projectionMatrix * modelViewMatrix * vec4(position + normalize(normal) * uT, 1.0); }',
    fragmentShader: 'uniform vec3 uColor; void main(){ gl_FragColor = vec4(uColor, 1.0); }',
  }));
  mesh.add(hull);
  return hull;
}

/** Unlit flat colour: cut paper, vector shapes, title-design geometry. */
export const flat = (color = '#e23b2e', o = {}) => new THREE.MeshBasicMaterial({ color, ...o });

/* ---------------------------------------------------------------- plates --------------------------------------- */

const plate = (fragment, uniforms, { width = 60, height = 34 } = {}) => {
  const mat = new THREE.ShaderMaterial({ uniforms: { uTime: { value: 0 }, uAspect: { value: width / height }, ...uniforms }, vertexShader: VERT, fragmentShader: fragment });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(width, height), mat);
  return { mesh, material: mat, uniforms: mat.uniforms, tick: (t) => { mat.uniforms.uTime.value = t; } };
};
const PLATE_NOISE = /* glsl */ `
  uniform float uTime, uAspect; varying vec2 vUv;
  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p){ vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y); }
  float fbm(vec2 p){ float a = 0.0, w = 0.5; for (int i = 0; i < 3; i++){ a += noise(p) * w; p = p * 2.02 + 9.1; w *= 0.5; } return a; }
`;

/** 液態流動 — a slow liquid surface (molten metal, oil, lacquer, lava): a warped height field lit like a fluid.
 *  colors: [deep, body, highlight]. Returns { mesh, uniforms, tick(time) }; call tick from stage.onTick. */
export function liquidPlate({ colors = ['#07080c', '#3a2a6b', '#f2c9a0'], scale = 1.3, speed = 0.06, gloss = 1, ...size } = {}) {
  const [a, b, c] = colors.map((x) => new THREE.Color(x));
  return plate(PLATE_NOISE + /* glsl */ `
    uniform vec3 uA, uB, uC; uniform float uScale, uSpeed, uGloss;
    float height(vec2 p){ float t = uTime * uSpeed; vec2 q = vec2(fbm(p + t), fbm(p + 5.2 - t * 0.8)); vec2 r = vec2(fbm(p + 3.0 * q + 1.7 + t * 0.6), fbm(p + 3.0 * q + 9.2)); return fbm(p + 2.6 * r); }
    void main(){
      vec2 p = (vUv - 0.5) * vec2(uAspect, 1.0) * uScale;
      float h = height(p), e = 0.012;
      vec3 n = normalize(vec3(height(p + vec2(e, 0.0)) - h, height(p + vec2(0.0, e)) - h, e * 1.6));  // surface normal from the height field
      float spec = pow(max(dot(n, normalize(vec3(0.35, 0.5, 0.8))), 0.0), 26.0) * uGloss;
      float fres = pow(1.0 - max(n.z, 0.0), 2.0);
      vec3 c = mix(uA, uB, smoothstep(0.25, 0.7, h)) + uC * (spec * 1.4 + fres * 0.35);
      gl_FragColor = vec4(c, 1.0);
    }`, { uA: { value: a }, uB: { value: b }, uC: { value: c }, uScale: { value: scale }, uSpeed: { value: speed }, uGloss: { value: gloss } }, size);
}

/** 漸變 — a mesh gradient: four colours drifting and blending like light through frosted glass.
 *  Returns { mesh, uniforms, tick(time) }. */
export function gradientPlate({ colors = ['#ff5f6d', '#ffc371', '#5f7cff', '#12c2e9'], speed = 0.08, softness = 2.4, ...size } = {}) {
  return plate(PLATE_NOISE + /* glsl */ `
    uniform vec3 uColors[4]; uniform float uSpeed, uSoft;
    void main(){
      vec2 p = (vUv - 0.5) * vec2(uAspect, 1.0); float t = uTime * uSpeed; vec3 c = vec3(0.0); float sum = 0.0;
      for (int i = 0; i < 4; i++) {
        float fi = float(i);
        vec2 o = vec2(sin(t * (0.9 + fi * 0.23) + fi * 2.1), cos(t * (0.7 + fi * 0.31) + fi * 1.3)) * vec2(0.55 * uAspect * 0.5, 0.42);
        float w = 1.0 / pow(length(p - o) + 0.18, uSoft * 2.0); c += uColors[i] * w; sum += w;
      }
      gl_FragColor = vec4(c / sum, 1.0);
    }`, { uColors: { value: colors.slice(0, 4).map((x) => new THREE.Color(x)) }, uSpeed: { value: speed }, uSoft: { value: softness } }, size);
}

/* ---------------------------------------------------------------- 2.5D ----------------------------------------- */

/** Load an image as a colour texture. Await it before reel.start() / film.ready(). */
export function loadTexture(url) {
  return new Promise((resolve, reject) => new THREE.TextureLoader().load(url, (t) => { t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 8; resolve(t); }, undefined, () => reject(new Error(`could not load ${url}`))));
}

/** An illustration or photograph as a plane in the set. `height` in world units; width follows the image.
 *  multiply: true lays artwork drawn on white straight onto whatever is behind it (ink on paper) — no cut-out needed.
 *  Use PNGs with alpha (transparent: true is set automatically) for real cut-outs. */
export function imagePlane(texture, { height = 4, multiply = false, opacity = 1 } = {}) {
  const img = texture.image, aspect = (img.videoWidth || img.naturalWidth || img.width) / (img.videoHeight || img.naturalHeight || img.height);
  const mat = new THREE.MeshBasicMaterial({ map: texture, transparent: true, opacity, depthWrite: false });
  if (multiply) { mat.blending = THREE.MultiplyBlending; mat.premultipliedAlpha = true; }
  return new THREE.Mesh(new THREE.PlaneGeometry(height * aspect, height), mat);
}

/** Load a video as a texture (muted, inline, looping). Resolves once its first frame is decodable.
 *  Site mode: call video.play() and let it run (pause it under reduced motion). Film mode: never play — drive it with
 *  syncVideo(video, t, texture) from film.onFrame so every rendered frame shows the exact frame of footage.
 *  Use it with imagePlane(texture, …) to put footage in the set, under the same light, looks and grade. */
export function loadVideo(url, { loop = true } = {}) {
  const video = Object.assign(document.createElement('video'), { src: url, muted: true, loop, playsInline: true, preload: 'auto', crossOrigin: 'anonymous' });
  video.setAttribute('playsinline', ''); video.setAttribute('muted', '');
  return new Promise((resolve, reject) => {
    video.addEventListener('loadeddata', () => {
      const texture = new THREE.VideoTexture(video);
      texture.colorSpace = THREE.SRGBColorSpace;
      resolve({ video, texture });
    }, { once: true });
    video.addEventListener('error', () => reject(new Error(`could not load ${url}`)), { once: true });
    video.load();
  });
}

/** Film mode: show the footage frame for timeline time `t` (looping by default) and resolve when it is on the texture.
 *  film.onFrame(async (t) => { await syncVideo(clip.video, t - 3, clip.texture); stage.render(t, { force: true }); }) */
export function syncVideo(video, t, texture, { loop = true } = {}) {
  const d = video.duration || 0;
  const target = Math.max(0, loop && d ? ((t % d) + d) % d : Math.min(t, Math.max(0, d - 0.04)));
  if (Math.abs(video.currentTime - target) < 0.004) { if (texture) texture.needsUpdate = true; return Promise.resolve(); }
  return new Promise((resolve) => {
    // 'seeked' means the frame at currentTime is decodable; upload it then. A timeout keeps a stalled decoder from
    // hanging a render (the frame is then whatever was last decoded, and the render log will show no error — check stills).
    let finished = false;
    const done = () => { if (finished) return; finished = true; clearTimeout(timer); if (texture) texture.needsUpdate = true; resolve(); };
    const timer = setTimeout(done, 3000);
    video.addEventListener('seeked', done, { once: true });
    video.currentTime = target;
  });
}

/** Scale a plane so it exactly fills the frame of a camera `distance` away with vertical `fov` and `aspect` —
 *  for building a multiplane whose layers line up at rest and separate as the camera moves. `cover` > 1 overscans. */
export function fitToCamera(mesh, { distance, fov = 30, aspect = 16 / 9, cover = 1.15 }) {
  const h = 2 * Math.tan(THREE.MathUtils.degToRad(fov) / 2) * distance, w = h * aspect;
  const g = mesh.geometry.parameters, s = Math.max(w / g.width, h / g.height) * cover;
  mesh.scale.setScalar(s);
  return mesh;
}

/* ---------------------------------------------------------------- DOM ------------------------------------------ */

/** 手繪線條的「沸騰」 for HTML and SVG: any element with class "boil" is re-displaced a few times a second, as if
 *  redrawn by hand. const b = boil(); stage.onTick(b.tick)  — or drive it from film.onFrame. Add in CSS:
 *  .boil { filter: var(--boil); }   Reduced motion holds one frame. */
export function boil({ frames = 4, fps = 8, scale = 2.2, frequency = 0.022 } = {}) {
  const ns = 'http://www.w3.org/2000/svg', svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('aria-hidden', 'true'); svg.style.cssText = 'position:absolute;width:0;height:0';
  for (let i = 0; i < frames; i++) svg.insertAdjacentHTML('beforeend', `<filter id="boil-${i}" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency="${frequency}" numOctaves="2" seed="${i * 7 + 3}" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="${scale}" xChannelSelector="R" yChannelSelector="G"/></filter>`);
  document.body.appendChild(svg);
  const root = document.documentElement, still = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let last = -1;
  const tick = (time = 0) => { const f = still ? 0 : Math.floor(time * fps) % frames; if (f !== last) { last = f; root.style.setProperty('--boil', `url(#boil-${f})`); } };
  tick(0);
  return { tick };
}
