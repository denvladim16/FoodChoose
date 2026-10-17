#!/usr/bin/env node
/**
 * Промо Меню — изтегля актуалните брошури и цени и ги записва в data/.
 *
 * Пуска се от GitHub Actions (.github/workflows/update-data.yml) всяка сутрин.
 * Може да се пусне и локално:  node scripts/update-data.mjs
 *
 * Защо е нужен този скрипт? Браузърът не може да чете директно lidl.bg,
 * kaufland.bg и т.н. от страница на github.io (CORS забрана). Затова
 * данните се изтеглят от сървър (GitHub Actions) и се записват като JSON
 * файлове до index.html — тях приложението вече може да чете свободно.
 *
 * Източници:
 *  1) Брошури Lidl и Kaufland — платформата Schwarz leaflets
 *     (endpoints.leaflets.schwarz), същата, която ползват официалните сайтове.
 *     Дава снимки на страниците, PDF и ключови думи по страница.
 *  2) Брошура Billa — търси се връзка към view.publitas.com в billa.bg.
 *  3) Цени и промоции — отворените данни на КЗП (kolkostruva.bg/opendata):
 *     всеки ден всяка верига подава CSV с редовна и промо цена на основните храни.
 *
 * Никакви npm зависимости: нужни са Node 20+ (вграден fetch) и командата `unzip`.
 */
import { mkdir, writeFile, readFile, readdir, rm, mkdtemp, stat } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATA_DIR = path.join(ROOT, 'data');
const UA = 'Mozilla/5.0 (compatible; PromoMenuBot/1.0; +https://github.com/)';
const SCHWARZ = 'https://endpoints.leaflets.schwarz/v4/flyer';

const STORES = {
  lidl: { name: 'Lidl', match: /(^|[^\p{L}])(lidl|лидл)/iu },
  kaufland: { name: 'Kaufland', match: /(^|[^\p{L}])(kaufland|кауфланд)/iu },
  billa: { name: 'Billa', match: /(^|[^\p{L}])(billa|била|билла)([^\p{L}]|$)/iu },
};

// ---------- помощни ----------
const log = (...a) => console.log('[update]', ...a);
const warn = (...a) => console.warn('[update] ВНИМАНИЕ:', ...a);
const today = () => new Date().toISOString().slice(0, 10);

async function get(url, { type = 'text', timeout = 60000, retries = 2 } = {}) {
  let lastErr;
  for (let i = 0; i <= retries; i++) {
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), timeout);
      const res = await fetch(url, {
        headers: { 'User-Agent': UA, 'Accept-Language': 'bg-BG,bg;q=0.9,en;q=0.5' },
        signal: ctrl.signal,
        redirect: 'follow',
      });
      clearTimeout(t);
      if (!res.ok) throw new Error(`HTTP ${res.status} за ${url}`);
      if (type === 'json') return await res.json();
      if (type === 'buffer') return Buffer.from(await res.arrayBuffer());
      return await res.text();
    } catch (e) {
      lastErr = e;
      if (i < retries) await new Promise((r) => setTimeout(r, 1500 * (i + 1)));
    }
  }
  throw lastErr;
}

const uniq = (arr) => [...new Set(arr)];
const median = (arr) => {
  if (!arr.length) return null;
  const s = [...arr].sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
};
const round2 = (n) => (n == null ? null : Math.round(n * 100) / 100);
const clean = (s) => String(s ?? '').replace(/\s+/g, ' ').trim();

// ---------- 1) Брошури Lidl / Kaufland (Schwarz leaflets) ----------

/** Намира идентификаторите на брошурите от страницата-списък на веригата. */
async function discoverSchwarzFlyers(store) {
  if (store === 'lidl') {
    const html = await get('https://www.lidl.bg/c/broshura/s10020060');
    const ids = [...html.matchAll(/\/l\/bg\/broshura\/([a-z0-9-]+)\/ar\/(\d+)/gi)].map((m) => ({ id: m[1], region: m[2] }));
    return uniqBy(ids, (x) => x.id);
  }
  if (store === 'kaufland') {
    let ids = [];
    try {
      const html = await get('https://www.kaufland.bg/broshuri.html');
      ids = [...html.matchAll(/leaflets\.kaufland\.com\/bg-BG\/([A-Za-z0-9_-]+)\/ar\/(\d+)/g)].map((m) => ({ id: m[1], region: m[2] }));
    } catch (e) {
      warn(`Kaufland списък: ${e.message}`);
    }
    // резервен вариант: основната седмична брошура следва шаблона BG_bg_KDZ_1000_BG<седмица>-LFT
    if (!ids.length) {
      const now = new Date();
      for (const plus of [0, 7]) {
        const d = new Date(now.getTime() + plus * 86400000);
        ids.push({ id: `BG_bg_KDZ_1000_BG${String(isoWeek(d)).padStart(2, '0')}-LFT`, region: '1000' });
      }
      log('Kaufland: ползвам изчислени идентификатори на брошурите');
    }
    return uniqBy(ids, (x) => x.id);
  }
  return [];
}

function uniqBy(arr, key) {
  const seen = new Set();
  return arr.filter((x) => (seen.has(key(x)) ? false : (seen.add(key(x)), true)));
}

async function fetchSchwarzFlyer(store, { id, region }) {
  const url = `${SCHWARZ}?flyer_identifier=${encodeURIComponent(id)}&region_id=${region}&region_code=${region}`;
  const json = await get(url, { type: 'json' });
  if (!json?.success || !json.flyer) throw new Error(`брошура ${id}: ${json?.message || 'няма данни'}`);
  const f = json.flyer;
  const pages = (f.pages || [])
    .filter((p) => p.image)
    .map((p) => ({
      n: p.number,
      img: p.image,
      thumb: p.thumbnail || p.image,
      zoom: p.zoom || p.image,
      w: p.width,
      h: p.height,
      // ключови думи + описание — за търсене в брошурата и връзка с рецептите
      text: clean(`${p.keyWords || ''} ${p.altText || ''}`.replace(/S\d-Bg-Kw\d+\S*/gi, '')).slice(0, 1200),
      links: (p.links || []).filter((l) => l.url).map((l) => ({ title: clean(l.title), url: l.url })).slice(0, 6),
    }));
  const viewUrl =
    store === 'lidl'
      ? `https://www.lidl.bg/l/bg/broshura/${id}/ar/${region}`
      : `https://leaflets.kaufland.com/bg-BG/${id}/ar/${region}`;
  return {
    id,
    store,
    name: clean(f.name || ''),
    title: clean(f.title || f.name || 'Брошура'),
    from: f.offerStartDate || f.startDate || null,
    to: f.offerEndDate || f.endDate || null,
    pdf: f.pdfUrl || null,
    cover: pages[0]?.thumb || f.thumbnailUrl || null,
    url: viewUrl,
    pages,
  };
}

async function collectSchwarz(store) {
  const found = await discoverSchwarzFlyers(store);
  log(`${STORES[store].name}: намерени ${found.length} брошури`);
  const out = [];
  for (const f of found.slice(0, 12)) {
    try {
      const fl = await fetchSchwarzFlyer(store, f);
      if (fl.to && fl.to < today()) continue; // изтекла
      if (!fl.pages.length) continue;
      out.push(fl);
    } catch (e) {
      warn(`${STORES[store].name} ${f.id}: ${e.message}`);
    }
  }
  // седмичните брошури (с промоции на храни) първо, после по начална дата
  out.sort((a, b) => (a.from || '').localeCompare(b.from || '') || b.pages.length - a.pages.length);
  return out;
}

// ---------- 2) Брошура Billa (Publitas) ----------
async function collectBilla() {
  const result = {
    store: 'billa',
    url: 'https://www.billa.bg/promocii/sedmichna-broshura',
    embed: null,
    note: '',
  };
  const candidates = [];
  for (const page of ['https://www.billa.bg/promocii/sedmichna-broshura', 'https://www.billa.bg/promocii']) {
    try {
      const html = await get(page);
      const links = [...html.matchAll(/https?:\\?\/\\?\/view\.publitas\.com\\?\/billa-bulgaria\\?\/([a-z0-9_.-]+)/gi)].map((m) => m[1]);
      candidates.push(...links.filter((s) => /weekly|leaflet|broshur|brochure/i.test(s)));
    } catch (e) {
      warn(`Billa ${page}: ${e.message}`);
    }
  }
  // резервен вариант: познаваме името по шаблона, който Billa ползва
  // (напр. bg_weekly_digital_leaflet_16-04-22-04-2026_cw16_web) — седмицата е четвъртък–сряда
  const now = new Date();
  for (const back of [0, 7]) {
    const thu = new Date(now);
    thu.setUTCDate(thu.getUTCDate() - ((thu.getUTCDay() + 3) % 7) - back); // последният четвъртък
    const wed = new Date(thu);
    wed.setUTCDate(wed.getUTCDate() + 6);
    const dd = (d) => String(d.getUTCDate()).padStart(2, '0') + '-' + String(d.getUTCMonth() + 1).padStart(2, '0');
    const cw = String(isoWeek(thu)).padStart(2, '0');
    candidates.push(`bg_weekly_digital_leaflet_${dd(thu)}-${dd(wed)}-${wed.getUTCFullYear()}_cw${cw}_web`);
  }
  for (const slug of uniq(candidates)) {
    const url = `https://view.publitas.com/billa-bulgaria/${slug}/`;
    try {
      const html = await get(url, { retries: 0 });
      if (/publication is offline/i.test(html)) continue;
      result.embed = url;
      const m = slug.match(/(\d{2})-(\d{2})-(\d{2})-(\d{2})-(\d{4})/);
      if (m) {
        result.from = `${m[5]}-${m[2]}-${m[1]}`;
        result.to = `${m[5]}-${m[4]}-${m[3]}`;
      }
      log(`Billa: намерена брошура ${slug}`);
      break;
    } catch {
      /* следващ кандидат */
    }
  }
  if (!result.embed) {
    result.note = 'Брошурата на Billa не можа да бъде намерена автоматично — отвори я от официалния сайт.';
    warn('Billa: не е намерена Publitas брошура (ще се показва връзка към billa.bg)');
  }
  return result;
}

function isoWeek(d) {
  const t = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const day = t.getUTCDay() || 7;
  t.setUTCDate(t.getUTCDate() + 4 - day);
  const y0 = new Date(Date.UTC(t.getUTCFullYear(), 0, 1));
  return Math.ceil(((t - y0) / 86400000 + 1) / 7);
}

// ---------- 3) Цени от kolkostruva.bg ----------

/** Прост и устойчив CSV парсер: кавички, BOM, разделител „,“ или „;“. */
export function parseCSV(text) {
  text = text.replace(/^﻿/, '');
  const firstLine = text.slice(0, text.indexOf('\n') === -1 ? text.length : text.indexOf('\n'));
  const delim = (firstLine.match(/;/g) || []).length > (firstLine.match(/,/g) || []).length ? ';' : ',';
  const rows = [];
  let row = [];
  let field = '';
  let q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; } else q = false;
      } else field += c;
    } else if (c === '"') q = true;
    else if (c === delim) { row.push(field); field = ''; }
    else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else if (c !== '\r') field += c;
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row); }
  return rows.filter((r) => r.length > 1 || (r[0] && r[0].trim()));
}

const num = (s) => {
  if (s == null) return null;
  const v = parseFloat(String(s).replace(/\s/g, '').replace(',', '.'));
  return Number.isFinite(v) && v > 0 ? v : null;
};

/** Обобщава CSV на една верига: по продукт — медиана на цената в обектите. */
export function aggregateChain(rows) {
  const header = rows[0].map((h) => h.toLowerCase());
  const col = (re, fallback) => {
    const i = header.findIndex((h) => re.test(h));
    return i === -1 ? fallback : i;
  };
  const iStore = col(/търговски обект/, 1);
  const iName = col(/наименование/, 2);
  const iCode = col(/код/, 3);
  const iCat = col(/категория/, 4);
  const iPrice = col(/цена на дребно/, 5);
  const iPromo = col(/промоц/, 6);
  const map = new Map();
  const stores = new Set();
  for (const r of rows.slice(1)) {
    const price = num(r[iPrice]);
    if (!price) continue;
    const code = clean(r[iCode]) || clean(r[iName]);
    const name = clean(r[iName]);
    let promo = num(r[iPromo]);
    if (promo && promo >= price) promo = null;
    stores.add(clean(r[iStore]));
    let p = map.get(code);
    if (!p) {
      p = { code, names: new Map(), cat: clean(r[iCat]), prices: [], promos: [], n: 0 };
      map.set(code, p);
    }
    if (name) p.names.set(name, (p.names.get(name) || 0) + 1);
    p.prices.push(price);
    if (promo) p.promos.push(promo);
    p.n++;
  }
  const products = [];
  for (const p of map.values()) {
    const name = [...p.names.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || p.code;
    const promoShare = p.promos.length / p.n;
    products.push({
      code: p.code,
      name,
      cat: p.cat,
      price: round2(median(p.prices)),
      // промо цената се брои само ако е в поне 30% от магазините
      promo: promoShare >= 0.3 ? round2(median(p.promos)) : null,
      promoShare: round2(promoShare),
      stores: p.n,
    });
  }
  products.sort((a, b) => a.name.localeCompare(b.name, 'bg'));
  return { storeCount: stores.size, products };
}

async function latestOpendataDate() {
  const html = await get('https://kolkostruva.bg/opendata');
  const dates = uniq([...html.matchAll(/opendata_files\/(\d{4}-\d{2}-\d{2})\.zip/g)].map((m) => m[1])).sort();
  if (!dates.length) throw new Error('не са намерени архиви на kolkostruva.bg/opendata');
  return dates[dates.length - 1];
}

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else out.push(p);
  }
  return out;
}

export async function pricesFromZip(zipPath) {
  const dir = await mkdtemp(path.join(tmpdir(), 'kolkostruva-'));
  try {
    // -O UTF-8: имената на файловете в архива може да са на кирилица
    try {
      execFileSync('unzip', ['-q', '-o', '-O', 'UTF-8', zipPath, '-d', dir], { stdio: 'pipe' });
    } catch {
      execFileSync('unzip', ['-q', '-o', zipPath, '-d', dir], { stdio: 'pipe' });
    }
    const files = (await walk(dir)).filter((f) => /\.csv$/i.test(f));
    log(`kolkostruva: ${files.length} CSV файла в архива`);
    const result = {};
    for (const f of files) {
      const base = path.basename(f);
      let store = Object.keys(STORES).find((k) => STORES[k].match.test(base));
      let text;
      if (!store) {
        // името на файла не казва веригата — гледаме колоната „Търговски обект“
        const st = await stat(f);
        if (st.size < 200) continue;
        text = await readFile(f, 'utf8');
        // проверяваме само колоната „Търговски обект“ на първите редове
        const sample = parseCSV(text.slice(0, 6000).split('\n').slice(0, 6).join('\n'));
        const iStore = Math.max(0, (sample[0] || []).findIndex((h) => /търговски обект/i.test(h)));
        const names = sample.slice(1).map((r) => r[iStore] || '').join(' | ');
        store = Object.keys(STORES).find((k) => STORES[k].match.test(names));
        if (!store) continue;
      }
      text ??= await readFile(f, 'utf8');
      const rows = parseCSV(text);
      if (rows.length < 2) continue;
      const agg = aggregateChain(rows);
      // ако веригата е подала няколко файла — сливаме ги
      if (result[store]) {
        const byCode = new Map(result[store].products.map((p) => [p.code, p]));
        for (const p of agg.products) if (!byCode.has(p.code)) result[store].products.push(p);
        result[store].storeCount += agg.storeCount;
      } else result[store] = agg;
      log(`kolkostruva: ${STORES[store].name} ← ${base} (${agg.products.length} продукта, ${agg.storeCount} обекта)`);
    }
    return result;
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

async function collectPrices() {
  const date = await latestOpendataDate();
  log(`kolkostruva: последен архив ${date}`);
  const buf = await get(`https://kolkostruva.bg/opendata_files/${date}.zip`, { type: 'buffer', timeout: 300000 });
  const zipPath = path.join(tmpdir(), `kolkostruva-${date}.zip`);
  await writeFile(zipPath, buf);
  try {
    const chains = await pricesFromZip(zipPath);
    return { date, source: 'https://kolkostruva.bg/opendata', currency: 'EUR', chains };
  } finally {
    await rm(zipPath, { force: true });
  }
}

// ---------- main ----------
async function readJSON(file) {
  try {
    return JSON.parse(await readFile(file, 'utf8'));
  } catch {
    return null;
  }
}

async function main() {
  await mkdir(DATA_DIR, { recursive: true });
  const only = process.argv.slice(2); // напр. `node scripts/update-data.mjs brochures`
  const want = (k) => !only.length || only.includes(k);
  let ok = 0;

  if (want('brochures')) {
    const prev = (await readJSON(path.join(DATA_DIR, 'brochures.json'))) || {};
    const out = { updated: new Date().toISOString(), demo: false, stores: {} };
    for (const s of ['lidl', 'kaufland']) {
      try {
        const list = await collectSchwarz(s);
        out.stores[s] = list.length ? list : prev.stores?.[s] || [];
        if (list.length) ok++;
      } catch (e) {
        warn(`${STORES[s].name}: ${e.message} — пазя старите данни`);
        out.stores[s] = prev.stores?.[s] || [];
      }
    }
    try {
      out.stores.billa = await collectBilla();
    } catch (e) {
      warn(`Billa: ${e.message}`);
      out.stores.billa = prev.stores?.billa || { store: 'billa', url: 'https://www.billa.bg/promocii/sedmichna-broshura' };
    }
    await writeFile(path.join(DATA_DIR, 'brochures.json'), JSON.stringify(out));
    log('записан data/brochures.json');
  }

  if (want('prices')) {
    try {
      const prices = await collectPrices();
      if (Object.keys(prices.chains).length) {
        await writeFile(path.join(DATA_DIR, 'prices.json'), JSON.stringify({ updated: new Date().toISOString(), demo: false, ...prices }));
        log('записан data/prices.json');
        ok++;
      } else warn('kolkostruva: не са намерени Lidl/Kaufland/Billa в архива — пазя старите данни');
    } catch (e) {
      warn(`kolkostruva: ${e.message} — пазя старите данни`);
    }
  }

  if (!ok) {
    console.error('[update] Нито един източник не върна данни.');
    process.exitCode = 1;
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  main();
}
