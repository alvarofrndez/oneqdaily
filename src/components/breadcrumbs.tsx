'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { ChevronRight } from 'lucide-react';

import styles from './breadcrumbs.module.scss';
import { getBreadcrumbTrail } from '@/lib/seo/breadcrumb-routes';

function getPathWithoutLocale(pathname: string, locale: string) {
  const prefix = `/${locale}`;

  const path =
    pathname === prefix || pathname.startsWith(`${prefix}/`)
      ? pathname.slice(prefix.length)
      : pathname;

  return path.replace(/\/+$/, '') || '/';
}

export default function Breadcrumbs() {
  const t = useTranslations('Breadcrumbs');
  const locale = useLocale();
  const pathname = usePathname();

  const path = getPathWithoutLocale(pathname, locale);
  const trail = getBreadcrumbTrail(path);

  if (!trail) return null;

  const localize = (href: string) =>
    href === '/' ? `/${locale}` : `/${locale}${href}`;

  return (
    <nav aria-label={t('label')} className={styles.breadcrumbs}>
      <ol className={styles.list}>
        {trail.map((crumb, index) => {
          const isLast = index === trail.length - 1;

          return (
            <li key={crumb.key} className={styles.item}>
              {isLast || !crumb.href ? (
                <span
                  className={styles.current}
                  aria-current={isLast ? 'page' : undefined}
                >
                  {t(crumb.key)}
                </span>
              ) : (
                <Link href={localize(crumb.href)} className={styles.link}>
                  {t(crumb.key)}
                </Link>
              )}

              {!isLast && (
                <ChevronRight
                  size={12}
                  strokeWidth={1.8}
                  aria-hidden="true"
                  className={styles.separator}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}