// Доли рынка мобильных операторов по числу абонентов (SIM). Собрано 24.11.2026.
// Кроме Саудовской Аравии, доли РАССЧИТАНЫ делением опубликованных абонентских баз на общий итог —
// готовых таблиц долей регуляторы не публикуют. Перед показом партнёрам цифры стоит сверить.
//
// Формат: КОД: { year, source: {ru, en}, url, note: {ru, en}, operators: [...] }
// Оператор с офферами ТК:   { op: 'ключ из справочника OPS в app.js', share, tc: true, via, plus, plusName }
//   via      — пометка, если оператор доступен только через Wi-Fi-поток (CPA по оператору);
//   plus     — второй бренд той же компании из справочника («МегаФон и Yota»);
//   plusName — второй бренд, которого в справочнике нет («Kcell и Activ»).
// population — население страны, млн человек (национальная статистика, начало 2025 г.; Саудовская Аравия — середина 2024 г.).
//   Из суммы по странам собирается заголовок «Более X млн абонентов в Y+ странах».
// Оператор без офферов:     { name, en, share, tc: false } — в карточке не показывается, нужен для суммы и проверки.
window.TC_MARKET = {
  RU: {
    population: 146.0,
    year: '2025',
    source: { ru: 'отчётность операторов и данные Минцифры', en: 'operator reports and Ministry of Digital Development data' },
    url: 'https://vc.ru/tech/3161528-reyting-operatorov-sotovoy-svyazi-v-rossii',
    operators: [
      { op: 'mts', share: 30.6, tc: true, via: 'Wi-Fi' },
      { op: 'megafon', plus: 'yota', share: 29.1, tc: true },
      { op: 't2', share: 17.9, tc: true, via: 'Wi-Fi' },
      { op: 'beeline', share: 16.1, tc: true },
      { name: 'Прочие', en: 'Others', share: 6.2, tc: false },
    ],
  },
  KZ: {
    population: 20.3,
    year: '2025',
    source: { ru: 'отчётность VEON и Kcell', en: 'VEON and Kcell reports' },
    url: 'https://www.sec.gov/Archives/edgar/data/1468091/000146809126000010/vip-20251231.htm',
    operators: [
      { op: 'beeline', share: 43.1, tc: true },
      { op: 'kcell', plusName: 'Activ', share: 31.6, tc: true },
      { op: 'tele2', plus: 'altel', share: 25.3, tc: true },
    ],
  },
  BY: {
    population: 9.1,
    year: '2025',
    source: { ru: 'отчётность A1 Group, МТС и Turkcell', en: 'A1 Group, MTS and Turkcell reports' },
    url: 'https://a1.com/wp-content/uploads/sites/6/2026/03/A1-Telekom-Austria-Group-Annual-financial-report-2025.pdf',
    operators: [
      { op: 'mts', share: 45.9, tc: true },
      { op: 'a1', share: 41.0, tc: true },
      { op: 'life', share: 13.1, tc: true },
    ],
  },
  KSA: {
    population: 35.3,
    year: '2026',
    source: { ru: 'оценка Opensignal', en: 'Opensignal estimate' },
    url: 'https://www.argaam.com/en/article/articledetail/id/1929694',
    operators: [
      { op: 'stc', share: 49.0, tc: true },
      { op: 'mobily', share: 23.8, tc: true },
      { name: 'Zain KSA', share: 14.6, tc: false },
      { op: 'virgin', share: 6.2, tc: true },
      { name: 'Другие MVNO', en: 'Other MVNOs', share: 6.4, tc: false },
    ],
  },
  KW: {
    population: 5.0,
    year: '2025',
    source: { ru: 'отчётность Ooredoo, Zain и stc', en: 'Ooredoo, Zain and stc reports' },
    url: 'https://www.zawya.com/en/press-release/companies-news/ooredoo-kuwait-group-reported-strong-9-growth-in-revenue-to-reach-kwd-774mln-in-2025-wl7ozscw',
    operators: [
      { name: 'Ooredoo', share: 37.2, tc: false },
      { name: 'Zain', share: 33.3, tc: false },
      { op: 'stc', share: 29.5, tc: true },
    ],
  },
  AM: {
    population: 3.1,
    year: '2025',
    source: { ru: 'отчётные формы операторов для регулятора', en: 'operator filings to the regulator' },
    url: 'https://www.ucom.am/storage/files/mobile-25-4-eng.pdf',
    operators: [
      { name: 'Viva', share: 56.0, tc: false },
      { name: 'Team Telecom', share: 25.6, tc: false },
      { op: 'ucom', share: 18.4, tc: true },
    ],
  },
  TJ: {
    population: 10.5,
    year: '2024–2025',
    source: { ru: 'оценка Nexign (TAdviser)', en: 'Nexign estimate (TAdviser)' },
    url: 'https://www.tadviser.ru/index.php/%D0%A1%D1%82%D0%B0%D1%82%D1%8C%D1%8F:%D0%A1%D0%B2%D1%8F%D0%B7%D1%8C_(%D1%80%D1%8B%D0%BD%D0%BE%D0%BA_%D0%A2%D0%B0%D0%B4%D0%B6%D0%B8%D0%BA%D0%B8%D1%81%D1%82%D0%B0%D0%BD%D0%B0)',
    note: { ru: 'Свежих официальных данных нет.', en: 'No recent official data.' },
    operators: [
      { name: 'Tcell', share: 33.9, tc: false },
      { name: 'Babilon-Mobile', share: 23.9, tc: false },
      { op: 'megafon', share: 22.9, tc: true },
      { op: 'zet', share: 12.7, tc: true },
      { name: 'Прочие', en: 'Others', share: 6.6, tc: false },
    ],
  },
};
