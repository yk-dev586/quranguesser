import { encryptVerseKey, signAnswer } from './answerToken';
import { SURAH_NAMES, SURAH_VERSE_COUNTS, nextVerseKey } from './surahData';
import type { Question, VerseWord } from './types';

import { qdcFetchByJuz, qdcFetchByPage, qdcFetchByKey, qdcFetchRandom } from '@/lib/qdc-client';
import type { QdcWord } from '@/lib/qdc-client';
import { pickRandomJuz } from '@/lib/quran-pages';

interface RawWord extends VerseWord {
  page_number: number;
}

function qdcToRaw(w: QdcWord): RawWord {
  return {
    id: w.id,
    position: w.position,
    code_v2: w.code_v2 ?? '',
    text_qpc_hafs: w.text ?? '',
    page_number: w.page_number ?? 1,
    char_type_name: w.char_type_name,
  };
}

async function fetchRandomVerse(juzFilter?: number[], pageNumber?: number) {
  if (pageNumber !== undefined) return qdcFetchByPage(pageNumber);
  if (juzFilter?.length) return qdcFetchByJuz(pickRandomJuz(juzFilter));
  return qdcFetchRandom();
}

async function fetchWords(verseKey: string): Promise<RawWord[] | null> {
  const v = await qdcFetchByKey(verseKey);
  return v?.words.sort((a, b) => a.position - b.position).map(qdcToRaw) ?? null;
}

function sanitizeWords(words: RawWord[]): VerseWord[] {
  return words;
}

export async function getRandomQuestion(juzFilter?: number[], pageNumber?: number): Promise<Question> {
  let current = await fetchRandomVerse(juzFilter, pageNumber);
  let currentWords = current.words.sort((a, b) => a.position - b.position).map(qdcToRaw);
  let nextKey = nextVerseKey(current.verse_key);
  let nextWords = nextKey ? await fetchWords(nextKey) : null;

  for (let attempt = 0; attempt < 12 && (!nextKey || !nextWords); attempt++) {
    current = await fetchRandomVerse(juzFilter, pageNumber);
    currentWords = current.words.sort((a, b) => a.position - b.position).map(qdcToRaw);
    nextKey = nextVerseKey(current.verse_key);
    nextWords = nextKey ? await fetchWords(nextKey) : null;
  }
  if (!nextKey || !nextWords) throw new Error('Could not find a verse with a following verse in the local Quran.');

  const [surah, ayah] = nextKey.split(':').map(Number) as [number, number];
  const candidates: string[] = [];
  const max = surah > 0 ? SURAH_VERSE_COUNTS[surah] : 0;
  for (let n = Math.max(1, ayah - 10); n <= Math.min(max, ayah + 10); n++) {
    const key = `${surah}:${n}`;
    if (key !== current.verse_key && key !== nextKey) candidates.push(key);
  }
  for (let i = candidates.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
  }

  const distractorSets: RawWord[][] = [];
  for (const key of candidates) {
    if (distractorSets.length >= 3) break;
    const words = await fetchWords(key);
    if (words?.length) distractorSets.push(words);
  }
  if (distractorSets.length < 3) throw new Error('Could not build three local distractors for next-verse quiz.');

  const correctIndex = Math.floor(Math.random() * 4);
  const choices: { words: VerseWord[] }[] = [];
  let cursor = 0;
  for (let i = 0; i < 4; i++) {
    choices.push({ words: sanitizeWords(i === correctIndex ? nextWords : distractorSets[cursor++]) });
  }

  const surahName = SURAH_NAMES[Number(current.verse_key.split(':')[0])] ?? `Surah ${current.verse_key.split(':')[0]}`;
  return {
    encryptedVerseKey: encryptVerseKey(current.verse_key),
    verseWords: sanitizeWords(currentWords),
    verseReference: `${surahName} · ${current.verse_key}`,
    choices,
    answerToken: signAnswer(current.verse_key, correctIndex),
  };
}
