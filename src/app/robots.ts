import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo/config';

export default function robots(): MetadataRoute.Robots {
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