/**
 * Returns the K-factor based on the number of ranked games a player has played.
 * New players converge faster; established players are more stable.
 */
function kFactor(gamesPlayed: number): number {
  if (gamesPlayed < 30) {
    return 40;
  }
  if (gamesPlayed < 100) {
    return 32;
  }
  return 16;
}

/**
 * Computes expected score for the player given player and opponent ELO ratings.
 * Returns a value in [0, 1].
 */
function expectedScore(playerElo: number, opponentElo: number): number {
  return 1 / (1 + Math.pow(10, (opponentElo - playerElo) / 400));
}

/**
 * Computes an entropy-based multiplier that scales the K-factor according to
 * how much information is visible in the question.
 *
 * A longer verse with the same number of missing words has a higher visible
 * fraction → the player had more context → the question carries higher stakes.
 * Conversely, a short verse with many missing words gives little context and
 * the stakes are lower.
 *
 * Formula: visibleFraction = (totalWords - missingCount) / totalWords
 *
 * Falls back to 1.0 when the inputs are degenerate (zero words, etc.).
 */
export function questionEntropyMultiplier(totalWords: number, missingCount: number): number {
  if (totalWords <= 0 || missingCount <= 0 || missingCount >= totalWords) {
    return 1.0;
  }
  return (totalWords - missingCount) / totalWords;
}

export interface EloResult {
  newUserElo: number;
  newPageElo: number;
  userDelta: number;
  pageDelta: number;
}

/**
 * Computes new ELO ratings for both the user and the page after a quiz attempt.
 *
 * Convention: the user "plays" against the page.
 * - Correct answer → user wins (score = 1), page loses (score = 0)
 * - Wrong answer   → user loses (score = 0), page wins (score = 1)
 *
 * The K-factor is scaled by a question entropy multiplier derived from
 * `totalWords` and `missingCount`: a longer verse with the same number of
 * missing words gives the player more visible context, which raises the ELO
 * stakes (longer verse punishes more for a wrong answer than a shorter one).
 *
 * @param userElo - current ELO rating of the user
 * @param pageElo - current ELO rating of the page
 * @param isCorrect - whether the user answered correctly
 * @param gamesPlayed - total ranked games played by the user (controls K-factor)
 * @param totalWords - total Arabic words in the verse
 * @param missingCount - number of words hidden in this question
 */
export function computeElo(
  userElo: number,
  pageElo: number,
  isCorrect: boolean,
  gamesPlayed: number,
  totalWords: number = 0,
  missingCount: number = 0,
): EloResult {
  const K = kFactor(gamesPlayed) * questionEntropyMultiplier(totalWords, missingCount);
  const E = expectedScore(userElo, pageElo);
  const actualUser = isCorrect ? 1 : 0;

  const userDelta = Math.round(K * (actualUser - E));
  const pageDelta = -userDelta;

  return {
    newUserElo: Math.max(100, userElo + userDelta),
    newPageElo: Math.max(100, pageElo + pageDelta),
    userDelta,
    pageDelta,
  };
}
