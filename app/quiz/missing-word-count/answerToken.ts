import {
  createCipheriv,
  createDecipheriv,
  createHash,
  createHmac,
  randomBytes,
  timingSafeEqual,
} from 'crypto';

function getSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error('AUTH_SECRET is not set');
  }
  return secret;
}

/** Derive a 32-byte AES key from AUTH_SECRET. */
function getAesKey(): Buffer {
  return createHash('sha256').update(getSecret()).digest();
}

/**
 * Encrypts a string with AES-256-GCM.
 * Returns `<iv>.<ciphertext>.<tag>` all base64url-encoded.
 */
export function encryptVerseKey(verseKey: string): string {
  const iv = randomBytes(12);
  const key = getAesKey();
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([cipher.update(verseKey, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [iv, encrypted, tag].map((b) => b.toString('base64url')).join('.');
}

/**
 * Decrypts a value produced by `encryptVerseKey`.
 * Throws if the ciphertext is tampered with.
 */
export function decryptVerseKey(token: string): string {
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted verse key');
  }
  const [ivB64, cipherB64, tagB64] = parts;
  const iv = Buffer.from(ivB64, 'base64url');
  const ciphertext = Buffer.from(cipherB64, 'base64url');
  const tag = Buffer.from(tagB64, 'base64url');
  const key = getAesKey();
  const decipher = createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);
  return Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString('utf8');
}

/**
 * Encrypts an array of hidden VerseWords so the client cannot see them until
 * submission. Uses the same AES-256-GCM scheme as `encryptVerseKey`.
 */
export function encryptHiddenWords(words: object[]): string {
  const iv = randomBytes(12);
  const key = getAesKey();
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const json = JSON.stringify(words);
  const encrypted = Buffer.concat([cipher.update(json, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [iv, encrypted, tag].map((b) => b.toString('base64url')).join('.');
}

/**
 * Decrypts a value produced by `encryptHiddenWords`.
 * Throws if the ciphertext is tampered with.
 */
export function decryptHiddenWords<T>(token: string): T[] {
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted hidden words');
  }
  const [ivB64, cipherB64, tagB64] = parts;
  const iv = Buffer.from(ivB64, 'base64url');
  const ciphertext = Buffer.from(cipherB64, 'base64url');
  const tag = Buffer.from(tagB64, 'base64url');
  const key = getAesKey();
  const decipher = createDecipheriv('aes-256-gcm', key, iv);
  decipher.setAuthTag(tag);
  const json = Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString('utf8');
  return JSON.parse(json) as T[];
}

export function signAnswer(
  verseKey: string,
  missingCount: number,
  pageNumber: number,
  totalWords: number,
): string {
  const hmac = createHmac('sha256', getSecret())
    .update(`${verseKey}:${missingCount}:${pageNumber}:${totalWords}`)
    .digest('hex');
  return `${pageNumber}.${totalWords}.${hmac}`;
}

/** Returns `{ missingCount, pageNumber, totalWords }` if the token is valid, otherwise null. */
export function verifyAnswer(
  verseKey: string,
  token: string,
): { missingCount: number; pageNumber: number; totalWords: number } | null {
  const parts = token.split('.');
  if (parts.length !== 3) {
    return null;
  }
  const [pageStr, totalWordsStr, hmac] = parts;
  const pageNumber = parseInt(pageStr, 10);
  const totalWords = parseInt(totalWordsStr, 10);
  if (!Number.isInteger(pageNumber) || pageNumber < 1 || pageNumber > 604) {
    return null;
  }
  if (!Number.isInteger(totalWords) || totalWords < 1) {
    return null;
  }

  for (let count = 0; count <= 4; count++) {
    const expected = createHmac('sha256', getSecret())
      .update(`${verseKey}:${count}:${pageNumber}:${totalWords}`)
      .digest('hex');
    const expectedBuf = Buffer.from(expected, 'hex');
    const tokenBuf = Buffer.from(hmac, 'hex');
    if (expectedBuf.length === tokenBuf.length && timingSafeEqual(expectedBuf, tokenBuf)) {
      return { missingCount: count, pageNumber, totalWords };
    }
  }
  return null;
}
