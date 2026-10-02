// @vitest-environment node
/**
 * Offline/local data tests.
 *
 * The original version of this file made live QF/QDC HTTP requests.
 * The merged project must not require those APIs for core gameplay, so these
 * tests exercise the local adapters instead.
 */
import { describe, it, expect } from 'vitest';
import {
  qdcFetchByKey,
  qdcFetchByJuz,
  qdcFetchRandom,
  qdcFetchRandomWithLayout,
} from '../qdc-client';
import { qdcFetchTranslation, TRANSLATION_OPTIONS } from '../qdc-translations';
import { loadLocalQuran, versesForJuz } from '../quran-local-data';

describe('local Quran data adapters', () => {
  it('loads all Quran chapters and verses locally', () => {
    const quran = loadLocalQuran();
    expect(quran.chapters).toHaveLength(114);
    expect(quran.verses).toHaveLength(6236);
    expect(quran.verses[0]?.verseKey).toBe('1:1');
    expect(quran.verses.at(-1)?.verseKey).toBe('114:6');
  });

  it.each(['1:1', '2:255', '36:1', '112:1'])('loads verse %s locally', (key) => {
    const verse = qdcFetchByKey(key);
    expect(verse.verseKey).toBe(key);
    expect(verse.words.length).toBeGreaterThan(0);
  });

  it.each([1, 15, 30])('filters juz %i locally', (juz) => {
    const verses = qdcFetchByJuz(juz);
    expect(verses.length).toBeGreaterThan(0);
    expect(verses.every((v) => v.juzNumber === juz)).toBe(true);
  });

  it('returns a local random verse', () => {
    const verse = qdcFetchRandom();
    expect(verse.verseKey).toMatch(/^\d+:\d+$/);
    expect(verse.words.length).toBeGreaterThan(0);
  });

  it('makes the exact locate quiz fail clearly until local QCF layout is hydrated', () => {
    expect(() => qdcFetchRandomWithLayout()).toThrow(/QCF local layout is not installed/);
  });
});

describe('local translations', () => {
  it('exposes all bundled translations', () => {
    expect(TRANSLATION_OPTIONS).toHaveLength(10);
  });

  it('loads a known English translation locally', () => {
    const translation = qdcFetchTranslation('1:1', 1001);
    expect(translation).toBeDefined();
    expect(translation?.text?.length ?? 0).toBeGreaterThan(0);
  });
});

describe('Juz boundary data', () => {
  it('contains a non-empty verse range for every juz', () => {
    for (let juz = 1; juz <= 30; juz += 1) {
      expect(versesForJuz(juz).length).toBeGreaterThan(0);
    }
  });
});
