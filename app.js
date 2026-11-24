/* TelecomClub — карта офферов.
   Данные: data/offers.js (офферы и страны), data/market.js (доли рынка операторов и население стран),
   data/geo.js (карта мира и контуры стран).
   После правок запустить: python3 build/stamp.py — он обновит номер версии файлов в index.html. */
(() => {
  'use strict';

  const GEO = window.TC_GEO, OFFERS = window.TC_OFFERS, SHAPES = window.TC_SHAPES;
  const WORLD = window.TC_WORLD, MARKET = window.TC_MARKET || {};
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const TOUR = ['RU', 'KZ', 'TJ', 'AM', 'KW', 'KSA', 'BY'];     // порядок облёта на глобусе
  const COUNTRIES = Object.keys(GEO);                            // порядок стран в каталоге
  const CONTACT = 'info@telecom-club.com';
  const DWELL = 5200;
  const TAU = Math.PI * 2;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const store = {
    get(key) { try { return localStorage.getItem(key); } catch { return null; } },
    set(key, value) { try { localStorage.setItem(key, value); } catch { /* хранилище недоступно — не критично */ } },
  };

  /* ── Тексты: русская и английская версии ───────────────────── */
  const TEXT = {
    ru: {
      docTitle: 'TelecomClub — карта офферов', docDesc: 'Карта офферов TelecomClub: страны, операторы, flow и ставки.',
      skip: 'К списку офферов', navLabel: 'Разделы', navMap: 'Карта', navCatalog: 'Все офферы', navContacts: 'Контакты', contact: 'Связаться',
      theme: 'Переключить тему',
      heroTitleA: n => `Более <b>${n} млн</b> абонентов`, heroTitleB: n => `в <b>${n}+</b> странах`, heroCta: 'Смотреть все офферы',
      globeLabel: 'Глобус со странами присутствия TelecomClub',
      tabsLabel: 'Страны присутствия', statOffers: 'офферов', statOps: 'операторов', statLandings: 'лендингов',
      share: 'доля рынка', coverage: 'охват', coverageOf: 'покрытия', subs: n => `${n} млн абонентов`, upTo: 'до', cpaUpTo: 'CPA до', offersWord: 'офферов', open: 'Смотреть офферы',
      sharesBasis: 'По числу абонентов', estimate: 'оценка', sourceLink: 'источник', noShares: 'Доли рынка уточняются',
      catalogLabel: 'Каталог', catalogTitle: 'Все офферы', empty: 'По этим условиям офферов нет. Сбросьте один из фильтров.',
      all: 'Все', fGeo: 'Страна', fCat: 'Категория', fFlow: 'Flow',
      byOperator: 'по оператору', wifiTitle: 'Wi-Fi: CPA по оператору', ask: 'Запросить оффер', offer: 'Оффер',
      enlarge: 'Открыть лендинг', close: 'Закрыть', prev: 'Предыдущий', next: 'Следующий', lightbox: 'Лендинг',
      ctaEyebrow: '02 — Контакты', ctaTitle: 'Запросить оффер и условия',
      ctaLead: 'Напишите нам: подтвердим актуальные ставки и пришлём ссылки на лендинги.',
      fSections: 'Разделы', fSite: 'Сайт компании', fTerms: 'Условия', footerNote: 'Ставки и условия подтверждаются менеджером перед запуском.',
      fCopy: '© 2026 ООО «Телеком Клуб». Все права защищены.',
      sourcesLead: 'Доли рынка операторов — по числу абонентов', sourcesNote: 'Доли рассчитаны по опубликованным абонентским базам и округлены.',
      populationNote: 'Число абонентов в заголовке — суммарное население стран присутствия по данным национальной статистики.',
    },
    en: {
      docTitle: 'TelecomClub — offer map', docDesc: 'TelecomClub offer map: countries, operators, flows and payouts.',
      skip: 'Skip to offers', navLabel: 'Sections', navMap: 'Map', navCatalog: 'All offers', navContacts: 'Contacts', contact: 'Contact us',
      theme: 'Toggle theme',
      heroTitleA: n => `Over <b>${n}M</b> subscribers`, heroTitleB: n => `in <b>${n}+</b> countries`, heroCta: 'View all offers',
      globeLabel: 'Globe with the countries where TelecomClub operates',
      tabsLabel: 'Countries', statOffers: 'offers', statOps: 'operators', statLandings: 'landings',
      share: 'market share', coverage: 'reach', coverageOf: 'coverage', subs: n => `${n}M subscribers`, upTo: 'up to', cpaUpTo: 'CPA up to', offersWord: 'offers', open: 'View offers',
      sharesBasis: 'By subscribers', estimate: 'estimate', sourceLink: 'source', noShares: 'Market shares to be confirmed',
      catalogLabel: 'Catalog', catalogTitle: 'All offers', empty: 'No offers match these filters. Clear one of them.',
      all: 'All', fGeo: 'Country', fCat: 'Category', fFlow: 'Flow',
      byOperator: 'by operator', wifiTitle: 'Wi-Fi: CPA by operator', ask: 'Request this offer', offer: 'Offer',
      enlarge: 'Open landing', close: 'Close', prev: 'Previous', next: 'Next', lightbox: 'Landing',
      ctaEyebrow: '02 — Contacts', ctaTitle: 'Request an offer and terms',
      ctaLead: 'Write to us: we will confirm current payouts and send the landing links.',
      fSections: 'Sections', fSite: 'Company website', fTerms: 'Terms', footerNote: 'Payouts and terms are confirmed by your manager before launch.',
      fCopy: '© 2026 TelecomClub LLC. All rights reserved.',
      sourcesLead: 'Operator market shares are by subscribers', sourcesNote: 'Shares are calculated from published subscriber bases and rounded.',
      populationNote: 'The subscriber figure in the headline is the combined population of these countries, from national statistics.',
    },
  };
  const CATEGORY_EN = { 'Игры': 'Games', 'Музыка': 'Music', 'Видео': 'Video', 'Универсальные': 'Universal', 'Файлы': 'Files', 'Адалт': 'Adult' };
  const CATEGORY_ORDER = ['Игры', 'Музыка', 'Видео', 'Универсальные', 'Файлы', 'Адалт'];

  // Язык: сначала из адреса (?lang=en), затем сохранённый выбор, затем язык браузера — как на сайте ТК.
  function initialLang() {
    const fromUrl = new URLSearchParams(location.search).get('lang');
    if (fromUrl === 'ru' || fromUrl === 'en') return fromUrl;
    const saved = store.get('tc-lang');
    if (saved === 'ru' || saved === 'en') return saved;
    const first = (navigator.languages && navigator.languages[0]) || navigator.language || '';
    return /^ru(-|$)/i.test(first) ? 'ru' : 'en';
  }
  let lang = initialLang();
  const t = key => TEXT[lang][key] ?? key;
  const geoName = code => GEO[code][lang];
  const catName = c => (lang === 'en' ? CATEGORY_EN[c] || c : c);
  const num = v => String(v).replace('.', lang === 'ru' ? ',' : '.');
  const plural = (n, kind) => {
    const forms = {
      offer: [['оффер', 'оффера', 'офферов'], ['offer', 'offers']],
      landing: [['лендинг', 'лендинга', 'лендингов'], ['landing', 'landings']],
    }[kind];
    if (lang === 'en') return `${n} ${forms[1][n === 1 ? 0 : 1]}`;
    const i = n % 100 >= 11 && n % 100 <= 14 ? 2 : n % 10 === 1 ? 0 : n % 10 >= 2 && n % 10 <= 4 ? 1 : 2;
    return `${n} ${forms[0][i]}`;
  };
  const offersOf = code => OFFERS.filter(o => o.geo === code);
  // Знак доллара ставится перед числом («$2», «$0.92»); рубль и прочие валюты — после («95 ₽», «0.10 BYN»).
  const money = v => { const s = String(v ?? '').trim(), m = /^(.*\d)\s*\$$/.exec(s); return m ? `$${m[1]}` : s; };
  const bestCpa = list => {
    const top = list.filter(o => o.cpaMax != null).sort((a, b) => b.cpaMax - a.cpaMax)[0];
    return top ? money(`${top.cpaMax % 1 ? top.cpaMax : Math.round(top.cpaMax)} ${top.cpaUnit}`) : '—';
  };

  /* ── Флаги стран и справочник операторов ───────────────────── */
  const FLAG = { RU: 'ru', KZ: 'kz', BY: 'by', KSA: 'sa', KW: 'kw', AM: 'am', TJ: 'tj' };
  const flag = (code, cls = '') => `<img class="flag ${cls}" src="img/flags/${FLAG[code]}.svg" alt="" width="28" height="21">`;
  // Одно написание и один логотип оператора на всём сайте. В данных офферов и в долях рынка операторы
  // названы по-разному («Megafon», «МегаФон», «STC», «stc») — всё приводится к ключу отсюда.
  const OPS = {
    wifi: { ru: 'Wi-Fi' },
    megafon: { ru: 'МегаФон', en: 'MegaFon', logo: 'megafon.png' },
    yota: { ru: 'Yota', logo: 'yota.png' },
    beeline: { ru: 'Билайн', en: 'Beeline', logo: 'beeline.png' },
    mts: { ru: 'МТС', en: 'MTS', logo: 'mts.png' },
    t2: { ru: 'Т2', en: 'T2', logo: 't2.png' },
    tele2: { ru: 'Tele2', logo: 'tele2.png' },
    altel: { ru: 'Altel', logo: 'altel.png' },
    kcell: { ru: 'Kcell', logo: 'kcell.png' },
    a1: { ru: 'A1', logo: 'a1.png' },
    life: { ru: 'life:)', logo: 'life.png' },
    stc: { ru: 'stc', logo: 'stc.png' },
    mobily: { ru: 'Mobily', logo: 'mobily.png' },
    virgin: { ru: 'Virgin Mobile', logo: 'virgin.png' },
    ucom: { ru: 'Ucom', logo: 'ucom.png' },
    zet: { ru: 'ZET-Mobile', logo: 'zet.svg' },
  };
  const OP_MATCH = [
    [/wi-?fi/i, 'wifi'], [/мегафон|megafon/i, 'megafon'], [/yota/i, 'yota'], [/билайн|bee\s?line/i, 'beeline'], [/мтс|mts/i, 'mts'],
    [/т2|\bt2\b/i, 't2'], [/tele2/i, 'tele2'], [/altel/i, 'altel'], [/kcell/i, 'kcell'], [/\ba1\b/i, 'a1'],
    [/life/i, 'life'], [/stc/i, 'stc'], [/mobily/i, 'mobily'], [/virgin/i, 'virgin'], [/ucom/i, 'ucom'], [/zet/i, 'zet'],
  ];
  const WIFI_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.6a10 10 0 0 1 14 0M8.5 16.1a5 5 0 0 1 7 0M2 8.8a15 15 0 0 1 20 0"/><circle cx="12" cy="19.5" r="0.6" fill="currentColor"/></svg>';
  function opKey(geo, raw) {
    const hit = OP_MATCH.find(([re]) => re.test(raw));
    if (!hit) return null;
    return hit[1] === 'tele2' && geo === 'RU' ? 't2' : hit[1];       // в России Tele2 теперь Т2
  }
  function opName(geo, key, raw = '') {
    const op = OPS[key];
    if (!op) return raw;
    if (key === 'beeline' && geo === 'KZ') return 'Beeline';         // в Казахстане бренд пишется латиницей
    return (lang === 'en' && op.en) || op.ru;
  }
  // Плашка логотипа всегда одного размера, знак вписывается внутрь — так строки не «гуляют».
  function opLogo(key, title = '') {
    const attr = title ? ` title="${esc(title)}"` : '';
    if (key === 'wifi') return `<span class="op-logo op-logo--icon"${attr}>${WIFI_ICON}</span>`;
    const op = OPS[key];
    return op?.logo ? `<span class="op-logo"${attr}><img src="img/ops/${op.logo}" alt=""></span>` : `<span class="op-logo"${attr}></span>`;
  }
  const opChip = (geo, raw) => { const key = opKey(geo, raw); return `<span class="tag tag--op">${opLogo(key)}<span>${esc(opName(geo, key, raw))}</span></span>`; };
  // Название строки в карточке долей рынка: «МегаФон и Yota», «Kcell и Activ».
  function marketName(geo, o) {
    if (!o.op) return (lang === 'en' && o.en) || o.name;
    const and = lang === 'ru' ? ' и ' : ' and ';
    return opName(geo, o.op) + (o.plus ? and + opName(geo, o.plus) : '') + (o.plusName ? and + o.plusName : '');
  }
  // Ключи операторов страны (без Wi-Fi-потока, с операторами из таблицы CPA по Wi-Fi).
  function countryOps(code) {
    const keys = new Set();
    for (const o of offersOf(code)) {
      for (const term of o.terms) for (const op of term.ops) keys.add(opKey(code, op));
      for (const op of Object.keys(o.wifi || {})) keys.add(opKey(code, op));
    }
    keys.delete('wifi'); keys.delete(null);
    return [...keys];
  }
  const flagImages = {};
  for (const code of Object.keys(FLAG)) { const im = new Image(); im.src = `img/flags/${FLAG[code]}.svg`; flagImages[code] = im; }

  /* ── Глобус ──────────────────────────────────────────────── */
  const canvas = $('#globeCanvas'), ctx = canvas.getContext('2d');
  const projection = d3.geoOrthographic().clipAngle(90).precision(0.5);
  const geoPath = d3.geoPath(projection, ctx);
  const land = topojson.feature(WORLD, WORLD.objects.land);
  const borders = topojson.mesh(WORLD, WORLD.objects.countries, (a, b) => a !== b);
  const graticule = d3.geoGraticule10();
  const places = TOUR.map(code => ({ code, feature: SHAPES[code], center: GEO[code].center, zoom: GEO[code].zoom }));

  const OVERVIEW = { lon: 56, lat: 44, zoom: 1.25 };
  let size = 0, dpr = 1, radius = 0;
  let view = reducedMotion.matches ? { ...OVERVIEW } : { lon: -25, lat: 18, zoom: 0.92 };
  let anim = null;
  let active = 'RU', hover = null;
  let dwell = 0, lastTick = 0, holdUntil = 0;
  let pointerInside = false, dragging = null;
  let heroVisible = true;
  let offsets = null;              // положение глобуса и карточки внутри сцены — для соединительной линии

  const ease = x => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

  function resizeGlobe() {
    const box = canvas.parentElement.getBoundingClientRect();
    if (!box.width) return;
    size = Math.round(box.width);
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(size * dpr);
    canvas.height = Math.round(size * dpr);
    radius = size / 2 - 28;
    measureOffsets();
    draw(performance.now());
  }

  function measureOffsets() {
    const stage = $('#heroStage').getBoundingClientRect();
    const g = canvas.getBoundingClientRect(), c = $('#geoCard').getBoundingClientRect();
    const shown = getComputedStyle($('#connector')).display !== 'none';
    offsets = shown ? { gx: g.left - stage.left, gy: g.top - stage.top, cardLeft: c.left - stage.left, cardTop: c.top - stage.top } : null;
  }

  function goTo(code, dur = 1700) {
    const place = places.find(p => p.code === code);
    active = code;
    dwell = 0;
    syncTabs(false);
    if (reducedMotion.matches) {
      view = { lon: place.center[0], lat: place.center[1], zoom: place.zoom };
      renderCard(code); syncTabs(true); draw(performance.now());
      return;
    }
    anim = { from: { ...view }, to: { zoom: place.zoom }, t0: performance.now(), dur, half: false,
      dist: d3.geoDistance([view.lon, view.lat], place.center), ip: d3.geoInterpolate([view.lon, view.lat], place.center) };
  }

  function tick(now) {
    requestAnimationFrame(tick);
    const dt = Math.min(now - (lastTick || now), 100);
    lastTick = now;
    if (document.hidden || !heroVisible) return;

    if (anim) {
      const raw = Math.min((now - anim.t0) / anim.dur, 1), e = ease(raw);
      const [lon, lat] = anim.ip(e);
      const dip = Math.min(anim.from.zoom, anim.to.zoom) * 0.24 * Math.min(anim.dist / 0.5, 1);
      view = { lon, lat, zoom: Math.max(0.9, anim.from.zoom + (anim.to.zoom - anim.from.zoom) * e - dip * Math.sin(Math.PI * e)) };
      if (!anim.half && raw > 0.45) { anim.half = true; renderCard(active); }
      if (raw >= 1) { anim = null; dwell = 0; syncTabs(true); }
    } else if (!reducedMotion.matches) {
      const paused = pointerInside || dragging || now < holdUntil;
      $('#geoTabs').classList.toggle('is-paused', !!paused);
      if (!paused) {
        dwell += dt;
        view.lon += dt * 0.0006;          // лёгкий дрейф, чтобы глобус не замирал
        if (dwell >= DWELL) goTo(TOUR[(TOUR.indexOf(active) + 1) % TOUR.length]);
      }
    }
    draw(now);
  }

  function visiblePoint(place) {
    if (d3.geoDistance(place.center, [view.lon, view.lat]) > 1.45) return null;
    const p = projection(place.center);
    if (!p || Math.hypot(p[0] - size / 2, p[1] - size / 2) > radius - 6) return null;
    return p;
  }

  function draw(now) {
    if (!size) return;
    const c = size / 2, R = radius;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, size, size);

    // Шар стоит на красной волне, поэтому сам он тёмно-винный, а тень под ним даёт объём.
    ctx.save();
    ctx.beginPath(); ctx.arc(c, c, R, 0, TAU);
    ctx.shadowColor = 'rgba(20, 0, 0, .6)'; ctx.shadowBlur = 38; ctx.shadowOffsetY = 14 * dpr;
    ctx.fillStyle = '#2a0606'; ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.beginPath(); ctx.arc(c, c, R, 0, TAU); ctx.clip();
    let g = ctx.createRadialGradient(c - R * 0.35, c - R * 0.42, R * 0.08, c, c, R * 1.05);
    g.addColorStop(0, '#5e1111'); g.addColorStop(0.55, '#350909'); g.addColorStop(1, '#1d0404');
    ctx.fillStyle = g; ctx.fillRect(0, 0, size, size);

    projection.translate([c, c]).scale(R * view.zoom).rotate([-view.lon, -view.lat, 0]);
    ctx.beginPath(); geoPath(graticule);
    ctx.strokeStyle = 'rgba(255, 255, 255, .08)'; ctx.lineWidth = 1; ctx.stroke();
    ctx.beginPath(); geoPath(land);
    ctx.fillStyle = 'rgba(255, 255, 255, .17)'; ctx.fill();
    ctx.beginPath(); geoPath(borders);
    ctx.strokeStyle = 'rgba(42, 6, 6, .75)'; ctx.lineWidth = 0.8; ctx.stroke();

    // Страны присутствия — белым и серым, как акценты сайта на красном фоне.
    for (const place of places) {
      const on = place.code === active, hov = place.code === hover;
      ctx.beginPath(); geoPath(place.feature);
      if (on) { ctx.shadowColor = 'rgba(255, 255, 255, .7)'; ctx.shadowBlur = 20; }
      ctx.fillStyle = on ? '#ffffff' : hov ? '#eeeeee' : '#cccccc';
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = 'rgba(42, 6, 6, .7)';
      ctx.lineWidth = 0.9; ctx.stroke();
    }

    g = ctx.createRadialGradient(c, c, R * 0.55, c, c, R);
    g.addColorStop(0, 'rgba(20, 0, 0, 0)'); g.addColorStop(1, 'rgba(20, 0, 0, .5)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, size, size);
    ctx.restore();

    ctx.beginPath(); ctx.arc(c, c, R, 0, TAU);
    ctx.strokeStyle = 'rgba(255, 255, 255, .3)'; ctx.lineWidth = 1; ctx.stroke();

    // Метки стран: красная точка и плашка с флагом; у активной и наведённой — ещё и название.
    let activePoint = null;
    ctx.textBaseline = 'middle';
    for (const place of places) {
      const p = visiblePoint(place);
      if (!p) continue;
      const on = place.code === active, hov = place.code === hover;
      if (on) {
        activePoint = p;
        for (const shift of [0, 0.5]) {
          const phase = ((now / 1800) + shift) % 1;
          ctx.beginPath(); ctx.arc(p[0], p[1], 6 + 22 * phase, 0, TAU);
          ctx.strokeStyle = `rgba(221, 29, 29, ${0.8 * (1 - phase)})`; ctx.lineWidth = 2; ctx.stroke();
        }
      }
      ctx.beginPath(); ctx.arc(p[0], p[1], on ? 4.5 : 3.2, 0, TAU);
      ctx.fillStyle = '#dd1d1d'; ctx.fill();
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5; ctx.stroke();

      const big = on || hov;
      const im = flagImages[place.code], hasFlag = im.complete && im.naturalWidth > 0;
      const text = big ? geoName(place.code).toUpperCase() : (hasFlag ? '' : place.code);
      ctx.font = `${big ? 800 : 700} ${big ? 14 : 12}px Montserrat, Arial, sans-serif`;
      const fw = hasFlag ? (big ? 24 : 20) : 0, fh = fw * 0.75, gap = hasFlag && text ? 7 : 0;
      const padX = big ? 7 : 4, h = big ? 28 : 21;
      const w = fw + gap + (text ? ctx.measureText(text).width : 0) + padX * 2;
      const left = p[0] + 12 + w > size - 4;      // у правого края подпись уходит влево
      const bx = left ? p[0] - 12 - w : p[0] + 12;
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(bx, p[1] - h / 2, w, h, 4); else ctx.rect(bx, p[1] - h / 2, w, h);
      ctx.fillStyle = on ? '#dd1d1d' : 'rgba(42, 6, 6, .92)'; ctx.fill();
      if (hasFlag) { try { ctx.drawImage(im, bx + padX, p[1] - fh / 2, fw, fh); } catch { /* флаг не отрисовался — остаётся текст */ } }
      if (text) { ctx.fillStyle = '#fff'; ctx.fillText(text, bx + padX + fw + gap, p[1] + 0.5); }
    }
    drawConnector(activePoint);
  }

  function drawConnector(p) {
    const svg = $('#connector');
    if (!offsets || !p || anim) { svg.style.opacity = 0; return; }
    const x = offsets.gx + p[0], y = offsets.gy + p[1];
    const cy = offsets.cardTop + 46, cx = offsets.cardLeft;
    if (x > cx - 30) { svg.style.opacity = 0; return; }           // точка ушла под карточку
    svg.style.opacity = 1;
    $('#connectorPath').setAttribute('d', `M${x.toFixed(1)} ${y.toFixed(1)} L${(cx - 26).toFixed(1)} ${cy.toFixed(1)} L${cx.toFixed(1)} ${cy.toFixed(1)}`);
    $('#connectorDot').setAttribute('cx', cx); $('#connectorDot').setAttribute('cy', cy);
  }

  function hitTest(x, y) {
    if (Math.hypot(x - size / 2, y - size / 2) > radius) return null;
    let best = null, bestD = 18;
    for (const place of places) {
      const p = visiblePoint(place);
      if (!p) continue;
      const d = Math.hypot(p[0] - x, p[1] - y);
      if (d < bestD) { best = place.code; bestD = d; }
    }
    if (best) return best;
    const ll = projection.invert([x, y]);
    if (!ll) return null;
    return places.find(place => d3.geoContains(place.feature, ll))?.code || null;
  }
  const local = e => { const r = canvas.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };

  canvas.addEventListener('pointerdown', e => {
    dragging = { x: e.clientX, y: e.clientY, moved: 0 };
    canvas.setPointerCapture(e.pointerId);
    canvas.classList.add('is-dragging');
  });
  canvas.addEventListener('pointermove', e => {
    if (dragging) {
      const dx = e.clientX - dragging.x, dy = e.clientY - dragging.y;
      dragging.moved += Math.abs(dx) + Math.abs(dy);
      dragging.x = e.clientX; dragging.y = e.clientY;
      if (dragging.moved > 4) {
        anim = null;
        const k = 57.3 / (radius * view.zoom);
        view.lon -= dx * k;
        view.lat = Math.max(-75, Math.min(80, view.lat + dy * k));
        holdUntil = performance.now() + 6000;
      }
      return;
    }
    const [x, y] = local(e);
    hover = hitTest(x, y);
    canvas.classList.toggle('is-hit', !!hover);
  });
  canvas.addEventListener('pointerup', e => {
    const wasClick = dragging && dragging.moved <= 4;
    dragging = null;
    canvas.classList.remove('is-dragging');
    if (!wasClick) return;
    const [x, y] = local(e);
    const code = hitTest(x, y);
    if (code) showCountry(code);
  });
  canvas.addEventListener('pointercancel', () => { dragging = null; canvas.classList.remove('is-dragging'); });
  canvas.addEventListener('pointerleave', () => { hover = null; canvas.classList.remove('is-hit'); });
  for (const el of [$('#globe'), $('#geoCard')]) {
    el.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') pointerInside = true; });
    el.addEventListener('pointerleave', () => { pointerInside = false; });
  }
  canvas.tabIndex = 0;
  canvas.addEventListener('keydown', e => {
    const i = TOUR.indexOf(active);
    if (e.key === 'ArrowRight') { goTo(TOUR[(i + 1) % TOUR.length], 1100); holdUntil = performance.now() + 8000; }
    else if (e.key === 'ArrowLeft') { goTo(TOUR[(i + TOUR.length - 1) % TOUR.length], 1100); holdUntil = performance.now() + 8000; }
    else if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); showCountry(active); }
  });

  /* ── Покрытие и абоненты страны ───────────────────────────── */
  // Покрытие — сумма долей рынка операторов, на которых есть офферы; абоненты — население страны.
  function coverageOf(code) {
    const mine = MARKET[code]?.operators?.filter(o => o.tc) || [];
    return mine.length ? Math.min(100, Math.round(mine.reduce((sum, o) => sum + o.share, 0))) : null;
  }
  function countryLine(code) {
    // В шапке страны — только число абонентов (население страны); процент покрытия остался в карточке у глобуса.
    const pop = MARKET[code]?.population;
    return pop ? t('subs')(num(pop >= 10 ? Math.round(pop) : Math.round(pop * 10) / 10)) : '';
  }

  /* ── Карточка страны у глобуса ────────────────────────────── */
  function renderCard(code) {
    const card = $('#geoCard'), geo = GEO[code], list = offersOf(code), m = MARKET[code];
    const mine = m?.operators?.filter(o => o.tc) || [];
    // В карточке только операторы, на которых есть офферы: логотип, название и доля рынка.
    const shares = mine.length
      ? `<div class="geo-card__sub"><span class="label label--sm">${t('share')}</span></div>
         <div class="shares">${mine.map(o => `
          <div class="share">
            <div class="share__name">${opLogo(o.op)}<span>${esc(marketName(code, o))}</span>${o.via ? `<small>${esc(o.via)}</small>` : ''}</div>
            <div class="share__val">${num(o.share)}%</div>
          </div>`).join('')}</div>`
      : `<div class="geo-card__ops">${geo.operators.map(o => opChip(code, o)).join('')}</div>`;
    const coverage = coverageOf(code);
    card.innerHTML = `
      <div class="geo-card__head">${flag(code, 'flag--lg')}<h3>${esc(geoName(code))}</h3></div>
      ${shares}
      <div class="geo-card__facts">
        <div><b class="accent"><i>${t('upTo')}</i> ${esc(bestCpa(list))}</b><span>CPA</span></div>
        <div><b>${list.length}</b><span>${t('offersWord')}</span></div>
        <div><b>${coverage != null ? coverage + '%' : '—'}</b><span>${t('coverage')}</span></div>
      </div>
      <button class="btn btn--primary btn--lg" type="button" data-open="${code}">${t('open')}</button>
      ${m ? '' : `<p class="geo-card__src">${t('noShares')}</p>`}`;
    card.classList.remove('is-swapping');
    void card.offsetWidth;
    card.classList.add('is-swapping');
    measureOffsets();
  }
  $('#geoCard').addEventListener('click', e => { const b = e.target.closest('[data-open]'); if (b) showCountry(b.dataset.open); });

  function renderTabs() {
    $('#geoTabs').innerHTML = TOUR.map(code => `
      <button class="geo-tab" type="button" role="tab" data-geo="${code}" aria-selected="${code === active}" style="--dwell:${DWELL}ms">
        ${flag(code)}<span>${esc(geoName(code))}</span>
      </button>`).join('');
  }
  function syncTabs(timing) {
    for (const tab of $$('.geo-tab')) {
      const on = tab.dataset.geo === active;
      tab.setAttribute('aria-selected', on);
      tab.classList.remove('is-timing');
      if (on && timing && !reducedMotion.matches) { void tab.offsetWidth; tab.classList.add('is-timing'); }
    }
  }
  $('#geoTabs').addEventListener('click', e => {
    const tab = e.target.closest('.geo-tab');
    if (!tab) return;
    if (tab.dataset.geo === active && !anim) { showCountry(active); return; }   // повторный клик ведёт к офферам страны
    goTo(tab.dataset.geo, 1200);
    renderCard(tab.dataset.geo);
    if (anim) anim.half = true;
    holdUntil = performance.now() + 9000;
  });

  function renderHero() {
    // «Абоненты» в заголовке — суммарное население стран присутствия, округлённое вниз до 5 млн.
    const population = COUNTRIES.reduce((s, c) => s + (MARKET[c]?.population || 0), 0);
    const millions = Math.floor(population / 5) * 5;
    $('#heroTitleA').innerHTML = t('heroTitleA')(millions);
    $('#heroTitleB').innerHTML = t('heroTitleB')(COUNTRIES.length);
    const ops = COUNTRIES.reduce((n, c) => n + countryOps(c).length, 0);
    const landings = OFFERS.reduce((s, o) => s + o.landingCount, 0);
    $('#stats').innerHTML = [[OFFERS.length, 'statOffers'], [ops, 'statOps'], [landings, 'statLandings']]
      .map(([n, key]) => `<div class="stat"><div class="stat__value">${n}</div><div class="stat__label">${t(key)}</div></div>`).join('');
  }

  /* ── Каталог: офферы сгруппированы по странам ──────────────── */
  function offerHTML(o) {
    const terms = o.terms.map(term => `
      <div class="term${term.ops.length > 2 ? ' term--many' : ''}">
        <div class="term__ops">${term.ops.map(op => opChip(o.geo, op)).join('')}</div>
        <div class="kv kv--flow"><span>Flow</span><b>${esc(term.flow || '—')}</b></div>
        <div class="kv"><span>EUP</span><b>${esc(money(term.eup) || '—')}</b></div>
        <div class="kv"><span>Rebill</span><b>${esc(money(term.rebill) || '—')}</b></div>
        <div class="kv kv--cpa${term.wifi ? ' kv--note' : ''}"><span>CPA</span><b>${term.wifi ? t('byOperator') : esc(money(term.cpa) || '—')}</b></div>
      </div>`).join('');
    const wifi = o.wifi ? `<div class="wifi"><p class="label">${t('wifiTitle')}</p>${Object.entries(o.wifi).map(([op, v]) => {
      const key = opKey(o.geo, op);
      return `<div class="kv kv--cpa kv--op"><span>${opLogo(key)}<i>${esc(opName(o.geo, key, op))}</i></span><b>${esc(money(v))}</b></div>`;
    }).join('')}</div>` : '';
    const subject = encodeURIComponent(`${t('offer')}: ${o.name} (${o.geo})`);
    const thumbs = o.landings.map((l, i) => `
      <button class="thumb" type="button" data-offer="${o.id}" data-index="${i}" aria-label="${t('enlarge')}: ${esc(l.name)}">
        <img src="${esc(l.img)}" alt="" loading="lazy" width="68" height="121">
      </button>`).join('');
    return `
      <article class="offer card">
        <div class="offer__id">
          <h4 class="offer__name">${esc(o.name)}</h4>
          <div class="offer__tags"><span class="badge badge--outline badge--sm">${esc(catName(o.category))}</span></div>
          <a class="offer__ask" href="mailto:${CONTACT}?subject=${subject}">${t('ask')} →</a>
        </div>
        <div class="terms">${terms}${wifi}</div>
        <div class="thumbs">${thumbs}</div>
      </article>`;
  }

  const filter = { geo: '', cat: '', flow: '' };
  const matches = (o, skip) => (skip === 'geo' || !filter.geo || o.geo === filter.geo)
    && (skip === 'cat' || !filter.cat || o.category === filter.cat)
    && (skip === 'flow' || !filter.flow || o.flows.includes(filter.flow));

  function renderCatalog() {
    const cats = CATEGORY_ORDER.filter(c => OFFERS.some(o => o.category === c));
    const flows = [...new Set(OFFERS.flatMap(o => o.flows))];
    const group = (key, label, options) => `
      <div class="filter"><span class="label">${label}</span><div class="filter__opts">
        ${[['', t('all')], ...options].map(([value, text]) => {
          const n = OFFERS.filter(o => matches(o, key) && (!value || (key === 'geo' ? o.geo === value : key === 'cat' ? o.category === value : o.flows.includes(value)))).length;
          return `<button type="button" data-filter="${key}" data-value="${esc(value)}" aria-pressed="${filter[key] === value}">${key === 'geo' && value ? flag(value, 'flag--sm') : ''}<span>${esc(text)}</span><small>${n}</small></button>`;
        }).join('')}
      </div></div>`;
    $('#filters').innerHTML = group('geo', t('fGeo'), COUNTRIES.map(c => [c, geoName(c)]))
      + group('cat', t('fCat'), cats.map(c => [c, catName(c)]))
      + group('flow', t('fFlow'), flows.map(f => [f, f]));

    const list = OFFERS.filter(o => matches(o));
    $('#offerList').innerHTML = COUNTRIES.map(code => {
      const rows = list.filter(o => o.geo === code);
      if (!rows.length) return '';
      return `
        <section class="geo-group" id="geo-${code}" data-geo="${code}" aria-labelledby="geo-${code}-title">
          <header class="geo-group__head">
            ${flag(code, 'flag--lg')}
            <div class="geo-group__title">
              <h3 id="geo-${code}-title">${esc(geoName(code))}</h3>
              <p>${esc(countryLine(code))}</p>
            </div>
            <div class="geo-group__ops">${countryOps(code).map(key => opLogo(key, opName(code, key))).join('')}</div>
          </header>
          ${rows.map(offerHTML).join('')}
        </section>`;
    }).join('');
    $('#empty').hidden = list.length > 0;
    $('#catalogCount').textContent = plural(list.length, 'offer');
  }
  $('#filters').addEventListener('click', e => {
    const b = e.target.closest('[data-filter]');
    if (!b) return;
    filter[b.dataset.filter] = b.dataset.value;
    renderCatalog();
  });

  // Клик по стране (на глобусе, в карточке, повторно по вкладке): прокрутка к её блоку в каталоге и короткая подсветка.
  function showCountry(code, smooth = true) {
    if (filter.geo && filter.geo !== code) filter.geo = '';
    if (!OFFERS.some(o => o.geo === code && matches(o))) { filter.cat = ''; filter.flow = ''; }
    renderCatalog();
    const group = $(`#geo-${code}`);
    if (!group) return;
    if (active !== code || !smooth) {
      const place = places.find(p => p.code === code);
      active = code; anim = null; dwell = 0;
      view = { lon: place.center[0], lat: place.center[1], zoom: place.zoom };
      renderCard(code); syncTabs(false);
    }
    holdUntil = performance.now() + 4000;
    group.scrollIntoView({ behavior: smooth && !reducedMotion.matches ? 'smooth' : 'auto', block: 'start' });
    group.classList.remove('is-flash');
    void group.offsetWidth;
    group.classList.add('is-flash');
    history.replaceState(null, '', `${location.pathname}${location.search}#geo-${code}`);
  }

  /* ── Просмотр лендингов ──────────────────────────────────── */
  let gallery = null;
  function showLanding() {
    const item = gallery.list[gallery.index];
    $('#lightboxImg').src = item.img;
    $('#lightboxImg').alt = item.name;
    $('#lightboxCap').textContent = `${item.name} · ${gallery.index + 1} / ${gallery.list.length}`;
    for (const nav of $$('.lightbox__nav')) nav.hidden = gallery.list.length < 2;
  }
  document.addEventListener('click', e => {
    const thumb = e.target.closest('.thumb');
    if (thumb) {
      const offer = OFFERS.find(o => o.id === thumb.dataset.offer);
      gallery = { list: offer.landings, index: Number(thumb.dataset.index), from: thumb };
      $('#lightbox').hidden = false;
      document.documentElement.style.overflow = 'hidden';
      showLanding();
      $('#lightboxClose').focus({ preventScroll: true });
      return;
    }
    const step = e.target.closest('.lightbox__nav');
    if (step && gallery) { gallery.index = (gallery.index + Number(step.dataset.step) + gallery.list.length) % gallery.list.length; showLanding(); return; }
    if (e.target.id === 'lightbox' || e.target.closest('#lightboxClose')) closeLightbox();
  });
  function closeLightbox() {
    if (!gallery) return;
    $('#lightbox').hidden = true;
    document.documentElement.style.overflow = '';
    $('#lightboxImg').removeAttribute('src');
    gallery.from?.focus?.({ preventScroll: true });
    gallery = null;
  }
  document.addEventListener('keydown', e => {
    if (!gallery) return;
    if (e.key === 'Escape') closeLightbox();
    else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { gallery.index = (gallery.index + (e.key === 'ArrowRight' ? 1 : -1) + gallery.list.length) % gallery.list.length; showLanding(); }
  });

  /* ── Язык, тема и запуск ─────────────────────────────────── */
  function renderSources() {
    const items = COUNTRIES.filter(c => MARKET[c]?.source).map(c => {
      const m = MARKET[c], name = `${esc(geoName(c))} — ${esc(m.source[lang])}, ${esc(m.year)}${m.note ? ` (${esc(m.note[lang])})` : ''}`;
      return m.url ? `<a href="${esc(m.url)}" target="_blank" rel="noopener">${name}</a>` : name;
    });
    $('#sources').hidden = !items.length;
    $('#sources').innerHTML = items.length ? `${t('sourcesLead')}: ${items.join('; ')}. ${t('sourcesNote')} ${t('populationNote')}` : '';
  }
  function renderAll() {
    document.documentElement.lang = lang;
    document.title = t('docTitle');
    $('meta[name="description"]').setAttribute('content', t('docDesc'));
    for (const el of $$('[data-i18n]')) el.textContent = t(el.dataset.i18n);
    for (const el of $$('[data-i18n-label]')) el.setAttribute('aria-label', t(el.dataset.i18nLabel));
    for (const b of $$('.lang__btn')) b.setAttribute('aria-pressed', b.dataset.lang === lang);
    $('#ctaLogo').src = `img/logo-full-${lang}.svg`;
    renderHero(); renderTabs(); renderCard(active); renderCatalog(); renderSources();
    syncTabs(!anim);
  }
  $('.lang').addEventListener('click', e => {
    const b = e.target.closest('[data-lang]');
    if (!b || b.dataset.lang === lang) return;
    lang = b.dataset.lang;
    store.set('tc-lang', lang);
    // язык остаётся в адресе, чтобы ссылку на нужную версию можно было отправить партнёру
    const url = new URL(location.href);
    url.searchParams.set('lang', lang);
    history.replaceState(null, '', url);
    renderAll();
    draw(performance.now());
  });
  $('#themeToggle').addEventListener('click', () => {
    const root = document.documentElement;
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    store.set('tc-offerwall-theme', next);
  });

  new ResizeObserver(resizeGlobe).observe($('#heroStage'));
  new IntersectionObserver(entries => { heroVisible = entries[0].isIntersecting; }, { threshold: 0.05 }).observe($('.hero'));

  renderAll();
  resizeGlobe();
  document.fonts?.ready.then(() => { measureOffsets(); draw(performance.now()); });
  for (const im of Object.values(flagImages)) im.addEventListener('load', () => draw(performance.now()));
  const deep = location.hash.match(/^#geo-([A-Z]+)$/);
  if (deep && GEO[deep[1]]) showCountry(deep[1], false);
  else if (!reducedMotion.matches) goTo('RU', 2400);
  else syncTabs(false);
  requestAnimationFrame(tick);
})();
