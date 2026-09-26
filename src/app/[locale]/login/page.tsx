import type { Metadata } from 'next';
import Link from 'next/link';
import LoginForm from '@/src/features/auth/components/LoginForm';
import OAuthButtons from '@/src/features/auth/components/OAuthButtons';
import styles from '@/src/features/auth/components/auth-page.module.scss';
import { getLocale, getTranslations } from 'next-intl/server';
import { buildMetadata } from '@/lib/seo/metadata';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations('Auth.Login');

  return buildMetadata({
    locale,
    path: '/login',
    title: t('title'),
    description: t('title'),
    noIndex: true,
  });
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ passwordUpdated?: string }>;
}) {
  const t = await getTranslations('Auth.Login');
  const { passwordUpdated } = await searchParams;

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>{t('title')}</h1>

        {passwordUpdated && (
          <p role="status" className={styles.success}>{t('passwordUpdated')}</p>
        )}

        <OAuthButtons />
        <div className={styles.divider}>{t('orEmail')}</div>
        <LoginForm />
        <p className={styles.footer}>
          {t('noAccount')}{' '}
          <Link href="/signup" className={styles.link}>{t('signupLink')}</Link>
        </p>
      </div>
    </main>
  );
}