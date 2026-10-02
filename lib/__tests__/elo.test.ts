// @vitest-environment node
import { describe, it, expect } from 'vitest';

import { computeElo, questionEntropyMultiplier } from '../elo';

describe('questionEntropyMultiplier', () => {
  it('returns 1.0 for degenerate inputs (zero totalWords)', () => {
    expect(questionEntropyMultiplier(0, 0)).toBe(1.0);
  });

  it('returns 1.0 when missingCount is zero', () => {
    expect(questionEntropyMultiplier(10, 0)).toBe(1.0);
  });

  it('returns 1.0 when missingCount >= totalWords', () => {
    expect(questionEntropyMultiplier(4, 4)).toBe(1.0);
    expect(questionEntropyMultiplier(4, 5)).toBe(1.0);
  });

  it('gives a higher multiplier for longer verses with same missing count', () => {
    // 20-word verse, 4 missing: 16/20 = 0.8
    const longVerse = questionEntropyMultiplier(20, 4);
    // 7-word verse, 4 missing: 3/7 ≈ 0.429
    const shortVerse = questionEntropyMultiplier(7, 4);
    expect(longVerse).toBeGreaterThan(shortVerse);
    expect(longVerse).toBeCloseTo(0.8, 5);
    expect(shortVerse).toBeCloseTo(3 / 7, 5);
  });

  it('is exactly (totalWords - missingCount) / totalWords', () => {
    expect(questionEntropyMultiplier(10, 2)).toBeCloseTo(8 / 10, 10);
    expect(questionEntropyMultiplier(6, 4)).toBeCloseTo(2 / 6, 10);
  });
});

describe('computeElo with entropy', () => {
  it('backward-compatible: entropy defaults leave K unchanged (multiplier → 1.0)', () => {
    // With default totalWords=0, multiplier falls back to 1.0
    const withDefaults = computeElo(1000, 1000, true, 0);
    const withExplicit = computeElo(1000, 1000, true, 0, 0, 0);
    expect(withDefaults).toEqual(withExplicit);
  });

  it('longer verse with same missing count produces a larger ELO delta magnitude', () => {
    // Equal ELO, so expected score = 0.5; correct answer gives positive delta
    const longVerseResult = computeElo(1000, 1000, true, 0, 20, 4); // multiplier 0.8
    const shortVerseResult = computeElo(1000, 1000, true, 0, 7, 4); // multiplier ≈ 0.43

    // Both positive (correct answer vs equal opponent)
    expect(longVerseResult.userDelta).toBeGreaterThan(0);
    expect(shortVerseResult.userDelta).toBeGreaterThan(0);

    // Longer verse (more context) → larger gain for correct answer
    expect(longVerseResult.userDelta).toBeGreaterThan(shortVerseResult.userDelta);
  });

  it('longer verse punishes more on wrong answer', () => {
    const longVerseResult = computeElo(1000, 1000, false, 0, 20, 4);
    const shortVerseResult = computeElo(1000, 1000, false, 0, 7, 4);

    // Both negative (wrong answer vs equal opponent)
    expect(longVerseResult.userDelta).toBeLessThan(0);
    expect(shortVerseResult.userDelta).toBeLessThan(0);

    // Longer verse (more context) → larger loss for wrong answer
    expect(longVerseResult.userDelta).toBeLessThan(shortVerseResult.userDelta);
  });

  it('entropy does not affect the page ELO floor (100)', () => {
    // Player at floor, page at ceiling, wrong answer
    const result = computeElo(100, 3000, false, 200, 4, 1);
    expect(result.newUserElo).toBeGreaterThanOrEqual(100);
  });
});
