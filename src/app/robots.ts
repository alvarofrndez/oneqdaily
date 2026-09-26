import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo/config';
import { SITE_MODE } from '@/config/site';

export default function robots(): MetadataRoute.Robots {
  if (SITE_MODE !== 'live') {
    return {
      rules: [{ userAgent: '*', disallow: '/' }],
    };
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/*/login',
          '/*/signup',
          '/*/forgot-password',
          '/*/reset-password',
          '/*/profile',
          '/*/questions/answered',
          '/*/auth/',
          '/*/maintenance',
          '/*/launch',
          '/api/',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}