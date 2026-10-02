'use server';

import { fetchQfUserProfile } from '@/lib/qf-api';

/**
 * Server Action to securely fetch the user profile from the client.
 * We pass `true` to include QDC data (like photoUrl and username).
 */
export async function getUserProfileAction(userId: string) {
  return await fetchQfUserProfile(userId, true);
}
