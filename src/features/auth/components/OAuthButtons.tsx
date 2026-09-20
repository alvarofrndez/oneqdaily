'use client';

import { useTranslations } from 'next-intl';
import { signInWithGoogle, signInWithGithub } from '../actions';
import styles from './oauth-buttons.module.scss';

export default function OAuthButtons() {
  const t = useTranslations('Auth.OAuth');

  return (
    <div className={styles.oauth}>
      <form action={signInWithGoogle}>
        <button type="submit" className={styles.button}>{t('google')}</button>
      </form>
      <form action={signInWithGithub}>
        <button type="submit" className={styles.button}>{t('github')}</button>
      </form>
    </div>
  );
}