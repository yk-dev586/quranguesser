// @vitest-environment node
/**
 * Integration tests for getQuestion / fetchVerse (missing-word-count mode).
 *
 * These tests exercise the real SDK calls used by getQuestion.ts to catch
 * 404s and empty responses from the QF API before they surface in production.
 *
 * Run:  npm run test:api
 */
// eslint-disable-next-line import/no-extraneous-dependencies
import 'dotenv/config';
import { describe, it, expect, beforeAll, vi } from 'vitest';

// Stub prisma before importing getQuestion (it would try to connect to the DB otherwise)
vi.mock('@/lib/prisma', () => ({
  prisma: {
    pageElo: {
      findUnique: vi.fn().mockResolvedValue(null),
    },
  },
}));

// We need env vars loaded before the singleton client is created
const hasCredentials = Boolean(process.env.QF_CLIENT_ID && process.env.QF_CLIENT_SECRET);
const itIfCreds = hasCredentials ? it : it.skip;

describe('getRandomQuestion - SDK integration', () => {
  beforeAll(() => {
    if (!hasCredentials) {
      console.warn(
        'QF_CLIENT_ID / QF_CLIENT_SECRET not set — skipping integration tests.\n' +
          'Run with: npx vitest run --env-file .env app/quiz/missing-word-count/__tests__/getQuestion.test.ts',
      );
    }
  });

  itIfCreds('returns a valid question for a random verse (no params)', async () => {
    const { getRandomQuestion } = await import('../getQuestion');
    const question = await getRandomQuestion();

    expect(question).toBeDefined();
    expect(question.encryptedVerseKey).toBeTruthy();
    expect(question.answerToken).toBeTruthy();
    expect(Array.isArray(question.segments)).toBe(true);
    expect(question.segments.length).toBeGreaterThan(0);
    console.log('random question segments:', question.segments.length);
  });

  // All pages should succeed — SDK failures fall back to direct API
  itIfCreds.each([1, 50, 100, 200, 300, 356, 400, 500, 604])(
    'returns a valid question for page %i (with fallback)',
    async (page) => {
      const { getRandomQuestion } = await import('../getQuestion');
      const question = await getRandomQuestion(page);
      expect(question.encryptedVerseKey).toBeTruthy();
      console.log(`page ${page} → segments: ${question.segments.length}`);
    },
  );

  itIfCreds.each([1, 15, 30])(
    'returns a valid question for juz %i (with fallback)',
    async (juz) => {
      const { getRandomQuestion } = await import('../getQuestion');
      const question = await getRandomQuestion(undefined, [juz]);
      expect(question.encryptedVerseKey).toBeTruthy();
      console.log(`juz ${juz} → segments: ${question.segments.length}`);
    },
  );
});
