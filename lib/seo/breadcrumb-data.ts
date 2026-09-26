// lib/seo/breadcrumb-data.ts
import { getTranslations } from 'next-intl/server';
import { SITE_URL } from './config';
import { breadcrumbJsonLd } from './json-ld';
import { getBreadcrumbTrail } from './breadcrumb-routes';

export async function buildBreadcrumbJsonLd(locale: string, currentPath: string) {
  const trail = getBreadcrumbTrail(currentPath);

  if (!trail) return null;

  const t = await getTranslations({ locale, namespace: 'Breadcrumbs' });

  return breadcrumbJsonLd(
    trail.map((crumb, index) => {
      const isLast = index === trail.length - 1;
      const href = crumb.href ?? (isLast ? currentPath : '/');

      return {
        name: t(crumb.key),
        url: `${SITE_URL}/${locale}${href === '/' ? '' : href}`,
      };
    })
  );
}