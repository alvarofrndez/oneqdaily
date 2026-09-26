import type { MetadataRoute } from 'next';
import { SITE_NAME } from '@/lib/seo/config';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: 'OneQDaily',
    description: 'One question. Everyone. Every day.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#fa740f',
    icons: [{ src: '/logo-light.svg', sizes: 'any', type: 'image/svg+xml' }],
  };
}