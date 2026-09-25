import Link from 'next/link';
import LoginForm from '@/src/features/auth/components/LoginForm';
import OAuthButtons from '@/src/features/auth/components/OAuthButtons';
import styles from '@/src/features/auth/components/auth-page.module.scss';
import { getTranslations } from 'next-intl/server';

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