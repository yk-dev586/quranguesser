export const IS_PRODUCTION = process.env.QF_ENVIRONMENT === 'production';

export const QF_OAUTH2_BASE = IS_PRODUCTION
  ? 'https://oauth2.quran.foundation'
  : 'https://prelive-oauth2.quran.foundation';

export const QF_USER_API_BASE = IS_PRODUCTION
  ? 'https://apis.quran.foundation/auth'
  : 'https://apis-prelive.quran.foundation/auth';

/** Buffer in seconds — refresh the token this far before actual expiry. */
export const REFRESH_BUFFER_SECONDS = 60;
