import { unstable_cache } from 'next/cache';

import { prisma } from './prisma';

// Verse counts per surah (index 0 = surah 1, index 113 = surah 114)
// prettier-ignore
const SURAH_VERSE_COUNTS: readonly number[] = [
  7,  286, 200, 176, 120, 165, 206,  75, 129, 109, // 1–10
  123, 111,  43,  52,  99, 128, 111, 110,  98, 135, // 11–20
  112,  78, 118,  64,  77, 227,  93,  88,  69,  60, // 21–30
   34,  30,  73,  54,  45,  83, 182,  88,  75,  85, // 31–40
   54,  53,  89,  59,  37,  35,  38,  29,  18,  45, // 41–50
   60,  49,  62,  55,  78,  96,  29,  22,  24,  13, // 51–60
   14,  11,  11,  18,  12,  12,  30,  52,  52,  44, // 61–70
   28,  28,  20,  56,  40,  31,  50,  40,  46,  42, // 71–80
   29,  19,  36,  25,  22,  17,  19,  26,  30,  20, // 81–90
   15,  21,  11,   8,   8,  19,   5,   8,   8,  11, // 91–100
   11,   8,   3,   9,   5,   4,   7,   3,   6,   3, // 101–110
    5,   4,   5,   6,                                // 111–114
];

const TOTAL_VERSES = 6236;

function hashDate(date: string): number {
  let hash = 0;
  for (let i = 0; i < date.length; i++) {
    hash = (Math.imul(31, hash) + date.charCodeAt(i)) | 0;
  }
  return hash >>> 0;
}

function mulberry32(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), s | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function verseNumberToKey(n: number): string {
  let remaining = n;
  for (let surah = 1; surah <= 114; surah++) {
    const count = SURAH_VERSE_COUNTS[surah - 1];
    if (remaining <= count) {
      return `${surah}:${remaining}`;
    }
    remaining -= count;
  }
  throw new Error(`Invalid verse number: ${n}`);
}

export function getDailyVerseKeys(date: string): string[] {
  const seed = hashDate(date);
  const rand = mulberry32(seed);
  const selected = new Set<number>();
  while (selected.size < 5) {
    const n = Math.floor(rand() * TOTAL_VERSES) + 1;
    selected.add(n);
  }
  return [...selected].map(verseNumberToKey);
}

export function getUtcDateStr(date?: Date): string {
  const d = date ?? new Date();
  return d.toISOString().split('T')[0];
}

export const getOrCreateDailyChallenge = unstable_cache(
  async (date: string) => {
    const existing = await prisma.dailyChallenge.findUnique({ where: { date } });
    if (existing) {
      return existing;
    }
    const verseKeys = getDailyVerseKeys(date);
    return prisma.dailyChallenge.create({ data: { date, verseKeys } });
  },
  ['daily-challenge'],
  { revalidate: 3600, tags: ['daily-challenge'] },
);
