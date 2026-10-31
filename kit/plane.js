/* plane.js — the UI plane camera.  Cinematic UI kit.
 *
 * Film mode, when the cast is a product's own interface: a flat DOM plane (a real, live UI: text, SVG,
 * keycaps) shot like a set — a steep oblique close-up, a razor-thin focal band, a slow motivated drift, a
 * rack focus, a cut on the action. No WebGL: CSS perspective + transforms, and depth of field from
 * backdrop-filter layers masked to depth bands. One medium among many ("UI macro"), never a default look.
 *
 *   import { uiPlane, SHOTS } from './plane.js';
 *   const cam = uiPlane(document.querySelector('.app'), { dof: true });   // its parent is the frame
 *   cam.shot(tl, 4.0, 3.5, { ...SHOTS.macro, ...cam.point('#keyA') }, { mag: 3.4, yaw: -6 });
 *   film.onFrame(() => cam.apply());                                      // or let the pose tweens do it
 *
 * The pose is a plain object, so GSAP keys it shot after shot like `rig` (kit rule: actors are data):
 *   mag    magnification at the focal point (1 = authored size)      fx, fy   the focal point, plane px
 *   pitch  rotateX°, + tips the top away (a desk seen from the front) cx, cy   where it sits in the frame, 0–1
 *   roll   rotateZ°, the diagonal                                     persp    CSS perspective px (lens)
 *   yaw    rotateY°                                                    rackX, rackY  focus offset from (fx, fy)
 * The focal point is drawn at exactly `mag` and stays in focus; a rack focus tweens rackX / rackY.
 *
 * Every frame is a function of the pose: nothing reads a clock. The plane is never given
 * `will-change: transform`, so Chrome re-rasterises its text at the drawn scale on every frame (sharp at
 * 6×); a bitmap (screenshot) placed on a plane must be captured at the shot's magnification instead.
 */

/** Camera presets for flat UI planes, extreme macro → wide. Spread them, then override per shot. Roll signs
 *  are a starting point: alternate the diagonal from cut to cut (the [film] audit warns when two consecutive
 *  shots share both scale and roll sign). */
export const SHOTS = Object.freeze({
  xmacro: Object.freeze({ mag: 5.6, pitch: 50, roll: -9, yaw: 12, persp: 1100, dof: Object.freeze({ band: 40, k: 0.16, maxBlur: 16 }) }),
  macro: Object.freeze({ mag: 3.0, pitch: 38, roll: 7, yaw: -10, persp: 1400, dof: Object.freeze({ band: 90, k: 0.08, maxBlur: 12 }) }),
  medium: Object.freeze({ mag: 1.6, pitch: 22, roll: -4, yaw: 6, persp: 1900, dof: Object.freeze({ band: 220, k: 0.04, maxBlur: 7 }) }),
  wide: Object.freeze({ mag: 0.95, pitch: 8, roll: 0, yaw: 0, persp: 2600, dof: null }),
});

/** Which scale a magnification reads as. */
export function scaleOf(mag) { return mag >= 4.2 ? 'xmacro' : mag >= 2.2 ? 'macro' : mag >= 1.25 ? 'medium' : 'wide'; }

const POSE_KEYS = ['mag', 'pitch', 'roll', 'yaw', 'persp', 'fx', 'fy', 'cx', 'cy', 'rackX', 'rackY', 'band', 'k', 'maxBlur'];
const n4 = (v) => +(+v).toFixed(4);
const SHOT_LOG = [];

/**
 * Put a DOM element on a camera. `el` is the plane (author it at its real size, position: absolute is set
 * for you); its parent is the frame (the viewport of this shot).
 * options: { dof: true | { copies, feather }, pose: {...} }
 */
export function uiPlane(el, options = {}) {
  const frame = el.parentElement;
  if (!frame) throw new Error('uiPlane: the plane needs a parent (the frame)');
  if (getComputedStyle(frame).position === 'static') frame.style.position = 'relative';
  frame.style.overflow = 'hidden';
  Object.assign(el.style, { position: 'absolute', left: '0px', top: '0px', transformOrigin: '0 0', margin: '0' });
  el.style.willChange = 'auto'; // re-raster at the drawn scale: never cache a 1× bitmap and upscale it
  const name = options.name || el.id || el.className.split(' ')[0] || 'plane';

  const base = Object.freeze({ mag: 1, pitch: 0, roll: 0, yaw: 0, persp: 2000, fx: 0, fy: 0, cx: 0.5, cy: 0.5, rackX: 0, rackY: 0, band: 120, k: 0.06, maxBlur: 0, ...stripDof(options.pose || {}) });
  const pose = { ...base };
  const dofOpt = options.dof ? { copies: 6, feather: 0.06, ...(options.dof === true ? {} : options.dof) } : null;
  const layers = [];
  if (dofOpt) {
    for (let i = 0; i < dofOpt.copies; i++) {
      const d = document.createElement('div');
      d.className = 'plane-dof';
      d.setAttribute('aria-hidden', 'true');
      d.style.cssText = 'position:absolute;inset:0;pointer-events:none';
      layers.push(d);
    }
    // in order right after the plane, below anything else the frame holds (type, grade)
    let ref = el;
    for (const d of layers) { ref.after(d); ref = d; }
  }

  let last = '';
  function matrix(p) {
    const W = frame.clientWidth || 1920, H = frame.clientHeight || 1080;
    return new DOMMatrix()
      .translate(p.cx * W, p.cy * H)
      .rotateAxisAngle(0, 0, 1, p.roll)
      .rotateAxisAngle(1, 0, 0, p.pitch)
      .rotateAxisAngle(0, 1, 0, p.yaw)
      .scale(p.mag, p.mag, p.mag)
      .translate(-p.fx, -p.fy);
  }
  /** Plane point (u, v) → { x, y } in the frame (perspective applied) and its depth from the lens. */
  function project(u, v, p = pose, M = matrix(p)) {
    const W = frame.clientWidth || 1920, H = frame.clientHeight || 1080, ox = p.cx * W, oy = p.cy * H;
    const q = M.transformPoint(new DOMPoint(u, v, 0, 1));
    const depth = p.persp - q.z, s = p.persp / Math.max(1e-3, depth);
    return { x: ox + (q.x - ox) * s, y: oy + (q.y - oy) * s, depth, z: q.z };
  }

  function apply() {
    const p = pose, W = frame.clientWidth || 1920, H = frame.clientHeight || 1080;
    const key = POSE_KEYS.map((k) => n4(p[k])).join(',');
    if (key === last) return api;
    last = key;
    frame.style.perspective = `${n4(p.persp)}px`;
    frame.style.perspectiveOrigin = `${n4(p.cx * W)}px ${n4(p.cy * H)}px`;
    el.style.transform = `translate(${n4(p.cx * W)}px, ${n4(p.cy * H)}px) rotateZ(${n4(p.roll)}deg) rotateX(${n4(p.pitch)}deg) rotateY(${n4(p.yaw)}deg) scale(${n4(p.mag)}) translate(${n4(-p.fx)}px, ${n4(-p.fy)}px)`;
    if (layers.length) focus(W, H);
    return api;
  }

  /* Depth of field. Depth on a flat plane is linear in plane coordinates, and lines of equal depth project
   * to parallel lines on screen, so each blur level is one linear-gradient mask in screen space. Layers are
   * cumulative (layer i covers everything at least D_i from the focus), and stacked backdrop blurs compound
   * as the root of the sum of squares, so each adds only the increment. */
  function focus(W, H) {
    const p = pose, M = matrix(p);
    const fu = p.fx + p.rackX, fv = p.fy + p.rackY;
    const f0 = project(fu, fv, p, M);
    const gu = project(fu + 1, fv, p, M).depth - f0.depth, gv = project(fu, fv + 1, p, M).depth - f0.depth;
    const gl = Math.hypot(gu, gv);
    const off = () => layers.forEach((d) => { d.style.backdropFilter = ''; d.style.webkitBackdropFilter = ''; d.style.maskImage = ''; d.style.webkitMaskImage = ''; d.style.display = 'none'; });
    if (!(p.maxBlur > 0.05) || gl < 1e-4) return off();
    const nu = gu / gl, nv = gv / gl;
    // a point on the plane `dd` px of depth from the focus, projected; null if it falls behind the lens
    const at = (dd) => { const q = project(fu + (nu * dd) / gl, fv + (nv * dd) / gl, p, M); return q.depth > 20 ? q : null; };
    const a = at(-1), b = at(1);
    if (!a || !b) return off();
    let dx = b.x - a.x, dy = b.y - a.y; const dl = Math.hypot(dx, dy) || 1; dx /= dl; dy /= dl;
    const ang = Math.atan2(dx, -dy); // CSS gradient angle: 0deg points up, clockwise
    const L = Math.abs(W * Math.sin(ang)) + Math.abs(H * Math.cos(ang));
    const pct = (q) => 50 + (((q.x - W / 2) * dx + (q.y - H / 2) * dy) / L) * 100;
    const n = layers.length, feather = (dofOpt.feather ?? 0.06) * 100;
    let prev = 0;
    layers.forEach((d, i) => {
      const blur = (p.maxBlur * (i + 1)) / n, inc = Math.sqrt(Math.max(0, blur * blur - prev * prev)); prev = blur;
      const D = p.band / 2 + (blur - p.maxBlur / n / 2) / Math.max(1e-4, p.k); // depth where this blur level begins
      const near = at(-D), far = at(D);
      const sN = near ? pct(near) : -1e4, sF = far ? pct(far) : 1e4;
      if (sN <= -1e3 && sF >= 1e3) { d.style.display = 'none'; return; }
      d.style.display = '';
      const f = Math.max(0.5, feather * (1 + i * 0.35));
      const g = `linear-gradient(${n4((ang * 180) / Math.PI)}deg, #000 ${n4(sN - f)}%, transparent ${n4(sN + f)}%, transparent ${n4(sF - f)}%, #000 ${n4(sF + f)}%)`;
      d.style.maskImage = g; d.style.webkitMaskImage = g;
      const bf = `blur(${n4(inc)}px)`;
      d.style.backdropFilter = bf; d.style.webkitBackdropFilter = bf;
    });
  }

  const api = {
    el, frame, pose, name, apply, project,
    /** The centre of a child element (selector or node) in plane coordinates: { fx, fy }, to aim a shot at it. */
    point(target, ax = 0.5, ay = 0.5) {
      const t = typeof target === 'string' ? el.querySelector(target) : target;
      if (!t) throw new Error(`uiPlane(${name}).point: nothing matches ${target}`);
      let x = 0, y = 0, n = t;
      while (n && n !== el) { x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent; }
      return { fx: x + t.offsetWidth * ax, fy: y + t.offsetHeight * ay };
    },
    /**
     * One shot: key the pose from `from` to `to` over [at, at + duration] and log it for the audit.
     * `from` may spread a SHOTS preset (its dof numbers become band / k / maxBlur); `to` only needs what moves.
     * The camera should still be moving when the cut comes: end the drift after the shot, not before it.
     */
    shot(tl, at, duration, from, to = {}, ease = 'none') {
      // The cut sets the whole pose (anything not given returns to the camera's base pose, so nothing leaks
      // from the previous shot); the drift tweens only what changes. A rack focus or a second move inside
      // the shot is then a plain tl.to(cam.pose, { rackY: 0, … }, t) that nothing else is fighting.
      const a = { ...base, ...stripDof(from) }, b = { ...a, ...stripDof(to) };
      tl.set(pose, { ...a, onUpdate: apply }, at);
      const moved = Object.fromEntries(POSE_KEYS.filter((k) => b[k] !== a[k]).map((k) => [k, b[k]]));
      if (Object.keys(moved).length) tl.to(pose, { ...moved, duration, ease, onUpdate: apply }, at);
      SHOT_LOG.push({ at, duration, plane: name, mag: a.mag, roll: a.roll, label: from.label || to.label || '' });
      return api;
    },
  };
  apply();
  return api;
}

/** A preset's `dof` becomes flat pose numbers (band, k, maxBlur), so a rack or a lens change tweens. */
function stripDof(p) {
  const { dof, label, ...rest } = p || {};
  if (dof === null) return { ...rest, maxBlur: 0 };
  if (dof) return { ...rest, band: dof.band, k: dof.k, maxBlur: dof.maxBlur };
  return rest;
}

/** The [film] audit for plane shots: two consecutive shots that share both scale and diagonal read as one
 *  shot jumped — change the size two steps, or flip the roll. Runs by itself when film.ready() resolves. */
export function auditShots(label = 'film') {
  const shots = [...SHOT_LOG].sort((a, b) => a.at - b.at);
  let found = 0;
  for (let i = 1; i < shots.length; i++) {
    const a = shots[i - 1], b = shots[i];
    const sa = scaleOf(a.mag), sb = scaleOf(b.mag), ra = Math.sign(Math.round(a.roll)), rb = Math.sign(Math.round(b.roll));
    if (sa === sb && ra === rb) {
      found++;
      console.warn(`[${label}] consecutive plane shots at ${a.at.toFixed(2)} s (${a.plane}) and ${b.at.toFixed(2)} s (${b.plane}) share scale (${sa}) and diagonal (roll ${ra < 0 ? '−' : ra > 0 ? '+' : '0'}): change the size or flip the roll`);
    }
  }
  return found;
}
if (typeof window !== 'undefined') addEventListener('film-ready', () => auditShots('film'), { once: true });

/* ----------------------------------------------------------------------------------------------------
 * UI performance recipes. Each is a pure function of the timeline, like everything else in film mode.
 * -------------------------------------------------------------------------------------------------- */

/** Appear: the house entrance for a UI element arriving by itself — 0.35 s, 12 px, 6 px of blur, a fast
 *  settle with no overshoot. For a panel, a toast, a row. Not for words someone must read on a beat. */
export function appear(tl, targets, at, { y = 12, blur = 6, duration = 0.35, stagger = 0 } = {}) {
  return tl.fromTo(targets, { opacity: 0, y, filter: `blur(${blur}px)` }, { opacity: 1, y: 0, filter: 'blur(0px)', duration, ease: 'expo.out', stagger }, at);
}

/** Stipple: generated text or a drawn result dissolving in through a cell pattern (2×2 px cells, a hash per
 *  cell), the way a machine-written draft should arrive. Returns { p }: tween p 0 → 1. Deterministic. */
export function stipple(el, { cell = 2, steps = 24, tile = 96, seed = 7, soft = 0.08 } = {}) {
  const urls = [];
  const cv = document.createElement('canvas'); cv.width = cv.height = tile;
  const cx = cv.getContext('2d'), cells = Math.ceil(tile / cell);
  const h = (x, y) => { let v = (Math.imul(x, 374761393) + Math.imul(y, 668265263) + Math.imul(seed, 1442695041)) | 0; v = Math.imul(v ^ (v >>> 13), 1274126177); return ((v ^ (v >>> 16)) >>> 0) / 4294967296; };
  for (let s = 0; s <= steps; s++) {
    const th = s / steps;
    cx.clearRect(0, 0, tile, tile);
    for (let y = 0; y < cells; y++) for (let x = 0; x < cells; x++) {
      const a = Math.min(1, Math.max(0, (th - h(x, y) * (1 - soft)) / soft));
      if (a > 0) { cx.fillStyle = `rgba(0,0,0,${a.toFixed(3)})`; cx.fillRect(x * cell, y * cell, cell, cell); }
    }
    urls.push(`url(${cv.toDataURL('image/png')})`);
  }
  let p = 1;
  const fx = {
    get p() { return p; },
    set p(v) {
      p = Math.min(1, Math.max(0, v));
      if (p >= 1) { el.style.maskImage = el.style.webkitMaskImage = ''; return; }
      const u = urls[Math.round(p * steps)];
      el.style.maskImage = el.style.webkitMaskImage = u;
      el.style.maskSize = el.style.webkitMaskSize = `${tile}px ${tile}px`;
      el.style.maskRepeat = el.style.webkitMaskRepeat = 'repeat';
    },
  };
  fx.p = 0;
  return fx;
}

/**
 * A cursor walkthrough, on the plane (so the camera carries it). Use it only when the film teaches a flow
 * someone will repeat with a mouse; when the product acts by itself, show it acting by itself.
 *   const cur = uiCursor(cam, [{ t: 3.0, x: 900, y: 640 }, { t: 3.8, x: 1210, y: 702, click: true }]);
 *   film.onFrame((t) => cur.at(t));
 * Moves ease in and out along a slight arc (a hand, not a tween on a ruler); a click dips the arrow and
 * leaves a ring for 0.35 s. Positions are plane px.
 */
export function uiCursor(cam, keys, { size = 26, color = '#fff', ring = 'rgba(255,255,255,.55)' } = {}) {
  const el = document.createElement('div');
  el.setAttribute('aria-hidden', 'true');
  el.style.cssText = `position:absolute;left:0;top:0;width:${size}px;height:${size}px;z-index:50;pointer-events:none;transform-origin:2px 2px`;
  el.innerHTML = `<svg viewBox="0 0 24 24" width="${size}" height="${size}" style="display:block;overflow:visible;filter:drop-shadow(0 2px 3px rgba(0,0,0,.45))"><path d="M2 2 L2 19 L6.6 14.8 L9.6 21.4 L12.6 20 L9.7 13.6 L16 13.6 Z" fill="${color}" stroke="#111" stroke-width="1.2" stroke-linejoin="round"/></svg>`;
  const rg = document.createElement('div');
  rg.style.cssText = `position:absolute;left:0;top:0;width:40px;height:40px;margin:-20px 0 0 -20px;border-radius:50%;border:2px solid ${ring};z-index:49;pointer-events:none;opacity:0`;
  cam.el.append(rg, el);
  const K = [...keys].sort((a, b) => a.t - b.t);
  const ease = (k) => (k < 0.5 ? 4 * k * k * k : 1 - (-2 * k + 2) ** 3 / 2);
  return {
    el,
    at(t) {
      let x = K[0].x, y = K[0].y;
      for (let i = 1; i < K.length; i++) {
        const a = K[i - 1], b = K[i], dur = Math.min(b.t - a.t, b.move ?? Math.max(0.35, Math.min(0.9, Math.hypot(b.x - a.x, b.y - a.y) / 900)));
        const s = b.t - dur;
        if (t >= b.t) { x = b.x; y = b.y; continue; }
        if (t > s) {
          const k = ease((t - s) / dur), arc = Math.sin(Math.PI * k) * 0.08;
          x = a.x + (b.x - a.x) * k - (b.y - a.y) * arc; y = a.y + (b.y - a.y) * k + (b.x - a.x) * arc;
        }
        break;
      }
      let dip = 1, ro = 0, rs = 0.4;
      for (const c of K) if (c.click && t >= c.t && t < c.t + 0.35) { const u = (t - c.t) / 0.35; dip = 0.86 + 0.14 * Math.min(1, u * 3); ro = 1 - u; rs = 0.4 + u * 0.9; }
      el.style.transform = `translate(${n4(x)}px, ${n4(y)}px) scale(${n4(dip)})`;
      rg.style.transform = `translate(${n4(x)}px, ${n4(y)}px) scale(${n4(rs)})`;
      rg.style.opacity = n4(ro);
      el.style.opacity = t < K[0].t - 0.2 ? 0 : 1;
    },
  };
}
