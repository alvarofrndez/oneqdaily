'use client';

import { useActionState } from 'react';
import { useTranslations } from 'next-intl';
import { signInWithEmail } from '../actions';
import styles from './auth-form.module.scss';

const initialState: { error?: string } = {};

export default function LoginForm() {
  const t = useTranslations('Auth.Login');
  const [state, formAction, pending] = useActionState(
    async (_prev: typeof initialState, formData: FormData) => {
      const result = await signInWithEmail(formData);
      return { error: result?.error };
    },
    initialState
  );

  return (
    <form action={formAction} className={styles.form}>
      <div className={styles.field}>
        <label htmlFor="email" className={styles.label}>{t('email')}</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className={styles.input}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor="password" className={styles.label}>{t('password')}</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={styles.input}
        />
      </div>
      {state.error && <p role="alert" className={styles.error}>{state.error}</p>}
      <button type="submit" disabled={pending} className={styles.submit}>
        {pending ? t('submitting') : t('submit')}
      </button>
    </form>
  );
}