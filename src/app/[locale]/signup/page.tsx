import Link from 'next/link';
import SignupForm from '@/src/features/auth/components/SignupForm';
import OAuthButtons from '@/src/features/auth/components/OAuthButtons';
import styles from '@/src/features/auth/components/auth-page.module.scss';
import { buildMetadata } from '@/lib/seo/metadata';
import { getLocale, getTranslations } from 'next-intl/server';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations('Auth.Signup');

  return buildMetadata({
    locale,
    path: '/signup',
    title: t('title'),
    description: t('title'),
    noIndex: true,
  });
}

export default async function SignupPage() {
  const t = await getTranslations('Auth.Signup');

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>{t('title')}</h1>
        <OAuthButtons />
        <div className={styles.divider}>{t('orEmail')}</div>
        <SignupForm />
        <p className={styles.footer}>
          {t('hasAccount')}{' '}
          <Link href="/login" className={styles.link}>{t('loginLink')}</Link>
        </p>
      </div>
    </main>
  );
}