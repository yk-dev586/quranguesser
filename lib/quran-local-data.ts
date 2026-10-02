import fs from 'node:fs';
import path from 'node:path';

export interface LocalVerse {
  chapter: number;
  verse: number;
  text: string;
}

export interface LocalLayoutSpan {
  line: number;
  word_start: number;
  word_end: number;
}

export interface LocalVerseLayout {
  page: number;
  lines: LocalLayoutSpan[];
}

export interface LocalPageWord {
  location: string;
  word: string;
  qpcV2?: string;
  qpcV1?: string;
}

export interface LocalPageLine {
  line: number;
  words: LocalPageWord[];
}

export interface LocalPageLayout {
  page: number;
  lines: LocalPageLine[];
}

type QuranJson = Record<string, Array<{ chapter?: number; verse?: number; text?: string }>>;

let quranCache: LocalVerse[] | null = null;
let layoutCache: Record<string, LocalVerseLayout> | null | undefined;
const pageCache = new Map<number, LocalPageLayout | null>();
let layoutLoading: Promise<Record<string, LocalVerseLayout> | null> | null = null;

function publicPath(...segments: string[]): string {
  return path.join(process.cwd(), 'public', 'quran', ...segments);
}

export function loadLocalQuran(): LocalVerse[] {
  if (quranCache) return quranCache;

  const file = publicPath('data', 'quran.json');
  if (!fs.existsSync(file)) {
    throw new Error(`Local Quran data is missing: ${file}`);
  }

  const parsed = JSON.parse(fs.readFileSync(file, 'utf8')) as QuranJson;
  const verses: LocalVerse[] = [];

  for (const [chapterKey, items] of Object.entries(parsed)) {
    if (!Array.isArray(items)) continue;
    const fallbackChapter = Number(chapterKey);
    for (const item of items) {
      const chapter = Number(item.chapter ?? fallbackChapter);
      const verse = Number(item.verse);
      const text = String(item.text ?? '').trim();
      if (Number.isInteger(chapter) && Number.isInteger(verse) && text) {
        verses.push({ chapter, verse, text });
      }
    }
  }

  verses.sort((a, b) => a.chapter - b.chapter || a.verse - b.verse);
  if (verses.length === 0) {
    throw new Error('Local Quran data exists but contains no verses.');
  }

  quranCache = verses;
  return quranCache;
}

export function getLocalVerse(verseKey: string): LocalVerse | null {
  const match = /^([0-9]{1,3}):([0-9]{1,3})$/.exec(String(verseKey));
  if (!match) return null;
  const chapter = Number(match[1]);
  const verse = Number(match[2]);
  return loadLocalQuran().find((item) => item.chapter === chapter && item.verse === verse) ?? null;
}

export function versesForJuz(juz: number): LocalVerse[] {
  if (!Number.isInteger(juz) || juz < 1 || juz > 30) return [];

  const boundaries: Array<[number, number]> = [
    [1, 141],
    [2, 252],
    [3, 92],
    [4, 23],
    [4, 147],
    [5, 81],
    [6, 110],
    [7, 87],
    [8, 40],
    [9, 92],
    [11, 5],
    [12, 52],
    [14, 52],
    [16, 128],
    [18, 74],
    [20, 135],
    [22, 78],
    [25, 20],
    [27, 55],
    [29, 45],
    [33, 30],
    [36, 27],
    [39, 31],
    [41, 46],
    [45, 37],
    [51, 30],
    [57, 29],
    [66, 12],
    [77, 50],
    [114, 6],
  ];
  const starts: Array<[number, number]> = [
    [1, 1],
    [2, 142],
    [2, 253],
    [3, 93],
    [4, 24],
    [4, 148],
    [5, 82],
    [6, 111],
    [7, 88],
    [8, 41],
    [9, 93],
    [11, 6],
    [12, 53],
    [15, 1],
    [17, 1],
    [18, 75],
    [21, 1],
    [23, 1],
    [25, 21],
    [27, 56],
    [29, 46],
    [33, 31],
    [36, 28],
    [39, 32],
    [41, 47],
    [46, 1],
    [51, 31],
    [58, 1],
    [67, 1],
    [78, 1],
  ];

  const start = starts[juz - 1];
  const end = boundaries[juz - 1];
  if (!start || !end) return [];

  return loadLocalQuran().filter((item) => {
    const afterStart = item.chapter > start[0] || (item.chapter === start[0] && item.verse >= start[1]);
    const beforeEnd = item.chapter < end[0] || (item.chapter === end[0] && item.verse <= end[1]);
    return afterStart && beforeEnd;
  });
}

function extractLayoutMap(value: unknown): Record<string, LocalVerseLayout> | null {
  if (!value || typeof value !== 'object') return null;
  const root = value as Record<string, unknown>;
  const source = (root.verses ?? root.verseMap ?? root) as Record<string, unknown>;
  const result: Record<string, LocalVerseLayout> = {};

  for (const [verseKey, raw] of Object.entries(source)) {
    if (!raw || typeof raw !== 'object') continue;
    const item = raw as Record<string, unknown>;
    const page = Number(item.page);
    if (!Number.isInteger(page) || page < 1 || page > 604) continue;

    const rawLines = Array.isArray(item.lines) ? item.lines : [];
    const lines: LocalLayoutSpan[] = rawLines.flatMap((line) => {
      if (!line || typeof line !== 'object') return [];
      const row = line as Record<string, unknown>;
      const lineNo = Number(row.line);
      const wordStart = Number(row.word_start ?? row.wordStart);
      const wordEnd = Number(row.word_end ?? row.wordEnd);
      if (!Number.isInteger(lineNo) || !Number.isInteger(wordStart) || !Number.isInteger(wordEnd)) {
        return [];
      }
      return [{ line: lineNo, word_start: wordStart, word_end: wordEnd }];
    });

    result[verseKey] = { page, lines };
  }

  return Object.keys(result).length ? result : null;
}

export function loadLocalVerseLayoutSync(): Record<string, LocalVerseLayout> | null {
  if (layoutCache !== undefined) return layoutCache;
  const file = publicPath('qcf', 'layout', 'verse-map.json');
  if (!fs.existsSync(file)) {
    layoutCache = null;
    return layoutCache;
  }
  try {
    layoutCache = extractLayoutMap(JSON.parse(fs.readFileSync(file, 'utf8')));
  } catch {
    layoutCache = null;
  }
  return layoutCache;
}

export async function loadLocalVerseLayout(): Promise<Record<string, LocalVerseLayout> | null> {
  if (layoutCache !== undefined) return layoutCache;
  if (!layoutLoading) {
    layoutLoading = Promise.resolve(loadLocalVerseLayoutSync());
  }
  layoutCache = await layoutLoading;
  return layoutCache;
}

function loadLocalPageSync(page: number): LocalPageLayout | null {
  if (pageCache.has(page)) return pageCache.get(page) ?? null;
  if (!Number.isInteger(page) || page < 1 || page > 604) {
    pageCache.set(page, null);
    return null;
  }
  const file = publicPath('qcf', 'layout', 'pages', `page-${String(page).padStart(3, '0')}.json`);
  if (!fs.existsSync(file)) {
    pageCache.set(page, null);
    return null;
  }
  try {
    const parsed = JSON.parse(fs.readFileSync(file, 'utf8')) as Record<string, unknown>;
    const rawLines = Array.isArray(parsed.lines) ? parsed.lines : [];
    const lines: LocalPageLine[] = rawLines.flatMap((rawLine) => {
      if (!rawLine || typeof rawLine !== 'object') return [];
      const row = rawLine as Record<string, unknown>;
      const line = Number(row.line);
      const rawWords = Array.isArray(row.words) ? row.words : [];
      if (!Number.isInteger(line)) return [];
      const words: LocalPageWord[] = rawWords.flatMap((rawWord) => {
        if (!rawWord || typeof rawWord !== 'object') return [];
        const item = rawWord as Record<string, unknown>;
        const location = String(item.location ?? '');
        const word = String(item.word ?? '');
        if (!location || !word) return [];
        return [{ location, word, ...(item.qpcV2 ? { qpcV2: String(item.qpcV2) } : {}), ...(item.qpcV1 ? { qpcV1: String(item.qpcV1) } : {}) }];
      });
      return [{ line, words }];
    });
    const result = { page, lines } satisfies LocalPageLayout;
    pageCache.set(page, result);
    return result;
  } catch {
    pageCache.set(page, null);
    return null;
  }
}

export function getLocalPageLayout(page: number): LocalPageLayout | null {
  return loadLocalPageSync(page);
}

function codePointCount(text: string): number {
  return Array.from(text).length;
}

export function getQpcV2ForWord(verseKey: string, position: number, page?: number): string {
  if (!page) return '';
  const parsed = loadLocalPageSync(page);
  if (!parsed) return '';
  const matches: string[] = [];
  for (const line of parsed.lines) {
    for (const word of line.words) {
      if (word.location === `${verseKey}:${position}` && word.qpcV2) {
        matches.push(word.qpcV2);
      }
    }
  }
  return matches.join(' ').trim();
}

export function getVerseWordCount(verse: LocalVerse): number {
  return codePointCount(verse.text.split(/\s+/u).filter(Boolean).join(' ')) > 0
    ? verse.text.split(/\s+/u).filter(Boolean).length
    : 0;
}

export function wordsForVerse(verse: LocalVerse) {
  const words = verse.text.split(/\s+/u).filter(Boolean);
  return words.map((text, index) => ({
    id: Number(`${String(verse.chapter).padStart(3, '0')}${String(verse.verse).padStart(3, '0')}${String(index + 1).padStart(2, '0')}`),
    position: index + 1,
    code_v2: '',
    text,
    char_type_name: 'word',
  }));
}
