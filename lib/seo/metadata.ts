import type { Metadata } from 'next';
import { routing } from '@/i18n/routing';
import { SITE_URL, SITE_NAME, X_HANDLE, DEFAULT_OG_IMAGE } from './config';

type BuildMetadataInput = {
  locale: string;
  path: string;
  title: string;
  description: string;
  ogImage?: string;
  noIndex?: boolean;
  useAbsoluteTitle?: boolean;
};

export function buildMetadata({
  locale,
  path,
  title,
  description,
  ogImage,
  noIndex = false,
  useAbsoluteTitle = false,
}: BuildMetadataInput): Metadata {
  const normalizedPath = path === '/' ? '' : path;
  const canonical = `${SITE_URL}/${locale}${normalizedPath}`;
  const image = ogImage ?? DEFAULT_OG_IMAGE;

  const languages = Object.fromEntries(
    routing.locales.map((loc) => [loc, `${SITE_URL}/${loc}${normalizedPath}`])
  );

  return {
    title: useAbsoluteTitle ? { absolute: title } : title,
    description,
    alternates: {
      canonical,
      languages: {
        ...languages,
        'x-default': `${SITE_URL}/${routing.defaultLocale}${normalizedPath}`,
      },
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      locale,
      type: 'website',
      images: [{ url: image, width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      site: X_HANDLE,
      images: [image],
    },
  };
}