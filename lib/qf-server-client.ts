/**
 * Singleton @quranjs/api/server client for Content and Search APIs.
 *
 * - Uses Client Credentials (client_secret) — server-side only.
 * - The SDK handles OAuth2 app-token acquisition, caching, and early renewal.
 * - Never import this module from browser/client-component code.
 */
import { createServerClient } from '@quranjs/api/server';

const IS_PRODUCTION = process.env.QF_ENVIRONMENT === 'production';

/** Prelive service URLs — used when QF_ENVIRONMENT is not "production". */
const PRELIVE_SERVICES = {
  oauth2BaseUrl: 'https://prelive-oauth2.quran.foundation',
  contentBaseUrl: 'https://apis-prelive.quran.foundation/content',
  searchBaseUrl: 'https://apis-prelive.quran.foundation/search',
  authBaseUrl: 'https://apis-prelive.quran.foundation/auth',
} as const;

// eslint-disable-next-line @typescript-eslint/naming-convention
let _client: ReturnType<typeof createServerClient> | null = null;

export function getContentClient(): ReturnType<typeof createServerClient> {
  if (!_client) {
    _client = createServerClient({
      clientId: process.env.QF_CLIENT_ID!,
      clientSecret: process.env.QF_CLIENT_SECRET!,
      ...(!IS_PRODUCTION && { services: PRELIVE_SERVICES }),
    });
  }
  return _client;
}
