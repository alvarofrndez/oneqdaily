import type { Metadata } from 'next';
import Link from 'next/link';
import ForgotPasswordForm from '@/src/features/auth/components/ForgotPasswordForm';
import styles from '@/src/features/auth/components/auth-page.module.scss';
import { getLocale, getTranslations } from 'next-intl/server';
import { buildMetadata } from '@/lib/seo/metadata';

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = await getTranslations('Auth.ForgotPassword');

  return buildMetadata({
    locale,
    path: '/forgot-password',
    title: t('title'),
    description: t('description'),
    noIndex: true,
  });
}

type ForgotPasswordPageProps = {
  searchParams: Promise<{
    email?: string;
  }>;
};

export default async function ForgotPasswordPage({
  searchParams,
}: ForgotPasswordPageProps) {
  const t = await getTranslations('Auth.ForgotPassword');
  const { email } = await searchParams;

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>{t('title')}</h1>
        <p className={styles.subtitle}>{t('description')}</p>

        <ForgotPasswordForm email={email ?? ''} />

        <p className={styles.footer}>
          <Link href="/login" className={styles.link}>
            {t('backToLogin')}
          </Link>
        </p>
      </div>
    </main>
  );
}