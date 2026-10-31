// fixtures.js — realistic, seeded fake data for app screens. Zero dependencies, no look.
//
// Blind tests drew uniform data: twelve equal bars, five tidy rows, every name six letters long. Real data is
// skewed (a few big orders, many small), noisy, has incidents, and is full of ugly edge cases. Everything here
// is deterministic from a seed, so a screen can be screened twice and compared.
//
//   const r = rng(7);
//   const rows = edge(times(r, 80, { now: appNow() }).map((created, i) => ({ id: i + 1, created, amount: lognormal(r, 180, 1.1) })), r);
//   const daily = series(r, { points: 30, base: 4200, trend: 0.25, season: { period: 7, amp: 0.2 }, events: [{ at: 19, kind: 'spike', size: 1.7 }] });
//
// Dates are UTC throughout (format with timeZone: 'UTC') so the same seed looks the same on every machine.

// ---- the clock -------------------------------------------------------------------------------------------------
let frozen = null;
/** Freeze (or, with null, release) the app clock. createApp() calls this from ?now=. */
export function freezeNow(d) { frozen = d == null ? null : new Date(d); }
/** The app's "now": the frozen clock, else ?now= in the URL (search or hash query), else the real time. Always a fresh Date. */
export function appNow() {
  if (frozen) return new Date(+frozen);
  try {
    const h = location.hash.split('?')[1] || '';
    const v = new URLSearchParams(h).get('now') || new URLSearchParams(location.search).get('now');
    const d = v && new Date(v);
    if (d && !isNaN(d)) return d;
  } catch {}
  return new Date();
}

// ---- randomness ------------------------------------------------------------------------------------------------
const hashSeed = (s) => { if (typeof s === 'number') return s | 0; let h = 2166136261; for (const c of String(s)) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return h | 0; };

/** mulberry32. seed: number or string. */
export function rng(seed = 1) {
  let a = hashSeed(seed);
  const next = () => { a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const r = {
    next,
    int: (lo, hi) => lo + Math.floor(next() * (hi - lo + 1)),                 // inclusive
    float: (lo, hi) => lo + next() * (hi - lo),
    pick: (arr) => arr[Math.floor(next() * arr.length)],
    weighted(pairs) {                                                         // [[value, weight], ...]
      const tot = pairs.reduce((s, p) => s + p[1], 0); let x = next() * tot;
      for (const [v, w] of pairs) { x -= w; if (x < 0) return v; }
      return pairs[pairs.length - 1][0];
    },
    shuffle(arr) { const o = arr.slice(); for (let i = o.length - 1; i > 0; i--) { const j = Math.floor(next() * (i + 1)); [o[i], o[j]] = [o[j], o[i]]; } return o; },
    chance: (p) => next() < p,
    gauss() { const u = 1 - next(), v = next(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); },   // standard normal
  };
  return r;
}

/** Long right tail: most values near the median, a few several times larger. spread ~0.5 mild, ~1.2 heavy. */
export const lognormal = (r, median, spread = 0.8) => median * Math.exp(spread * r.gauss());
/** Power law: min is the smallest value, alpha ~1.2 very heavy tail, ~3 mild. */
export const pareto = (r, min, alpha = 1.5) => min * Math.pow(1 - r.next(), -1 / alpha);

// ---- time series -----------------------------------------------------------------------------------------------
const DAY = 864e5;
/**
 * series(r, { points, start, step, base, trend, noise, season: { period, amp }, events })  →  [{ t: Date, v }]
 *   trend   total relative change across the series (0.25 = ends 25 % above where it began)
 *   noise   relative sd of an autocorrelated wobble (0.15 = about ±15 %)
 *   season  period in points, amp relative (0.2 = ±20 %)
 *   events  { at, kind: 'spike' | 'drop' | 'step', size, decay }; `at` is an index, or a fraction when 0 < at < 1.
 *           spike adds size × level, fading over `decay` points; drop removes it the same way; step shifts all later points.
 */
export function series(r, { points = 30, start, step = DAY, base = 100, trend = 0, noise = 0.1, season, events = [] } = {}) {
  const t0 = start == null ? +appNow() - (points - 1) * step : +new Date(start);
  const ev = events.map((e) => ({ decay: 2, ...e, at: e.at > 0 && e.at < 1 && !Number.isInteger(e.at) ? Math.round(e.at * (points - 1)) : e.at }));
  const phase = r.float(0, Math.PI * 2);
  let w = 0;
  return Array.from({ length: points }, (_, i) => {
    const level = base * (1 + trend * (points > 1 ? i / (points - 1) : 0));
    w = 0.45 * w + noise * r.gauss();
    let v = level * (season ? 1 + season.amp * Math.sin((2 * Math.PI * i) / season.period + phase) : 1) * Math.exp(w);
    for (const e of ev) {
      if (i < e.at) continue;
      const f = Math.exp(-(i - e.at) / Math.max(0.01, e.decay));
      if (e.kind === 'spike') v += level * e.size * f;
      else if (e.kind === 'drop') v *= Math.max(0.05, 1 - e.size * f);
      else if (e.kind === 'step') v *= 1 + e.size;
    }
    return { t: new Date(t0 + i * step), v: Math.max(0, v) };
  });
}

// ---- people, companies, ids ------------------------------------------------------------------------------------
const NAMES = {
  en: { first: 'James Mary Robert Patricia John Jennifer Michael Linda David Elizabeth Priya Omar Chloe Wei Sofia Tomasz Aisha Kofi Liam Noah Emma Olivia Hannah Marcus Ingrid Dmitri Fatima Ravi Siobhan Eilidh Mbali Deshawn'.split(' '),
        last: "Smith Johnson Williams Brown Jones Miller Davis Okafor Nguyen Patel Kim Murphy O'Brien McAllister Ng Sharma Kowalski Lindqvist Reyes Al-Rashid Fitzgerald-Hart St. Clair Van der Merwe".split(' ') },
  'zh-Hant': { first: '怡君 雅婷 宗翰 家豪 志明 淑芬 柏翰 冠宇 佩珊 欣怡 俊傑 詩涵 承恩 品妤 偉廷'.split(' '), last: '陳 林 黃 張 李 王 吳 劉 蔡 楊 許 鄭 謝 郭 洪 曾 邱 廖 賴 徐'.split(' '), join: '', order: 'last-first' },
  ja: { first: '太郎 花子 健太 美咲 陽菜 蓮 大輝 結衣 翔太 さくら'.split(' '), last: '佐藤 鈴木 高橋 田中 伊藤 渡辺 山本 中村 小林 加藤'.split(' '), join: ' ', order: 'last-first' },
  es: { first: 'José Lucía Alejandro Carmen Sofía Javier Valentina Joaquín Ximena Íñigo María José'.split(' '), last: 'García Rodríguez Martínez López González Fernández Núñez Peña Ibáñez de la Cruz'.split(' ') },
  de: { first: 'Hans Greta Jürgen Anneliese Maximilian Lukas Björn Käthe Jörg Zoë'.split(' '), last: 'Müller Schmidt Schneider Fischer Weber Schäfer Großmann Böhm Müller-Lüdenscheidt'.split(' ') },
  ar: { first: 'محمد فاطمة أحمد ليلى عمر نور خالد مريم يوسف سلمى'.split(' '), last: 'الحسن العتيبي القحطاني الشريف بن علي المنصوري الزهراني'.split(' ') },
};
const DOMAINS = [['gmail.com', 40], ['outlook.com', 12], ['yahoo.com', 8], ['icloud.com', 8], ['proton.me', 4], ['hey.com', 2], ['northwind.io', 6], ['halcyon.co', 5], ['meridian-labs.com', 4]];
const slug = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-zA-Z0-9]+/g, '.').replace(/^\.|\.$/g, '').toLowerCase();

/**
 * people(r, n, { locales, long })  →  [{ name, first, last, email, locale }]
 * `long` is the share of very long double-barrelled names; about as many again are hyphenated or single-name.
 * Names are in each locale's own script and order, so CJK and RTL strings reach the screen.
 */
export function people(r, n, { locales = ['en'], long = 0.05 } = {}) {
  return Array.from({ length: n }, () => {
    const locale = r.pick(locales), N = NAMES[locale] || NAMES.en;
    const first = r.pick(N.first), last = r.pick(N.last), join = N.join ?? ' ';
    const form = (x) => (N.order === 'last-first' ? [x.last, x.first] : [x.first, x.last]).filter(Boolean).join(join);
    const k = r.next();
    let name;
    if (k < long) name = [first, r.pick(N.first), r.pick(N.first), last, r.pick(N.last)].join(' ') + (locale === 'en' ? ' III' : '');   // long
    else if (k < long * 1.8) name = form({ first, last: `${last}-${r.pick(N.last)}` });                                                  // hyphenated
    else if (k < long * 2.4) name = first;                                                                                                // single name
    else name = form({ first, last });
    const ascii = slug(`${first} ${last}`);
    const local = ascii.length > 2 ? ascii : `user${r.int(100, 9999)}`;
    const email = `${r.chance(0.18) ? local.replace(/\./, '') : local}${r.chance(0.2) ? r.int(1, 99) : ''}@${r.weighted(DOMAINS)}`;
    return { name, first, last, email, locale };
  });
}

const CO_A = 'Northwind Halcyon Meridian Tidewater Foxglove Cobalt Larkspur Ironbark Saffron Kestrel Bramble Orchard Granite Lantern Marlow Quillon Redwood Sable Thistle Umber Vesper Willow Yarrow Zephyr Alder Birch Cinder Driftwood Ember Fathom'.split(' ');
const CO_B = ['Logistics', 'Labs', 'GmbH', 'Holdings', 'Studio', '& Sons', 'Trading Co.', 'Foods', 'Systems', 'Partners', 'Ltd', 'Collective', 'Supply', 'Works', 'Group', 'S.A.', 'Industries'];
const CO_ODD = ['Müller & Söhne GmbH', '株式會社北辰商事', 'Société Générale des Eaux et Forêts du Haut-Languedoc', 'O’Neill, Brannigan & Associates', 'شركة النور للتجارة', 'Ünal Gıda San. ve Tic. A.Ş.', 'The Very Long Named Regional Cooperative Association of Independent Wholesale Grocers (Pty) Ltd'];

/** companies(r, n) → names (strings). A few are very long or non-Latin. */
export function companies(r, n) {
  const seen = new Set(), out = [];
  for (let i = 0; out.length < n && i < n * 20; i++) {
    const c = r.chance(0.07) ? r.pick(CO_ODD) : `${r.pick(CO_A)} ${r.pick(CO_B)}`;
    if (!seen.has(c)) { seen.add(c); out.push(c); }
  }
  while (out.length < n) out.push(`${r.pick(CO_A)} ${r.pick(CO_B)} ${out.length}`);
  return out;
}

/** ids('INV-', 5, { start: 1000, pad: 6 }) → ['INV-001000', …] */
export const ids = (prefix, n, { start = 1, pad = 0 } = {}) => Array.from({ length: n }, (_, i) => `${prefix}${String(start + i).padStart(pad, '0')}`);

// ---- times -----------------------------------------------------------------------------------------------------
const DOW = [0.15, 1.7, 1.15, 1.1, 1.05, 0.9, 0.25];                                          // Sun … Sat: Mondays heavy, weekends thin
const HOURS = [1, 1, 1, 1, 1, 2, 3, 6, 18, 34, 42, 36, 24, 28, 38, 40, 34, 22, 12, 8, 6, 5, 3, 2];   // 0…23, two working-day peaks

/** times(r, n, { now, spanDays, businessHours }) → n Dates before `now`, ascending, clustered in working hours. */
export function times(r, n, { now = appNow(), spanDays = 30, businessHours = true } = {}) {
  const end = +now, day0 = Math.floor(end / DAY) * DAY;
  const days = Array.from({ length: spanDays + 1 }, (_, d) => [d, DOW[new Date(day0 - d * DAY).getUTCDay()] * (1 + 0.5 * (1 - d / Math.max(1, spanDays)))]);
  return Array.from({ length: n }, () => {
    const d = r.weighted(days);
    const h = businessHours ? r.weighted(HOURS.map((w, i) => [i, w])) : r.int(0, 23);
    const t = day0 - d * DAY + h * 36e5 + r.int(0, 59) * 6e4 + r.int(0, 59) * 1e3;
    return new Date(Math.min(t, end - r.int(1, 3600) * 1e3));
  }).sort((a, b) => a - b);
}

// ---- edge cases ------------------------------------------------------------------------------------------------
const LONGS = ['Wolfeschlegelsteinhausenbergerdorff-Pneumonoultramicroscopicsilicovolcanoconiosis-Supercalifragilistic',
  'The Honourable Maximilian Alexander von Hohenzollern-Sigmaringen of the Greater Metropolitan District Council for Water',
  'https://example.com/accounts/4471/orders/2026/10/22/export?format=csv&columns=all&include=archived&token=eyJhbGciOi'];
const UNI = ['🧪 Test Kitchen 🍜', 'مؤسسة النور للتجارة', 'עמית כהן', 'Ñandú Ünïcödé ǅ', '👨‍👩‍👧‍👦 Family Co', 'zero​width​break', 'Zażółć gęślą jaźń', 'Ａｂｃ　Ｆｕｌｌｗｉｄｔｈ'];

/**
 * edge(rows, r, { long, empty, zero, negative, huge, unicode, fields })  →  new rows with a small share broken on purpose.
 * Each option is the share of rows hit (defaults 2–4 %). Strings get very long, empty (null) or emoji/RTL values;
 * numbers get zero, negative or ~10^7–10^8 values. With 20+ rows every kind is guaranteed to appear at least once.
 * `fields` limits which keys may be mutated (default: every key except id, *Id and ref).
 * These are test strings, not casting: use edge() for the `huge` state and table tests. The default state shows only
 * ugliness the domain really has (people({ long }), a missing optional field) and numbers that reconcile.
 */
export function edge(rows, r, o = {}) {
  const share = { long: 0.04, empty: 0.04, zero: 0.03, negative: 0.03, huge: 0.02, unicode: 0.04 };
  for (const k of Object.keys(share)) if (typeof o[k] === 'number') share[k] = o[k];
  const sample = rows[0] || {};
  const keys = Object.keys(sample).filter((f) => (o.fields ? o.fields.includes(f) : !/^(id|ref)$|Id$/.test(f)));
  const str = keys.filter((f) => typeof sample[f] === 'string'), numf = keys.filter((f) => typeof sample[f] === 'number');
  const kinds = { long: str, unicode: str, empty: [...str, ...numf], zero: numf, negative: numf, huge: numf };
  const mutate = {
    long: () => r.pick(LONGS), unicode: () => r.pick(UNI), empty: () => null, zero: () => 0,
    negative: (v) => -Math.max(1, Math.abs(v)), huge: () => Math.round(r.float(1e7, 9.9e7) * 100) / 100,
  };
  const out = rows.map((x) => ({ ...x }));
  if (!out.length) return out;
  for (const [kind, fs] of Object.entries(kinds)) {
    if (!fs.length || !share[kind]) continue;
    let hit = 0;
    out.forEach((row) => { if (r.chance(share[kind])) { const f = r.pick(fs); row[f] = mutate[kind](row[f]); hit++; } });
    if (!hit && out.length >= 20) { const row = r.pick(out), f = r.pick(fs); row[f] = mutate[kind](row[f]); }
  }
  return out;
}

// ---- formatting ------------------------------------------------------------------------------------------------
const cache = new Map();
const fmt = (key, make) => { if (!cache.has(key)) cache.set(key, make()); return cache.get(key); };
const none = (n) => n == null || (typeof n === 'number' && Number.isNaN(n));

/** money(1234.5, 'USD', 'en-US') → "$1,234.50". null → "—". */
export const money = (n, currency = 'USD', locale = 'en-US') => none(n) ? '—' : fmt(`m${locale}${currency}`, () => new Intl.NumberFormat(locale, { style: 'currency', currency })).format(n);
/** num(12345, { compact: true }) → "12K". null → "—". */
export const num = (n, { compact = false, locale = 'en-US', digits } = {}) => none(n) ? '—' : fmt(`n${locale}${compact}${digits}`, () => new Intl.NumberFormat(locale, { notation: compact ? 'compact' : 'standard', ...(digits != null ? { maximumFractionDigits: digits } : {}) })).format(n);
/** pct(0.234) → "23.4%". null → "—". */
export const pct = (n, digits = 1, locale = 'en-US') => none(n) ? '—' : fmt(`p${locale}${digits}`, () => new Intl.NumberFormat(locale, { style: 'percent', minimumFractionDigits: digits, maximumFractionDigits: digits })).format(n);
/** dur(ms) → "850 ms", "42 s", "5m", "3h 20m", "2d 4h". null → "—". */
export function dur(ms) {
  if (none(ms)) return '—';
  const a = Math.abs(ms), s = ms < 0 ? '-' : '';
  if (a < 1e3) return `${s}${Math.round(a)} ms`;
  if (a < 6e4) return `${s}${Math.round(a / 1e3)} s`;
  if (a < 36e5) return `${s}${Math.round(a / 6e4)}m`;
  if (a < DAY) return `${s}${Math.floor(a / 36e5)}h ${Math.round((a % 36e5) / 6e4)}m`.replace(' 0m', '');
  return `${s}${Math.floor(a / DAY)}d ${Math.round((a % DAY) / 36e5)}h`.replace(' 0h', '');
}
