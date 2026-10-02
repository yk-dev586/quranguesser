// prettier-ignore
/**
 * Starting page (Medina Mushaf, King Fahad Complex edition) for each surah.
 * Index 0 is unused; index n corresponds to Surah n (1–114).
 */
export const SURAH_START_PAGES: readonly number[] = [
  0,                                                   // (unused)
  1,   2,   50,  77,  106, 128, 151, 177, 187, 208, // 1–10
  221, 235, 249, 255, 262, 267, 282, 293, 305, 312, // 11–20
  322, 332, 342, 350, 359, 367, 377, 385, 396, 404, // 21–30
  411, 415, 418, 428, 434, 440, 446, 453, 458, 467, // 31–40
  477, 483, 489, 496, 499, 503, 507, 511, 515, 518, // 41–50
  520, 523, 526, 528, 531, 534, 537, 542, 545, 549, // 51–60
  551, 553, 554, 556, 558, 560, 562, 564, 566, 568, // 61–70
  570, 572, 574, 575, 577, 578, 580, 582, 583, 585, // 71–80
  586, 587, 587, 589, 590, 591, 591, 592, 593, 594, // 81–90
  595, 595, 596, 596, 597, 597, 598, 598, 599, 599, // 91–100
  600, 600, 601, 601, 601, 602, 602, 603, 603, 603, // 101–110
  603, 604, 604, 604,                               // 111–114
];

// prettier-ignore
export const SURAH_NAMES: readonly string[] = [
  '',
  'Al-Fatihah',    'Al-Baqarah',    "Ali 'Imran",    "An-Nisa'",      "Al-Ma'idah",   // 1–5
  "Al-An'am",      "Al-A'raf",      'Al-Anfal',      'At-Tawbah',     'Yunus',        // 6–10
  'Hud',           'Yusuf',         "Ar-Ra'd",        'Ibrahim',       'Al-Hijr',      // 11–15
  'An-Nahl',       "Al-Isra'",      'Al-Kahf',        'Maryam',        'Ta-Ha',        // 16–20
  "Al-Anbiya'",    'Al-Hajj',       "Al-Mu'minun",    'An-Nur',        'Al-Furqan',    // 21–25
  "Ash-Shu'ara'",  'An-Naml',       'Al-Qasas',       "Al-'Ankabut",   'Ar-Rum',       // 26–30
  'Luqman',        'As-Sajdah',     'Al-Ahzab',       "Saba'",         'Fatir',        // 31–35
  'Ya-Sin',        'As-Saffat',     'Sad',            'Az-Zumar',      'Ghafir',       // 36–40
  'Fussilat',      'Ash-Shura',     'Az-Zukhruf',     'Ad-Dukhan',     'Al-Jathiyah',  // 41–45
  'Al-Ahqaf',      'Muhammad',      'Al-Fath',        'Al-Hujurat',    'Qaf',          // 46–50
  'Adh-Dhariyat',  'At-Tur',        'An-Najm',        'Al-Qamar',      'Ar-Rahman',    // 51–55
  "Al-Waqi'ah",    'Al-Hadid',      'Al-Mujadilah',   'Al-Hashr',      'Al-Mumtahanah',// 56–60
  'As-Saf',        "Al-Jumu'ah",    'Al-Munafiqun',   'At-Taghabun',   'At-Talaq',     // 61–65
  'At-Tahrim',     'Al-Mulk',       'Al-Qalam',       'Al-Haqqah',     "Al-Ma'arij",   // 66–70
  'Nuh',           'Al-Jinn',       'Al-Muzzammil',   'Al-Muddaththir','Al-Qiyamah',   // 71–75
  'Al-Insan',      'Al-Mursalat',   "An-Naba'",       "An-Nazi'at",    "'Abasa",       // 76–80
  'At-Takwir',     'Al-Infitar',    'Al-Mutaffifin',  'Al-Inshiqaq',   'Al-Buruj',     // 81–85
  'At-Tariq',      "Al-A'la",       'Al-Ghashiyah',   'Al-Fajr',       'Al-Balad',     // 86–90
  'Ash-Shams',     'Al-Layl',       'Ad-Duha',        'Ash-Sharh',     'At-Tin',       // 91–95
  "Al-'Alaq",      'Al-Qadr',       'Al-Bayyinah',    'Az-Zalzalah',   "Al-'Adiyat",  // 96–100
  "Al-Qari'ah",    'At-Takathur',   "Al-'Asr",        'Al-Humazah',    'Al-Fil',       // 101–105
  'Quraysh',       "Al-Ma'un",      'Al-Kawthar',     'Al-Kafirun',    'An-Nasr',      // 106–110
  'Al-Masad',      'Al-Ikhlas',     'Al-Falaq',       'An-Nas',                        // 111–114
];

/**
 * Returns the Juz number (1–30) for the given Medina Mushaf page number.
 *
 * Juz 1 spans pages 1–21, juz 2–29 span 20 pages each, juz 30 spans pages 582–604.
 */
export function getJuzForPage(page: number): number {
  if (page <= 21) {
    return 1;
  }
  if (page >= 582) {
    return 30;
  }
  return Math.floor((page - 22) / 20) + 2;
}

/**
 * Returns a display string for the chapter(s) on the given page.
 *
 * If one or more surahs begin on this page, all of them are listed.
 * Otherwise returns the spanning surah that covers this page.
 */
export function getSurahsForPage(page: number): string {
  const starting: string[] = [];
  for (let i = 1; i <= 114; i++) {
    if (SURAH_START_PAGES[i] === page) {
      starting.push(`${i}. ${SURAH_NAMES[i]}`);
    }
  }
  if (starting.length > 0) {
    return starting.join(', ');
  }

  // Spanning surah: the last surah whose start page is ≤ this page
  let primary = 1;
  for (let i = 1; i <= 114; i++) {
    if (SURAH_START_PAGES[i] <= page) {
      primary = i;
    }
  }
  return `${primary}. ${SURAH_NAMES[primary]}`;
}

/**
 * Returns the first and last Mushaf page numbers for a given juz (1–30).
 *
 * Juz 1 → pages 1–21
 * Juz 2–29 → 20 pages each starting at page 22
 * Juz 30 → pages 582–604
 */
export function getPageRangeForJuz(juz: number): { start: number; end: number } {
  if (juz === 1) {
    return { start: 1, end: 21 };
  }
  if (juz === 30) {
    return { start: 582, end: 604 };
  }
  const start = 22 + (juz - 2) * 20;
  return { start, end: start + 19 };
}

/**
 * Given an array of selected juz numbers, returns a random juz from the selection.
 * Falls back to picking any juz 1–30 if the array is empty.
 */
export function pickRandomJuz(juzList: number[]): number {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const list = juzList.length > 0 ? juzList : Array.from({ length: 30 }, (_, i) => i + 1);
  return list[Math.floor(Math.random() * list.length)];
}
