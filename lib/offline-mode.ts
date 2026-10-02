/**
 * QuranGuessr practice mode switch. Online mode is the default; set
 * NEXT_PUBLIC_OFFLINE_MODE=true only when you deliberately want to hide the
 * server-backed leaderboard/profile surfaces.
 */
export const OFFLINE_MODE = process.env.NEXT_PUBLIC_OFFLINE_MODE === 'true';
