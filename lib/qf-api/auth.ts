/* eslint-disable @typescript-eslint/naming-convention */
import { QF_OAUTH2_BASE, REFRESH_BUFFER_SECONDS, IS_PRODUCTION } from '@/lib/constants';
import { prisma } from '@/lib/prisma';

interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
  token_type: string;
}

/**
 * Refresh an OAuth2 access token using the `refresh_token` grant.
 */
async function refreshTokens(refreshToken: string): Promise<TokenResponse | null> {
  const clientId = process.env.QF_CLIENT_ID!;
  const clientSecret = process.env.QF_CLIENT_SECRET!;

  // HTTP Basic Auth as required by the QF OAuth2 server (client_secret_basic)
  const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

  try {
    const res = await fetch(`${QF_OAUTH2_BASE}/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${basicAuth}`,
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }).toString(),
      cache: 'no-store',
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      console.error('[qf-api] Token refresh failed:', res.status, err);
      return null;
    }

    return (await res.json()) as TokenResponse;
  } catch (e) {
    console.error('[qf-api] Token refresh network error:', e);
    return null;
  }
}

/**
 * In-flight refresh promises keyed by userId.
 * Prevents concurrent requests from each attempting their own refresh and
 * invalidating the refresh token that a sibling request already consumed.
 */
const pendingRefreshes = new Map<string, Promise<string | null>>();

/**
 * Return a valid access token for the given local userId.
 */
export async function getAccessToken(userId: string): Promise<string | null> {
  const currentProviderId = IS_PRODUCTION ? 'quran-foundation' : 'quran-foundation-prelive';

  // look for the account matching the CURRENT environment
  const account = await prisma.account.findFirst({
    where: { userId, provider: currentProviderId },
    select: { id: true, access_token: true, refresh_token: true, expires_at: true, provider: true },
  });

  if (!account?.access_token) {
    return null;
  }

  const nowSeconds = Math.floor(Date.now() / 1000);
  const isExpired =
    !account.expires_at || nowSeconds >= account.expires_at - REFRESH_BUFFER_SECONDS;

  if (!isExpired) {
    return account.access_token;
  }

  if (!account.refresh_token) {
    return null;
  }

  // Deduplicate concurrent refresh attempts for the same user.
  // If another request is already refreshing this user's token, await that
  // promise instead of firing a second refresh (which would invalidate the
  // refresh token the first request already consumed).
  const existing = pendingRefreshes.get(userId);
  if (existing) {
    return existing;
  }

  const refreshPromise = (async (): Promise<string | null> => {
    try {
      // Re-read the account inside the lock so we pick up any token that a
      // concurrent request may have already refreshed while we were waiting.
      const latest = await prisma.account.findFirst({
        where: { userId, provider: account.provider ?? '' },
        select: { id: true, access_token: true, refresh_token: true, expires_at: true },
      });

      const nowInSeconds = Math.floor(Date.now() / 1000);
      if (
        latest?.access_token &&
        latest.expires_at &&
        nowInSeconds < latest.expires_at - REFRESH_BUFFER_SECONDS
      ) {
        // Another request already refreshed the token; use theirs.
        return latest.access_token;
      }

      const currentRefreshToken = latest?.refresh_token ?? account.refresh_token;
      if (!currentRefreshToken) {
        return null;
      }

      const refreshed = await refreshTokens(currentRefreshToken);

      if (!refreshed) {
        return null;
      }

      const newExpiresAt = Math.floor(Date.now() / 1000) + refreshed.expires_in;

      // update ONLY the exact account record we are refreshing
      await prisma.account.update({
        where: { id: latest?.id ?? account.id },
        data: {
          access_token: refreshed.access_token,
          refresh_token: refreshed.refresh_token,
          expires_at: newExpiresAt,
        },
      });

      return refreshed.access_token;
    } finally {
      pendingRefreshes.delete(userId);
    }
  })();

  pendingRefreshes.set(userId, refreshPromise);
  return refreshPromise;
}
