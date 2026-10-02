import { createCipheriv, createDecipheriv, createHash, randomBytes } from 'crypto';

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

/** Encrypts the correct page and line using AES-256-GCM, bound to the verse key.
 * The token is opaque ciphertext — the client cannot read the answer from it. */
export function signAnswer(verseKey: string, correctPage: number, correctLine: number): string {
  const iv = randomBytes(12);
  const key = getAesKey();
  const plaintext = `locate-verse:${verseKey}:${correctPage}:${correctLine}`;
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [iv, encrypted, tag].map((b) => b.toString('base64url')).join('.');
}

/** Decrypts the answer token and verifies it was issued for this verse key.
 * Returns the correct page and line, or null if tampered or mismatched. */
export function verifyAnswer(
  verseKey: string,
  token: string,
): { correctPage: number; correctLine: number } | null {
  const parts = token.split('.');
  if (parts.length !== 3) {
    return null;
  }
  try {
    const [ivB64, cipherB64, tagB64] = parts;
    const iv = Buffer.from(ivB64, 'base64url');
    const ciphertext = Buffer.from(cipherB64, 'base64url');
    const tag = Buffer.from(tagB64, 'base64url');
    const key = getAesKey();
    const decipher = createDecipheriv('aes-256-gcm', key, iv);
    decipher.setAuthTag(tag);
    const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString(
      'utf8',
    );
    const prefix = `locate-verse:${verseKey}:`;
    if (!plaintext.startsWith(prefix)) {
      return null;
    }
    const [pageStr, lineStr] = plaintext.slice(prefix.length).split(':');
    const page = parseInt(pageStr, 10);
    const line = parseInt(lineStr, 10);
    if (
      !Number.isInteger(page) ||
      !Number.isInteger(line) ||
      page < 1 ||
      page > 604 ||
      line < 1 ||
      line > 15
    ) {
      return null;
    }
    return { correctPage: page, correctLine: line };
  } catch {
    return null;
  }
}
