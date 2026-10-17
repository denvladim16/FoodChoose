/* Промо Меню — седмично меню по промоциите на Lidl, Kaufland и Billa. */
(() => {
  'use strict';
  const ING = window.INGREDIENTS;
  const RECIPES = window.RECIPES;
  const SECTIONS = window.SECTIONS;
  const PACKS = window.PACKS || {};

  // ---------------- константи ----------------
  const STORES = {
    lidl: { n: 'Lidl', c: 'var(--s-lidl)', sub: 'Седмични предложения', url: 'https://www.lidl.bg/c/broshura/s10020060' },
    kaufland: { n: 'Kaufland', c: 'var(--s-kaufland)', sub: 'Актуална брошура', url: 'https://www.kaufland.bg/broshuri.html' },
    billa: { n: 'Billa', c: 'var(--s-billa)', sub: 'Седмична брошура', url: 'https://www.billa.bg/promocii/sedmichna-broshura' },
  };
  const MOODS = [
    { id: 'fast', n: 'Бързи ястия', e: '⚡', bg: 'var(--t1)' },
    { id: 'light', n: 'Нискокалорични', e: '⚖️', bg: 'var(--t2)' },
    { id: 'family', n: 'Семейни любими', e: '👨‍👩‍👧', bg: 'var(--t3)' },
    { id: 'comfort', n: 'Уютна храна', e: '🍲', bg: 'var(--t4)' },
    { id: 'fakeaway', n: 'Като от доставка', e: '🍔', bg: 'var(--t5)' },
    { id: 'gut', n: 'Леко за стомаха', e: '🌿', bg: 'var(--t6)' },
    { id: 'protein', n: 'Много протеин', e: '💪', bg: 'var(--t7)' },
    { id: 'bg', n: 'Българска класика', e: '🇧🇬', bg: 'var(--t8)' },
  ];
  const MOOD = Object.fromEntries(MOODS.map((m) => [m.id, m]));
  const DIETS = [
    { id: 'none', n: 'Без ограничения', e: '🍽️', bg: 'var(--line)' },
    { id: 'vegetarian', n: 'Вегетарианско', e: '🥕', bg: 'var(--t3)' },
    { id: 'vegan', n: 'Веганско', e: '🌱', bg: 'var(--t4)' },
    { id: 'pescatarian', n: 'Пескетарианско', e: '🐟', bg: 'var(--t2)' },
  ];
  const ALLERGIES = [
    { id: 'gluten', n: 'Без глутен', e: '🌾', bg: 'var(--t3)' },
    { id: 'dairy', n: 'Без млечни', e: '🥛', bg: 'var(--t1)' },
    { id: 'egg', n: 'Без яйца', e: '🥚', bg: 'var(--t8)' },
    { id: 'nuts', n: 'Без ядки', e: '🌰', bg: 'var(--t5)' },
    { id: 'fish', n: 'Без риба', e: '🐟', bg: 'var(--t2)' },
    { id: 'shellfish', n: 'Без ракообразни', e: '🦐', bg: 'var(--t6)' },
    { id: 'soy', n: 'Без соя', e: '🫘', bg: 'var(--t4)' },
    { id: 'sesame', n: 'Без сусам', e: '⚪', bg: 'var(--t7)' },
  ];
  const PROTEINS = [
    { id: 'chicken', n: 'Пилешко', e: '🍗', bg: 'var(--t5)' },
    { id: 'pork', n: 'Свинско', e: '🥓', bg: 'var(--t3)' },
    { id: 'beef', n: 'Телешко и кайма', e: '🥩', bg: 'var(--t7)' },
    { id: 'fish', n: 'Риба и морски', e: '🐟', bg: 'var(--t2)' },
  ];
  const APPLIANCES = [
    { id: 'hob', n: 'Котлон', svg: '<svg viewBox="0 0 48 48"><rect x="5" y="10" width="38" height="28" rx="4"/><circle cx="16" cy="21" r="5"/><circle cx="32" cy="21" r="5"/><circle cx="16" cy="21" r="1.5"/><circle cx="32" cy="21" r="1.5"/><path d="M12 33h4M22 33h4M32 33h4"/></svg>' },
    { id: 'oven', n: 'Фурна', svg: '<svg viewBox="0 0 48 48"><rect x="6" y="6" width="36" height="36" rx="4"/><path d="M6 15h36"/><circle cx="12" cy="10.5" r="1.5"/><circle cx="18" cy="10.5" r="1.5"/><rect x="11" y="20" width="26" height="16" rx="2"/><path d="M15 25h18"/></svg>' },
    { id: 'airfryer', n: 'Еър фрайър', svg: '<svg viewBox="0 0 48 48"><path d="M12 8h24a4 4 0 0 1 4 4v24a6 6 0 0 1-6 6H14a6 6 0 0 1-6-6V12a4 4 0 0 1 4-4z"/><circle cx="24" cy="18" r="5"/><path d="M14 30h20v6H14z"/><path d="M38 33h4"/></svg>' },
    { id: 'microwave', n: 'Микровълнова', svg: '<svg viewBox="0 0 48 48"><rect x="4" y="10" width="40" height="28" rx="4"/><rect x="9" y="15" width="24" height="18" rx="2"/><path d="M38 16v2M38 22v2M38 28v4"/></svg>' },
  ];
  const MEALS = [
    { id: 'b', n: 'Закуска', e: '🍳' },
    { id: 'l', n: 'Обед', e: '🥗' },
    { id: 'd', n: 'Вечеря', e: '🍝' },
  ];
  const MEAL = Object.fromEntries(MEALS.map((m) => [m.id, m]));
  const DAYS = ['Понеделник', 'Вторник', 'Сряда', 'Четвъртък', 'Петък', 'Събота', 'Неделя'];
  const DAYS_SHORT = ['Пон', 'Вт', 'Ср', 'Чет', 'Пет', 'Съб', 'Нед'];
  const TINTS = ['var(--t1)', 'var(--t2)', 'var(--t3)', 'var(--t4)', 'var(--t5)', 'var(--t6)', 'var(--t7)', 'var(--t8)'];
  const fmt = new Intl.NumberFormat('bg-BG', { style: 'currency', currency: 'EUR', minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const money = (v) => fmt.format(v || 0);
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const $ = (sel, root = document) => root.querySelector(sel);
  const fmtDate = (iso) => {
    if (!iso) return '';
    const [, m, d] = iso.slice(0, 10).split('-');
    return `${d}.${m}`;
  };
  const todayISO = () => new Date().toISOString().slice(0, 10);
  const mealsOf = (r) => r.meal || ['l', 'd'];
  const gotvachLink = (q) => `https://www.google.com/search?q=${encodeURIComponent('site:gotvach.bg ' + q)}`;

  // ---------------- състояние (пази се в браузъра) ----------------
  const KEY = 'promo-menu-v1';
  const defaultSlots = () => ({ 0: ['d'], 1: ['d'], 2: ['d'], 3: ['d'], 4: ['d'] });
  const DEFAULT = {
    onboarded: false,
    prefs: { store: null, people: 2, budget: 40, moods: [], diet: 'none', allergies: [], proteins: [], appliances: ['hob'], slots: defaultSlots() },
    plan: [], // [{day, meal, rid}]
    lastIds: [], // рецептите от предишния план — за разнообразие
    bought: {}, // {ingId: true} — отметнато в магазина
    have: {}, // {ingId: true} — имам го вкъщи, не се брои в цената
    favs: [],
    name: '',
  };
  let S = load();
  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const s = JSON.parse(raw);
        const st = { ...structuredClone(DEFAULT), ...s, prefs: { ...DEFAULT.prefs, ...(s.prefs || {}) } };
        // миграция от старата версия („вечери тази седмица“)
        if (!s.prefs?.slots) {
          const n = s.prefs?.nights || 5;
          st.prefs.slots = Object.fromEntries(Array.from({ length: n }, (_, i) => [i, ['d']]));
        }
        delete st.prefs.nights;
        st.plan = (st.plan || []).map((p) => ({ meal: 'd', ...p }));
        st.have ||= {};
        st.lastIds ||= [];
        return st;
      }
    } catch (e) { /* няма достъп до localStorage — работим само в паметта */ }
    return structuredClone(DEFAULT);
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* игнорираме */ }
  }

  // ---------------- данни: цени и брошури ----------------
  const DATA = { prices: null, brochures: null, loaded: false };
  async function loadData() {
    const get = async (u) => {
      try {
        const r = await fetch(u, { cache: 'no-cache' });
        return r.ok ? await r.json() : null;
      } catch { return null; }
    };
    const [prices, brochures] = await Promise.all([get('data/prices.json'), get('data/brochures.json')]);
    DATA.prices = prices;
    DATA.brochures = brochures;
    DATA.loaded = true;
    PRICE_CACHE.clear();
  }

  /** Разчита количество от името на продукта: „Ориз 1 кг“, „Мляко 1 л“, „4 x 125 г“, „10 бр“.
   *  Връща {kind, amount, loose}. loose = продава се на килограм (няма грамаж). */
  function parseQty(name) {
    const s = name.toLowerCase().replace(/,/g, '.');
    const unit = (u) => (/^(кг|kg)$/.test(u) ? ['mass', 1] : /^(гр|г|g)$/.test(u) ? ['mass', 0.001] : /^(л|l|lt)$/.test(u) ? ['vol', 1] : /^(мл|ml)$/.test(u) ? ['vol', 0.001] : ['pc', 1]);
    let m = s.match(/(\d+)\s*[xх×*]\s*(\d+(?:\.\d+)?)\s*(кг|kg|гр|г|g|л|l|мл|ml)(?![\p{L}])/u);
    if (m) {
      const [k, f] = unit(m[3]);
      return { kind: k, amount: +m[1] * +m[2] * f, loose: false };
    }
    m = s.match(/(\d+(?:\.\d+)?)\s*(кг|kg|гр|г|g|л|lt|l|мл|ml|бр|броя)(?![\p{L}])/u);
    if (m) {
      const [k, f] = unit(m[2].replace('.', ''));
      return { kind: k, amount: +m[1] * f, loose: false };
    }
    if (/(^|[^\p{L}])(кг|kg)([^\p{L}]|$)|насипн|на килограм/u.test(s)) return { kind: 'mass', amount: 1, loose: true };
    return null;
  }

  /** Цена за 1 кг / 1 л / 1 брой (в мерната единица на рецептата) + размер на опаковката. */
  function unitAndPack(ing, product, price) {
    let q = parseQty(product.name);
    if (!q) q = ing.u === 'pc' ? { kind: 'pc', amount: ing.per ? 0 : 1, loose: !!ing.per } : { kind: ing.u === 'ml' ? 'vol' : 'mass', amount: 1, loose: true };
    let v = null, pack = null;
    if (ing.u === 'g') {
      if (q.kind === 'mass' || q.kind === 'vol') { v = price / q.amount; pack = q.amount * 1000; }
      else if (q.kind === 'pc' && ing.per) { v = price / ((q.amount * ing.per) / 1000); pack = q.amount * ing.per; }
    } else if (ing.u === 'ml') {
      if (q.kind === 'vol' || q.kind === 'mass') { v = price / q.amount; pack = q.amount * 1000; }
    } else {
      if (q.kind === 'pc' && q.amount) { v = price / q.amount; pack = q.amount; }
      else if (q.kind === 'mass' && ing.per) { v = (price / q.amount) * (ing.per / 1000); pack = null; }
      else if (q.kind === 'pc' && !q.amount && ing.per) { v = price * (ing.per / 1000); pack = null; }
    }
    if (!v || !isFinite(v)) return null;
    // защита от грешно разчетени количества: цена извън 0.25–4 пъти от ориентировъчната се пропуска
    if (ing.fb && (v < ing.fb * 0.25 || v > ing.fb * 4)) return null;
    if (q.loose) pack = null;
    return { v, pack, price };
  }

  const PRICE_CACHE = new Map();
  /**
   * Цена на продукт във веригата:
   *  unit — цена за 1 кг/л/бр, pack — колко е една опаковка (null = на тегло), packPrice — цена на опаковката,
   *  promo/pct — дали е в промоция и с колко %, real — дали е реална цена от kolkostruva.bg.
   */
  function priceOf(ingId, store) {
    const key = ingId + '|' + store;
    if (PRICE_CACHE.has(key)) return PRICE_CACHE.get(key);
    const ing = ING[ingId];
    const fbPack = PACKS[ingId] ?? (ing.u === 'pc' && !ing.per ? 1 : null);
    const fbPackPrice = (unit, pack) => (pack ? (ing.u === 'pc' ? pack * unit : (pack / 1000) * unit) : null);
    let res = { unit: ing.fb || 0, pack: fbPack, packPrice: fbPackPrice(ing.fb || 0, fbPack), promo: false, pct: 0, product: null, real: false };
    const chain = DATA.prices?.chains?.[store];
    if (ing.m && chain?.products?.length) {
      const re = new RegExp(ing.m, 'iu');
      const ex = ing.x ? new RegExp(ing.x, 'iu') : null;
      let best = null;
      for (const p of chain.products) {
        if (!re.test(p.name) || (ex && ex.test(p.name))) continue;
        const reg = unitAndPack(ing, p, p.price);
        if (!reg) continue;
        const pr = p.promo ? unitAndPack(ing, p, p.promo) : null;
        const eff = pr || reg;
        if (!best || eff.v < best.unit) {
          // продукти, които обикновено са на тегло (месо, зеленчуци), се броят на тегло
          let pack = PACKS[ingId] === undefined && ing.u !== 'pc' ? null : eff.pack;
          best = { unit: eff.v, pack, packPrice: pack ? fbPackPrice(eff.v, pack) : null, promo: !!pr, pct: pr ? Math.round((1 - pr.price / reg.price) * 100) : 0, product: p.name, real: true };
        }
      }
      if (best) res = best;
    }
    PRICE_CACHE.set(key, res);
    return res;
  }

  /** Колко трябва да се купи: цели опаковки или на тегло. */
  function buyInfo(ingId, qty, store) {
    const ing = ING[ingId];
    const p = priceOf(ingId, store);
    if (p.pack) {
      const n = Math.max(1, Math.ceil(qty / p.pack - 0.03));
      return { cost: n * p.packPrice, label: `${n} × ${qtyLabel(ing, p.pack)}`, p };
    }
    if (ing.u === 'pc') {
      const n = Math.max(1, Math.ceil(qty - 0.01));
      return { cost: n * p.unit, label: `${n} бр`, p };
    }
    return { cost: (qty / 1000) * p.unit, label: `~${qtyLabel(ing, qty)} на тегло`, p };
  }

  /** Търси продукта в текста на страниците на актуалните брошури на веригата. */
  function brochureHit(ingId, store) {
    const ing = ING[ingId];
    if (!ing.kw || !Array.isArray(DATA.brochures?.stores?.[store])) return null;
    const flyers = currentFlyers(store);
    for (const f of flyers) {
      for (const pg of f.pages) {
        const t = (pg.text || '').toLowerCase();
        if (ing.kw.some((k) => t.includes(k))) return { flyer: f, page: pg.n };
      }
    }
    return null;
  }

  function currentFlyers(store) {
    const list = DATA.brochures?.stores?.[store];
    if (!Array.isArray(list)) return [];
    const t = todayISO();
    return list.filter((f) => !f.to || f.to >= t);
  }

  // ---------------- рецепти: цена, тагове, филтри ----------------
  const scale = () => S.prefs.people / 2;
  const itemCost = (ing, qty, unit) => (ing.u === 'pc' ? qty * unit : (qty / 1000) * unit);

  /** Цена на ястието по използваното количество (за сравнение между ястия). */
  function recipeCost(r, store = S.prefs.store) {
    let total = 0, promoCost = 0, promoCount = 0, brCount = 0;
    for (const [id, q] of r.ing) {
      const ing = ING[id];
      if (ing.pantry) continue;
      const p = priceOf(id, store);
      const c = itemCost(ing, q * scale(), p.unit);
      total += c;
      if (p.promo) { promoCost += c; promoCount++; }
      else if (brochureHit(id, store)) { brCount++; promoCost += c * 0.5; }
    }
    return { total, promoShare: total ? promoCost / total : 0, promoCount, brCount };
  }

  function autoTags(r) {
    const t = new Set(r.tags);
    if (r.time <= 25) t.add('fast');
    if (r.kcal <= 480) t.add('light');
    if (r.p >= 38) t.add('protein');
    return [...t];
  }
  const recipeKinds = (r) => new Set(r.ing.map(([id]) => ING[id].k));
  const recipeAllergens = (r) => new Set(r.ing.flatMap(([id]) => ING[id].al || []));

  function isEligible(r, P = S.prefs) {
    const k = recipeKinds(r);
    if (P.diet === 'vegan' && ['meat', 'fish', 'shellfish', 'dairy', 'egg', 'animal'].some((x) => k.has(x))) return false;
    if (P.diet === 'vegetarian' && ['meat', 'fish', 'shellfish'].some((x) => k.has(x))) return false;
    if (P.diet === 'pescatarian' && k.has('meat')) return false;
    const al = recipeAllergens(r);
    if (P.allergies.some((a) => al.has(a))) return false;
    if (!r.app.every((a) => P.appliances.includes(a))) return false;
    if (P.diet === 'none' && r.prot !== 'veg' && P.proteins.length && !P.proteins.includes(r.prot)) return false;
    return true;
  }

  /**
   * Оценка на рецепта. Защо така:
   *  - настроение (+2.5 за всяко съвпадение) и промоции (+3 × дял в промоция) са основните причини да я изберем;
   *  - цената тежи по-малко (−0.8 × спрямо средната), иначе винаги печелят едни и същи евтини ястия;
   *  - рецептите от предишния план получават −3, за да не се повтарят при „Нов план“;
   *  - случайно число 0–3 разбърква останалото, за да е различно всеки път.
   */
  function score(r, avg) {
    const c = recipeCost(r);
    const tags = autoTags(r);
    const moodHits = S.prefs.moods.filter((m) => tags.includes(m)).length;
    return 2.5 * moodHits + 3 * c.promoShare + (S.favs.includes(r.id) ? 1 : 0) - 0.8 * (c.total / (avg || 1)) - (S.lastIds.includes(r.id) ? 3 : 0) + Math.random() * 3;
  }

  /** Всички слотове (ден + хранене) по ред. */
  function slotList() {
    const out = [];
    for (let d = 0; d < 7; d++) for (const m of MEALS) if (S.prefs.slots[d]?.includes(m.id)) out.push({ day: d, meal: m.id });
    return out;
  }
  const slotCount = () => slotList().length;

  function poolFor(meal) {
    let pool = RECIPES.filter((r) => mealsOf(r).includes(meal) && isEligible(r));
    if (!pool.length) pool = RECIPES.filter((r) => mealsOf(r).includes(meal) && r.app.every((a) => S.prefs.appliances.includes(a)));
    if (!pool.length) pool = RECIPES.filter((r) => mealsOf(r).includes(meal));
    return pool;
  }

  function buildPlan() {
    S.lastIds = S.plan.map((p) => p.rid);
    const slots = slotList();
    const ranked = {};
    for (const m of MEALS) {
      const pool = poolFor(m.id);
      const avg = pool.reduce((s, r) => s + recipeCost(r).total, 0) / (pool.length || 1);
      ranked[m.id] = pool.map((r) => ({ r, s: score(r, avg) })).sort((a, b) => b.s - a.s);
    }
    const used = new Set();
    const lastProt = {};
    const plan = [];
    for (const sl of slots) {
      const list = ranked[sl.meal];
      let pick = list.find((x) => !used.has(x.r.id) && (x.r.prot === 'veg' || x.r.prot !== lastProt[sl.meal]));
      if (!pick) pick = list.find((x) => !used.has(x.r.id));
      if (!pick) pick = list[Math.floor(Math.random() * list.length)]; // малко рецепти — повтаряме
      used.add(pick.r.id);
      lastProt[sl.meal] = pick.r.prot;
      plan.push({ ...sl, rid: pick.r.id });
    }
    // вкарване в бюджета: сменяме най-скъпото ястие с по-евтино от същия вид, докато може
    const tried = new Set();
    for (let guard = 0; guard < 30; guard++) {
      if (shoppingTotal(S.prefs.store, plan) <= S.prefs.budget) break;
      let worst = -1;
      plan.forEach((p, i) => {
        if (tried.has(i)) return;
        if (worst === -1 || recipeCost(byId(p.rid)).total > recipeCost(byId(plan[worst].rid)).total) worst = i;
      });
      if (worst === -1) break;
      const cur = recipeCost(byId(plan[worst].rid)).total;
      const ids = new Set(plan.map((p) => p.rid));
      const cheaper = ranked[plan[worst].meal]
        .filter((x) => !ids.has(x.r.id) && recipeCost(x.r).total < cur * 0.85)
        .sort((a, b) => recipeCost(a.r).total - recipeCost(b.r).total);
      if (!cheaper.length) { tried.add(worst); continue; }
      plan[worst] = { ...plan[worst], rid: cheaper.slice(0, 4).sort((a, b) => b.s - a.s)[0].r.id };
    }
    S.plan = plan;
    S.bought = {};
    save();
  }

  function swapMeal(idx) {
    const cur = S.plan[idx];
    const used = new Set(S.plan.map((p) => p.rid));
    const pool = poolFor(cur.meal).filter((r) => !used.has(r.id));
    if (!pool.length) return toast('Няма други подходящи рецепти');
    const avg = pool.reduce((s, r) => s + recipeCost(r).total, 0) / pool.length;
    const ranked = pool.map((r) => ({ r, s: score(r, avg) })).sort((a, b) => b.s - a.s);
    const fits = ranked.filter((x) => {
      const test = S.plan.map((p, i) => (i === idx ? { ...p, rid: x.r.id } : p));
      return shoppingTotal(S.prefs.store, test) <= S.prefs.budget;
    });
    const cands = (fits.length ? fits : ranked.sort((a, b) => recipeCost(a.r).total - recipeCost(b.r).total)).slice(0, 5);
    const pick = cands[Math.floor(Math.random() * cands.length)];
    S.plan[idx] = { ...cur, rid: pick.r.id };
    save();
    return pick.r;
  }

  const byId = (id) => RECIPES.find((r) => r.id === id);

  /** Обобщен списък за пазаруване: продукт → общо количество и в кои ястия е. */
  function groceryList(plan = S.plan) {
    const map = new Map();
    for (const p of plan) {
      const r = byId(p.rid);
      if (!r) continue;
      for (const [id, q] of r.ing) {
        const it = map.get(id) || { id, qty: 0, recipes: [] };
        it.qty += q * scale();
        it.recipes.push(r.name);
        map.set(id, it);
      }
    }
    return [...map.values()];
  }

  /** Сумата на касата: цели опаковки, без продуктите, отбелязани „имам го“. */
  function shoppingTotal(store = S.prefs.store, plan = S.plan) {
    return groceryList(plan).reduce((s, g) => (ING[g.id].pantry || S.have[g.id] ? s : s + buyInfo(g.id, g.qty, store).cost), 0);
  }

  // ---------------- рендериране ----------------
  const root = $('#app');
  let ui = { step: 0, tab: 'plan', brStore: null, offerStore: null, brQuery: '', offerQuery: '', recMeal: 'all' };

  function toast(msg) {
    document.querySelectorAll('.toast').forEach((t) => t.remove());
    const t = document.createElement('div');
    t.className = 'toast';
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 2200);
  }

  function qtyLabel(ing, q) {
    if (ing.pantry) return 'на вкус';
    if (ing.u === 'pc') return `${Math.ceil(q - 0.01)} бр`;
    if (ing.u === 'ml') return q >= 1000 ? `${(q / 1000).toLocaleString('bg-BG', { maximumFractionDigits: 2 })} л` : `${Math.round(q)} мл`;
    return q >= 1000 ? `${(q / 1000).toLocaleString('bg-BG', { maximumFractionDigits: 2 })} кг` : `${Math.round(q)} г`;
  }

  // ---------- онбординг ----------
  function obSteps() {
    const st = ['store', 'people', 'days', 'budget', 'mood', 'diet', 'allergy'];
    if (S.prefs.diet === 'none') st.push('protein');
    st.push('appliances');
    return st;
  }

  function slotsGrid(P) {
    const total = Object.values(P.slots).reduce((s, a) => s + a.length, 0);
    return `<div class="slots">
      <div class="sl-row sl-head"><span></span>${MEALS.map((m) => `<button class="sl-col" data-col="${m.id}"><span class="em">${m.e}</span>${m.n}</button>`).join('')}</div>
      ${DAYS.map((d, i) => `<div class="sl-row"><button class="sl-day ${P.slots[i]?.length ? 'on' : ''}" data-row="${i}">${d}</button>${MEALS.map((m) => `<button class="sl-cell ${P.slots[i]?.includes(m.id) ? 'on' : ''}" data-cell="${i}:${m.id}" aria-label="${d} ${m.n}">${P.slots[i]?.includes(m.id) ? '✓' : ''}</button>`).join('')}</div>`).join('')}
    </div>
    <p class="muted small" style="margin:12px 4px 0">Избрани: <b>${total}</b> ${total === 1 ? 'хранене' : 'хранения'} седмично. Натисни деня, за да избереш целия ред, или заглавието, за да избереш цялата колона.</p>`;
  }

  function renderOnboarding() {
    const steps = obSteps();
    if (ui.step >= steps.length) ui.step = steps.length - 1;
    const key = steps[ui.step];
    const P = S.prefs;
    const pct = ((ui.step + 1) / (steps.length + 1)) * 100;
    let head = '', body = '', canGo = true, ctaText = 'Продължи';

    const tiles = (list, sel, multi) =>
      `<div class="grid2">${list
        .map((o) => `<button class="tile ${o.id === 'none' ? 'none' : ''} ${(multi ? sel.includes(o.id) : sel === o.id) ? 'on' : ''}" data-pick="${o.id}" style="background:${o.bg || 'var(--card)'}"><span class="em">${o.e}</span>${esc(o.n)}</button>`)
        .join('')}</div>`;

    switch (key) {
      case 'store':
        head = '<h1>Избери магазин</h1><p class="muted">Ще планираме седмицата около неговите промоции</p>';
        body = `<div class="store-tiles">${Object.entries(STORES)
          .map(([id, s]) => `<button class="store-tile ${P.store === id ? 'on' : ''}" data-pick="${id}"><span class="store-mark" style="background:${s.c}">${s.n[0]}</span><span><b>${s.n}</b><span class="muted small">${s.sub}</span></span></button>`)
          .join('')}</div>`;
        canGo = !!P.store;
        break;
      case 'people':
        head = '<h1>За колко души готвиш?</h1><p class="muted">Количествата и цената ще се сметнат за толкова порции</p>';
        body = `<div class="stepper"><b>Души</b><div class="ctl"><button data-act="ppl-" aria-label="по-малко">−</button><span>${P.people}</span><button data-act="ppl+" aria-label="повече">+</button></div></div>`;
        break;
      case 'days':
        head = '<h1>Кои дни и хранения?</h1><p class="muted">От 1 до 7 дни. За всеки ден избери закуска, обед, вечеря или и трите</p>';
        body = slotsGrid(P);
        canGo = slotCount() > 0;
        break;
      case 'budget': {
        const n = slotCount() || 1;
        head = '<h1>Какъв е седмичният ти бюджет?</h1><p class="muted">За всички избрани хранения, по цени на цели опаковки</p>';
        body = `<div class="budget-amt">${P.budget} €</div><p class="muted" style="text-align:center;margin:0 0 20px" id="per">≈ ${money(P.budget / n / P.people)} на порция · ${n} хранения × ${P.people} души</p>
          <input type="range" min="10" max="300" step="5" value="${P.budget}" data-act="budget" aria-label="бюджет"><div class="range-lbl"><span>10 €</span><span>300 €</span></div>`;
        break;
      }
      case 'mood':
        head = '<h1>Какво ти се яде?</h1><p class="muted">Избери до 3</p>';
        body = tiles(MOODS, P.moods, true);
        break;
      case 'diet':
        head = '<h1>Специален режим?</h1><p class="muted">Избери един</p>';
        body = tiles(DIETS, P.diet, false);
        break;
      case 'allergy':
        head = '<h1>Алергии?</h1><p class="muted">Избери всички, които важат</p>';
        body = tiles([{ id: 'none', n: 'Нямам', e: '👍', bg: 'var(--line)' }, ...ALLERGIES], P.allergies.length ? P.allergies : ['none'], true);
        break;
      case 'protein':
        head = '<h1>Какво месо обичаш?</h1><p class="muted">Избери протеините, които ядеш. Вегетариански ястия влизат винаги.</p>';
        body = tiles(PROTEINS, P.proteins, true);
        canGo = P.proteins.length > 0;
        break;
      case 'appliances':
        head = '<h1>С какви уреди готвиш?</h1><p class="muted">Избери поне един</p>';
        body = `<div class="appl">${APPLIANCES.map((a) => `<button class="tile ${P.appliances.includes(a.id) ? 'on' : ''}" data-pick="${a.id}">${a.svg}<span>${a.n}</span></button>`).join('')}</div>`;
        canGo = P.appliances.length > 0;
        ctaText = 'Направи плана';
        break;
    }

    root.innerHTML = `<section class="ob">
      <div class="ob-top">${ui.step > 0 || S.onboarded ? '<button class="icon-btn" data-act="back" aria-label="назад">←</button>' : '<span style="width:40px"></span>'}<div class="bar"><i style="width:${pct}%"></i></div></div>
      <div class="ob-head">${head}</div>
      <div class="ob-body">${body}</div>
      <div style="margin-top:22px"><button class="cta" data-act="next" ${canGo ? '' : 'disabled'}>${ctaText}</button></div>
    </section>`;

    root.onclick = (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      const { pick, act, cell, row, col } = b.dataset;
      if (cell) {
        const [d, m] = cell.split(':');
        P.slots[d] ||= [];
        toggle(P.slots[d], m);
        sortSlots(P);
      } else if (row !== undefined) {
        P.slots[row] = P.slots[row]?.length ? [] : ['b', 'l', 'd'];
      } else if (col) {
        const all = DAYS.every((_, i) => P.slots[i]?.includes(col));
        DAYS.forEach((_, i) => {
          P.slots[i] ||= [];
          const has = P.slots[i].includes(col);
          if (all && has) toggle(P.slots[i], col);
          if (!all && !has) P.slots[i].push(col);
        });
        sortSlots(P);
      } else if (pick) {
        if (key === 'store') P.store = pick;
        if (key === 'diet') P.diet = pick;
        if (key === 'mood') toggleMax(P.moods, pick, 3);
        if (key === 'protein') toggle(P.proteins, pick);
        if (key === 'appliances') toggle(P.appliances, pick);
        if (key === 'allergy') pick === 'none' ? (P.allergies = []) : toggle(P.allergies, pick);
      }
      if (act === 'ppl-') P.people = Math.max(1, P.people - 1);
      if (act === 'ppl+') P.people = Math.min(8, P.people + 1);
      if (act === 'back') {
        if (ui.step === 0) { ui.tab = 'settings'; return renderMain(); }
        ui.step--;
      }
      if (act === 'next') {
        if (ui.step < obSteps().length - 1) ui.step++;
        else return renderBuilding();
      }
      save();
      renderOnboarding();
    };
    const range = $('input[type=range]', root);
    if (range) range.oninput = () => {
      P.budget = +range.value;
      $('.budget-amt', root).textContent = P.budget + ' €';
      const n = slotCount() || 1;
      $('#per', root).textContent = `≈ ${money(P.budget / n / P.people)} на порция · ${n} хранения × ${P.people} души`;
      save();
    };
  }
  const sortSlots = (P) => { for (const d in P.slots) P.slots[d].sort((a, b) => 'bld'.indexOf(a) - 'bld'.indexOf(b)); };
  const toggle = (arr, v) => { const i = arr.indexOf(v); i === -1 ? arr.push(v) : arr.splice(i, 1); };
  const toggleMax = (arr, v, max) => { const i = arr.indexOf(v); if (i !== -1) arr.splice(i, 1); else if (arr.length < max) arr.push(v); else toast(`Най-много ${max}`); };

  function renderBuilding() {
    const lines = [`Търся промоции в ${STORES[S.prefs.store].n}`, `Нареждам ${slotCount()} хранения за седмицата`, 'Събирам списъка за пазаруване'];
    root.innerHTML = `<section class="building"><h1>Подготвям седмицата…</h1>
      <div class="cart-stage" id="stage"><div class="cart">🛒</div></div>
      <div class="checklist">${lines.map((l) => `<div><i></i>${esc(l)}</div>`).join('')}</div></section>`;
    const items = ['🥕', '🍅', '🥦', '🧀', '🍗', '🥔', '🍆', '🥚', '🐟', '🧅'];
    const stage = $('#stage');
    let k = 0;
    const iv = setInterval(() => {
      const d = document.createElement('span');
      d.className = 'drop';
      d.textContent = items[k++ % items.length];
      d.style.left = 30 + Math.random() * 40 + '%';
      stage.appendChild(d);
      setTimeout(() => d.remove(), 1200);
    }, 280);
    const rows = root.querySelectorAll('.checklist div');
    const ready = DATA.loaded ? Promise.resolve() : loadData();
    rows.forEach((row, i) => setTimeout(() => { row.classList.add('done'); row.querySelector('i').textContent = '✓'; }, 700 + i * 700));
    Promise.all([ready, new Promise((r) => setTimeout(r, 2500))]).then(() => {
      clearInterval(iv);
      buildPlan();
      S.onboarded = true;
      save();
      ui.tab = 'plan';
      renderMain();
    });
  }

  // ---------- основен екран ----------
  function greeting() {
    const h = new Date().getHours();
    return h < 11 ? 'Добро утро' : h < 18 ? 'Добър ден' : 'Добър вечер';
  }

  function renderMain() {
    window.scrollTo(0, 0);
    const tabs = [
      ['plan', '📋', 'План'],
      ['brochures', '📰', 'Брошури'],
      ['offers', '🏷️', 'Промоции'],
      ['favs', '❤️', 'Рецепти'],
      ['settings', '⚙️', 'Настройки'],
    ];
    const views = { plan: viewPlan, brochures: viewBrochures, offers: viewOffers, favs: viewFavs, settings: viewSettings };
    root.innerHTML = `<main class="screen">${views[ui.tab]()}</main>
      <nav class="nav">${tabs.map(([id, ic, n]) => `<button data-tab="${id}" class="${ui.tab === id ? 'on' : ''}"><span class="ni">${ic}</span>${n}</button>`).join('')}</nav>`;
    root.onclick = onMainClick;
    root.oninput = onMainInput;
  }

  function dataNote(store) {
    const chain = DATA.prices?.chains?.[store];
    if (chain) return `Цените са по официалните данни на КЗП (kolkostruva.bg) към ${fmtDate(DATA.prices.date)} — средно за обектите на ${STORES[store].n}, за цели опаковки. Продукти, които ги няма там, са с ориентировъчна цена.`;
    if (DATA.loaded && !DATA.prices) return 'Още няма изтеглени цени — показвам ориентировъчни, за цели опаковки. Пусни GitHub Action „Обнови данните“ (виж README).';
    return 'Ориентировъчни цени за цели опаковки.';
  }

  function promoIdeas(store) {
    // продукти от плана, които са в промоция — за линкове към Готвач.бг
    const ids = new Set();
    for (const g of groceryList()) if (!ING[g.id].pantry && priceOf(g.id, store).promo) ids.add(g.id);
    if (ids.size < 3) for (const id of Object.keys(ING)) { if (!ING[id].pantry && ING[id].m && priceOf(id, store).promo) ids.add(id); if (ids.size >= 5) break; }
    return [...ids].slice(0, 5);
  }

  function viewPlan() {
    const P = S.prefs;
    if (!S.plan.length) return `<div class="empty"><span class="big">🧺</span>Още нямаш план.<br><br><button class="cta" data-act="rebuild">Направи план</button></div>`;
    const total = shoppingTotal();
    const over = total > P.budget;
    const gl = groceryList().filter((g) => !ING[g.id].pantry);
    const toBuy = gl.filter((g) => !S.have[g.id]);
    const boughtN = toBuy.filter((g) => S.bought[g.id]).length;
    const haveN = gl.length - toBuy.length;
    const compare = Object.keys(STORES).map((s) => ({ s, t: shoppingTotal(s) }));
    const cheapest = compare.reduce((a, b) => (b.t < a.t ? b : a));
    const hasRealPrices = Object.keys(STORES).some((s) => DATA.prices?.chains?.[s]);
    const ideas = promoIdeas(P.store);
    let html = `
      <div class="hello"><div class="tiny">${greeting()}</div><h1>Шеф${S.name ? ' ' + esc(S.name) : ''}!</h1>
        <span class="pill"><span class="dot" style="background:${STORES[P.store].c}"></span>планирано за ${STORES[P.store].n}</span></div>
      <div class="summary">
        <div class="card cost"><div class="tiny">За пазаруване</div><b>${money(total)}</b> <span class="of">/ ${P.budget} €</span>
          <div class="meter ${over ? 'over' : ''}"><i style="width:${Math.min(100, (total / P.budget) * 100)}%"></i></div>
          ${haveN ? `<div class="small muted" style="margin-top:6px">🏠 ${haveN} ги имаш вкъщи</div>` : ''}</div>
        <button class="card glist" data-act="grocery"><div class="tiny" style="color:var(--info)">Виж</div><b>Списък за пазаруване</b><span class="small muted">${boughtN}/${toBuy.length} купени</span></button>
      </div>
      ${over ? `<div class="banner">Излиза над бюджета с ${money(total - P.budget)}. Отбележи в списъка продуктите, които вече имаш, смени някое ястие или увеличи бюджета.</div>` : ''}
      ${hasRealPrices ? `<div class="compare">${compare.map((c) => `<button class="cmp ${c.s === P.store ? 'on' : ''} ${c.s === cheapest.s ? 'best' : ''}" data-act="store" data-v="${c.s}"><span class="dot" style="background:${STORES[c.s].c}"></span>${STORES[c.s].n} ${money(c.t)}</button>`).join('')}</div>` : ''}
      <p class="note">${esc(dataNote(P.store))}</p>`;
    // по дни
    for (let d = 0; d < 7; d++) {
      const items = S.plan.map((p, i) => ({ p, i })).filter(({ p }) => p.day === d);
      if (!items.length) continue;
      html += `<div class="day-head">${DAYS[d]}</div>`;
      html += items.map(({ p, i }) => dayCard(byId(p.rid), i, `${MEAL[p.meal].e} ${MEAL[p.meal].n}`, true)).join('');
    }
    html += `<button class="cta rebuild" data-act="rebuild">↻ Нов план</button>`;
    if (ideas.length) {
      html += `<div class="card ideas"><b>Още идеи от Готвач.бг</b><p class="small muted" style="margin:4px 0 10px">Рецепти с продукти, които сега са в промоция в ${STORES[P.store].n}:</p>
        <div class="chips">${ideas.map((id) => `<a class="chip" href="${gotvachLink(ING[id].n.replace(/\s*\(.*\)/, ''))}" target="_blank" rel="noopener">${ING[id].e} ${esc(ING[id].n.replace(/\s*\(.*\)/, ''))} ↗</a>`).join('')}</div></div>`;
    }
    return html;
  }

  function dayCard(r, i, label, swappable) {
    if (!r) return '';
    const c = recipeCost(r);
    const tags = autoTags(r);
    const mine = S.prefs.moods.filter((m) => tags.includes(m));
    const mood = mine.length ? mine[i % mine.length] : tags.find((t) => MOOD[t]);
    const m = MOOD[mood];
    return `<button class="day" data-open="${r.id}" data-idx="${swappable ? i : ''}">
      <span class="thumb" style="background:${TINTS[(r.id.length + i) % TINTS.length]}">${r.e}</span>
      <span class="info"><span class="tiny">${label}</span><h3>${esc(r.name)}</h3>
        ${m ? `<span class="tag" style="background:${m.bg}">${m.n}</span>` : ''}${c.promoCount ? `<span class="promo-badge">🏷 ${c.promoCount} в промо</span>` : ''}${c.brCount ? ` <span class="br-badge">📰 ${c.brCount}</span>` : ''}
        <span class="meta"><span>⏱ ${r.time} мин</span><span>👥 ${S.prefs.people}</span><span>≈ ${money(c.total)}</span></span></span>
    </button>`;
  }

  // ---------- рецепта ----------
  function openRecipe(rid, idx) {
    const r = byId(rid);
    const store = S.prefs.store;
    const c = recipeCost(r);
    const fav = S.favs.includes(r.id);
    const sh = document.createElement('div');
    sh.className = 'sheet';
    const main = r.ing.map(([id]) => ING[id]).find((g) => !g.pantry);
    const ingRows = r.ing
      .map(([id, q]) => {
        const ing = ING[id];
        const qty = q * scale();
        if (ing.pantry) return `<div class="ing"><span class="e">${ing.e}</span><span class="nm">${esc(ing.n)}</span><span class="q muted">вкъщи</span></div>`;
        const p = priceOf(id, store);
        const br = brochureHit(id, store);
        const badges = [
          p.promo ? `<span class="promo-badge">−${p.pct}%</span>` : '',
          br ? `<span class="br-badge" data-flyer="${esc(br.flyer.id)}" data-page="${br.page}" role="button">📰 стр. ${br.page}</span>` : '',
          S.have[id] ? '<span class="have-badge">🏠 имам</span>' : '',
        ].join(' ');
        return `<div class="ing"><span class="e">${ing.e}</span><span class="nm">${esc(ing.n)} ${badges}${p.product ? `<small>${esc(p.product)}</small>` : ''}</span>
          <span class="q">${qtyLabel(ing, qty)}<small>≈ ${money(itemCost(ing, qty, p.unit))}</small></span></div>`;
      })
      .join('');
    const meals = mealsOf(r).map((m) => MEAL[m].n.toLowerCase()).join(', ');
    sh.innerHTML = `
      <div class="hero" style="background:${TINTS[r.id.length % TINTS.length]}">
        <button class="icon-btn back" data-act="close" aria-label="назад">←</button>
        <button class="icon-btn fav" data-act="fav" aria-label="любима">${fav ? '❤️' : '🤍'}</button>
        <span>${r.e}</span>
      </div>
      <div class="sheet-body">
        <h1>${esc(r.name)}</h1>
        <p class="muted small" style="margin:0 0 14px">${[...autoTags(r).filter((t) => MOOD[t]).map((t) => MOOD[t].n), 'за ' + meals].join(' · ')}</p>
        <div class="card stats">
          <div><b>🔥 ${r.kcal}</b><span>ккал</span></div><div><b>⏱ ${r.time}м</b><span>време</span></div><div><b>👥 ${S.prefs.people}</b><span>порции</span></div>
          <div><b>${r.c}г</b><span>въгл.</span></div><div><b>${r.p}г</b><span>протеин</span></div><div><b>${r.f}г</b><span>мазнини</span></div>
        </div>
        <p class="note" style="text-align:center;margin-top:8px">Калориите и макросите са ориентировъчни, на порция.</p>
        <div class="section-title">Продукти</div>
        <p class="note" style="text-align:center;margin-top:-6px">≈ ${money(c.total)} за количествата в рецептата. Цената на цели опаковки е в списъка за пазаруване.</p>
        <div class="card ing-list">${ingRows}</div>
        <div class="section-title">Приготвяне</div>
        <div class="card steps"><ol>${r.steps.map((s) => `<li>${esc(s)}</li>`).join('')}</ol></div>
        ${main ? `<a class="cta ghost" style="text-decoration:none;text-align:center;margin-top:16px" href="${gotvachLink(main.n.replace(/\s*\(.*\)/, ''))}" target="_blank" rel="noopener">Още рецепти с ${esc(main.n.replace(/\s*\(.*\)/, '').toLowerCase())} в Готвач.бг ↗</a>` : ''}
      </div>
      ${idx !== undefined && idx !== '' ? '<div class="sticky-cta"><button class="cta ghost" data-act="swap">↻ Смени ястието</button></div>' : ''}`;
    document.body.appendChild(sh);
    document.body.style.overflow = 'hidden';
    sh.onclick = (e) => {
      const b = e.target.closest('[data-act],[data-flyer]');
      if (!b) return;
      if (b.dataset.flyer) return openViewer(store, b.dataset.flyer, +b.dataset.page);
      const act = b.dataset.act;
      if (act === 'close') closeSheet(sh);
      if (act === 'fav') {
        toggle(S.favs, r.id);
        save();
        b.textContent = S.favs.includes(r.id) ? '❤️' : '🤍';
      }
      if (act === 'swap') {
        const nr = swapMeal(+idx);
        closeSheet(sh);
        if (nr) { toast(`Сменено: ${nr.name}`); openRecipe(nr.id, idx); }
      }
    };
  }
  function closeSheet(sh) {
    sh.remove();
    if (!document.querySelector('.sheet')) document.body.style.overflow = '';
    renderMain();
  }

  // ---------- списък за пазаруване ----------
  function openGrocery() {
    const sh = document.createElement('div');
    sh.className = 'sheet';
    const draw = () => {
      const store = S.prefs.store;
      const items = groceryList();
      const real = items.filter((g) => !ING[g.id].pantry);
      const buy = real.filter((g) => !S.have[g.id]);
      const have = real.filter((g) => S.have[g.id]);
      const total = buy.reduce((s, g) => s + buyInfo(g.id, g.qty, store).cost, 0);
      const saved = have.reduce((s, g) => s + buyInfo(g.id, g.qty, store).cost, 0);
      const done = buy.filter((g) => S.bought[g.id]).length;
      const pantry = items.filter((g) => ING[g.id].pantry);
      const row = (g) => {
        const ing = ING[g.id];
        const bi = buyInfo(g.id, g.qty, store);
        const br = brochureHit(g.id, store);
        return `<div class="gitem ${S.bought[g.id] ? 'done' : ''}">
          <button class="box" data-buy="${g.id}" aria-label="купено">${S.bought[g.id] ? '✓' : ''}</button>
          <span class="nm">${ing.e} ${esc(ing.n)} ${bi.p.promo ? `<span class="promo-badge">−${bi.p.pct}%</span>` : ''} ${br ? `<span class="br-badge">📰 стр. ${br.page}</span>` : ''}
            <small>Трябват ${qtyLabel(ing, g.qty)} · купуваш ${esc(bi.label)}</small><small>${esc(uniqNames(g.recipes))}</small></span>
          <span class="gright"><b>${money(bi.cost)}</b><button class="have-btn" data-have="${g.id}">Имам го</button></span></div>`;
      };
      sh.innerHTML = `<div class="sheet-top"><button class="icon-btn" data-act="close" aria-label="назад">←</button><h2>Списък · ${STORES[store].n}</h2><span class="pill">${done}/${buy.length}</span></div>
        <div class="sheet-body" style="padding-top:10px">
          <div class="card gtotal"><div><div class="tiny">За плащане</div><b>${money(total)}</b></div>${saved ? `<div style="text-align:right"><div class="tiny">Имаш вкъщи</div><b class="muted">−${money(saved)}</b></div>` : ''}</div>
          <p class="note">Сумата е за цели опаковки (напр. 1 кг ориз, дори рецептата да иска 300 г). Месото и зеленчуците се броят на тегло. Натисни <b>„Имам го“</b> на продукт, който вече имаш, и той излиза от сумата.</p>
          ${Object.keys(SECTIONS)
            .filter((sec) => sec !== 'pantry')
            .map((sec) => {
              const list = buy.filter((g) => ING[g.id].sec === sec);
              return list.length ? `<div class="gsec">${SECTIONS[sec].e} ${SECTIONS[sec].n}</div>${list.map(row).join('')}` : '';
            })
            .join('')}
          ${have.length ? `<div class="gsec">🏠 Имам вкъщи <span class="small muted">(не се броят)</span></div>${have
            .map((g) => `<div class="gitem done"><span class="nm">${ING[g.id].e} ${esc(ING[g.id].n)}<small>трябват ${qtyLabel(ING[g.id], g.qty)}</small></span><span class="gright"><s class="muted small">${money(buyInfo(g.id, g.qty, store).cost)}</s><button class="have-btn on" data-have="${g.id}">Върни</button></span></div>`)
            .join('')}` : ''}
          ${pantry.length ? `<div class="gsec">🧂 Подправки — провери дали имаш</div><div class="card small" style="padding:12px 14px">${pantry.map((g) => esc(ING[g.id].n)).join(' · ')}</div>` : ''}
          <div style="display:flex;gap:10px;margin-top:18px"><button class="cta ghost" data-act="copy">📋 Копирай</button><button class="cta ghost" data-act="clear">Изчисти отметките</button></div>
        </div>`;
    };
    draw();
    document.body.appendChild(sh);
    document.body.style.overflow = 'hidden';
    sh.onclick = async (e) => {
      const b = e.target.closest('[data-act],[data-buy],[data-have]');
      if (!b) return;
      const y = sh.scrollTop;
      if (b.dataset.buy) { S.bought[b.dataset.buy] = !S.bought[b.dataset.buy]; save(); draw(); sh.scrollTop = y; return; }
      if (b.dataset.have) {
        const id = b.dataset.have;
        if (S.have[id]) delete S.have[id]; else { S.have[id] = true; delete S.bought[id]; }
        save(); draw(); sh.scrollTop = y; return;
      }
      if (b.dataset.act === 'close') closeSheet(sh);
      if (b.dataset.act === 'clear') { S.bought = {}; save(); draw(); }
      if (b.dataset.act === 'copy') {
        const store = S.prefs.store;
        const txt = groceryList()
          .filter((g) => !ING[g.id].pantry && !S.have[g.id])
          .map((g) => `${S.bought[g.id] ? '✓' : '☐'} ${ING[g.id].n} — ${buyInfo(g.id, g.qty, store).label}`)
          .join('\n');
        try { await navigator.clipboard.writeText(`Пазаруване (${STORES[store].n}), ~${money(shoppingTotal())}:\n${txt}`); toast('Копирано'); }
        catch { toast('Копирането не е позволено тук'); }
      }
    };
  }
  const uniqNames = (arr) => [...new Set(arr)].join(', ');

  // ---------- брошури ----------
  function viewBrochures() {
    const store = (ui.brStore ||= S.prefs.store || 'lidl');
    const seg = `<div class="seg">${Object.entries(STORES).map(([id, s]) => `<button data-act="brstore" data-v="${id}" class="${store === id ? 'on' : ''}"><span class="dot" style="background:${s.c}"></span>${s.n}</button>`).join('')}</div>`;
    let body = '';
    if (store === 'billa') {
      const b = DATA.brochures?.stores?.billa;
      body = `<div class="card" style="text-align:center;padding:26px 18px">
        <div style="font-size:46px">📰</div><h2>Седмична брошура Billa</h2>
        ${b?.from ? `<p class="muted">${fmtDate(b.from)} – ${fmtDate(b.to)}</p>` : ''}
        <p class="muted small">Billa публикува брошурата си в собствен онлайн четец, затова тя се отваря в него, а не страница по страница като при Lidl и Kaufland.</p>
        ${b?.embed ? `<button class="cta" data-act="billa-embed" style="margin-bottom:10px">Разгледай тук</button>` : ''}
        <a class="cta ${b?.embed ? 'ghost' : ''}" style="text-decoration:none" href="${esc(STORES.billa.url)}" target="_blank" rel="noopener">Отвори в billa.bg ↗</a>
        ${b?.note ? `<p class="note" style="margin-top:12px">${esc(b.note)}</p>` : ''}
      </div>`;
    } else {
      const flyers = currentFlyers(store);
      if (!flyers.length) {
        body = `<div class="empty"><span class="big">📭</span>${DATA.brochures ? 'Няма заредени брошури за тази верига.' : 'Брошурите още не са изтеглени.'}<br><span class="small">Те се обновяват автоматично всяка сутрин от GitHub Action (виж README).</span><br><br>
          <a class="cta ghost" style="text-decoration:none" href="${esc(STORES[store].url)}" target="_blank" rel="noopener">Отвори брошурите на ${STORES[store].n} ↗</a></div>`;
      } else {
        const q = ui.brQuery.trim().toLowerCase();
        let hits = '';
        if (q.length >= 2) {
          const res = [];
          for (const f of flyers) for (const p of f.pages) if ((p.text || '').toLowerCase().includes(q)) res.push({ f, p });
          hits = res.length
            ? `<p class="tiny" style="margin:0 2px 8px">${res.length} страници с „${esc(ui.brQuery)}“</p><div class="hits" style="margin-bottom:18px">${res
                .slice(0, 30)
                .map(({ f, p }) => `<button class="hit" data-flyer="${esc(f.id)}" data-page="${p.n}"><img loading="lazy" src="${esc(p.thumb)}" alt=""><span>${fmtDate(f.from)}–${fmtDate(f.to)} · стр. ${p.n}</span></button>`)
                .join('')}</div>`
            : `<p class="muted small" style="margin:0 2px 16px">Нищо за „${esc(ui.brQuery)}“. Търсенето е по ключовите думи на страниците, затова опитай с по-кратка дума („пиле“, „сирене“).</p>`;
        }
        const t = todayISO();
        body = `<div class="search"><span>🔎</span><input type="search" placeholder="Търси в брошурите, напр. пиле" value="${esc(ui.brQuery)}" data-input="brq" enterkeyhint="search"></div>
          ${hits}
          <div class="flyers">${flyers
            .map((f) => {
              const now = !f.from || f.from <= t;
              return `<button class="flyer" data-flyer="${esc(f.id)}" data-page="1"><span class="cv" style="background-image:url('${esc(f.cover || '')}')"><span class="now ${now ? '' : 'soon'}">${now ? 'Актуална' : 'От ' + fmtDate(f.from)}</span></span>
              <span class="fi"><b>${fmtDate(f.from)} – ${fmtDate(f.to)}</b><span class="small muted">${f.pages.length} стр.${f.name && f.name !== STORES[store].n ? ' · ' + esc(f.name) : ''}</span></span></button>`;
            })
            .join('')}</div>`;
      }
    }
    return `<h1 style="margin-top:6px">Брошури</h1><p class="muted" style="margin:0 0 14px">Актуалните брошури на трите вериги</p>${seg}${body}`;
  }

  function openViewer(store, flyerId, page = 1) {
    const f = (DATA.brochures?.stores?.[store] || []).find((x) => x.id === flyerId);
    if (!f) return;
    const v = document.createElement('div');
    v.className = 'viewer';
    v.innerHTML = `<div class="vt"><button class="icon-btn" data-act="close" aria-label="затвори" style="color:#fff">✕</button><b>${STORES[store].n} · ${fmtDate(f.from)}–${fmtDate(f.to)}</b>
        ${f.pdf ? `<a href="${esc(f.pdf)}" target="_blank" rel="noopener">PDF</a>` : ''}<a href="${esc(f.url)}" target="_blank" rel="noopener">Оригинал ↗</a></div>
      <div class="pages">${f.pages.map((p) => `<figure data-n="${p.n}"><img loading="lazy" src="${esc(p.img)}" data-zoom="${esc(p.zoom)}" alt="Страница ${p.n}"></figure>`).join('')}</div>
      <div class="vb"><button data-act="prev" aria-label="предишна">‹</button><span id="pg">${page} / ${f.pages.length}</span><button data-act="next" aria-label="следваща">›</button></div>`;
    document.body.appendChild(v);
    document.body.style.overflow = 'hidden';
    const pages = $('.pages', v);
    const go = (n) => pages.children[Math.max(0, Math.min(f.pages.length - 1, n - 1))]?.scrollIntoView({ behavior: 'instant', inline: 'center', block: 'nearest' });
    requestAnimationFrame(() => go(page));
    pages.addEventListener('scroll', () => {
      const n = Math.round(pages.scrollLeft / pages.clientWidth) + 1;
      $('#pg', v).textContent = `${n} / ${f.pages.length}`;
    }, { passive: true });
    const close = () => { v.remove(); if (!document.querySelector('.sheet')) document.body.style.overflow = ''; };
    v.onclick = (e) => {
      const img = e.target.closest('img[data-zoom]');
      if (img) return window.open(img.dataset.zoom, '_blank', 'noopener');
      const b = e.target.closest('[data-act]');
      if (!b) return;
      const cur = Math.round(pages.scrollLeft / pages.clientWidth) + 1;
      if (b.dataset.act === 'close') close();
      if (b.dataset.act === 'prev') go(cur - 1);
      if (b.dataset.act === 'next') go(cur + 1);
    };
    v.tabIndex = -1;
    v.focus();
    v.onkeydown = (e) => {
      const cur = Math.round(pages.scrollLeft / pages.clientWidth) + 1;
      if (e.key === 'ArrowRight') go(cur + 1);
      if (e.key === 'ArrowLeft') go(cur - 1);
      if (e.key === 'Escape') close();
    };
  }

  function openBillaEmbed() {
    const b = DATA.brochures?.stores?.billa;
    if (!b?.embed) return;
    const v = document.createElement('div');
    v.className = 'viewer';
    v.innerHTML = `<div class="vt"><button class="icon-btn" data-act="close" style="color:#fff" aria-label="затвори">✕</button><b>Billa · седмична брошура</b><a href="${esc(b.embed)}" target="_blank" rel="noopener">Отвори ↗</a></div>
      <iframe src="${esc(b.embed)}" title="Брошура Billa" allowfullscreen></iframe>`;
    document.body.appendChild(v);
    document.body.style.overflow = 'hidden';
    v.onclick = (e) => { if (e.target.closest('[data-act=close]')) { v.remove(); document.body.style.overflow = ''; } };
  }

  // ---------- промоции (kolkostruva) ----------
  function viewOffers() {
    const store = (ui.offerStore ||= S.prefs.store || 'lidl');
    const seg = `<div class="seg">${Object.entries(STORES).map(([id, s]) => `<button data-act="ofstore" data-v="${id}" class="${store === id ? 'on' : ''}"><span class="dot" style="background:${s.c}"></span>${s.n}</button>`).join('')}</div>`;
    const chain = DATA.prices?.chains?.[store];
    let body;
    if (!chain) {
      body = `<div class="empty"><span class="big">🏷️</span>${DATA.prices ? `Няма данни за ${STORES[store].n} в последния архив.` : 'Цените още не са изтеглени.'}<br><span class="small">Обновяват се всяка сутрин от отворените данни на КЗП (kolkostruva.bg).</span></div>`;
    } else {
      const q = ui.offerQuery.trim().toLowerCase();
      const list = chain.products
        .filter((p) => p.promo && (!q || p.name.toLowerCase().includes(q)))
        .map((p) => ({ ...p, pct: Math.round((1 - p.promo / p.price) * 100) }))
        .sort((a, b) => b.pct - a.pct);
      body = `<div class="search"><span>🔎</span><input type="search" placeholder="Търси продукт" value="${esc(ui.offerQuery)}" data-input="ofq"></div>
        <p class="note">${list.length} продукта с промо цена · данни на КЗП към ${fmtDate(DATA.prices.date)} · средна цена за ${chain.storeCount || 'всички'} обекта на ${STORES[store].n}</p>
        ${list.length ? list.slice(0, 200).map((p) => `<div class="offer"><span class="pct">−${p.pct}%</span><span class="nm">${esc(p.name)}<small>промо в ${Math.round(p.promoShare * 100)}% от обектите</small></span><span class="pr">${money(p.promo)}<s>${money(p.price)}</s></span></div>`).join('') : '<div class="empty">Няма намерени промоции.</div>'}`;
    }
    return `<h1 style="margin-top:6px">Промоции</h1><p class="muted" style="margin:0 0 14px">Основни храни с намалена цена</p>${seg}${body}`;
  }

  // ---------- рецепти / любими ----------
  function viewFavs() {
    const favs = S.favs.map(byId).filter(Boolean);
    const f = ui.recMeal;
    const all = RECIPES.filter((r) => isEligible(r) && (f === 'all' || mealsOf(r).includes(f)));
    return `<h1 style="margin-top:6px">Рецепти</h1>
      <h2 style="margin-top:16px">❤️ Любими</h2>
      ${favs.length ? `<div class="rlist">${favs.map((r, i) => dayCard(r, i, 'Любима')).join('')}</div>` : '<p class="muted">Натисни 🤍 в някоя рецепта, за да я запазиш тук. Любимите излизат по-често в плана.</p>'}
      <h2 style="margin-top:22px">Подходящи за теб (${all.length})</h2>
      <div class="chips" style="margin-bottom:12px">${[['all', 'Всички'], ...MEALS.map((m) => [m.id, `${m.e} ${m.n}`])].map(([id, n]) => `<button class="chip ${f === id ? 'on' : ''}" data-act="recmeal" data-v="${id}">${n}</button>`).join('')}</div>
      <div class="rlist">${all.map((r, i) => dayCard(r, i, `${mealsOf(r).map((m) => MEAL[m].n).join(' / ')} · ${r.time} мин · ${r.kcal} ккал`)).join('')}</div>
      <a class="cta ghost" style="text-decoration:none;text-align:center;margin-top:10px" href="https://recepti.gotvach.bg/" target="_blank" rel="noopener">Още рецепти в Готвач.бг ↗</a>`;
  }

  // ---------- настройки ----------
  function viewSettings() {
    const P = S.prefs;
    const b = DATA.brochures;
    const pr = DATA.prices;
    const flyerCount = (s) => currentFlyers(s).length;
    const haveN = Object.keys(S.have).length;
    return `<h1 style="margin-top:6px">Настройки</h1>
      <div class="card" style="margin-top:14px">
        <div class="set-row"><b>Име</b><input type="text" value="${esc(S.name)}" placeholder="напр. Добри" data-input="name" maxlength="20"></div>
        <div class="set-row"><b>Магазин</b><div class="chips">${Object.entries(STORES).map(([id, s]) => `<button class="chip ${P.store === id ? 'on' : ''}" data-act="store" data-v="${id}">${s.n}</button>`).join('')}</div></div>
        <div class="set-row"><b>Души</b><div class="stepper" style="margin:0;padding:0;box-shadow:none;background:none"><div class="ctl"><button data-act="ppl-">−</button><span>${P.people}</span><button data-act="ppl+">+</button></div></div></div>
        <div class="set-row"><b>Хранения</b><button class="chip" data-act="slots">${slotCount()} седмично · промени</button></div>
        <div class="set-row"><b>Бюджет</b><span><b id="bv">${P.budget} €</b></span></div>
        <input type="range" min="10" max="300" step="5" value="${P.budget}" data-input="budget" aria-label="бюджет">
        ${haveN ? `<div class="set-row"><span>🏠 Отбелязани „имам го“: ${haveN}</span><button class="chip" data-act="clear-have">Изчисти</button></div>` : ''}
      </div>
      <button class="cta" style="margin-top:14px" data-act="prefs">Промени предпочитанията</button>
      <h2 style="margin-top:24px">Данни</h2>
      <div class="card small">
        <div class="set-row"><span>Брошури</span><span class="muted">${b ? `обновени ${new Date(b.updated).toLocaleString('bg-BG', { dateStyle: 'short', timeStyle: 'short' })}` : 'няма'}</span></div>
        <div class="set-row"><span>Lidl / Kaufland</span><span class="muted">${flyerCount('lidl')} / ${flyerCount('kaufland')} брошури</span></div>
        <div class="set-row"><span>Цени (КЗП)</span><span class="muted">${pr ? `към ${fmtDate(pr.date)} · ${Object.keys(pr.chains || {}).map((s) => STORES[s]?.n).filter(Boolean).join(', ')}` : 'няма — ползват се ориентировъчни'}</span></div>
        <div class="set-row"><span>Рецепти</span><span class="muted">${RECIPES.length} (${MEALS.map((m) => `${m.n.toLowerCase()} ${RECIPES.filter((r) => mealsOf(r).includes(m.id)).length}`).join(', ')})</span></div>
        <p class="muted" style="margin:12px 0 4px">Източници: <a href="https://kolkostruva.bg/opendata" target="_blank" rel="noopener">kolkostruva.bg</a> (отворени данни на КЗП), брошурите на <a href="${STORES.lidl.url}" target="_blank" rel="noopener">Lidl</a>, <a href="${STORES.kaufland.url}" target="_blank" rel="noopener">Kaufland</a> и <a href="${STORES.billa.url}" target="_blank" rel="noopener">Billa</a>. Приложението не е свързано с веригите. Цените са ориентировъчни; меродавна е цената в магазина.</p>
      </div>
      <button class="cta ghost" style="margin-top:14px" data-act="reset">Изтрий всичко и започни отначало</button>`;
  }

  // ---------- събития в основния екран ----------
  function onMainClick(e) {
    const b = e.target.closest('button');
    if (!b) return;
    if (b.dataset.tab) { ui.tab = b.dataset.tab; return renderMain(); }
    if (b.dataset.open) return openRecipe(b.dataset.open, b.dataset.idx);
    if (b.dataset.flyer) return openViewer(ui.brStore, b.dataset.flyer, +b.dataset.page || 1);
    const act = b.dataset.act;
    const P = S.prefs;
    switch (act) {
      case 'rebuild': buildPlan(); toast('Нов план е готов'); break;
      case 'grocery': return openGrocery();
      case 'store': P.store = b.dataset.v; toast(`Планът е за ${STORES[P.store].n}`); break;
      case 'brstore': ui.brStore = b.dataset.v; ui.brQuery = ''; break;
      case 'ofstore': ui.offerStore = b.dataset.v; break;
      case 'recmeal': ui.recMeal = b.dataset.v; break;
      case 'billa-embed': return openBillaEmbed();
      case 'ppl-': P.people = Math.max(1, P.people - 1); break;
      case 'ppl+': P.people = Math.min(8, P.people + 1); break;
      case 'clear-have': S.have = {}; break;
      case 'slots': ui.step = obSteps().indexOf('days'); return renderOnboarding();
      case 'prefs': ui.step = 0; return renderOnboarding();
      case 'reset':
        if (!confirm('Да изтрия ли плана, любимите и настройките?')) return;
        S = structuredClone(DEFAULT); save(); ui.step = 0; return renderOnboarding();
      default: return;
    }
    save();
    renderMain();
  }
  let inputTimer;
  function onMainInput(e) {
    const el = e.target;
    const k = el.dataset.input;
    if (k === 'budget') { S.prefs.budget = +el.value; $('#bv').textContent = el.value + ' €'; save(); }
    if (k === 'name') { S.name = el.value.trim(); save(); }
    if (k === 'brq' || k === 'ofq') {
      clearTimeout(inputTimer);
      inputTimer = setTimeout(() => {
        if (k === 'brq') ui.brQuery = el.value; else ui.offerQuery = el.value;
        const pos = el.selectionStart;
        renderMain();
        const ni = $(`[data-input="${k}"]`);
        if (ni) { ni.focus(); try { ni.setSelectionRange(pos, pos); } catch {} }
      }, 250);
    }
  }

  // ---------------- старт ----------------
  loadData().then(() => { if (S.onboarded) renderMain(); });
  if (S.onboarded && S.prefs.store) renderMain();
  else renderOnboarding();
})();
