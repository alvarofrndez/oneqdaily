import Link from 'next/link';
import { useTranslations } from 'next-intl';
import SignupForm from '@/src/features/auth/components/SignupForm';
import OAuthButtons from '@/src/features/auth/components/OAuthButtons';
import styles from '@/src/features/auth/components/auth-page.module.scss';

export default function SignupPage() {
  const t = useTranslations('Auth.Signup');

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