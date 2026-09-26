import type { Metadata } from 'next';
import Link from 'next/link';
import { getLocale, getTranslations } from 'next-intl/server';
import styles from '@/src/features/auth/components/auth-page.module.scss';
import { buildMetadata } from '@/lib/seo/metadata';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations('Auth.Error');

  return buildMetadata({
    locale,
    path: '/auth/auth-error',
    title: t('title'),
    description: t('description'),
    noIndex: true,
  });
}

export default async function AuthErrorPage() {
  const t = await getTranslations('Auth.Error');

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>{t('title')}</h1>
        <p className={styles.subtitle}>{t('description')}</p>
        <p className={styles.footer}>
          <Link href="/login" className={styles.link}>{t('backToLogin')}</Link>
        </p>
      </div>
    </main>
  );
}