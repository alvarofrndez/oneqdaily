import Link from 'next/link';
import { useTranslations } from 'next-intl';
import LoginForm from '@/src/features/auth/components/LoginForm';
import OAuthButtons from '@/src/features/auth/components/OAuthButtons';
import styles from '@/src/features/auth/components/auth-page.module.scss';

export default function LoginPage() {
  const t = useTranslations('Auth.Login');

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>{t('title')}</h1>
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