import { encryptHiddenWords, encryptVerseKey, signAnswer } from './answerToken';
import type { Question, Segment } from './types';

import { SURAH_NAMES, SURAH_VERSE_COUNTS } from '@/app/quiz/next-verse/surahData';
import type { VerseWord } from '@/app/quiz/types';
import { qdcFetchByJuz, qdcFetchByPage, qdcFetchByKey, qdcFetchRandom } from '@/lib/qdc-client';
import type { QdcVerse } from '@/lib/qdc-client';
import { pickRandomJuz } from '@/lib/quran-pages';

interface QuranVerse {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  verse_key: string;
  words: Array<VerseWord & { page_number: number }>;
}

function qdcToQuranVerse(v: QdcVerse): QuranVerse {
  return {
    verse_key: v.verse_key,
    words: v.words.map((w) => ({
      id: w.id,
      position: w.position,
      code_v2: w.code_v2 ?? '',
      text_qpc_hafs: w.text ?? '',
      page_number: w.page_number ?? 1,
      char_type_name: w.char_type_name,
    })),
  };
}

async function fetchVerse(
  targetPageNumber: number | undefined,
  juzFilter: number[] | undefined,
): Promise<QuranVerse> {
  if (targetPageNumber !== undefined) return qdcToQuranVerse(await qdcFetchByPage(targetPageNumber));
  if (juzFilter?.length) return qdcToQuranVerse(await qdcFetchByJuz(pickRandomJuz(juzFilter)));
  return qdcToQuranVerse(await qdcFetchRandom());
}

async function fetchVerseByKey(verseKey: string): Promise<QuranVerse | null> {
  const v = await qdcFetchByKey(verseKey);
  return v ? qdcToQuranVerse(v) : null;
}

function nextSurahVerseKey(verseKey: string): string | null {
  const [surahStr, ayahStr] = verseKey.split(':');
  const surah = Number(surahStr);
  const ayah = Number(ayahStr);
  return ayah < SURAH_VERSE_COUNTS[surah] ? `${surah}:${ayah + 1}` : null;
}

function arabicWords(v: QuranVerse) {
  return v.words.filter((w) => w.char_type_name === 'word').sort((a, b) => a.position - b.position);
}

export async function getRandomQuestion(
  targetPageNumber?: number,
  juzFilter?: number[],
): Promise<Question> {
  const primaryVerse = await fetchVerse(targetPageNumber, juzFilter);
  const primaryWords = arabicWords(primaryVerse);
  const wordCount = primaryWords.length;
  const maxMissing = Math.min(4, Math.max(0, wordCount - 1));
  if (maxMissing < 1) throw new Error('Could not build a question: verse has too few Arabic words');

  const missingCount = 1 + Math.floor(Math.random() * maxMissing);
  const visibleCount = wordCount - missingCount;
  let infoVerse: QuranVerse | null = null;
  if (visibleCount <= 2) {
    const nextKey = nextSurahVerseKey(primaryVerse.verse_key);
    if (nextKey) infoVerse = await fetchVerseByKey(nextKey);
  }

  const indices = [...Array(wordCount).keys()];
  for (let i = 0; i < missingCount; i++) {
    const j = i + Math.floor(Math.random() * (wordCount - i));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }
  const hiddenSet = new Set(indices.slice(0, missingCount));

  const segments: Segment[] = [];
  const hiddenWords: VerseWord[] = [];
  let currentWords: Array<VerseWord & { page_number: number }> = [];
  for (let i = 0; i < primaryWords.length; i++) {
    if (hiddenSet.has(i)) {
      hiddenWords.push(primaryWords[i]);
      if (currentWords.length) {
        segments.push({ type: 'words', words: currentWords });
        currentWords = [];
      }
      if (segments.at(-1)?.type !== 'blank') segments.push({ type: 'blank' });
    } else {
      currentWords.push(primaryWords[i]);
    }
  }
  if (currentWords.length) segments.push({ type: 'words', words: currentWords });
  segments.push({ type: 'verse-end', verseKey: primaryVerse.verse_key });

  if (infoVerse) {
    const infoWords = arabicWords(infoVerse);
    if (infoWords.length) {
      segments.push({ type: 'words', words: infoWords });
      segments.push({ type: 'verse-end', verseKey: primaryVerse.verse_key });
    }
  }

  const pageNumber = primaryWords[0]?.page_number ?? 1;
  return {
    encryptedVerseKey: encryptVerseKey(primaryVerse.verse_key),
    segments,
    answerToken: signAnswer(primaryVerse.verse_key, missingCount, pageNumber, wordCount),
    encryptedHiddenWords: encryptHiddenWords(hiddenWords),
    totalWords: wordCount,
    pageElo: 1000,
  };
}
