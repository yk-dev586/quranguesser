// prettier-ignore
/** Verse counts per surah (1-indexed; index 0 unused). */
export const SURAH_VERSE_COUNTS: readonly number[] = [
  0,
    7, 286, 200, 176, 120, 165, 206,  75, 129, 109, // 1-10
  123, 111,  43,  52,  99, 128, 111, 110,  98, 135, // 11-20
  112,  78, 118,  64,  77, 227,  93,  88,  69,  60, // 21-30
   34,  30,  73,  54,  45,  83, 182,  88,  75,  85, // 31-40
   54,  53,  89,  59,  37,  35,  38,  29,  18,  45, // 41-50
   60,  49,  62,  55,  78,  96,  29,  22,  24,  13, // 51-60
   14,  11,  11,  18,  12,  12,  30,  52,  52,  44, // 61-70
   28,  28,  20,  56,  40,  31,  50,  40,  46,  42, // 71-80
   29,  19,  36,  25,  22,  17,  19,  26,  30,  20, // 81-90
   15,  21,  11,   8,   8,  19,   5,   8,   8,  11, // 91-100
   11,   8,   3,   9,   5,   4,   7,   3,   6,   3, // 101-110
    5,   4,   5,   6,                               // 111-114
];

// prettier-ignore
export const SURAH_NAMES: readonly string[] = [
  '',
  'Al-Fatihah',    'Al-Baqarah',    "Ali 'Imran",    "An-Nisa'",     "Al-Ma'idah",   // 1-5
  "Al-An'am",      "Al-A'raf",      'Al-Anfal',      'At-Tawbah',    'Yunus',         // 6-10
  'Hud',           'Yusuf',         "Ar-Ra'd",        'Ibrahim',      'Al-Hijr',       // 11-15
  'An-Nahl',       "Al-Isra'",      'Al-Kahf',       'Maryam',       'Ta-Ha',         // 16-20
  "Al-Anbiya'",    'Al-Hajj',       "Al-Mu'minun",   'An-Nur',       'Al-Furqan',     // 21-25
  "Ash-Shu'ara'",  'An-Naml',       'Al-Qasas',      "Al-'Ankabut",  'Ar-Rum',        // 26-30
  'Luqman',        'As-Sajdah',     'Al-Ahzab',      "Saba'",        'Fatir',         // 31-35
  'Ya-Sin',        'As-Saffat',     'Sad',           'Az-Zumar',     'Ghafir',        // 36-40
  'Fussilat',      'Ash-Shura',     'Az-Zukhruf',    'Ad-Dukhan',    'Al-Jathiyah',   // 41-45
  'Al-Ahqaf',      'Muhammad',      'Al-Fath',       'Al-Hujurat',   'Qaf',           // 46-50
  'Adh-Dhariyat',  'At-Tur',        'An-Najm',       'Al-Qamar',     'Ar-Rahman',     // 51-55
  "Al-Waqi'ah",    'Al-Hadid',      'Al-Mujadilah',  'Al-Hashr',     'Al-Mumtahanah', // 56-60
  'As-Saf',        "Al-Jumu'ah",    'Al-Munafiqun',  'At-Taghabun',  'At-Talaq',      // 61-65
  'At-Tahrim',     'Al-Mulk',       'Al-Qalam',      'Al-Haqqah',    "Al-Ma'arij",    // 66-70
  'Nuh',           'Al-Jinn',       'Al-Muzzammil',  'Al-Muddaththir','Al-Qiyamah',   // 71-75
  'Al-Insan',      'Al-Mursalat',   "An-Naba'",      "An-Nazi'at",   "'Abasa",        // 76-80
  'At-Takwir',     'Al-Infitar',    'Al-Mutaffifin', 'Al-Inshiqaq',  'Al-Buruj',      // 81-85
  'At-Tariq',      "Al-A'la",       'Al-Ghashiyah',  'Al-Fajr',      'Al-Balad',      // 86-90
  'Ash-Shams',     'Al-Layl',       'Ad-Duha',       'Ash-Sharh',    'At-Tin',        // 91-95
  "Al-'Alaq",      'Al-Qadr',       'Al-Bayyinah',   'Az-Zalzalah',  "Al-'Adiyat",   // 96-100
  "Al-Qari'ah",    'At-Takathur',   "Al-'Asr",       'Al-Humazah',   'Al-Fil',        // 101-105
  'Quraysh',       "Al-Ma'un",      'Al-Kawthar',    'Al-Kafirun',   'An-Nasr',       // 106-110
  'Al-Masad',      'Al-Ikhlas',     'Al-Falaq',      'An-Nas',                        // 111-114
];

/** Returns the verse key that comes immediately after the given key, or null for the last verse. */
export function nextVerseKey(verseKey: string): string | null {
  const [surahStr, ayahStr] = verseKey.split(':');
  const surah = parseInt(surahStr, 10);
  const ayah = parseInt(ayahStr, 10);
  const maxAyah = SURAH_VERSE_COUNTS[surah];
  if (ayah < maxAyah) {
    return `${surah}:${ayah + 1}`;
  }
  if (surah < 114) {
    return `${surah + 1}:1`;
  }
  return null; // last verse of the Quran
}

/**
 * Picks a random verse key from [ayahMin, ayahMax] of the given surah and
 * fetches its words via the provided fetcher.  Retries until the fetcher
 * returns a non-null result (i.e. the verse exists in the API).
 */
export async function fetchRandomVerseInAyahRange<T>(
  surah: number,
  ayahMin: number,
  ayahMax: number,
  fetcher: (verseKey: string) => Promise<T | null>,
): Promise<{ verseKey: string; words: T }> {
  const lo = Math.max(1, ayahMin);
  const hi = Math.min(SURAH_VERSE_COUNTS[surah], ayahMax);
  for (;;) {
    const verseKey = `${surah}:${lo + Math.floor(Math.random() * (hi - lo + 1))}`;
    const words = await fetcher(verseKey);
    if (words) {
      return { verseKey, words };
    }
  }
}
