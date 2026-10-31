/* props.js — the prop shop.  Cinematic UI kit.
 *
 * Small, tested building blocks for photoreal sets with no image files: a seamless backdrop, procedural
 * surface maps, turned (lathe) forms, physically based material starting points, dust in the light.
 * They are starting points to be re-proportioned, re-coloured and combined — not a look to ship as is.
 */
import * as THREE from 'three';
import { seeded } from './stage.js';

/** Seamless studio backdrop: a floor that sweeps up into a wall, so there is no horizon line. */
export function cyclorama({ color = '#1b1b1f', width = 60, depth = 24, height = 22, radius = 6, roughness = 0.92 } = {}) {
  const profile = [[0, depth]]; // [y, z] from the front edge of the floor…
  for (let i = 0; i <= 24; i++) { const a = (i / 24) * (Math.PI / 2); profile.push([radius - Math.cos(a) * radius, -depth * 0.25 - Math.sin(a) * radius]); } // …round the cove…
  profile.push([height, -depth * 0.25 - radius]); // …up the wall
  const pos = [], uv = [], idx = [];
  profile.forEach(([y, z], i) => { pos.push(-width / 2, y, z, width / 2, y, z); uv.push(0, i / (profile.length - 1), 1, i / (profile.length - 1)); });
  for (let i = 0; i < profile.length - 1; i++) { const a = i * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  geo.setIndex(idx); geo.computeVertexNormals();
  const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color, roughness, metalness: 0 }));
  mesh.receiveShadow = true;
  return mesh;
}

/** Tileable fractal value noise as a height field: { size, h: Float32Array 0..1 }. Deterministic per seed. */
export function noiseField(size = 512, seed = 1, { octaves = 5, scale = 4 } = {}) {
  const rnd = seeded(seed), G = 256, grid = new Float32Array(G * G).map(() => rnd());
  const at = (x, y) => grid[(((y % G) + G) % G) * G + (((x % G) + G) % G)];
  const sm = (t) => t * t * (3 - 2 * t);
  const value = (x, y) => { const xi = Math.floor(x), yi = Math.floor(y), u = sm(x - xi), v = sm(y - yi); return (at(xi, yi) * (1 - u) + at(xi + 1, yi) * u) * (1 - v) + (at(xi, yi + 1) * (1 - u) + at(xi + 1, yi + 1) * u) * v; };
  const h = new Float32Array(size * size);
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    let a = 0, amp = 0.5, f = scale;
    for (let o = 0; o < octaves; o++) { a += value((x / size) * f, (y / size) * f) * amp; amp *= 0.5; f *= 2; }
    h[y * size + x] = a;
  }
  return { size, h };
}

/** Height field → texture. `map(height, index)` returns [r, g, b] in 0..255. Data maps, so no colour space is set. */
export function fieldTexture({ size, h }, map = (v) => [v * 255, v * 255, v * 255]) {
  const cv = document.createElement('canvas'); cv.width = cv.height = size;
  const cx = cv.getContext('2d'), img = cx.createImageData(size, size);
  for (let i = 0; i < h.length; i++) { const [r, g, b] = map(h[i], i); img.data[i * 4] = r; img.data[i * 4 + 1] = g; img.data[i * 4 + 2] = b; img.data[i * 4 + 3] = 255; }
  cx.putImageData(img, 0, 0);
  const t = new THREE.CanvasTexture(cv);
  t.wrapS = t.wrapT = THREE.RepeatWrapping; t.anisotropy = 8;
  return t;
}

/** Roughness variation — the smudges and wear that stop a surface looking computer-clean. */
export const roughnessMap = (field, min = 0.35, max = 0.95) => fieldTexture(field, (v) => { const g = (min + v * (max - min)) * 255; return [g, g, g]; });

/** Tangent-space normal map from a height field: pores, orange peel, leather, cast metal. */
export function normalMap({ size, h }, strength = 2) {
  const at = (x, y) => h[((y + size) % size) * size + ((x + size) % size)];
  return fieldTexture({ size, h }, (_, i) => {
    const x = i % size, y = (i / size) | 0;
    const dx = (at(x + 1, y) - at(x - 1, y)) * strength, dy = (at(x, y + 1) - at(x, y - 1)) * strength, nz = 1 / 8, l = Math.hypot(dx, dy, nz);
    return [(-dx / l * 0.5 + 0.5) * 255, (-dy / l * 0.5 + 0.5) * 255, (nz / l * 0.5 + 0.5) * 255];
  });
}

/** A turned form (bottle, vase, bowl, knob, column, lens barrel) from a profile: [[radius, y], …] bottom to top.
 *  smooth: true runs a spline through the points (every corner rounds). smooth: false keeps the points as drawn,
 *  for hard shoulders, foot rings and machined steps — add your own extra points where you want a bevel. */
export function turned(profile, segments = 96, { smooth = true } = {}) {
  const pts = profile.map(([r, y]) => new THREE.Vector2(Math.max(r, 0.0001), y));
  const geo = new THREE.LatheGeometry(smooth ? new THREE.SplineCurve(pts).getPoints(Math.max(48, profile.length * 10)) : pts, segments);
  geo.computeVertexNormals();
  return geo;
}

/** Physically based starting points. Every one takes overrides: materials.glass({ attenuationColor: '#f5c9a0' }). */
export const materials = {
  ceramic: (o = {}) => new THREE.MeshPhysicalMaterial({ color: '#e9e4da', roughness: 0.28, clearcoat: 1, clearcoatRoughness: 0.12, ...o }),
  metal: (o = {}) => new THREE.MeshPhysicalMaterial({ color: '#c9ccd1', metalness: 1, roughness: 0.3, ...o }),                       // steel, aluminium; '#f0b95a' gold, '#b87333' copper
  glass: (o = {}) => new THREE.MeshPhysicalMaterial({ color: '#ffffff', roughness: 0.04, transmission: 1, thickness: 0.5, ior: 1.5, attenuationColor: '#cfeee2', attenuationDistance: 4, dispersion: 2, ...o }),
  frosted: (o = {}) => new THREE.MeshPhysicalMaterial({ color: '#ffffff', roughness: 0.45, transmission: 1, thickness: 0.8, ior: 1.45, ...o }),
  paint: (o = {}) => new THREE.MeshPhysicalMaterial({ color: '#7a0f18', metalness: 0.6, roughness: 0.42, clearcoat: 1, clearcoatRoughness: 0.04, ...o }), // car paint, lacquer
  softTouch: (o = {}) => new THREE.MeshPhysicalMaterial({ color: '#17181b', roughness: 0.78, sheen: 0.6, sheenRoughness: 0.5, sheenColor: '#6d7480', ...o }), // rubberised plastic
  velvet: (o = {}) => new THREE.MeshPhysicalMaterial({ color: '#2a1140', roughness: 1, sheen: 1, sheenRoughness: 0.35, sheenColor: '#b68cff', ...o }),
  pearl: (o = {}) => new THREE.MeshPhysicalMaterial({ color: '#f4f1ea', roughness: 0.22, iridescence: 1, iridescenceIOR: 1.6, iridescenceThicknessRange: [200, 500], clearcoat: 0.6, ...o }),
  emissive: (o = {}) => new THREE.MeshStandardMaterial({ color: '#000000', emissive: '#ffffff', emissiveIntensity: 6, ...o }),      // a practical: above 1 it blooms
};

/** Dust motes drifting in the light. Returns { points, tick(time) }; call tick from stage.onTick. */
export function dust({ count = 220, box = [14, 6, 8], center = [0, 2, 0], size = 0.03, color = '#fff2dc', opacity = 0.28, seed = 3 } = {}) {
  const rnd = seeded(seed), p = new Float32Array(count * 3), ph = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    p[i * 3] = center[0] + (rnd() - 0.5) * box[0]; p[i * 3 + 1] = center[1] + (rnd() - 0.5) * box[1]; p[i * 3 + 2] = center[2] + (rnd() - 0.5) * box[2];
    ph[i] = rnd() * 6.283;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(p, 3));
  geo.setAttribute('phase', new THREE.BufferAttribute(ph, 1));
  const mat = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    uniforms: { uTime: { value: 0 }, uSize: { value: size }, uColor: { value: new THREE.Color(color) }, uOpacity: { value: opacity }, uScale: { value: 1000 } },
    vertexShader: /* glsl */ `attribute float phase; uniform float uTime, uSize, uScale; varying float vA;
      void main(){ vec3 q = position; q.y += sin(uTime * 0.21 + phase) * 0.25; q.x += cos(uTime * 0.17 + phase * 1.7) * 0.2;
        vec4 mv = modelViewMatrix * vec4(q, 1.0); gl_Position = projectionMatrix * mv;
        gl_PointSize = uSize * uScale / -mv.z; vA = 0.55 + 0.45 * sin(phase * 3.0 + uTime * 0.6); }`,
    fragmentShader: /* glsl */ `uniform vec3 uColor; uniform float uOpacity; varying float vA;
      void main(){ float a = 1.0 - smoothstep(0.0, 0.5, length(gl_PointCoord - 0.5)); gl_FragColor = vec4(uColor, a * a * vA * uOpacity); }`,
  });
  const points = new THREE.Points(geo, mat);
  points.frustumCulled = false;
  const buf = new THREE.Vector2();
  points.onBeforeRender = (renderer) => { mat.uniforms.uScale.value = renderer.getDrawingBufferSize(buf).y; };
  return { points, material: mat, tick: (time) => { mat.uniforms.uTime.value = time; } };
}
