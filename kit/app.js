// app.js — app mode rig: a hash router that keeps state in the URL, shortcuts, list navigation, a drawer,
// a command palette and toasts. Zero dependencies. No styles injected, no animation of its own.
//
//   import { createApp, keys, kbdHints, listNav, drawer, palette, toast, appNow, rng, esc } from './app.js';
//   const app = createApp({ root: '#view', routes: { '/': overview, '/items': items, '/items/:id': items } });
//
// Views are (ctx) => HTMLElement | string | Promise<…>. ctx = { params, query, state, now, seed, navigate, setQuery,
// refresh, onMount }. Filters, sort and selection live in the URL query. Reserved query keys:
//   ?state=default|loading|empty|filtered|done|error|denied|huge   a screening state; views read ctx.state and render it
//   ?now=2026-10-22T13:12:00Z   freezes the clock (appNow() and ctx.now)       ?seed=7   seeds the data
//   ?still=1                    sets <html data-still> so CSS can kill transitions for screening
// now / seed / still are read once and carried across navigation; state is not.
//
// Hooks for your CSS (the rig styles nothing): .app-palette .app-sheet (native <dialog>), .app-toasts .app-toast,
// .app-kbd (hint wrapper), [data-current] and [aria-selected] on list rows.
import { appNow, freezeNow, rng } from './fixtures.js';
export { appNow, rng };

export const STATES = ['default', 'loading', 'empty', 'filtered', 'done', 'error', 'denied', 'huge'];

const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const isMac = /Mac|iPhone|iPad/.test(globalThis.navigator?.platform || globalThis.navigator?.userAgent || '');
let uidN = 0;
const uid = (p) => `app-${p}-${++uidN}`;
/** Escape text for an HTML string. */
export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const el = (tag, attrs = {}, ...kids) => {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) if (v != null) e.setAttribute(k, v);
  e.append(...kids);
  return e;
};
// text entry: ignore single-key shortcuts there
const typing = (t) => !!t && t.nodeType === 1 && (t.isContentEditable || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' ||
  (t.tagName === 'INPUT' && !/^(checkbox|radio|button|submit|reset|image|file|color|range)$/.test(t.type)));
const modalOpen = () => { try { return !!document.querySelector('dialog:modal, [aria-modal="true"]'); } catch { return !!document.querySelector('[aria-modal="true"]'); } };
const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type=hidden]), select:not([disabled]), textarea:not([disabled]), summary, [tabindex]:not([tabindex="-1"]), [contenteditable=""], [contenteditable="true"]';
const focusables = (root) => $$(FOCUSABLE, root).filter((e) => !e.closest('[inert]') && e.checkVisibility?.() !== false);
const frame = () => new Promise((r) => requestAnimationFrame(() => r()));

// ---- router ----------------------------------------------------------------------------------------------------
const compile = (routes) => Object.entries(routes)
  .map(([pat, view]) => ({ pat, view, segs: pat.split('/').filter(Boolean) }))
  .sort((a, b) => a.segs.filter((s) => s[0] === ':').length - b.segs.filter((s) => s[0] === ':').length);   // static routes win
function match(table, path) {
  const segs = path.split('/').filter(Boolean);
  for (const r of table) {
    if (r.segs.length !== segs.length) continue;
    const params = {};
    if (r.segs.every((s, i) => (s[0] === ':' ? ((params[s.slice(1)] = decodeURIComponent(segs[i])), true) : s === segs[i]))) return { view: r.view, params };
  }
  return null;
}
function readHash() {
  const h = location.hash.replace(/^#/, ''), i = h.indexOf('?');
  const path = '/' + (i < 0 ? h : h.slice(0, i)).replace(/^\/+|\/+$/g, '');
  return { path, query: Object.fromEntries(new URLSearchParams(i < 0 ? '' : h.slice(i + 1))) };
}
const toHash = (path, query = {}) => {
  const sp = new URLSearchParams();
  for (const [k, v] of Object.entries(query)) if (v !== '' && v != null && v !== false) sp.set(k, Array.isArray(v) ? v.join(',') : String(v));
  const q = sp.toString();
  return `#${path}${q ? '?' + q : ''}`;
};

/**
 * createApp({ root, routes, notFound }) → { navigate, setQuery, go, setState, refresh, whenIdle, ready, route, destroy }
 * Also published as window.__app for the screening script:
 *   ready      a promise for the current render (re-armed on every navigation)      whenIdle()  resolves when no render is pending
 *   route      { path, params, query }      setState(s)  swap ?state= in place      go('#/items')  navigate and wait for the render
 * A view's ctx.onMount((root) => cleanup?) runs after the view is in the DOM; bind keys and drawers there and return the unbind.
 * Moving between routes that share one view function (list ↔ list with a peek open) keeps scroll and focus; any other
 * path change scrolls to top and focuses the new view's first h1. Focus survives a re-render: it returns to the same
 * [data-focus-key], [data-row][data-id], #id or [name].
 */
export function createApp({ root, routes, notFound } = {}) {
  root = typeof root === 'string' ? document.querySelector(root) : root;
  if (!root) throw new Error('createApp: root not found');
  toasts(true);                                                                     // the live region must exist before the first toast
  const table = compile(routes), base = document.title;
  const globals = { seed: 1 };
  let cur = { path: null, params: {}, query: {}, view: null }, last = null, token = 0, first = true;
  let ready = Promise.resolve(), cleanups = [], lastHash = null;

  function syncGlobals(q) {
    if (q.now) { const d = new Date(q.now); if (!isNaN(d)) freezeNow(d); }
    if (q.seed != null && q.seed !== '' && !isNaN(Number(q.seed))) globals.seed = Number(q.seed);
    if (q.still != null) { if (q.still === '0' || q.still === 'false') delete document.documentElement.dataset.still; else document.documentElement.dataset.still = ''; }
  }
  function focusKey() {
    const a = document.activeElement;
    if (!a || a === root || !root.contains(a)) return null;
    const row = a.closest('[data-row][data-id]'), q = (v) => CSS.escape(v);
    const sel = a.dataset.focusKey ? `[data-focus-key="${q(a.dataset.focusKey)}"]` : row ? `[data-row][data-id="${q(row.dataset.id)}"]`
      : a.id ? `[id="${q(a.id)}"]` : a.name ? `${a.tagName.toLowerCase()}[name="${q(a.name)}"]` : null;
    return sel && { sel, caret: a.selectionStart != null ? [a.selectionStart, a.selectionEnd] : null };
  }
  function restoreFocus(k) {
    const e = k && root.querySelector(k.sel);
    if (!e) return;
    e.focus({ preventScroll: true });
    if (k.caret && e.setSelectionRange) try { e.setSelectionRange(...k.caret); } catch {}
  }
  const failure = (err) => el('div', { role: 'alert' }, el('h1', {}, 'Something broke'), el('pre', {}, String(err?.stack || err)));
  const missing = (ctx) => el('div', {}, el('h1', {}, 'Not found'), el('p', {}, `No page at ${ctx.route.path}.`), el('a', { href: '#/' }, 'Back to the start'));

  async function render() {
    const my = ++token;
    let done; ready = new Promise((r) => (done = r));
    lastHash = location.hash;
    const { path, query } = readHash();
    syncGlobals({ ...Object.fromEntries(new URLSearchParams(location.search)), ...query });
    const m = match(table, path), view = m ? m.view : (notFound || missing);
    const same = !first && (path === cur.path || view === cur.view);              // only the query (or a peek) changed
    const fk = first ? null : focusKey();                                         // before anything is torn down
    cleanups.splice(0).forEach((fn) => { try { fn(); } catch (e) { console.error(e); } });
    cur = { path, params: m?.params || {}, query, view };
    const mounts = [], live = () => my === token;
    const state = STATES.includes(query.state) ? query.state : 'default';
    const ctx = {
      params: cur.params, query: { ...query }, state, now: appNow(), seed: globals.seed, route: { path, params: cur.params, query: { ...query } },
      navigate: (p, q) => navigate(p, q),
      setQuery: (patch, o) => (live() ? setQuery(patch, o) : ready),
      refresh: () => render(),
      onMount: (fn) => mounts.push(fn),
    };
    let out;
    try { out = await view(ctx); } catch (err) { console.error(err); out = failure(err); }
    if (!live()) { done(); return; }                                              // a newer render took over
    if (typeof out === 'string') root.innerHTML = out; else if (out != null) root.replaceChildren(out); else root.replaceChildren();
    if (!first && !same) { scrollTo(0, 0); root.scrollTop = 0; }
    const h1 = root.querySelector('h1');
    document.title = h1?.textContent.trim() ? `${h1.textContent.trim()} · ${base}` : base;
    if (!first) {
      if (same && fk) restoreFocus(fk);
      else if (!same) { const t = h1 || root; if (!t.hasAttribute('tabindex')) t.setAttribute('tabindex', '-1'); t.focus({ preventScroll: true }); }
    }
    for (const fn of mounts) { try { const c = fn(root); if (typeof c === 'function') cleanups.push(c); } catch (e) { console.error(e); } }
    first = false;
    await frame();
    done();
  }

  function write(hash, { replace = false, render: doRender = true } = {}) {
    if (hash !== location.hash) {
      if (replace) history.replaceState(history.state, '', hash); else location.hash = hash;
      lastHash = location.hash;                                                   // the hashchange this causes is ours: do not render twice
    }
    else if (!doRender) return whenIdle();
    return doRender ? (render(), whenIdle()) : whenIdle();
  }
  const carry = (q = {}) => { const o = { ...q }; for (const k of ['now', 'seed', 'still']) if (cur.query[k] != null && o[k] == null) o[k] = cur.query[k]; return o; };
  /** navigate('/items/3', { status: 'paid' }): the query is the whole new query; now / seed / still are carried over. */
  function navigate(p, q) {
    if (p.includes('?')) { const [pp, qq] = p.split('?'); p = pp; q = { ...Object.fromEntries(new URLSearchParams(qq)), ...q }; }
    return write(toHash('/' + p.replace(/^\/+/, ''), carry(q)));
  }
  /** setQuery({ status: 'paid', page: '' }) merges into the URL query and drops empty keys. { replace: true } rewrites history; { render: false } only updates the URL. */
  function setQuery(patch, { replace = false, render: doRender = true } = {}) {
    const q = { ...cur.query, ...patch };
    for (const k of Object.keys(q)) if (q[k] === '' || q[k] == null) delete q[k];
    if (!doRender) cur.query = q;                                               // URL-only update: keep the router's copy in step
    return write(toHash(cur.path || '/', q), { replace, render: doRender });
  }
  const whenIdle = async () => { let p; do { p = ready; await p; } while (p !== ready); };
  const go = (h) => { h = String(h).startsWith('#') ? h : '#' + h; return write(h); };
  const setState = (s) => setQuery({ state: s === 'default' ? '' : s }, { replace: true });

  const onHash = () => {
    if (location.hash === lastHash) return;
    if (location.hash && !location.hash.startsWith('#/')) return;                // an in-page anchor, not a route
    render();
  };
  addEventListener('hashchange', onHash);
  const api = {
    navigate, setQuery, go, setState, whenIdle, refresh: () => render(),
    get ready() { return ready; },
    get route() { return { path: cur.path, params: cur.params, query: { ...cur.query } }; },
    destroy() { removeEventListener('hashchange', onHash); cleanups.splice(0).forEach((f) => f()); if (window.__app === api) delete window.__app; },
  };
  window.__app = api;
  render();
  return api;
}

// ---- keys ------------------------------------------------------------------------------------------------------
const ALIAS = { esc: 'Escape', space: ' ', enter: 'Enter', return: 'Enter', up: 'ArrowUp', down: 'ArrowDown', left: 'ArrowLeft', right: 'ArrowRight', tab: 'Tab', del: 'Delete', backspace: 'Backspace' };
function chord(s) {
  const parts = s.split('+'); let key = parts.pop() || '+';
  const c = { ctrl: false, meta: false, alt: false, shift: false };
  for (const p of parts.map((x) => x.toLowerCase())) {
    if (p === 'mod') c[isMac ? 'meta' : 'ctrl'] = true;
    else if (p === 'ctrl' || p === 'control') c.ctrl = true;
    else if (p === 'meta' || p === 'cmd' || p === 'command') c.meta = true;
    else if (p === 'alt' || p === 'option') c.alt = true;
    else if (p === 'shift') c.shift = true;
  }
  key = ALIAS[key.toLowerCase()] ?? key;
  if (key.length === 1 && /[A-Z]/.test(key)) c.shift = true;
  if (key.length === 1) key = key.toLowerCase();
  return { ...c, key, loose: key.length === 1 && !/[a-z0-9]/.test(key) };           // punctuation ignores shift ('?' is shift+/)
}
const steps = (combo) => String(combo).trim().split(/\s+/).map(chord);
function hit(c, e) {
  const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
  return k === c.key && e.ctrlKey === c.ctrl && e.metaKey === c.meta && e.altKey === c.alt && (c.loose || e.shiftKey === c.shift);
}
const registry = new Set();                                                       // { combo, label, group } shown by keys.sheet()
let sheetOwner = null;

/** Label parts for a combo: 'g o' → ['G', 'O'], 'mod+k' → ['Ctrl K'] (⌘K on a Mac). */
export function fmtKey(combo) {
  const name = { Escape: 'Esc', ArrowUp: '↑', ArrowDown: '↓', ArrowLeft: '←', ArrowRight: '→', ' ': 'Space' };
  return steps(combo).map((c) => {
    const mods = [c.ctrl && (isMac ? '⌃' : 'Ctrl'), c.alt && (isMac ? '⌥' : 'Alt'), c.shift && (isMac ? '⇧' : 'Shift'), c.meta && (isMac ? '⌘' : 'Meta')].filter(Boolean);
    const k = name[c.key] || (c.key.length === 1 ? c.key.toUpperCase() : c.key);
    return isMac ? mods.join('') + k : [...mods, k].join('+');
  });
}

/**
 * keys({ '/': focusSearch, 'g o': { run, label, group }, 'mod+k': open, Escape: close }, { scope }) → unbind
 * Single keys, sequences ('g o' within 800 ms), modifiers ('mod+k': ctrl, or meta on a Mac). Ignored while typing in a
 * field (except Escape and mod+*), and while a modal dialog is open (except Escape and mod+*). '?' opens keys.sheet() unless you bind it.
 * The default action is prevented when a handler runs; return false to leave the key alone (an Escape that had nothing to close).
 */
export function keys(map, { scope = document } = {}) {
  const binds = Object.entries(map).map(([combo, v]) => {
    const o = typeof v === 'function' ? { run: v } : v;
    return { combo, steps: steps(combo), run: o.run, label: o.label || '', group: o.group || '' };
  });
  let mine = null;
  if (!binds.some((b) => b.combo === '?') && !sheetOwner) {
    mine = { combo: '?', steps: steps('?'), run: () => keys.sheet(), label: 'Show keyboard shortcuts', group: 'Help' };
    binds.push(mine); sheetOwner = mine;
  }
  const entries = binds.map((b) => ({ combo: b.combo, label: b.label, group: b.group }));
  entries.forEach((e) => registry.add(e));
  let seq = [], timer = 0;
  const reset = () => { seq = []; clearTimeout(timer); };
  const allowed = (b, inField, blocked) => {
    const s0 = b.steps[0], free = s0.ctrl || s0.meta || (b.steps.length === 1 && s0.key === 'Escape');
    return free || !(inField || blocked);
  };
  const onKey = (e) => {
    if (e.defaultPrevented || e.isComposing || /^(Shift|Control|Alt|Meta)$/.test(e.key)) return;
    const inField = typing(e.target), blocked = modalOpen();
    const ev = { key: e.key, ctrlKey: e.ctrlKey, metaKey: e.metaKey, altKey: e.altKey, shiftKey: e.shiftKey };
    const cands = (buf) => binds.filter((b) => b.steps.length >= buf.length && allowed(b, inField, blocked) && buf.every((x, i) => hit(b.steps[i], x)));
    let buf = [...seq, ev], c = cands(buf);
    if (!c.length && seq.length) { reset(); buf = [ev]; c = cands(buf); }
    const done = c.find((b) => b.steps.length === buf.length);
    if (done) { reset(); if (done.run(e) !== false) e.preventDefault(); return; }       // a handler that returns false leaves the key alone
    if (c.length) { seq = buf; clearTimeout(timer); timer = setTimeout(reset, 800); } else reset();
  };
  scope.addEventListener('keydown', onKey);
  return () => { scope.removeEventListener('keydown', onKey); reset(); entries.forEach((e) => registry.delete(e)); if (mine && sheetOwner === mine) sheetOwner = null; };
}
/** Add shortcuts handled elsewhere (listNav does this) to the sheet: keys.register([{ combo, label, group }]) → unregister. */
keys.register = (items) => { const es = items.map((i) => ({ group: '', label: '', ...i })); es.forEach((e) => registry.add(e)); return () => es.forEach((e) => registry.delete(e)); };
/** Toggle the dialog that lists every registered shortcut. */
keys.sheet = () => {
  let d = document.querySelector('dialog.app-sheet');
  if (d?.open) { d.close(); return false; }
  const opener = document.activeElement;
  if (!d) {
    d = el('dialog', { class: 'app-sheet', 'aria-labelledby': uid('sheet-title') });
    d.addEventListener('keydown', (e) => { if (e.key === '?') { e.preventDefault(); d.close(); } });
    d.addEventListener('close', () => { const o = d._opener; if (o?.isConnected) o.focus({ preventScroll: true }); });
    document.body.append(d);
  }
  d._opener = opener;
  const groups = new Map();
  for (const e of registry) { const g = e.group || 'General'; if (!groups.has(g)) groups.set(g, new Map()); groups.get(g).set(e.combo + e.label, e); }
  const title = d.getAttribute('aria-labelledby');
  d.replaceChildren(el('h2', { id: title }, 'Keyboard shortcuts'));
  for (const [g, es] of groups) {
    const ul = el('ul', { style: 'list-style:none;margin:0;padding:0' });
    for (const e of es.values()) {
      const li = el('li', { style: 'display:flex;justify-content:space-between;gap:16px' }, el('span', {}, e.label || ''));
      li.append(el('span', { class: 'app-keys' }, ...fmtKey(e.combo).flatMap((k, i) => [i ? ' then ' : '', el('kbd', {}, k)])));
      ul.append(li);
    }
    d.append(el('section', {}, el('h3', {}, g), ul));
  }
  const close = el('form', { method: 'dialog' }, el('button', { type: 'submit' }, 'Close'));
  d.append(close);
  d.showModal();
  return true;
};

/** kbdHints(root) — appends <kbd> hints to every [data-key="g o"] element, so shortcuts are learned through the mouse. */
export function kbdHints(root = document) {
  for (const e of $$('[data-key]', root)) {
    if (e.dataset.kbdDone) continue;
    e.dataset.kbdDone = '1';
    const combo = e.dataset.key, parts = fmtKey(combo);
    e.append(el('span', { class: 'app-kbd', 'aria-hidden': 'true' }, ...parts.map((p) => el('kbd', {}, p))));
    const st = steps(combo);
    if (st.length === 1) e.setAttribute('aria-keyshortcuts', [st[0].ctrl && 'Control', st[0].meta && 'Meta', st[0].alt && 'Alt', st[0].shift && 'Shift', st[0].key.length === 1 ? st[0].key.toUpperCase() : st[0].key].filter(Boolean).join('+'));
  }
}

// ---- listNav ---------------------------------------------------------------------------------------------------
/**
 * listNav(container, { rows, onOpen, onSelect, multi, selection, clickOpens }) → { selected, clear, selectAll, focus, current, refresh, destroy }
 * Rows are [data-row][data-id]. Roving tabindex; j/k (anywhere) and ↑/↓/Home/End (inside the list) move; Enter opens;
 * x or Space toggles; Shift+x / Shift+click selects a range; mod+a selects all visible; Escape clears. Keeps
 * aria-selected and data-current on the rows, and a [data-select] checkbox in a row in step with the selection.
 */
export function listNav(container, { rows = '[data-row]', onOpen, onSelect, multi = true, selection = [], clickOpens = true } = {}) {
  const sel = new Set(selection.map(String));
  let anchor = null, dead = false;
  const all = () => $$(rows, container), shown = () => all().filter((r) => !r.hidden && r.checkVisibility?.() !== false);
  const idOf = (r) => r.dataset.id, curRow = () => all().find((r) => r.hasAttribute('data-current')) || null;
  const paint = () => {
    const rs = all(), c = curRow() || rs[0];
    for (const r of rs) {
      r.tabIndex = r === c ? 0 : -1;
      const on = sel.has(idOf(r));
      r.setAttribute('aria-selected', String(on));
      const b = r.querySelector('[data-select]');
      if (b && b.checked !== on) b.checked = on;
    }
  };
  const emit = () => { paint(); onSelect?.([...sel]); };
  function setCurrent(r, { focus = true, scroll = true } = {}) {
    if (!r) return;
    for (const o of all()) if (o !== r) o.removeAttribute('data-current');
    r.setAttribute('data-current', 'true');
    paint();
    if (focus && document.activeElement !== r) r.focus({ preventScroll: true });
    if (scroll) r.scrollIntoView({ block: 'nearest', inline: 'nearest' });
  }
  const move = (to) => { const rs = shown(); if (rs.length) setCurrent(rs[Math.max(0, Math.min(rs.length - 1, to(rs, rs.indexOf(curRow()))))]); };
  function toggle(r, on) {
    const id = idOf(r), want = on ?? !sel.has(id);
    if (!multi) sel.clear();
    if (want) sel.add(id); else sel.delete(id);
    anchor = r; emit();
  }
  function range(to) {
    const rs = shown(), a = rs.indexOf(anchor && rs.includes(anchor) ? anchor : rs[0]), b = rs.indexOf(to);
    if (a < 0 || b < 0) return;
    for (const r of rs.slice(Math.min(a, b), Math.max(a, b) + 1)) sel.add(idOf(r));
    emit();
  }
  const selectAll = () => { for (const r of shown()) sel.add(idOf(r)); emit(); };
  const clear = () => { sel.clear(); emit(); };
  const un = keys.register([
    { combo: 'j', label: 'Next row', group: 'List' }, { combo: 'k', label: 'Previous row', group: 'List' },
    { combo: 'Enter', label: 'Open row', group: 'List' }, { combo: 'x', label: 'Select row', group: 'List' },
    { combo: 'shift+x', label: 'Select a range', group: 'List' }, { combo: 'mod+a', label: 'Select all rows', group: 'List' },
  ]);

  const onKey = (e) => {
    if (!container.isConnected) return destroy();
    if (e.defaultPrevented || e.isComposing) return;
    const t = e.target;
    if (typing(t)) return;
    const inside = container.contains(t), row = inside ? t.closest(rows) : null;
    if (modalOpen() && !inside) return;
    const mod = e.ctrlKey || e.metaKey, k = e.key, plain = !mod && !e.altKey;
    let used = true;
    if (plain && (k === 'j' || k === 'k')) move((rs, i) => (i < 0 ? 0 : i + (k === 'j' ? 1 : -1)));
    else if (plain && k === 'x') { const c = curRow(); if (c) toggle(c); else used = false; }
    else if (plain && k === 'X') { const c = curRow(); if (c) range(c); else used = false; }
    else if (mod && k === 'a' && (inside || t === document.body)) selectAll();
    else if (plain && row && (k === 'ArrowDown' || k === 'ArrowUp')) move((rs, i) => i + (k === 'ArrowDown' ? 1 : -1));
    else if (plain && row && k === 'Home') move(() => 0);
    else if (plain && row && k === 'End') move((rs) => rs.length - 1);
    else if (plain && row && t === row && k === 'Enter') onOpen?.(idOf(row), row);
    else if (plain && row && t === row && k === ' ') toggle(row);
    else if (plain && k === 'Escape' && sel.size && (inside || t === document.body)) clear();
    else used = false;
    if (used) e.preventDefault();
  };
  const onClick = (e) => {
    const row = e.target.closest(rows);
    if (!row || !container.contains(row)) return;
    if (e.target.closest('[data-select]')) { if (e.shiftKey && multi && anchor) range(row); else toggle(row); setCurrent(row, { focus: false, scroll: false }); return; }
    if (e.target.closest('a, button, input, select, textarea, label, [role=button]')) { setCurrent(row, { focus: false, scroll: false }); return; }
    setCurrent(row);
    if (e.shiftKey && multi) range(row); else if (clickOpens) onOpen?.(idOf(row), row);
  };
  const onFocus = (e) => { const r = e.target.closest(rows); if (r && container.contains(r)) setCurrent(r, { focus: false, scroll: false }); };
  document.addEventListener('keydown', onKey);
  container.addEventListener('click', onClick);
  container.addEventListener('focusin', onFocus);
  const role = container.getAttribute('role');
  if (multi && /^(grid|listbox|treegrid)$/.test(role || '')) container.setAttribute('aria-multiselectable', 'true');
  const a0 = document.activeElement?.closest?.(rows);
  if (a0 && container.contains(a0)) a0.setAttribute('data-current', 'true');       // focus was restored onto a row before we mounted
  paint();
  function destroy() {
    if (dead) return; dead = true;
    document.removeEventListener('keydown', onKey); container.removeEventListener('click', onClick); container.removeEventListener('focusin', onFocus); un();
  }
  return { selected: () => [...sel], clear, selectAll, focus: (id) => setCurrent(all().find((r) => idOf(r) === String(id))), current: () => curRow()?.dataset.id ?? null, refresh: paint, destroy };
}

// ---- drawer ----------------------------------------------------------------------------------------------------
/**
 * drawer(el, { onClose, returnFocus, modal }) → { open, close, toggle, destroy, isOpen }
 * A side panel. Modal (default): focus trap, the rest of the page inert, aria-modal. { modal: false } is a peek: no trap,
 * the page stays live, focus still moves in on open. Escape closes either. Focus goes back to the opener
 * (returnFocus: true | false | element | () => element). Starts hidden; style [hidden] yourself if a class sets display.
 */
export function drawer(el0, { onClose, returnFocus = true, modal = true } = {}) {
  let isOpen = false, opener = null, inert = [], mo = null;
  el0.hidden = true;
  function open(from = document.activeElement) {
    if (isOpen) return;
    isOpen = true;
    opener = from instanceof HTMLElement && from !== document.body ? from : null;
    el0.hidden = false;
    if (!el0.hasAttribute('role')) el0.setAttribute('role', 'dialog');
    if (!el0.hasAttribute('aria-label') && !el0.hasAttribute('aria-labelledby')) { const h = el0.querySelector('h1, h2, h3'); if (h) { h.id ||= uid('drawer-title'); el0.setAttribute('aria-labelledby', h.id); } }
    if (modal) {
      el0.setAttribute('aria-modal', 'true');
      for (let n = el0; n.parentElement && n !== document.body; n = n.parentElement) {
        for (const s of n.parentElement.children) if (s !== n && !s.inert && !/^(SCRIPT|STYLE|TEMPLATE)$/.test(s.tagName) && !s.matches('.app-toasts, [data-keep]') && !s.matches('dialog')) { s.inert = true; inert.push(s); }
      }
    } else el0.removeAttribute('aria-modal');
    document.addEventListener('keydown', onKey, true);
    mo = new MutationObserver(() => { if (!el0.isConnected) destroy(); });
    mo.observe(document.body, { childList: true, subtree: true });
    const target = el0.querySelector('[autofocus], [data-autofocus]') || focusables(el0)[0] || (el0.setAttribute('tabindex', '-1'), el0);
    target.focus({ preventScroll: true });
  }
  function teardown() {
    isOpen = false;
    document.removeEventListener('keydown', onKey, true);
    mo?.disconnect(); mo = null;
    inert.forEach((s) => { s.inert = false; }); inert = [];
    el0.removeAttribute('aria-modal');
  }
  function close() {
    if (!isOpen) return;
    teardown();
    el0.hidden = true;
    const to = typeof returnFocus === 'function' ? returnFocus() : returnFocus instanceof HTMLElement ? returnFocus : returnFocus ? opener : null;
    if (to?.isConnected) to.focus({ preventScroll: true });
    onClose?.();
  }
  function destroy() { if (isOpen) teardown(); }
  function onKey(e) {
    if (!el0.isConnected) return destroy();
    if (e.key === 'Escape' && !e.defaultPrevented) {
      let top = null; try { top = document.querySelector('dialog:modal'); } catch {}
      if (top) return;                                                          // a palette or sheet is on top: it closes first
      if (!modal && typing(e.target) && !el0.contains(e.target)) return;
      e.preventDefault(); e.stopPropagation(); close();
    } else if (modal && e.key === 'Tab') {
      const f = focusables(el0), a = document.activeElement;
      if (!f.length) { e.preventDefault(); el0.focus(); return; }
      if (e.shiftKey && (a === f[0] || !el0.contains(a))) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && (a === f[f.length - 1] || !el0.contains(a))) { e.preventDefault(); f[0].focus(); }
    }
  }
  return { open, close, toggle: () => (isOpen ? close() : open()), destroy, get isOpen() { return isOpen; }, el: el0 };
}

// ---- palette ---------------------------------------------------------------------------------------------------
function fuzzy(q, s) {                                                           // subsequence score, -1 = no match
  s = s.toLowerCase();
  let score = 0, at = 0, prev = -2;
  for (const ch of q) {
    const i = s.indexOf(ch, at);
    if (i < 0) return -1;
    score += 1 + (i === prev + 1 ? 3 : 0) + (i === 0 || /[\s\-_/:]/.test(s[i - 1]) ? 4 : 0);
    prev = i; at = i + 1;
  }
  return score - s.length * 0.01 + (s.startsWith(q) ? 10 : 0);
}
/**
 * palette(commands, { hotkey }) → { open, close, add }
 * commands: [{ label, run, keywords?, key?, group? }]. A native modal <dialog class="app-palette">: input + listbox,
 * subsequence match on label and keywords, ↑/↓, Enter runs, Escape closes. Instant. `key` is shown as a hint.
 */
export function palette(commands = [], { hotkey = 'mod+k' } = {}) {
  const cmds = [...commands];
  let dlg, input, list, status, active = 0, shown = [];
  const build = () => {
    const lid = uid('pal-list');
    input = el('input', { type: 'text', role: 'combobox', 'aria-expanded': 'true', 'aria-controls': lid, 'aria-autocomplete': 'list', 'aria-label': 'Command', placeholder: 'Type a command', autocomplete: 'off', spellcheck: 'false' });
    list = el('ul', { id: lid, role: 'listbox', 'aria-label': 'Commands' });
    status = el('p', { role: 'status' });
    dlg = el('dialog', { class: 'app-palette', 'aria-label': 'Command palette' }, input, list, status);
    document.body.append(dlg);
    input.addEventListener('input', () => { active = 0; draw(); });
    dlg.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); if (shown.length) { active = (active + (e.key === 'ArrowDown' ? 1 : -1) + shown.length) % shown.length; mark(); } }
      else if (e.key === 'Enter') { e.preventDefault(); run(shown[active]); }
      else if (e.key === 'Tab') e.preventDefault();
    });
    list.addEventListener('mousedown', (e) => e.preventDefault());
    list.addEventListener('click', (e) => { const li = e.target.closest('[role=option]'); if (li) run(shown[Number(li.dataset.i)]); });
    list.addEventListener('mousemove', (e) => { const li = e.target.closest('[role=option]'); if (li && Number(li.dataset.i) !== active) { active = Number(li.dataset.i); mark(); } });
    dlg.addEventListener('close', () => { const o = dlg._opener; if (o?.isConnected) o.focus({ preventScroll: true }); });
  };
  function find(q) {
    q = q.toLowerCase().replace(/\s+/g, '');
    if (!q) return cmds.slice(0, 50);
    return cmds.map((c, i) => {
      const a = fuzzy(q, c.label), b = c.keywords ? fuzzy(q, String(c.keywords)) : -1;
      return { c, i, s: a >= 0 ? a * 2 : b >= 0 ? b : -1 };
    }).filter((x) => x.s >= 0).sort((x, y) => y.s - x.s || x.i - y.i).slice(0, 50).map((x) => x.c);
  }
  function draw() {
    shown = find(input.value);
    list.replaceChildren(...shown.map((c, i) => {
      const li = el('li', { role: 'option', id: `${list.id}-${i}`, 'data-i': i, 'aria-selected': String(i === active), style: 'display:flex;justify-content:space-between;gap:16px' }, el('span', {}, c.label));
      if (c.key) li.append(el('span', { class: 'app-keys', 'aria-hidden': 'true' }, ...fmtKey(c.key).map((k) => el('kbd', {}, k))));
      return li;
    }));
    status.textContent = shown.length ? `${shown.length} command${shown.length === 1 ? '' : 's'}` : 'No matching commands';
    mark();
  }
  function mark() {
    [...list.children].forEach((li, i) => li.setAttribute('aria-selected', String(i === active)));
    const a = list.children[active];
    if (a) { input.setAttribute('aria-activedescendant', a.id); a.scrollIntoView({ block: 'nearest' }); } else input.removeAttribute('aria-activedescendant');
  }
  const run = (c) => { if (!c) return; close(); Promise.resolve().then(() => c.run?.()); };
  function open() {
    if (!dlg) build();
    if (dlg.open) return;
    dlg._opener = document.activeElement;
    input.value = ''; active = 0; draw();
    dlg.showModal(); input.focus();
  }
  function close() { if (dlg?.open) dlg.close(); }
  if (hotkey) keys({ [hotkey]: { run: () => (dlg?.open ? close() : open()), label: 'Command palette', group: 'Global' } });
  return { open, close, add(more) { cmds.push(...more); if (dlg?.open) draw(); return () => { more.forEach((c) => { const i = cmds.indexOf(c); if (i >= 0) cmds.splice(i, 1); }); }; } };
}

// ---- toast -----------------------------------------------------------------------------------------------------
function toasts(early) {
  let r = document.querySelector('.app-toasts');
  if (!r) { r = el('div', { class: 'app-toasts', role: 'status', 'aria-live': 'polite', 'aria-atomic': 'false' }); document.body.append(r); r._fresh = !early; }
  return r;
}
/**
 * toast(message, { undo, timeout }) → { dismiss }
 * A polite live region (role=status). With `undo` the toast carries an Undo button; destructive actions in an app
 * undo rather than ask. The timer pauses on hover and focus, and does not run under ?still=1 (screenshots keep it).
 */
export function toast(message, { undo, timeout = 6000 } = {}) {
  const region = toasts(), fresh = region._fresh;
  region._fresh = false;
  const item = el('div', { class: 'app-toast' }, el('span', {}, message));
  let timer = 0, gone = false;
  const dismiss = () => { gone = true; clearTimeout(timer); item.remove(); };
  if (undo) { const b = el('button', { type: 'button', class: 'app-toast-undo' }, 'Undo'); b.addEventListener('click', () => { dismiss(); undo(); }); item.append(b); }
  const arm = () => { clearTimeout(timer); if (timeout > 0 && !document.documentElement.hasAttribute('data-still')) timer = setTimeout(dismiss, timeout); };
  item.addEventListener('mouseenter', () => clearTimeout(timer)); item.addEventListener('mouseleave', arm);
  item.addEventListener('focusin', () => clearTimeout(timer)); item.addEventListener('focusout', arm);
  const add = () => { if (gone) return; region.append(item); while (region.children.length > 3) region.firstChild.remove(); arm(); };
  if (fresh) setTimeout(add, 50); else add();                                  // a region that is announced must exist before its content
  return { dismiss };
}
