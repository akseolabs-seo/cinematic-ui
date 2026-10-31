/* reel.js — the playhead.  Cinematic UI kit.
 *
 * A page is a film whose playhead is the scrollbar. Every [data-scene] gets three clips on ONE
 * master GSAP timeline: `enter` (the cut in), `main` (the hold, while its .frame is pinned) and
 * `exit` (the cut out). Scroll position is mapped to master time, so any frame of the page can
 * be reproduced from one number — which is also what makes it screenable and recordable.
 *
 * Requires window.gsap. Lenis is optional. No Three.js dependency.
 *
 *   const reel = createReel({ lenis });
 *   reel.scene('arrival', ({ enter, main, exit, q, frame }) => {
 *     main.fromTo(rig, { z: 9 }, { z: 4 }, 0);                        // spans the whole clip; ease defaults to 'none'
 *     main.from(q('h1 .line'), { yPercent: 110, stagger: 0.05, duration: 0.25, ease: 'power3.out' }, 0.1); // 10%→35% of the clip
 *   });
 *   reel.intro(tl => tl.from('.slate', { opacity: 0, duration: 1.2 }));  // time-driven opening titles
 *   reel.onFrame(f => stage.render(f.time));
 *   reel.start();
 */
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));

/* ---- two guards that keep a scrubbed timeline honest (shared with film.js) ----
 * GSAP renders the start of every from()/fromTo() the moment it is created. For an entrance on a DOM
 * element that is what you want. For an actor that several shots key (the camera rig, the grade, the
 * lead's pose) it is a trap: the later shot's start pose leaks backwards into every hold before it, and
 * the frame you get depends on where the playhead came from. So on plain objects from()/fromTo() default
 * to immediateRender: false, which makes every frame a pure function of the playhead. */
const isDom = (t) => typeof t === 'string' || (typeof Element !== 'undefined' && (t instanceof Element || (t && t.length && t[0] instanceof Element)));
export function directed(tl) {
  const { from, fromTo } = tl;
  tl.from = (targets, vars, pos) => from.call(tl, targets, isDom(targets) ? vars : { immediateRender: false, ...vars }, pos);
  tl.fromTo = (targets, a, b, pos) => fromTo.call(tl, targets, a, isDom(targets) ? b : { immediateRender: false, ...b }, pos);
  return tl;
}

/* The same trap on DOM elements cannot be defaulted away (entrances need their hidden start), so it is
 * reported instead: a second from()/fromTo() on a property an earlier tween already owns. */
const SPECIAL = new Set(['duration', 'ease', 'delay', 'stagger', 'startAt', 'immediateRender', 'runBackwards', 'overwrite', 'repeat', 'repeatDelay', 'yoyo', 'yoyoEase', 'lazy', 'id', 'paused', 'data', 'callbackScope', 'keyframes', 'onStart', 'onUpdate', 'onComplete', 'onRepeat', 'onReverseComplete', 'onInterrupt', 'onStartParams', 'onUpdateParams', 'onCompleteParams', 'inherit', 'parent', 'defaults']);
export function audit(timeline, label = 'timeline') {
  const startOf = (tw) => { let t = tw.startTime(), p = tw.parent; while (p && p !== timeline) { t = p.startTime() + t / (p.timeScale() || 1); p = p.parent; } return t; };
  const seen = new Map();
  let found = 0;
  timeline.getChildren(true, true, false).map((tw) => [startOf(tw), tw]).sort((a, b) => a[0] - b[0]).forEach(([, tw]) => {
    const fromVars = tw.vars.startAt || (tw.vars.runBackwards ? tw.vars : null);
    const props = Object.keys({ ...(tw.vars.startAt || {}), ...tw.vars }).filter((k) => !SPECIAL.has(k));
    tw.targets().forEach((target) => {
      const owned = seen.get(target) || new Set(); seen.set(target, owned);
      if (fromVars && tw.vars.immediateRender !== false && target instanceof Element) {
        const clash = props.filter((k) => owned.has(k));
        if (clash.length) {
          found++;
          const who = target.id ? '#' + target.id : target.classList.length ? '.' + target.classList[0] : target.tagName.toLowerCase();
          console.error(`[${label}] ${who} gets a second from()/fromTo() on "${clash.join(', ')}". Its start state leaks into earlier frames: add immediateRender: false, or use set() + to().`);
        }
      }
      props.forEach((k) => owned.add(k));
    });
  });
  return found;
}

export function createReel(options = {}) {
  const gsap = options.gsap || window.gsap;
  if (!gsap) throw new Error('reel.js needs GSAP on window.gsap');
  const lenis = options.lenis || null;
  const smooth = options.smooth ?? (lenis ? 0 : 0.09); // seconds of lag on the playhead when there is no Lenis
  const reduced = options.reducedMotion ?? matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root = document.documentElement;
  root.classList.toggle('reduced-motion', reduced);

  const master = gsap.timeline({ paused: true, defaults: { ease: 'none' } });
  const scenes = [...document.querySelectorAll(options.scenes || '[data-scene]')].map((el, index) => ({
    el,
    index,
    name: el.dataset.scene || `scene-${index + 1}`,
    frame: el.querySelector(':scope > .frame') || el,
    still: parseFloat(el.dataset.still ?? '0.5'), // which moment of `main` is the money frame (reduced-motion + stills)
    hold: el.hasAttribute('data-hold'),          // a deliberate stillness: screening will not flag it as a dead hold
    flow: el.hasAttribute('data-flow'),
    top: 0, height: 0, phase: '',
  }));
  const byName = Object.fromEntries(scenes.map((s) => [s.name, s]));
  const END = 2 * scenes.length + 1; // master time: scene i → enter [2i,2i+1], main [2i+1,2i+2], exit [2i+2,2i+3]
  master.set({}, {}, END);

  const probe = document.createElement('div');
  probe.style.cssText = 'position:fixed;top:0;left:0;width:0;height:100vh;height:100lvh;visibility:hidden;pointer-events:none';
  document.body.appendChild(probe);

  let knots = [];      // [{ y, m }] — piecewise-linear map between scroll px and master time
  let frameH = innerHeight;
  let M = 0, lastM = -1, lastY = 0, velocity = 0;
  let manualClock = null, started = false, introTl = null, lastTick = 0, lastWidth = 0;
  const listeners = new Set();

  /* ---------- authoring ---------- */
  function scene(name, build) {
    const s = byName[name];
    if (!s) { console.warn(`[reel] no [data-scene="${name}"] in the document`); return api; }
    const make = () => directed(gsap.timeline({ paused: reduced, defaults: { ease: 'none', duration: 1 } })); // a tween spans its whole clip unless told otherwise
    const clips = { enter: make(), main: make(), exit: make() };
    build({ ...clips, el: s.el, frame: s.frame, q: gsap.utils.selector(s.el), scene: s });
    ['enter', 'main', 'exit'].forEach((key, k) => {
      const tl = clips[key];
      if (!tl.getChildren().length) return;
      tl.set({}, {}, Math.max(1, tl.duration())); // positions inside a clip read as fractions of that clip
      tl.duration(1);
      if (reduced) s.clips = { ...(s.clips || {}), [key]: tl }; // reduced motion: clips are posed, never scrubbed
      else master.add(tl, 2 * s.index + k);
    });
    lastM = -1;
    return api;
  }

  function intro(build) {
    introTl = gsap.timeline({ paused: true });
    build(introTl);
    return api;
  }

  /* ---------- scroll <-> master time ---------- */
  function measure() {
    frameH = probe.getBoundingClientRect().height || innerHeight;
    root.style.setProperty('--frame-h', `${frameH}px`);
    const sy = scrollY;
    scenes.forEach((s) => {
      const r = s.el.getBoundingClientRect();
      s.top = r.top + sy;
      s.height = r.height;
      s.pinEnd = s.top + Math.max(0, s.height - frameH);
    });
    knots = [];
    const push = (y, m) => knots.push({ y: Math.max(y, knots.length ? knots[knots.length - 1].y : -Infinity), m });
    scenes.forEach((s, i) => {
      const prev = scenes[i - 1], next = scenes[i + 1];
      const mainStart = prev ? Math.max(s.top, prev.pinEnd) : s.top;         // an overlapping cut plays while both frames are pinned
      const mainEnd = next ? Math.min(s.pinEnd, next.top) : s.pinEnd;
      if (i === 0) push(s.top - frameH, 0);
      push(mainStart, 2 * i + 1);
      push(Math.max(mainEnd, mainStart), 2 * i + 2);
      if (!next) push(s.pinEnd + frameH, END);
    });
    lastWidth = innerWidth;
  }

  function scrollToM(y) {
    if (!knots.length) return 0;
    if (y <= knots[0].y) return knots[0].m;
    for (let k = 0; k < knots.length - 1; k++) {
      const a = knots[k], b = knots[k + 1];
      if (y < b.y) return a.m + ((y - a.y) / (b.y - a.y)) * (b.m - a.m);
    }
    return knots[knots.length - 1].m;
  }

  function mToScroll(m) {
    if (!knots.length) return 0;
    for (let k = 0; k < knots.length - 1; k++) {
      const a = knots[k], b = knots[k + 1];
      if (m <= b.m) return b.m === a.m ? a.y : a.y + ((m - a.m) / (b.m - a.m)) * (b.y - a.y);
    }
    return knots[knots.length - 1].y;
  }

  const maxScroll = () => Math.max(1, root.scrollHeight - innerHeight);
  const readScroll = () => (lenis ? lenis.animatedScroll ?? lenis.scroll : scrollY);

  function currentScene(m) {
    const i = clamp(Math.floor((m - 0.5) / 2), 0, scenes.length - 1);
    return scenes[i];
  }

  function stillScene(y) { // reduced motion: the scene under the middle of the viewport
    const mid = y + innerHeight / 2;
    let best = scenes[0];
    for (const s of scenes) if (s.top <= mid) best = s;
    return best;
  }
  const stillM = (y) => { const s = stillScene(y); return s ? 2 * s.index + 1 + clamp(s.still) : 0; };

  // Reduced motion: every scene rests on its money frame at once (enter done, exit not begun). Shared
  // actors such as the camera rig follow whichever scene is centred, so they cut instead of travel.
  let posed = null;
  function pose(current) {
    const hold = (s) => { const c = s.clips; if (!c) return; c.enter?.progress(0).progress(1); c.exit?.progress(1).progress(0); c.main?.progress(0).progress(clamp(s.still)); };
    if (posed === null) scenes.forEach(hold);
    if (current && current !== posed) { hold(current); posed = current; }
  }

  /* ---------- per frame ---------- */
  function setPhases(m) {
    for (const s of scenes) {
      const u = m - (2 * s.index + 1); // -1..0 enter, 0..1 main, 1..2 exit
      const phase = reduced ? 'main' : u < -1 ? 'before' : u < 0 ? 'enter' : u <= 1 ? 'main' : u < 2 ? 'exit' : 'after';
      if (phase !== s.phase) { s.phase = phase; s.el.dataset.phase = phase; }
    }
  }

  function emit(time, dt) {
    if (M !== lastM) {
      if (reduced) pose(stillScene(lastY)); else master.time(M);
      setPhases(M); lastM = M;
    }
    const s = currentScene(M);
    const f = {
      time, dt, m: M, velocity,
      progress: clamp(lastY / maxScroll()),
      scene: s, sceneProgress: s ? clamp(M - (2 * s.index + 1)) : 0,
      reduced, capturing: manualClock !== null,
    };
    listeners.forEach((fn) => fn(f));
  }

  function tick(time, deltaMs) {
    if (manualClock !== null) return; // a capture owns the frame
    const dt = Math.min(0.1, (deltaMs || 16.7) / 1000);
    if (lenis) lenis.raf(time * 1000);
    if (innerWidth !== lastWidth) measure();
    const y = readScroll();
    velocity += ((y - lastY) / dt / innerHeight - velocity) * (1 - Math.exp(-dt * 10)); // viewports per second, smoothed
    lastY = y;
    const target = reduced ? stillM(y) : scrollToM(y);
    M = smooth > 0 && !reduced ? M + (target - M) * (1 - Math.exp(-dt / smooth)) : target;
    if (Math.abs(target - M) < 1e-4) M = target;
    emit(time, dt);
    lastTick = time;
  }

  /* ---------- control (also what screening / recording tools drive) ---------- */
  function seek(m, time = null) {
    if (time !== null) manualClock = time;
    const y = mToScroll(clamp(m, 0, END));
    if (lenis) lenis.scrollTo(y, { immediate: true, force: true }); else scrollTo(0, y);
    lastY = y; velocity = 0;
    M = reduced ? stillM(y) : clamp(m, 0, END);
    emit(manualClock ?? lastTick, 1 / 60);
    return y;
  }
  const seekScene = (name, u = 0.5, time = null) => (byName[name] ? seek(2 * byName[name].index + 1 + u, time) : null);
  const release = () => { manualClock = null; };

  const remeasure = () => { measure(); lastM = -1; };
  // Keyboard focus landing in a pinned scene that is not on stage: bring that scene to its money frame, so the
  // focused control is actually visible. (Flow scenes scroll into view natively.)
  const onFocus = (e) => {
    if (reduced || manualClock !== null || !e.target.matches?.(':focus-visible')) return;
    const s = scenes.find((sc) => sc.el.contains(e.target));
    if (!s || s.flow || s.phase === 'main') return;
    const y = mToScroll(2 * s.index + 1 + clamp(s.still));
    if (lenis) lenis.scrollTo(y, { immediate: true, force: true }); else scrollTo(0, y);
  };
  const onResize = () => { if (innerWidth !== lastWidth) remeasure(); };
  /** Tear down (single-page apps): stops the ticker, removes listeners, kills the timelines. */
  function destroy() {
    gsap.ticker.remove(tick); removeEventListener('resize', onResize); removeEventListener('load', remeasure); removeEventListener('focusin', onFocus);
    master.kill(); introTl?.kill(); listeners.clear(); probe.remove(); root.classList.remove('reel-ready');
    if (window.__reel === api) delete window.__reel;
  }

  function start() {
    if (started) return api;
    started = true;
    measure();
    audit(master, 'reel');
    master.progress(1, true).progress(0, true); // initialise every tween once, in order, so any seek is history-independent
    addEventListener('resize', onResize);
    if (document.fonts?.ready) document.fonts.ready.then(() => { measure(); lastM = -1; });
    addEventListener('load', remeasure);
    addEventListener('focusin', onFocus);
    gsap.ticker.lagSmoothing(0);
    gsap.ticker.add(tick);
    M = reduced ? stillM(scrollY) : scrollToM(scrollY);
    lastY = scrollY;
    if (introTl && reduced) introTl.progress(1); // titles land first, so the still poses below have the last word
    emit(0, 1 / 60);
    if (introTl && !reduced) introTl.play(0);
    root.classList.add('reel-ready');
    return api;
  }

  const api = {
    scene, intro, start, seek, seekScene, release, measure, destroy,
    onFrame(fn) { listeners.add(fn); return () => listeners.delete(fn); },
    get m() { return M; }, get end() { return END; }, get velocity() { return velocity; },
    get reduced() { return reduced; }, get master() { return master; }, get introTimeline() { return introTl; },
    get scenes() { return scenes.map((s) => ({ name: s.name, index: s.index, top: s.top, height: s.height, still: s.still, hold: s.hold, flow: s.flow, phase: s.phase })); },
    /** 'before' | 'enter' | 'main' | 'exit' | 'after' for a scene. A flow scene covers the whole viewport only while it is 'main'. */
    phase: (name) => byName[name]?.phase ?? null,
    /** The scene on screen. Under reduced motion every phase reads 'main', so this goes by geometry there:
     *  the scene under the middle of the viewport. */
    current() {
      if (!reduced) return currentScene(M)?.name ?? null;
      const mid = innerHeight / 2;
      let best = scenes[0];
      for (const s of scenes) if (s.el.getBoundingClientRect().top <= mid) best = s;
      return best?.name ?? null;
    },
    /** True while any part of the scene is in the viewport (phase enter / main / exit; by geometry when reduced). */
    onScreen(name) {
      const s = byName[name]; if (!s) return false;
      if (!reduced) return s.phase === 'enter' || s.phase === 'main' || s.phase === 'exit';
      const r = s.el.getBoundingClientRect();
      return r.bottom > 0 && r.top < innerHeight;
    },
    mToScroll, scrollToM,
  };
  window.__reel = api; // screening.mjs and render-film.mjs look for this
  return api;
}
