/**
 * Local Quran Content Adapter.
 *
 * This replaces the previous runtime dependency on api.qurancdn.com. Core quiz
 * data comes from public/quran/data/quran.json. Exact Mushaf page/line and QCF
 * glyph data are read from public/quran/qcf when hydrated locally.
 */
import {
  getLocalPageLayout,
  getLocalVerse,
  getQpcV2ForWord,
  loadLocalVerseLayoutSync,
  loadLocalQuran,
  versesForJuz,
  wordsForVerse,
  type LocalVerse,
} from './quran-local-data';

export interface QdcWord {
  id: number;
  position: number;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  code_v2: string;
  text: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  char_type_name: string;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  page_number?: number;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  line_number?: number;
}

export interface QdcVerse {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  verse_key: string;
  words: QdcWord[];
}

function randomItem<T>(items: T[]): T {
  if (!items.length) throw new Error('No local Quran items are available.');
  return items[Math.floor(Math.random() * items.length)];
}

function toQdcVerse(verse: LocalVerse, includeLayout = false): QdcVerse {
  const verseKey = `${verse.chapter}:${verse.verse}`;
  const layout = includeLayout ? loadLocalVerseLayoutSync()?.[verseKey] : undefined;
  const rawWords = wordsForVerse(verse);

  return {
    verse_key: verseKey,
    words: rawWords.map((word, index) => {
      const containingLine = layout?.lines.find(
        (line) => word.position >= line.word_start && word.position <= line.word_end,
      );
      const page = layout?.page;
      return {
        ...word,
        id: word.id || index + 1,
        code_v2: getQpcV2ForWord(verseKey, word.position, page),
        ...(page ? { page_number: page } : {}),
        ...(containingLine ? { line_number: containingLine.line } : {}),
      } satisfies QdcWord;
    }),
  };
}

function requireLayout(operation: string): Record<string, import('./quran-local-data').LocalVerseLayout> {
  const layout = loadLocalVerseLayoutSync();
  if (!layout) {
    throw new Error(
      `Offline Mushaf layout is not installed. ${operation} needs public/quran/qcf/layout/verse-map.json. ` +
        `Run "npm run offline:hydrate-qcf" on a machine with Internet access, then copy the generated assets into this project.`,
    );
  }
  return layout;
}

export async function qdcFetchByPage(page: number): Promise<QdcVerse> {
  if (!Number.isInteger(page) || page < 1 || page > 604) {
    throw new Error(`Invalid Mushaf page: ${page}`);
  }
  const layout = requireLayout(`Page ${page}`);
  const candidates = loadLocalQuran().filter(
    (verse) => layout[`${verse.chapter}:${verse.verse}`]?.page === page,
  );
  if (!candidates.length) {
    // Give the user a deterministic failure instead of silently using a fake page.
    if (!getLocalPageLayout(page)) {
      throw new Error(`Offline Mushaf page ${page} is not installed in public/quran/qcf/layout/pages.`);
    }
    throw new Error(`Offline Mushaf page ${page} has no verse entries in verse-map.json.`);
  }
  return toQdcVerse(randomItem(candidates), true);
}

export async function qdcFetchByJuz(juz: number): Promise<QdcVerse> {
  const verses = versesForJuz(juz);
  if (!verses.length) throw new Error(`Offline Juz ${juz} contains no indexed verses.`);
  return toQdcVerse(randomItem(verses), Boolean(loadLocalVerseLayoutSync()));
}

export async function qdcFetchRandom(): Promise<QdcVerse> {
  return toQdcVerse(randomItem(loadLocalQuran()), Boolean(loadLocalVerseLayoutSync()));
}

export async function qdcFetchByKey(verseKey: string): Promise<QdcVerse | null> {
  const verse = getLocalVerse(verseKey);
  return verse ? toQdcVerse(verse, Boolean(loadLocalVerseLayoutSync())) : null;
}

export async function qdcFetchRandomWithLayout(juzFilter?: number[]): Promise<QdcVerse> {
  const layout = requireLayout('The exact page/line quiz');
  let candidates = loadLocalQuran().filter((verse) => Boolean(layout[`${verse.chapter}:${verse.verse}`]));
  if (juzFilter?.length) {
    const allowedVerses = juzFilter.flatMap((juz) => versesForJuz(juz));
    const allowed = new Set(allowedVerses.map((v) => `${v.chapter}:${v.verse}`));
    candidates = candidates.filter((verse) => allowed.has(`${verse.chapter}:${verse.verse}`));
  }
  if (!candidates.length) throw new Error('No locally indexed verse is available for this filter.');
  return toQdcVerse(randomItem(candidates), true);
}
