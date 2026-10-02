import { encryptVerseKey, signAnswer } from './answerToken';
import type { Question, VerseWord } from './types';

import { SURAH_NAMES } from '@/lib/quran-pages';
import { qdcFetchRandomWithLayout } from '@/lib/qdc-client';
import type { QdcWord } from '@/lib/qdc-client';

interface RawWord extends VerseWord {
  page_number: number;
  line_number: number;
}

function qdcWordToRaw(w: QdcWord): RawWord {
  if (w.page_number === undefined || w.line_number === undefined) {
    throw new Error('Local QCF layout is incomplete for this verse.');
  }
  return {
    id: w.id,
    position: w.position,
    code_v2: w.code_v2 ?? '',
    text_qpc_hafs: w.text ?? '',
    page_number: w.page_number,
    line_number: w.line_number,
    char_type_name: w.char_type_name,
  };
}

export async function getRandomQuestion(juzFilter?: number[], _pageNumber?: number): Promise<Question> {
  const v = await qdcFetchRandomWithLayout(juzFilter);
  const words = v.words.sort((a, b) => a.position - b.position).map(qdcWordToRaw);
  const firstWord = words.find((w) => w.char_type_name !== 'end') ?? words[0];
  if (!firstWord) throw new Error('Local QCF verse has no words.');
  const pages = [...new Set(words.map((w) => w.page_number))];
  const surah = Number(v.verse_key.split(':')[0]);
  return {
    encryptedVerseKey: encryptVerseKey(v.verse_key),
    verseWords: words.map(({ line_number: _line, ...word }) => word),
    verseReference: `${SURAH_NAMES[surah] ?? `Surah ${surah}`} · ${v.verse_key}`,
    answerToken: signAnswer(v.verse_key, firstWord.page_number, firstWord.line_number),
    fontPages: pages,
  };
}
