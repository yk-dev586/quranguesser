import { getAccessToken } from './auth';

import { QF_USER_API_BASE } from '@/lib/constants';

export interface QfUserProfile {
  id: string;
  createdAt: string;
  joiningYear: number;
  avatarUrls: Record<string, string>;
  settings?: Record<string, unknown>;
  verified?: boolean;
  postAs?: boolean;
  firstName?: string;
  lastName?: string;
  postsCount?: number;
  languageId?: number;
  followersCount?: number;
  likesCount?: number;
  isAdmin?: boolean;
  languageIsoCode?: string;
  bio?: string;
  country?: string;
  followed?: boolean;

  // QDC connected account fields (only present when qdc=true)
  isPasswordSet?: boolean;
  email?: string;
  photoUrl?: string;
  username?: string;
}

export interface QfUserProfileResponse {
  data?: QfUserProfile;
}

/**
 * Fetch the user's current Quran streak days from the QF API.
 * Returns 0 on any error so callers always get a safe integer.
 */
export async function fetchQfStreak(userId: string): Promise<number> {
  const accessToken = await getAccessToken(userId);
  if (!accessToken) {
    return 0;
  }

  try {
    const res = await fetch(`${QF_USER_API_BASE}/v1/streaks/current-streak-days?type=QURAN`, {
      headers: {
        Accept: 'application/json',
        'x-auth-token': accessToken,
        'x-client-id': process.env.QF_CLIENT_ID!,
      },
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      return 0;
    }

    const json = (await res.json()) as { data?: { days?: number } };
    return json?.data?.days ?? 0;
  } catch {
    return 0;
  }
}

/**
 * Record a quiz activity day against the user's QF account.
 * Converts the verse key ("surah:verse") into a QF range and posts to /v1/activity-days.
 * Fires-and-forgets: errors are silently swallowed so the quiz flow is never blocked.
 */
export async function recordQfActivityDay(userId: string, verseKey: string): Promise<void> {
  const accessToken = await getAccessToken(userId);
  if (!accessToken) {
    return;
  }

  // QF range format: "chapter:verse-chapter:verse"
  const range = `${verseKey}-${verseKey}`;

  try {
    await fetch(`${QF_USER_API_BASE}/v1/activity-days`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'x-auth-token': accessToken,
        'x-client-id': process.env.QF_CLIENT_ID!,
      },
      body: JSON.stringify({
        type: 'QURAN',
        seconds: 30,
        ranges: [range],
        mushafId: 4, // UthmaniHafs
      }),
    });
  } catch (e) {
    console.error('Failed to record QF activity day', e);
    // Non-blocking — streak display degrades gracefully
  }
}

/**
 * Fetch the complete profile of the authenticated user from the QF API.
 * Includes personal info, settings, statistics, and connected accounts.
 *
 * @param userId - The local user ID used to retrieve the access token.
 * @param includeQdc - Optional boolean to include Quran.com (QDC) connected account data.
 */
export async function fetchQfUserProfile(
  userId: string,
  includeQdc: boolean = false,
): Promise<QfUserProfile | null> {
  const accessToken = await getAccessToken(userId);
  if (!accessToken) {
    return null;
  }

  const url = new URL(`${QF_USER_API_BASE}/v1/users/profile`);
  if (includeQdc) {
    url.searchParams.append('qdc', 'true');
  }

  try {
    const res = await fetch(url.toString(), {
      headers: {
        Accept: 'application/json',
        'x-auth-token': accessToken,
        'x-client-id': process.env.QF_CLIENT_ID!,
      },
      next: { revalidate: 0 },
    });

    if (!res.ok) {
      console.error(`[qf-api] Failed to fetch user profile. Status: ${res.status}`);
      return null;
    }

    // Tip: You can replace `Record<string, unknown>` with a specific interface
    // once you map out the exact profile payload you need from QF.
    const json = (await res.json()) as QfUserProfileResponse;
    return json.data ?? null;
  } catch (e) {
    console.error('[qf-api] Network error fetching user profile:', e);
    return null;
  }
}
