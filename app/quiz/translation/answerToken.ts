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

function getAesKey(): Buffer {
  return createHash('sha256').update(getSecret()).digest();
}

export function encryptVerseKey(verseKey: string): string {
  const iv = randomBytes(12);
  const key = getAesKey();
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([cipher.update(verseKey, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [iv, encrypted, tag].map((b) => b.toString('base64url')).join('.');
}

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

/** Sign the correct choice index; prefixed to prevent cross-quiz token reuse. */
export function signAnswer(verseKey: string, correctIndex: number): string {
  return createHmac('sha256', getSecret())
    .update(`translation-quiz:${verseKey}:${correctIndex}`)
    .digest('hex');
}

/** Returns the correct choice index (0-3) if the token is valid, otherwise null. */
export function verifyAnswer(verseKey: string, token: string): number | null {
  for (let index = 0; index <= 3; index++) {
    const expected = signAnswer(verseKey, index);
    const expectedBuf = Buffer.from(expected, 'hex');
    const tokenBuf = Buffer.from(token, 'hex');
    if (expectedBuf.length === tokenBuf.length && timingSafeEqual(expectedBuf, tokenBuf)) {
      return index;
    }
  }
  return null;
}
