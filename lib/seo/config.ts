export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://oneqdaily.com'
).replace(/\/$/, '');

export const SITE_NAME = 'One question daily';
export const X_HANDLE = '@oneqdaily';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-default.png`;