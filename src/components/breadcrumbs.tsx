'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { ChevronRight } from 'lucide-react';

import styles from './breadcrumbs.module.scss';

type CrumbKey =
  | 'home'
  | 'questions'
  | 'question'
  | 'answered'
  | 'answer'
  | 'profile'
  | 'about'
  | 'howItWorks'
  | 'faq'
  | 'privacy'
  | 'terms';

type Crumb = { key: CrumbKey; href?: string };

const HOME: Crumb = { key: 'home', href: '/' };
const QUESTIONS: Crumb = { key: 'questions', href: '/questions' };

/**
 * Tabla de rutas (sin prefijo de idioma).
 * El último elemento de cada trail es la página actual y no lleva enlace.
 * El orden importa: `/questions/answered` debe ir antes que `/questions/[id]`.
 */
const ROUTES: { pattern: RegExp; trail: Crumb[] }[] = [
  { pattern: /^\/questions$/, trail: [HOME, { key: 'questions' }] },
  { pattern: /^\/questions\/answered$/, trail: [HOME, QUESTIONS, { key: 'answered' }] },
  { pattern: /^\/questions\/[^/]+$/, trail: [HOME, QUESTIONS, { key: 'question' }] },
  { pattern: /^\/answers\/[^/]+$/, trail: [HOME, { key: 'answer' }] },
  { pattern: /^\/profile$/, trail: [HOME, { key: 'profile' }] },
  { pattern: /^\/about$/, trail: [HOME, { key: 'about' }] },
  { pattern: /^\/how-it-works$/, trail: [HOME, { key: 'howItWorks' }] },
  { pattern: /^\/faq$/, trail: [HOME, { key: 'faq' }] },
  { pattern: /^\/privacy$/, trail: [HOME, { key: 'privacy' }] },
  { pattern: /^\/terms$/, trail: [HOME, { key: 'terms' }] },
];

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
  const trail = ROUTES.find(({ pattern }) => pattern.test(path))?.trail;

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